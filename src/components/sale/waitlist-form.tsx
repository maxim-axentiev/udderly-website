import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { WAITLIST_DEMO_MESSAGE, WAITLIST_OPTIONS } from '@/lib/sale/content'

const inputClass =
  'border-2 border-headline bg-farm-beige px-4 py-3 text-base outline-none focus-visible:ring-4 focus-visible:ring-ring'
const labelClass = 'font-display text-sm font-black uppercase tracking-wide text-headline'

export function WaitlistSection({ title, copy }: { title: string; copy: string }) {
  const [sent, setSent] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const [error, setError] = useState(false)

  return (
    <section id="waitlist" className="scroll-mt-20 bg-farm-blue py-20 md:py-28">
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <h2 className="font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg">{copy}</p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!picked.length) {
              setError(true)
              return
            }
            setSent(true)
          }}
          className="mt-10 border-2 border-headline bg-background p-6 shadow-[12px_12px_0_var(--color-headline)] md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Name *</span>
              <input required name="name" maxLength={100} autoComplete="name" className={inputClass} />
            </label>
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Email *</span>
              <input required type="email" name="email" maxLength={255} autoComplete="email" className={inputClass} />
            </label>
            <fieldset className="md:col-span-2">
              <legend className={labelClass}>Animals you want notifications for *</legend>
              <p className="mt-2 text-sm">You may select more than one.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {WAITLIST_OPTIONS.map((option) => {
                  const on = picked.includes(option)
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setError(false)
                        setPicked(on ? picked.filter((item) => item !== option) : [...picked, option])
                      }}
                      className={`border-2 border-headline px-5 py-3 font-display text-base font-black uppercase ${on ? 'bg-primary-accent text-primary-foreground' : 'bg-farm-beige text-headline'}`}
                    >
                      {on ? '✓ ' : ''}
                      {option}
                    </button>
                  )
                })}
              </div>
              {error ? <p className="mt-2 text-sm font-semibold">Pick at least one animal.</p> : null}
            </fieldset>
          </div>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button type="submit" size="lg">
              Join Waitlist
            </Button>
            <p aria-live="polite" className="font-accent text-lg italic text-primary-accent">
              {sent ? WAITLIST_DEMO_MESSAGE : ''}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
