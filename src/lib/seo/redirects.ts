/**
 * WordPress URL migration redirects.
 *
 * Before launch, populate this file from the old WordPress URL audit.
 * Do not invent redirects here.
 *
 * Supported outcomes:
 * - 301 (and other) redirects for URLs that moved
 * - 410 Gone for intentionally retired URLs
 *
 * This is not an Intra/Webflow redirect import.
 */
export type RedirectStatus = 301 | 302 | 307 | 308

export type RedirectRule = {
  from: string
  to: string
  status: RedirectStatus
}

export type RetiredUrl = {
  from: string
  status: 410
}

export const redirects: RedirectRule[] = []

export const retiredUrls: RetiredUrl[] = []

export function normalizeRedirectPath(pathname: string): string {
  if (!pathname) {
    return '/'
  }

  const [path] = pathname.split('?')
  if (!path || path === '/') {
    return '/'
  }

  return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path
}

export function matchRedirect(
  pathname: string,
  rules: RedirectRule[] = redirects,
): RedirectRule | undefined {
  const normalized = normalizeRedirectPath(pathname)
  return rules.find((rule) => normalizeRedirectPath(rule.from) === normalized)
}

export function matchRetiredUrl(
  pathname: string,
  rules: RetiredUrl[] = retiredUrls,
): RetiredUrl | undefined {
  const normalized = normalizeRedirectPath(pathname)
  return rules.find((rule) => normalizeRedirectPath(rule.from) === normalized)
}

export function migrationResponseForPath(
  pathname: string,
  options: {
    redirects?: RedirectRule[]
    retiredUrls?: RetiredUrl[]
  } = {},
): Response | undefined {
  const redirect = matchRedirect(pathname, options.redirects ?? redirects)
  if (redirect) {
    return new Response(null, {
      status: redirect.status,
      headers: {
        Location: redirect.to,
      },
    })
  }

  const retired = matchRetiredUrl(pathname, options.retiredUrls ?? retiredUrls)
  if (retired) {
    return new Response('Gone', {
      status: retired.status,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }

  return undefined
}
