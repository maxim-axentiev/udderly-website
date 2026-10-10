import { describe, expect, it } from 'vitest'

import { homepageFaqs } from '@/content/homepage'
import { resolveHomepageFaqs } from '@/lib/homepage-faqs'

const pettingFarmAnswer = [
  {
    _type: 'block',
    _key: 'p1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 's1',
        text: 'Nope! The words “petting farm” give us the ick!',
      },
    ],
  },
]

const kidsAnswer = [
  {
    _type: 'block',
    _key: 'p2',
    style: 'normal',
    children: [{ _type: 'span', _key: 's2', text: 'Yup! However, please read the experience descriptions carefully.' }],
  },
  {
    _type: 'block',
    _key: 'l1',
    listItem: 'bullet',
    children: [{ _type: 'span', _key: 's3', text: 'Some activities have age restrictions.' }],
  },
]

function fixtureQuestions() {
  return homepageFaqs.map((faq) => faq.q)
}

describe('homepage FAQ fallbacks', () => {
  it('uses the existing homepage fixture when CMS data is absent', () => {
    const faqs = resolveHomepageFaqs(null)

    expect(faqs.every((faq) => faq.source === 'fixture')).toBe(true)
    expect(faqs.map((faq) => faq.question)).toEqual(fixtureQuestions())
    expect(faqs[0]).toMatchObject({
      source: 'fixture',
      question: 'Are you a petting farm?',
      a: homepageFaqs[0].a,
    })
    expect(faqs.find((faq) => faq.question === 'What is your cancellation policy?')).toMatchObject({
      source: 'fixture',
      a: 'Here you go my friend! You’ll see this cancellation policy on every experience page:',
      list: homepageFaqs[6].list,
    })
    expect(faqs.find((faq) => faq.question === 'What days and times are you open?')).toMatchObject({
      source: 'fixture',
      a: 'Spring/summer/fall | May – September:',
      a2: 'Winter | October to April:',
      list2: homepageFaqs[8].list2,
    })
  })

  it('keeps the fixture when selected references are empty', () => {
    expect(resolveHomepageFaqs({ homepageFaqs: [] }).map((faq) => faq.question)).toEqual(
      fixtureQuestions(),
    )
  })

  it('keeps the fixture when any selected FAQ is unpublished, inactive, or missing an answer', () => {
    const unpublished = resolveHomepageFaqs({
      homepageFaqs: [
        {
          faq: {
            _id: 'faq-petting',
            question: 'Are you a petting farm?',
            answer: pettingFarmAnswer,
            active: true,
          },
        },
        { faq: null },
      ],
    })
    const inactive = resolveHomepageFaqs({
      homepageFaqs: [
        {
          faq: {
            _id: 'faq-petting',
            question: 'Are you a petting farm?',
            answer: pettingFarmAnswer,
            active: false,
          },
        },
      ],
    })
    const emptyAnswer = resolveHomepageFaqs({
      homepageFaqs: [
        {
          faq: {
            _id: 'faq-empty',
            question: 'Are you a petting farm?',
            answer: [{ _type: 'block', children: [{ _type: 'span', text: '   ' }] }],
            active: true,
          },
        },
      ],
    })

    expect(unpublished.every((faq) => faq.source === 'fixture')).toBe(true)
    expect(inactive.every((faq) => faq.source === 'fixture')).toBe(true)
    expect(emptyAnswer.every((faq) => faq.source === 'fixture')).toBe(true)
    expect(unpublished.map((faq) => faq.question)).toEqual(fixtureQuestions())
  })
})

describe('homepage FAQ CMS mapping', () => {
  it('uses selected FAQ documents in array order when every reference is complete', () => {
    const faqs = resolveHomepageFaqs({
      homepageFaqs: [
        {
          faq: {
            _id: 'faq-kids',
            question: 'Are kids allowed on the farm?',
            answer: kidsAnswer,
            active: true,
          },
        },
        {
          faq: {
            _id: 'faq-petting',
            question: 'Are you a petting farm?',
            answer: pettingFarmAnswer,
            active: true,
          },
        },
      ],
    })

    expect(faqs).toEqual([
      {
        source: 'cms',
        id: 'faq-kids',
        question: 'Are kids allowed on the farm?',
        answer: kidsAnswer,
      },
      {
        source: 'cms',
        id: 'faq-petting',
        question: 'Are you a petting farm?',
        answer: pettingFarmAnswer,
      },
    ])
  })

  it('keeps Portable Text answers intact, including lists', () => {
    const faqs = resolveHomepageFaqs({
      homepageFaqs: [
        {
          faq: {
            _id: 'faq-kids',
            question: 'Are kids allowed on the farm?',
            answer: kidsAnswer,
            active: true,
          },
        },
      ],
    })

    expect(faqs).toHaveLength(1)
    expect(faqs[0]).toMatchObject({
      source: 'cms',
      answer: kidsAnswer,
    })
    expect(faqs[0]?.source === 'cms' && faqs[0].answer).toEqual(kidsAnswer)
  })
})
