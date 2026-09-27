'use client'

import { FormEvent, useState } from 'react'
import { ArrowUp, Menu, Plus, Sparkles } from 'lucide-react'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dQbVUVY2q7g6OpywAYgZrPnLlUEp4v.png'

type Message = { role: 'user' | 'assistant'; content: string }

const starterPrompts = [
  'What can you help me figure out today?',
  'Explain something complex in a simple way',
  'Help me make a plan',
]

export function HalcyonChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault()
    const content = input.trim()
    if (!content || isLoading) return

    const nextMessages = [...messages, { role: 'user' as const, content }]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      if (!response.ok) throw new Error('Unable to reach Halcyon')
      const data = await response.json()
      setMessages([...nextMessages, { role: 'assistant', content: data.text }])
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: 'I could not connect right now. Check your model connection and try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  function resetChat() {
    setMessages([])
    setInput('')
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <header className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-5 lg:px-0">
        <div className="flex items-center gap-3">
          <button className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm lg:hidden" aria-label="Open menu">
            <Menu data-icon="inline-start" />
          </button>
          <img src={logoUrl} alt="Halcyon eye logo" className="size-10 rounded-xl object-cover shadow-[0_0_22px_rgba(112,205,225,0.28)]" />
          <div>
            <p className="font-semibold tracking-tight">Halcyon</p>
            <p className="text-xs text-slate-500">Your clear-thinking AI</p>
          </div>
        </div>
        <button onClick={resetChat} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950">
          <Plus data-icon="inline-start" /> New chat
        </button>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[760px] flex-col px-5 pb-7">
        <div className="flex flex-1 flex-col justify-center py-12">
          {messages.length === 0 ? (
            <div className="text-center">
              <div className="mx-auto mb-7 flex size-20 items-center justify-center rounded-[26px] bg-white shadow-[0_12px_38px_rgba(40,77,110,0.11)] ring-1 ring-slate-100">
                <img src={logoUrl} alt="" className="size-16 rounded-[20px] object-cover" />
              </div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-cyan-700">Good to see you</p>
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">What&apos;s on your mind?</h1>
              <p className="mx-auto mt-5 max-w-md text-pretty leading-7 text-slate-500">Ask Halcyon anything. Get thoughtful answers, useful ideas, and a clear next step.</p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {starterPrompts.map((prompt) => (
                  <button key={prompt} onClick={() => setInput(prompt)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-slate-950">{prompt}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-7 py-8">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'flex justify-end' : 'flex gap-3'}>
                  {message.role === 'assistant' && <img src={logoUrl} alt="Halcyon" className="size-8 shrink-0 rounded-xl object-cover" />}
                  <div className={message.role === 'user' ? 'max-w-[82%] rounded-3xl rounded-br-lg bg-slate-950 px-5 py-3.5 text-[15px] leading-7 text-white' : 'max-w-[88%] pt-1 text-[15px] leading-7 text-slate-700'}>{message.content}</div>
                </div>
              ))}
              {isLoading && <div className="flex items-center gap-3 text-sm text-slate-400"><img src={logoUrl} alt="" className="size-8 rounded-xl object-cover" /><span className="animate-pulse">Halcyon is thinking…</span></div>}
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_15px_45px_rgba(40,77,110,0.1)]">
          <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); void sendMessage() } }} placeholder="Message Halcyon…" aria-label="Message Halcyon" rows={1} className="max-h-32 min-h-12 w-full resize-none bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-slate-400" />
          <div className="flex items-center justify-between px-2 pb-1">
            <div className="flex items-center gap-1 text-xs text-slate-400"><Sparkles className="size-3.5" /> Thoughtful by default</div>
            <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message" className="flex size-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-30"><ArrowUp data-icon="inline-start" /></button>
          </div>
        </form>
        <p className="mt-3 text-center text-xs text-slate-400">Halcyon can make mistakes. Check important information.</p>
      </section>
    </main>
  )
}

