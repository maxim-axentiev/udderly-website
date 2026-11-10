import { pathToFileURL } from 'node:url'
import { validatePublicHostname } from './validate-production-hosts.mjs'
import { validateWaitlistVolume } from './validate-waitlist-volume.mjs'

/** Verify staging cannot route a placeholder host or accidentally become indexable. */
export function validateStagingHosts(config) {
  const website = config?.services?.website
  const host = website?.environment?.APP_HOST
  const normalizedHost = validatePublicHostname(host)
  if (['udderlyridiculousfarmlife.com', 'www.udderlyridiculousfarmlife.com'].includes(normalizedHost)) {
    throw Error('Staging APP_HOST must not use the production website hostname')
  }
  if (!normalizedHost.endsWith('.udderlyridiculousfarmlife.com')) {
    throw Error('Staging APP_HOST must be a farm-owned subdomain under udderlyridiculousfarmlife.com')
  }
  if (website?.environment?.PUBLIC_CANONICAL_ORIGIN !== '') {
    throw Error('Staging must not set PUBLIC_CANONICAL_ORIGIN')
  }
  for (const name of ['RESEND_API_KEY', 'CONTACT_SMTP_HOST', 'CONTACT_SMTP_PORT', 'CONTACT_SMTP_USER', 'CONTACT_SMTP_PASSWORD']) {
    if (website?.environment?.[name]) {
      throw Error(`Staging must not configure live contact email delivery: ${name}`)
    }
  }
  const networks = website?.networks
  const serviceNetworks = Array.isArray(networks) ? networks : Object.keys(networks ?? {})
  if (serviceNetworks.length !== 1 || serviceNetworks[0] !== 'web' || config?.networks?.web?.external !== true) {
    throw Error('Staging website must connect only to the external web network')
  }
  if (website.ports?.length || website.expose?.some((port) => String(port) !== '3000') ||
      website.privileged === true || website.network_mode) {
    throw Error('Staging website must not publish host ports or gain elevated network privileges')
  }
  validateWaitlistVolume(config, 'udderly-website-staging')
  if (website.read_only !== true || !Array.isArray(website.cap_drop) ||
      !website.cap_drop.includes('ALL') || !Array.isArray(website.security_opt) ||
      !website.security_opt.some((option) => option === 'no-new-privileges:true' || option === 'no-new-privileges')) {
    throw Error('Staging container must use a read-only root filesystem, drop all Linux capabilities and disable privilege escalation')
  }
  if ((website.cap_add?.length ?? 0) > 0 ||
      /^(?:0|root)(?::[^:]*)?$/.test(String(website.user ?? '').trim().toLowerCase()) ||
      website.pid === 'host' || website.ipc === 'host' ||
      (website.devices?.length ?? 0) > 0) {
    throw Error('Staging container must not restore capabilities, run as root, share host namespaces or access host devices')
  }
  const labels = website?.labels
  const getLabel = (name) => Array.isArray(labels)
    ? labels.find((entry) => entry.startsWith(name + '='))?.slice(name.length + 1)
    : labels?.[name]
  if (String(getLabel('traefik.enable')) !== 'true' || getLabel('traefik.docker.network') !== 'web') {
    throw Error('Staging must enable Traefik only on the external web network')
  }
  const router = 'traefik.http.routers.udderly-website-staging'
  const middleware = 'udderly-website-staging-noindex'
  if (getLabel(`${router}.rule`) !== 'Host(`' + host + '`)') {
    throw Error('Traefik staging router hostname differs from APP_HOST')
  }
  if (getLabel(`${router}.entrypoints`) !== 'websecure' ||
      String(getLabel(`${router}.tls`)) !== 'true' ||
      getLabel(`${router}.tls.certresolver`) !== 'letsencrypt' ||
      getLabel(`${router}.service`) !== 'udderly-website-staging' ||
      String(getLabel('traefik.http.services.udderly-website-staging.loadbalancer.server.port')) !== '3000') {
    throw Error('Staging Traefik HTTPS routing and backend port must remain configured')
  }
  if (getLabel(`${router}.middlewares`) !== middleware ||
      getLabel(`traefik.http.middlewares.${middleware}.headers.customresponseheaders.X-Robots-Tag`) !== 'noindex, nofollow, noarchive') {
    throw Error('Staging Traefik noindex middleware must be enabled')
  }
  const security = `traefik.http.middlewares.${middleware}.headers`
  if (String(getLabel(`${security}.contenttypenosniff`)) !== 'true' ||
      getLabel(`${security}.referrerpolicy`) !== 'strict-origin-when-cross-origin') {
    throw Error('Staging Traefik security headers middleware must be enabled')
  }
  return true
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const chunks = []
    for await (const chunk of process.stdin) chunks.push(chunk)
    validateStagingHosts(JSON.parse(Buffer.concat(chunks).toString('utf8')))
    console.log('Staging host preflight passed')
  } catch (error) {
    console.error('Staging host preflight blocked:', error.message)
    process.exitCode = 1
  }
}
