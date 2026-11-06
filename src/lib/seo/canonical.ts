/**
 * Canonical origin is the only switch for production indexing behaviour.
 *
 * Read this per call (not at module scope) so server runtimes that inject
 * env at request time still see the current value.
 */
export function getCanonicalOrigin(
  env: Record<string, string | undefined> = getEnvSource(),
): string | undefined {
  const raw = env.PUBLIC_CANONICAL_ORIGIN?.trim()
  if (!raw) {
    return undefined
  }

  try {
    const url = new URL(raw)
    const hostname = url.hostname.toLowerCase()
    if (
      url.protocol !== 'https:' ||
      !hostname.includes('.') ||
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.example') ||
      ['example.com', 'example.org', 'example.net'].includes(hostname) ||
      ['.example.com', '.example.org', '.example.net'].some((suffix) => hostname.endsWith(suffix)) ||
      hostname.endsWith('.test') ||
      hostname.endsWith('.invalid') ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/' ||
      url.port
    ) {
      return undefined
    }
    return url.origin
  } catch {
    return undefined
  }
}

export function isIndexingEnabled(
  env: Record<string, string | undefined> = getEnvSource(),
): boolean {
  return Boolean(getCanonicalOrigin(env))
}

function getEnvSource(): Record<string, string | undefined> {
  const fromProcess =
    typeof process !== 'undefined' ? process.env : undefined

  return {
    PUBLIC_CANONICAL_ORIGIN:
      fromProcess?.PUBLIC_CANONICAL_ORIGIN ??
      import.meta.env.PUBLIC_CANONICAL_ORIGIN,
  }
}
