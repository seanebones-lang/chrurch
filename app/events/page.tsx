import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getEvents } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.client'
import InnerPageHero from '@/components/layout/InnerPageHero'
import SectionReveal from '@/components/motion/SectionReveal'
import { CHURCH_NAME, CHURCH_PHONE_TEL, CHURCH_PHONE_DISPLAY } from '@/lib/church-info'

export const metadata: Metadata = { title: 'Events' }
export const revalidate = 60

export default async function EventsPage() {
  const events = await getEvents().catch(() => [])

  return (
    <div className="min-h-screen bg-gray-50">
      <InnerPageHero
        kicker="Community"
        title="Events"
        description={
          <p>
            Stay connected. Something is always happening at {CHURCH_NAME}.
          </p>
        }
      />

      <SectionReveal as="section" className="max-w-6xl mx-auto px-4 py-[var(--section-y-md)]">
        {events.length > 0 ? (
          <div className="space-y-6">
            {events.map(
              (event: {
                _id: string
                title: string
                startDate: string
                endDate?: string
                location?: string
                description?: string
                category?: string
                image?: object
                rsvpLink?: string
              }) => {
                const img = event.image ? urlFor(event.image).width(400).height(250).url() : null
                const start = new Date(event.startDate)
                return (
                  <div
                    id={`event-${event._id}`}
                    key={event._id}
                    className="bg-white rounded-[var(--radius-lg)] border border-gray-200/90 shadow-[var(--shadow-soft)] overflow-hidden md:flex transition-all duration-300 hover:shadow-[var(--shadow-lift)] hover:border-blue-200/60 scroll-mt-28"
                  >
                    {img && (
                      <div className="relative md:w-64 h-48 md:h-auto min-h-[12rem] flex-shrink-0 bg-blue-50">
                        <Image
                          src={img}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 16rem, 100vw"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <div>
                          {event.category && (
                            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                              {event.category}
                            </span>
                          )}
                          <h2 className="text-xl font-bold text-gray-900 font-display">{event.title}</h2>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-extrabold text-blue-700">{start.getDate()}</p>
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            {start.toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-amber-600 font-medium mb-1">
                        {start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        {' at '}
                        {start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                      {event.location && <p className="text-sm text-gray-500 mb-2">{event.location}</p>}
                      {event.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3">{event.description}</p>
                      )}
                      {event.rsvpLink && (
                        <a
                          href={event.rsvpLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          RSVP or details ↗
                        </a>
                      )}
                    </div>
                  </div>
                )
              },
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[var(--radius-xl)] border border-dashed border-gray-200">
            <p className="text-gray-500 text-lg font-medium">No upcoming events right now.</p>
            <p className="text-sm mt-1">Check back soon or follow us on social media.</p>
          </div>
        )}
      </SectionReveal>

      <SectionReveal as="section" className="py-[var(--section-y-md)] bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-display font-semibold text-gray-900 mb-3">Have a question about an event?</h2>
          <p className="text-gray-500 mb-6">We&apos;d love to hear from you.</p>
          <Link
            href={`tel:${CHURCH_PHONE_TEL}`}
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-md"
          >
            Call {CHURCH_PHONE_DISPLAY}
          </Link>
        </div>
      </SectionReveal>
    </div>
  )
}
