import type { CmsSeo } from '@/lib/about/cms'

export type CmsContactPage = {
  heroLead?: string | null
  heroAccent?: string | null
  businessName?: string | null
  intro?: string | null
  formHeading?: string | null
  nameLabel?: string | null
  emailLabel?: string | null
  messageLabel?: string | null
  submitLabel?: string | null
  unavailableMessage?: string | null
  seo?: CmsSeo
} | null

export type CmsContactSettings = {
  email?: string | null
  phone?: string | null
  hoursNote?: string | null
  address?: {
    line1?: string | null
    line2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    country?: string | null
  } | null
  weeklyHours?: Array<{
    day?: string | null
    closed?: boolean | null
    openTime?: string | null
    closeTime?: string | null
  } | null> | null
} | null
