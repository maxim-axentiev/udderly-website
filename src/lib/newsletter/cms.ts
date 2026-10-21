import type { CmsSeo } from '@/lib/about/cms'

export type CmsNewsletterPage = {
  title?: string | null
  copy?: string | null
  firstNameLabel?: string | null
  emailLabel?: string | null
  dateOfBirthLabel?: string | null
  submitLabel?: string | null
  unavailableMessage?: string | null
  seo?: CmsSeo
} | null
