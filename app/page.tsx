import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedSermon, getEvents, getSettings } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.client'
import SermonCard from '@/components/SermonCard'
import {
  CHURCH_ADDRESS_SINGLE_LINE,
  CHURCH_NAME_SHORT,
  CHURCH_TAGLINE,
  DEFAULT_SERVICE_TIMES,
} from '@/lib/church-info'
import { BIBLE_STUDY_SERIES_ALERT, SERMON_SERIES_ALERT } from '@/lib/church-content'

export const revalidate = 60

export default async function HomePage() {
  const [featuredSermon, events, settings] = await Promise.all([
    getFeaturedSermon().catch(() => null),
    getEvents().catch(() => []),
    getSettings().catch(() => null),
  ])

  const upcomingEvents = events.slice(0, 3)

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c9a227 0%, transparent 60%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-24 text-white">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-amber-400 font-semibold tracking-widest text-sm uppercase mb-4">
              Welcome to {CHURCH_NAME_SHORT}
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Where Faith<br />
              <span className="text-amber-400">Comes Alive</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-lg">
              {settings?.tagline || `${CHURCH_TAGLINE} Please join us for worship this Sunday.`}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/im-new" className="px-8 py-4 bg-amber-400 text-amber-900 font-bold rounded-full hover:bg-amber-300 transition-colors shadow-lg">
                Plan Your Visit
              </Link>
              <Link href="/sermons" className="px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                Watch Sermons
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      <section className="bg-amber-50 border-y border-amber-100 py-6 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 text-sm text-amber-950">
          <p className="text-center md:text-left leading-snug">
            <span className="font-bold text-amber-800">Sunday — </span>
            {SERMON_SERIES_ALERT}
          </p>
          <p className="text-center md:text-right leading-snug">
            <span className="font-bold text-amber-800">Tuesday — </span>
            {BIBLE_STUDY_SERIES_ALERT}
          </p>
        </div>
      </section>

      {/* ── Service Times ─────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-xs uppercase tracking-widest font-semibold text-gray-400 mb-8">Join Us This Week</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {(settings?.serviceTimes ?? DEFAULT_SERVICE_TIMES).map((s: { name: string; day: string; time: string }, i: number) => (
              <div key={i} className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-amber-500 font-semibold text-sm mb-1">{s.day}</p>
                <p className="text-2xl font-extrabold text-blue-900">{s.time}</p>
                <p className="text-gray-500 text-sm mt-1">{s.name}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            {settings?.address || CHURCH_ADDRESS_SINGLE_LINE}
          </p>
        </div>
      </section>

      {/* ── Latest / Featured Sermon ──────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Latest Message</p>
              <h2 className="text-3xl font-extrabold text-gray-900">This Week's Sermon</h2>
            </div>
            <Link href="/sermons" className="text-blue-600 font-semibold text-sm hover:underline">
              View all →
            </Link>
          </div>

          {featuredSermon ? (
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-md md:flex">
              {featuredSermon.thumbnail && (
                <div className="relative md:w-96 h-56 md:h-auto bg-blue-100 flex-shrink-0">
                  <Image
                    src={urlFor(featuredSermon.thumbnail).width(600).height(400).url()}
                    alt={featuredSermon.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-8 flex flex-col justify-center">
                {featuredSermon.series && (
                  <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                    {featuredSermon.series}
                  </span>
                )}
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{featuredSermon.title}</h3>
                <p className="text-gray-500 text-sm mb-1">{featuredSermon.speaker} · {new Date(featuredSermon.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                {featuredSermon.description && (
                  <p className="text-gray-600 mt-3 leading-relaxed">{featuredSermon.description}</p>
                )}
                <Link
                  href={`/sermons/${featuredSermon.slug.current}`}
                  className="mt-6 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
                >
                  Listen Now →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center text-gray-400">
              <p className="text-lg font-medium">No featured sermon yet.</p>
              <p className="text-sm mt-1">Add one in the Sanity Studio and mark it as featured.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── I'm New Teaser ────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">First Time Here?</p>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              You're Welcome<br />Just as You Are
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Whether this is your first church visit or you're looking for a new home, we'd love to meet you.
              We're a warm, diverse community that believes everyone has a place at the table.
            </p>
            <ul className="space-y-3 mb-8">
              {["Casual, welcoming atmosphere", "Engaging, relevant messages", "Kids ministry during services", "Free coffee & community"].map(item => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/im-new" className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors">
              Learn What to Expect
            </Link>
          </div>
          <div className="relative h-80 md:h-auto rounded-3xl bg-gradient-to-br from-blue-100 to-amber-50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-blue-300">
                <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                </svg>
                <p className="text-blue-400 font-medium">Your photo here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Community</p>
                <h2 className="text-3xl font-extrabold text-gray-900">Upcoming Events</h2>
              </div>
              <Link href="/events" className="text-blue-600 font-semibold text-sm hover:underline">
                See all events →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event: { _id: string; title: string; startDate: string; location?: string; category?: string }) => (
                <div key={event._id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mb-3">
                    {event.category || 'Event'}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-amber-600 font-medium">
                    {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' · '}
                    {new Date(event.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  {event.location && <p className="text-sm text-gray-500 mt-1">{event.location}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="py-20 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-blue-200 text-lg mb-8">
            Whether it's your first visit or you're ready to go deeper — we'd love to walk with you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/im-new" className="px-8 py-4 bg-amber-400 text-amber-900 font-bold rounded-full hover:bg-amber-300 transition-colors">
              I'm New Here
            </Link>
            <Link href="/give" className="px-8 py-4 border-2 border-white/50 font-semibold rounded-full hover:bg-white/10 transition-colors">
              Partner with Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
