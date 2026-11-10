import { useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { joinAnimalWaitlistFn, waitlistAvailableFn } from '@/lib/sale/waitlist-server'

const field = 'mt-1 w-full min-h-12 border-2 border-headline bg-background px-4 py-2 text-base focus-visible:outline-4 focus-visible:outline-primary-accent'
const interests = ['Mini Highland Cow', 'Mini Highland Bull', 'Mini Highland Heifer', 'Goat', 'Other / Any']

export function WaitlistSection({ title, copy }: { title: string; copy: string }) {
  const [available, setAvailable] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [notice, setNotice] = useState('')
  useEffect(() => {
    let mounted = true
    waitlistAvailableFn().then((enabled) => { if (mounted) setAvailable(Boolean(enabled)) }).catch(() => {})
    return () => { mounted = false }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!available || state === 'sending') return
    const form = event.currentTarget
    const fields = new FormData(form)
    setState('sending')
    setNotice('')
    try {
      const result = await joinAnimalWaitlistFn({ data: {
        name: fields.get('name'),
        email: fields.get('email'),
        phone: fields.get('phone'),
        interest: fields.get('interest'),
        notes: fields.get('notes'),
        consent: fields.get('consent') === 'on',
        website: fields.get('website'),
      } })
      if (result.ok) {
        form.reset()
        setState('sent')
        setNotice('Thank you! You have been added to our animal waitlist.')
      } else {
        setState('error')
        setNotice(result.error === 'rate_limited'
          ? 'Too many submissions. Please try again later.'
          : 'We could not save your waitlist request. Please contact us directly.')
      }
    } catch {
      setState('error')
      setNotice('We could not save your waitlist request. Please contact us directly.')
    }
  }

  return (
    <section id="waitlist" className="scroll-mt-28 bg-farm-blue py-20 md:py-28">
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <h2 className="font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">{title}</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg">{copy}</p>
        <form onSubmit={submit} className="mt-9 grid gap-5 border-2 border-headline bg-background p-6 shadow-[8px_8px_0_var(--color-headline)] sm:grid-cols-2 md:p-10">
          <label className="font-semibold text-headline">Name *
            <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} className={field}/>
          </label>
          <label className="font-semibold text-headline">Email *
            <input name="email" type="email" autoComplete="email" required maxLength={254} className={field}/>
          </label>
          <label className="font-semibold text-headline">Phone (optional)
            <input name="phone" type="tel" autoComplete="tel" maxLength={50} className={field}/>
          </label>
          <label className="font-semibold text-headline">Animal you are interested in *
            <select name="interest" required defaultValue="" className={field}>
              <option value="" disabled>Select an animal</option>
              {interests.map((interest) => <option key={interest} value={interest}>{interest}</option>)}
            </select>
          </label>
          <label className="font-semibold text-headline sm:col-span-2">Anything else we should know? (optional)
            <textarea name="notes" rows={4} maxLength={1000} className={field}/>
          </label>
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label>
          </div>
          <label className="flex items-start gap-3 text-sm font-medium text-headline sm:col-span-2">
            <input name="consent" type="checkbox" required className="mt-1 size-5 shrink-0"/>
            <span>I agree that Udderly Ridiculous Farm Life may keep my information to contact me about animals for sale and the waitlist. *</span>
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={!available || state === 'sending'}>{state === 'sending' ? 'Saving...' : 'Join the waitlist'}</Button>
            {!available ? <p className="mt-3 text-sm" role="status">Waitlist submissions are being set up. Please <a href="/contact" className="font-semibold underline">contact us directly</a> in the meantime.</p> : null}
            {notice ? <p className="mt-3 font-semibold" role="status">{notice}</p> : null}
          </div>
        </form>
      </div>
    </section>
  )
}
