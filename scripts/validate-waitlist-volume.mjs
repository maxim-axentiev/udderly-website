/** The waitlist is the sole approved writable mount on the otherwise read-only website. */
export function validateWaitlistVolume(config, project) {
  const website = config?.services?.website
  const mounts = website?.volumes ?? []
  const directory = website?.environment?.WAITLIST_DATA_DIR
  if (!Array.isArray(mounts)) throw Error('Website volumes must be an array')
  if (mounts.length === 0 && !directory) return true
  if (directory !== '/data/waitlist' || mounts.length !== 1) {
    throw Error('Only the private waitlist data volume at /data/waitlist is allowed')
  }
  const mount = mounts[0]
  const expected = project + '_waitlist-data'
  // Docker Compose resolves declared named volumes to a fully qualified name.
  const validMount = typeof mount === 'string'
    ? mount === 'waitlist-data:/data/waitlist'
    : mount && mount.type === 'volume' &&
      [expected, 'waitlist-data'].includes(mount.source) &&
      mount.target === '/data/waitlist' && mount.read_only !== true &&
      !mount.bind && !mount.tmpfs
  if (!validMount) throw Error('Only the named waitlist data volume is allowed; bind mounts are forbidden')
  const volume = config?.volumes?.['waitlist-data']
  if (volume === undefined || volume?.external === true ||
      volume?.name && volume.name !== expected ||
      volume?.driver && volume.driver !== 'local') {
    throw Error('The waitlist volume must be an internal named local volume')
  }
  return true
}
