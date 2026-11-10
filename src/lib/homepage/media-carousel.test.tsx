import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { MediaCarousel } from '@/components/home/media-carousel'
import { HomepageContentProvider } from '@/components/home/homepage-content'
import { localHomepageContent } from '@/lib/homepage/model'

function renderWithVideos(count: number) {
  const fixture = localHomepageContent()
  const content = {
    ...fixture,
    media: { ...fixture.media, videos: fixture.media.videos.slice(0, count) },
  }
  return renderToStaticMarkup(<HomepageContentProvider content={content}><MediaCarousel /></HomepageContentProvider>)
}

describe('homepage media carousel', () => {
  it('does not render an empty carousel', () => {
    expect(renderWithVideos(0)).toBe('')
  })

  it('does not offer ineffective previous and next controls with one video', () => {
    const html = renderWithVideos(1)
    expect(html).toContain('aria-label="Play')
    expect(html).toContain('i.ytimg.com/vi/')
    expect(html).not.toContain('This video stays off until you load it.')
    expect(html).not.toContain('aria-label="Previous video"')
    expect(html).not.toContain('aria-label="Next video"')
  })

  it('preserves previous and next controls with multiple videos', () => {
    const html = renderWithVideos(2)
    expect(html).toContain('aria-label="Previous video"')
    expect(html).toContain('aria-label="Next video"')
  })
})
