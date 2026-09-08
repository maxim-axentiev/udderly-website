import {PlayIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

function isSupportedVideoUrl(value?: string) {
  if (!value) return 'Enter a YouTube or Vimeo URL.'
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtube.com' || host === 'youtu.be' || host === 'vimeo.com' || host === 'player.vimeo.com') {
      return true
    }
    return 'Use a YouTube or Vimeo URL. Do not upload video files to Sanity.'
  } catch {
    return 'Enter a valid URL.'
  }
}

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube or Vimeo only. Video files are not stored in Sanity.',
      validation: (rule) => rule.required().custom((value) => isSupportedVideoUrl(value)),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'url',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Video',
        subtitle: subtitle || 'Video',
      }
    },
  },
})
