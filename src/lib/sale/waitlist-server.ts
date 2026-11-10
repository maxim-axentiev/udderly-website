import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server'

import { clientAddress } from '@/lib/contact/submit'
import { saveWaitlistSubmission, waitlistConfigured } from './waitlist-submit'

export const waitlistAvailableFn = createServerFn({ method: 'GET', strict: false })
  .handler(() => waitlistConfigured(process.env))

export const joinAnimalWaitlistFn = createServerFn({ method: 'POST', strict: false })
  .validator((data: unknown) => data)
  .handler(async ({ data }) => saveWaitlistSubmission(data, {
    env: process.env,
    ip: clientAddress({ socketAddress: getRequestIP(), forwardedFor: getRequestHeader('x-forwarded-for') }),
  }))
