import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { VisitorHandoutPayload } from '@/lib/church-live-facts'
import { CHURCH_NAME } from '@/lib/church-info'

const PAGE_W = 612
const PAGE_H = 792
const MARGIN = 50
const LINE = 13
const MAX_CHARS_PER_LINE = 92

function wrapLine(s: string): string[] {
  const words = s.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length <= MAX_CHARS_PER_LINE) cur = next
    else {
      if (cur) lines.push(cur)
      cur = w.length > MAX_CHARS_PER_LINE ? `${w.slice(0, MAX_CHARS_PER_LINE - 1)}…` : w
    }
  }
  if (cur) lines.push(cur)
  return lines.length ? lines : ['']
}

function wrapParagraph(text: string): string[] {
  const out: string[] = []
  for (const raw of text.split('\n')) {
    const para = raw.trim()
    if (!para) {
      out.push('')
      continue
    }
    out.push(...wrapLine(para))
  }
  return out
}

async function drawLines(
  doc: PDFDocument,
  lines: string[],
  title: string,
  subtitle?: string,
): Promise<void> {
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  let page = doc.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN

  const draw = (t: string, bold = false, size = 11, color = rgb(0.12, 0.14, 0.18)) => {
    for (const ln of wrapParagraph(t)) {
      if (y < MARGIN + 40) {
        page = doc.addPage([PAGE_W, PAGE_H])
        y = PAGE_H - MARGIN
      }
      if (ln === '') {
        y -= LINE * 0.35
        continue
      }
      page.drawText(ln, {
        x: MARGIN,
        y,
        size,
        font: bold ? fontBold : font,
        color,
        maxWidth: PAGE_W - 2 * MARGIN,
      })
      y -= size + 3
    }
  }

  draw(title, true, 16)
  y -= 4
  if (subtitle) draw(subtitle, false, 10, rgb(0.35, 0.38, 0.42))
  y -= 8
  draw('—', false, 10)
  y -= 4

  for (const block of lines) {
    draw(block, false, 11)
    y -= 4
  }
}

export async function buildVisitorHandoutPdf(payload: VisitorHandoutPayload): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const lines: string[] = [
    payload.tagline,
    '',
    'Service times',
    ...payload.serviceTimesLines.map(l => `• ${l}`),
    '',
    'Address',
    ...payload.addressLines.map(l => `• ${l}`),
    `Maps: ${payload.mapsUrl}`,
    '',
    `Phone: ${payload.phoneDisplay} (tel: ${payload.phoneTel})`,
    payload.contactNote,
    '',
    'Giving',
    `• Visit ${payload.giving.pagePath} on this site`,
    ...(payload.giving.onlineUrl ? [`• Online portal: ${payload.giving.onlineUrl}`] : []),
    `• Text-to-give: ${payload.giving.textToGiveDisplay} (${payload.giving.textToGiveTel})`,
    `• Mail checks to: ${payload.giving.mailAddress}`,
    '',
    `Prepared (UTC): ${payload.generatedAtIso}`,
    '',
    'AI-generated / informational handout — please verify details on the church website.',
  ]

  await drawLines(doc, lines, payload.churchName, `${payload.shortName} — visitor information`)

  return doc.save()
}

export type ChatTurnPdf = { role: 'user' | 'assistant'; content: string }

export async function buildChatTranscriptPdf(turns: ChatTurnPdf[], title: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const body: string[] = [
    'This PDF is a copy of a website chat for your records. The assistant may make mistakes; confirm important details on the site or by phone.',
    '',
  ]

  for (const t of turns) {
    const label = t.role === 'user' ? 'You' : 'Assistant'
    body.push(`${label}:`, t.content.trim(), '')
  }

  await drawLines(doc, body, title, CHURCH_NAME)
  return doc.save()
}
