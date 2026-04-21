import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedSermon, getEvents, getSettings } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.client'
import HeroBackdrop from '@/components/hero/HeroBackdrop'
import HeroContent from '@/components/home/HeroContent'
import HeroWave from '@/components/home/HeroWave'
import ServiceTimeCards from '@/components/home/ServiceTimeCards'
import HeroAmbientOrbs from '@/components/layout/HeroAmbientOrbs'
import SectionReveal from '@/components/motion/SectionReveal'
import {
  CHURCH_ADDRESS_SINGLE_LINE,
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
  const heroTagline =
    settings?.tagline || `${CHURCH_TAGLINE} Please join us for worship this Sunday.`

  const welcomeImageUrl = settings?.welcomeSectionImage
    ? urlFor(settings.welcomeSectionImage).width(900).height(700).url()
    : null

  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <HeroBackdrop />
        <HeroAmbientOrbs variant="home" />
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-950/90 via-blue-950/25 to-blue-900/50"
          aria-hidden
        />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(251_191_36/0.15),transparent)]" aria-hidden />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-28 md:py-32 w-full text-white">
          <HeroContent tagline={heroTagline} />
        </div>

        <HeroWave />
      </section>

      <SectionReveal as="section" className="bg-amber-50 border-y border-amber-100 py-6 px-4">
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
      </SectionReveal>

      <SectionReveal as="section" className="py-[var(--section-y-md)] bg-white" delay={0.04}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-xs uppercase tracking-widest font-semibold text-gray-400 mb-8">
            Join Us This Week
          </h2>
          <ServiceTimeCards times={settings?.serviceTimes ?? DEFAULT_SERVICE_TIMES} />
          <p className="text-center text-gray-500 text-sm mt-6">
            {settings?.address || CHURCH_ADDRESS_SINGLE_LINE}
          </p>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="py-[var(--section-y-lg)] bg-gray-50" delay={0.06}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Latest Message</p>
              <h2 className="text-3xl font-semibold text-gray-900 font-display">This Week&apos;s Sermon</h2>
            </div>
            <Link href="/sermons" className="text-blue-600 font-semibold text-sm hover:underline">
              View all →
            </Link>
          </div>

          {featuredSermon ? (
            <Link
              href={`/sermons/${featuredSermon.slug.current}`}
              aria-label={`Open sermon: ${featuredSermon.title}`}
              className="group card-sheen bg-white rounded-[var(--radius-xl)] overflow-hidden border border-gray-200/90 shadow-[var(--shadow-soft)] md:flex transition-all duration-300 hover:border-blue-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {featuredSermon.thumbnail && (
                <div className="relative md:w-96 h-56 md:h-auto min-h-[14rem] bg-blue-100 flex-shrink-0">
                  <Image
                    src={urlFor(featuredSermon.thumbnail).width(600).height(400).url()}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(min-width: 768px) 24rem, 100vw"
                    aria-hidden
                  />
                </div>
              )}
              <div className="p-8 flex flex-col justify-center text-left">
                {featuredSermon.series && (
                  <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                    {featuredSermon.series}
                  </span>
                )}
                <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors">
                  {featuredSermon.title}
                </h3>
                <p className="text-gray-500 text-sm mb-1">
                  {featuredSermon.speaker} ·{' '}
                  {new Date(featuredSermon.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {featuredSermon.description && (
                  <p className="text-gray-600 mt-3 leading-relaxed line-clamp-3">{featuredSermon.description}</p>
                )}
                <span className="mt-6 inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:text-blue-800 group-hover:gap-3 transition-all">
                  Listen now <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ) : (
            <div className="bg-white rounded-[var(--radius-xl)] border border-dashed border-gray-300 p-16 text-center text-gray-400">
              <p className="text-lg font-medium">No featured sermon yet.</p>
              <p className="text-sm mt-1">Add one in the Sanity Studio and mark it as featured.</p>
            </div>
          )}
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="py-[var(--section-y-lg)] bg-white" delay={0.04}>
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">First Time Here?</p>
            <h2 className="text-4xl font-display font-semibold text-gray-900 leading-tight mb-4">
              You&apos;re Welcome
              <br />
              Just as You Are
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Whether this is your first church visit or you&apos;re looking for a new home, we&apos;d love to meet
              you. We&apos;re a warm, diverse community that believes everyone has a place at the table.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Casual, welcoming atmosphere',
                'Engaging, relevant messages',
                'Kids ministry during services',
                'Free coffee & community',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/im-new"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md"
            >
              Learn What to Expect
            </Link>
          </div>
          <div className="relative min-h-[20rem] md:min-h-[24rem] rounded-[var(--radius-xl)] bg-gradient-to-br from-blue-100 to-amber-50 overflow-hidden shadow-[var(--shadow-lift)] ring-1 ring-black/5">
            {welcomeImageUrl ? (
              <Image
                src={welcomeImageUrl}
                alt="Welcome — we are glad you are here"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-200/40 via-blue-50 to-amber-100/60">
                <div className="rounded-full bg-white/80 p-5 shadow-[var(--shadow-soft)] mb-4">
                  <svg className="w-14 h-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-blue-900/80 font-medium max-w-xs">
                  Add a welcome photo in Sanity: Site Settings → Home &quot;Welcome&quot; section image.
                </p>
              </div>
            )}
          </div>
        </div>
      </SectionReveal>

      {upcomingEvents.length > 0 && (
        <SectionReveal as="section" className="py-[var(--section-y-lg)] bg-gray-50" delay={0.05}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-2">Community</p>
                <h2 className="text-3xl font-semibold text-gray-900 font-display">Upcoming Events</h2>
              </div>
              <Link href="/events" className="text-blue-600 font-semibold text-sm hover:underline">
                See all events →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map(
                (event: {
                  _id: string
                  title: string
                  startDate: string
                  location?: string
                  category?: string
                }) => (
                  <Link
                    key={event._id}
                    href={`/events#event-${event._id}`}
                    className="group card-sheen block bg-white rounded-[var(--radius-lg)] p-6 border border-gray-200/90 shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-blue-200/60 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mb-3">
                      {event.category || 'Event'}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 font-display group-hover:text-blue-800 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-amber-600 font-medium">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' · '}
                      {new Date(event.startDate).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                    {event.location && <p className="text-sm text-gray-500 mt-1">{event.location}</p>}
                    <p className="text-xs text-blue-600 font-semibold mt-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      Details on Events page →
                    </p>
                  </Link>
                ),
              )}
            </div>
          </div>
        </SectionReveal>
      )}

      <SectionReveal as="section" className="py-[var(--section-y-lg)] bg-blue-700 text-white text-center" delay={0.04}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-display font-semibold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-blue-200 text-lg mb-8">
            Whether it&apos;s your first visit or you&apos;re ready to go deeper — we&apos;d love to walk with you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/im-new"
              className="px-8 py-4 bg-amber-400 text-amber-900 font-bold rounded-full hover:bg-amber-300 transition-colors shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
            >
              I&apos;m New Here
            </Link>
            <Link
              href="/give"
              className="px-8 py-4 border-2 border-white/50 font-semibold rounded-full hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            >
              Partner with Us
            </Link>
          </div>
        </div>
      </SectionReveal>
    </div>
  )
}
