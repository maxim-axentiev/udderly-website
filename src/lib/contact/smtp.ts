import nodemailer from 'nodemailer'

import { CONTACT_RECIPIENT } from './model'

export type ContactMail = {
  to: string
  replyTo: string
  subject: string
  text: string
}

export type ContactSmtpConfig = {
  host: string
  port: number
  user: string
  password: string
}

type SentMail = {
  accepted?: unknown[]
  rejected?: unknown[]
}

export type ContactTransport = {
  sendMail(mail: ContactMail & { from: string }): Promise<SentMail>
}

export function contactSmtpConfigured(env: Record<string, string | undefined>): boolean {
  return readContactSmtp(env) !== undefined
}

export function readContactSmtp(env: Record<string, string | undefined>): ContactSmtpConfig | undefined {
  const host = env.CONTACT_SMTP_HOST?.trim() ?? ''
  const user = env.CONTACT_SMTP_USER?.trim() ?? ''
  const password = env.CONTACT_SMTP_PASSWORD ?? ''
  const port = Number(env.CONTACT_SMTP_PORT?.trim())
  if (!host || !user || !password.trim() || !Number.isInteger(port) || port < 1 || port > 65535) return undefined
  return { host, port, user, password }
}

export async function deliverContactEmail(
  mail: ContactMail,
  env: Record<string, string | undefined>,
  createTransport: (config: ContactSmtpConfig) => ContactTransport = defaultTransport,
): Promise<'accepted' | 'rejected' | 'unconfigured'> {
  const config = readContactSmtp(env)
  if (!config || mail.to !== CONTACT_RECIPIENT) return 'unconfigured'
  try {
    const transport = createTransport(config)
    const info = await transport.sendMail({
      ...mail,
      from: fromAddress(config.user),
    })
    const accepted = (info.accepted ?? []).map(addressText)
    const rejected = (info.rejected ?? []).map(addressText)
    if (rejected.length > 0 || !accepted.some((address) => address.toLowerCase() === CONTACT_RECIPIENT)) {
      return 'rejected'
    }
    return 'accepted'
  } catch {
    return 'rejected'
  }
}

function fromAddress(user: string): string {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user) ? user : CONTACT_RECIPIENT
}

function addressText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'address' in value && typeof value.address === 'string') return value.address
  return ''
}

function defaultTransport(config: ContactSmtpConfig): ContactTransport {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port === 587,
    auth: { user: config.user, pass: config.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  })
  return {
    async sendMail(mail) {
      try {
        return await transporter.sendMail(mail)
      } finally {
        transporter.close()
      }
    },
  }
}
