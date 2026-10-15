export function getYoutubeEmbedUrl(videoUrl: string): string {
  try {
    const parsed = new URL(videoUrl)
    let id = ''
    let start = 0

    if (parsed.hostname === 'youtu.be') {
      id = parsed.pathname.slice(1)
    } else {
      id = parsed.searchParams.get('v') || ''
    }

    const timeParam = parsed.searchParams.get('t')
    if (timeParam) {
      const numeric = Number.parseInt(timeParam.replace('s', ''), 10)
      if (!Number.isNaN(numeric)) start = numeric
    }

    if (!id) return ''
    const query = new URLSearchParams({ rel: '0' })
    if (start > 0) query.set('start', String(start))
    return `https://www.youtube-nocookie.com/embed/${id}?${query.toString()}`
  } catch {
    return ''
  }
}

export function getHomepageVideoEmbedUrl(videoUrl: string): string {
  try {
    const url = new URL(videoUrl)
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtube.com' || host === 'youtu.be') {
      return getYoutubeEmbedUrl(videoUrl)
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean).pop() ?? ''
      if (!/^\d+$/.test(id)) return ''
      return `https://player.vimeo.com/video/${id}`
    }
  } catch {
    return ''
  }
  return ''
}
