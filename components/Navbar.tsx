'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CHURCH_NAME, CHURCH_NAME_SHORT } from '@/lib/church-info'

const links = [
  { href: '/sermons', label: 'Sermons' },
  { href: '/events', label: 'Events' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/about', label: 'About' },
  { href: '/im-new', label: "I'm New" },
  { href: '/give', label: 'Give' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          title={CHURCH_NAME}
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-700"
        >
          <span className="text-amber-500">✦</span>
          <span>{CHURCH_NAME_SHORT}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/im-new"
            className="ml-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Plan Your Visit
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-gray-700 hover:text-blue-700 font-medium border-b border-gray-50 last:border-0"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/im-new"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Plan Your Visit
          </Link>
        </div>
      )}
    </nav>
  )
}
