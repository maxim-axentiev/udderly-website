import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function ignored(path) {
  const result = spawnSync('git', ['check-ignore', '--quiet', '--', path], { encoding: 'utf8' })
  if (result.error) throw result.error
  assert.ok([0, 1].includes(result.status), `Git ignore check failed for ${path}`)
  return result.status === 0
}

test('raw migration snapshots are excluded from accidental broad Git adds', () => {
  const rawPaths = [
    'reports/about-wordpress-migration/source/our-story.html',
    'reports/website-content-migration/export/legal.json',
    'reports/website-content-migration/urbort-source/john-ferguson.source.html',
    'reports/website-content-migration/_sanity-documents.json',
    'reports/website-content-migration/_sanity-inventory.json',
    'reports/website-content-migration/_field-report.json',
    'reports/website-content-migration/content-source-export.json',
  ]
  for (const path of rawPaths) assert.ok(ignored(path), `Raw migration source must be ignored: ${path}`)
})

test('the Git index never contains environment secrets or raw migration exports', () => {
  const result = spawnSync('git', ['ls-files', '--cached', '-z'], { encoding: 'utf8' })
  if (result.error) throw result.error
  assert.equal(result.status, 0, 'Unable to inspect tracked Git files')
  const paths = result.stdout.split('\0').filter(Boolean)
  const sensitive = paths.filter((path) => {
    const normalized = path.replaceAll('\\', '/')
    if (/(^|\/)\.env(?:\..+)?$/i.test(normalized) && !['.env.example', '.env.production.example'].includes(normalized)) return true
    if (normalized.startsWith('.local/')) return true
    if (normalized.startsWith('reports/about-wordpress-migration/source/')) return true
    if (/^reports\/website-content-migration\/(?:export|urbort-source)\//.test(normalized)) return true
    if (/^reports\/website-content-migration\/(?:_sanity-[^/]*\.json|_field-report\.json|content-source-export\.json)$/.test(normalized)) return true
    if (/\.(?:pem|p12|pfx|key)$/i.test(normalized)) return true
    return false
  })
  assert.deepEqual(sensitive, [], 'Protected files must never enter the Git index')
})

test('tracked application imports do not depend on ignored raw migration records', () => {
  const result = spawnSync('git', ['ls-files', '--cached', '-z'], { encoding: 'utf8' })
  if (result.error) throw result.error
  assert.equal(result.status, 0, 'Unable to inspect tracked sources')
  const sources = result.stdout.split('\0').filter((path) =>
    /^(src|scripts)\/.+\.(?:ts|tsx|js|mjs)$/.test(path))
  const dependent = []
  for (const path of sources) {
    const content = readFileSync(path, 'utf8')
    if (/^\s*import\b[^\n]*\bfrom\s*['"][^'"]*\/reports\/(?:website-content-migration|about-wordpress-migration)\//m.test(content)) dependent.push(path)
  }
  assert.deepEqual(dependent, [], 'Application or release code must not import migration-only report assets')
})

test('curated launch reports, migration helpers, and release scripts remain reviewable', () => {
  const deliberatePaths = [
    'reports/website-content-migration/launch-readiness-2026-11-03.md',
    'reports/website-content-migration/build-export.mjs',
    'reports/seo-audit/redirect-launch-status-2026-11-02.md',
    'scripts/audit-published-content.mjs',
    'docs/staging-release-handoff.md',
  ]
  for (const path of deliberatePaths) assert.equal(ignored(path), false, `Do not hide reviewed release source: ${path}`)
})
