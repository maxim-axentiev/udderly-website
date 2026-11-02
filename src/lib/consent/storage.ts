import { parseStoredConsent, type ConsentChoice } from './model'

export const CONSENT_STORAGE_KEY = 'udderly.consent.v1'

export function readStoredConsent(storage: Pick<Storage, 'getItem'> | null): ConsentChoice | null {
  if (!storage) return null
  try {
    const raw = storage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    return parseStoredConsent(JSON.parse(raw))
  } catch {
    return null
  }
}

export function writeStoredConsent(storage: Pick<Storage, 'setItem'> | null, choice: ConsentChoice): boolean {
  if (!storage) return false
  try {
    storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice))
    return true
  } catch {
    return false
  }
}

export function browserConsentStorage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const probe = `${CONSENT_STORAGE_KEY}.probe`
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    return localStorage
  } catch {
    return null
  }
}
