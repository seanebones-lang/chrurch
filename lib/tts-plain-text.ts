/**
 * Prepare assistant text for TTS: strip markdown-ish noise and paths so speech sounds natural.
 */

const PATH_LABELS: Record<string, string> = {
  'im-new': "I'm New",
  sermons: 'sermons',
  events: 'events',
  ministries: 'ministries',
  about: 'about us',
  give: 'giving',
}

export function plainTextForTts(input: string, maxChars = 12000): string {
  let s = input.trim().replace(/\r\n/g, '\n')

  s = s.replace(/\*\*([^*]+)\*\*/g, '$1')
  s = s.replace(/\*([^*]+)\*/g, '$1')
  s = s.replace(/__([^_]+)__/g, '$1')
  s = s.replace(/_([^_]+)_/g, '$1')
  s = s.replace(/`+/g, '')

  // "/sermons" or "/about#contact" → spoken hint
  s = s.replace(/\/(im-new|sermons|events|ministries|about|give)(#[\w-]+)?/gi, (_m, page: string) => {
    const key = String(page).toLowerCase()
    const label = PATH_LABELS[key] ?? key.replace(/-/g, ' ')
    return `our ${label} page`
  })

  s = s.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ')
  return s.slice(0, maxChars)
}
