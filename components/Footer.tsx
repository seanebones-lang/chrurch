import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
            <span className="text-amber-400">✦</span> Harvest Church
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Rooted in faith. Growing in love. Reaching the world.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase text-xs tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              ['/', 'Home'],
              ['/sermons', 'Sermons'],
              ['/events', 'Events'],
              ['/about', 'About Us'],
              ['/im-new', "I'm New"],
              ['/give', 'Give'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-amber-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase text-xs tracking-wider">Connect</h4>
          <address className="not-italic text-sm space-y-1 text-gray-400">
            <p>123 Main Street</p>
            <p>Your City, ST 00000</p>
            <p className="mt-2">
              <a href="tel:+15550000000" className="hover:text-amber-400 transition-colors">(555) 000-0000</a>
            </p>
            <p>
              <a href="mailto:info@harvestchurch.org" className="hover:text-amber-400 transition-colors">
                info@harvestchurch.org
              </a>
            </p>
          </address>
          <div className="flex gap-3 mt-4">
            {/* Social placeholders */}
            {['FB', 'IG', 'YT'].map(s => (
              <span
                key={s}
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 cursor-pointer hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Service times */}
      <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
        <p>Sunday Services: 9:00 AM &amp; 11:00 AM &nbsp;·&nbsp; Wednesday Bible Study: 7:00 PM</p>
        <p>© {new Date().getFullYear()} Harvest Church. All rights reserved.</p>
      </div>
    </footer>
  )
}
