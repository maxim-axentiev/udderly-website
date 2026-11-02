export const CONTACT_PATH = '/contact'

export const CONTACT_RECIPIENT = 'info@udderlyridiculousfarmlife.com'

export const CONTACT_UNAVAILABLE = 'Contact messages are not available yet.'

export const CONTACT_SUCCESS = 'Message Sent'

export const CONTACT_NOT_SENT =
  'Your message was not sent. Please try again, or email info@udderlyridiculousfarmlife.com.'

export const CONTACT_INVALID = 'Check your name, email and message. Your message was not sent.'

export const CONTACT_RATE_LIMITED =
  'Your message was not sent. Please wait before trying again, or email info@udderlyridiculousfarmlife.com.'

export const contactFallback = {
  heroLead: 'Say',
  heroAccent: 'hello',
  businessName: 'Udderly Ridiculous Farm Life',
  email: 'info@udderlyridiculousfarmlife.com',
  phone: '1-548-225-1005',
  address: '906200 Township Rd 12, Bright, ON N0J 1B0',
  formHeading: 'Send us a message',
  nameLabel: 'Name',
  emailLabel: 'Email',
  messageLabel: 'Message',
  submitLabel: 'Send Message',
  unavailable: CONTACT_UNAVAILABLE,
  seoTitle: 'Contact — Udderly Ridiculous Farm Life',
  seoDescription:
    'Email, phone, seasonal hours and address for Udderly Ridiculous Farm Life.',
} as const

export const contactFallbackHours = [
  {
    title: 'Winter Hours (November to April)',
    rows: [
      { label: 'Monday – Thursday', value: 'By appointment only' },
      { label: 'Friday – Sunday', value: '10:00 AM – 5:00 PM' },
    ],
  },
  {
    title: 'Spring Hours (May to October)',
    rows: [
      { label: 'Monday – Tuesday', value: 'By appointment only' },
      { label: 'Wednesday – Sunday', value: '10:00 AM – 5:00 PM' },
    ],
  },
] as const
