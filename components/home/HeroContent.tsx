'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { CHURCH_NAME_SHORT } from '@/lib/church-info'

type HeroContentProps = {
  tagline: string
}

const MotionLink = motion(Link)

export default function HeroContent({ tagline }: HeroContentProps) {
  const reduceMotion = useReducedMotion()

  const stagger = reduceMotion ? 0 : 0.08

  return (
    <div className="max-w-2xl">
      <motion.p
        className="text-amber-400 font-semibold tracking-widest text-sm uppercase mb-4"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        Welcome to {CHURCH_NAME_SHORT}
      </motion.p>

      <motion.h1
        className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] mb-6 text-white tracking-tight"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: stagger, ease: [0.22, 1, 0.36, 1] }}
      >
        Where Faith
        <br />
        <span
          className={
            reduceMotion
              ? 'text-amber-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-[length:200%_auto] animate-text-shimmer'
          }
        >
          Comes Alive
        </span>
      </motion.h1>

      <motion.p
        className="text-xl text-blue-100/95 mb-8 leading-relaxed max-w-lg"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: stagger * 2, ease: [0.22, 1, 0.36, 1] }}
      >
        {tagline}
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-4"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: stagger * 3, ease: [0.22, 1, 0.36, 1] }}
      >
        <MotionLink
          href="/im-new"
          className="relative overflow-hidden inline-flex items-center justify-center rounded-full font-bold px-8 py-4 bg-amber-400 text-amber-900 shadow-lg btn-shimmer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          Plan Your Visit
        </MotionLink>
        <MotionLink
          href="/sermons"
          className="inline-flex items-center justify-center rounded-full font-semibold px-8 py-4 border-2 border-white/55 text-white backdrop-blur-[2px] bg-white/5 hover:bg-white/15 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
        >
          Watch Sermons
        </MotionLink>
      </motion.div>
    </div>
  )
}
