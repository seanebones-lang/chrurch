import { groq } from 'next-sanity'
import { client } from './sanity.client'

// ─── Sermons ────────────────────────────────────────────────────────────────

export const SERMONS_QUERY = groq`
  *[_type == "sermon"] | order(date desc) {
    _id, title, slug, date, speaker, series, scripture, description,
    thumbnail, videoUrl, featured,
    "audioUrl": audioFile.asset->url
  }
`

export const FEATURED_SERMON_QUERY = groq`
  *[_type == "sermon" && featured == true] | order(date desc)[0] {
    _id, title, slug, date, speaker, series, description,
    thumbnail, videoUrl,
    "audioUrl": audioFile.asset->url
  }
`

export const SERMON_BY_SLUG_QUERY = groq`
  *[_type == "sermon" && slug.current == $slug][0] {
    _id, title, slug, date, speaker, series, scripture, description,
    thumbnail, videoUrl, transcript,
    "audioUrl": audioFile.asset->url
  }
`

// ─── Events ─────────────────────────────────────────────────────────────────

export const EVENTS_QUERY = groq`
  *[_type == "event" && startDate >= now()] | order(startDate asc) {
    _id, title, slug, startDate, endDate, location, description,
    image, rsvpLink, category, featured
  }
`

// ─── Pastors ─────────────────────────────────────────────────────────────────

export const PASTORS_QUERY = groq`
  *[_type == "pastor"] | order(order asc) {
    _id, name, title, bio, photo, email
  }
`

// ─── Settings ────────────────────────────────────────────────────────────────

export const SETTINGS_QUERY = groq`
  *[_type == "settings"][0] {
    churchName, tagline, welcomeSectionImage, logo, serviceTimes,
    address, phone, email, socialLinks, giveLink
  }
`

// ─── Helpers ─────────────────────────────────────────────────────────────────

export async function getSermons() {
  return client.fetch(SERMONS_QUERY)
}

export async function getFeaturedSermon() {
  return client.fetch(FEATURED_SERMON_QUERY)
}

export async function getSermonBySlug(slug: string) {
  return client.fetch(SERMON_BY_SLUG_QUERY, { slug })
}

export async function getEvents() {
  return client.fetch(EVENTS_QUERY)
}

export async function getPastors() {
  return client.fetch(PASTORS_QUERY)
}

export async function getSettings() {
  return client.fetch(SETTINGS_QUERY)
}
