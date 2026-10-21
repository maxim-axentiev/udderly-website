import type { CmsSeo } from '@/lib/about/cms'
import type { PageSeoInput } from '@/lib/seo/page-head'

import type { CmsNewsletterPage } from './cms'
import { NEWSLETTER_PATH, newsletterFallback } from './model'

export type NewsletterPageContent = {
  title: string
  copy: string
  firstNameLabel: string
  emailLabel: string
  dateOfBirthLabel: string
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

export function resolveNewsletterPage(page: CmsNewsletterPage): NewsletterPageContent {
  return {
    title: text(page?.title, newsletterFallback.title),
    copy: text(page?.copy, newsletterFallback.copy),
    firstNameLabel: text(page?.firstNameLabel, newsletterFallback.firstNameLabel),
    emailLabel: text(page?.emailLabel, newsletterFallback.emailLabel),
    dateOfBirthLabel: text(page?.dateOfBirthLabel, newsletterFallback.dateOfBirthLabel),
    submitLabel: text(page?.submitLabel, newsletterFallback.submitLabel),
    unavailable: text(page?.unavailableMessage, newsletterFallback.unavailable),
    seo: seoFor(page?.seo, {
      title: newsletterFallback.seoTitle,
      description: newsletterFallback.seoDescription,
      ogDescription: newsletterFallback.ogDescription,
      path: NEWSLETTER_PATH,
    }),
  }
}
