import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

// Placeholder lets `next build` run without env; fetches return errors caught by pages.
const PLACEHOLDER_PROJECT_ID = '00000000'

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || PLACEHOLDER_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}
