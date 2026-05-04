import { Box, Avatar, Typography, TextField, Badge, InputAdornment, Chip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

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
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  messages: Message[]
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversation: Conversation
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectConversation: (conv: Conversation) => void
}

export default function ConversationList({
  conversations,
  selectedConversation,
  searchQuery,
  onSearchChange,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <Box sx={{ width: { xs: '100%', md: 350 }, borderRight: { md: '1px solid #E2E8F0' }, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
      {/* Search */}
      <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0' }}>
        <TextField
          fullWidth
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Box>

      {/* Conversations List */}
      <Box>
        {conversations.map((conv) => (
          <Box
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            sx={{
              display: 'flex',
              gap: 2,
              p: 2,
              cursor: 'pointer',
              backgroundColor: selectedConversation.id === conv.id ? '#f0fdfa' : 'white',
              borderLeft: selectedConversation.id === conv.id ? '3px solid #00838F' : '3px solid transparent',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: '#f9fafb'
              }
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: conv.online ? '#22c55e' : '#999',
                    boxShadow: '0 0 0 2px white',
                  },
                }}
              >
                <Avatar src={conv.avatar} sx={{ width: 50, height: 50 }} />
              </Badge>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#002528' }}>{conv.vendorName}</Typography>
                  {conv.unread > 0 && (
                    <Badge badgeContent={conv.unread} sx={{ '& .MuiBadge-badge': { backgroundColor: '#FF6B6B', color: 'white' } }} />
                  )}
                </Box>
                <Typography sx={{ fontSize: 12, color: '#999', mb: 0.5 }}>{conv.vendorType}</Typography>
                <Typography sx={{ fontSize: 12, color: '#666', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {conv.lastMessage}
                </Typography>
                <Typography sx={{ 
                  fontFamily: "'Open Sans', sans-serif", 
                  fontSize: 12, 
                  color: conv.unread > 0 ? '#002528' : '#666',
                  fontWeight: conv.unread > 0 ? 600 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '200px'
                }}>
                  {conv.lastMessage}
                </Typography>
                {conv.unread > 0 && (
                  <Chip 
                    label={conv.unread} 
                    size="small"
                    sx={{ 
                      height: 20, 
                      minWidth: 20,
                      backgroundColor: '#EB1948',
                      color: 'white',
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 11,
                      fontWeight: 600
                    }} 
                  />
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
