import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { CONTACT_RECIPIENT } from './model'
import { deliverContactViaResend, resendConfigured } from './resend'

const mail = { to: CONTACT_RECIPIENT, replyTo: 'visitor@example.com', subject: 'Website enquiry', text: 'Hello' }

describe('Resend HTTPS contact delivery', () => {
  it('passes the server-only Resend key into the production container', () => {
    const compose = readFileSync(resolve(process.cwd(), 'docker-compose.production.yml'), 'utf8')
    expect(compose).toMatch(/^\s+RESEND_API_KEY: \$\{RESEND_API_KEY:-\}\s*$/m)
    expect(compose).not.toMatch(/^\s+(PUBLIC_|VITE_)RESEND_API_KEY:/m)
  })

  it('keeps all outbound contact delivery credentials disabled in staging Compose', () => {
    const compose = readFileSync(resolve(process.cwd(), 'docker-compose.staging.yml'), 'utf8')
    for (const name of [
      'RESEND_API_KEY',
      'CONTACT_SMTP_HOST',
      'CONTACT_SMTP_PORT',
      'CONTACT_SMTP_USER',
      'CONTACT_SMTP_PASSWORD',
    ]) {
      expect(compose).toMatch(new RegExp(`^\\s+${name}: ["']{2}\\s*$`, 'm'))
      expect(compose).not.toContain(`${name}: \${${name}:-}`)
    }
  })

  it('requires a nonempty API key', () => {
    expect(resendConfigured({})).toBe(false)
    expect(resendConfigured({ RESEND_API_KEY: '  ' })).toBe(false)
    expect(resendConfigured({ RESEND_API_KEY: 're_test' })).toBe(true)
  })
  it('sends only to the fixed recipient with visitor reply-to', async () => {
    const send = vi.fn(async (_url: string, _init?: RequestInit) => {
      void _url
      void _init
      return { ok: true, status: 200 } as Response
    })
    expect(await deliverContactViaResend(mail, { RESEND_API_KEY: 'secret' }, send as typeof fetch)).toBe('accepted')
    expect(send).toHaveBeenCalledOnce()
    expect(send.mock.calls[0]?.[0]).toBe('https://api.resend.com/emails')
    const request = send.mock.calls[0]?.[1] as RequestInit
    const body = JSON.parse(String(request.body))
    expect(body).toMatchObject({ from: 'Website Contact <contact@udderlyridiculousfarmlife.com>', to: [CONTACT_RECIPIENT], reply_to: 'visitor@example.com', text: 'Hello' })
    expect(JSON.stringify(body)).not.toContain('secret')
  })
  it('fails closed without a key or with a different recipient', async () => {
    const send = vi.fn()
    expect(await deliverContactViaResend(mail, {}, send as typeof fetch)).toBe('unconfigured')
    expect(await deliverContactViaResend({ ...mail, to: 'other@example.com' }, { RESEND_API_KEY: 'secret' }, send as typeof fetch)).toBe('unconfigured')
    expect(send).not.toHaveBeenCalled()
  })
  it('does not claim delivery on HTTP errors or network failures', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(await deliverContactViaResend(mail, { RESEND_API_KEY: 'secret' }, vi.fn(async () => ({ ok: false, status: 403 }) as Response) as typeof fetch)).toBe('rejected')
    expect(await deliverContactViaResend(mail, { RESEND_API_KEY: 'secret' }, vi.fn(async () => { throw Error('private message') }) as typeof fetch)).toBe('rejected')
    expect(error.mock.calls.flat().join(' ')).not.toContain('private message')
    error.mockRestore()
  })
})
