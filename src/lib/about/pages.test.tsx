import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/ui/button', () => ({
  ButtonLink: ({
    href,
    children,
    className,
  }: {
    href: string
    children: ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

import { FarmFaq } from '@/components/about/faq-page'
import { OurStory } from '@/components/about/our-story-page'
import { Team } from '@/components/about/team-page'
import { VisionValues } from '@/components/about/vision-values-page'
import { primaryNav } from '@/lib/navigation'
import { homepageFaqsQuery, faqPageQuery, publishedFaqsQuery, teamMembersQuery } from '@/lib/sanity/queries'
import { createPageHead } from '@/lib/seo/page-head'

import type { AboutImages } from './images'
import { resolveFaqPage, resolveOurStory, resolveTeam, resolveVisionValues } from './resolve'

const images: AboutImages = {
  hero: '/hero.webp',
  owners: '/owners.webp',
  iceCream: '/ice.webp',
  highland: '/highland.jpg',
  farmStore: '/store.webp',
  alpaca: '/alpaca.jpg',
  goats: '/goats.jpg',
  donkey: '/donkey.jpg',
}

function answer(text: string) {
  return [{ _type: 'block', children: [{ _type: 'span', text }] }]
}

const publishedFaqs = [
  { _id: 'petting', question: 'Are you a petting farm?', answer: answer('Not a petting farm.'), category: 'animals', sortOrder: 10, active: true },
  { _id: 'kids', question: 'Are kids allowed on the farm?', answer: answer('Yes, with age limits.'), category: 'visiting', sortOrder: 30, active: true },
  { _id: 'reservation', question: 'Do I need a reservation to visit the farm?', answer: answer('Book experiences ahead.'), category: 'booking', sortOrder: 40, active: true },
  { _id: 'weather', question: 'What happens when there is bad weather?', answer: answer('Most experiences continue.'), category: 'booking', sortOrder: 20, active: true },
  { _id: 'hidden', question: 'Hidden question?', answer: answer('Should stay hidden.'), category: 'booking', sortOrder: 1, active: false },
  { _id: 'drafts.faq-secret', question: 'Draft question?', answer: answer('Draft answer.'), category: 'visiting', sortOrder: 1, active: true },
  { _id: 'glamping', question: 'Is glamping available?', answer: answer('Not yet published as a page.'), category: 'glamping', sortOrder: 50, active: true },
]

describe('about pages', () => {
  it('renders the four Lovable layouts from safe fallbacks', () => {
    const story = renderToStaticMarkup(<OurStory page={resolveOurStory(null, images)} />)
    expect(story).toContain('How it all began')
    expect(story).toContain('Growing together')
    expect(story).toContain('The ice-cream idea')
    expect(story).toContain('honouring Alvin')
    expect(story).toContain('Where our journey meets yours')
    expect(story).toContain('March 2019')
    expect(story).toContain('Cheryl')
    expect(story).toContain('Book an Experience')

    const vision = renderToStaticMarkup(<VisionValues page={resolveVisionValues(null, images)} />)
    expect(vision).toContain('Vision &')
    expect(vision).toContain('Photos from the farm')
    expect(vision).toContain('Come see it all in person.')
    expect(vision).not.toContain('Our vision')
    expect(vision).not.toContain('Placeholder copy.')
    expect(vision).not.toContain('Value one')
    expect(vision).not.toContain('Value five')

    const emptyTeam = resolveTeam(null, [], images)
    expect(emptyTeam.members).toEqual([])
    expect(emptyTeam.placeholders).toBe(false)
    const team = renderToStaticMarkup(<Team page={emptyTeam} />)
    expect(team).toContain('The')
    expect(team).toContain('The animals would love to meet you.')
    expect(team).not.toContain('sm:grid-cols-2')
    expect(team).not.toContain('Team member 1')
    expect(team).not.toContain('Placeholder bio.')
    expect(team).not.toContain('Placeholder role')
    expect(team).not.toContain('not a staff portrait')

    const faq = renderToStaticMarkup(<FarmFaq page={resolveFaqPage(null, [], images)} />)
    expect(faq).toContain('You have questions.')
    expect(faq).toContain('Still curious? Come see for yourself')
    expect(faq).not.toContain('Placeholder farm question')
    expect(faq).not.toContain('<details')
  })

  it('keeps every story chapter when a published page only overrides one', () => {
    const page = resolveOurStory(
      {
        chapters: [
          { sectionId: 'how-it-all-began', title: 'Where it started', enabled: true },
          { sectionId: 'growing-together', enabled: false },
        ],
        seo: { title: 'Story title' },
      },
      images,
    )
    expect(page.chapters.map((chapter) => chapter.title)).toEqual([
      'Where it started',
      'The ice-cream idea',
      "Udderly Ridiculous Farm Life - honouring Alvin's legacy",
      'Where our journey meets yours',
    ])
    expect(page.chapters[0]?.paragraphs[0]).toContain('earth-shattering hug')
    expect(page.seo.title).toBe('Story title')
    const html = renderToStaticMarkup(<OurStory page={page} />)
    expect(html).toContain('March 2019')
    expect(html).not.toContain('Growing together')
  })

  it('rejects credentialed About page CTA destinations while keeping approved links', () => {
    const baseline = resolveVisionValues(null, images).cta?.href
    expect(resolveVisionValues({ ctaHref: 'https://user:secret@example.com/visit' }, images).cta?.href).toBe(baseline)
    expect(resolveVisionValues({ ctaHref: 'https://example.com/visit' }, images).cta?.href).toBe('https://example.com/visit')
    expect(resolveVisionValues({ ctaHref: '/experiences' }, images).cta?.href).toBe('/experiences')
  })

  it('renders vision and values only from complete published content', () => {
    const incomplete = resolveVisionValues(
      {
        visionHeading: 'Our vision',
        values: [{ title: '', description: '' }, { title: 'Care', description: '' }],
        showGallery: false,
      },
      images,
    )
    expect(incomplete.vision).toBeNull()
    expect(incomplete.values).toBeNull()
    expect(incomplete.gallery).toBeNull()
    expect(incomplete.cta?.heading).toBe('Come see it all in person.')

    const placeholders = resolveVisionValues(
      {
        visionHeading: 'Placeholder heading',
        visionParagraphs: ['Placeholder copy. Not a vision statement.'],
        values: [{ title: 'Placeholder value', description: 'Placeholder copy. Not a value.' }],
      },
      images,
    )
    expect(placeholders.vision).toBeNull()
    expect(placeholders.values).toBeNull()
    expect(placeholders.gallery?.length).toBeGreaterThan(0)

    const replaced = resolveVisionValues(
      {
        visionHeading: 'Where we are headed',
        visionParagraphs: ['Joy for guests and animals.', ''],
        values: [
          { title: 'Care', description: 'The animals come first.' },
          { title: 'Placeholder value', description: 'A real description should not rescue a placeholder title.' },
        ],
        showVision: false,
      },
      images,
    )
    expect(replaced.vision).toBeNull()
    expect(replaced.values?.items).toEqual([{ title: 'Care', description: 'The animals come first.' }])

    const hiddenValues = resolveVisionValues(
      {
        visionHeading: 'Where we are headed',
        visionParagraphs: ['Joy for guests and animals.'],
        values: [{ title: 'Care', description: 'The animals come first.' }],
        showValues: false,
      },
      images,
    )
    expect(hiddenValues.vision).toEqual({
      heading: 'Where we are headed',
      paragraphs: ['Joy for guests and animals.'],
      image: hiddenValues.vision?.image,
    })
    expect(hiddenValues.vision?.image.src).toBe('/highland.jpg')
    expect(hiddenValues.values).toBeNull()
    const html = renderToStaticMarkup(<VisionValues page={hiddenValues} />)
    expect(html).toContain('Where we are headed')
    expect(html).toContain('Joy for guests and animals.')
    expect(html).not.toContain('The animals come first.')
  })

  it('orders published team members and does not mix them with placeholder profiles', () => {
    const page = resolveTeam(
      null,
      [
        { _id: 'b', name: 'Blair', role: 'Guide', sortOrder: 20, active: true, bio: answer('Blair keeps the barn calm.') },
        { _id: 'drafts.member', name: 'Draft Person', sortOrder: 1, active: true },
        { _id: 'hidden', name: 'Hidden Person', sortOrder: 1, active: false },
        { _id: 'a', name: 'Avery', ridiculousFact: 'Names every goat.', sortOrder: 10, active: true },
      ],
      images,
    )
    expect(page.placeholders).toBe(false)
    expect(page.members.map((member) => member.name)).toEqual(['Avery', 'Blair'])
    expect(page.members[0]?.fact).toBe('Names every goat.')
    expect(page.members[1]?.role).toBe('Guide')
    const html = renderToStaticMarkup(<Team page={page} />)
    expect(html).toContain('Avery')
    expect(html).toContain('Blair keeps the barn calm.')
    expect(html).toContain('Photo not available yet')
    expect(html).not.toContain('Team member 1')
    expect(html).not.toContain('Placeholder bio.')
    expect(html).not.toContain('Draft Person')
  })

  it('groups published FAQs into the approved accordion and hides empty placeholder groups', () => {
    const page = resolveFaqPage(null, publishedFaqs, images)
    expect(page.groups.map((group) => group.title)).toEqual([
      'Questions About Our Farm',
      'Questions About The Booking System',
      'Glamping',
    ])
    expect(page.groups[0]?.items.map((item) => item.question)).toEqual([
      'Are you a petting farm?',
      'Are kids allowed on the farm?',
    ])
    expect(page.groups[1]?.items.map((item) => item.question)).toEqual([
      'What happens when there is bad weather?',
      'Do I need a reservation to visit the farm?',
    ])
    const html = renderToStaticMarkup(<FarmFaq page={page} />)
    expect(html).toContain('<details')
    expect(html).toContain('<summary')
    expect(html).toContain('Are you a petting farm?')
    expect(html).toContain('Not a petting farm.')
    expect(html).toContain('aria-hidden="true">+')
    expect(html).not.toContain('Questions About Farm Life Experiences')
    expect(html).not.toContain('Placeholder farm question')
    expect(html).not.toContain('Hidden question')
    expect(html).not.toContain('Draft question')
  })

  it('uses a hand-picked FAQ order and still shows unpublished groups of remaining questions', () => {
    const custom = resolveFaqPage(
      {
        sections: [
          { title: 'Start here', enabled: true, questions: [publishedFaqs[2], publishedFaqs[0]] },
          { title: 'Empty group', enabled: true },
          { title: 'Booking', enabled: false, categories: ['booking'] },
        ],
      },
      publishedFaqs,
      images,
    )
    expect(custom.groups.map((group) => group.title)).toEqual(['Start here', 'Visiting the farm', 'Glamping'])
    expect(custom.groups[0]?.items.map((item) => item.id)).toEqual(['reservation', 'petting'])
    expect(custom.groups.flatMap((group) => group.items.map((item) => item.id))).not.toContain('weather')
  })

  it('builds metadata for every about path and reads published documents only', () => {
    const story = createPageHead(resolveOurStory(null, images).seo, {
      PUBLIC_CANONICAL_ORIGIN: 'https://staging.udderlyridiculousfarmlife.com',
    })
    expect(story.meta).toContainEqual({ title: 'Our Story | Udderly Ridiculous Farm Life' })
    expect(story.links).toContainEqual({
      rel: 'canonical',
      href: 'https://staging.udderlyridiculousfarmlife.com/our-story',
    })
    const hidden = createPageHead(resolveVisionValues(null, images).seo, {})
    expect(hidden.meta).toContainEqual({ name: 'robots', content: 'noindex, nofollow, noarchive' })
    expect(resolveTeam(null, [], images).seo.path).toBe('/team')
    expect(resolveFaqPage(null, [], images).seo.path).toBe('/faq')
    expect(resolveVisionValues(null, images).seo.path).toBe('/vision-values')

    expect(publishedFaqsQuery).toContain('active != false')
    expect(publishedFaqsQuery).not.toContain('drafts.')
    expect(teamMembersQuery).toContain('active != false')
    expect(teamMembersQuery).not.toContain('drafts.')
    expect(faqPageQuery).toContain('_id == "faqPage"')
    expect(faqPageQuery).toContain('active != false')
    expect(homepageFaqsQuery).toContain('_id == "siteSettings"')
    expect(primaryNav.map((item) => item.label)).toEqual([
      'Experiences',
      'Gift Cards',
      'Animals for Sale',
      'Adopt an Animal',
      'Corporate Training',
      'Team Building',
      'Experiential Tourism Development',
      'Explore',
      'About',
      'Contact',
    ])
  })
})
