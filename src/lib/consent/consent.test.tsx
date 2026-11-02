import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { ConsentBanner, ConsentPreferences } from '@/components/consent/consent-banner'
import { ConsentManager } from '@/components/consent/consent-manager'
import {
  acceptAll,
  parseStoredConsent,
  rejectOptional,
  savePreferences,
} from '@/lib/consent/model'
import { CONSENT_STORAGE_KEY, readStoredConsent, writeStoredConsent } from '@/lib/consent/storage'
import {
  createTrackingSession,
  currentTrackingConfig,
  expireVisibleGoogleCookies,
  inertOutside,
  planOptionalTracking,
  readTrackingConfig,
  releaseInert,
  type TrackingDom,
  type TrackingHost,
  type TrackingScript,
} from '@/lib/consent/tracking'

const ANALYTICS_ID = 'G-TEST1234'
const ADS_ID = 'AW-123456789'
const CONFIGURED = { analyticsId: ANALYTICS_ID, adsId: ADS_ID }

describe('cookie consent', () => {
  it('starts with no optional consent and does not plan tracking before a choice', () => {
    expect(parseStoredConsent(null)).toBeNull()
    expect(parseStoredConsent({ version: 0, analytics: true, advertising: true })).toBeNull()
    expect(planOptionalTracking(null, CONFIGURED)).toEqual({})
    expect(currentTrackingConfig()).toEqual({})
    expect(readTrackingConfig({})).toEqual({})
    expect(readTrackingConfig({
      PUBLIC_GA_MEASUREMENT_ID: 'UA-123',
      PUBLIC_GOOGLE_ADS_ID: 'not-an-id',
    })).toEqual({})

    const html = renderToStaticMarkup(createElement(ConsentManager))
    expect(html).not.toContain('googletagmanager')
    expect(html).not.toContain('gtag(')
  })

  it('accepts all, rejects optional cookies, and saves analytics and advertising separately', () => {
    expect(acceptAll('2026-10-26T00:00:00.000Z')).toEqual({
      version: 1,
      analytics: true,
      advertising: true,
      decidedAt: '2026-10-26T00:00:00.000Z',
    })
    expect(rejectOptional('2026-10-26T00:00:00.000Z')).toMatchObject({
      analytics: false,
      advertising: false,
    })
    expect(savePreferences(true, false, '2026-10-26T00:00:00.000Z')).toMatchObject({
      analytics: true,
      advertising: false,
    })

    const accepted = planOptionalTracking(acceptAll('now'), CONFIGURED)
    expect(accepted.externalSrc).toBe(`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`)
    expect(accepted.inline).toContain(`gtag('config','${ANALYTICS_ID}')`)
    expect(accepted.inline).toContain(`gtag('config','${ADS_ID}')`)
    expect(accepted.inline).toContain("ad_personalization:'denied'")

    const analyticsOnly = planOptionalTracking(savePreferences(true, false, 'now'), CONFIGURED)
    expect(analyticsOnly.externalSrc).toContain(ANALYTICS_ID)
    expect(analyticsOnly.inline).toContain(`gtag('config','${ANALYTICS_ID}')`)
    expect(analyticsOnly.inline).not.toContain(ADS_ID)
    expect(analyticsOnly.inline).toContain("ad_storage:'denied'")

    const adsOnly = planOptionalTracking(savePreferences(false, true, 'now'), CONFIGURED)
    expect(adsOnly.externalSrc).toContain(ADS_ID)
    expect(adsOnly.inline).toContain(`gtag('config','${ADS_ID}')`)
    expect(adsOnly.inline).not.toContain(ANALYTICS_ID)

    expect(planOptionalTracking(rejectOptional('now'), CONFIGURED)).toEqual({})
    expect(planOptionalTracking(acceptAll('now'), {})).toEqual({})
  })

  it('persists a choice and lets a later rejection withdraw it', () => {
    const storage = memoryStorage()
    const accepted = acceptAll('2026-10-26T00:00:00.000Z')
    expect(writeStoredConsent(storage, accepted)).toBe(true)
    expect(readStoredConsent(storage)).toEqual(accepted)

    const withdrawn = rejectOptional('2026-10-26T01:00:00.000Z')
    expect(writeStoredConsent(storage, withdrawn)).toBe(true)
    expect(readStoredConsent(storage)).toEqual(withdrawn)
    expect(planOptionalTracking(readStoredConsent(storage), CONFIGURED)).toEqual({})
    expect(storage.getItem(CONSENT_STORAGE_KEY)).toContain('"advertising":false')
  })

  it('keeps optional tracking off when storage is unavailable or the saved value is unusable', () => {
    expect(readStoredConsent(null)).toBeNull()
    expect(writeStoredConsent(null, acceptAll('now'))).toBe(false)
    expect(readStoredConsent(brokenStorage())).toBeNull()
    expect(writeStoredConsent(brokenStorage(), acceptAll('now'))).toBe(false)
    expect(readStoredConsent(memoryStorage('{"analytics":true}'))).toBeNull()
    expect(planOptionalTracking(readStoredConsent(null), CONFIGURED)).toEqual({})
  })

  it('does not load a tag before consent, and withdrawal stops later page views', () => {
    const session = createTrackingSession()
    const page = trackingPage()
    session.sync(null, CONFIGURED, page.dom, page.host)
    expect(page.scripts).toEqual([])
    expect(page.host.dataLayer).toEqual([])

    session.sync(acceptAll('now'), CONFIGURED, page.dom, page.host)
    expect(page.scripts.map((script) => script.src)).toEqual([
      `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`,
    ])
    page.host.dataLayer.push(['event', 'page_view'])
    page.host.dataLayer.push(['config', ANALYTICS_ID])
    page.activateLibrary()

    session.sync(rejectOptional('later'), CONFIGURED, page.dom, page.host)
    expect(page.host.dataLayer.filter((entry) => Array.isArray(entry) && entry[0] === 'event')).toEqual([])
    expect(page.host.dataLayer.filter((entry) => Array.isArray(entry) && entry[0] === 'config' && !isShutdown(entry[2]))).toEqual([])
    expect(page.host.flags[`ga-disable-${ANALYTICS_ID}`]).toBe(true)
    expect(page.host.flags[`ga-disable-${ADS_ID}`]).toBe(true)
    expect(page.seen).toContainEqual([
      'consent',
      'update',
      expect.objectContaining({ analytics_storage: 'denied', ad_storage: 'denied', ad_personalization: 'denied' }),
    ])
    page.host.gtag?.('event', 'page_view')
    page.host.gtag?.('event', 'conversion')
    expect(page.seen.filter((command) => command[0] === 'event')).toEqual([])

    const history = clientHistory()
    session.watchNavigations(history.navigation)
    const replaced = (...args: unknown[]) => {
      page.seen.push(['replaced', ...args])
    }
    page.host.gtag = replaced
    history.navigation.history.pushState({}, '', '/next')
    history.pop()
    page.host.gtag?.('event', 'page_view')
    expect(page.seen.some((command) => command.includes('page_view'))).toBe(false)
    expect(page.seen.filter((command) => command[0] === 'config' && !isShutdown(command[2]))).toEqual([])
    expect(page.seen).toContainEqual([
      'replaced',
      'consent',
      'update',
      expect.objectContaining({ analytics_storage: 'denied', ad_storage: 'denied' }),
    ])
  })

  it('keeps a withdrawn category from staying active through the other category', () => {
    const session = createTrackingSession()
    const page = trackingPage()
    let adsDisabledBeforeScript = false
    page.onAppend = () => {
      adsDisabledBeforeScript = page.host.flags[`ga-disable-${ADS_ID}`] === true
    }
    session.sync(savePreferences(true, false, 'now'), CONFIGURED, page.dom, page.host)
    expect(adsDisabledBeforeScript).toBe(true)
    expect(page.host.flags[`ga-disable-${ANALYTICS_ID}`]).toBe(false)
    expect(page.scripts[0]?.src).toContain(ANALYTICS_ID)
    expect(page.scripts[0]?.src).not.toContain(ADS_ID)
    expect(configuredIds(page.host.dataLayer)).toEqual([ANALYTICS_ID])

    page.activateLibrary()
    session.sync(acceptAll('next'), CONFIGURED, page.dom, page.host)
    session.sync(savePreferences(true, false, 'withdraw-ads'), CONFIGURED, page.dom, page.host)
    expect(page.host.flags[`ga-disable-${ADS_ID}`]).toBe(true)
    expect(page.host.flags[`ga-disable-${ANALYTICS_ID}`]).toBe(false)
    expect(page.seen).toContainEqual([
      'consent',
      'update',
      expect.objectContaining({ analytics_storage: 'granted', ad_storage: 'denied' }),
    ])
    page.host.gtag?.('event', 'page_view')
    page.host.gtag?.('event', 'conversion')
    expect(page.seen.filter((command) => command[0] === 'event')).toEqual([['event', 'page_view']])
    const adsCommands = page.seen.filter((command) => command[0] === 'config' && command[1] === ADS_ID)
    expect(adsCommands.at(-1)).toEqual(['config', ADS_ID, { send_page_view: false }])
    expect(page.seen.filter((command) => command[0] === 'config' && command[1] === ANALYTICS_ID)).toEqual([])

    const adsOnly = createTrackingSession()
    const adsPage = trackingPage()
    let analyticsDisabledBeforeScript = false
    adsPage.onAppend = () => {
      analyticsDisabledBeforeScript = adsPage.host.flags[`ga-disable-${ANALYTICS_ID}`] === true
    }
    adsOnly.sync(savePreferences(false, true, 'ads'), CONFIGURED, adsPage.dom, adsPage.host)
    expect(analyticsDisabledBeforeScript).toBe(true)
    expect(adsPage.scripts[0]?.src).toContain(ADS_ID)
    expect(configuredIds(adsPage.host.dataLayer)).toEqual([ADS_ID])
    adsPage.activateLibrary()
    adsPage.host.gtag?.('event', 'page_view')
    adsPage.host.gtag?.('event', 'conversion')
    expect(adsPage.seen.filter((command) => command[0] === 'event')).toEqual([['event', 'conversion']])
  })

  it('expires only the visible Google cookies for a withdrawn category', () => {
    const existing = '_ga=1; _ga_ABC=1; _gid=1; _gcl_au=1; farm_session=keep; _garden=1'
    expect(expireVisibleGoogleCookies(existing, { analytics: true, advertising: false })).toEqual([
      '_ga=; Max-Age=0; path=/',
      '_ga_ABC=; Max-Age=0; path=/',
      '_gid=; Max-Age=0; path=/',
    ])
    expect(expireVisibleGoogleCookies(existing, { analytics: false, advertising: true })).toEqual([
      '_gcl_au=; Max-Age=0; path=/',
    ])

    const session = createTrackingSession()
    const page = trackingPage()
    const jar = cookieJar(existing)
    session.sync(acceptAll('now'), CONFIGURED, page.dom, page.host, jar.access)
    expect(jar.names()).toEqual(['_ga', '_ga_ABC', '_gid', '_gcl_au', 'farm_session', '_garden'])
    session.sync(savePreferences(true, false, 'later'), CONFIGURED, page.dom, page.host, jar.access)
    expect(jar.names()).toEqual(['_ga', '_ga_ABC', '_gid', 'farm_session', '_garden'])

    const leftover = cookieJar(existing)
    createTrackingSession().sync(null, CONFIGURED, trackingPage().dom, trackingPage().host, leftover.access)
    expect(leftover.names()).toEqual(['farm_session', '_garden'])
  })

  it('remembers a partial choice after a reload and keeps the other category off', () => {
    const storage = memoryStorage()
    const choice = savePreferences(false, true, '2026-10-26T00:00:00.000Z')
    expect(writeStoredConsent(storage, choice)).toBe(true)
    const reloaded = readStoredConsent(storage)
    expect(reloaded).toEqual(choice)
    const plan = planOptionalTracking(reloaded, CONFIGURED)
    expect(plan.externalSrc).toContain(ADS_ID)
    expect(plan.inline).toContain(`gtag('config','${ADS_ID}')`)
    expect(plan.inline).not.toContain(ANALYTICS_ID)
  })

  it('keeps keyboard focus inside cookie preferences by making the rest of the page inert', () => {
    const header = attributeNode()
    const main = attributeNode()
    const consentRoot = attributeNode()
    const alreadyHidden = attributeNode()
    alreadyHidden.setAttribute('inert', '')
    const changed = inertOutside({ children: [header, main, consentRoot, alreadyHidden, { text: 'not an element' }] }, consentRoot)
    expect(changed).not.toContain(alreadyHidden)
    expect(header.hasAttribute('inert')).toBe(true)
    expect(main.hasAttribute('inert')).toBe(true)
    expect(consentRoot.hasAttribute('inert')).toBe(false)
    releaseInert(changed)
    expect(header.hasAttribute('inert')).toBe(false)
    expect(main.hasAttribute('inert')).toBe(false)
  })

  it('shows accept, reject, and separate analytics and advertising choices', () => {
    const banner = renderToStaticMarkup(
      createElement(ConsentBanner, { onAccept() {}, onReject() {}, onCustomize() {} }),
    )
    expect(banner).toContain('Accept all')
    expect(banner).toContain('Reject optional cookies')
    expect(banner).toContain('Customize')
    expect(banner).toContain('href="/cookies-policy"')
    expect(banner).not.toContain('googletagmanager')

    const preferences = renderToStaticMarkup(
      createElement(ConsentPreferences, {
        analytics: true,
        advertising: false,
        onAnalyticsChange() {},
        onAdvertisingChange() {},
        onAccept() {},
        onReject() {},
        onSave() {},
        onClose() {},
      }),
    )
    expect(preferences).toContain('Analytics')
    expect(preferences).toContain('Advertising')
    expect(preferences).toContain('Save preferences')
    expect(preferences).toContain('checked')
    expect(preferences).toContain('Cookie preferences')
    expect(preferences).toContain('may remain until they expire')
    expect(preferences).toContain('tabindex="-1"')
  })
})

function memoryStorage(initial?: string): Storage {
  const values = new Map<string, string>()
  if (initial) values.set(CONSENT_STORAGE_KEY, initial)
  return {
    get length() {
      return values.size
    },
    clear() {
      values.clear()
    },
    getItem(key: string) {
      return values.get(key) ?? null
    },
    key(index: number) {
      return [...values.keys()][index] ?? null
    },
    removeItem(key: string) {
      values.delete(key)
    },
    setItem(key: string, value: string) {
      values.set(key, value)
    },
  }
}

function brokenStorage(): Storage {
  return {
    get length() {
      return 0
    },
    clear() {
      throw new Error('unavailable')
    },
    getItem() {
      throw new Error('unavailable')
    },
    key() {
      return null
    },
    removeItem() {
      throw new Error('unavailable')
    },
    setItem() {
      throw new Error('unavailable')
    },
  }
}

function trackingPage() {
  const seen: unknown[][] = []
  const scripts: Array<TrackingScript & { src: string; load?: () => void }> = []
  let onAppend = () => {}
  const host: TrackingHost = { dataLayer: [], flags: {} }
  const dom: TrackingDom = {
    createElement() {
      const node = {
        src: '',
        async: false,
        text: '',
        setAttribute() {},
        addEventListener(type: string, listener: () => void) {
          if (type === 'load') node.load = listener
        },
        load: undefined as (() => void) | undefined,
      }
      return node as unknown as TrackingScript & { src: string; load?: () => void }
    },
    head: {
      appendChild(node) {
        onAppend()
        scripts.push(node as TrackingScript & { src: string; load?: () => void })
      },
      querySelectorAll() {
        return scripts
      },
    },
  }
  return {
    seen,
    scripts,
    host,
    dom,
    set onAppend(listener: () => void) {
      onAppend = listener
    },
    activateLibrary() {
      const library = (...args: unknown[]) => {
        seen.push(args)
      }
      host.gtag = library
      scripts[0]?.load?.()
    },
  }
}

function configuredIds(dataLayer: unknown[]) {
  return dataLayer.flatMap((entry) => (Array.isArray(entry) && entry[0] === 'config' ? [entry[1]] : []))
}

function isShutdown(value: unknown) {
  return Boolean(value && typeof value === 'object' && (value as { send_page_view?: boolean }).send_page_view === false)
}

function clientHistory() {
  const history: { pushState: (...args: unknown[]) => void; replaceState: (...args: unknown[]) => void } = {
    pushState() {},
    replaceState() {},
  }
  let pop: (() => void) | undefined
  return {
    navigation: {
      history,
      addEventListener(_type: 'popstate', listener: () => void) {
        pop = listener
      },
      removeEventListener() {
        pop = undefined
      },
    },
    pop: () => pop?.(),
  }
}

function cookieJar(initial: string) {
  const values = new Map(initial.split(';').map((part) => {
    const name = part.trim().split('=')[0] ?? ''
    return [name, part.trim()] as const
  }))
  return {
    access: {
      read: () => [...values.values()].join('; '),
      write(value: string) {
        const name = value.split('=')[0] ?? ''
        if (value.includes('Max-Age=0')) values.delete(name)
        else values.set(name, value)
      },
    },
    names: () => [...values.keys()],
  }
}

function attributeNode() {
  const attributes = new Set<string>()
  return {
    hasAttribute: (name: string) => attributes.has(name),
    setAttribute: (name: string, value?: string) => {
      attributes.add(name)
      return value
    },
    removeAttribute: (name: string) => attributes.delete(name),
  }
}
