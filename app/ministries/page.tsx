import type { Metadata } from 'next'
import Link from 'next/link'
import InnerPageHero from '@/components/layout/InnerPageHero'
import SectionReveal from '@/components/motion/SectionReveal'
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
      <InnerPageHero
        kicker="Life together"
        title="Ministries"
        description={
          <p>
            How {CHURCH_NAME} equips every age to trust Jesus, grow in community, and serve others.
          </p>
        }
      />

      <nav className="border-b border-gray-200/80 bg-white/90 backdrop-blur-md sticky top-16 z-40 shadow-[var(--shadow-soft)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2 justify-center text-sm">
          {nav.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200/90 text-gray-700 hover:border-blue-300 hover:text-blue-800 hover:bg-blue-50/80 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <SectionReveal as="section" id="harvest-kids" className="py-[var(--section-y-lg)] max-w-4xl mx-auto px-4 scroll-mt-28">
        <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">{HARVEST_KIDS_TITLE}</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-2">{HARVEST_KIDS_TAGLINE}</h2>
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
      </SectionReveal>

      <SectionReveal as="section" id="harvest-students" className="bg-gray-50 py-[var(--section-y-lg)] scroll-mt-28" delay={0.03}>
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">{HARVEST_STUDENTS_TITLE}</p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-2">{HARVEST_STUDENTS_TAGLINE}</h2>
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
      </SectionReveal>

      <SectionReveal as="section" id="fellowship-groups" className="py-[var(--section-y-lg)] max-w-4xl mx-auto px-4 scroll-mt-28" delay={0.04}>
        <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Community</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-8">Fellowship Groups</h2>
        <div className="space-y-8">
          {FELLOWSHIP_GROUPS.map(g => (
            <div
              key={g.title}
              className="bg-blue-50 rounded-[var(--radius-lg)] p-6 border border-blue-100 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
            >
              <h3 className="font-bold text-gray-900 text-lg mb-2">{g.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{g.body}</p>
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal as="section" id="serve-the-church" className="bg-gray-50 py-[var(--section-y-lg)] scroll-mt-28" delay={0.03}>
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Volunteer</p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">Serve the Church</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mb-10">{SERVE_THE_CHURCH_INTRO}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVE_ROLES.map(r => (
              <div
                key={r.title}
                className="bg-white rounded-[var(--radius-md)] p-5 border border-gray-200/90 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-lift)] hover:border-blue-200/50 hover:-translate-y-0.5"
              >
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
      </SectionReveal>

      <SectionReveal as="section" id="engage-the-world" className="py-[var(--section-y-lg)] max-w-4xl mx-auto px-4 scroll-mt-28" delay={0.04}>
        <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Outreach</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-2">{ENGAGE_THE_WORLD_TITLE}</h2>
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
      </SectionReveal>
    </div>
  )
}
