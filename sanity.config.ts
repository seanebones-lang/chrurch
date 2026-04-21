import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { CHURCH_NAME } from './lib/church-info'

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || '00000000'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production'

export default defineConfig({
  name: 'harvest-church',
  title: CHURCH_NAME,
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  schema: { types: schemaTypes },
})
