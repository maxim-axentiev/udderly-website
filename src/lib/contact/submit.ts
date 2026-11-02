import { CONTACT_RECIPIENT } from './model'
import { deliverContactViaResend, resendConfigured } from './resend'
import { contactSmtpConfigured, deliverContactEmail, type ContactMail } from './smtp'

export const CONTACT_RATE_LIMIT = 5
export const CONTACT_RATE_WINDOW_MS = 60 * 60 * 1000

const NAME_MAX = 100
const EMAIL_MAX = 254
const MESSAGE_MIN = 2
const MESSAGE_MAX = 4000

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export type ContactSubmitResult =
  | { ok: true; delivery: 'accepted' }
  | { ok: false; error: 'invalid' | 'rate_limited' | 'unavailable' | 'delivery_failed' }

type Attempt = { ip: string; at: number }

const attempts: Attempt[] = []

export function resetContactRateLimit() {
  attempts.length = 0
}

export function clientAddress(input: { socketAddress?: string | null; forwardedFor?: string | null }): string {
  const socket = normalizeAddress(input.socketAddress)
  if (!socket || isLocalProxyAddress(socket)) {
    const forwarded = rightmostForwardedAddress(input.forwardedFor)
    if (forwarded) return forwarded
  }
  return socket || 'unknown'
}

export async function submitContactMessage(
  input: unknown,
  options: {
    env: Record<string, string | undefined>
    ip: string
    now?: number
    createTransport?: Parameters<typeof deliverContactEmail>[2]
  },
): Promise<ContactSubmitResult> {
  if (!resendConfigured(options.env) && !contactSmtpConfigured(options.env)) return { ok: false, error: 'unavailable' }
  const parsed = parseSubmission(input)
  const now = options.now ?? Date.now()
  if (parsed.honeypot) {
    if (!allowAttempt(options.ip || 'unknown', now)) return { ok: false, error: 'rate_limited' }
    return { ok: true, delivery: 'accepted' }
  }
  if (!parsed.message) return { ok: false, error: 'invalid' }
  if (!allowAttempt(options.ip || 'unknown', now)) return { ok: false, error: 'rate_limited' }

  const result = resendConfigured(options.env)
    ? await deliverContactViaResend(parsed.message, options.env)
    : await deliverContactEmail(parsed.message, options.env, options.createTransport)
  if (result === 'unconfigured') return { ok: false, error: 'unavailable' }
  if (result !== 'accepted') {
    console.error('[contact] delivery was not accepted')
    return { ok: false, error: 'delivery_failed' }
  }
  return { ok: true, delivery: 'accepted' }
}

function allowAttempt(ip: string, now: number): boolean {
  const cutoff = now - CONTACT_RATE_WINDOW_MS
  for (let index = attempts.length - 1; index >= 0; index -= 1) {
    const attempt = attempts[index]
    if (!attempt || attempt.at <= cutoff) attempts.splice(index, 1)
  }
  const recent = attempts.filter((attempt) => attempt.ip === ip).length
  if (recent >= CONTACT_RATE_LIMIT) return false
  attempts.push({ ip, at: now })
  return true
}

function parseSubmission(input: unknown): { honeypot: boolean; message: ContactMail | null } {
  if (!input || typeof input !== 'object') return { honeypot: false, message: null }
  const record = input as Record<string, unknown>
  if (honeypotFilled(record.contactExtra)) return { honeypot: true, message: null }
  const name = singleLine(record.name, NAME_MAX)
  const email = visitorEmail(record.email)
  const message = messageBody(record.message)
  if (!name || !email || !message) return { honeypot: false, message: null }
  return {
    honeypot: false,
    message: {
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: 'Website enquiry',
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    },
  }
}

function honeypotFilled(value: unknown): boolean {
  if (typeof value !== 'string') return value != null
  return value.trim().length > 0
}

function singleLine(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max || /[\u0000-\u001F\u007F]/.test(trimmed)) return undefined
  return trimmed
}

function visitorEmail(value: unknown): string | undefined {
  const email = singleLine(value, EMAIL_MAX)
  if (!email || !EMAIL_PATTERN.test(email)) return undefined
  return email
}

function messageBody(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (trimmed.length < MESSAGE_MIN || trimmed.length > MESSAGE_MAX || trimmed.includes('\u0000')) return undefined
  return trimmed
}

function normalizeAddress(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? ''
  if (!trimmed || /[\s,]/.test(trimmed)) return ''
  const mapped = trimmed.toLowerCase().startsWith('::ffff:') ? trimmed.slice('::ffff:'.length) : trimmed
  return /^[0-9a-f:.]+$/i.test(mapped) ? mapped : ''
}

function rightmostForwardedAddress(header: string | null | undefined): string {
  if (!header || /[\r\n]/.test(header)) return ''
  const parts = header.split(',').map((part) => normalizeAddress(part))
  return parts.filter(Boolean).at(-1) ?? ''
}

function isLocalProxyAddress(address: string): boolean {
  const value = address.toLowerCase()
  if (value === '::1' || value === 'localhost') return true
  if (value.startsWith('fe80:') || value.startsWith('fc') || value.startsWith('fd')) return true
  const octets = value.split('.')
  if (octets.length !== 4) return false
  const numbers = octets.map((octet) => Number(octet))
  if (numbers.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) return false
  const [first, second] = numbers
  if (first === 10 || first === 127) return true
  if (first === 192 && second === 168) return true
  if (first === 169 && second === 254) return true
  return first === 172 && second !== undefined && second >= 16 && second <= 31
}
