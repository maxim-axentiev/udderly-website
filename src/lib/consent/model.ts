export const CONSENT_VERSION = 1 as const

export const OPEN_CONSENT_EVENT = 'udderly-open-consent'

export type ConsentChoice = {
  version: typeof CONSENT_VERSION
  analytics: boolean
  advertising: boolean
  decidedAt: string
}

export function acceptAll(decidedAt: string): ConsentChoice {
  return { version: CONSENT_VERSION, analytics: true, advertising: true, decidedAt }
}

export function rejectOptional(decidedAt: string): ConsentChoice {
  return { version: CONSENT_VERSION, analytics: false, advertising: false, decidedAt }
}

export function savePreferences(analytics: boolean, advertising: boolean, decidedAt: string): ConsentChoice {
  return { version: CONSENT_VERSION, analytics, advertising, decidedAt }
}

export function parseStoredConsent(value: unknown): ConsentChoice | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (record.version !== CONSENT_VERSION) return null
  if (typeof record.analytics !== 'boolean' || typeof record.advertising !== 'boolean') return null
  return {
    version: CONSENT_VERSION,
    analytics: record.analytics,
    advertising: record.advertising,
    decidedAt: typeof record.decidedAt === 'string' ? record.decidedAt : '',
  }
}

export function openConsentPreferences() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}
