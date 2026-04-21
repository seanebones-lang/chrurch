/**
 * Grounding text for the church chatbot (xAI). Keep in sync with public site content.
 * Do not put secrets here — only information already on the website or in church-info.
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
import { IM_NEW_FAQ, IM_NEW_INTRO } from '@/lib/church-content/im-new'
import { MISSION_STATEMENT } from '@/lib/church-content/mission'

const SERVICE_TIMES_DETAIL = DEFAULT_SERVICE_TIMES.map(
  s => `- ${s.day}: ${s.time} — ${s.name}`,
).join('\n')

const FAQ_BULLETS = IM_NEW_FAQ.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')

/** Site map: path → what the user finds there (for navigation help). */
export const SITE_NAV_HELP = `
## Website pages (use these paths when directing users)
- / (Home) — Featured sermon teaser, service times, upcoming events, welcome section, main calls to action.
- /sermons — Sermon library; each sermon may include audio, video, notes.
- /events — Upcoming church events; RSVP links when editors add them in Sanity.
- /ministries — Harvest Kids, Harvest Students, fellowship groups, serving, outreach.
- /about — Mission, values, beliefs (expandable), leadership bios, **Contact form** at the bottom (anchor #contact).
- /im-new — First-visit expectations, service times & location, FAQ, form to say you are visiting.
- /give — Ways to give (online portal link, text-to-give, mail-a-check), impact summary, tax note.
`.trim()

/**
 * Factual grounding block injected into the model system prompt.
 */
export function buildChurchSiteKnowledgeBlock(): string {
  return `
## Church identity
- Full name: ${CHURCH_NAME}
- Short name: ${CHURCH_NAME_SHORT}
- Tagline: ${CHURCH_TAGLINE}
- Mission statement: ${MISSION_STATEMENT}
- Lead pastor (public): ${LEAD_PASTOR}

## Location & directions
- Address (two lines): ${CHURCH_ADDRESS_LINES[0]}; ${CHURCH_ADDRESS_LINES[1]}
- One line: ${CHURCH_ADDRESS_SINGLE_LINE}
- Google Maps search link: ${CHURCH_MAPS_URL}

## Service times (defaults — if a **Live site facts** section appears later in this same system message, prefer that section for times, address, phone, and giving link)
- Summary: ${CHURCH_SERVICE_TIMES_SUMMARY}
- Detail:
${SERVICE_TIMES_DETAIL}

## Phone & contact
- Church office phone (display): ${CHURCH_PHONE_DISPLAY}
- Click-to-call / tel URI uses: ${CHURCH_PHONE_TEL}
- **Written messages:** There is no public congregation email in this assistant’s knowledge. Direct people to the **Contact form on the About page**: path \`/about\` and section \`#contact\` (full URL on their site will be the same path on the domain they are using).
- For urgent pastoral emergencies, still recommend calling the office number during business hours unless the site publishes another number.

## Giving
- Giving page: \`/give\`
- Text-to-give number (display): ${CHURCH_TEXT_TO_GIVE_DISPLAY} (tel/sms: ${CHURCH_TEXT_TO_GIVE_TEL})
- Mail checks to: ${CHURCH_GIVING_MAIL_ADDRESS} (make checks payable to ${CHURCH_NAME}; include name and address for tax receipt.)
- Online giving may also point to the church’s existing portal (see /give page copy for harvestfbc.org link when applicable).

## First-time visitors
- Intro: ${IM_NEW_INTRO}

### Visitor FAQ (answer from this when relevant)
${FAQ_BULLETS}

${SITE_NAV_HELP}
`.trim()
}
