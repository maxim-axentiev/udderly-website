/**
 * Run inside a newly started container before declaring a release successful.
 * Shell deployment scripts pass this file to node --input-type=module -e.
 * Uses only localhost and never submits bookings or forms.
 */
function tags(html, name) {
  return html.match(new RegExp(String.raw`<${name}\b[^>]*>`, 'gi')) ?? []
}

function attribute(tag, name) {
  return tag.match(new RegExp(String.raw`(?:^|\s)${name}\s*=\s*(["'])(.*?)\1`, 'i'))?.[2]
}

function metaRobots(html) {
  return tags(html, 'meta').filter((tag) => attribute(tag, 'name')?.toLowerCase() === 'robots')
    .map((tag) => attribute(tag, 'content')?.toLowerCase() ?? '')
}

function canonicalLinks(html) {
  return tags(html, 'link').filter((tag) => attribute(tag, 'rel')?.toLowerCase().split(/\s+/).includes('canonical'))
    .map((tag) => attribute(tag, 'href'))
}

function robotsRules(body) {
  return body.split(/\r?\n/).map((line) => line.replace(/#.*$/, '').trim().toLowerCase())
    .filter(Boolean)
}

export async function verifyReleaseRoutes(send = fetch, env = process.env) {
  const errors = []
  const request = async (path) => send('http://127.0.0.1:3000' + path, {
    redirect: 'manual',
    signal: AbortSignal.timeout(10000),
  })
  const check = (condition, message) => { if (!condition) errors.push(message) }
  for (const path of ['/health', '/', '/experiences', '/contact']) {
    try {
      const response = await request(path)
      check(response.status === 200, `${path}: expected 200, got ${response.status}`)
      if (path !== '/health' && response.status === 200) {
        const html = await response.text()
        check(/<html[\s>]/i.test(html), `${path}: expected HTML document`)
        const canonical = env.PUBLIC_CANONICAL_ORIGIN?.trim()
        if (canonical) {
          check(metaRobots(html).some((value) => /(?:^|[\s,])index(?:$|[\s,])/.test(value)) &&
            !metaRobots(html).some((value) => /(?:^|[\s,])noindex(?:$|[\s,])/.test(value)),
            `${path}: expected indexable robots metadata`)
          check(canonicalLinks(html).length === 1 && canonicalLinks(html)[0] === `${canonical}${path}`,
            `${path}: missing expected canonical URL`)
        } else {
          check(metaRobots(html).some((value) => /(?:^|[\s,])noindex(?:$|[\s,])/.test(value)),
            `${path}: expected noindex robots metadata`)
          check(canonicalLinks(html).length === 0, `${path}: unexpected staging canonical URL`)
        }
      } else await response.body?.cancel()
    } catch (error) { errors.push(`${path}: ${error.message}`) }
  }
  const retiredPaths = [
    '/mini-cattle-for-sale', '/promotions', '/cow-wedding', '/cheryl-haskett',
    '/escape-to-the-countryside-farm-glamping', '/goatscaping',
  ]
  const requiredRedirects = [
    ['/faqs', '/faq'],
    ['/private-mini-highland-experience', '/mini-highland-cow-experience'],
    ['/private-miniature-donkey-lunch-picnic', '/miniature-donkey-lunch-picnic'],
    ['/private-miniature-donkey-sunset-picnic', '/miniature-donkey-sunset-picnic'],
  ]
  for (const path of retiredPaths) {
    try {
      const response = await request(path)
      check(response.status === 404, `Retired ${path}: expected 404, got ${response.status}`)
      await response.body?.cancel()
    } catch (error) { errors.push(`Retired ${path}: ${error.message}`) }
  }
  for (const [path, destination] of requiredRedirects) {
    try {
      const response = await request(path)
      const actual = response.headers.get('location')
      check(response.status === 301 && actual === destination,
        `Redirect ${path}: expected 301 to ${destination}, got ${response.status} to ${actual}`)
      await response.body?.cancel()
    } catch (error) { errors.push(`Redirect ${path}: ${error.message}`) }
  }
  try {
    const response = await request('/robots.txt')
    const body = await response.text()
    const indexable = Boolean(env.PUBLIC_CANONICAL_ORIGIN?.trim())
    check(response.status === 200, `/robots.txt: expected 200, got ${response.status}`)
    const rules = robotsRules(body)
    check(indexable ? rules.includes('allow: /') && !rules.includes('disallow: /') : rules.includes('disallow: /'),
      '/robots.txt: unexpected crawl policy for deployment environment')
  } catch (error) { errors.push(`/robots.txt: ${error.message}`) }
  try {
    const response = await request('/sitemap.xml')
    const indexable = Boolean(env.PUBLIC_CANONICAL_ORIGIN?.trim())
    check(response.status === (indexable ? 200 : 404),
      `/sitemap.xml: expected ${indexable ? 200 : 404}, got ${response.status}`)
    if (indexable && response.status === 200) {
      const body = await response.text()
      check(body.includes('<urlset') && body.includes('<loc>'), '/sitemap.xml: missing XML entries')
    } else await response.body?.cancel()
  } catch (error) { errors.push(`/sitemap.xml: ${error.message}`) }
  return errors
}

if (process.env.RUN_RELEASE_ROUTE_CHECK === '1') {
  try {
    const errors = await verifyReleaseRoutes()
    if (errors.length) {
      for (const error of errors) console.error('Release route FAIL:', error)
      process.exitCode = 1
    } else console.log('Release route checks passed.')
  } catch (error) {
    console.error('Release route check failed:', error.message)
    process.exitCode = 1
  }
}
