import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateStagingHosts } from './validate-staging-hosts.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))

/** Read-only checks. Never start containers, update Git, or print environment secrets. */
export function evaluateStagingReadiness({ compose, gitRoot, gitStatus, envFileExists = true }) {
  const blockers = []
  if (!envFileExists) blockers.push('Selected environment file does not exist')
  if (compose.error) blockers.push('Docker Compose configuration unavailable: ' + compose.error)
  else {
    try { validateStagingHosts(compose.value) } catch (error) {
      blockers.push('Staging configuration invalid: ' + error.message)
    }
  }
  if (gitRoot?.error) blockers.push('Git checkout root unavailable: ' + gitRoot.error)
  else if (!gitRoot?.value?.trim() || resolve(gitRoot.value.trim()) !== resolve(root)) {
    blockers.push('Release directory must be the Git checkout root')
  }
  if (gitStatus.error) blockers.push('Git working-tree status unavailable: ' + gitStatus.error)
  else if (gitStatus.value.trim()) blockers.push('Working tree contains uncommitted changes; release scripts require a clean checkout')
  return blockers
}

export function parseReadinessArgs(args) {
  if (args.length === 0) return { envFile: null }
  if (args.length === 2 && args[0] === '--env-file' && args[1]?.trim()) {
    return { envFile: args[1].trim() }
  }
  throw Error('Usage: node scripts/check-staging-readiness.mjs [--env-file PATH]')
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', windowsHide: true, timeout: 15000 })
  if (result.error) return { error: result.error.code || result.error.message }
  if (result.status !== 0) return { error: command + ' command failed (exit ' + result.status + '); inspect locally without sharing secrets' }
  return { value: result.stdout }
}

export function checkStagingReadiness(args = process.argv.slice(2)) {
  const { envFile } = parseReadinessArgs(args)
  const envFileExists = !envFile || existsSync(resolve(root, envFile))
  let compose = { error: 'Skipped because the selected environment file does not exist' }
  if (envFileExists) {
    const options = ['compose', '-p', 'udderly-website-staging', '-f', 'docker-compose.staging.yml']
    if (envFile) options.push('--env-file', resolve(root, envFile))
    options.push('config', '--format', 'json')
    const output = run('docker', options)
    if (output.error) compose = { error: output.error }
    else {
      try { compose = { value: JSON.parse(output.value) } } catch { compose = { error: 'Docker Compose returned invalid JSON' } }
    }
  }
  const gitRoot = run('git', ['rev-parse', '--show-toplevel'])
  const git = run('git', ['status', '--porcelain', '--untracked-files=normal'])
  const blockers = evaluateStagingReadiness({
    compose, gitRoot, gitStatus: git, envFileExists,
  })
  return blockers
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const blockers = checkStagingReadiness()
    if (blockers.length) {
      for (const blocker of blockers) console.error('BLOCKER:', blocker)
      console.error('Staging readiness: ' + blockers.length + ' blocker(s). No deployment attempted.')
      process.exitCode = 1
    } else console.log('Staging configuration and Git checkout ready for an approved deployment. No deployment attempted.')
  } catch (error) {
    console.error('Staging readiness check failed:', error.message)
    process.exitCode = 1
  }
}
