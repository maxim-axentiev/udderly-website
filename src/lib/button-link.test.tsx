import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode; 'aria-label'?: string; title?: string }) =>
    <a href={to} {...props}>{children}</a>,
}))

import { ButtonLink } from '@/components/ui/button'

describe('shared CTA link behavior', () => {
  it('retains accessible labels and titles on internal homepage and experiences links', () => {
    for (const href of ['/', '/experiences']) {
      const html = renderToStaticMarkup(<ButtonLink href={href} aria-label="Browse farm visits" title="Explore experiences">Explore</ButtonLink>)
      expect(html).toContain(`href="${href}"`)
      expect(html).toContain('aria-label="Browse farm visits"')
      expect(html).toContain('title="Explore experiences"')
    }
  })

  it('keeps verified overlay links in the same tab', () => {
    const href = 'https://fareharbor.com/embeds/book/udderlyridiculousfarmlife/items/336824/'
    const html = renderToStaticMarkup(<ButtonLink href={href} external={false} openInNewTab={false}>Book</ButtonLink>)
    expect(html).toContain(`href="${href}"`)
    expect(html).not.toContain('target="_blank"')
  })

  it('keeps ordinary external links in a new tab', () => {
    const html = renderToStaticMarkup(<ButtonLink href="https://example.com/" external>Directions</ButtonLink>)
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noreferrer"')
  })
})
