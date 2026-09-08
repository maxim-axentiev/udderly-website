import {PlayIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const farmSounds = defineType({
  name: 'farmSounds',
  title: 'Farm sounds',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable farm sounds player',
      type: 'boolean',
      description: 'The website will never autoplay. Visitors start and stop the player themselves.',
      initialValue: false,
    }),
    defineField({
      name: 'playerLabel',
      title: 'Player label',
      type: 'string',
      initialValue: 'Sounds of the Farm',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'tracks',
      title: 'Tracks',
      type: 'array',
      of: [defineArrayMember({type: 'audioTrack'})],
      validation: (rule) =>
        rule.custom((tracks, context) => {
          const enabled = Boolean((context.document as {enabled?: boolean} | undefined)?.enabled)
          if (enabled && (!tracks || tracks.length === 0)) {
            return 'Add at least one audio track before enabling the player.'
          }
          return true
        }).max(8),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Farm sounds',
        subtitle: 'Site-wide audio player',
      }
    },
  },
})
