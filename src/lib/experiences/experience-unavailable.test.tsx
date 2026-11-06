import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/ui/button', () => ({
  ButtonLink: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))

import { ExperienceUnavailable } from '@/components/experience/experience-unavailable'

describe('experience details unavailable state', () => {
  it('explains the temporary failure without claiming an experience is unpublished', () => {
    const html = renderToStaticMarkup(createElement(ExperienceUnavailable))
    expect(html).toContain('This experience is temporarily unavailable')
    expect(html).toContain('could not load the experience details')
    expect(html).toContain('href="/experiences"')
    expect(html).toContain('Browse farm experiences')
    expect(html).not.toContain('not part of this website')
  })
})
