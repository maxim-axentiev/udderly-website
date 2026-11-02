import { useEffect, useId, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { inertOutside, releaseInert } from '@/lib/consent/tracking'

const choiceClass =
  'flex cursor-pointer items-start gap-3 border-2 border-headline bg-background p-4 text-left'

export function ConsentBanner({
  onAccept,
  onReject,
  onCustomize,
}: {
  onAccept: () => void
  onReject: () => void
  onCustomize: () => void
}) {
  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-headline bg-farm-beige px-5 py-5 text-body-copy md:px-8"
    >
      <div className="mx-auto flex max-w-[1100px] flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-black uppercase leading-none text-headline">Cookies</h2>
          <p className="mt-3 text-sm leading-relaxed md:text-base">
            Necessary parts of this website stay available either way. Analytics and advertising cookies, including
            Google Analytics and Google Ads conversion tracking, stay off unless you allow them. You can change this
            later from Cookie preferences in the footer.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            <a className="underline hover:text-primary-accent" href="/cookies-policy">
              Cookies Policy
            </a>
            {' · '}
            <a className="underline hover:text-primary-accent" href="/privacy-policy">
              Privacy Policy
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button type="button" onClick={onAccept}>
            Accept all
          </Button>
          <Button type="button" variant="secondary" onClick={onReject}>
            Reject optional cookies
          </Button>
          <Button type="button" variant="outline" aria-haspopup="dialog" onClick={onCustomize}>
            Customize
          </Button>
        </div>
      </div>
    </section>
  )
}

export function ConsentPreferences({
  analytics,
  advertising,
  onAnalyticsChange,
  onAdvertisingChange,
  onAccept,
  onReject,
  onSave,
  onClose,
}: {
  analytics: boolean
  advertising: boolean
  onAnalyticsChange: (value: boolean) => void
  onAdvertisingChange: (value: boolean) => void
  onAccept: () => void
  onReject: () => void
  onSave: () => void
  onClose: () => void
}) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const dialog = dialogRef.current
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const consentRoot = dialog?.closest('#cookie-consent-root')
    const layout = consentRoot?.parentElement
    const inerted = layout && consentRoot ? inertOutside(layout, consentRoot) : []
    headingRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const focusable = [...dialog.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      releaseInert(inerted)
      previous?.focus()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgb(97_51_20_/_0.8)] p-4 sm:items-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto border-2 border-headline bg-background p-6 text-body-copy shadow-[8px_8px_0_var(--color-headline)] outline-none"
      >
        <h2 ref={headingRef} id={titleId} tabIndex={-1} className="font-display text-3xl font-black uppercase leading-none text-headline outline-none">
          Cookie preferences
        </h2>
          <p id={descriptionId} className="mt-3 leading-relaxed">
          Necessary site functions stay available. Optional measurement stays off until you allow it. Turning a category
          off stops further measurement from this site, including while you move between pages. Cookies Google has
          already stored may remain until they expire or you remove them in your browser.
        </p>
        <div className="mt-6 space-y-3">
          <label className={choiceClass}>
            <input
              type="checkbox"
              className="mt-1 size-5 accent-primary"
              checked={analytics}
              onChange={(event) => onAnalyticsChange(event.target.checked)}
            />
            <span>
              <span className="font-display text-lg font-bold uppercase text-headline">Analytics</span>
              <span className="mt-1 block text-sm leading-relaxed">
                Allows Google Analytics after a measurement ID is configured. It does not load before this choice.
              </span>
            </span>
          </label>
          <label className={choiceClass}>
            <input
              type="checkbox"
              className="mt-1 size-5 accent-primary"
              checked={advertising}
              onChange={(event) => onAdvertisingChange(event.target.checked)}
            />
            <span>
              <span className="font-display text-lg font-bold uppercase text-headline">Advertising</span>
              <span className="mt-1 block text-sm leading-relaxed">
                Allows Google Ads conversion tracking after an ads ID is configured. It does not turn on personalized
                ads, and it does not load before this choice.
              </span>
            </span>
          </label>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button type="button" onClick={onSave}>
            Save preferences
          </Button>
          <Button type="button" variant="secondary" onClick={onReject}>
            Reject optional cookies
          </Button>
          <Button type="button" variant="outline" onClick={onAccept}>
            Accept all
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
