import { documentPath } from '@/lib/routes/paths'
import {
  bookCta as fallbackBookCta,
  FOOTER_LOCATION_FALLBACK,
  FOOTER_TAGLINE,
  footerColumns as fallbackFooterColumns,
  footerLegalNav as fallbackLegalNav,
  footerNav as fallbackFooterNav,
  primaryNav as fallbackPrimaryNav,
} from '@/lib/navigation'
import { SITE_NAME } from '@/lib/site'

export type ChromeLink = {
  label: string
  href: string
  openInNewTab?: boolean
}

export type ChromeNavItem = {
  label: string
  href?: string
  openInNewTab?: boolean
  children?: ChromeLink[]
}

export type FooterColumn = {
  title: string
  links: ChromeLink[]
}

export type SiteChrome = {
  siteName: string
  primaryNav: ChromeNavItem[]
  footerNav: ChromeLink[]
  footerColumns: FooterColumn[]
  legalNav: ChromeLink[]
  bookCta: ChromeLink
  social: {
    instagram: string
    tiktok: string
    facebook?: string
    youtube?: string
  }
  locationLine: string
  tagline: string
  email?: string
  phone?: string
}

export type CmsLink = {
  label?: string | null
  linkType?: string | null
  href?: string | null
  openInNewTab?: boolean | null
  internalLink?: {
    _type?: string | null
    slug?: string | null
  } | null
}

export type CmsNavigation = {
  headerItems?: Array<{
    menuLabel?: string | null
    link?: CmsLink | null
    children?: Array<{ link?: CmsLink | null } | null> | null
  } | null> | null
  footerItems?: Array<{ link?: CmsLink | null } | null> | null
  footerColumns?: Array<{
    title?: string | null
    links?: Array<{ link?: CmsLink | null } | null> | null
  } | null> | null
  legalItems?: Array<{ link?: CmsLink | null } | null> | null
} | null

export type CmsSiteSettings = {
  siteName?: string | null
  email?: string | null
  phone?: string | null
  footerTagline?: string | null
  bookingCta?: CmsLink | null
  address?: {
    line1?: string | null
    line2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    country?: string | null
  } | null
  socialLinks?: {
    facebook?: string | null
    instagram?: string | null
    tiktok?: string | null
    youtube?: string | null
  } | null
} | null

export type SiteChromeDocuments = {
  navigation?: CmsNavigation
  siteSettings?: CmsSiteSettings
} | null

export const siteChromeFallback: SiteChrome = {
  siteName: SITE_NAME,
  primaryNav: fallbackPrimaryNav.map((item) => ({ ...item })),
  footerNav: fallbackFooterNav.map((item) => ({ ...item })),
  legalNav: fallbackLegalNav.map((item) => ({ ...item })),
  bookCta: { ...fallbackBookCta },
  social: {
    instagram: '#instagram',
    tiktok: '#tiktok',
  },
  footerColumns: fallbackFooterColumns.map((column) => ({
    title: column.title,
    links: column.links.map((link) => ({ ...link })),
  })),
  locationLine: FOOTER_LOCATION_FALLBACK,
  tagline: FOOTER_TAGLINE,
}

export function chromeLinkProps(link: ChromeLink) {
  if (link.openInNewTab) {
    return { target: '_blank' as const, rel: 'noreferrer' }
  }

  return {}
}

export function documentHref(
  type: string | null | undefined,
  slug: string | null | undefined,
): string | undefined {
  return documentPath(type, slug)
}

export function resolveCmsLink(link: CmsLink | null | undefined): ChromeLink | undefined {
  if (!link) {
    return undefined
  }

  const label = link.label?.trim()
  if (!label) {
    return undefined
  }

  if (link.linkType === 'external') {
    const href = link.href?.trim()
    if (!href) {
      return undefined
    }

    return {
      label,
      href,
      openInNewTab: Boolean(link.openInNewTab),
    }
  }

  const href = documentHref(link.internalLink?._type, link.internalLink?.slug)
  if (!href) {
    return undefined
  }

  return { label, href }
}

function resolveNavItems(
  items: NonNullable<CmsNavigation>['headerItems'],
): ChromeNavItem[] {
  if (!Array.isArray(items)) {
    return []
  }

  return items.flatMap((item) => {
    const link = resolveCmsLink(item?.link)
    const label = item?.menuLabel?.trim() || link?.label
    const children = (item?.children ?? [])
      .map((child) => resolveCmsLink(child?.link))
      .filter((child): child is ChromeLink => Boolean(child))

    if (!label || (!link && children.length === 0)) {
      return []
    }

    return [
      {
        label,
        ...(link ? { href: link.href, ...(link.openInNewTab ? { openInNewTab: true } : {}) } : {}),
        ...(children.length ? { children } : {}),
      },
    ]
  })
}

function resolveFooterColumns(
  columns: NonNullable<CmsNavigation>['footerColumns'],
): FooterColumn[] {
  if (!Array.isArray(columns)) return []
  return columns.flatMap((column) => {
    const title = column?.title?.trim()
    const links = (column?.links ?? [])
      .map((item) => resolveCmsLink(item?.link))
      .filter((link): link is ChromeLink => Boolean(link))
    return title && links.length ? [{ title, links }] : []
  })
}

function resolveFooterItems(
  items: NonNullable<CmsNavigation>['footerItems'],
): ChromeLink[] {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .map((item) => resolveCmsLink(item?.link))
    .filter((item): item is ChromeLink => Boolean(item))
}

function formatAddress(address: NonNullable<CmsSiteSettings>['address']): string | undefined {
  if (!address) {
    return undefined
  }

  const line = [
    address.line1,
    address.line2,
    [address.city, address.region].filter(Boolean).join(', '),
    address.postalCode,
    address.country,
  ]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' · ')

  return line || undefined
}

export function mergeSiteChrome(documents: SiteChromeDocuments): SiteChrome {
  const navigation = documents?.navigation
  const settings = documents?.siteSettings
  const headerItems = resolveNavItems(navigation?.headerItems)
  const footerItems = resolveFooterItems(navigation?.footerItems)
  const footerColumns = resolveFooterColumns(navigation?.footerColumns)
  const social = settings?.socialLinks
  const locationLine = formatAddress(settings?.address)
  const siteName = settings?.siteName?.trim()
  const email = settings?.email?.trim()
  const phone = settings?.phone?.trim()
  const tagline = settings?.footerTagline?.trim()
  const bookCta = resolveCmsLink(settings?.bookingCta)
  const legalItems = resolveFooterItems(navigation?.legalItems)

  return {
    siteName: siteName || siteChromeFallback.siteName,
    primaryNav: headerItems.length ? headerItems : siteChromeFallback.primaryNav,
    footerNav: footerItems.length ? footerItems : siteChromeFallback.footerNav,
    footerColumns: footerColumns.length ? footerColumns : siteChromeFallback.footerColumns,
    legalNav: legalItems.length ? legalItems : siteChromeFallback.legalNav,
    bookCta: bookCta ?? siteChromeFallback.bookCta,
    social: {
      instagram: social?.instagram?.trim() || siteChromeFallback.social.instagram,
      tiktok: social?.tiktok?.trim() || siteChromeFallback.social.tiktok,
      ...(social?.facebook?.trim() ? { facebook: social.facebook.trim() } : {}),
      ...(social?.youtube?.trim() ? { youtube: social.youtube.trim() } : {}),
    },
    locationLine: locationLine || siteChromeFallback.locationLine,
    tagline: tagline || FOOTER_TAGLINE,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
  }
}
