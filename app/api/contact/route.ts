import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // If Formspree form ID is set, forward to it
    const formId = process.env.FORMSPREE_FORM_ID
    if (formId) {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      })
      if (!res.ok) throw new Error('Formspree error')
      return NextResponse.json({ success: true })
    }

    // Fallback: log to console (replace with your preferred email provider)
    console.log('Contact form submission:', { name, email, phone, message })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
