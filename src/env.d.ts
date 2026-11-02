/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CANONICAL_ORIGIN?: string
  /** Optional. Empty until a real GA4 measurement ID is supplied. Tags still wait for consent. */
  readonly PUBLIC_GA_MEASUREMENT_ID?: string
  /** Optional. Empty until a real Google Ads conversion ID is supplied. Tags still wait for consent. */
  readonly PUBLIC_GOOGLE_ADS_ID?: string
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test'
    HOST?: string
    PORT?: string
    APP_HOST?: string
    PUBLIC_CANONICAL_ORIGIN?: string
    GOOGLE_PLACES_API_KEY?: string
    GOOGLE_PLACE_ID?: string
    /** Server-only. Empty leaves the contact form unavailable. */
    CONTACT_SMTP_HOST?: string
    CONTACT_SMTP_PORT?: string
    CONTACT_SMTP_USER?: string
    CONTACT_SMTP_PASSWORD?: string
  }
}
