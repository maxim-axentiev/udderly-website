import { useState, type FormEvent, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  CONTACT_INVALID,
  CONTACT_NOT_SENT,
  CONTACT_RATE_LIMITED,
  CONTACT_SUCCESS,
} from '@/lib/contact/model'
import type { ContactPageContent } from '@/lib/contact/resolve'
import { submitContactFn } from '@/lib/contact/server'

const field =
  'mt-2 w-full border-2 border-headline bg-background px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-70'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-primary-accent" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-primary-accent" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2z" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-1 size-6 shrink-0 text-primary-accent" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function Fact({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <li className="flex items-center gap-3">{icon}<span>{children}</span></li>
}

export function ContactPage({
  page,
  deliveryAvailable = false,
}: {
  page: ContactPageContent
  deliveryAvailable?: boolean
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'accepted' | 'error'>('idle')
  const [notice, setNotice] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!deliveryAvailable || status === 'sending') return
    setStatus('sending')
    setNotice('')
    const extra = String(new FormData(event.currentTarget).get('contact_extra') ?? '')
    try {
      const result = await submitContactFn({ data: { name, email, message, contactExtra: extra } })
      if (result.ok) {
        setStatus('accepted')
        setNotice(CONTACT_SUCCESS)
        setName('')
        setEmail('')
        setMessage('')
        return
      }
      setStatus('error')
      setNotice(result.error === 'invalid' ? CONTACT_INVALID : result.error === 'rate_limited' ? CONTACT_RATE_LIMITED : CONTACT_NOT_SENT)
    } catch {
      setStatus('error')
      setNotice(CONTACT_NOT_SENT)
    }
  }

  return (
    <section className="bg-farm-beige py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] font-black uppercase leading-[0.82] text-headline">
            {page.heroLead} <span className="text-primary-accent">{page.heroAccent}</span>
          </h1>
          <p className="mt-6 font-display text-2xl font-black uppercase text-headline">{page.businessName}</p>
          {page.intro ? <p className="mt-4 max-w-xl text-lg leading-relaxed">{page.intro}</p> : null}
          <ul className="mt-4 space-y-3 text-lg">
            <Fact icon={<MailIcon />}>
              <strong>Email:</strong>{' '}
              <a className="underline" href={page.emailHref}>{page.email}</a>
            </Fact>
            <Fact icon={<PhoneIcon />}>
              <strong>Phone:</strong>{' '}
              <a className="underline" href={page.phoneHref}>{page.phone}</a>
            </Fact>
          </ul>
          {page.hoursNote ? <p className="mt-8 text-lg leading-relaxed">{page.hoursNote}</p> : null}
          {page.hours.map((group) => (
            <div key={group.title} className="mt-8">
              <h2 className="font-display text-xl font-black uppercase text-headline">{group.title}</h2>
              <dl className="mt-2 space-y-1">
                {group.rows.map((row) => (
                  <div key={row.label} className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold">{row.label}:</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          <p className="mt-8 flex items-start gap-3 text-lg">
            <MapIcon />
            {page.address}
          </p>
        </div>
        <form
          onSubmit={submit}
          className="relative self-start border-4 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-headline)] md:p-10"
          aria-describedby={deliveryAvailable ? 'contact-status' : 'contact-unavailable'}
        >
          <h2 className="font-display text-4xl font-black uppercase text-headline">{page.formHeading}</h2>
          {deliveryAvailable ? (
            <fieldset className="mt-6 min-w-0 border-0 p-0">
              <p className="sr-only" aria-hidden="true">
                <label>
                  Leave this field empty
                  <input name="contact_extra" tabIndex={-1} autoComplete="off" className={field} />
                </label>
              </p>
              <label className="block font-semibold">
                {page.nameLabel}
                <input name="name" autoComplete="name" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className={field} />
              </label>
              <label className="mt-5 block font-semibold">
                {page.emailLabel}
                <input name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className={field} />
              </label>
              <label className="mt-5 block font-semibold">
                {page.messageLabel}
                <textarea name="message" rows={6} required minLength={2} maxLength={4000} value={message} onChange={(event) => setMessage(event.target.value)} className={field} />
              </label>
              <Button type="submit" size="lg" className="mt-7 w-full" disabled={status === 'sending'}>
                {page.submitLabel}
              </Button>
            </fieldset>
          ) : (
            <fieldset disabled className="mt-6 min-w-0 border-0 p-0">
              <label className="block font-semibold">
                {page.nameLabel}
                <input name="name" autoComplete="name" className={field} />
              </label>
              <label className="mt-5 block font-semibold">
                {page.emailLabel}
                <input name="email" type="email" autoComplete="email" className={field} />
              </label>
              <label className="mt-5 block font-semibold">
                {page.messageLabel}
                <textarea name="message" rows={6} className={field} />
              </label>
              <Button type="button" size="lg" className="mt-7 w-full" disabled>
                {page.submitLabel}
              </Button>
            </fieldset>
          )}
          {deliveryAvailable ? (
            <p id="contact-status" className={notice === CONTACT_SUCCESS ? "mt-6 text-center font-display text-4xl font-black uppercase text-headline" : notice ? "mt-4 font-semibold text-headline" : "sr-only"} role="status">
              {notice}
            </p>
          ) : (
            <p id="contact-unavailable" className="mt-4 font-semibold text-headline" role="status">
              Online messages are being configured. Please <a href={page.emailHref} className="font-bold underline">email us directly</a> in the meantime.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
