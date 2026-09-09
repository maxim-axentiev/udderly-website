export function hasPortableText(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) {
    return false
  }

  return value.some((block) => {
    if (!block || typeof block !== 'object') {
      return false
    }

    const typed = block as {
      _type?: string
      children?: Array<{ text?: string }>
      asset?: unknown
      images?: unknown[]
      url?: string
    }

    if (
      typed._type === 'altImage' ||
      typed._type === 'image' ||
      typed._type === 'gallery' ||
      typed._type === 'videoEmbed'
    ) {
      return Boolean(typed.asset || typed.images?.length || typed.url)
    }

    return Boolean(
      typed.children?.some((child) => Boolean(child.text?.trim())),
    )
  })
}
