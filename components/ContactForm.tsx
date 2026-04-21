'use client'

import { useState } from 'react'

interface Props {
  title?: string
  subtitle?: string
  formId?: string
}

export default function ContactForm({ title = 'Get in Touch', subtitle, formId }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const endpoint = formId
    ? `https://formspree.io/f/${formId}`
    : '/api/contact'

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', phone: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-green-800 mb-1">Message Received!</h3>
        <p className="text-green-700 text-sm">We'll be in touch soon. God bless!</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm underline text-green-700">Send another</button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>}
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder="(555) 000-0000"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
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
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 resize-none"
          />
        </div>

        {status === 'error' && (
          <p className="text-red-600 text-sm">Something went wrong. Please try again or call us directly.</p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
