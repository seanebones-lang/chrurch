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

/** Recent sermons for chat context (no heavy fields). */
export const CHAT_SERMONS_RECENT_QUERY = groq`
  *[_type == "sermon" && defined(slug.current)] | order(date desc) [0...4] {
    _id, title, "slug": slug.current, date, speaker, series, scripture, description
  }
`

/** Sermon search for chat (Sanity `match` with glob). */
export const CHAT_SERMONS_SEARCH_QUERY = groq`
  *[_type == "sermon" && defined(slug.current) && (
    title match $pat || coalesce(description, "") match $pat ||
    coalesce(scripture, "") match $pat || coalesce(speaker, "") match $pat ||
    coalesce(series, "") match $pat
  )] | order(date desc) [0...6] {
    _id, title, "slug": slug.current, date, speaker, series, scripture, description
  }
`

/** CMS pages (ministry-style content) for chat. */
export const CHAT_PAGES_SEARCH_QUERY = groq`
  *[_type == "page" && defined(slug.current) && (
    title match $pat || coalesce(seoTitle, "") match $pat || coalesce(seoDescription, "") match $pat
  )] [0...4] {
    _id, title, "slug": slug.current, seoTitle, seoDescription
  }
`

export const SERMONS_FOR_INGEST_QUERY = groq`
  *[_type == "sermon" && defined(slug.current)] {
    _id, title, "slug": slug.current, date, speaker, series, scripture, description, transcript
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

export async function getChatSermonsRecent() {
  return client.fetch(CHAT_SERMONS_RECENT_QUERY)
}

export async function getChatSermonsSearch(pat: string) {
  return client.fetch(CHAT_SERMONS_SEARCH_QUERY, { pat })
}

export async function getChatPagesSearch(pat: string) {
  return client.fetch(CHAT_PAGES_SEARCH_QUERY, { pat })
}

export async function getSermonsForIngest() {
  return client.fetch(SERMONS_FOR_INGEST_QUERY)
}
