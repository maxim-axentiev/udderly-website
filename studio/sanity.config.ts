import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {isSingletonType} from './lib/singletons'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Udderly Site',

  projectId: 'umbuxpyp',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => !isSingletonType(template.schemaType)),
  },
  document: {
    actions: (input, context) =>
      isSingletonType(context.schemaType)
        ? input.filter(({action}) => action !== 'duplicate' && action !== 'delete')
        : input,
  },
})
