import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { type, prompt } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        reply: 'GEMINI_API_KEY is missing in .env.local. Add it and restart the server!'
      })
    }

    const systemInstruction =
      type === 'diet'
        ? 'You are an expert Indian clinical nutritionist for Nirogitanman. Give practical, structured Indian meal plans with clear bullet points.'
        : 'You are the Nirogitanman AI Health Bot. Give concise, helpful wellness and lifestyle guidance in plain English. Always remind users to consult a doctor for medical diagnoses.'

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemInstruction}\n\nUser request: ${prompt}` }]
            }
          ]
        })
      }
    )

    const data = await response.json()
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response right now.'

    return NextResponse.json({ reply })
  } catch (err: any) {
    return NextResponse.json({ reply: 'AI error: ' + err.message }, { status: 500 })
  }
}