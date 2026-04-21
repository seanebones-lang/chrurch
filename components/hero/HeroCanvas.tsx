'use client'

import { Canvas } from '@react-three/fiber'
import { HeroShaderPlane } from './HeroShaderPlane'

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 36, near: 0.1, far: 12 }}
      gl={{
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      }}
      dpr={[1, 1.25]}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    >
      <HeroShaderPlane />
    </Canvas>
  )
}
