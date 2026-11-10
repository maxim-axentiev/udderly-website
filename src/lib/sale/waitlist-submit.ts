import { appendFile, mkdir, open } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export const WAITLIST_HEADERS = ['Submitted At (UTC)', 'Name', 'Email', 'Phone', 'Animal Interest', 'Notes', 'Consent']
const INTERESTS = new Set(['Mini Highland Cow', 'Mini Highland Bull', 'Mini Highland Heifer', 'Goat', 'Other / Any'])
const CSV_NAME = 'animal-sale-waitlist.csv'
const RATE_WINDOW = 60 * 60 * 1000
const MAX_PER_HOUR = 5
const attempts = new Map<string, number[]>()

type Entry = { name: string; email: string; phone: string; interests: string[]; notes: string; consent: boolean }
type Result = { ok: true } | { ok: false; error: 'invalid' | 'unavailable' | 'rate_limited' | 'save_failed' }
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parse(data: unknown): Entry | null {
  if (!data || typeof data !== 'object') return null
  const r = data as Record<string, unknown>
  const name = typeof r.name === 'string' ? r.name.trim() : ''
  const email = typeof r.email === 'string' ? r.email.trim() : ''
  const phone = typeof r.phone === 'string' ? r.phone.trim() : ''
  // Accept legacy single-choice payloads while using an array for new submissions.
  const requested = Array.isArray(r.interests) ? r.interests : [r.interest]
  const interests = requested.filter((value): value is string => typeof value === 'string')
  if (interests.length !== requested.length || interests.length === 0 || interests.length > INTERESTS.size ||
      new Set(interests).size !== interests.length || interests.some((value) => !INTERESTS.has(value))) return null
  const notes = typeof r.notes === 'string' ? r.notes.trim() : ''
  if (name.length < 2 || name.length > 100 || email.length > 254 || !validEmail.test(email) ||
      phone.length > 50 || notes.length > 1000 || r.consent !== true ||
      [name, email, phone, notes].some((s) => [...s.replace(/[\r\n]/g, '')].some((char) => {
        const code = char.charCodeAt(0)
        return code < 32 || code === 127
      }))) return null
  return { name, email, phone, interests, notes, consent: true }
}

/** Escape formula cells as well as CSV quotes so Excel will not evaluate user-supplied text. */
export function csvCell(value: string): string {
  const clean = value.replace(/\r\n?/g, '\n')
  const safe = /^[\s]*[=+@-]/.test(clean) ? "'" + clean : clean
  return '"' + safe.replace(/"/g, '""') + '"'
}

export function serializeWaitlistEntry(input: Entry, at: Date): string {
  return [at.toISOString(), input.name, input.email, input.phone, input.interests.join('; '), input.notes, 'Yes']
    .map(csvCell).join(',') + '\n'
}

export function waitlistConfigured(env: Record<string, string | undefined>): boolean {
  return Boolean(env.WAITLIST_DATA_DIR?.trim())
}

function allowAttempt(ip: string, now: number): boolean {
  // Bound in-memory rate-limit history. A separate edge-level rate limit is still advisable.
  if (attempts.size > 5000) attempts.clear()
  const existing = (attempts.get(ip) ?? []).filter((value) => now - value < RATE_WINDOW)
  if (existing.length >= MAX_PER_HOUR) return false
  existing.push(now)
  attempts.set(ip, existing)
  return true
}

export async function saveWaitlistSubmission(
  data: unknown,
  options: { env: Record<string, string | undefined>; ip: string; now?: Date } ,
): Promise<Result> {
  const directory = options.env.WAITLIST_DATA_DIR?.trim()
  if (!directory) return { ok: false, error: 'unavailable' }
  if (!data || typeof data !== 'object') return { ok: false, error: 'invalid' }
  const input = data as Record<string, unknown>
  const now = options.now ?? new Date()
  if (!allowAttempt(options.ip || 'unknown', now.valueOf())) return { ok: false, error: 'rate_limited' }
  // Honeypot gets a harmless success without writing an entry.
  if (typeof input.website === 'string' && input.website.trim()) return { ok: true }
  const entry = parse(input)
  if (!entry) return { ok: false, error: 'invalid' }
  try {
    const path = join(resolve(directory), CSV_NAME)
    await mkdir(directory, { recursive: true, mode: 0o700 })
    try {
      const created = await open(path, 'wx', 0o600)
      try { await created.writeFile('\uFEFF' + WAITLIST_HEADERS.map(csvCell).join(',') + '\n', 'utf8') }
      finally { await created.close() }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    }
    await appendFile(path, serializeWaitlistEntry(entry, now), { encoding: 'utf8', mode: 0o600, flag: 'a' })
    return { ok: true }
  } catch {
    console.error('[waitlist] unable to store submission')
    return { ok: false, error: 'save_failed' }
  }
}
