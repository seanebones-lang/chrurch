/** Canonical public site URL (no trailing slash). */
export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return ''
  return raw.replace(/\/+$/, '')
}

export function absoluteUrl(path: string): string {
  const base = getPublicSiteUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}
