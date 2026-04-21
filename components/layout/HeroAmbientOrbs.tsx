'use client'

import { motion, useReducedMotion } from 'motion/react'

type HeroAmbientOrbsProps = {
  /** More orbs + motion for full-width heroes (e.g. home). */
  variant?: 'inner' | 'home'
}

export default function HeroAmbientOrbs({ variant = 'inner' }: HeroAmbientOrbsProps) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  const home = variant === 'home'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute -top-[10%] -right-[5%] w-[min(70vw,32rem)] h-[min(70vw,32rem)] rounded-full bg-blue-500/30 blur-[80px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: home ? 12 : 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[0%] left-[-10%] w-[min(65vw,28rem)] h-[min(65vw,28rem)] rounded-full bg-amber-400/20 blur-[72px]"
        animate={{ scale: [1, 1.08, 1], x: [0, 24, 0], opacity: [0.25, 0.42, 0.25] }}
        transition={{ duration: home ? 14 : 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      {home && (
        <motion.div
          className="absolute top-[40%] left-[30%] w-[min(50vw,20rem)] h-[min(50vw,20rem)] rounded-full bg-indigo-400/15 blur-[64px]"
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      )}
    </div>
  )
}
