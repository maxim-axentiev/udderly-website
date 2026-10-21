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
  path?: string | null
  openInNewTab?: boolean | null
  internalLink?: {
    _type?: string | null
    slug?: string | null
  } | null
}

export type CmsNavigation = {
  headerItems?: Array<{
    menuLabel?: string | null
    hidden?: boolean | null
    link?: CmsLink | null
    children?: Array<{ hidden?: boolean | null; link?: CmsLink | null } | null> | null
  } | null> | null
  footerItems?: Array<{ hidden?: boolean | null; link?: CmsLink | null } | null> | null
  footerColumns?: Array<{
    title?: string | null
    links?: Array<{ hidden?: boolean | null; link?: CmsLink | null } | null> | null
  } | null> | null
  legalItems?: Array<{ hidden?: boolean | null; link?: CmsLink | null } | null> | null
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

/** A path on this website. Full addresses and unsafe values stay unresolved. */
export function sitePath(value: string | null | undefined): string | undefined {
  const href = value?.trim()
  if (!href || href.length > 200 || !href.startsWith('/') || href.startsWith('//')) return undefined
  if (href.includes('\\') || href.includes('..') || /\s/.test(href) || href.includes('?') || href.includes('#')) {
    return undefined
  }
  if (!/^\/[A-Za-z0-9/_~.%+-]*$/.test(href)) return undefined
  return href
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

  if (link.linkType === 'path') {
    const href = sitePath(link.path)
    if (!href) return undefined
    return { label, href }
  }

  const href = documentHref(link.internalLink?._type, link.internalLink?.slug)
  if (!href) {
    return undefined
  }

  return { label, href }
}

function hrefsOf(items: ChromeNavItem[]): string[] {
  return items.flatMap((item) => [item.href, ...(item.children ?? []).map((child) => child.href)].filter((href): href is string => Boolean(href)))
}

function coversRequired(required: string[], present: Set<string>, hidden: Set<string>) {
  return required.every((href) => present.has(href) || hidden.has(href))
}

/**
 * A published collection replaces the approved menu only when every current
 * destination is still present or explicitly hidden, and at least one link remains.
 * An empty or partial collection keeps the approved menu.
 */
function publishedOrFallback<T>(
  required: string[],
  present: Set<string>,
  hidden: Set<string>,
  published: T[],
  fallback: T[],
): T[] {
  if (!published.length || !coversRequired(required, present, hidden)) return fallback
  return published
}

function resolveNavItems(items: NonNullable<CmsNavigation>['headerItems']): {
  items: ChromeNavItem[]
  present: Set<string>
  hidden: Set<string>
} {
  const present = new Set<string>()
  const hidden = new Set<string>()
  if (!Array.isArray(items)) return { items: [], present, hidden }

  const resolved = items.flatMap((item) => {
    const link = resolveCmsLink(item?.link)
    const label = item?.menuLabel?.trim() || link?.label
    const children = (item?.children ?? []).flatMap((child) => {
      const childLink = resolveCmsLink(child?.link)
      if (!childLink) return []
      if (item?.hidden || child?.hidden) {
        hidden.add(childLink.href)
        return []
      }
      present.add(childLink.href)
      return [childLink]
    })

    if (link) {
      if (item?.hidden) hidden.add(link.href)
      else present.add(link.href)
    }

    if (item?.hidden || !label || (!link && children.length === 0)) return []

    return [
      {
        label,
        ...(link && !item?.hidden
          ? { href: link.href, ...(link.openInNewTab ? { openInNewTab: true } : {}) }
          : {}),
        ...(children.length ? { children } : {}),
      },
    ]
  })

  return { items: resolved, present, hidden }
}

function resolveFooterColumns(columns: NonNullable<CmsNavigation>['footerColumns']): {
  columns: FooterColumn[]
  present: Set<string>
  hidden: Set<string>
} {
  const present = new Set<string>()
  const hidden = new Set<string>()
  if (!Array.isArray(columns)) return { columns: [], present, hidden }

  const resolved = columns.flatMap((column) => {
    const title = column?.title?.trim()
    const links = (column?.links ?? []).flatMap((item) => {
      const link = resolveCmsLink(item?.link)
      if (!link) return []
      if (item?.hidden) {
        hidden.add(link.href)
        return []
      }
      present.add(link.href)
      return [link]
    })
    return title && links.length ? [{ title, links }] : []
  })

  return { columns: resolved, present, hidden }
}

function resolveFooterItems(items: NonNullable<CmsNavigation>['footerItems']): {
  items: ChromeLink[]
  present: Set<string>
  hidden: Set<string>
} {
  const present = new Set<string>()
  const hidden = new Set<string>()
  if (!Array.isArray(items)) return { items: [], present, hidden }

  const resolved = items.flatMap((item) => {
    const link = resolveCmsLink(item?.link)
    if (!link) return []
    if (item?.hidden) {
      hidden.add(link.href)
      return []
    }
    present.add(link.href)
    return [link]
  })

  return { items: resolved, present, hidden }
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
  const header = resolveNavItems(navigation?.headerItems)
  const footer = resolveFooterItems(navigation?.footerItems)
  const columns = resolveFooterColumns(navigation?.footerColumns)
  const legal = resolveFooterItems(navigation?.legalItems)
  const social = settings?.socialLinks
  const locationLine = formatAddress(settings?.address)
  const siteName = settings?.siteName?.trim()
  const email = settings?.email?.trim()
  const phone = settings?.phone?.trim()
  const tagline = settings?.footerTagline?.trim()
  const bookCta = resolveCmsLink(settings?.bookingCta)

  return {
    siteName: siteName || siteChromeFallback.siteName,
    primaryNav: publishedOrFallback(
      hrefsOf(siteChromeFallback.primaryNav),
      header.present,
      header.hidden,
      header.items,
      siteChromeFallback.primaryNav,
    ),
    footerNav: publishedOrFallback(
      siteChromeFallback.footerNav.map((item) => item.href),
      footer.present,
      footer.hidden,
      footer.items,
      siteChromeFallback.footerNav,
    ),
    footerColumns: publishedOrFallback(
      siteChromeFallback.footerColumns.flatMap((column) => column.links.map((link) => link.href)),
      columns.present,
      columns.hidden,
      columns.columns,
      siteChromeFallback.footerColumns,
    ),
    legalNav: publishedOrFallback(
      siteChromeFallback.legalNav.map((item) => item.href),
      legal.present,
      legal.hidden,
      legal.items,
      siteChromeFallback.legalNav,
    ),
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
