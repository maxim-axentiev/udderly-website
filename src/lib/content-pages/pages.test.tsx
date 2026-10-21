import { renderToStaticMarkup } from 'react-dom/server'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/ui/button', () => ({
  ButtonLink: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}))

import { ContactPage } from '@/components/contact/contact-page'
import { LegalPolicyPage } from '@/components/legal/policy-page'
import { NewsletterPage } from '@/components/newsletter/newsletter-page'
import { UrbortArticle } from '@/components/urbort/article'
import { UrbortBoardPage } from '@/components/urbort/board'
import { resolveContactPage } from '@/lib/contact/resolve'
import { resolveLegalPage } from '@/lib/legal/resolve'
import { resolveNewsletterPage } from '@/lib/newsletter/resolve'
import { primaryNav } from '@/lib/navigation'
import {
  contactPageQuery,
  contactSettingsQuery,
  homepageFaqsQuery,
  legalPolicyQuery,
  newsletterPageQuery,
  urbortArticleBySlugQuery,
  urbortArticlesQuery,
} from '@/lib/sanity/queries'
import { createPageHead } from '@/lib/seo/page-head'
import { getStaticSitemapEntries } from '@/lib/seo/sitemap'
import { resolveUrbortArticle, resolveUrbortBoard, type UrbortImages } from '@/lib/urbort/resolve'

const images = {
  'urbort-1': '/urbort-1.webp',
  'urbort-2': '/urbort-2.webp',
  'urbort-3': '/urbort-3.webp',
  'goat-cuddles': '/goats.jpg',
  'donkey-picnic': '/donkey.jpg',
  'alpaca-walk': '/alpaca.jpg',
} satisfies UrbortImages

function body(text: string) {
  return [{ _type: 'block', children: [{ _type: 'span', text }] }]
}

describe('URBORT board', () => {
  it('shows the six approved titles without linking to unpublished articles', () => {
    const board = resolveUrbortBoard(null, [], images)
    const html = renderToStaticMarkup(<UrbortBoardPage board={board} />)

    expect(html).toContain('Udderly Ridiculous Board of Ridiculous Things')
    expect(html).toContain('World&#x27;s First Cow Wedding')
    expect(html).toContain('The Alpaca Parade')
    expect(html).toContain('Placeholder copy.')
    expect(html).not.toContain('Lorem ipsum')
    expect(html).not.toContain('/urbort-blog/worlds-first-cow-wedding')
    expect(html).not.toContain('Read more')
    expect(board.cards.every((card) => card.published === false)).toBe(true)
  })

  it('replaces one placeholder and keeps the other titles when a real article is published', () => {
    const board = resolveUrbortBoard(
      null,
      [
        {
          _id: 'article-1',
          title: "World's First Cow Wedding",
          slug: 'worlds-first-cow-wedding',
          excerpt: 'A published farm story.',
          body: body('The ceremony was held in the pasture.'),
        },
        {
          _id: 'drafts.article-2',
          title: 'Draft story',
          slug: 'draft-story',
          body: body('Hidden draft.'),
        },
        {
          _id: 'article-3',
          title: 'Inactive story',
          slug: 'inactive-story',
          active: false,
          body: body('Hidden inactive.'),
        },
      ],
      images,
    )
    const html = renderToStaticMarkup(<UrbortBoardPage board={board} />)

    expect(html).toContain('href="/urbort-blog/worlds-first-cow-wedding"')
    expect(html).toContain('A published farm story.')
    expect(html).toContain('The Alpaca Parade')
    expect(html).not.toContain('Draft story')
    expect(html).not.toContain('Inactive story')
    expect(html).not.toContain('Lorem ipsum')
  })

  it('keeps the heading and hides placeholder cards when the board says so and nothing is published', () => {
    const board = resolveUrbortBoard({ showPlaceholderCards: false, titleAccent: 'Farm stories' }, [], images)
    const html = renderToStaticMarkup(<UrbortBoardPage board={board} />)

    expect(html).toContain('Farm stories')
    expect(html).toContain('Published stories will be pinned here.')
    expect(html).not.toContain('World&#x27;s First Cow Wedding')
  })

  it('returns null for missing, draft, inactive, and empty articles', () => {
    expect(resolveUrbortArticle(null, null, images)).toBeNull()
    expect(
      resolveUrbortArticle(
        { _id: 'drafts.story', title: 'Draft', slug: 'draft', body: body('Hidden') },
        null,
        images,
      ),
    ).toBeNull()
    expect(
      resolveUrbortArticle(
        { _id: 'story', title: 'Off', slug: 'off', active: false, body: body('Hidden') },
        null,
        images,
      ),
    ).toBeNull()
    expect(resolveUrbortArticle({ _id: 'story', title: 'Empty', slug: 'empty', body: [] }, null, images)).toBeNull()
  })

  it('renders a published article body and leaves the Latin template out', () => {
    const article = resolveUrbortArticle(
      {
        _id: 'story',
        title: 'The Alpaca Parade',
        slug: 'alpaca-parade',
        author: 'Farm team',
        publishedAt: '2026-10-10T12:00:00.000Z',
        tags: ['Alpacas'],
        body: body('The parade stayed on the lane.'),
        externalLinks: [{ label: 'Watch', href: 'https://example.com/parade' }],
      },
      null,
      images,
    )
    expect(article).not.toBeNull()
    const html = renderToStaticMarkup(<UrbortArticle article={article!} />)

    expect(html).toContain('The parade stayed on the lane.')
    expect(html).toContain('Farm team')
    expect(html).toContain('Alpacas')
    expect(html).toContain('https://example.com/parade')
    expect(html).toContain('href="/urbort-blog"')
    expect(html).not.toContain('Lorem ipsum')
    expect(html).not.toContain('Video placeholder')
  })
})

describe('contact page', () => {
  it('uses published site settings and keeps the form from sending', () => {
    const page = resolveContactPage(null, {
      email: 'hello@example.com',
      phone: '555-0100',
      address: { line1: '1 Farm Lane', city: 'Bright', region: 'ON' },
      weeklyHours: [{ day: 'friday', openTime: '10:00', closeTime: '16:00' }],
      hoursNote: 'Open Friday this week.',
    })
    const html = renderToStaticMarkup(<ContactPage page={page} />)

    expect(html).toContain('hello@example.com')
    expect(html).toContain('555-0100')
    expect(html).toContain('1 Farm Lane, Bright, ON')
    expect(html).toContain('Open Friday this week.')
    expect(html).toContain('10:00 – 16:00')
    expect(html).not.toContain('Winter Hours')
    expect(html).toContain('Contact messages are not available yet.')
    expect(html).not.toContain('Thanks!')
    expect(html).toContain('disabled')
    expect(html).not.toContain('type="submit"')
  })

  it('keeps design contact details when site settings are empty and a page heading does not wipe them', () => {
    const page = resolveContactPage({ heroAccent: 'hi there' }, null)
    const html = renderToStaticMarkup(<ContactPage page={page} />)

    expect(html).toContain('hi there')
    expect(html).toContain('info@udderlyridiculousfarmlife.com')
    expect(html).toContain('1-548-225-1005')
    expect(html).toContain('906200 Township Rd 12, Bright, ON N0J 1B0')
    expect(html).toContain('Winter Hours (November to April)')
  })
})

describe('newsletter page', () => {
  it('shows the approved presentation and does not submit', () => {
    const page = resolveNewsletterPage({ title: 'Farm notes' })
    const html = renderToStaticMarkup(<NewsletterPage page={page} />)

    expect(html).toContain('Farm notes')
    expect(html).toContain('gasp, ooh, aw, and woah')
    expect(html).toContain('Newsletter signup is not available yet.')
    expect(html).not.toContain('nothing is stored')
    expect(html).toContain('disabled')
    expect(html).not.toContain('type="submit"')
  })
})

describe('legal pages', () => {
  it('renders the design fallback and ignores the cancellation policy', () => {
    const page = resolveLegalPage('privacy-policy', {
      _id: 'cancellation-policy',
      policyType: 'cancellation',
      heading: 'Cancellation policy',
      content: body('Cancel 48 hours ahead.'),
    })
    const html = renderToStaticMarkup(<LegalPolicyPage page={page} />)

    expect(html).toContain('Privacy Policy')
    expect(html).toContain('Last Updated: October 10, 2026')
    expect(html).toContain('Information We Collect')
    expect(html).not.toContain('Cancel 48 hours ahead.')
    expect(resolveLegalPage('terms-of-service', null).title).toBe('Terms of Service')
    expect(resolveLegalPage('cookies-policy', null).title).toBe('Cookies Policy')
  })

  it('lets a published matching policy replace the body without inventing sections', () => {
    const page = resolveLegalPage('cookies-policy', {
      _id: 'cookies',
      policyType: 'cookies',
      publicSlug: 'cookies-policy',
      heading: 'Cookie notes',
      revisionLabel: 'Last Updated: January 2, 2027',
      content: body('We describe the cookies we actually use.'),
    })
    const html = renderToStaticMarkup(<LegalPolicyPage page={page} />)

    expect(html).toContain('Cookie notes')
    expect(html).toContain('We describe the cookies we actually use.')
    expect(html).not.toContain('What Are Cookies?')
  })

  it('keeps the fallback body when a published policy has no content', () => {
    const page = resolveLegalPage('terms-of-service', {
      _id: 'terms',
      policyType: 'terms',
      publicSlug: 'terms-of-service',
      heading: 'Farm terms',
      content: [],
    })
    const html = renderToStaticMarkup(<LegalPolicyPage page={page} />)

    expect(html).toContain('Farm terms')
    expect(html).toContain('Website Use')
  })
})

describe('content page publishing rules', () => {
  it('queries published records only and leaves the homepage FAQ list alone', () => {
    for (const query of [urbortArticlesQuery, urbortArticleBySlugQuery, legalPolicyQuery]) {
      expect(query).toContain('active != false')
      expect(query).not.toContain('drafts.')
    }
    expect(legalPolicyQuery).toContain('policyType != "cancellation"')
    expect(legalPolicyQuery).toContain('publicSlug == $slug')
    expect(contactSettingsQuery).toContain('_id == "siteSettings"')
    expect(contactPageQuery).toContain('_id == "contactPage"')
    expect(newsletterPageQuery).toContain('_id == "newsletterPage"')
    expect(homepageFaqsQuery.startsWith('*[_id == "siteSettings"]')).toBe(true)
  })

  it('adds the new routes to the sitemap and leaves unpublished article slugs out', () => {
    const paths = getStaticSitemapEntries().map((entry) => entry.path)
    expect(paths).toEqual(expect.arrayContaining([
      '/urbort-blog',
      '/contact',
      '/newsletter',
      '/privacy-policy',
      '/terms-of-service',
      '/cookies-policy',
      '/our-story',
      '/corporate-training',
      '/experiences',
      '/tower-of-goats-discovery-trail',
      '/adopt-an-animal',
      '/animals-for-sale',
    ]))
    expect(paths).not.toContain('/urbort-blog/worlds-first-cow-wedding')
  })

  it('builds indexable metadata from fallbacks and honors a noindex override', () => {
    const head = createPageHead(resolveContactPage(null, null).seo, {
      PUBLIC_CANONICAL_ORIGIN: 'https://example.com',
    })
    expect(head.meta).toEqual(expect.arrayContaining([
      { title: 'Contact — Udderly Ridiculous Farm Life' },
      { property: 'og:title', content: 'Contact — Udderly Ridiculous Farm Life' },
    ]))

    const hidden = createPageHead(
      resolveNewsletterPage({ seo: { noIndex: true, title: 'Hidden notes' } }).seo,
      { PUBLIC_CANONICAL_ORIGIN: 'https://example.com' },
    )
    expect(hidden.meta).toEqual(
      expect.arrayContaining([{ name: 'robots', content: 'noindex, nofollow, noarchive' }]),
    )
  })

  it('leaves the current header links unchanged', () => {
    expect(primaryNav.map((item) => item.href)).toEqual([
      '/experiences',
      '/meet-the-herd',
      '/stay',
      '/adopt-an-animal',
      '/animals-for-sale',
      '/corporate',
      '/our-farm',
    ])
  })
})
