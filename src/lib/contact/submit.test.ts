import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CONTACT_RECIPIENT } from './model'
import { deliverContactEmail, type ContactSmtpConfig, type ContactTransport } from './smtp'
import {
  CONTACT_RATE_LIMIT,
  CONTACT_RATE_WINDOW_MS,
  clientAddress,
  resetContactRateLimit,
  submitContactMessage,
} from './submit'

const env = {
  CONTACT_SMTP_HOST: 'smtp.example.com',
  CONTACT_SMTP_PORT: '587',
  CONTACT_SMTP_USER: 'mailbox@example.com',
  CONTACT_SMTP_PASSWORD: 'mailbox-secret',
}

const valid = {
  name: 'Ada Farm',
  email: 'ada@example.com',
  message: 'Can we visit on Friday?',
  contactExtra: '',
}

function acceptingTransport() {
  const sent: Array<{ from: string; to: string; replyTo: string; subject: string; text: string }> = []
  const createTransport = vi.fn((_config: ContactSmtpConfig): ContactTransport => ({
    async sendMail(mail) {
      sent.push(mail)
      return { accepted: [mail.to], rejected: [] }
    },
  }))
  return { createTransport, sent }
}

describe('contact delivery', () => {
  beforeEach(() => {
    resetContactRateLimit()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps delivery unavailable until every SMTP variable is set', async () => {
    const { createTransport } = acceptingTransport()
    for (const partial of [
      {},
      { CONTACT_SMTP_HOST: 'smtp.example.com' },
      { ...env, CONTACT_SMTP_PASSWORD: '   ' },
      { ...env, CONTACT_SMTP_PORT: '0' },
    ]) {
      const result = await submitContactMessage(valid, { env: partial, ip: '203.0.113.10', createTransport })
      expect(result).toEqual({ ok: false, error: 'unavailable' })
    }
    expect(createTransport).not.toHaveBeenCalled()
  })

  it('rejects invalid fields and header injection before SMTP', async () => {
    const { createTransport } = acceptingTransport()
    const cases = [
      { ...valid, name: '' },
      { ...valid, name: 'Ada\nBcc: evil@example.com' },
      { ...valid, email: 'ada@example.com\r\nBcc: evil@example.com' },
      { ...valid, email: 'not-an-email' },
      { ...valid, message: ' ' },
      { ...valid, message: 'x'.repeat(4001) },
    ]
    for (const input of cases) {
      expect(await submitContactMessage(input, { env, ip: '203.0.113.11', createTransport })).toEqual({
        ok: false,
        error: 'invalid',
      })
    }
    expect(createTransport).not.toHaveBeenCalled()
  })

  it('reports success only after SMTP accepts the fixed recipient', async () => {
    const { createTransport, sent } = acceptingTransport()
    const result = await submitContactMessage(valid, { env, ip: '203.0.113.12', createTransport })
    expect(result).toEqual({ ok: true, delivery: 'accepted' })
    expect(sent[0]).toMatchObject({
      from: 'mailbox@example.com',
      to: CONTACT_RECIPIENT,
      replyTo: 'ada@example.com',
      subject: 'Website enquiry',
    })
    expect(sent[0]?.text).toContain('Can we visit on Friday?')
    expect(JSON.stringify(sent[0])).not.toContain('mailbox-secret')
  })

  it('keeps a delivery failure distinct from acceptance and does not log the message', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const createTransport = vi.fn((): ContactTransport => ({
      async sendMail() {
        return { accepted: [], rejected: [CONTACT_RECIPIENT] }
      },
    }))
    const rejected = await submitContactMessage(
      { ...valid, message: 'Please call about the private visit.' },
      { env, ip: '203.0.113.13', createTransport },
    )
    expect(rejected).toEqual({ ok: false, error: 'delivery_failed' })

    const throwing = vi.fn((): ContactTransport => ({
      async sendMail() {
        throw new Error('mailbox-secret authentication failed for Please call about the private visit.')
      },
    }))
    const failed = await submitContactMessage(valid, { env, ip: '203.0.113.14', createTransport: throwing })
    expect(failed).toEqual({ ok: false, error: 'delivery_failed' })
    const logged = errors.mock.calls.flat().join(' ')
    expect(errors).toHaveBeenCalledTimes(2)
    expect(logged).toContain('[contact] delivery was not accepted')
    expect(logged).not.toContain('mailbox-secret')
    expect(logged).not.toContain('private visit')
  })

  it('drops a filled honeypot without sending', async () => {
    const { createTransport } = acceptingTransport()
    const result = await submitContactMessage({ ...valid, contactExtra: 'https://spam.example' }, { env, ip: '203.0.113.15', createTransport })
    expect(result).toEqual({ ok: true, delivery: 'accepted' })
    expect(createTransport).not.toHaveBeenCalled()
  })

  it('limits repeated submissions from one address', async () => {
    const { createTransport } = acceptingTransport()
    const ip = '203.0.113.16'
    for (let count = 0; count < CONTACT_RATE_LIMIT; count += 1) {
      expect(await submitContactMessage(valid, { env, ip, now: 1_000, createTransport })).toEqual({
        ok: true,
        delivery: 'accepted',
      })
    }
    expect(await submitContactMessage(valid, { env, ip, now: 1_000, createTransport })).toEqual({
      ok: false,
      error: 'rate_limited',
    })
    expect(
      await submitContactMessage(valid, { env, ip, now: 1_000 + CONTACT_RATE_WINDOW_MS + 1, createTransport }),
    ).toEqual({ ok: true, delivery: 'accepted' })
    expect(createTransport).toHaveBeenCalledTimes(CONTACT_RATE_LIMIT + 1)
  })

  it('uses the proxy-appended address and ignores a spoofed forwarded list', () => {
    expect(clientAddress({ socketAddress: '203.0.113.8', forwardedFor: '198.51.100.9, 203.0.113.8' })).toBe('203.0.113.8')
    expect(clientAddress({ socketAddress: '172.18.0.2', forwardedFor: '198.51.100.9, 203.0.113.50' })).toBe('203.0.113.50')
    expect(clientAddress({ socketAddress: '::ffff:10.1.1.1', forwardedFor: '203.0.113.60' })).toBe('203.0.113.60')
    expect(clientAddress({ socketAddress: '172.18.0.2', forwardedFor: '203.0.113.70\nBcc: evil@example.com' })).toBe('172.18.0.2')
    expect(clientAddress({})).toBe('unknown')
  })

  it('treats SMTP rejection as not accepted', async () => {
    const result = await deliverContactEmail(
      { to: CONTACT_RECIPIENT, replyTo: 'ada@example.com', subject: 'Website enquiry', text: 'Hello' },
      env,
      () => ({
        async sendMail() {
          throw new Error('connection refused')
        },
      }),
    )
    expect(result).toBe('rejected')
    expect(await deliverContactEmail(
      { to: 'other@example.com', replyTo: 'ada@example.com', subject: 'Website enquiry', text: 'Hello' },
      env,
      () => ({
        async sendMail() {
          return { accepted: ['other@example.com'], rejected: [] }
        },
      }),
    )).toBe('unconfigured')
  })
})
