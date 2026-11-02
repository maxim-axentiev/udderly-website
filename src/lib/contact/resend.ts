import { CONTACT_RECIPIENT } from './model'
import type { ContactMail } from './smtp'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const RESEND_FROM = 'Website Contact <contact@udderlyridiculousfarmlife.com>'

export function resendConfigured(env: Record<string, string | undefined>): boolean {
  return Boolean(env.RESEND_API_KEY?.trim())
}

export async function deliverContactViaResend(
  mail: ContactMail,
  env: Record<string, string | undefined>,
  send: typeof fetch = fetch,
): Promise<'accepted' | 'rejected' | 'unconfigured'> {
  const key = env.RESEND_API_KEY?.trim()
  if (!key || mail.to !== CONTACT_RECIPIENT) return 'unconfigured'
  try {
    const response = await send(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [CONTACT_RECIPIENT],
        reply_to: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) {
      console.error('[contact] Resend API rejected request', response.status)
      return 'rejected'
    }
    return 'accepted'
  } catch {
    console.error('[contact] Resend API request failed')
    return 'rejected'
  }
}
