import assert from 'node:assert/strict'
import test from 'node:test'

import { bookingOverlayIssues } from './verify-booking-overlay.mjs'

const booking = 'https://fareharbor.com/embeds/book/udderlyridiculousfarmlife/items/336824/?full-items=yes&amp;flow=573099'
const loader = '<script src="https://fareharbor.com/embeds/api/v1/?autolightframe=yes" async></script>'

test('allows a verified booking link when the FareHarbor overlay loader is present', () => {
  assert.deepEqual(bookingOverlayIssues(`<a href="${booking}">Book</a>${loader}`), [])
})

test('fails a verified booking link when the overlay script is missing', () => {
  assert.deepEqual(bookingOverlayIssues(`<a href="${booking}">Book</a>`), [
    'Verified FareHarbor booking links are present without the overlay loader',
  ])
})

test('allows pages without FareHarbor checkout links', () => {
  assert.deepEqual(bookingOverlayIssues('<a href="/experiences">Explore</a>'), [])
  assert.deepEqual(bookingOverlayIssues('<a href="https://example.com/embeds/book/item">Book</a>'), [])
})

test('recognizes a single loader across multiple verified checkout links', () => {
  assert.deepEqual(bookingOverlayIssues(`<a href="${booking}">Public</a><a href="${booking}">Private</a>${loader}`), [])
})
