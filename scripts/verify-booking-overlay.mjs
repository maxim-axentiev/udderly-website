/** Detect pages that expose a FareHarbor overlay link without the loader. */
export function bookingOverlayIssues(html) {
  const bookingLinks = [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)]
    .map((match) => match[2].replaceAll('&amp;', '&'))
    .filter((href) => {
      try {
        const url = new URL(href)
        return url.protocol === 'https:' && url.hostname === 'fareharbor.com' &&
          url.pathname.startsWith('/embeds/book/')
      } catch { return false }
    })
  const scriptPresent = /<script\b[^>]*\bsrc\s*=\s*["']https:\/\/fareharbor\.com\/embeds\/api\/v1\/\?autolightframe=yes["']/i.test(html)
  return bookingLinks.length && !scriptPresent
    ? ['Verified FareHarbor booking links are present without the overlay loader']
    : []
}
