import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Alert, Box, Button, CircularProgress, Paper, Snackbar, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Nav from '@/couple/components/Nav'
import CoupleBottomNav from '@/couple/components/CoupleBottomNav'
import BackButton from '@/shared/components/BackButton'
import ConversationList from '@/couple/components/messages/ConversationList'
import MessageThread from '@/couple/components/messages/MessageThread'
import { apiErrorMessage, threadsApi, type Thread, type ThreadSummary } from '@/shared/lib/api'

const THREAD_POLL_MS = 15_000
const LIST_POLL_MS = 30_000

type ViewMessage = { id: string; sender: 'user' | 'vendor'; text: string; time: string }
type ViewConversation = {
  id: string
  vendorId: string
  vendorName: string
  vendorType: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  messages: ViewMessage[]
}

function formatStamp(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === now.toDateString()) return time
  return `${d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}, ${time}`
}

function toView(summary: ThreadSummary | Thread, thread?: Thread | null): ViewConversation {
  return {
    id: summary.id,
    vendorId: summary.vendorId,
    vendorName: summary.vendorName || 'Vendor',
    vendorType: summary.vendorCategory || '',
    avatar: summary.vendorImage || '',
    lastMessage: summary.lastMessage || '',
    timestamp: formatStamp(summary.updatedAt),
    unread: 'unread' in summary ? summary.unread : 0,
    online: false,
    messages: (thread?.messages || []).map((m) => ({
      id: m.id,
      sender: m.sender === 'couple' ? 'user' : 'vendor',
      text: m.text,
      time: formatStamp(m.createdAt),
    })),
  }
}

function sameMessages(a: Thread | null, b: Thread) {
  if (!a || a.id !== b.id || a.messages.length !== b.messages.length) return false
  return a.messages[a.messages.length - 1]?.id === b.messages[b.messages.length - 1]?.id
}

export default function LiveMessages() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const threadParam = params.get('thread') || ''
  const vendorParam = params.get('vendor') || ''

  const [threads, setThreads] = useState<ThreadSummary[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [selectedId, setSelectedId] = useState(threadParam)
  const [thread, setThread] = useState<Thread | null>(null)
  const [threadLoading, setThreadLoading] = useState(false)
  const [opening, setOpening] = useState(Boolean(vendorParam))
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileShowThread, setMobileShowThread] = useState(Boolean(threadParam || vendorParam))
  const [toast, setToast] = useState('')
  const selectedRef = useRef(selectedId)
  selectedRef.current = selectedId
  const openingRef = useRef(opening)
  openingRef.current = opening

  const loadList = useCallback(async (quiet = false) => {
    if (!quiet) setListLoading(true)
    try {
      const list = await threadsApi.list()
      setThreads(list)
      setListError('')
      if (!openingRef.current) setSelectedId((current) => current || list[0]?.id || '')
    } catch (err) {
      if (!quiet) setListError(apiErrorMessage(err, 'We could not load your conversations. Please try again.'))
    } finally {
      if (!quiet) setListLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadList()
    const t = window.setInterval(() => void loadList(true), LIST_POLL_MS)
    return () => window.clearInterval(t)
  }, [loadList])

  // ?thread=<id> from notifications / other pages
  useEffect(() => {
    if (threadParam) {
      setSelectedId(threadParam)
      setMobileShowThread(true)
    }
  }, [threadParam])

  // ?vendor=<vendorId> opens (or reuses) the conversation with that vendor
  useEffect(() => {
    if (!vendorParam) return
    let cancelled = false
    setOpening(true)
    threadsApi
      .start({ vendorId: vendorParam })
      .then((t) => {
        if (cancelled) return
        setThread(t)
        setSelectedId(t.id)
        setMobileShowThread(true)
        setThreads((prev) => (prev.some((p) => p.id === t.id) ? prev : [{ ...t, unread: 0, messageCount: t.messages.length }, ...prev]))
        setOpening(false)
        setParams({ thread: t.id }, { replace: true })
      })
      .catch((err) => {
        if (cancelled) return
        setOpening(false)
        setToast(apiErrorMessage(err, 'Could not open a conversation with this vendor.'))
      })
    return () => {
      cancelled = true
    }
  }, [vendorParam, setParams])

  const loadThread = useCallback(async (id: string, quiet = false) => {
    if (!quiet) setThreadLoading(true)
    try {
      const t = await threadsApi.get(id)
      if (selectedRef.current !== id) return
      setThread((prev) => (sameMessages(prev, t) ? prev : t))
      setThreads((prev) => prev.map((p) => (p.id === id ? { ...p, unread: 0, lastMessage: t.lastMessage, updatedAt: t.updatedAt } : p)))
    } catch (err) {
      if (!quiet && selectedRef.current === id) setToast(apiErrorMessage(err, 'Could not load this conversation.'))
    } finally {
      if (!quiet && selectedRef.current === id) setThreadLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!selectedId) return
    setThread((prev) => (prev?.id === selectedId ? prev : null))
    void loadThread(selectedId)
    const t = window.setInterval(() => void loadThread(selectedId, true), THREAD_POLL_MS)
    return () => window.clearInterval(t)
  }, [selectedId, loadThread])

  const handleSend = async () => {
    const text = newMessage.trim()
    if (!text || !selectedId || sending) return
    setSending(true)
    setNewMessage('')
    try {
      const updated = await threadsApi.send(selectedId, text)
      if (selectedRef.current === selectedId) setThread(updated)
      setThreads((prev) => {
        const rest = prev.filter((p) => p.id !== updated.id)
        const existing = prev.find((p) => p.id === updated.id)
        const summary: ThreadSummary = existing
          ? { ...existing, lastMessage: updated.lastMessage || text, updatedAt: updated.updatedAt, unread: 0 }
          : { ...updated, unread: 0, messageCount: updated.messages.length }
        return [summary, ...rest]
      })
    } catch (err) {
      setNewMessage(text)
      setToast(apiErrorMessage(err, 'Your message was not sent. Please try again.'))
    } finally {
      setSending(false)
    }
  }

  const conversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return threads
      .filter((t) => !q || t.vendorName.toLowerCase().includes(q) || (t.vendorCategory || '').toLowerCase().includes(q))
      .map((t) => toView(t))
  }, [threads, searchQuery])

  const selectedSummary = threads.find((t) => t.id === selectedId) || (thread?.id === selectedId ? thread : null)
  const selectedConversation = selectedSummary ? toView(selectedSummary, thread?.id === selectedId ? thread : null) : null
  const showEmpty = !listLoading && !opening && !listError && threads.length === 0 && !selectedConversation

  return (
    <Box
      sx={{
        backgroundColor: '#F4F7F8',
        minHeight: '100vh',
        height: { md: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pb: { xs: 10, md: 0 },
      }}
    >
      <Nav />

      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 1.5, md: 2 }, flexShrink: 0 }}>
        <BackButton fallbackPath="/couple/dashboard" sx={{ mb: 1.5 }} />
        <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: { xs: 22, md: 28 }, color: '#0B2D31' }}>
          Messages
        </Typography>
        <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: '#666', mt: 0.5 }}>
          Chat with the vendors you've contacted
        </Typography>
      </Box>

      {listError && threads.length === 0 ? (
        <Box sx={{ px: { xs: 2, md: 4 } }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => void loadList()}>
                Retry
              </Button>
            }
          >
            {listError}
          </Alert>
        </Box>
      ) : null}

      {(listLoading || opening) && threads.length === 0 && !selectedConversation ? (
        <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0F766E' }} />
        </Box>
      ) : showEmpty ? (
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px dashed #CBD5E1', borderRadius: 3, textAlign: 'center', maxWidth: 560, mx: 'auto' }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 44, color: '#94A3B8', mb: 1 }} />
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#0F172A' }}>No conversations yet</Typography>
            <Typography sx={{ color: '#64748B', fontSize: 14, mt: 0.75, mb: 2.5 }}>
              When you message a vendor or send them an inquiry, your conversation will appear here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/couple/search-results')}
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, bgcolor: '#0F766E', '&:hover': { bgcolor: '#0D9488' } }}
            >
              Browse vendors
            </Button>
          </Paper>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            px: { xs: 2, md: 4 },
            pb: 2,
            minHeight: 0,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: 'auto' },
              display: { xs: mobileShowThread ? 'none' : 'flex', md: 'flex' },
              minWidth: 0,
              minHeight: 0,
              height: { md: '100%' },
            }}
          >
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showPresence={false}
              onSelectConversation={(conv) => {
                setSelectedId(String(conv.id))
                setMobileShowThread(true)
                if (threadParam && threadParam !== conv.id) setParams({}, { replace: true })
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              display: { xs: mobileShowThread ? 'flex' : 'none', md: 'flex' },
              flexDirection: 'column',
              height: { md: '100%' },
            }}
          >
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1, flexShrink: 0 }}>
              <Button onClick={() => setMobileShowThread(false)} sx={{ textTransform: 'none', color: '#0F766E', fontWeight: 700, px: 0 }}>
                ← Conversations
              </Button>
            </Box>
            {selectedConversation ? (
              <Box sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <MessageThread
                  conversation={selectedConversation}
                  newMessage={newMessage}
                  onMessageChange={setNewMessage}
                  onSendMessage={() => void handleSend()}
                  allowAttachments={false}
                  sending={sending}
                  headerAction={
                    selectedConversation.vendorId ? (
                      <Button
                        size="small"
                        onClick={() => navigate(`/couple/vendor/${selectedConversation.vendorId}`)}
                        sx={{ textTransform: 'none', fontWeight: 700, color: '#0F766E' }}
                      >
                        View profile
                      </Button>
                    ) : null
                  }
                  onKeyPress={(e: KeyboardEvent) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void handleSend()
                    }
                  }}
                />
                {threadLoading && !thread ? (
                  <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
                    <CircularProgress size={28} sx={{ color: '#0F766E' }} />
                  </Box>
                ) : null}
              </Box>
            ) : (
              <Paper elevation={0} sx={{ flex: 1, display: 'grid', placeItems: 'center', border: '1px solid #E2E8F0', p: 4 }}>
                <Typography sx={{ color: '#64748B' }}>Select a conversation to start chatting.</Typography>
              </Paper>
            )}
          </Box>
        </Box>
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setToast('')}>
          {toast}
        </Alert>
      </Snackbar>
      <CoupleBottomNav />
    </Box>
  )
}
