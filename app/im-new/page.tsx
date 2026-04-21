import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = { title: "I'm New" }

const WHAT_TO_EXPECT = [
  {
    icon: '👋',
    title: 'A Warm Welcome',
    body: 'You\'ll be greeted by friendly faces the moment you arrive. No awkward moments — just genuine people who are glad you\'re here.',
  },
  {
    icon: '👗',
    title: 'Come as You Are',
    body: 'We don\'t have a dress code. Whether you\'re in jeans or a suit, you belong here. Just come.',
  },
  {
    icon: '☕',
    title: 'Free Coffee',
    body: 'Grab a cup before service. We love good coffee and even better conversation.',
  },
  {
    icon: '🎵',
    title: 'Vibrant Worship',
    body: 'Our worship is contemporary and heartfelt. Come ready to sing, reflect, and encounter God.',
  },
  {
    icon: '📖',
    title: 'Relevant Messages',
    body: 'Our pastors teach from the Bible in a practical, applicable way. You\'ll leave with something real to carry into your week.',
  },
  {
    icon: '🧒',
    title: 'Kids Ministry',
    body: 'We have a safe, engaging program for children from nursery through middle school during every service.',
  },
]

const FAQ = [
  { q: 'What time should I arrive?', a: 'We recommend arriving 10–15 minutes early to grab coffee, get settled, and meet someone. Services start promptly.' },
  { q: 'How long is the service?', a: 'Our services run approximately 75–90 minutes, including worship and the message.' },
  { q: 'Is there parking?', a: 'Yes! We have free parking directly adjacent to the building. Overflow parking is available across the street.' },
  { q: 'What about my kids?', a: 'Kids check-in is located in the lobby. Our trained staff will help get your children signed in and excited for their own service.' },
  { q: 'Do I have to give money?', a: 'Not at all. Offering is completely optional and never expected of first-time guests.' },
  { q: 'What if I\'m not a Christian?', a: 'You are absolutely welcome here. Many of our congregation came to faith at Harvest. Come curious — no pressure, ever.' },
]

export default function ImNewPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Welcome</p>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            We've Been<br />Expecting You
          </h1>
          <p className="text-blue-200 text-xl leading-relaxed max-w-xl mb-8">
            Visiting a new church can feel intimidating. We get it. Here's everything you need to know before you come.
          </p>
          <a href="#visit-form" className="inline-block px-8 py-4 bg-amber-400 text-amber-900 font-bold rounded-full hover:bg-amber-300 transition-colors">
            Let Us Know You're Coming
          </a>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">What to Expect</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Your First Visit</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHAT_TO_EXPECT.map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Info */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">Service Times</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">When & Where</h2>
            <div className="space-y-4">
              {[
                { day: 'Sunday', time: '9:00 AM', name: 'Morning Service' },
                { day: 'Sunday', time: '11:00 AM', name: 'Celebration Service' },
                { day: 'Wednesday', time: '7:00 PM', name: 'Bible Study' },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-4 bg-blue-50 rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-blue-600 uppercase">{s.day}</p>
                    <p className="text-xl font-extrabold text-blue-900">{s.time}</p>
                  </div>
                  <p className="text-gray-700 font-medium">{s.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="font-semibold text-gray-800 mb-1">Location</p>
              <p className="text-gray-600 text-sm">123 Main Street<br />Your City, ST 00000</p>
              <a href="#" className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline">
                Get Directions →
              </a>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-3">FAQs</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Common Questions</h2>
            <div className="space-y-4">
              {FAQ.map(item => (
                <details key={item.q} className="bg-gray-50 rounded-xl border border-gray-200 p-4 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {item.q}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl">⌄</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visitor Form */}
      <section id="visit-form" className="bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Planning to Visit?</h2>
            <p className="text-gray-500 mt-2">Let us know and we'll make sure someone is ready to welcome you!</p>
          </div>
          <ContactForm
            title=""
            subtitle=""
          />
        </div>
      </section>
    </div>
  )
}
