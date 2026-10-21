import type { FormEvent, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import type { ContactPageContent } from '@/lib/contact/resolve'

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

export function ContactPage({ page }: { page: ContactPageContent }) {
  const submit = (event: FormEvent) => {
    event.preventDefault()
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
          className="self-start border-4 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-headline)] md:p-10"
          aria-describedby="contact-unavailable"
        >
          <h2 className="font-display text-4xl font-black uppercase text-headline">{page.formHeading}</h2>
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
          <p id="contact-unavailable" className="mt-4 font-semibold text-headline" role="status">
            {page.unavailable}
          </p>
        </form>
      </div>
    </section>
  )
}
