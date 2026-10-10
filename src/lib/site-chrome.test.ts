import { describe, expect, it } from 'vitest'

import { bookCta, footerLegalNav, footerNav, primaryNav } from '@/lib/navigation'
import {
  documentHref,
  mergeSiteChrome,
  resolveCmsLink,
  siteChromeFallback,
} from '@/lib/site-chrome'
import { SITE_NAME } from '@/lib/site'

describe('site chrome fallbacks', () => {
  it('uses hardcoded header, footer, CTA, and site name when CMS documents are absent', () => {
    const chrome = mergeSiteChrome(null)

    expect(chrome.siteName).toBe(SITE_NAME)
    expect(chrome.primaryNav).toEqual(primaryNav.map((item) => ({ ...item })))
    expect(chrome.footerNav).toEqual(footerNav.map((item) => ({ ...item })))
    expect(chrome.legalNav).toEqual(footerLegalNav.map((item) => ({ ...item })))
    expect(chrome.bookCta).toEqual({ ...bookCta })
    expect(chrome.social).toEqual({ instagram: '#instagram', tiktok: '#tiktok' })
    expect(chrome.locationLine).toContain('Ontario, Canada')
    expect(chrome.tagline).toBe(
      'Made with questionable judgement and excellent animal care.',
    )
    expect(chrome.email).toBeUndefined()
    expect(chrome.phone).toBeUndefined()
  })

  it('keeps fallback values for empty or missing fields', () => {
    const chrome = mergeSiteChrome({
      navigation: { headerItems: [], footerItems: [] },
      siteSettings: {
        siteName: '   ',
        email: '',
        socialLinks: { instagram: '', tiktok: null },
      },
    })

    expect(chrome).toEqual(siteChromeFallback)
  })
})

describe('site chrome CMS mapping', () => {
  it('updates one navigation label, one social URL, and the site name from a published CMS payload', () => {
    const headerItems = [
      {
        link: {
          label: 'Farm Days',
          linkType: 'internal',
          internalLink: { _type: 'experience', slug: 'mini-highland-cow-experience' },
        },
      },
      ...primaryNav.slice(1).map((item) => ({
        link: {
          label: item.label,
          linkType: 'external' as const,
          href: `https://example.com${item.href}`,
        },
      })),
    ]

    const chrome = mergeSiteChrome({
      navigation: { headerItems },
      siteSettings: {
        siteName: 'Udderly Test Farm',
        socialLinks: {
          instagram: 'https://instagram.com/udderlyridiculous',
        },
      },
    })

    expect(chrome.primaryNav[0]).toEqual({
      label: 'Farm Days',
      href: '/mini-highland-cow-experience',
    })
    expect(chrome.primaryNav[1]?.label).toBe('Meet the Herd')
    expect(chrome.social.instagram).toBe('https://instagram.com/udderlyridiculous')
    expect(chrome.social.tiktok).toBe('#tiktok')
    expect(chrome.siteName).toBe('Udderly Test Farm')
    expect(chrome.bookCta).toEqual({ ...bookCta })
  })

  it('maps footer items and contact details when present', () => {
    const chrome = mergeSiteChrome({
      navigation: {
        footerItems: [
          {
            link: {
              label: 'Visit us',
              linkType: 'internal',
              internalLink: { _type: 'page', slug: 'contact' },
            },
          },
        ],
      },
      siteSettings: {
        email: 'hello@example.com',
        phone: '519-555-0100',
        address: {
          line1: '123 Farm Lane',
          city: 'Ayr',
          region: 'ON',
          country: 'Canada',
        },
        socialLinks: {
          tiktok: 'https://www.tiktok.com/@udderly',
          facebook: 'https://facebook.com/udderly',
        },
      },
    })

    expect(chrome.footerNav).toEqual([{ label: 'Visit us', href: '/contact' }])
    expect(chrome.email).toBe('hello@example.com')
    expect(chrome.phone).toBe('519-555-0100')
    expect(chrome.locationLine).toBe('123 Farm Lane · Ayr, ON · Canada')
    expect(chrome.social.tiktok).toBe('https://www.tiktok.com/@udderly')
    expect(chrome.social.facebook).toBe('https://facebook.com/udderly')
    expect(chrome.legalNav).toEqual(footerLegalNav.map((item) => ({ ...item })))
    expect(chrome.tagline).toBe(
      'Made with questionable judgement and excellent animal care.',
    )
    expect(chrome.bookCta).toEqual({ ...bookCta })
  })

  it('maps booking CTA, footer tagline, and legal links from complete CMS data', () => {
    const chrome = mergeSiteChrome({
      navigation: {
        legalItems: [
          {
            link: {
              label: 'Privacy Policy',
              linkType: 'external',
              href: 'https://example.com/privacy',
              openInNewTab: true,
            },
          },
          {
            link: {
              label: 'Terms of Service',
              linkType: 'internal',
              internalLink: { _type: 'page', slug: 'terms' },
            },
          },
          {
            link: {
              label: 'Cookies Policy',
              linkType: 'internal',
              internalLink: { _type: 'page', slug: 'cookies' },
            },
          },
        ],
      },
      siteSettings: {
        footerTagline: 'Come Do Something Udderly Ridiculous',
        bookingCta: {
          label: 'Book a visit',
          linkType: 'internal',
          internalLink: { _type: 'page', slug: 'experiences' },
        },
      },
    })

    expect(chrome.bookCta).toEqual({
      label: 'Book a visit',
      href: '/experiences',
    })
    expect(chrome.tagline).toBe('Come Do Something Udderly Ridiculous')
    expect(chrome.legalNav).toEqual([
      {
        label: 'Privacy Policy',
        href: 'https://example.com/privacy',
        openInNewTab: true,
      },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookies Policy', href: '/cookies' },
    ])
  })

  it('keeps header and footer fallbacks when booking CTA, tagline, and legal links are incomplete', () => {
    const chrome = mergeSiteChrome({
      navigation: {
        legalItems: [
          {
            link: {
              label: 'Cookies Policy',
              linkType: 'internal',
              internalLink: { _type: 'page' },
            },
          },
        ],
      },
      siteSettings: {
        footerTagline: '   ',
        bookingCta: {
          label: 'Book now',
          linkType: 'external',
          href: '',
        },
      },
    })

    expect(chrome.bookCta).toEqual({ ...bookCta })
    expect(chrome.tagline).toBe(
      'Made with questionable judgement and excellent animal care.',
    )
    expect(chrome.legalNav).toEqual(footerLegalNav.map((item) => ({ ...item })))
  })

  it('maps an external booking CTA and honors same-tab vs new-tab', () => {
    const sameTab = mergeSiteChrome({
      siteSettings: {
        bookingCta: {
          label: 'Book on FareHarbor',
          linkType: 'external',
          href: 'https://fareharbor.com/embeds/book/udderly',
          openInNewTab: false,
        },
      },
    })
    const newTab = mergeSiteChrome({
      siteSettings: {
        bookingCta: {
          label: 'Book on FareHarbor',
          linkType: 'external',
          href: 'https://fareharbor.com/embeds/book/udderly',
          openInNewTab: true,
        },
      },
    })

    expect(sameTab.bookCta).toEqual({
      label: 'Book on FareHarbor',
      href: 'https://fareharbor.com/embeds/book/udderly',
      openInNewTab: false,
    })
    expect(newTab.bookCta).toEqual({
      label: 'Book on FareHarbor',
      href: 'https://fareharbor.com/embeds/book/udderly',
      openInNewTab: true,
    })
  })

  it('maps one level of header dropdown children', () => {
    const chrome = mergeSiteChrome({
      navigation: {
        headerItems: [
          {
            link: {
              label: 'Visit',
              linkType: 'internal',
              internalLink: { _type: 'page', slug: 'experiences' },
            },
            children: [
              {
                link: {
                  label: 'Cow day',
                  linkType: 'internal',
                  internalLink: { _type: 'experience', slug: 'mini-highland-cow-experience' },
                },
              },
            ],
          },
        ],
      },
    })

    expect(chrome.primaryNav[0]?.children).toEqual([
      { label: 'Cow day', href: '/mini-highland-cow-experience' },
    ])
  })
})

describe('CMS link resolution', () => {
  it('resolves experience slugs to root-level URLs', () => {
    expect(documentHref('experience', 'mini-highland-cow-experience')).toBe(
      '/mini-highland-cow-experience',
    )
    expect(
      resolveCmsLink({
        label: 'Book cows',
        linkType: 'internal',
        internalLink: { _type: 'experience', slug: 'mini-highland-cow-experience' },
      }),
    ).toEqual({
      label: 'Book cows',
      href: '/mini-highland-cow-experience',
    })
  })

  it('ignores links that cannot resolve to a URL', () => {
    expect(
      resolveCmsLink({
        label: 'Broken',
        linkType: 'internal',
        internalLink: { _type: 'experience' },
      }),
    ).toBeUndefined()
    expect(
      resolveCmsLink({
        label: 'Broken',
        linkType: 'external',
      }),
    ).toBeUndefined()
  })

  it('keeps an external new-tab flag only when it is set', () => {
    expect(
      resolveCmsLink({
        label: 'Privacy',
        linkType: 'external',
        href: 'https://example.com/privacy',
        openInNewTab: true,
      }),
    ).toEqual({
      label: 'Privacy',
      href: 'https://example.com/privacy',
      openInNewTab: true,
    })
    expect(
      resolveCmsLink({
        label: 'Terms',
        linkType: 'external',
        href: 'https://example.com/terms',
        openInNewTab: false,
      }),
    ).toEqual({
      label: 'Terms',
      href: 'https://example.com/terms',
      openInNewTab: false,
    })
  })
})
