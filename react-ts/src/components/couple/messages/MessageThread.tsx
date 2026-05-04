import { Box, Typography, TextField, IconButton, InputAdornment, Avatar, Card } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import { useRef, useEffect } from 'react'

interface Message {
  id: number
  sender: 'user' | 'vendor'
  text: string
  time: string
  unread?: boolean
}

interface Conversation {
  id: number
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={conversation.avatar} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#002528' }}>{conversation.vendorName}</Typography>
            <Typography sx={{ fontSize: 12, color: '#999' }}>{conversation.vendorType}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {conversation.messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Card
              sx={{
                maxWidth: '70%',
                p: 1.5,
                backgroundColor: msg.sender === 'user' ? '#00838F' : '#E2E8F0',
                color: msg.sender === 'user' ? 'white' : '#0F172A',
                borderRadius: 2,
                wordBreak: 'break-word',
              }}
            >
              <Typography sx={{ fontSize: 14, mb: 0.5 }}>{msg.text}</Typography>
              <Typography sx={{ fontSize: 11, opacity: 0.7 }}>{msg.time}</Typography>
            </Card>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={onKeyPress}
          multiline
          maxRows={3}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" sx={{ mr: 0.5, color: '#00838F' }}>
                  <AttachFileIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ mr: 0.5, color: '#00838F' }}>
                  <ImageIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={onSendMessage} size="small" sx={{ color: '#00838F' }}>
                  <SendIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
      </Box>
    </Box>
  )
}
