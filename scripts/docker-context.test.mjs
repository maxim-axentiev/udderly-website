import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const ignored = readFileSync('.dockerignore', 'utf8').split(/\r?\n/).map((line) => line.trim())
const dockerfile = readFileSync('Dockerfile', 'utf8')

test('Docker build context excludes credentials and local migration material', () => {
  for (const path of ['.git', '.env', '.env.*', '.local', 'reports', 'studio', 'docs', 'node_modules', '.output']) {
    assert.ok(ignored.includes(path), `Missing Docker context exclusion: ${path}`)
  }
  assert.ok(!ignored.some((line) => line.startsWith('!.env')), 'Environment files must never be re-included')
})

test('Docker builds only from explicitly selected application paths', () => {
  assert.doesNotMatch(dockerfile, /^COPY\s+\.\s+\./m, 'Dockerfile must not copy the full context')
  for (const line of ['COPY package.json package-lock.json ./', 'COPY src ./src', 'COPY public ./public']) {
    assert.ok(dockerfile.includes(line), `Missing application build input: ${line}`)
  }
  assert.match(dockerfile, /COPY --from=build \/app\/\.output \.\/\.output/)
})
