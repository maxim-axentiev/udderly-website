import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { GiftGoatCounter } from '@/components/home/gift-goat-counter'

describe('Gift A Goat counter accessibility', () => {
  it('publishes the approved count immediately for screen readers and crawlers', () => {
    const html = renderToStaticMarkup(<GiftGoatCounter target={118} />)
    expect(html).toContain('<span class="sr-only">118</span>')
    expect(html).toContain('<span aria-hidden="true">0</span>')
  })

  it('uses the configured total rather than hardcoding the fallback count', () => {
    const html = renderToStaticMarkup(<GiftGoatCounter target={245} />)
    expect(html).toContain('<span class="sr-only">245</span>')
    expect(html).toContain('<span aria-hidden="true">0</span>')
  })
})
