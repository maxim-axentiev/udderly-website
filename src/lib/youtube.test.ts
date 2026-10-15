import { describe, expect, it } from 'vitest'

import { getHomepageVideoEmbedUrl, getYoutubeEmbedUrl } from './youtube'

describe('getYoutubeEmbedUrl', () => {
  it('converts watch URLs to youtube-nocookie embeds', () => {
    expect(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=BhDlGWU_5IM')).toBe(
      'https://www.youtube-nocookie.com/embed/BhDlGWU_5IM?rel=0',
    )
  })

  it('preserves start time from the t query param', () => {
    expect(
      getYoutubeEmbedUrl('https://www.youtube.com/watch?v=tY7SLm8JoTI&t=277s'),
    ).toBe('https://www.youtube-nocookie.com/embed/tY7SLm8JoTI?rel=0&start=277')
  })

  it('embeds Vimeo pages on the homepage player', () => {
    expect(getHomepageVideoEmbedUrl('https://vimeo.com/123456789')).toBe(
      'https://player.vimeo.com/video/123456789',
    )
  })
})
