import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateProductionHosts } from './validate-production-hosts.mjs'
import { auditPublishedContent, fetchPublishedContent } from './audit-published-content.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))

export function parseProductionReadinessArgs(args) {
  if (!args.length) return { envFile: null }
  if (args.length === 2 && args[0] === '--env-file' && args[1]?.trim()) return { envFile: args[1].trim() }
  throw Error('Usage: node scripts/check-production-readiness.mjs [--env-file PATH]')
}

/** Only read-only checks: no container operations, Git writes, mail, or Sanity mutations. */
export function evaluateProductionReadiness({ compose, gitRoot, gitStatus, content, envFileExists = true }) {
  const blockers = []
  const review = []
  // These features are intentionally disabled in the current website build.
  review.push('Newsletter signup is not integrated; signup forms will remain disabled')
  review.push('Gift card checkout is not integrated; purchase buttons will remain disabled')
  if (!envFileExists) blockers.push('Selected environment file does not exist')
  if (compose.error) blockers.push('Docker Compose configuration unavailable: ' + compose.error)
  else {
    try { validateProductionHosts(compose.value) } catch (error) {
      blockers.push('Production configuration invalid: ' + error.message)
    }
    const env = compose.value?.services?.website?.environment
    if (env && typeof env === 'object') {
      if (!env.GOOGLE_PLACES_API_KEY?.trim?.() || !env.GOOGLE_PLACE_ID?.trim?.()) {
        review.push('Google Places reviews are not configured; homepage reviews will be unavailable')
      }
      const resend = Boolean(env.RESEND_API_KEY?.trim?.())
      const smtp = Boolean(env.CONTACT_SMTP_HOST?.trim?.() && env.CONTACT_SMTP_PORT?.trim?.() && env.CONTACT_SMTP_USER?.trim?.() && env.CONTACT_SMTP_PASSWORD?.trim?.())
      if (!resend && !smtp) review.push('Contact email delivery is not configured; the contact form will remain disabled')
    }
  }
  if (gitRoot?.error) blockers.push('Git checkout root unavailable: ' + gitRoot.error)
  else if (!gitRoot?.value?.trim() || resolve(gitRoot.value.trim()) !== resolve(root)) {
    blockers.push('Release directory must be the Git checkout root')
  }
  if (gitStatus.error) blockers.push('Git working-tree status unavailable: ' + gitStatus.error)
  else if (gitStatus.value.trim()) blockers.push('Working tree contains uncommitted changes; release scripts require a clean checkout')
  if (content.error) blockers.push('Published Sanity audit unavailable: ' + content.error)
  else {
    const result = auditPublishedContent(content.value)
    blockers.push(...result.blockers)
    review.push(...result.review)
  }
  return { blockers, review }
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', windowsHide: true, timeout: 15000 })
  if (result.error) return { error: result.error.code || result.error.message }
  if (result.status !== 0) return { error: command + ' command failed (exit ' + result.status + '); inspect locally without sharing secrets' }
  return { value: result.stdout }
}

export async function checkProductionReadiness(args = process.argv.slice(2), fetchContent = fetchPublishedContent) {
  const { envFile } = parseProductionReadinessArgs(args)
  const envFileExists = !envFile || existsSync(resolve(root, envFile))
  let compose = { error: 'Skipped because the selected environment file does not exist' }
  if (envFileExists) {
    const options = ['compose', '-p', 'udderly-website-production', '-f', 'docker-compose.production.yml']
    if (envFile) options.push('--env-file', resolve(root, envFile))
    options.push('config', '--format', 'json')
    const output = run('docker', options)
    if (output.error) compose = { error: output.error }
    else {
      try { compose = { value: JSON.parse(output.value) } } catch { compose = { error: 'Docker Compose returned invalid JSON' } }
    }
  }
  const gitRoot = run('git', ['rev-parse', '--show-toplevel'])
  const gitStatus = run('git', ['status', '--porcelain', '--untracked-files=normal'])
  let content
  try { content = { value: await fetchContent() } }
  catch (error) { content = { error: 'read failed (' + (error?.message ?? 'unknown error') + ')' } }
  return evaluateProductionReadiness({ compose, gitRoot, gitStatus, content, envFileExists })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { blockers, review } = await checkProductionReadiness()
    for (const item of review) console.log('REVIEW:', item)
    for (const item of blockers) console.error('BLOCKER:', item)
    console.log('Production readiness: ' + blockers.length + ' blocker(s), ' + review.length + ' review item(s). No deployment attempted.')
    if (blockers.length) process.exitCode = 1
  } catch (error) {
    console.error('Production readiness check failed:', error.message)
    process.exitCode = 1
  }
}
