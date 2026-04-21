import { NextRequest, NextResponse } from 'next/server'
import {
  CHURCH_ADDRESS_SINGLE_LINE,
  CHURCH_NAME,
  CHURCH_PHONE_DISPLAY,
  CHURCH_SERVICE_TIMES_SUMMARY,
} from '@/lib/church-info'

const SYSTEM_PROMPT = `You are a helpful assistant for ${CHURCH_NAME}. You help visitors and members with questions about:
- Service times (${CHURCH_SERVICE_TIMES_SUMMARY})
- Location (${CHURCH_ADDRESS_SINGLE_LINE})
- Events and programs
- How to get involved
- What to expect as a first-time visitor
- Kids ministry (when offered)
- Giving and tithing
- Sermons and messages
- Ministries (Kids, Students, Fellowship Groups, serving, outreach — see /ministries)

Be warm, welcoming, concise, and encouraging. If you don't know the answer, invite them to call ${CHURCH_PHONE_DISPLAY} or use the contact form on the About page of this website. Never discuss politics or divisive topics. Keep responses under 150 words.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.XAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { message: `Hi! I'm not fully set up yet. Please call us at ${CHURCH_PHONE_DISPLAY} for assistance.` },
        { status: 200 }
      )
    }

    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-3-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
        max_tokens: 200,
      }),
    })

    if (!res.ok) throw new Error('xAI API error')

    const data = await res.json()
    const message =
      data.choices?.[0]?.message?.content ??
      `I'm not sure about that. Please call us at ${CHURCH_PHONE_DISPLAY}!`

    return NextResponse.json({ message })
  } catch {
    return NextResponse.json(
      {
        message: `Sorry, I'm having trouble right now. Please call ${CHURCH_PHONE_DISPLAY} or use the contact form on our About page.`,
      },
      { status: 200 }
    )
  }
}
