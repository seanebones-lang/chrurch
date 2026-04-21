import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPastors } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.client'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = { title: 'About Us' }
export const revalidate = 60

const BELIEFS = [
  { title: 'The Bible', body: 'We believe the Scriptures are the inspired, infallible Word of God and the supreme authority for all matters of faith and practice.' },
  { title: 'Salvation', body: 'We believe salvation is by grace alone through faith alone in Christ alone — a free gift available to all who believe.' },
  { title: 'The Holy Spirit', body: 'We believe the Holy Spirit indwells every believer and empowers us for worship, witness, and transformed living.' },
  { title: 'Community', body: 'We believe the local church is God\'s primary instrument for making disciples and demonstrating His love to the world.' },
  { title: 'Prayer', body: 'We believe prayer connects us with God and is essential to every aspect of individual and corporate life.' },
  { title: 'Generosity', body: 'We believe cheerful giving reflects the heart of God and advances His kingdom both locally and globally.' },
]

export default async function AboutPage() {
  const pastors = await getPastors().catch(() => [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Who We Are</p>
          <h1 className="text-5xl font-extrabold mb-4">About Harvest Church</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            We are a family of believers rooted in faith, growing in love, and reaching our city and the world for Jesus.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Our Story</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How It All Began</h2>
          <p className="text-gray-600 leading-relaxed text-lg max-w-2xl mx-auto">
            Harvest Church was founded on the simple belief that every person matters to God and deserves to hear
            the good news of Jesus in a genuine, welcoming community. What started as a small gathering in a living room
            has grown into a thriving congregation — but our heart remains the same: love God, love people, serve the world.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 text-center mt-12">
          {[['20+', 'Years of Ministry'], ['1,000+', 'Church Family'], ['15+', 'Outreach Partners']].map(([num, label]) => (
            <div key={label} className="bg-blue-50 rounded-2xl p-6">
              <p className="text-4xl font-extrabold text-blue-700">{num}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beliefs */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">What We Believe</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Our Core Beliefs</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BELIEFS.map(b => (
              <div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <span className="text-amber-600 text-xl">✦</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastors */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Leadership</p>
          <h2 className="text-4xl font-extrabold text-gray-900">Meet Our Team</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Servant-hearted leaders who love God and love this community.
          </p>
        </div>

        {pastors.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.map((p: { _id: string; name: string; title: string; bio?: string; photo?: object; email?: string }) => {
              const photo = p.photo ? urlFor(p.photo).width(400).height(400).url() : null
              return (
                <div key={p._id} className="text-center">
                  <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden bg-blue-100 mb-4 border-4 border-white shadow-md">
                    {photo ? (
                      <Image src={photo} alt={p.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-blue-300">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl">{p.name}</h3>
                  <p className="text-amber-600 font-semibold text-sm mb-2">{p.title}</p>
                  {p.bio && <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">{p.bio}</p>}
                  {p.email && (
                    <a href={`mailto:${p.email}`} className="mt-3 inline-block text-blue-600 text-sm hover:underline">
                      {p.email}
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400">Add staff profiles in Sanity Studio.</p>
        )}
      </section>

      {/* Contact form */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <ContactForm
            title="Get in Touch"
            subtitle="Have a question or want to connect? We'd love to hear from you."
          />
        </div>
      </section>
    </div>
  )
}
