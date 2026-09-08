export function buildRobotsTxt(canonicalOrigin?: string): string {
  if (!canonicalOrigin) {
    return ['User-agent: *', 'Disallow: /', ''].join('\n')
  }

  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${canonicalOrigin}/sitemap.xml`,
    '',
  ].join('\n')
}
