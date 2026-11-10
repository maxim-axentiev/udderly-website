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
import { HomepageContentProvider } from '@/components/home/homepage-content'
import { NewsletterSection } from '@/components/home/newsletter-section'
import { UrbortSection } from '@/components/home/urbort-section'
import { LegalPolicyPage } from '@/components/legal/policy-page'
import { NewsletterPage } from '@/components/newsletter/newsletter-page'
import { UrbortArticle } from '@/components/urbort/article'
import { UrbortBoardPage } from '@/components/urbort/board'
import { localHomepageContent } from '@/lib/homepage/model'
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
import { resolveUrbortArticle, resolveUrbortBoard } from '@/lib/urbort/resolve'

const publishedHero = {
  alt: 'A published farm photo',
  asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg' },
}

function body(text: string) {
  return [{ _type: 'block', children: [{ _type: 'span', text }] }]
}

describe('URBORT board', () => {
  it('shows the empty board instead of placeholder articles', () => {
    const board = resolveUrbortBoard({ showPlaceholderCards: true }, [])
    const html = renderToStaticMarkup(<UrbortBoardPage board={board} />)

    expect(html).toContain('Udderly Ridiculous Board of Ridiculous Things')
    expect(html).toContain('Published stories will be pinned here.')
    expect(html).not.toContain('World&#x27;s First Cow Wedding')
    expect(html).not.toContain('The Alpaca Parade')
    expect(html).not.toContain('Placeholder copy.')
    expect(html).not.toContain('/goats.jpg')
    expect(html).not.toContain('/urbort-blog/worlds-first-cow-wedding')
    expect(board.cards).toEqual([])
  })

  it('shows only published articles, in the given order, and ignores placeholder photos', () => {
    const board = resolveUrbortBoard(null, [
      {
        _id: 'article-2',
        title: 'A later story',
        slug: 'later-story',
        excerpt: 'A published farm story.',
        heroImage: publishedHero,
        body: body('The later story is published.'),
      },
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
    ])
    const html = renderToStaticMarkup(<UrbortBoardPage board={board} />)

    expect(html.indexOf('A later story')).toBeLessThan(html.indexOf('World&#x27;s First Cow Wedding'))
    expect(html).toContain('href="/urbort-blog/later-story"')
    expect(html).toContain('cdn.sanity.io')
    expect(html).toContain('A published farm photo')
    expect(html).toContain('Photo not available yet')
    expect(html).not.toContain('The Alpaca Parade')
    expect(html).not.toContain('Placeholder copy.')
    expect(html).not.toContain('/goats.jpg')
    expect(html).not.toContain('/urbort-1.webp')
    expect(html).not.toContain('Draft story')
    expect(html).not.toContain('Inactive story')
  })

  it('returns null for missing, draft, inactive, and empty articles', () => {
    expect(resolveUrbortArticle(null, null)).toBeNull()
    expect(
      resolveUrbortArticle(
        { _id: 'drafts.story', title: 'Draft', slug: 'draft', body: body('Hidden') },
        null,
      ),
    ).toBeNull()
    expect(
      resolveUrbortArticle(
        { _id: 'story', title: 'Off', slug: 'off', active: false, body: body('Hidden') },
        null,
      ),
    ).toBeNull()
    expect(resolveUrbortArticle({ _id: 'story', title: 'Empty', slug: 'empty', body: [] }, null)).toBeNull()
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
    expect(html).toContain('Online messages are being configured.')
    expect(html).toContain('mailto:hello@example.com')
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
    expect(html).toContain('mailto:info@udderlyridiculousfarmlife.com')
  })

  it('shows a working form only when delivery is configured', () => {
    const html = renderToStaticMarkup(<ContactPage page={resolveContactPage(null, null)} deliveryAvailable />)
    expect(html).toContain('type="submit"')
    expect(html).toContain('aria-describedby="contact-status"')
    expect(html).toMatch(/<p id="contact-status"[^>]*role="status"><\/p>/)
    expect(html).toContain('name="contact_extra"')
    expect(html).toMatch(/<input[^>]*required=""[^>]*maxLength="100"[^>]*name="name"/)
    expect(html).toMatch(/<input[^>]*required=""[^>]*maxLength="254"[^>]*name="email"/)
    expect(html).toMatch(/name="message"[^>]*required=""[^>]*minLength="2"[^>]*maxLength="4000"/)
    expect(html).toContain('mailto:info@udderlyridiculousfarmlife.com')
    expect(html).not.toContain('Contact messages are not available yet.')
    expect(html).not.toContain('The mail server accepted')
  })
})

describe('newsletter page', () => {
  it('renders the working Mailchimp subscription form', () => {
    const page = resolveNewsletterPage({ title: 'Farm notes' })
    const html = renderToStaticMarkup(<NewsletterPage page={page} />)

    expect(html).toContain('Farm notes')
    expect(html).toContain('gasp, ooh, aw, and woah')
    expect(html).toContain('udderlyridiculousfarmlife.us1.list-manage.com/subscribe/post')
    expect(html).toContain('name="DOB[year]"')
    expect(html).toContain('name="tags" value="6362546"')
    expect(html).toContain('name="EMAIL"')
    expect(html).toContain('type="submit"')
    expect(html).not.toContain('Newsletter signup is not available yet.')
  })
})

describe('homepage newsletter and URBORT cards', () => {
  it('connects homepage signup to Mailchimp without displaying an unverified confirmation', () => {
    const content = localHomepageContent()
    content.newsletter.confirmation =
      "Thanks for joining the Udderly Update. There's no turning back now. Good luck haha."
    const html = renderToStaticMarkup(
      <HomepageContentProvider content={content}>
        <NewsletterSection />
      </HomepageContentProvider>,
    )

    expect(html).toContain('udderlyridiculousfarmlife.us1.list-manage.com/subscribe/post')
    expect(html).toContain('name="EMAIL"')
    expect(html).toContain('name="DOB[day]"')
    expect(html).toContain('newsletter-first-mobile')
    expect(html).toContain('newsletter-left-upper-desktop')
    expect(html).toContain('lg:hidden')
    expect(html).toContain('type="submit"')
    expect(html).not.toContain('Newsletter signup is not available yet.')
    expect(html).not.toContain('Thanks for joining')
    expect(html).not.toContain('nothing is stored')
    expect(html).not.toContain('Placeholder confirmation')
  })

  it('uses Explore the blog when a card only links to the blog landing page', () => {
    const content = localHomepageContent()
    const [first, second, third] = content.urbort.articles
    if (!first || !second || !third) throw new Error('Homepage URBORT cards are missing.')
    content.urbort.cardLabel = 'Read the article'
    content.urbort.articles = [
      { ...first, href: '/urbort-blog' },
      { ...second, href: '/urbort-blog/' },
      { ...third, href: '/urbort-blog/published-story' },
    ]
    const html = renderToStaticMarkup(
      <HomepageContentProvider content={content}>
        <UrbortSection />
      </HomepageContentProvider>,
    )

    expect(html).toContain('Cow Wedding')
    expect(html).toContain(third.title)
    expect(html).toContain('Explore the blog')
    expect(html).toContain('href="/urbort-blog/published-story"')
    expect(html.match(/Read the article/g)).toHaveLength(1)
    expect(html).not.toContain('href="/urbort-blog/viral-alpaca')
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

  it('rejects a published policy assigned to the wrong legal page type', () => {
    const page = resolveLegalPage('privacy-policy', {
      _id: 'misassigned-terms',
      policyType: 'terms',
      publicSlug: 'privacy-policy',
      heading: 'Wrong legal document',
      seo: { title: 'Wrong SEO title', description: 'Wrong description' },
      content: body('This is not a privacy policy.'),
    })
    const html = renderToStaticMarkup(<LegalPolicyPage page={page} />)
    expect(page.title).toBe('Privacy Policy')
    expect(page.seo.title).not.toBe('Wrong SEO title')
    expect(html).not.toContain('This is not a privacy policy.')
    expect(html).toContain('Information We Collect')
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
      heading: 'Unapproved draft terms',
      revisionLabel: 'Last Updated: January 2, 2027',
      seo: { title: 'Unapproved terms', description: 'Unapproved copy', noIndex: false },
      content: [],
    })
    const html = renderToStaticMarkup(<LegalPolicyPage page={page} />)

    expect(page.title).toBe('Terms of Service')
    expect(page.seo.title).not.toBe('Unapproved terms')
    expect(html).toContain('Last Updated: October 10, 2026')
    expect(html).not.toContain('Unapproved draft terms')
    expect(html).not.toContain('January 2, 2027')
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

  it('leaves the approved header link structure unchanged', () => {
    expect(primaryNav.map((item) => item.label)).toEqual([
      'Experiences',
      'Gift Cards',
      'Animals for Sale',
      'Adopt an Animal',
      'Corporate Training',
      'Explore',
      'About',
      'Contact',
    ])
  })
})
