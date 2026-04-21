import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import InnerPageHero from '@/components/layout/InnerPageHero'
import SectionReveal from '@/components/motion/SectionReveal'
import {
  CHURCH_ADDRESS_LINES,
  CHURCH_MAPS_URL,
  DEFAULT_SERVICE_TIMES,
} from '@/lib/church-info'
import { IM_NEW_FAQ, IM_NEW_INTRO } from '@/lib/church-content'

export const metadata: Metadata = { title: "I'm New" }

const FIRST_VISIT_HIGHLIGHTS = [
  {
    title: 'Word-centered worship',
    body: 'Prayer, singing, Scripture reading, preaching, and giving — usually about 90 minutes. Messages come from the Bible and aim at Christlike life.',
  },
  {
    title: 'Plenty of parking',
    body: 'We meet in a business complex with lots of Sunday morning parking. Grab a spot and head in.',
  },
  {
    title: 'Greeters & Welcome Table',
    body: 'One way in, one way out. Greeters at the door and at the Welcome Table will meet you and point you where you need to go.',
  },
]

export default function ImNewPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerPageHero
        kicker="Welcome"
        align="left"
        title={
          <>
            We Look Forward To
            <br />
            Meeting You
          </>
        }
        description={<p className="text-xl text-blue-100/95 leading-relaxed">{IM_NEW_INTRO}</p>}
      >
        <a
          href="#visit-form"
          className="inline-block px-8 py-4 bg-amber-400 text-amber-900 font-bold rounded-full hover:bg-amber-300 transition-colors shadow-lg"
        >
          Let Us Know You&apos;re Coming
        </a>
      </InnerPageHero>

      <SectionReveal as="section" className="py-[var(--section-y-md)] bg-gray-50" delay={0.04}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">First visit</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900">At a glance</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {FIRST_VISIT_HIGHLIGHTS.map(item => (
              <div
                key={item.title}
                className="bg-white rounded-[var(--radius-lg)] p-6 border border-gray-200/90 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-lift)] hover:border-blue-200/50 hover:-translate-y-0.5"
              >
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="py-[var(--section-y-lg)] bg-white" delay={0.05}>
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Service Times</p>
            <h2 className="text-3xl font-display font-semibold text-gray-900 mb-6">When & Where</h2>
            <div className="space-y-4">
              {DEFAULT_SERVICE_TIMES.map(s => (
                <div
                  key={s.name}
                  className="flex items-center gap-4 bg-blue-50 rounded-[var(--radius-md)] p-4 border border-blue-100/80 shadow-[var(--shadow-soft)]"
                >
                  <div className="text-center min-w-[4.5rem]">
                    <p className="text-xs font-semibold text-blue-600 uppercase">{s.day}</p>
                    <p className="text-xl font-extrabold text-blue-900">{s.time}</p>
                  </div>
                  <p className="text-gray-700 font-medium">{s.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-gray-50 rounded-[var(--radius-md)] border border-gray-200/90 shadow-[var(--shadow-soft)]">
              <p className="font-semibold text-gray-800 mb-1">Location</p>
              <p className="text-gray-600 text-sm">
                {CHURCH_ADDRESS_LINES[0]}
                <br />
                {CHURCH_ADDRESS_LINES[1]}
              </p>
              <a
                href={CHURCH_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline"
              >
                Get Directions →
              </a>
            </div>
          </div>

          <div>
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Questions</p>
            <h2 className="text-3xl font-display font-semibold text-gray-900 mb-6">Before you visit</h2>
            <div className="space-y-3">
              {IM_NEW_FAQ.map(item => (
                <details
                  key={item.question}
                  className="bg-gray-50 rounded-[var(--radius-md)] border border-gray-200/90 p-4 group shadow-[var(--shadow-soft)] transition-shadow open:shadow-[var(--shadow-lift)]"
                >
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center gap-2">
                    <span>{item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl shrink-0" aria-hidden>
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal as="section" id="visit-form" className="bg-gray-50 py-[var(--section-y-lg)]" delay={0.04}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-semibold text-gray-900">Planning to Visit?</h2>
            <p className="text-gray-500 mt-2">Let us know and we&apos;ll make sure someone is ready to welcome you.</p>
          </div>
          <ContactForm title="" subtitle="" />
        </div>
      </SectionReveal>
    </div>
  )
}
