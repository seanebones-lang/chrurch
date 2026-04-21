import type { Metadata } from 'next'
import Link from 'next/link'
import { CHURCH_NAME } from '@/lib/church-info'
import {
  ENGAGE_THE_WORLD_INTRO,
  ENGAGE_THE_WORLD_PILLARS,
  ENGAGE_THE_WORLD_TITLE,
  FELLOWSHIP_GROUPS,
  HARVEST_KIDS_BODY,
  HARVEST_KIDS_SAFETY,
  HARVEST_KIDS_TAGLINE,
  HARVEST_KIDS_TITLE,
  HARVEST_STUDENTS_INTRO,
  HARVEST_STUDENTS_NOTE,
  HARVEST_STUDENTS_SECTIONS,
  HARVEST_STUDENTS_TAGLINE,
  HARVEST_STUDENTS_TITLE,
  SERVE_ROLES,
  SERVE_THE_CHURCH_INTRO,
} from '@/lib/church-content'

export const metadata: Metadata = { title: 'Ministries' }

const nav = [
  ['#harvest-kids', HARVEST_KIDS_TITLE],
  ['#harvest-students', HARVEST_STUDENTS_TITLE],
  ['#fellowship-groups', 'Fellowship Groups'],
  ['#serve-the-church', 'Serve the Church'],
  ['#engage-the-world', ENGAGE_THE_WORLD_TITLE],
] as const

export default function MinistriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Life together</p>
          <h1 className="text-5xl font-extrabold mb-4">Ministries</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            How {CHURCH_NAME} equips every age to trust Jesus, grow in community, and serve others.
          </p>
        </div>
      </section>

      <nav className="border-b border-gray-200 bg-gray-50 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2 justify-center text-sm">
          {nav.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-800 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="harvest-kids" className="py-20 max-w-4xl mx-auto px-4 scroll-mt-28">
        <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">{HARVEST_KIDS_TITLE}</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{HARVEST_KIDS_TAGLINE}</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed mt-6">
          {HARVEST_KIDS_BODY.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mt-10 mb-3">Safety</h3>
        <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
          {HARVEST_KIDS_SAFETY.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section id="harvest-students" className="bg-gray-50 py-20 scroll-mt-28">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">{HARVEST_STUDENTS_TITLE}</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{HARVEST_STUDENTS_TAGLINE}</h2>
          <p className="text-gray-600 leading-relaxed mt-6">{HARVEST_STUDENTS_INTRO}</p>
          <div className="space-y-10 mt-10">
            {HARVEST_STUDENTS_SECTIONS.map(s => (
              <div key={s.heading}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.heading}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mt-8 border-l-4 border-amber-400 pl-4">{HARVEST_STUDENTS_NOTE}</p>
        </div>
      </section>

      <section id="fellowship-groups" className="py-20 max-w-4xl mx-auto px-4 scroll-mt-28">
        <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Community</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Fellowship Groups</h2>
        <div className="space-y-8">
          {FELLOWSHIP_GROUPS.map(g => (
            <div key={g.title} className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{g.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="serve-the-church" className="bg-gray-50 py-20 scroll-mt-28">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Volunteer</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Serve the Church</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mb-10">{SERVE_THE_CHURCH_INTRO}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVE_ROLES.map(r => (
              <div key={r.title} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 capitalize mb-2">{r.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-10">
            <Link href="/about#contact" className="text-blue-600 font-semibold hover:underline">
              Contact us to serve →
            </Link>
          </p>
        </div>
      </section>

      <section id="engage-the-world" className="py-20 max-w-4xl mx-auto px-4 scroll-mt-28">
        <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Outreach</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{ENGAGE_THE_WORLD_TITLE}</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed mt-6">
          {ENGAGE_THE_WORLD_INTRO.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="space-y-8 mt-12">
          {ENGAGE_THE_WORLD_PILLARS.map(p => (
            <div key={p.title}>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{p.body}</p>
              {p.href && p.linkLabel && (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-600 text-sm font-semibold hover:underline"
                >
                  {p.linkLabel} ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
