import { Container } from '@/components/layout/container'

export function NotFoundPage() {
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-medium">This page is not available</h1>
      <p className="mt-3 text-muted">
        The requested URL is not part of this website.
      </p>
    </Container>
  )
}
