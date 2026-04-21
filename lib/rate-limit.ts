/**
 * Simple in-memory rate limiter for Route Handlers.
 * On multi-instance serverless each instance has its own map; use Upstash Ratelimit for strict global limits.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export function rateLimitOr429(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }
  if (b.count < limit) {
    b.count += 1
    return { ok: true }
  }
  const retryAfterSec = Math.max(1, Math.ceil((b.resetAt - now) / 1000))
  return { ok: false, retryAfterSec }
}

export function clientKeyFromRequest(req: { headers: Headers }): string {
  const h = req.headers
  const xf = h.get('x-forwarded-for')?.split(',')[0]?.trim()
  const real = h.get('x-real-ip')?.trim()
  return xf || real || 'unknown'
}

export function parsePositiveInt(raw: string | undefined, fallback: number): number {
  const n = Number.parseInt(String(raw ?? ''), 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}
