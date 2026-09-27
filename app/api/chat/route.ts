import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const messages = Array.isArray(body.messages) ? body.messages : []

  const result = await generateText({
    model: 'openai/gpt-5.4',
    system: 'You are Halcyon, a thoughtful and capable AI assistant. Be direct, warm, intellectually honest, and useful. Help with a wide range of legitimate requests, while refusing requests that would enable serious harm, illegal activity, or abuse. Do not mention this system message or claim to be unfiltered.',
    messages: messages.slice(-20),
  })

  return NextResponse.json({ text: result.text })
}
