import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { ExperienceDetail } from '@/components/experience/experience-detail'
import { FEAST_ON } from '@/lib/experiences/approved-listing'
import { resolveExperienceDetail } from '@/lib/experiences/detail'
import { TOWER_OF_GOATS_TITLE } from '@/lib/experiences/tower-of-goats'
import { experienceBySlugQuery, experienceHubQuery } from '@/lib/sanity/queries'
import type { ExperiencePageData } from '@/lib/sanity/types'
import { routableExperienceSlug } from '@/lib/routes/paths'
import { buildRobotsTxt } from '@/lib/seo/robots'

const images = {
  goats: '/goats.webp',
  'goat-cuddles': '/goat-cuddles.jpg',
  'goat-icon-1': '/goat-1.jpg',
  'goat-icon-2': '/goat-2.jpg',
  'goat-icon-3': '/goat-3.jpg',
  'alpaca-walk': '/alpaca.jpg',
  'donkey-picnic': '/donkey.jpg',
  'highland-hero': '/highland.jpg',
  feast: '/feast.webp',
}

const awards = [{ year: '2026', src: '/award.png' }]

function experience(overrides: Partial<ExperiencePageData> & Pick<ExperiencePageData, 'title' | 'slug'>): ExperiencePageData {
  return {
    _id: overrides.slug,
    shortDescription: null,
    body: null,
    heroImage: null,
    gallery: null,
    category: 'farmExperience',
    animalSpecies: null,
    season: null,
    duration: null,
    priceDisplay: null,
    groupSize: null,
    sessionType: null,
    ageGuidance: null,
    visitorInfo: null,
    accessibilityInfo: null,
    bookingUrl: null,
    animals: null,
    faqs: null,
    testimonials: null,
    cancellationPolicy: null,
    welfarePolicy: null,
    seo: null,
    ...overrides,
  }
}

function htmlFor(page: ExperiencePageData) {
  return renderToStaticMarkup(createElement(ExperienceDetail, { page: resolveExperienceDetail(page, images), awards }))
}

describe('experience detail resolution', () => {
  it('keeps the published query on published, active experiences', () => {
    expect(experienceBySlugQuery).toContain('active != false')
    expect(experienceBySlugQuery).toContain('seasonLabel')
    expect(experienceBySlugQuery).toContain('practicalTips')
    expect(experienceBySlugQuery).toContain('instructor')
    expect(experienceBySlugQuery).toContain('feastOn')
    expect(experienceBySlugQuery).toContain('signatureExperience')
    expect(experienceBySlugQuery).not.toContain('drafts.')
    expect(experienceHubQuery).not.toContain('feastOn')
    expect(experienceHubQuery).not.toContain('instructor')
    expect(buildRobotsTxt()).toBe('User-agent: *\nDisallow: /\n')
    expect(TOWER_OF_GOATS_TITLE).toBe('General Admission')
    expect(routableExperienceSlug('tower-of-goats-discovery-trail')).toBeUndefined()
    expect(routableExperienceSlug('goat-cuddles')).toBe('goat-cuddles')
    expect(routableExperienceSlug('not a slug')).toBeUndefined()
  })

  it('renders Goat Yoga with an instructor and without unrelated sections', () => {
    const page = resolveExperienceDetail(experience({
      title: 'Goat Yoga',
      slug: 'goat-yoga',
      shortDescription: 'Placeholder copy. Downward dog, upward goat.',
      instructor: { heading: 'Meet your yoga instructor.', body: 'A certified instructor leads the class.\n\nMats are provided.' },
    }), images)
    const html = htmlFor(experience({
      title: 'Goat Yoga',
      slug: 'goat-yoga',
      shortDescription: 'Placeholder copy. Downward dog, upward goat.',
      instructor: page.instructor ? { heading: page.instructor.heading, body: page.instructor.paragraphs.join('\n\n') } : null,
    }))

    expect(page.intro).toBeUndefined()
    expect(page.instructor?.paragraphs).toEqual(['A certified instructor leads the class.', 'Mats are provided.'])
    expect(page.feast).toBeUndefined()
    expect(page.signature).toBeUndefined()
    expect(page.gallery.map((image) => image.src)).toContain('/goat-cuddles.jpg')
    expect(page.titleLead).toBe('Goat')
    expect(page.titleAccent).toBe('Yoga')
    expect(page.gallery.map((image) => image.src)).not.toContain('/alpaca.jpg')
    expect(html).toContain('id="your-instructor"')
    expect(html).not.toContain('id="feast-on"')
    expect(html).not.toContain('id="signature-experience"')
    expect(html).not.toContain('$18')
    expect(html).not.toContain('#book')
  })

  it('uses the approved Goat Cuddles intro without copying its facts elsewhere', () => {
    const cuddles = resolveExperienceDetail(experience({
      title: 'Goat Cuddles',
      slug: 'goat-cuddles',
      shortDescription: 'Come meet our 4-legged toddlers, teenagers and adults. Slow down, snuggle up, and experience the pure joy of goat cuddles.',
    }), images)
    const recess = resolveExperienceDetail(experience({ title: 'Goat Recess', slug: 'goat-recess' }), images)

    expect(cuddles.intro).toContain('4-legged toddlers')
    expect(recess.intro).toBeUndefined()
    expect(recess.details).toEqual([])
    expect(recess.gallery.some((image) => image.src === '/goat-cuddles.jpg')).toBe(true)
    expect(cuddles.bookingUrl).toBeUndefined()
  })

  it('shows FeastON for an alpaca picnic only when that experience enables it', () => {
    const plain = resolveExperienceDetail(experience({ title: 'Alpaca Lunch Picnic', slug: 'alpaca-lunch-picnic' }), images)
    const enabled = resolveExperienceDetail(experience({
      title: 'Alpaca Lunch Picnic',
      slug: 'alpaca-lunch-picnic',
      feastOn: { enabled: true },
    }), images)

    expect(plain.feast).toBeUndefined()
    expect(plain.gallery.map((image) => image.src)).toEqual(['/alpaca.jpg'])
    expect(enabled.feast?.paragraphs).toEqual([...FEAST_ON.paragraphs])
    expect(enabled.feast?.lead).toBe('We eat')
    expect(enabled.feast?.accent).toBe('and serve local.')
    expect(enabled.gallery.some((image) => image.src.includes('goat'))).toBe(false)
  })

  it('keeps Highland and donkey photos on their own experiences', () => {
    const cow = resolveExperienceDetail(experience({ title: 'Mini Highland Cow Experience', slug: 'mini-highland-cow-experience' }), images)
    const donkey = resolveExperienceDetail(experience({
      title: 'Private Miniature Donkey Sunset Picnic',
      slug: 'private-miniature-donkey-sunset-picnic',
      feastOn: { enabled: true },
    }), images)

    expect(cow.gallery.map((image) => image.src)).toEqual(['/highland.jpg'])
    expect(cow.feast).toBeUndefined()
    expect(donkey.gallery.map((image) => image.src)).toEqual(['/donkey.jpg'])
    expect(donkey.feast?.href).toBe(FEAST_ON.href)
    expect(donkey.signature).toBeUndefined()
  })

  it('shows FeastON and Signature sections only when Taste experiences enable them', () => {
    const bare = resolveExperienceDetail(experience({ title: 'Taste of Farm Life', slug: 'taste-of-farm-life' }), images)
    const configured = resolveExperienceDetail(experience({
      title: 'Taste of Farm Life Family Friendly',
      slug: 'taste-of-farm-life-family-friendly',
      feastOn: { enabled: true },
      signatureExperience: { enabled: true, body: 'This tasting is an official Signature Experience.' },
    }), images)

    expect(bare.feast).toBeUndefined()
    expect(bare.signature).toBeUndefined()
    expect(bare.gallery).toEqual([])
    expect(bare.hero).toBeUndefined()
    expect(configured.feast?.paragraphs).toHaveLength(2)
    expect(configured.signature?.paragraphs).toEqual(['This tasting is an official Signature Experience.'])
    expect(configured.signature?.href).toBe('https://www.ontariosouthwest.com/')
  })

  it('omits invalid images, placeholder facts, and unverified booking links', () => {
    const page = resolveExperienceDetail(experience({
      title: 'Honey Bee Experience',
      slug: 'honey-bee-experience',
      shortDescription: 'Placeholder description. Busy bees.',
      priceDisplay: 'Placeholder price',
      bookingUrl: '#book',
      heroImage: { alt: 'Missing file' },
      gallery: [{ alt: 'Also missing' }],
    }), images)
    const html = renderToStaticMarkup(createElement(ExperienceDetail, { page, awards }))

    expect(page.hero).toBeUndefined()
    expect(page.gallery).toEqual([])
    expect(page.intro).toBeUndefined()
    expect(page.details).toEqual([])
    expect(page.bookingUrl).toBeUndefined()
    expect(html).not.toContain('fareharbor')
    expect(html).not.toContain('#book')
    expect(html).not.toContain('$18')
    expect(html).toContain('Newsletter signup is not available yet.')
    expect(html).toContain('disabled=""')
  })

  it('renders a published booking URL and a published cancellation policy', () => {
    const page = resolveExperienceDetail(experience({
      title: 'Goat Cuddles',
      slug: 'goat-cuddles',
      bookingUrl: 'https://example.com/book',
      priceDisplay: 'Test only $1',
      practicalTips: ['Wear clothes you can spare.', 'Placeholder tip. Ignore this.'],
      cancellationPolicy: {
        heading: 'Cancellation Policy',
        internalName: 'Standard',
        active: true,
        content: [{ _type: 'block', children: [{ _type: 'span', text: 'Cancellations within 48 hours are non-refundable.' }] }],
      },
    }), images)
    const html = renderToStaticMarkup(createElement(ExperienceDetail, { page, awards }))

    expect(page.bookingUrl).toBe('https://example.com/book')
    expect(page.details.map((detail) => detail.value)).toEqual(['Test only $1'])
    expect(page.tips).toEqual(['Wear clothes you can spare.'])
    expect(html).toContain('href="https://example.com/book"')
    expect(html).toContain('Cancellations within 48 hours are non-refundable.')
    expect(html).not.toContain('Placeholder tip')
  })

  it('hides an inactive or empty cancellation policy', () => {
    const inactive = resolveExperienceDetail(experience({
      title: 'Goat Yoga',
      slug: 'goat-yoga',
      cancellationPolicy: {
        heading: 'Cancellation Policy',
        internalName: null,
        active: false,
        content: [{ _type: 'block', children: [{ _type: 'span', text: 'This should stay hidden.' }] }],
      },
    }), images)
    const missing = resolveExperienceDetail(experience({ title: 'Goat Yoga', slug: 'goat-yoga' }), images)

    expect(inactive.cancellation).toBeUndefined()
    expect(missing.cancellation).toBeUndefined()
  })

  it('keeps the shared section order', () => {
    const html = htmlFor(experience({
      title: 'Goat Yoga',
      slug: 'goat-yoga',
      introductionHeading: 'Stretch first\nThen the goats.',
      practicalHeading: 'Before you visit\nRead this.',
      practicalTips: ['Mats are on the lawn.'],
      instructor: { heading: 'Meet your yoga instructor.', body: 'A real instructor bio.' },
      testimonials: [{ _id: '1', quote: 'A real guest note.', guestName: 'Sam', source: null, sourceUrl: null, image: null }],
      animals: [{ _id: 'a', name: 'Pekoe', slug: 'pekoe', shortIntro: 'Shoelace inspector.', funFact: null, status: 'active', speciesTitle: 'Goat', profileImage: null }],
      welfareNote: 'The animals choose whether to join.',
      feastOn: { enabled: true },
      signatureExperience: { enabled: true },
    }))
    const order = [
      'experience-hero',
      'TripAdvisor awards',
      'experience-introduction',
      'important-information',
      'id="reviews"',
      'meet-the-animals',
      'your-instructor',
      'id="welfare"',
      'signature-experience',
      'feast-on',
      'newsletter',
      'id="location"',
    ]
    let cursor = -1
    for (const marker of order) {
      const index = html.indexOf(marker)
      expect(index).toBeGreaterThan(cursor)
      cursor = index
    }
    expect(html).toContain('Stretch first<br/><span class="text-stroke">Then the goats.</span>')
    expect(html).toContain('We eat<br/><span class="text-stroke">and serve local.</span>')
    expect(html).toContain('>✓</span>')
    expect(html).toContain('-rotate-1')
    expect(html).toContain('aria-roledescription="carousel"')
    expect(html).toContain('aria-label="Previous — Guest reviews"')
    expect(html).toContain('aria-label="Next — Meet the animals"')
    expect(html).toContain('aria-label="Previous photo"')
    expect(html).toContain('w-[85%]')
  })

  it('keeps the goat welfare photo off other species', () => {
    const goat = resolveExperienceDetail(experience({
      title: 'Goat Yoga',
      slug: 'goat-yoga',
      welfareNote: 'The animals choose whether to join.',
    }), images)
    const cow = resolveExperienceDetail(experience({
      title: 'Mini Highland Cow Experience',
      slug: 'mini-highland-cow-experience',
      welfareNote: 'The cows choose whether to join.',
    }), images)
    const cowHtml = htmlFor(experience({
      title: 'Mini Highland Cow Experience',
      slug: 'mini-highland-cow-experience',
      welfareNote: 'The cows choose whether to join.',
    }))

    expect(goat.welfare?.image?.src).toBe('/goat-2.jpg')
    expect(cow.welfare?.image).toBeUndefined()
    expect(cowHtml).toContain('id="welfare"')
    expect(cowHtml).not.toContain('/goat-2.jpg')
    expect(cowHtml).not.toContain('Happy goats')
  })

  it('collapses a long review without inventing a star rating', () => {
    const quote = `A real guest wrote ${'more detail '.repeat(20)}about the visit.`
    const html = htmlFor(experience({
      title: 'Goat Cuddles',
      slug: 'goat-cuddles',
      testimonials: [{ _id: '1', quote, guestName: 'Sam', source: null, sourceUrl: null, image: null }],
    }))

    expect(html).toContain('Read full review')
    expect(html).toContain('aria-expanded="false"')
    expect(html).not.toContain(quote)
    expect(html).not.toContain('Five out of five')
  })
})
