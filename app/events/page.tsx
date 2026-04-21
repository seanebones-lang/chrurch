import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getEvents } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.client'

export const metadata: Metadata = { title: 'Events' }
export const revalidate = 60

const CATEGORIES = ['All', 'Worship', 'Community', 'Youth', 'Outreach', 'Prayer', 'Study']

export default async function EventsPage() {
  const events = await getEvents().catch(() => [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Community</p>
          <h1 className="text-5xl font-extrabold mb-4">Events</h1>
          <p className="text-blue-200 text-lg">
            Stay connected. Something is always happening at Harvest Church.
          </p>
        </div>
      </section>

      {/* Events */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {events.length > 0 ? (
          <div className="space-y-6">
            {events.map((event: {
              _id: string
              title: string
              startDate: string
              endDate?: string
              location?: string
              description?: string
              category?: string
              rsvpLink?: string
              image?: object
            }) => {
              const img = event.image ? urlFor(event.image).width(400).height(250).url() : null
              const start = new Date(event.startDate)
              return (
                <div key={event._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden md:flex hover:shadow-md transition-shadow">
                  {img && (
                    <div className="relative md:w-64 h-48 md:h-auto flex-shrink-0 bg-blue-50">
                      <Image src={img} alt={event.title} fill className="object-cover" />
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
                        <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-extrabold text-blue-700">
                          {start.getDate()}
                        </p>
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
                    {event.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">{event.description}</p>
                    )}
                    {event.rsvpLink && (
                      <a
                        href={event.rsvpLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
                      >
                        RSVP / Register
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p className="text-xl font-semibold text-gray-500">No upcoming events.</p>
            <p className="text-sm mt-1">Check back soon or follow us on social media.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-14 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Have a question about an event?</h2>
          <p className="text-gray-500 mb-6">We'd love to hear from you.</p>
          <Link href="mailto:info@harvestchurch.org" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
