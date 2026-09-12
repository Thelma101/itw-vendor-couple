import { Box, Typography, TextField, IconButton, Avatar, Card, Tooltip, Snackbar, Alert } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import { useRef, useEffect, useState } from 'react'

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
  messages: Message[]
  online: boolean
  timestamp: string
}

interface MessageThreadProps {
  conversation: Conversation
  newMessage: string
  onMessageChange: (text: string) => void
  onSendMessage: () => void
  onKeyPress?: (event: any) => void
}

export default function MessageThread({
  conversation,
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyPress,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  const handleFilePick = (kind: 'file' | 'photo') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const label = kind === 'photo' ? 'Photo' : 'File'
    onMessageChange(newMessage ? `${newMessage}\n[Attached ${label.toLowerCase()}: ${file.name}]` : `[Attached ${label.toLowerCase()}: ${file.name}]`)
    setToast(`${label} ready to send · tap Send`)
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        border: { xs: '1px solid #E2E8F0', md: '1px solid #E2E8F0' },
        borderRadius: { xs: 3, md: 0 },
        overflow: 'hidden',
        minWidth: 0,
        minHeight: 0,
        height: { xs: 'min(60vh, 520px)', md: '100%' },
        maxHeight: { xs: '60vh', md: '100%' },
      }}
    >
      <input ref={fileRef} type="file" hidden accept=".pdf,.doc,.docx,.txt,image/*" onChange={handleFilePick('file')} />
      <input ref={photoRef} type="file" hidden accept="image/*" onChange={handleFilePick('photo')} />

      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          <Avatar src={conversation.avatar} sx={{ width: 40, height: 40, flexShrink: 0 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#002528', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {conversation.vendorName}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#999' }}>{conversation.vendorType}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 2, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
        {conversation.messages.map((msg) => (
          <Box
            key={String(msg.id)}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              minWidth: 0,
            }}
          >
            <Card
              sx={{
                maxWidth: { xs: '85%', sm: '70%' },
                p: 1.5,
                backgroundColor: msg.sender === 'user' ? '#00838F' : '#E2E8F0',
                color: msg.sender === 'user' ? 'white' : '#0F172A',
                borderRadius: 2,
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
              }}
            >
              <Typography sx={{ fontSize: 14, mb: 0.5 }}>{msg.text}</Typography>
              <Typography sx={{ fontSize: 11, opacity: 0.7 }}>{msg.time}</Typography>
            </Card>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Composer */}
      <Box sx={{ p: { xs: 1.25, sm: 2 }, borderTop: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', flexShrink: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 0.75,
            border: '1px solid #E2E8F0',
            borderRadius: 3,
            bgcolor: '#F8FAFC',
            px: 0.75,
            py: 0.75,
          }}
        >
          <Tooltip title="Attach file">
            <IconButton
              size="small"
              onClick={() => fileRef.current?.click()}
              aria-label="Attach file"
              sx={{
                color: '#64748B',
                bgcolor: '#fff',
                border: '1px solid #E2E8F0',
                width: 36,
                height: 36,
                flexShrink: 0,
                '&:hover': { bgcolor: '#F1F5F9', color: '#0F766E' },
              }}
            >
              <AttachFileIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add photo">
            <IconButton
              size="small"
              onClick={() => photoRef.current?.click()}
              aria-label="Add photo"
              sx={{
                color: '#64748B',
                bgcolor: '#fff',
                border: '1px solid #E2E8F0',
                width: 36,
                height: 36,
                flexShrink: 0,
                '&:hover': { bgcolor: '#F1F5F9', color: '#0F766E' },
              }}
            >
              <ImageIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={onKeyPress}
            multiline
            maxRows={3}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{
              flex: 1,
              minWidth: 0,
              px: 0.5,
              py: 0.5,
              '& .MuiInputBase-input': { fontSize: 14 },
            }}
          />
          <IconButton
            onClick={onSendMessage}
            aria-label="Send message"
            disabled={!newMessage.trim()}
            sx={{
              color: '#fff',
              bgcolor: '#0F766E',
              width: 40,
              height: 40,
              flexShrink: 0,
              '&:hover': { bgcolor: '#0D9488' },
              '&.Mui-disabled': { bgcolor: '#CBD5E1', color: '#fff' },
            }}
          >
            <SendIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={2500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" onClose={() => setToast('')} sx={{ width: '100%' }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  )
}
