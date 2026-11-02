import { useEffect, useRef, useState } from 'react'

import { ConsentBanner, ConsentPreferences } from '@/components/consent/consent-banner'
import {
  acceptAll,
  OPEN_CONSENT_EVENT,
  rejectOptional,
  savePreferences,
  type ConsentChoice,
} from '@/lib/consent/model'
import { browserConsentStorage, readStoredConsent, writeStoredConsent } from '@/lib/consent/storage'
import {
  browserCookieAccess,
  browserTrackingHost,
  createTrackingSession,
  currentTrackingConfig,
} from '@/lib/consent/tracking'

const UNSAVED = 'This browser did not save your cookie choice. It applies to this visit only.'

export function ConsentManager() {
  const [ready, setReady] = useState(false)
  const [choice, setChoice] = useState<ConsentChoice | null>(null)
  const [bannerOpen, setBannerOpen] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [advertising, setAdvertising] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const choiceRef = useRef<ConsentChoice | null>(null)
  const sessionRef = useRef<ReturnType<typeof createTrackingSession> | null>(null)
  if (!sessionRef.current) sessionRef.current = createTrackingSession()

  useEffect(() => {
    const session = sessionRef.current
    if (!session) return
    const stored = readStoredConsent(browserConsentStorage())
    choiceRef.current = stored
    setChoice(stored)
    setAnalytics(stored?.analytics ?? false)
    setAdvertising(stored?.advertising ?? false)
    setBannerOpen(stored === null)
    setReady(true)
    session.watchNavigations({
      history: window.history as unknown as {
        pushState: (...args: unknown[]) => unknown
        replaceState: (...args: unknown[]) => unknown
      },
      addEventListener: (type, listener) => window.addEventListener(type, listener),
      removeEventListener: (type, listener) => window.removeEventListener(type, listener),
    })
    session.sync(stored, currentTrackingConfig(), document, browserTrackingHost(), browserCookieAccess())

    function openPreferences() {
      const current = choiceRef.current
      setAnalytics(current?.analytics ?? false)
      setAdvertising(current?.advertising ?? false)
      setPreferencesOpen(true)
    }

    window.addEventListener(OPEN_CONSENT_EVENT, openPreferences)
    return () => {
      window.removeEventListener(OPEN_CONSENT_EVENT, openPreferences)
      session.stopWatching()
    }
  }, [])

  function apply(next: ConsentChoice) {
    const saved = writeStoredConsent(browserConsentStorage(), next)
    choiceRef.current = next
    setChoice(next)
    setAnalytics(next.analytics)
    setAdvertising(next.advertising)
    setBannerOpen(false)
    setPreferencesOpen(false)
    setNotice(saved ? null : UNSAVED)
    sessionRef.current?.sync(next, currentTrackingConfig(), document, browserTrackingHost(), browserCookieAccess())
  }

  function openFromBanner() {
    setAnalytics(choice?.analytics ?? false)
    setAdvertising(choice?.advertising ?? false)
    setPreferencesOpen(true)
  }

  if (!ready) return null

  return (
    <div id="cookie-consent-root">
      {bannerOpen && !preferencesOpen ? (
        <ConsentBanner onAccept={() => apply(acceptAll(now()))} onReject={() => apply(rejectOptional(now()))} onCustomize={openFromBanner} />
      ) : null}
      {preferencesOpen ? (
        <ConsentPreferences
          analytics={analytics}
          advertising={advertising}
          onAnalyticsChange={setAnalytics}
          onAdvertisingChange={setAdvertising}
          onAccept={() => apply(acceptAll(now()))}
          onReject={() => apply(rejectOptional(now()))}
          onSave={() => apply(savePreferences(analytics, advertising, now()))}
          onClose={() => setPreferencesOpen(false)}
        />
      ) : null}
      {notice ? (
        <p role="status" className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-headline bg-farm-beige px-5 py-3 text-sm font-semibold text-headline md:px-8">
          {notice}
        </p>
      ) : null}
    </div>
  )
}

function now(): string {
  return new Date().toISOString()
}
