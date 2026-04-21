'use client'

import { motion, useReducedMotion } from 'motion/react'

export type ServiceTime = { name: string; day: string; time: string }

type ServiceTimeCardsProps = {
  times: ServiceTime[]
}

export default function ServiceTimeCards({ times }: ServiceTimeCardsProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="grid sm:grid-cols-3 gap-6 text-center">
      {times.map((s, i) => (
        <motion.div
          key={`${s.name}-${s.day}-${i}`}
          className="group relative bg-blue-50/90 rounded-[var(--radius-lg)] p-6 border border-blue-100/90 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] hover:border-blue-200/90 card-sheen"
          initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 22, scale: 0.97 }}
          whileInView={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 20,
            delay: reduceMotion ? 0 : i * 0.07,
          }}
          whileHover={reduceMotion ? undefined : { y: -4, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
        >
          <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-amber-600 font-semibold text-sm mb-1 tracking-wide">{s.day}</p>
          <p className="text-2xl font-extrabold text-blue-900 tabular-nums">{s.time}</p>
          <p className="text-gray-500 text-sm mt-1">{s.name}</p>
        </motion.div>
      ))}
    </div>
  )
}
