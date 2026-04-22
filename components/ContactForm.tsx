'use client'

import { useState } from 'react'
import { CHURCH_PHONE_DISPLAY, CHURCH_PHONE_TEL } from '@/lib/church-info'

interface Props {
  title?: string
  subtitle?: string
  formId?: string
}

export default function ContactForm({ title = 'Get in Touch', subtitle, formId }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const endpoint = formId ? `https://formspree.io/f/${formId}` : '/api/contact'

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage(null)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string; code?: string }

      if (res.ok && data.success !== false) {
        setStatus('sent')
        setForm({ name: '', email: '', phone: '', message: '' })
        return
      }

      setStatus('error')
      setErrorMessage(
        typeof data.error === 'string' && data.error.trim()
          ? data.error.trim()
          : 'Something went wrong. Please try again or call us directly.',
      )
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again or call us directly.')
    }
  }

  const fieldClass =
    'w-full border border-gray-200 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-shadow'

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-[var(--radius-xl)] p-8 text-center shadow-[var(--shadow-soft)]">
        <div className="text-4xl mb-3" aria-hidden>
          ✅
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-1 font-display">Message Received!</h3>
        <p className="text-green-700 text-sm">We&apos;ll be in touch soon. God bless!</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm underline text-green-700 hover:text-green-900"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[var(--radius-xl)] border border-gray-200/90 p-8 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
      {title && <h2 className="text-2xl font-display font-semibold text-gray-900 mb-1">{title}</h2>}
      {subtitle && <p className="text-gray-500 text-sm mb-6">{subtitle}</p>}

      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
            <input
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Your name"
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@email.com"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder="(972) 920-6701"
            className={fieldClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Message *</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={update('message')}
            placeholder="How can we help?"
            className={`${fieldClass} resize-none`}
          />
        </div>

        {status === 'error' && errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 space-y-2">
            <p>{errorMessage}</p>
            <p>
              You can also call{' '}
              <a href={`tel:${CHURCH_PHONE_TEL}`} className="font-semibold underline">
                {CHURCH_PHONE_DISPLAY}
              </a>
              .
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-[var(--radius-md)] hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-md"
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
