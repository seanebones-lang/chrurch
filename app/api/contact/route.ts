import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const formId = process.env.FORMSPREE_FORM_ID?.trim()
    if (!formId) {
      return NextResponse.json(
        {
          success: false,
          error:
            'The contact form is not fully configured on the server yet. Please call the church or try again later.',
          code: 'CONTACT_NOT_CONFIGURED',
        },
        { status: 503 },
      )
    }

    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, email, phone, message }),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      console.error('[contact] Formspree error', res.status, t.slice(0, 400))
      return NextResponse.json(
        { success: false, error: 'Could not deliver your message. Please try again or call us.' },
        { status: 502 },
      )
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}
