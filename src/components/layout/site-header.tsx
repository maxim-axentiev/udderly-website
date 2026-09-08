import { Link } from '@tanstack/react-router'

import { Container } from '@/components/layout/container'
import { SITE_NAME } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container className="flex items-center py-4">
        <Link to="/" className="text-sm font-medium text-foreground">
          {SITE_NAME}
        </Link>
      </Container>
    </header>
  )
}
