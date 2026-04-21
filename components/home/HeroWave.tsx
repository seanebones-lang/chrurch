'use client'

import { motion, useReducedMotion } from 'motion/react'

export default function HeroWave() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden leading-[0]" aria-hidden>
      <motion.div
        className="relative w-[120%] -ml-[10%]"
        animate={reduceMotion ? undefined : { x: ['0%', '-2.5%', '0%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 1440 80" className="w-full fill-white drop-shadow-[0_-8px_24px_rgb(0_0_0/0.06)]" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </motion.div>
    </div>
  )
}
