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

  return raw.replace(/\/+$/, '')
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
