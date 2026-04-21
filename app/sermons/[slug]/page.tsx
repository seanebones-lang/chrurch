import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSermonBySlug, getSermons } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.client'
import AudioPlayer from '@/components/AudioPlayer'
import SectionReveal from '@/components/motion/SectionReveal'

export const revalidate = 60

export async function generateStaticParams() {
  const sermons = await getSermons().catch(() => [])
  return sermons.map((s: { slug: { current: string } }) => ({ slug: s.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const sermon = await getSermonBySlug(slug).catch(() => null)
  if (!sermon) return { title: 'Sermon Not Found' }
  return {
    title: sermon.title,
    description: sermon.description,
  }
}

export default async function SermonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sermon = await getSermonBySlug(slug).catch(() => null)
  if (!sermon) notFound()

  const dateStr = new Date(sermon.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const thumb = sermon.thumbnail ? urlFor(sermon.thumbnail).width(1200).height(630).url() : null

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 pt-10">
        <Link
          href="/sermons"
          className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
        >
          ← Back to Sermons
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 pb-20 pt-6">
        <SectionReveal>
          {sermon.series && (
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {sermon.series}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-gray-900 leading-tight mb-3 text-balance">
            {sermon.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
            {sermon.speaker && <span className="font-medium text-gray-700">{sermon.speaker}</span>}
            <span>{dateStr}</span>
            {sermon.scripture && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{sermon.scripture}</span>
            )}
          </div>

          {thumb && (
            <div className="relative w-full h-72 md:h-96 rounded-[var(--radius-xl)] overflow-hidden mb-8 bg-gray-100 ring-1 ring-black/5 shadow-[var(--shadow-soft)]">
              <Image src={thumb} alt={sermon.title} fill className="object-cover" priority sizes="(min-width: 896px) 56rem, 100vw" />
            </div>
          )}

          {sermon.videoUrl && (
            <div className="mb-8 rounded-[var(--radius-xl)] overflow-hidden aspect-video bg-black ring-1 ring-black/20 shadow-[var(--shadow-lift)]">
              <iframe
                src={sermon.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={sermon.title}
              />
            </div>
          )}

          {sermon.audioUrl && (
            <div className="mb-10">
              <AudioPlayer src={sermon.audioUrl} title={`Listen: ${sermon.title}`} />
            </div>
          )}

          {sermon.description && (
            <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-amber-400 pl-5 my-8 italic">
              {sermon.description}
            </p>
          )}
        </SectionReveal>

        {sermon.transcript && sermon.transcript.length > 0 && (
          <SectionReveal className="mt-10" delay={0.05}>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">Sermon Notes</h2>
              {sermon.transcript.map((block: { _key: string; children?: { text: string }[] }) => (
                <p key={block._key} className="text-gray-700 leading-relaxed mb-4">
                  {block.children?.map((c: { text: string }) => c.text).join('')}
                </p>
              ))}
            </div>
          </SectionReveal>
        )}

        <SectionReveal className="mt-16" delay={0.06}>
          <div className="bg-blue-50 rounded-[var(--radius-xl)] p-8 text-center border border-blue-100/80 shadow-[var(--shadow-soft)]">
            <h3 className="font-display font-semibold text-gray-900 text-xl mb-2">Share This Message</h3>
            <p className="text-gray-500 text-sm mb-4">Encourage a friend with this sermon.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/sermons"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                More Sermons
              </Link>
              <Link
                href="/im-new"
                className="px-6 py-2.5 border border-blue-200 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-100/80 transition-colors"
              >
                Invite a Friend
              </Link>
            </div>
          </div>
        </SectionReveal>
      </article>
    </div>
  )
}
