import { useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { CONTACT_NOT_SENT, CONTACT_SUCCESS } from '@/lib/contact/model'
import { getContactDeliveryAvailableFn, submitContactFn } from '@/lib/contact/server'
import type { CorporateEnquiry } from '@/lib/corporate/model'

const field = 'mt-2 min-h-12 w-full border-2 border-headline bg-background px-4 py-3 text-base text-headline focus-visible:outline-4 focus-visible:outline-primary-accent disabled:opacity-60'
const emailHref = 'mailto:info@udderlyridiculousfarmlife.com?subject=Corporate%20enquiry'

export function CorporateEnquiryFormFields({ enquiry }: { enquiry: CorporateEnquiry }) {
  const [available, setAvailable] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    getContactDeliveryAvailableFn().then((enabled) => {
      if (active) setAvailable(Boolean(enabled))
    }).catch(() => {})
    return () => { active = false }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!available || status === 'sending') return
    const form = event.currentTarget
    const values = new FormData(form)
    const name = String(values.get('name') || '')
    const email = String(values.get('email') || '')
    const organization = String(values.get('organization') || '')
    const phone = String(values.get('phone') || '')
    const program = String(values.get('program') || '')
    const details = String(values.get('message') || '')
    const message = ['Corporate website enquiry', `Organization: ${organization}`, `Program: ${program || 'Not specified'}`, `Phone: ${phone || 'Not provided'}`, '', details].join('\n')
    setNotice('')
    setStatus('sending')
    try {
      const result = await submitContactFn({ data: {
        name, email, message, contactExtra: String(values.get('website') || ''),
      } })
      if (result.ok) {
        form.reset()
        setStatus('sent')
        setNotice(CONTACT_SUCCESS)
      } else {
        setStatus('error')
        setNotice(result.error === 'rate_limited'
          ? 'Please wait before sending another enquiry.'
          : CONTACT_NOT_SENT)
      }
    } catch {
      setStatus('error')
      setNotice(CONTACT_NOT_SENT)
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 grid gap-5 border-2 border-headline bg-background p-6 shadow-[12px_12px_0_var(--color-headline)] sm:grid-cols-2 md:p-10">
      <label className="font-semibold">Name *
        <input name="name" type="text" required autoComplete="name" maxLength={100} className={field} disabled={!available}/>
      </label>
      <label className="font-semibold">Email address *
        <input name="email" type="email" required autoComplete="email" maxLength={254} className={field} disabled={!available}/>
      </label>
      <label className="font-semibold">Company or organization
        <input name="organization" type="text" autoComplete="organization" maxLength={150} className={field} disabled={!available}/>
      </label>
      {enquiry.showPhone ? (
        <label className="font-semibold">Phone number
          <input name="phone" type="tel" autoComplete="tel" maxLength={50} className={field} disabled={!available}/>
        </label>
      ) : null}
      {enquiry.programOptions.length ? (
        <label className="font-semibold sm:col-span-2">Program of interest
          <select name="program" className={field} defaultValue="" disabled={!available}>
            <option value="">Not sure yet</option>
            {enquiry.programOptions.map((program) => <option key={program} value={program}>{program}</option>)}
          </select>
        </label>
      ) : null}
      <label className="font-semibold sm:col-span-2">Tell us about your team or event *
        <textarea name="message" rows={5} required minLength={2} maxLength={2500} className={field} disabled={!available}/>
      </label>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={!available || status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send corporate enquiry'}
        </Button>
        {!available ? (
          <p className="mt-4 text-sm" role="status">
            Online submissions are being configured. For now, please <a className="font-semibold underline" href={emailHref}>email our team directly</a>.
          </p>
        ) : null}
        {notice ? <p className="mt-4 font-semibold" role="status">{notice}</p> : null}
      </div>
    </form>
  )
}
