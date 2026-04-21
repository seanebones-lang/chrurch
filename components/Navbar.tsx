'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { CHURCH_NAME, CHURCH_NAME_SHORT } from '@/lib/church-info'

const links = [
  { href: '/sermons', label: 'Sermons' },
  { href: '/events', label: 'Events' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/about', label: 'About' },
  { href: '/im-new', label: "I'm New" },
  { href: '/give', label: 'Give' },
]

const MotionLink = motion(Link)

const linkShell = {
  rest: {},
  hover: {},
}

const linkLine = {
  rest: { scaleX: 0, opacity: 0 },
  hover: { scaleX: 1, opacity: 1 },
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [elevated, setElevated] = useState(false)
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', latest => {
    setElevated(latest > 12)
  })

  return (
    <motion.nav
      className={`fixed top-0 inset-x-0 z-50 border-b transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        elevated
          ? 'bg-white/95 backdrop-blur-xl border-gray-200/90 shadow-[0_8px_30px_-12px_rgb(15_23_42/0.12)]'
          : 'bg-white/80 backdrop-blur-md border-gray-100/70 shadow-[var(--shadow-soft)]'
      }`}
      initial={false}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <MotionLink
          href="/"
          title={CHURCH_NAME}
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-md"
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          <span className="text-amber-500 inline-block" aria-hidden>
            ✦
          </span>
          <span>{CHURCH_NAME_SHORT}</span>
        </MotionLink>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <MotionLink
              key={l.href}
              href={l.href}
              variants={linkShell}
              className="relative px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-700 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              initial="rest"
              whileHover={reduceMotion ? undefined : 'hover'}
              animate="rest"
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            >
              {l.label}
              <motion.span
                variants={linkLine}
                className="pointer-events-none absolute left-3 right-3 bottom-1 h-0.5 rounded-full bg-amber-400 origin-left"
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              />
            </MotionLink>
          ))}
          <MotionLink
            href="/im-new"
            className="ml-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            Plan Your Visit
          </MotionLink>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
            initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-4 pb-4 pt-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.04 * i }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-gray-700 hover:text-blue-700 font-medium border-b border-gray-50 last:border-0"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/im-new"
                onClick={() => setOpen(false)}
                className="mt-3 block text-center px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Plan Your Visit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
