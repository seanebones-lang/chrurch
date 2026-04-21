/**
 * Single source for “live” church facts: Sanity Site Settings merged with static fallbacks.
 * Used by chat system prompt, PDFs, and retrieval context.
 */

import {
  CHURCH_ADDRESS_LINES,
  CHURCH_ADDRESS_SINGLE_LINE,
  CHURCH_GIVING_MAIL_ADDRESS,
  CHURCH_MAPS_URL,
  CHURCH_NAME,
  CHURCH_NAME_SHORT,
  CHURCH_PHONE_DISPLAY,
  CHURCH_PHONE_TEL,
  CHURCH_SERVICE_TIMES_SUMMARY,
  CHURCH_TAGLINE,
  CHURCH_TEXT_TO_GIVE_DISPLAY,
  CHURCH_TEXT_TO_GIVE_TEL,
  DEFAULT_SERVICE_TIMES,
  LEAD_PASTOR,
} from '@/lib/church-info'

export type SanityServiceTime = { day?: string; time?: string; name?: string }

export type SanitySettingsDoc = {
  churchName?: string
  tagline?: string
  serviceTimes?: SanityServiceTime[] | null
  address?: string | null
  phone?: string | null
  email?: string | null
  giveLink?: string | null
} | null

export type VisitorHandoutPayload = {
  churchName: string
  shortName: string
  tagline: string
  leadPastor: string
  serviceTimesLines: string[]
  serviceTimesSummary: string
  addressLines: string[]
  addressOneLine: string
  mapsUrl: string
  phoneDisplay: string
  phoneTel: string
  contactNote: string
  giving: {
    pagePath: string
    textToGiveDisplay: string
    textToGiveTel: string
    mailAddress: string
    onlineUrl: string | null
  }
  generatedAtIso: string
}

function serviceTimesFromSettings(s: SanitySettingsDoc): { lines: string[]; summary: string } {
  const rows = s?.serviceTimes?.filter(r => r?.day && r?.time)
  if (rows?.length) {
    const lines = rows.map(r => `${r.day}: ${r.time}${r.name ? ` — ${r.name}` : ''}`)
    const summary = lines.join(' · ')
    return { lines, summary }
  }
  const lines = DEFAULT_SERVICE_TIMES.map(sv => `${sv.day}: ${sv.time} — ${sv.name}`)
  return { lines, summary: CHURCH_SERVICE_TIMES_SUMMARY }
}

function addressFromSettings(s: SanitySettingsDoc): string[] {
  const t = s?.address?.trim()
  if (t) {
    const parts = t.split(/\n+/).map(x => x.trim()).filter(Boolean)
    if (parts.length) return parts
  }
  return [...CHURCH_ADDRESS_LINES]
}

export function buildVisitorHandoutPayload(settings: SanitySettingsDoc): VisitorHandoutPayload {
  const { lines, summary } = serviceTimesFromSettings(settings)
  const addr = addressFromSettings(settings)
  const oneLine = addr.length > 1 ? addr.join(', ') : addr[0] || CHURCH_ADDRESS_SINGLE_LINE
  const phoneDisplay = settings?.phone?.trim() || CHURCH_PHONE_DISPLAY
  const digits = phoneDisplay.replace(/\D/g, '')
  const phoneTel =
    digits.length >= 10 ? `+1${digits.slice(-10)}` : CHURCH_PHONE_TEL

  return {
    churchName: settings?.churchName?.trim() || CHURCH_NAME,
    shortName: CHURCH_NAME_SHORT,
    tagline: settings?.tagline?.trim() || CHURCH_TAGLINE,
    leadPastor: LEAD_PASTOR,
    serviceTimesLines: lines,
    serviceTimesSummary: summary,
    addressLines: addr,
    addressOneLine: oneLine,
    mapsUrl: CHURCH_MAPS_URL,
    phoneDisplay,
    phoneTel,
    contactNote:
      'For written messages, please use the contact form on the About page (/about#contact). This handout is for general information only.',
    giving: {
      pagePath: '/give',
      textToGiveDisplay: CHURCH_TEXT_TO_GIVE_DISPLAY,
      textToGiveTel: CHURCH_TEXT_TO_GIVE_TEL,
      mailAddress: CHURCH_GIVING_MAIL_ADDRESS,
      onlineUrl: settings?.giveLink?.trim() || null,
    },
    generatedAtIso: new Date().toISOString(),
  }
}

/** Markdown-ish block for the model: authoritative when Sanity is wired. */
export function formatLiveSiteFactsBlock(settings: SanitySettingsDoc): string {
  const p = buildVisitorHandoutPayload(settings)
  const giveLine = p.giving.onlineUrl
    ? `- Online giving: ${p.giving.onlineUrl}\n- Giving page on this site: ${p.giving.pagePath}`
    : `- Giving page: ${p.giving.pagePath} (online portal link may appear there)`

  return `
## Live site facts (prefer this section for times, address, phone, and giving link if listed)
- Church name: ${p.churchName}
- Tagline: ${p.tagline}
- Lead pastor (public): ${p.leadPastor}
- Service times:
${p.serviceTimesLines.map(l => `  - ${l}`).join('\n')}
- One-line times: ${p.serviceTimesSummary}
- Address:
${p.addressLines.map(l => `  - ${l}`).join('\n')}
- One line address: ${p.addressOneLine}
- Maps: ${p.mapsUrl}
- Phone (display): ${p.phoneDisplay} (tel: ${p.phoneTel})
${giveLine}
- Text-to-give: ${p.giving.textToGiveDisplay} (tel/sms: ${p.giving.textToGiveTel})
- Mail checks to: ${p.giving.mailAddress}
`.trim()
}
