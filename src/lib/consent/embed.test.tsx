import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { OptionalEmbed } from '@/components/consent/optional-embed'
import { TowerOfGoatsPage } from '@/components/experience/tower-of-goats-page'

const MAP = 'https://www.google.com/maps?q=Bright&output=embed'
const VIDEO = 'https://www.youtube-nocookie.com/embed/BhDlGWU_5IM?rel=0'

describe('optional embeds', () => {
  it('keeps a map and a video unloaded until the visitor asks', () => {
    const map = renderToStaticMarkup(
      createElement(OptionalEmbed, {
        title: 'Farm map',
        src: MAP,
        actionLabel: 'Load map',
        description: 'This map is hosted by Google. It stays off until you load it.',
      }),
    )
    const video = renderToStaticMarkup(
      createElement(OptionalEmbed, {
        title: 'Farm video',
        src: VIDEO,
        actionLabel: 'Load video',
        description: 'This video stays off until you load it.',
      }),
    )

    expect(map).toContain('Load map')
    expect(map).not.toContain('<iframe')
    expect(map).not.toContain('output=embed')
    expect(video).toContain('Load video')
    expect(video).not.toContain('<iframe')
    expect(video).not.toContain('youtube-nocookie.com')
  })

  it('does not put the Google map frame on the Tower of Goats page', () => {
    const html = renderToStaticMarkup(createElement(TowerOfGoatsPage))
    expect(html).toContain('Load map')
    expect(html).toContain('Get directions')
    expect(html).not.toContain('output=embed')
    expect(html).not.toContain('<iframe')
  })
})