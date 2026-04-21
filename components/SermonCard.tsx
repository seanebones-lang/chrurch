import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.client'

interface Props {
  sermon: {
    _id: string
    title: string
    slug: { current: string }
    date: string
    speaker?: string
    series?: string
    description?: string
    thumbnail?: object
  }
}

export default function SermonCard({ sermon }: Props) {
  const thumb = sermon.thumbnail
    ? urlFor(sermon.thumbnail).width(480).height(270).url()
    : null

  const dateStr = new Date(sermon.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <Link
      href={`/sermons/${sermon.slug.current}`}
      className="group card-sheen block bg-white rounded-[var(--radius-lg)] overflow-hidden border border-gray-200/90 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-lift)] hover:border-blue-200/70 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden ring-1 ring-inset ring-black/5">
        {thumb ? (
          <Image src={thumb} alt={sermon.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
        {sermon.series && (
          <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-1 rounded-full">
            {sermon.series}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{dateStr}</p>
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
          {sermon.title}
        </h3>
        {sermon.speaker && (
          <p className="text-sm text-gray-500 mt-1">{sermon.speaker}</p>
        )}
        {sermon.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{sermon.description}</p>
        )}
      </div>
    </Link>
  )
}
