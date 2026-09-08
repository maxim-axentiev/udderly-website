/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CANONICAL_ORIGIN?: string
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test'
    HOST?: string
    PORT?: string
    APP_HOST?: string
    PUBLIC_CANONICAL_ORIGIN?: string
  }
}
