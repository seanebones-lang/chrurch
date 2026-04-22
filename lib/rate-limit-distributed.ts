import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { clientKeyFromRequest, parsePositiveInt, rateLimitOr429 } from '@/lib/rate-limit'

export type RateNamespace = 'chat' | 'tts' | 'pdfGet' | 'pdfPost' | 'webhook'

const WINDOW_MS = 60_000

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  if (!url || !token) return null
  try {
    return new Redis({ url, token })
  } catch {
    return null
  }
}

const limiters = new Map<string, Ratelimit>()

function getLimiter(namespace: RateNamespace, max: number, windowSec: number): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null
  const key = `${namespace}:${max}:${windowSec}`
  let lim = limiters.get(key)
  if (!lim) {
    lim = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
      prefix: `harvest:${namespace}`,
    })
    limiters.set(key, lim)
  }
  return lim
}

/**
 * Distributed rate limit when Upstash Redis is configured; otherwise in-memory fallback.
 */
export async function rateLimitOr429Async(
  namespace: RateNamespace,
  req: { headers: Headers },
  limit: number,
  windowMs: number = WINDOW_MS,
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const id = clientKeyFromRequest(req)
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000))
  const lim = getLimiter(namespace, limit, windowSec)
  if (lim) {
    try {
      const { success, reset } = await lim.limit(id)
      if (!success) {
        const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
        return { ok: false, retryAfterSec }
      }
      return { ok: true }
    } catch (e) {
      console.error('[ratelimit]', namespace, e)
    }
  }
  return rateLimitOr429(`${namespace}:${id}`, limit, windowMs)
}

export function chatLimit() {
  return parsePositiveInt(process.env.CHAT_RATE_LIMIT_PER_MINUTE, 45)
}
export function ttsLimit() {
  return parsePositiveInt(process.env.CHAT_TTS_RATE_LIMIT_PER_MINUTE, 30)
}
export function pdfLimit() {
  return parsePositiveInt(process.env.CHAT_PDF_RATE_LIMIT_PER_MINUTE, 25)
}

export function webhookLimit() {
  return parsePositiveInt(process.env.SANITY_WEBHOOK_RATE_LIMIT_PER_MINUTE, 120)
}
