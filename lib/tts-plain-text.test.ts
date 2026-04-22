import { describe, expect, it } from 'vitest'
import { plainTextForTts } from '@/lib/tts-plain-text'

describe('plainTextForTts', () => {
  it('strips bold markers', () => {
    expect(plainTextForTts('Visit **Sermons** now')).toBe('Visit Sermons now')
  })

  it('rewrites sermon path for speech', () => {
    expect(plainTextForTts('See /sermons for more')).toContain('our sermons page')
  })

  it('respects max length', () => {
    const long = 'a'.repeat(100)
    expect(plainTextForTts(long, 20).length).toBe(20)
  })
})
