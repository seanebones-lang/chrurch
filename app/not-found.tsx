import type { Metadata } from 'next'
import Link from 'next/link'
import InnerPageHero from '@/components/layout/InnerPageHero'
import SectionReveal from '@/components/motion/SectionReveal'

export const metadata: Metadata = { title: 'Not Found' }

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-gray-50">
      <InnerPageHero
        kicker="404"
        title="Page not found"
        description={
          <p>
            The page you are looking for does not exist or may have moved. Try one of the links below or head home.
          </p>
        }
      />

      <SectionReveal as="section" className="max-w-lg mx-auto px-4 py-[var(--section-y-md)] text-center">
        <p className="text-gray-600 text-sm mb-8">
          If you followed a link from somewhere else, let us know via the contact form on our About page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex justify-center px-8 py-3.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Home
          </Link>
          <Link
            href="/about#contact"
            className="inline-flex justify-center px-8 py-3.5 rounded-full border-2 border-gray-300 text-gray-800 font-semibold hover:border-blue-400 hover:text-blue-800 transition-colors bg-white"
          >
            Contact
          </Link>
        </div>
        <ul className="mt-10 text-sm text-gray-500 space-y-2">
          <li>
            <Link href="/sermons" className="text-blue-600 hover:underline">
              Sermons
            </Link>
          </li>
          <li>
            <Link href="/events" className="text-blue-600 hover:underline">
              Events
            </Link>
          </li>
          <li>
            <Link href="/im-new" className="text-blue-600 hover:underline">
              I&apos;m New
            </Link>
          </li>
        </ul>
      </SectionReveal>
    </div>
  )
}
