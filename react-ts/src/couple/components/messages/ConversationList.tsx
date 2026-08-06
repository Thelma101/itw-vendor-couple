import { Box, Avatar, Typography, TextField, Badge, InputAdornment, Chip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

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

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
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
    <Box
      sx={{
        width: { xs: '100%', md: 340 },
        maxWidth: '100%',
        borderRight: { md: '1px solid #E2E8F0' },
        border: { xs: '1px solid #E2E8F0', md: 'none' },
        borderRadius: { xs: 3, md: 0 },
        bgcolor: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 'auto', md: '100%' },
        maxHeight: { xs: '50vh', md: '100%' },
        minWidth: 0,
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', flexShrink: 0 }}>
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

      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, minHeight: 0 }}>
        {conversations.map((conv) => {
          const selected = selectedConversation?.id === conv.id
          return (
            <Box
              key={String(conv.id)}
              onClick={() => onSelectConversation(conv)}
              sx={{
                display: 'flex',
                gap: 1.5,
                p: 1.75,
                cursor: 'pointer',
                backgroundColor: selected ? '#f0fdfa' : 'white',
                borderLeft: selected ? '3px solid #00838F' : '3px solid transparent',
                minWidth: 0,
                '&:hover': { backgroundColor: '#f9fafb' },
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  flexShrink: 0,
                  '& .MuiBadge-badge': {
                    backgroundColor: conv.online ? '#22c55e' : '#999',
                    boxShadow: '0 0 0 2px white',
                  },
                }}
              >
                <Avatar src={conv.avatar} sx={{ width: 44, height: 44 }} />
              </Badge>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 0.25 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#002528',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {conv.vendorName}
                  </Typography>
                  {conv.unread > 0 ? (
                    <Chip
                      label={conv.unread}
                      size="small"
                      sx={{
                        height: 20,
                        minWidth: 20,
                        flexShrink: 0,
                        backgroundColor: '#EB1948',
                        color: 'white',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    />
                  ) : null}
                </Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: '#94A3B8',
                    mb: 0.35,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {conv.vendorType}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: conv.unread > 0 ? '#0F172A' : '#64748B',
                    fontWeight: conv.unread > 0 ? 600 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {conv.lastMessage}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
