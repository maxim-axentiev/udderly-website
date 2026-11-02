import type { ConsentChoice } from './model'

const ANALYTICS_ID = /^G-[A-Z0-9]{4,}$/
const ADS_ID = /^AW-[0-9]{4,}$/
const TRACKING_ATTR = 'data-optional-tracking'
const HISTORY_MARK = Symbol('udderly-consent-history')

export type TrackingConfig = {
  analyticsId?: string
  adsId?: string
}

export type TrackingPlan = {
  externalSrc?: string
  inline?: string
}

type Gtag = (...args: unknown[]) => void

export type TrackingScript = HTMLScriptElement & { text?: string }

export type TrackingDom = {
  createElement: (tag: 'script') => TrackingScript
  head: {
    appendChild: (node: TrackingScript) => void
    querySelectorAll: (selector: string) => ArrayLike<Element>
  }
}

export type CookieAccess = {
  read: () => string
  write: (value: string) => void
}

export type TrackingHost = {
  gtag?: Gtag
  dataLayer: unknown[]
  flags: Record<string, unknown>
}

type HistoryHost = {
  pushState: (...args: unknown[]) => unknown
  replaceState: (...args: unknown[]) => unknown
}

type Marked = ((...args: unknown[]) => unknown) & { [HISTORY_MARK]?: boolean }

type Navigation = {
  history: HistoryHost
  addEventListener?: (type: 'popstate', listener: () => void) => void
  removeEventListener?: (type: 'popstate', listener: () => void) => void
}

export function readTrackingConfig(env: {
  PUBLIC_GA_MEASUREMENT_ID?: string
  PUBLIC_GOOGLE_ADS_ID?: string
}): TrackingConfig {
  const analyticsId = validId(env.PUBLIC_GA_MEASUREMENT_ID, ANALYTICS_ID)
  const adsId = validId(env.PUBLIC_GOOGLE_ADS_ID, ADS_ID)
  return {
    ...(analyticsId ? { analyticsId } : {}),
    ...(adsId ? { adsId } : {}),
  }
}

export function currentTrackingConfig(): TrackingConfig {
  return readTrackingConfig(import.meta.env)
}

/** Optional tags are omitted until that category is true and a real ID is configured. */
export function planOptionalTracking(choice: ConsentChoice | null, config: TrackingConfig): TrackingPlan {
  const analyticsId = choice?.analytics ? config.analyticsId : undefined
  const adsId = choice?.advertising ? config.adsId : undefined
  if (!analyticsId && !adsId) return {}
  return {
    externalSrc: `https://www.googletagmanager.com/gtag/js?id=${analyticsId ?? adsId}`,
    inline: inlineConfig(analyticsId, adsId),
  }
}

export function browserTrackingHost(): TrackingHost {
  const page = window as unknown as Window & { gtag?: Gtag; dataLayer?: unknown[] } & Record<string, unknown>
  if (!Array.isArray(page.dataLayer)) page.dataLayer = []
  return {
    get gtag() {
      return page.gtag
    },
    set gtag(value) {
      page.gtag = value
    },
    dataLayer: page.dataLayer,
    flags: page,
  }
}

export function browserCookieAccess(): CookieAccess {
  return {
    read: () => document.cookie,
    write: (value) => {
      document.cookie = value
    },
  }
}

export function createTrackingSession() {
  const configured = new Set<string>()
  let currentChoice: ConsentChoice | null = null
  let currentConfig: TrackingConfig = {}
  let dom: TrackingDom | null = null
  let host: TrackingHost | null = null
  let cookies: CookieAccess | null = null
  let guarded: Gtag | undefined
  let navigation: Navigation | null = null
  let savedPush: HistoryHost['pushState'] | null = null
  let savedReplace: HistoryHost['replaceState'] | null = null
  let onPop: (() => void) | null = null
  let applied = false
  let initialized = false

  function sync(
    choice: ConsentChoice | null,
    config: TrackingConfig,
    target: TrackingDom,
    runtime: TrackingHost,
    cookieAccess: CookieAccess | null = null,
  ) {
    const choiceChanged = !initialized || choice !== currentChoice || config !== currentConfig
    initialized = true
    const libraryReplaced = Boolean(runtime.gtag && runtime.gtag !== guarded)
    currentChoice = choice
    currentConfig = config
    dom = target
    host = runtime
    cookies = cookieAccess
    const analyticsOn = Boolean(choice?.analytics && config.analyticsId)
    const adsOn = Boolean(choice?.advertising && config.adsId)

    if (config.analyticsId) runtime.flags[`ga-disable-${config.analyticsId}`] = !analyticsOn
    if (config.adsId) runtime.flags[`ga-disable-${config.adsId}`] = !adsOn
    wrap(runtime)
    dropQueuedMeasurement(runtime.dataLayer, choice, config)

    const measuring = analyticsOn || adsOn || configured.size > 0
    if (measuring && (!applied || choiceChanged || libraryReplaced)) {
      runtime.gtag?.('consent', 'update', consentUpdate(analyticsOn, adsOn))
      for (const id of configured) {
        const stillOn = (id === config.analyticsId && analyticsOn) || (id === config.adsId && adsOn)
        if (!stillOn) runtime.gtag?.('config', id, { send_page_view: false })
      }
      const pending = [analyticsOn ? config.analyticsId : undefined, adsOn ? config.adsId : undefined].filter(
        (id): id is string => typeof id === 'string' && !configured.has(id),
      )
      if (pending.length > 0) {
        ensureLoader(target, pending[0] ?? '')
        runtime.gtag?.('js', new Date())
        for (const id of pending) {
          runtime.gtag?.('config', id)
          configured.add(id)
        }
      }
      applied = true
    }

    if (cookieAccess && choiceChanged) {
      for (const write of expireVisibleGoogleCookies(cookieAccess.read(), {
        analytics: !choice?.analytics,
        advertising: !choice?.advertising,
      })) {
        cookieAccess.write(write)
      }
    }
    installHistory()
  }

  function watchNavigations(next: Navigation) {
    navigation = next
    installHistory()
  }

  function stopWatching() {
    if (navigation && savedPush && savedReplace) {
      navigation.history.pushState = savedPush
      navigation.history.replaceState = savedReplace
    }
    if (navigation && onPop) navigation.removeEventListener?.('popstate', onPop)
    navigation = null
    savedPush = null
    savedReplace = null
    onPop = null
  }

  function installHistory() {
    if (!navigation || !host || !dom) return
    const history = navigation.history
    const push = history.pushState as Marked
    const replace = history.replaceState as Marked
    if (!push[HISTORY_MARK]) {
      savedPush = history.pushState
      const call = savedPush.bind(history)
      const wrappedPush: Marked = (...args) => {
        const result = call(...args)
        reassert()
        return result
      }
      wrappedPush[HISTORY_MARK] = true
      history.pushState = wrappedPush
    }
    if (!replace[HISTORY_MARK]) {
      savedReplace = history.replaceState
      const call = savedReplace.bind(history)
      const wrappedReplace: Marked = (...args) => {
        const result = call(...args)
        reassert()
        return result
      }
      wrappedReplace[HISTORY_MARK] = true
      history.replaceState = wrappedReplace
    }
    if (!onPop && navigation.addEventListener) {
      onPop = () => reassert()
      navigation.addEventListener('popstate', onPop)
    }
  }

  function reassert() {
    if (!host || !dom) return
    sync(currentChoice, currentConfig, dom, host, cookies)
  }

  function wrap(runtime: TrackingHost) {
    if (runtime.gtag && runtime.gtag === guarded) return
    const inner = runtime.gtag ?? ((...args: unknown[]) => {
      runtime.dataLayer.push(args)
    })
    const next: Gtag = (...args) => {
      if (!allowCommand(args, currentChoice, currentConfig)) return undefined
      return inner(...args)
    }
    guarded = next
    runtime.gtag = next
  }

  function ensureLoader(target: TrackingDom, loaderId: string) {
    const existing = Array.from(target.head.querySelectorAll(`script[${TRACKING_ATTR}]`))
    if (existing.length > 0) return
    const script = target.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${loaderId}`
    script.setAttribute(TRACKING_ATTR, 'true')
    script.addEventListener?.('load', () => {
      if (!host || !dom) return
      sync(currentChoice, currentConfig, dom, host, cookies)
    })
    target.head.appendChild(script)
  }

  return { sync, watchNavigations, stopWatching }
}

/** Expires first-party Google cookies this page can see. Other Google cookies can remain. */
export function expireVisibleGoogleCookies(
  cookie: string,
  categories: { analytics: boolean; advertising: boolean },
): string[] {
  const writes: string[] = []
  for (const part of cookie.split(';')) {
    const name = part.trim().split('=')[0] ?? ''
    if (!name) continue
    const analyticsCookie = name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_') || name.startsWith('_gat_')
    const advertisingCookie = name.startsWith('_gcl_')
    if ((categories.analytics && analyticsCookie) || (categories.advertising && advertisingCookie)) {
      writes.push(`${name}=; Max-Age=0; path=/`)
    }
  }
  return writes
}

export function inertOutside(parent: { children: ArrayLike<unknown> }, keep: unknown): Array<{ removeAttribute: (name: string) => void }> {
  const changed: Array<{ removeAttribute: (name: string) => void }> = []
  for (const child of Array.from(parent.children)) {
    if (child === keep || !hasAttributes(child) || child.hasAttribute('inert')) continue
    child.setAttribute('inert', '')
    changed.push(child)
  }
  return changed
}

export function releaseInert(elements: readonly { removeAttribute: (name: string) => void }[]) {
  for (const element of elements) element.removeAttribute('inert')
}

function hasAttributes(value: unknown): value is {
  hasAttribute: (name: string) => boolean
  setAttribute: (name: string, next: string) => void
  removeAttribute: (name: string) => void
} {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return typeof record.hasAttribute === 'function' && typeof record.setAttribute === 'function' && typeof record.removeAttribute === 'function'
}

function validId(value: string | undefined, pattern: RegExp): string | undefined {
  const trimmed = value?.trim() ?? ''
  return pattern.test(trimmed) ? trimmed : undefined
}

function inlineConfig(analyticsId?: string, adsId?: string): string {
  const update = consentUpdate(Boolean(analyticsId), Boolean(adsId))
  const configs = [analyticsId, adsId].filter((id): id is string => Boolean(id)).map((id) => `gtag('config','${id}');`).join('')
  return [
    'window.dataLayer=window.dataLayer||[];',
    'function gtag(){dataLayer.push(arguments);}',
    "gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});",
    `gtag('consent','update',{analytics_storage:'${update.analytics_storage}',ad_storage:'${update.ad_storage}',ad_user_data:'${update.ad_user_data}',ad_personalization:'denied'});`,
    "gtag('js',new Date());",
    configs,
  ].join('')
}

function consentUpdate(analytics: boolean, advertising: boolean) {
  return {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: advertising ? 'granted' : 'denied',
    ad_user_data: advertising ? 'granted' : 'denied',
    ad_personalization: 'denied' as const,
  }
}

function allowCommand(args: unknown[], choice: ConsentChoice | null, config: TrackingConfig): boolean {
  const command = args[0]
  if (command === 'consent' || command === 'js' || command === 'set' || command === 'get') return true
  const analyticsOn = Boolean(choice?.analytics && config.analyticsId)
  const adsOn = Boolean(choice?.advertising && config.adsId)
  if (command === 'config') {
    const id = args[1]
    const shutdown = isShutdown(args[2])
    if (id === config.analyticsId) return analyticsOn || shutdown
    if (id === config.adsId) return adsOn || shutdown
    return false
  }
  if (command === 'event') {
    if (args[1] === 'conversion') return adsOn
    return analyticsOn
  }
  return false
}

function isShutdown(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return record.send_page_view === false && Object.keys(record).length === 1
}

function dropQueuedMeasurement(dataLayer: unknown[], choice: ConsentChoice | null, config: TrackingConfig) {
  for (let index = dataLayer.length - 1; index >= 0; index -= 1) {
    const entry = dataLayer[index]
    const args = Array.isArray(entry) ? entry : []
    if (args.length > 0 && !allowCommand(args, choice, config)) dataLayer.splice(index, 1)
  }
}
