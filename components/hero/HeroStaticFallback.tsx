'use client'

/**
 * GPU-free hero backdrop: gradient mesh + subtle grain (no WebGL).
 */
export default function HeroStaticFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 80% at 20% 20%, rgb(37 99 235 / 0.45), transparent 55%),
            radial-gradient(ellipse 100% 70% at 85% 15%, rgb(251 191 36 / 0.2), transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgb(30 58 138 / 0.5), transparent 45%)
          `,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '220px 220px',
        }}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #c9a227 0%, transparent 60%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%)',
        }}
      />
    </div>
  )
}
