import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { csvCell, saveWaitlistSubmission, waitlistConfigured } from './waitlist-submit'

const valid = {
  name: 'Test Visitor', email: 'visitor@example.com', phone: '555-555-5555',
  interests: ['Mini Highland Heifer', 'Goat'], notes: 'Please contact me.', consent: true,
}

describe('animal sale waitlist', () => {
  it('does not accept submissions without private persistent storage', async () => {
    expect(waitlistConfigured({})).toBe(false)
    expect(await saveWaitlistSubmission(valid, { env: {}, ip: '198.51.100.1' })).toEqual({ ok: false, error: 'unavailable' })
  })

  it('rejects incomplete or unconsented information', async () => {
    for (const [index, change] of [{ consent: false }, { email: 'bad' }, { interests: ['anything'] }, { interests: [] }, { interests: ['Goat', 'Goat'] }, { name: 'x' }].entries()) {
      const result = await saveWaitlistSubmission({ ...valid, ...change }, { env: { WAITLIST_DATA_DIR: '/unused' }, ip: `198.51.100.${index + 2}` })
      expect(result).toEqual({ ok: false, error: 'invalid' })
    }
  })

  it('appends spreadsheet-safe rows and preserves a single header', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'udderly-waitlist-test-'))
    try {
      const env = { WAITLIST_DATA_DIR: dir }
      expect(await saveWaitlistSubmission(valid, { env, ip: '203.0.113.10', now: new Date('2026-11-09T10:00:00.000Z') })).toEqual({ ok: true })
      expect(await saveWaitlistSubmission({ ...valid, name: '=HYPERLINK("bad")', notes: 'First line\nSecond line' }, {
        env, ip: '203.0.113.11', now: new Date('2026-11-09T10:01:00.000Z'),
      })).toEqual({ ok: true })
      const csv = await readFile(join(dir, 'animal-sale-waitlist.csv'), 'utf8')
      expect(csv).toContain('"Submitted At (UTC)","Name","Email","Phone","Animal Interest","Notes","Consent"')
      expect(csv).toContain('"2026-11-09T10:00:00.000Z","Test Visitor"')
      expect(csv).toContain('"Mini Highland Heifer; Goat"')
      expect(csv).toContain("'=HYPERLINK")
      expect(csv).toContain('"First line\nSecond line"')
      expect(csv.match(/"Submitted At \(UTC\)"/g)).toHaveLength(1)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('escapes quotes, commas and dangerous Excel formulas', () => {
    expect(csvCell('Hi, "there"')).toBe('"Hi, ""there"""')
    expect(csvCell(' +1+1')).toBe('"\' +1+1"')
    expect(csvCell('normal')).toBe('"normal"')
  })
})
