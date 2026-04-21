import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CHURCH_ADDRESS_SINGLE_LINE,
  CHURCH_GIVING_MAIL_ADDRESS,
  CHURCH_NAME,
  CHURCH_PHONE_DISPLAY,
  CHURCH_PHONE_TEL,
  CHURCH_TEXT_TO_GIVE_DISPLAY,
  CHURCH_TEXT_TO_GIVE_TEL,
} from '@/lib/church-info'

export const metadata: Metadata = { title: 'Give' }

const GIVING_OPTIONS = [
  {
    icon: '💳',
    title: 'Online Giving',
    body: `A safe way to support the mission and ministries of Harvest — one-time or recurring. You can also use the church’s established portal while this site’s payment integration is configured.`,
    cta: 'Give Online',
    href: '#give-online',
    primary: true,
  },
  {
    icon: '📱',
    title: 'Text to Give',
    body: `Text your donation amount to ${CHURCH_TEXT_TO_GIVE_DISPLAY} and follow the prompts (same flow as harvestfbc.org).`,
    cta: 'Learn More',
    href: '#text-give',
    primary: false,
  },
  {
    icon: '✉️',
    title: 'Mail a Check',
    body: `Make checks payable to ${CHURCH_NAME}. For donation credit and tax purposes, include your name and address. Mail to: ${CHURCH_GIVING_MAIL_ADDRESS}. You may also drop mail at ${CHURCH_ADDRESS_SINGLE_LINE}.`,
    cta: null,
    href: null,
    primary: false,
  },
]

export default function GivePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Generosity</p>
          <h1 className="text-5xl font-extrabold mb-4">Give to {CHURCH_NAME}</h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-xl mx-auto">
            Every gift makes a difference. Your generosity fuels ministry, serves our community, and reaches the world with the love of Jesus.
          </p>
        </div>
      </section>

      {/* Scripture */}
      <section className="py-12 bg-amber-50 border-y border-amber-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <blockquote className="text-lg text-amber-800 font-medium italic leading-relaxed">
            &ldquo;The point is this: whoever sows sparingly will also reap sparingly, and whoever sows bountifully will also reap bountifully. Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
          </blockquote>
          <p className="text-amber-600 font-semibold mt-3 text-sm">— 2 Corinthians 9:6–8</p>
        </div>
      </section>

      {/* Ways to Give */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Ways to Give</p>
          <h2 className="text-4xl font-extrabold text-gray-900">Choose How to Give</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {GIVING_OPTIONS.map(opt => (
            <div
              key={opt.title}
              className={`rounded-2xl p-8 border ${opt.primary ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              <div className="text-4xl mb-4">{opt.icon}</div>
              <h3 className={`font-bold text-xl mb-3 ${opt.primary ? 'text-white' : 'text-gray-900'}`}>{opt.title}</h3>
              <p className={`text-sm leading-relaxed mb-6 ${opt.primary ? 'text-blue-100' : 'text-gray-600'}`}>{opt.body}</p>
              {opt.cta && opt.href && (
                <a
                  href={opt.href}
                  className={`inline-block px-6 py-3 rounded-full font-semibold text-sm transition-colors ${
                    opt.primary
                      ? 'bg-amber-400 text-amber-900 hover:bg-amber-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {opt.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="text-give" className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Text to Give</h2>
          <p className="text-gray-600 text-sm mb-6">
            Text your <strong>donation amount</strong> to the number below. Follow the prompts to complete your gift.
          </p>
          <a
            href={`sms:${CHURCH_TEXT_TO_GIVE_TEL}`}
            className="inline-block text-3xl font-extrabold text-blue-700 tracking-wide hover:text-blue-900"
          >
            {CHURCH_TEXT_TO_GIVE_DISPLAY}
          </a>
          <p className="text-xs text-gray-400 mt-4">Standard message and data rates may apply.</p>
        </div>
      </section>

      {/* Online Giving Form Placeholder */}
      <section id="give-online" className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Online Giving</h2>
            <p className="text-gray-500 text-sm mb-4">
              Connect your preferred processor here when ready. Until then, you can give through the church&apos;s
              existing secure portal.
            </p>
            <p className="mb-8">
              <a
                href="https://harvestfbc.org/give/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                Open giving on harvestfbc.org ↗
              </a>
            </p>

            {/* Placeholder giving form */}
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Gift Amount</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['$25', '$50', '$100', '$250'].map(amt => (
                    <button key={amt} className="border border-blue-200 text-blue-700 rounded-lg py-2 text-sm font-semibold hover:bg-blue-50 transition-colors">
                      {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Give Toward</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white">
                  <option>General Fund</option>
                  <option>Missions</option>
                  <option>Building Fund</option>
                  <option>Youth Ministry</option>
                  <option>Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['One-time', 'Monthly', 'Weekly'].map(f => (
                    <button key={f} className="border border-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:text-blue-700 transition-colors">
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-base mt-2">
                Proceed to Secure Payment
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              Secured by 256-bit encryption
            </p>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Your Impact</p>
          <h2 className="text-4xl font-extrabold text-gray-900">Where Your Gift Goes</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: 'Local Outreach', pct: '30%', color: 'bg-blue-600' },
            { label: 'Church Operations', pct: '50%', color: 'bg-amber-400' },
            { label: 'Global Missions', pct: '20%', color: 'bg-green-500' },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className={`w-16 h-16 rounded-full ${item.color} mx-auto mb-4 flex items-center justify-center text-white font-extrabold text-xl`}>
                {item.pct}
              </div>
              <p className="font-semibold text-gray-900">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tax info */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            {CHURCH_NAME} is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the extent permitted by law.
            Questions? Call{' '}
            <a href={`tel:${CHURCH_PHONE_TEL}`} className="text-blue-600 hover:underline">
              {CHURCH_PHONE_DISPLAY}
            </a>
            {' '}or reach out through the contact form on our{' '}
            <Link href="/about" className="text-blue-600 hover:underline">About</Link> page.
          </p>
        </div>
      </section>
    </div>
  )
}
