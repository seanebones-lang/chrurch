'use client'

import dynamic from 'next/dynamic'
import { useReducedMotion } from 'motion/react'
import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import HeroStaticFallback from './HeroStaticFallback'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), {
  ssr: false,
  loading: () => <HeroStaticFallback />,
})

type HeroBackdropProps = {
  /** Optional override for the non-WebGL layers. */
  fallback?: ReactNode
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export default function HeroBackdrop({ fallback }: HeroBackdropProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    if (reduceMotion) return
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true)
      },
      { rootMargin: '120px', threshold: 0.01 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduceMotion])

  const staticLayer = fallback ?? <HeroStaticFallback />
  const showWebGL = inView && !reduceMotion && !webglFailed

  return (
    <div ref={rootRef} className="absolute inset-0" aria-hidden>
      {showWebGL ? (
        <WebGLErrorBoundary onError={() => setWebglFailed(true)} fallback={staticLayer}>
          <HeroCanvas />
        </WebGLErrorBoundary>
      ) : (
        staticLayer
      )}
    </div>
  )
}
