import { Button } from '@/components/ui/button'

// Public Mailchimp embedded-form endpoint supplied by the farm owner.
export const MAILCHIMP_ACTION = 'https://udderlyridiculousfarmlife.us1.list-manage.com/subscribe/post?u=77c143a0d69da1f925598010c&id=1fc8e9d605&f_id=001cc7e4f0'

const fieldClass = 'min-h-12 w-full rounded-full border-2 border-headline bg-background px-5 text-base text-headline placeholder:text-body-copy/60'
const dateFieldClass = 'min-h-12 w-full min-w-0 rounded-full border-2 border-headline bg-background px-3 text-center text-base text-headline placeholder:text-body-copy/60'

export function MailchimpSignup({
  id,
  firstNameLabel = 'First name (required)',
  emailLabel = 'Email (required)',
  dateOfBirthLabel = 'Date of birth (required)',
  submitLabel = 'Sign me up',
  firstNamePlaceholder,
  emailPlaceholder,
}: {
  id: string
  firstNameLabel?: string
  emailLabel?: string
  dateOfBirthLabel?: string
  submitLabel?: string
  firstNamePlaceholder?: string
  emailPlaceholder?: string
}) {
  return (
    <form action={MAILCHIMP_ACTION} method="post" target="_blank" className="mx-auto mt-8 grid max-w-md gap-3 text-left">
      <div>
        <label htmlFor={`${id}-first-name`} className="mb-1 block font-display text-sm font-bold uppercase text-headline">{firstNameLabel}</label>
        <input id={`${id}-first-name`} name="FNAME" type="text" autoComplete="given-name" required maxLength={100} placeholder={firstNamePlaceholder} className={fieldClass}/>
      </div>
      <div>
        <label htmlFor={`${id}-email`} className="mb-1 block font-display text-sm font-bold uppercase text-headline">{emailLabel}</label>
        <input id={`${id}-email`} name="EMAIL" type="email" autoComplete="email" required maxLength={254} placeholder={emailPlaceholder} className={fieldClass}/>
      </div>
      <fieldset className="min-w-0">
        <legend className="mb-1 font-display text-sm font-bold uppercase text-headline">{dateOfBirthLabel}</legend>
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1.5fr] items-center gap-2">
          <input aria-label="Birth day" name="DOB[day]" type="text" inputMode="numeric" pattern="0?[1-9]|[12][0-9]|3[01]" required maxLength={2} placeholder="DD" className={dateFieldClass}/>
          <span aria-hidden="true">/</span>
          <input aria-label="Birth month" name="DOB[month]" type="text" inputMode="numeric" pattern="0?[1-9]|1[0-2]" required maxLength={2} placeholder="MM" className={dateFieldClass}/>
          <span aria-hidden="true">/</span>
          <input aria-label="Birth year" name="DOB[year]" type="text" inputMode="numeric" pattern="[0-9]{4}" required maxLength={4} placeholder="YYYY" className={dateFieldClass}/>
        </div>
        <p className="mt-2 text-sm">We won't email you if you're younger than 18.</p>
      </fieldset>
      <input type="hidden" name="tags" value="6362546"/>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>Leave this field empty<input type="text" name="b_77c143a0d69da1f925598010c_1fc8e9d605" tabIndex={-1} autoComplete="off"/></label>
      </div>
      <Button type="submit" className="mt-2 justify-self-center">{submitLabel}</Button>
    </form>
  )
}
