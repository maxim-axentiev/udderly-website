import { pathToFileURL } from 'node:url'
import { validateWaitlistVolume } from './validate-waitlist-volume.mjs'

/**
 * Validate Docker Compose's resolved production configuration before a deploy.
 * Pass the JSON output from "docker compose config --format json" on stdin.
 */
export function validatePublicHostname(host) {
  if (typeof host !== 'string' || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}$/i.test(host)) {
    throw Error('APP_HOST must be a real DNS hostname, without scheme, port or placeholder')
  }
  const normalizedHost = host.toLowerCase()
  if (['example.com', 'example.org', 'example.net'].includes(normalizedHost) ||
      ['.example.com', '.example.org', '.example.net'].some((suffix) => normalizedHost.endsWith(suffix)) ||
      normalizedHost.endsWith('.example') ||
      normalizedHost.endsWith('.test') || normalizedHost.endsWith('.invalid') ||
      normalizedHost.endsWith('.localhost')) {
    throw Error('APP_HOST is not a live hostname')
  }
  return normalizedHost
}

export function validateProductionHosts(config) {
  const website = config?.services?.website
  const host = website?.environment?.APP_HOST
  const canonical = website?.environment?.PUBLIC_CANONICAL_ORIGIN
  validateWaitlistVolume(config, 'udderly-website-production')
  if (website.read_only !== true || !Array.isArray(website.cap_drop) ||
      !website.cap_drop.includes('ALL') || !Array.isArray(website.security_opt) ||
      !website.security_opt.some((option) => option === 'no-new-privileges:true' || option === 'no-new-privileges')) {
    throw Error('Production container must use a read-only root filesystem, drop all Linux capabilities and disable privilege escalation')
  }
  if ((website.cap_add?.length ?? 0) > 0 ||
      /^(?:0|root)(?::[^:]*)?$/.test(String(website.user ?? '').trim().toLowerCase()) ||
      website.pid === 'host' || website.ipc === 'host' ||
      (website.devices?.length ?? 0) > 0) {
    throw Error('Production container must not restore capabilities, run as root, share host namespaces or access host devices')
  }
  const labels = website?.labels
  const getLabel = (name) => Array.isArray(labels)
    ? labels.find((entry) => entry.startsWith(name + '='))?.slice(name.length + 1)
    : labels?.[name]

  const normalizedHost = validatePublicHostname(host)
  if (!['udderlyridiculousfarmlife.com', 'www.udderlyridiculousfarmlife.com'].includes(normalizedHost)) {
    throw Error('Production APP_HOST must be the approved farm apex or www hostname')
  }

  let url
  try {
    url = new URL(canonical)
  } catch {
    throw Error('PUBLIC_CANONICAL_ORIGIN must be an absolute HTTPS origin')
  }
  if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== normalizedHost ||
      url.pathname !== '/' || url.search || url.hash || url.username || url.password || url.port ||
      canonical !== url.origin) {
    throw Error('PUBLIC_CANONICAL_ORIGIN must exactly equal https://APP_HOST')
  }
  const networks = website?.networks
  const serviceNetworks = Array.isArray(networks) ? networks : Object.keys(networks ?? {})
  if (serviceNetworks.length !== 1 || serviceNetworks[0] !== 'web' || config?.networks?.web?.external !== true) {
    throw Error('Production website must connect only to the external web network')
  }
  if (website.ports?.length || website.expose?.some((port) => String(port) !== '3000') ||
      website.privileged === true || website.network_mode) {
    throw Error('Production website must not publish host ports or gain elevated network privileges')
  }
  if (String(getLabel('traefik.enable')) !== 'true' || getLabel('traefik.docker.network') !== 'web') {
    throw Error('Production must enable Traefik only on the external web network')
  }
  const router = 'traefik.http.routers.udderly-website-production'
  if (getLabel(`${router}.rule`) !== 'Host(`' + host + '`)') {
    throw Error('Traefik production router hostname differs from APP_HOST')
  }
  if (getLabel(`${router}.entrypoints`) !== 'websecure' ||
      String(getLabel(`${router}.tls`)) !== 'true' ||
      getLabel(`${router}.tls.certresolver`) !== 'letsencrypt' ||
      getLabel(`${router}.service`) !== 'udderly-website-production' ||
      String(getLabel('traefik.http.services.udderly-website-production.loadbalancer.server.port')) !== '3000') {
    throw Error('Production Traefik HTTPS routing and backend port must remain configured')
  }
  const security = 'traefik.http.middlewares.udderly-website-production-security.headers'
  if (getLabel(`${router}.middlewares`) !== 'udderly-website-production-security' ||
      String(getLabel(`${security}.contenttypenosniff`)) !== 'true' ||
      getLabel(`${security}.referrerpolicy`) !== 'strict-origin-when-cross-origin') {
    throw Error('Production Traefik security headers middleware must be enabled')
  }
  return true
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const chunks = []
    for await (const chunk of process.stdin) chunks.push(chunk)
    validateProductionHosts(JSON.parse(Buffer.concat(chunks).toString('utf8')))
    console.log('Production host preflight passed')
  } catch (error) {
    console.error('Production host preflight blocked:', error.message)
    process.exitCode = 1
  }
}
