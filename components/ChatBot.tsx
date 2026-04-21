'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CHURCH_NAME_SHORT, CHURCH_PHONE_DISPLAY } from '@/lib/church-info'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I am the ${CHURCH_NAME_SHORT} assistant. Ask me about service times, sermons, events, or anything else. How can I help?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
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
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
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
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-blue-600 text-white shadow-[var(--shadow-lift)] hover:bg-blue-700 flex items-center justify-center ring-2 ring-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
        aria-label={open ? 'Close church chat' : 'Open church chat'}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
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
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 420 }}
          >
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-3 flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-blue-900 font-bold text-sm">
                H
              </div>
              <div>
                <p className="font-semibold text-sm">{CHURCH_NAME_SHORT}</p>
                <p className="text-xs text-blue-100">Ask me anything</p>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
                      m.role === 'user' ? 'chat-bubble-user text-blue-900' : 'chat-bubble-bot text-gray-800'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot px-3 py-2 text-sm text-gray-500">
                    <span className="animate-pulse">...</span>
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
                placeholder="Type a message..."
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
