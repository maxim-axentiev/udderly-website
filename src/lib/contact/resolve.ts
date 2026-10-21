import type { CmsSeo } from '@/lib/about/cms'
import type { PageSeoInput } from '@/lib/seo/page-head'

import type { CmsContactPage, CmsContactSettings } from './cms'
import { CONTACT_PATH, contactFallback, contactFallbackHours } from './model'

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

export type ContactHours = {
  title: string
  rows: Array<{ label: string; value: string }>
}

export type ContactPageContent = {
  heroLead: string
  heroAccent: string
  businessName: string
  intro?: string
  email: string
  emailHref: string
  phone: string
  phoneHref: string
  address: string
  hoursNote?: string
  hours: ContactHours[]
  formHeading: string
  nameLabel: string
  emailLabel: string
  messageLabel: string
  submitLabel: string
  unavailable: string
  seo: PageSeoInput
}

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function text(value: string | null | undefined, fallback: string): string {
  return clean(value) ?? fallback
}

function seoFor(seo: CmsSeo | undefined, fallback: PageSeoInput): PageSeoInput {
  const description = text(seo?.description, fallback.description ?? '')
  return {
    title: text(seo?.title, fallback.title),
    description,
    ogDescription: clean(seo?.description) ? description : fallback.ogDescription,
    path: fallback.path,
    ogType: 'website',
    noindex: seo?.noIndex === true,
  }
}

function formatAddress(address: NonNullable<CmsContactSettings>['address']): string | undefined {
  if (!address) return undefined
  const cityLine = [clean(address.city), clean(address.region)].filter(Boolean).join(', ')
  const line = [clean(address.line1), clean(address.line2), cityLine, clean(address.postalCode)]
    .filter(Boolean)
    .join(', ')
  return line || undefined
}

function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : `tel:${phone}`
}

function settingsHours(settings: CmsContactSettings): ContactHours[] {
  const rows = (settings?.weeklyHours ?? []).flatMap((row) => {
    const day = clean(row?.day)
    if (!day) return []
    const label = DAY_LABELS[day] ?? day
    if (row?.closed) return [{ label, value: 'Closed' }]
    const open = clean(row?.openTime)
    const close = clean(row?.closeTime)
    const value = open && close ? `${open} – ${close}` : open || close
    return value ? [{ label, value }] : []
  })
  if (rows.length === 0) return []
  return [{ title: 'Hours', rows }]
}

export function resolveContactPage(
  page: CmsContactPage,
  settings: CmsContactSettings,
): ContactPageContent {
  const email = text(settings?.email, contactFallback.email)
  const phone = text(settings?.phone, contactFallback.phone)
  const publishedHours = settingsHours(settings)
  const hoursNote = clean(settings?.hoursNote)
  return {
    heroLead: text(page?.heroLead, contactFallback.heroLead),
    heroAccent: text(page?.heroAccent, contactFallback.heroAccent),
    businessName: text(page?.businessName, contactFallback.businessName),
    intro: clean(page?.intro),
    email,
    emailHref: `mailto:${email}`,
    phone,
    phoneHref: phoneHref(phone),
    address: formatAddress(settings?.address) ?? contactFallback.address,
    hoursNote,
    hours:
      publishedHours.length > 0
        ? publishedHours
        : hoursNote
          ? []
          : contactFallbackHours.map((group) => ({
              title: group.title,
              rows: group.rows.map((row) => ({ label: row.label, value: row.value })),
            })),
    formHeading: text(page?.formHeading, contactFallback.formHeading),
    nameLabel: text(page?.nameLabel, contactFallback.nameLabel),
    emailLabel: text(page?.emailLabel, contactFallback.emailLabel),
    messageLabel: text(page?.messageLabel, contactFallback.messageLabel),
    submitLabel: text(page?.submitLabel, contactFallback.submitLabel),
    unavailable: text(page?.unavailableMessage, contactFallback.unavailable),
    seo: seoFor(page?.seo, {
      title: contactFallback.seoTitle,
      description: contactFallback.seoDescription,
      path: CONTACT_PATH,
    }),
  }
}
