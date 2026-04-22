import Link from 'next/link'
import {
  CHURCH_NAME,
  CHURCH_ADDRESS_LINES,
  CHURCH_PHONE_DISPLAY,
  CHURCH_PHONE_TEL,
  CHURCH_SERVICE_TIMES_SUMMARY,
  CHURCH_TAGLINE,
} from '@/lib/church-info'

export default function Footer() {
  return (
    <footer className="relative z-[1] bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-amber-500/30 shadow-[0_-12px_40px_-20px_rgb(0_0_0/0.35)]">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-3 font-display tracking-tight">
            <span className="text-amber-400" aria-hidden>
              ✦
            </span>{' '}
            {CHURCH_NAME}
          </div>
          <p className="text-sm leading-relaxed text-gray-400">{CHURCH_TAGLINE}</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 uppercase text-xs tracking-wider text-amber-400/90">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ['/', 'Home'],
              ['/sermons', 'Sermons'],
              ['/events', 'Events'],
              ['/ministries', 'Ministries'],
              ['/about', 'About Us'],
              ['/im-new', "I'm New"],
              ['/give', 'Give'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-amber-400 transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/80">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 uppercase text-xs tracking-wider text-amber-400/90">Connect</h4>
          <address className="not-italic text-sm space-y-1 text-gray-400">
            {CHURCH_ADDRESS_LINES.map(line => (
              <p key={line}>{line}</p>
            ))}
            <p className="mt-2">
              <a
                href={`tel:${CHURCH_PHONE_TEL}`}
                className="hover:text-amber-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/80 rounded-sm"
              >
                {CHURCH_PHONE_DISPLAY}
              </a>
            </p>
            <p className="mt-2">
              <Link
                href="/about#contact"
                className="hover:text-amber-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/80 rounded-sm"
              >
                Send us a message →
              </Link>
            </p>
          </address>
          <div className="flex gap-3 mt-4" aria-label="Social links coming soon">
            {['FB', 'IG', 'YT'].map(s => (
              <span
                key={s}
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 cursor-default hover:border-amber-400/60 hover:text-amber-400/90 transition-colors"
                title="Coming soon"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-gray-800/80 flex flex-col md:flex-row md:flex-wrap items-center justify-center md:justify-between gap-3 text-sm text-gray-500 text-center md:text-left">
        <p>{CHURCH_SERVICE_TIMES_SUMMARY}</p>
        <p>
          © {new Date().getFullYear()} {CHURCH_NAME}. All rights reserved.
        </p>
        <p>
          Built by{' '}
          <a
            href="https://mothership-ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400/90 hover:text-amber-300 underline underline-offset-2 decoration-amber-500/50 hover:decoration-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/80 rounded-sm"
          >
            NextEleven LLC
          </a>
        </p>
      </div>
    </footer>
  )
}
