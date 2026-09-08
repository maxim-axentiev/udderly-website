import { Container } from '@/components/layout/container'
import { SITE_NAME } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="py-6">
        <p className="text-sm text-muted">{SITE_NAME}</p>
      </Container>
    </footer>
  )
}
