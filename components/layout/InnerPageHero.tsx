'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import HeroAmbientOrbs from '@/components/layout/HeroAmbientOrbs'

type InnerPageHeroProps = {
  kicker: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
  className?: string
  children?: ReactNode
}

export default function InnerPageHero({
  kicker,
  title,
  description,
  align = 'center',
  className = '',
  children,
}: InnerPageHeroProps) {
  const reduceMotion = useReducedMotion()
  const inner =
    align === 'center' ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-4xl mx-auto'
  const descWrap = align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'

  const stagger = reduceMotion ? 0 : 0.06

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20 md:py-24 ${className}`}
    >
      <HeroAmbientOrbs variant="inner" />
      <div
        className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_90%_70%_at_20%_0%,rgb(37_99_235/0.45),transparent),radial-gradient(ellipse_70%_55%_at_90%_15%,rgb(251_191_36/0.18),transparent)] mix-blend-screen"
        aria-hidden
      />
      <div className={`relative z-10 px-4 ${inner}`}>
        <motion.p
          className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {kicker}
        </motion.p>
        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 tracking-tight text-balance"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.div
            className={`text-blue-100/95 text-lg leading-relaxed ${descWrap}`}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: stagger * 2, ease: [0.22, 1, 0.36, 1] }}
          >
            {description}
          </motion.div>
        )}
        {children ? (
          <motion.div
            className={align === 'center' ? 'mt-8 flex flex-wrap justify-center gap-3' : 'mt-8'}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: stagger * 3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
