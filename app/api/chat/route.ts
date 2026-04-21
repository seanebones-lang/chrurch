import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a helpful assistant for Harvest Church. You help visitors and members with questions about:
- Service times (Sunday 9AM & 11AM, Wednesday 7PM Bible Study)
- Location (123 Main Street, Your City, ST 00000)
- Events and programs
- How to get involved
- What to expect as a first-time visitor
- Kids ministry (available during all Sunday services)
- Giving and tithing
- Sermons and messages

Be warm, welcoming, concise, and encouraging. If you don't know the answer, invite them to call (555) 000-0000 or email info@harvestchurch.org. Never discuss politics or divisive topics. Keep responses under 150 words.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.XAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { message: "Hi! I'm not fully set up yet. Please call us at (555) 000-0000 for assistance." },
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
    const message = data.choices?.[0]?.message?.content ?? "I'm not sure about that. Please call us at (555) 000-0000!"

    return NextResponse.json({ message })
  } catch {
    return NextResponse.json(
      { message: "Sorry, I'm having trouble right now. Please call (555) 000-0000 or email info@harvestchurch.org." },
      { status: 200 }
    )
  }
}
