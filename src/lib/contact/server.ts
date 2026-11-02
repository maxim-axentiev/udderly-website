import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server'

import { clientAddress, submitContactMessage } from './submit'
import { contactSmtpConfigured } from './smtp'

export const getContactDeliveryAvailableFn = createServerFn({ method: 'GET', strict: false }).handler(() =>
  contactSmtpConfigured(process.env),
)

export const submitContactFn = createServerFn({ method: 'POST', strict: false })
  .validator((data: unknown) => data)
  .handler(async ({ data }) =>
    submitContactMessage(data, {
      env: process.env,
      ip: clientAddress({
        socketAddress: getRequestIP(),
        forwardedFor: getRequestHeader('x-forwarded-for'),
      }),
    }),
  )
