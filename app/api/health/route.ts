import { NextResponse } from 'next/server'
import { client, projectId } from '@/lib/sanity.client'

const PLACEHOLDER = '00000000'

export async function GET() {
  const checks: Record<string, boolean | string> = {
    ok: true,
    sanityProjectConfigured: projectId !== PLACEHOLDER,
  }

  if (checks.sanityProjectConfigured) {
    try {
      await Promise.race([
        client.fetch(`count(*[_type == "settings"])`),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
      ])
      checks.sanityReachable = true
    } catch {
      checks.sanityReachable = false
      checks.ok = false
    }
  } else {
    checks.sanityReachable = false
  }

  const status = checks.ok ? 200 : 503
  return NextResponse.json(
    {
      status: checks.ok ? 'healthy' : 'degraded',
      checks,
      ts: new Date().toISOString(),
    },
    { status },
  )
}
