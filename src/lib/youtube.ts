/** A lightweight poster for YouTube embeds. Other hosts use the supplied local fallback image. */
export function getVideoPosterSrc(embedUrl: string, fallback: string): string {
  try {
    const url = new URL(embedUrl)
    if (url.hostname === 'www.youtube-nocookie.com' || url.hostname === 'youtube-nocookie.com') {
      const match = /^\/embed\/([a-zA-Z0-9_-]{11})$/.exec(url.pathname)
      if (match) return `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`
    }
  } catch { /* Keep the verified local image if the URL is not a YouTube embed. */ }
  return fallback
}

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
