import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowBack, ChatBubbleOutline, Search, Send } from '@mui/icons-material'
import { apiErrorMessage, threadsApi, type Thread, type ThreadSummary } from '@/shared/lib/api'
import { timeAgo } from '@/vendor/lib/live'

const LIST_POLL_MS = 30_000
const THREAD_POLL_MS = 15_000

function clockTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const sameDay = d.toDateString() === new Date().toDateString()
  return sameDay
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function LiveMessages() {
  const [params, setParams] = useSearchParams()
  const selectedId = params.get('thread') || ''
  const [threads, setThreads] = useState<ThreadSummary[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [thread, setThread] = useState<Thread | null>(null)
  const [threadLoading, setThreadLoading] = useState(false)
  const [threadError, setThreadError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const loadList = useCallback(async () => {
    try {
      setThreads(await threadsApi.list())
      setListError(null)
    } catch (err) {
      setListError(apiErrorMessage(err, 'Could not load your conversations.'))
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadList()
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void loadList()
    }, LIST_POLL_MS)
    return () => window.clearInterval(timer)
  }, [loadList])

  useEffect(() => {
    if (!selectedId) {
      setThread(null)
      return
    }
    let cancelled = false
    const load = async (initial: boolean) => {
      if (initial) {
        setThreadLoading(true)
        setThreadError(null)
      }
      try {
        const next = await threadsApi.get(selectedId)
        if (cancelled) return
        setThread(next)
        setThreads((prev) => prev.map((t) => (t.id === selectedId ? { ...t, unread: 0 } : t)))
      } catch (err) {
        if (!cancelled && initial) setThreadError(apiErrorMessage(err, 'Could not open this conversation.'))
      } finally {
        if (!cancelled && initial) setThreadLoading(false)
      }
    }
    void load(true)
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load(false)
    }, THREAD_POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [selectedId])

  const messageCount = thread?.messages.length ?? 0
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messageCount, selectedId])

  const select = (id: string) => {
    setDraft('')
    setParams(id ? { thread: id } : {}, { replace: !id })
  }

  const send = async () => {
    const text = draft.trim()
    if (!text || !selectedId || sending) return
    setSending(true)
    try {
      const next = await threadsApi.send(selectedId, text)
      setThread(next)
      setDraft('')
      setThreads((prev) => {
        const updated = prev.map((t) => (t.id === selectedId ? { ...t, lastMessage: text, updatedAt: new Date().toISOString(), unread: 0 } : t))
        return [...updated].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      })
    } catch (err) {
      setThreadError(apiErrorMessage(err, 'Message not sent. Check your connection and try again.'))
    } finally {
      setSending(false)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  const visible = threads.filter((t) => (t.coupleName || '').toLowerCase().includes(search.trim().toLowerCase()))
  const totalUnread = threads.reduce((sum, t) => sum + (t.unread || 0), 0)
  const summary = threads.find((t) => t.id === selectedId)
  const title = thread?.coupleName || summary?.coupleName || 'Conversation'

  return (
    <div className="px-0 md:px-4 py-0 md:py-4 pb-20 md:pb-4 min-w-0 font-[family-name:var(--font-ui)]">
      <div className="px-4 md:px-2 mb-3 pt-3 md:pt-0">
        <h1 className="font-[family-name:var(--font-display)] font-bold text-[22px] md:text-[28px] text-[#0B2D31]">Messages</h1>
        <p className="text-sm text-slate-500 mt-0.5">Conversations with couples who contacted you.</p>
      </div>

      <div className="flex flex-col md:flex-row bg-white md:rounded-2xl md:border md:border-slate-200 overflow-hidden min-h-[60vh] md:h-[calc(100vh-210px)]">
        <aside className={`${selectedId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[340px] md:border-r border-slate-100 min-w-0`}>
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-lg text-[#002528]">Inbox</p>
              {totalUnread > 0 ? (
                <span className="min-w-6 h-6 px-2 rounded-full bg-[#EB1948] text-white text-xs font-bold flex items-center justify-center">{totalUnread}</span>
              ) : null}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 18 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 text-sm outline-none focus:ring-2 focus:ring-teal-200"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {listLoading ? (
              <p className="p-6 text-center text-sm text-slate-400">Loading conversations…</p>
            ) : listError ? (
              <div className="p-6 text-center text-sm text-rose-700">
                <p>{listError}</p>
                <button type="button" onClick={() => void loadList()} className="mt-2 font-bold underline cursor-pointer">
                  Try again
                </button>
              </div>
            ) : threads.length === 0 ? (
              <div className="p-6 text-center">
                <ChatBubbleOutline sx={{ fontSize: 36, color: '#cbd5e1' }} />
                <p className="mt-2 font-semibold text-slate-700">No conversations yet</p>
                <p className="text-sm text-slate-500 mt-1">When a couple enquires or messages you, the chat appears here.</p>
                <Link to="/vendor/leads" className="mt-3 inline-block text-sm font-bold text-[#0F766E]">
                  View leads
                </Link>
              </div>
            ) : visible.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">No conversations match “{search}”.</p>
            ) : (
              visible.map((t) => {
                const active = t.id === selectedId
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => select(t.id)}
                    className={`w-full text-left flex items-start gap-3 p-4 border-l-[3px] cursor-pointer hover:bg-slate-50 ${
                      active ? 'border-[#00838F] bg-teal-50/40' : 'border-transparent'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold shrink-0">
                      {(t.coupleName || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm text-[#002528] truncate ${t.unread ? 'font-bold' : 'font-semibold'}`}>{t.coupleName || 'Couple'}</span>
                        <span className={`text-[11px] shrink-0 ${t.unread ? 'text-[#00838F]' : 'text-slate-400'}`}>{timeAgo(t.updatedAt)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[13px] text-slate-500 truncate">{t.lastMessage || 'No messages yet'}</p>
                        {t.unread ? (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#EB1948] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            {t.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <section className={`${selectedId ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0`}>
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <ChatBubbleOutline sx={{ fontSize: 44, color: '#cbd5e1' }} />
              <p className="mt-2 font-semibold text-slate-700">Select a conversation</p>
              <p className="text-sm text-slate-500 mt-1">Pick a couple on the left to read and reply.</p>
            </div>
          ) : (
            <>
              <div className="p-3 md:p-4 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <button type="button" onClick={() => select('')} className="md:hidden p-1.5 rounded-lg text-[#00838F] cursor-pointer" aria-label="Back to inbox">
                    <ArrowBack fontSize="small" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold shrink-0">
                    {title.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-semibold text-[#002528] truncate">{title}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link to="/vendor/leads" className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-bold text-[#00838F] border border-[#00838F]/40 hover:bg-teal-50">
                    Leads
                  </Link>
                  <Link to="/vendor/bookings?add=1" className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#00838F] hover:bg-[#006b75]">
                    Log booking
                  </Link>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
                {threadLoading && !thread ? (
                  <p className="text-center text-sm text-slate-400">Loading messages…</p>
                ) : thread && thread.messages.length === 0 ? (
                  <p className="text-center text-sm text-slate-400">No messages yet — say hello.</p>
                ) : (
                  thread?.messages.map((m) => {
                    const mine = m.sender === 'vendor'
                    return (
                      <div key={m.id} className={`flex mb-3 ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 ${
                            mine ? 'bg-[#00838F] text-white rounded-[16px_16px_4px_16px]' : 'bg-white text-[#002528] rounded-[16px_16px_16px_4px] shadow-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line break-words">{m.text}</p>
                          <p className={`text-[11px] mt-1 text-right ${mine ? 'text-white/70' : 'text-slate-400'}`}>{clockTime(m.createdAt)}</p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={endRef} />
              </div>

              {threadError ? <p className="px-4 py-2 text-sm text-rose-700 bg-rose-50 border-t border-rose-100">{threadError}</p> : null}

              <div className="p-3 border-t border-slate-100 bg-white flex items-end gap-2">
                <textarea
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type your message…"
                  disabled={!thread}
                  className="flex-1 resize-none max-h-32 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-200 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={!draft.trim() || sending || !thread}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-[#00838F] hover:bg-[#006b75] disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Send"
                >
                  <Send fontSize="small" />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
