'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.12;
  float n = noise(uv * 5.0 + t) * 0.07 + noise(uv * 14.0 - t * 0.8) * 0.035;

  vec3 deep = vec3(0.02, 0.05, 0.16);
  vec3 mid = vec3(0.05, 0.14, 0.38);
  vec3 rim = vec3(0.09, 0.28, 0.55);
  vec3 gold = vec3(0.78, 0.62, 0.18);

  float vignette = smoothstep(1.15, 0.35, length(uv - 0.5) * 1.7);
  float wave = sin(uv.x * 6.28318 + t * 1.6) * 0.5 + 0.5;

  vec3 col = mix(deep, mid, uv.y * 0.95 + n);
  col = mix(col, rim, (1.0 - uv.y) * 0.35 * vignette);
  col = mix(col, gold, wave * 0.11 * (1.0 - uv.y) * vignette);
  col += n * 0.55;

  gl_FragColor = vec4(col, 1.0);
}
`

export function HeroShaderPlane() {
  const mesh = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const viewport = useThree((s) => s.viewport)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((state) => {
    const m = materialRef.current
    if (m) m.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}
