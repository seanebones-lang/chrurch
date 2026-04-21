import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import { CHURCH_NAME } from '@/lib/church-info'
import {
  CHURCH_LEADERSHIP,
  CHURCH_VALUES,
  CORE_BELIEFS,
  MISSION_SCRIPTURE_QUOTE,
  MISSION_SCRIPTURE_REF,
  MISSION_STATEMENT,
  WELCOME_BODY,
  WELCOME_LONG,
} from '@/lib/church-content'

export const metadata: Metadata = { title: 'About Us' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Who We Are</p>
          <h1 className="text-5xl font-extrabold mb-4">About {CHURCH_NAME}</h1>
          <p className="text-blue-200 text-lg leading-relaxed">{MISSION_STATEMENT}</p>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Welcome</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">There’s a place for you here</h2>
        </div>
        <p className="text-gray-600 leading-relaxed text-lg text-center max-w-2xl mx-auto mb-6">{WELCOME_LONG}</p>
        <p className="text-gray-600 leading-relaxed text-lg text-center max-w-2xl mx-auto">{WELCOME_BODY}</p>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3 text-center">Our mission</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">From the words of Jesus</h2>
          <blockquote className="border-l-4 border-amber-400 pl-6 text-gray-700 italic leading-relaxed mb-6">
            &ldquo;{MISSION_SCRIPTURE_QUOTE}&rdquo;
          </blockquote>
          <p className="text-sm text-gray-500 text-center mb-8">— {MISSION_SCRIPTURE_REF}</p>
          <p className="text-xl font-semibold text-blue-900 text-center">{MISSION_STATEMENT}</p>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Our Values</p>
          <h2 className="text-4xl font-extrabold text-gray-900">What shapes us</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Core biblical ideas that define us as a local church.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {CHURCH_VALUES.map(v => (
            <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{v.title}</h3>
              <p className="text-xs text-amber-700 font-medium mb-3">{v.refs}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">What We Believe</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Our Core Beliefs</h2>
          </div>
          <div className="space-y-3">
            {CORE_BELIEFS.map(b => (
              <details
                key={b.title}
                className="bg-white rounded-xl border border-gray-200 px-4 py-3 group shadow-sm"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {b.title}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl">⌄</span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed pb-1">{b.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Leadership</p>
          <h2 className="text-4xl font-extrabold text-gray-900">Who Leads Us</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            {CHURCH_NAME} is blessed to have leaders who are dedicated to Christ, His mission, and His church.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CHURCH_LEADERSHIP.map(leader => (
            <div key={leader.name} className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 flex flex-col">
              <h3 className="font-bold text-gray-900 text-lg">{leader.name}</h3>
              <p className="text-amber-700 font-semibold text-sm mb-3">{leader.role}</p>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line flex-1">{leader.bio}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-10">
          To reach a leader, call the church office or{' '}
          <Link href="#contact" className="text-blue-600 font-medium hover:underline">
            send a message below
          </Link>
          .
        </p>
      </section>

      <section id="contact" className="bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <ContactForm
            title="Get in Touch"
            subtitle="Have a question or want to connect? We’d love to hear from you."
          />
        </div>
      </section>
    </div>
  )
}
