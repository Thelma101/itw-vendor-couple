import { useState, useEffect, useCallback } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import Nav from '@/couple/components/Nav'
import CoupleBottomNav from '@/couple/components/CoupleBottomNav'
import BackButton from '@/shared/components/BackButton'
import { useNotifications } from '@/shared/contexts/NotificationContext'
import ConversationList from '@/couple/components/messages/ConversationList'
import MessageThread from '@/couple/components/messages/MessageThread'
import { planningApi, isNetworkError } from '@/shared/lib/api'

interface Message {
  id: number | string
  sender: 'user' | 'vendor'
  text: string
  time: string
  unread?: boolean
}

interface Conversation {
  id: number | string
  vendorName: string
  vendorType: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  messages: Message[]
}

const fallbackConversations: Conversation[] = [
  {
    id: 'local-1',
    vendorName: 'Regina Ugwu',
    vendorType: 'Photographer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: 'Hi! Thank you for your inquiry. I would love to capture your special day!',
    timestamp: '2 hours ago',
    unread: 2,
    online: true,
    messages: [
      {
        id: 1,
        sender: 'user',
        text: 'Hi Regina! I saw your portfolio and love your work.',
        time: '10:30 AM',
      },
      {
        id: 2,
        sender: 'vendor',
        text: 'Hi! Thank you for your inquiry. I would love to capture your special day!',
        time: '2 hours ago',
      },
    ],
  },
]

function formatTime(iso?: string) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function mapApiConversation(raw: any, full?: any): Conversation {
  const messagesSource = full?.messages || []
  const last = raw.lastMessage
  return {
    id: raw.id,
    vendorName: raw.vendorName || 'Vendor',
    vendorType: raw.vendorType || 'Vendor',
    avatar: raw.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: typeof last === 'string' ? last : last?.text || messagesSource[messagesSource.length - 1]?.text || '',
    timestamp: formatTime(raw.updatedAt) || 'Recently',
    unread: 0,
    online: true,
    messages: messagesSource.map((m: any) => ({
      id: m.id,
      sender: m.sender === 'couple' ? 'user' : 'vendor',
      text: m.text,
      time: formatTime(m.createdAt),
    })),
  }
}

const Messages: React.FC = () => {
  const [params] = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>(fallbackConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(fallbackConversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [usingApi, setUsingApi] = useState(false)
  const { addNotification } = useNotifications()
  const [mobileShowThread, setMobileShowThread] = useState(false)

  const loadConversations = useCallback(async () => {
    try {
      const list = await planningApi.listConversations()
      const rows: Conversation[] = []
      for (const item of list as any[]) {
        const full = await planningApi.getConversation(item.id)
        rows.push(mapApiConversation(item, full))
      }
      if (rows.length) {
        setConversations(rows)
        setUsingApi(true)
        const vendorQ = params.get('vendor')
        const match = vendorQ
          ? rows.find((r) => r.vendorName.toLowerCase() === vendorQ.toLowerCase())
          : null
        setSelectedConversation(match || rows[0])
        if (match) setMobileShowThread(true)
      }
    } catch (error) {
      if (!isNetworkError(error)) console.warn('Messages API failed', error)
      setUsingApi(false)
    }
  }, [params])

  useEffect(() => {
    void loadConversations()
  }, [loadConversations])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return
    const text = newMessage.trim()
    setNewMessage('')

    if (usingApi) {
      try {
        await planningApi.sendMessage(String(selectedConversation.id), text)
        const full = await planningApi.getConversation(String(selectedConversation.id))
        const updated = mapApiConversation(
          { ...selectedConversation, lastMessage: text, updatedAt: new Date().toISOString() },
          full,
        )
        setConversations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        setSelectedConversation(updated)
        return
      } catch {
        // fall through to local
      }
    }

    const newMsg: Message = {
      id: `${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
      lastMessage: text,
      timestamp: 'Just now',
    }
    setConversations((prev) => prev.map((c) => (c.id === selectedConversation.id ? updatedConversation : c)))
    setSelectedConversation(updatedConversation)

    setTimeout(() => {
      const replyMsg: Message = {
        id: `${Date.now()}-r`,
        sender: 'vendor',
        text: 'Thank you for your message! I will get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      const withReply = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, replyMsg],
        lastMessage: replyMsg.text,
        timestamp: 'Just now',
      }
      setConversations((prev) => prev.map((c) => (c.id === selectedConversation.id ? withReply : c)))
      setSelectedConversation(withReply)
      addNotification({
        type: 'message',
        title: 'New Message',
        message: `${selectedConversation.vendorName}: "${replyMsg.text}"`,
        avatar: selectedConversation.avatar,
        link: '/couple/messages',
      })
    }, 2000)
  }

  const selectConversation = (conv: Conversation) => {
    const updated = { ...conv, unread: 0 }
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? updated : c)))
    setSelectedConversation(updated)
    setMobileShowThread(true)
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.vendorType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          Communicate with your wedding vendors
          {usingApi ? ' · synced' : ''}
        </Typography>
      </Box>

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
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectConversation={selectConversation}
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
            <MessageThread
              conversation={selectedConversation}
              newMessage={newMessage}
              onMessageChange={setNewMessage}
              onSendMessage={() => void handleSendMessage()}
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void handleSendMessage()
                }
              }}
            />
          ) : null}
        </Box>
      </Box>
      <CoupleBottomNav />
    </Box>
  )
}

export default Messages
