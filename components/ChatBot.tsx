'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CHURCH_NAME_SHORT, CHURCH_PHONE_DISPLAY } from '@/lib/church-info'
import { getPublicSiteUrl } from '@/lib/site-url'
import type { ChatSource } from '@/lib/chat-types'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
}

function linkForPath(path: string): string {
  const base = getPublicSiteUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Good day — I am glad you are here. I am the gentle assistant for ${CHURCH_NAME_SHORT}, here to help with service times, visiting for the first time, ministries, sermons, events, giving, and finding anything on this website. I only answer questions about our church and this site. How may I help you today?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [muted, setMuted] = useState(false)
  const [ttsLoadingIndex, setTtsLoadingIndex] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const autoPlayedAssistantRef = useRef<Set<number>>(new Set())
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, loading])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
    }
  }, [])

  const stopSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    setTtsLoadingIndex(null)
  }, [])

  const playTts = useCallback(
    async (index: number, text: string) => {
      stopSpeech()
      setTtsLoadingIndex(index)
      try {
        const res = await fetch('/api/chat/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
        if (!res.ok) {
          setTtsLoadingIndex(null)
          return
        }
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        audioUrlRef.current = url
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onended = () => {
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current)
            audioUrlRef.current = null
          }
          audioRef.current = null
          setTtsLoadingIndex(null)
        }
        audio.onerror = () => {
          stopSpeech()
        }
        await audio.play()
        setTtsLoadingIndex(null)
      } catch {
        stopSpeech()
      }
    },
    [stopSpeech],
  )

  /** Read each new assistant reply aloud by default (skip welcome at index 0). */
  useEffect(() => {
    if (!open || muted || loading || reduceMotion) return
    const lastIdx = messages.length - 1
    if (lastIdx <= 0) return
    const last = messages[lastIdx]
    if (last.role !== 'assistant') return
    if (autoPlayedAssistantRef.current.has(lastIdx)) return
    autoPlayedAssistantRef.current.add(lastIdx)
    void playTts(lastIdx, last.content)
  }, [messages, loading, muted, open, playTts, reduceMotion])

  const downloadChatPdf = useCallback(async () => {
    if (pdfLoading) return
    setPdfLoading(true)
    try {
      const res = await fetch('/api/chat/pdf/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'harvest-chat-transcript.pdf'
      a.rel = 'noopener'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setPdfLoading(false)
    }
  }, [messages, pdfLoading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    stopSpeech()
    setInput('')
    const updated: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = (await res.json()) as {
        message?: string
        error?: string
        sources?: ChatSource[]
      }
      const reply =
        typeof data.message === 'string' && data.message.trim()
          ? data.message.trim()
          : typeof data.error === 'string'
            ? data.error
            : `I could not load a reply. Please call us at ${CHURCH_PHONE_DISPLAY}.`
      const sources = Array.isArray(data.sources) ? data.sources.slice(0, 6) : undefined
      setMessages(prev => [...prev, { role: 'assistant', content: reply, sources }])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I am having trouble connecting right now. Please call us at ${CHURCH_PHONE_DISPLAY}.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => {
          setOpen(o => !o)
          if (open) {
            stopSpeech()
          }
        }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-blue-600 text-white shadow-[var(--shadow-lift)] hover:bg-blue-700 flex items-center justify-center ring-2 ring-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
        aria-label={open ? 'Close church chat' : 'Open church chat'}
        whileTap={reduceMotion ? { scale: 1 } : { scale: 0.94 }}
        layout
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-[60] w-80 sm:w-96 bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-lift)] border border-gray-200/90 flex flex-col overflow-hidden max-h-[min(420px,70dvh)]"
            initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 420 }}
          >
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-3 flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-blue-900 font-bold text-sm">
                H
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{CHURCH_NAME_SHORT}</p>
                <p className="text-xs text-blue-100 truncate">
                  {muted
                    ? 'Voice off — tap speaker for sound · PDFs'
                    : 'Replies read aloud · PDFs · tap speaker to mute'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMuted(m => {
                    const next = !m
                    if (next) stopSpeech()
                    return next
                  })
                }}
                className="shrink-0 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center ring-1 ring-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={muted ? 'Unmute assistant voice' : 'Mute assistant voice'}
                aria-pressed={muted}
                title={muted ? 'Turn voice on' : 'Mute voice'}
              >
                {muted ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9l6 6m0-6l-6 6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-gray-100 bg-gray-50/90 px-3 py-2 shrink-0">
              <a
                href="/api/chat/pdf/visitor"
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-blue-800 shadow-sm hover:bg-blue-50"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                Visitor handout PDF
              </a>
              <button
                type="button"
                onClick={downloadChatPdf}
                disabled={pdfLoading || !messages.some(m => m.role === 'user')}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-blue-800 shadow-sm hover:bg-blue-50 disabled:opacity-50"
              >
                {pdfLoading ? 'Preparing chat PDF…' : 'Download chat PDF'}
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={`${i}-${m.role}-${m.content.slice(0, 24)}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'user' ? (
                    <div className="max-w-[85%] px-3 py-2 text-sm leading-relaxed chat-bubble-user text-blue-900">{m.content}</div>
                  ) : (
                    <div className="max-w-[90%] flex flex-col gap-1.5 items-start">
                      <div className="px-3 py-2 text-sm leading-relaxed chat-bubble-bot text-gray-800">{m.content}</div>
                      {m.sources && m.sources.length > 0 && (
                        <div className="pl-1 w-full max-w-full rounded-lg border border-blue-100 bg-blue-50/60 px-2 py-1.5 text-[11px] text-blue-900">
                          <p className="font-semibold text-blue-800 mb-1">Related on this site</p>
                          <ul className="space-y-1">
                            {m.sources.map((s, j) => (
                              <li key={`${s.path}-${j}`}>
                                <a
                                  href={linkForPath(s.path)}
                                  className="underline decoration-blue-300 hover:decoration-blue-600 break-all"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {s.title}
                                </a>
                                {s.snippet ? <span className="text-gray-600"> — {s.snippet}</span> : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-1.5 pl-1">
                        <button
                          type="button"
                          onClick={() => playTts(i, m.content)}
                          disabled={ttsLoadingIndex !== null}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-700 shadow-sm hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500"
                          aria-label="Read this reply aloud"
                        >
                          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                          </svg>
                          {ttsLoadingIndex === i ? 'Preparing…' : 'Listen'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot px-3 py-2 text-sm text-gray-500">
                    <span className="animate-pulse">…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-100 px-3 py-2 flex gap-2 shrink-0 bg-gray-50/80">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about services, visiting, or a page…"
                className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                aria-label="Send message"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
