import { register } from 'node:module'

const loader = new globalThis.URL('./homepage-node-loader.mjs', import.meta.url)
register(loader.href, import.meta.url)
