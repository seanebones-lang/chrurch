import type { Metadata } from 'next'
import { getSermons } from '@/lib/sanity.queries'
import SermonCard from '@/components/SermonCard'

export const metadata: Metadata = { title: 'Sermons' }
export const revalidate = 60

export default async function SermonsPage() {
  const sermons = await getSermons().catch(() => [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">The Word</p>
          <h1 className="text-5xl font-extrabold mb-4">Sermons</h1>
          <p className="text-blue-200 text-lg">
            Explore our library of messages. Listen, grow, and be transformed.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {sermons.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((s: Parameters<typeof SermonCard>[0]['sermon']) => (
              <SermonCard key={s._id} sermon={s} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <p className="text-xl font-semibold text-gray-500">No sermons yet.</p>
            <p className="text-sm mt-1">Add sermons in the Sanity Studio.</p>
          </div>
        )}
      </section>
    </div>
  )
}
