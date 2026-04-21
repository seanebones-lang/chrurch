'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type SectionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section'
  id?: string
}

export default function SectionReveal({
  children,
  className,
  delay = 0,
  as = 'div',
  id,
}: SectionRevealProps) {
  const reduceMotion = useReducedMotion()

  const MotionTag = as === 'section' ? motion.section : motion.div

  return (
    <MotionTag
      id={id}
      className={className}
      initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36, scale: 0.985 }}
      whileInView={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-10% 0px -6% 0px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 85,
              damping: 22,
              mass: 0.85,
              delay,
            }
      }
    >
      {children}
    </MotionTag>
  )
}
