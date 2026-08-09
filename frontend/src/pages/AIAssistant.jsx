import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  HiOutlineSparkles,
  HiOutlinePaperAirplane,
  HiOutlineExclamationTriangle,
  HiPlus,
  HiOutlineTrash,
  HiOutlineBars3,
  HiXMark,
  HiOutlineChatBubbleLeftRight,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import { HiOutlineUser } from 'react-icons/hi'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import Markdown from '../components/ui/Markdown'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import {
  sendChatMessage,
  getAiSessions,
  createAiSession,
  getAiSession,
  updateAiSession,
  deleteAiSession,
} from '../services/api'

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hi! I am your AI career assistant. I am ready to help you prepare for your interview. Ask me anything about interview questions, career planning, resumes, or cover letters.',
}

// The welcome bubble is UI-only and never persisted into a session or sent
// to the model, so conversations stored on the server contain real turns only.
function toPersistedMessages(messages) {
  return messages.map(({ role, content }) => ({ role, content }))
}

function ChatMessage({ message }) {
  return (
    <div
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
  )
}

function SessionsPanel({ sessions, activeId, isLoading, onSelect, onNewChat, onDelete, onClose, isMobile }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-outline-variant/30 px-4 py-4">
        <h2 className="text-label-sm font-medium text-on-surface">Chat Sessions</h2>
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-on-surface-variant transition hover:text-on-surface"
            aria-label="Close session list"
          >
            <HiXMark className="text-xl" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && sessions.length === 0 ? (
          <div className="flex items-center gap-2 px-3 py-3 text-label-sm text-on-surface-variant">
            <HiOutlineArrowPath className="animate-spin text-sm" aria-hidden />
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <p className="px-3 py-3 text-label-sm text-on-surface-variant">
            No chat sessions yet. Start a new conversation below.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {sessions.map((session) => (
              <li key={session.id}>
                <div
                  className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition ${
                    session.id === activeId
                      ? 'bg-primary/10'
                      : 'hover:bg-surface-container-low'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(session.id)}
                    className="flex min-w-0 flex-1 items-center gap-2"
                    title={session.title}
                  >
                    <HiOutlineChatBubbleLeftRight
                      className={`shrink-0 text-base ${
                        session.id === activeId ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                      aria-hidden
                    />
                    <span
                      className={`truncate text-body-sm ${
                        session.id === activeId
                          ? 'font-medium text-primary'
                          : 'text-on-surface'
                      }`}
                    >
                      {session.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(session)}
                    className="shrink-0 rounded-md p-1 text-on-surface-variant opacity-0 transition hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100"
                    aria-label={`Delete ${session.title}`}
                  >
                    <HiOutlineTrash className="text-sm" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-outline-variant/30 p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90"
        >
          <HiPlus className="text-base" aria-hidden />
          New Chat
        </button>
      </div>
    </div>
  )
}

function AIAssistant() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [showSessions, setShowSessions] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const bottomRef = useRef(null)

  const displayedMessages = useMemo(() => [welcomeMessage, ...messages], [messages])

  const loadSessions = useCallback(async () => {
    try {
      const data = await getAiSessions()
      setSessions(data.sessions || [])
    } catch (err) {
      console.error('[AIAssistant] load sessions failed', err)
    } finally {
      setIsLoadingSessions(false)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayedMessages, isSending])

  const refreshSessionList = useCallback(async () => {
    try {
      const data = await getAiSessions()
      setSessions(data.sessions || [])
    } catch (err) {
      console.error('[AIAssistant] refresh sessions failed', err)
    }
  }, [])

  // Persist a finished exchange (user + assistant messages). Creates the
  // session on the first message, then updates it for every later turn.
  const persistExchange = useCallback(
    async (finalMessages, firstUserText) => {
      const persisted = toPersistedMessages(finalMessages)

      if (activeSessionId) {
        await updateAiSession(activeSessionId, { messages: persisted })
      } else {
        const title = firstUserText.length > 48 ? `${firstUserText.slice(0, 48)}…` : firstUserText
        const created = await createAiSession({ title, messages: persisted })
        setActiveSessionId(created.session.id)
      }

      await refreshSessionList()
    },
    [activeSessionId, refreshSessionList],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || isSending) return

    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: text }
    const pendingMessages = [...messages, userMessage]

    setMessages(pendingMessages)
    setInput('')
    setIsSending(true)
    setError(null)

    try {
      const data = await sendChatMessage(toPersistedMessages(pendingMessages))
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.data.reply,
      }
      const finalMessages = [...pendingMessages, assistantMessage]
      setMessages(finalMessages)

      try {
        await persistExchange(finalMessages, text)
      } catch (persistErr) {
        console.error('[AIAssistant] persist exchange failed', persistErr)
        setError('Your message was answered, but saving the chat history failed.')
      }
    } catch (err) {
      console.error('[AIAssistant] chat failed', err)
      setError(err.message || 'Failed to get a response. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setActiveSessionId(null)
    setError(null)
    setShowSessions(false)
  }

  const handleSelectSession = async (id) => {
    setShowSessions(false)
    setIsLoadingSession(true)
    setError(null)
    try {
      const data = await getAiSession(id)
      setMessages(
        data.session.messages.map((message, index) => ({
          id: `${message.role}-${index}-${id}`,
          role: message.role,
          content: message.content,
        })),
      )
      setActiveSessionId(id)
    } catch (err) {
      console.error('[AIAssistant] load session failed', err)
      setError(err.message || 'Failed to load this chat session.')
    } finally {
      setIsLoadingSession(false)
    }
  }

  const handleDeleteSession = async () => {
    if (!pendingDelete) return
    try {
      await deleteAiSession(pendingDelete.id)
      setSessions((prev) => prev.filter((session) => session.id !== pendingDelete.id))
      if (activeSessionId === pendingDelete.id) {
        handleNewChat()
      }
    } catch (err) {
      console.error('[AIAssistant] delete session failed', err)
      setError(err.message || 'Failed to delete this session.')
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Main chat column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-outline-variant/30 px-4 py-4 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSessions(true)}
                className="rounded-md p-1 text-on-surface-variant transition hover:text-on-surface lg:hidden"
                aria-label="Show chat sessions"
              >
                <HiOutlineBars3 className="text-xl" aria-hidden />
              </button>
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

            <button
              type="button"
              onClick={handleNewChat}
              className="hidden items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-label-sm font-medium text-on-surface transition hover:bg-surface-container-low sm:inline-flex"
            >
              <HiPlus className="text-base" aria-hidden />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {isLoadingSession && (
                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-label-sm text-primary">
                  <HiOutlineArrowPath className="animate-spin text-sm" aria-hidden />
                  Loading chat session...
                </div>
              )}

              {displayedMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
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

        {/* Sessions panel — desktop */}
        <aside className="hidden w-72 shrink-0 border-l border-outline-variant/30 bg-surface-container-lowest lg:block">
          <SessionsPanel
            sessions={sessions}
            activeId={activeSessionId}
            isLoading={isLoadingSessions}
            onSelect={handleSelectSession}
            onNewChat={handleNewChat}
            onDelete={setPendingDelete}
          />
        </aside>

        {/* Sessions panel — mobile drawer */}
        {showSessions && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowSessions(false)}
              aria-hidden="true"
            />
            <aside className="absolute inset-y-0 right-0 w-72 bg-surface-container-lowest shadow-xl">
              <SessionsPanel
                sessions={sessions}
                activeId={activeSessionId}
                isLoading={isLoadingSessions}
                onSelect={handleSelectSession}
                onNewChat={handleNewChat}
                onDelete={setPendingDelete}
                isMobile
                onClose={() => setShowSessions(false)}
              />
            </aside>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDeleteSession}
        title="Delete Chat Session"
        message="Are you sure you want to delete this chat session? This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </DashboardLayout>
  )
}

export default AIAssistant
