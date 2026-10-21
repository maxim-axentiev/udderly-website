export const NEWSLETTER_PATH = '/newsletter'

export const NEWSLETTER_UNAVAILABLE = 'Newsletter signup is not available yet.'

export const newsletterFallback = {
  title: 'The Udderly Update',
  copy: "Sign up for our monthly email newsletter to be the first to know about special promotions, new experiences, farm & animal updates, and just ridiculous content that'll make you gasp, ooh, aw, and woah!",
  firstNameLabel: 'First name (required)',
  emailLabel: 'Email (required)',
  dateOfBirthLabel: 'Date of birth (required)',
  submitLabel: 'Sign me up',
  unavailable: NEWSLETTER_UNAVAILABLE,
  seoTitle: 'Newsletter — Udderly Ridiculous Farm Life',
  seoDescription:
    'Join the Udderly Update for farm news, animal updates, promotions and upcoming experiences.',
  ogDescription: 'Monthly farm news, animal updates and ridiculous moments in your inbox.',
} as const
