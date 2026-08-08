import { useState, useRef, useEffect } from 'react'
import {
  HiOutlineSparkles,
  HiOutlinePaperAirplane,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2'
import { HiOutlineUser } from 'react-icons/hi'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import Markdown from '../components/ui/Markdown'
import { sendChatMessage } from '../services/api'

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hi! I am your AI career assistant. I am ready to help you prepare for your interview. Ask me anything about interview questions, career planning, resumes, or cover letters.',
}

function AIAssistant() {
  const [messages, setMessages] = useState([welcomeMessage])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || isSending) return

    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: text }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setIsSending(true)
    setError(null)

    try {
      const data = await sendChatMessage(
        nextMessages.map(({ role, content }) => ({ role, content })),
      )
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', content: data.data.reply },
      ])
    } catch (err) {
      console.error('[AIAssistant] chat failed', err)
      setError(err.message || 'Failed to get a response. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)] flex-col">
        <div className="border-b border-outline-variant/30 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <HiOutlineSparkles className="text-xl text-primary" aria-hidden />
            </div>
            <div>
              <h1 className="text-headline-md text-on-surface">AI Assistant</h1>
              <p className="text-label-sm text-on-surface-variant">
                Your personal career copilot
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <HiOutlineSparkles className="text-base text-primary" aria-hidden />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-body-sm ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-primary text-white'
                      : 'rounded-bl-md border border-outline-variant/30 bg-surface-container-lowest text-on-surface'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Markdown>{message.content}</Markdown>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-low">
                    <HiOutlineUser className="text-base text-on-surface-variant" aria-hidden />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <HiOutlineSparkles className="text-base text-primary" aria-hidden />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-outline-variant/30 bg-surface-container-lowest px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <HiOutlineExclamationTriangle className="mt-0.5 text-lg text-red-500 shrink-0" aria-hidden />
                <p className="text-body-sm text-red-700">{error}</p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-outline-variant/30 bg-surface-container-lowest/80 px-4 py-4 backdrop-blur-xl md:px-6">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-2 shadow-card focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  event.target.form?.requestSubmit()
                }
              }}
              rows={1}
              placeholder="Ask your career assistant anything..."
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <HiOutlinePaperAirplane className="text-lg" aria-hidden />
            </button>
          </form>
          <p className="mx-auto mt-2 max-w-3xl text-center text-label-sm text-on-surface-variant">
            AI Assistant can make mistakes. Review important responses.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AIAssistant
