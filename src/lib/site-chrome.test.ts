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
      'Come Do Something Udderly Ridiculous',
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
    expect(chrome.primaryNav[1]?.label).toBe('Gift Cards')
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
              internalLink: { _type: 'experience', slug: 'farm-visit' },
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

    expect(chrome.footerNav).toEqual([{ label: 'Visit us', href: '/farm-visit' }])
    expect(chrome.email).toBe('hello@example.com')
    expect(chrome.phone).toBe('519-555-0100')
    expect(chrome.locationLine).toBe('123 Farm Lane · Ayr, ON · Canada')
    expect(chrome.social.tiktok).toBe('https://www.tiktok.com/@udderly')
    expect(chrome.social.facebook).toBe('https://facebook.com/udderly')
    expect(chrome.legalNav).toEqual(footerLegalNav.map((item) => ({ ...item })))
    expect(chrome.tagline).toBe(
      'Come Do Something Udderly Ridiculous',
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
              label: 'Cow day',
              linkType: 'internal',
              internalLink: { _type: 'experience', slug: 'mini-highland-cow-experience' },
            },
          },
        ],
      },
      siteSettings: {
        footerTagline: 'Come Do Something Udderly Ridiculous',
        bookingCta: {
          label: 'Book a visit',
          linkType: 'internal',
          internalLink: { _type: 'experience', slug: 'goat-yoga' },
        },
      },
    })

    expect(chrome.bookCta).toEqual({
      label: 'Book a visit',
      href: '/goat-yoga',
    })
    expect(chrome.tagline).toBe('Come Do Something Udderly Ridiculous')
    expect(chrome.legalNav).toEqual([
      {
        label: 'Privacy Policy',
        href: 'https://example.com/privacy',
        openInNewTab: true,
      },
      { label: 'Cow day', href: '/mini-highland-cow-experience' },
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
      'Come Do Something Udderly Ridiculous',
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
              internalLink: { _type: 'experience', slug: 'visit-the-farm' },
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

  it('drops unimplemented document links and keeps the local navigation fallback', () => {
    expect(documentHref('page', 'contact')).toBeUndefined()
    expect(documentHref('page', 'terms')).toBeUndefined()
    expect(documentHref('animal', 'clara')).toBeUndefined()
    expect(documentHref('animalListing', 'mini-highland-calf-june')).toBeUndefined()
    expect(documentHref('adoptionOffering', 'adopt-clara')).toBeUndefined()
    expect(documentHref('corporateProgram', 'beyond-engagement')).toBe(
      '/corporate-training/beyond-engagement',
    )
    expect(documentHref('corporateProgram', 'future-program')).toBeUndefined()
    expect(documentHref('urbortArticle', 'worlds-first-cow-wedding')).toBe(
      '/urbort-blog/worlds-first-cow-wedding',
    )
    expect(documentHref('experience', 'experiences')).toBeUndefined()
    expect(documentHref('promotion', 'spring-offer')).toBeUndefined()

    const chrome = mergeSiteChrome({
      navigation: {
        headerItems: [
          {
            link: {
              label: 'Meet the Herd',
              linkType: 'internal',
              internalLink: { _type: 'page', slug: 'meet-the-herd' },
            },
          },
        ],
        footerItems: [
          {
            link: {
              label: 'Adopt',
              linkType: 'internal',
              internalLink: { _type: 'adoptionOffering', slug: 'adopt-clara' },
            },
          },
        ],
        legalItems: [
          {
            link: {
              label: 'Terms',
              linkType: 'internal',
              internalLink: { _type: 'page', slug: 'terms' },
            },
          },
        ],
      },
    })

    expect(chrome.primaryNav).toEqual(primaryNav.map((item) => ({ ...item })))
    expect(chrome.footerNav).toEqual(footerNav.map((item) => ({ ...item })))
    expect(chrome.legalNav).toEqual(footerLegalNav.map((item) => ({ ...item })))
    expect(chrome.bookCta).toEqual({ ...bookCta })
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
