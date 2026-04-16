import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  TextField,
  IconButton,
  Badge,
  InputAdornment,
  Chip,
  Button,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import { useNotifications } from '../../contexts/NotificationContext';

interface Message {
  id: number;
  sender: 'vendor' | 'couple';
  text: string;
  time: string;
  read?: boolean;
}

interface Conversation {
  id: number;
  coupleName: string;
  weddingDate: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

// Mock conversations for vendor
const initialConversations: Conversation[] = [
  {
    id: 1,
    coupleName: 'Sarah & Michael',
    weddingDate: 'March 15, 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: 'We are so excited to work with you! Can we confirm the Premium package?',
    timestamp: '2 hours ago',
    unread: 2,
    online: true,
    messages: [
      { id: 1, sender: 'couple', text: 'Hi! We saw your amazing portfolio and would love to book you for our wedding.', time: '10:30 AM' },
      { id: 2, sender: 'vendor', text: 'Hello Sarah & Michael! Thank you so much for reaching out. I would be honored to be part of your special day!', time: '10:45 AM' },
      { id: 3, sender: 'couple', text: 'That\'s wonderful! We are planning our wedding for March 15th, 2026. Do you have that date available?', time: '11:00 AM' },
      { id: 4, sender: 'vendor', text: 'Great news! I just checked my calendar and March 15th is available. What package are you interested in?', time: '11:15 AM' },
      { id: 5, sender: 'couple', text: 'We are looking at the Premium package. It seems perfect for our needs.', time: '11:30 AM' },
      { id: 6, sender: 'couple', text: 'We are so excited to work with you! Can we confirm the Premium package?', time: '2 hours ago', read: false },
    ]
  },
  {
    id: 2,
    coupleName: 'Jane & John',
    weddingDate: 'April 22, 2026',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    lastMessage: 'Thank you for the detailed proposal. We will review and get back to you.',
    timestamp: '1 day ago',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: 'couple', text: 'Hello! We are interested in your Luxury package for our wedding.', time: 'Yesterday 9:00 AM' },
      { id: 2, sender: 'vendor', text: 'Hi Jane & John! The Luxury package is our most comprehensive offering. When is your wedding date?', time: 'Yesterday 9:30 AM' },
      { id: 3, sender: 'couple', text: 'April 22nd, 2026. We are having about 300 guests.', time: 'Yesterday 10:00 AM' },
      { id: 4, sender: 'vendor', text: 'Perfect! I have sent you a detailed proposal with all the inclusions. Please let me know if you have any questions.', time: 'Yesterday 2:00 PM' },
      { id: 5, sender: 'couple', text: 'Thank you for the detailed proposal. We will review and get back to you.', time: '1 day ago' },
    ]
  },
  {
    id: 3,
    coupleName: 'Amara & Uche',
    weddingDate: 'February 28, 2026',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    lastMessage: 'The deposit has been sent! Looking forward to working together.',
    timestamp: '3 days ago',
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: 'vendor', text: 'Thank you for choosing me for your wedding! I am excited to work with you.', time: '3 days ago' },
      { id: 2, sender: 'couple', text: 'We are thrilled! Can you send over the contract?', time: '3 days ago' },
      { id: 3, sender: 'vendor', text: 'Absolutely! I have just emailed you the contract and payment details.', time: '3 days ago' },
      { id: 4, sender: 'couple', text: 'The deposit has been sent! Looking forward to working together.', time: '3 days ago' },
    ]
  },
  {
    id: 4,
    coupleName: 'Lara & Kunle',
    weddingDate: 'May 10, 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    lastMessage: 'Hi! We loved your portfolio. Are you available for May 10th?',
    timestamp: '5 hours ago',
    unread: 1,
    online: false,
    messages: [
      { id: 1, sender: 'couple', text: 'Hi! We loved your portfolio. Are you available for May 10th?', time: '5 hours ago', read: false },
    ]
  },
];

export default function VendorMessages() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: selectedConversation.messages.length + 1,
        sender: 'vendor',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMsg],
        lastMessage: newMessage,
        timestamp: 'Just now',
      };

      setConversations(prev =>
        prev.map(c => (c.id === selectedConversation.id ? updatedConversation : c))
      );
      setSelectedConversation(updatedConversation);
      setNewMessage('');

      // Simulate a reply after 2 seconds
      setTimeout(() => {
        const replyMsg: Message = {
          id: updatedConversation.messages.length + 2,
          sender: 'couple',
          text: 'Thank you for your quick response! That sounds great.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const withReply = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, newMsg, replyMsg],
          lastMessage: replyMsg.text,
          timestamp: 'Just now',
        };

        setConversations(prev =>
          prev.map(c => (c.id === selectedConversation.id ? withReply : c))
        );
        setSelectedConversation(withReply);

        // Add notification
        addNotification({
          type: 'message',
          title: 'New Message',
          message: `${selectedConversation.coupleName}: "${replyMsg.text}"`,
          avatar: selectedConversation.avatar,
          link: '/vendor/messages',
        });
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectConversation = (conv: Conversation) => {
    // Mark as read
    const updated = { ...conv, unread: 0 };
    setConversations(prev => prev.map(c => (c.id === conv.id ? updated : c)));
    setSelectedConversation(updated);
  };

  const filteredConversations = conversations.filter(c =>
    c.coupleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', gap: 0 }}>
      {/* Conversations List */}
      <Card
        sx={{
          width: 340,
          borderRadius: 0,
          borderRight: '1px solid #CCFDF2',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #CCFDF2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: '#002528',
              }}
            >
              Messages
            </Typography>
            {totalUnread > 0 && (
              <Chip
                label={totalUnread}
                size="small"
                sx={{ bgcolor: '#EB1948', color: 'white', height: 24 }}
              />
            )}
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#f5f5f5',
                '& fieldset': { border: 'none' },
              },
            }}
          />
        </Box>

        {/* Conversation List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {filteredConversations.map((conv) => (
            <Box
              key={conv.id}
              onClick={() => selectConversation(conv)}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                cursor: 'pointer',
                bgcolor: selectedConversation.id === conv.id ? '#FFFFFF' : 'transparent',
                borderLeft: selectedConversation.id === conv.id ? '3px solid #00838F' : '3px solid transparent',
                '&:hover': { bgcolor: '#fafafa' },
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: conv.online ? '#4CAF50' : '#999',
                    border: '2px solid white',
                  },
                }}
              >
                <Avatar src={conv.avatar} sx={{ width: 48, height: 48 }} />
              </Badge>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: conv.unread > 0 ? 700 : 600,
                      fontSize: 14,
                      color: '#002528',
                    }}
                  >
                    {conv.coupleName}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 11,
                      color: conv.unread > 0 ? '#00838F' : '#999',
                    }}
                  >
                    {conv.timestamp}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 12,
                    color: '#00838F',
                    mb: 0.5,
                  }}
                >
                  <EventIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                  {conv.weddingDate}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 13,
                      color: '#666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    {conv.lastMessage}
                  </Typography>
                  {conv.unread > 0 && (
                    <Chip
                      label={conv.unread}
                      size="small"
                      sx={{
                        bgcolor: '#EB1948',
                        color: 'white',
                        height: 20,
                        minWidth: 20,
                        fontSize: 11,
                        ml: 1,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
        {/* Chat Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #CCFDF2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: selectedConversation.online ? '#4CAF50' : '#999',
                  border: '2px solid white',
                },
              }}
            >
              <Avatar src={selectedConversation.avatar} sx={{ width: 44, height: 44 }} />
            </Badge>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#002528',
                }}
              >
                {selectedConversation.coupleName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: selectedConversation.online ? '#4CAF50' : '#999',
                  }}
                >
                  {selectedConversation.online ? 'Online' : 'Offline'}
                </Typography>
                <Typography sx={{ color: '#ccc' }}>•</Typography>
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: '#00838F',
                  }}
                >
                  Wedding: {selectedConversation.weddingDate}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Button
              variant="outlined"
              size="small"
              sx={{
                mr: 1,
                borderColor: '#00838F',
                color: '#00838F',
                textTransform: 'none',
              }}
            >
              Send Quote
            </Button>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>View Profile</MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>Create Booking</MenuItem>
              <Divider />
              <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: '#f44336' }}>
                Block User
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            bgcolor: '#fafafa',
          }}
        >
          {selectedConversation.messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'vendor' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  p: 2,
                  borderRadius: msg.sender === 'vendor' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  bgcolor: msg.sender === 'vendor' ? '#00838F' : 'white',
                  color: msg.sender === 'vendor' ? 'white' : '#002528',
                  boxShadow: msg.sender === 'couple' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 11,
                      color: msg.sender === 'vendor' ? 'rgba(255,255,255,0.7)' : '#999',
                    }}
                  >
                    {msg.time}
                  </Typography>
                  {msg.sender === 'vendor' && (
                    <CheckCircleIcon
                      sx={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #CCFDF2',
            bgcolor: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <IconButton sx={{ color: '#666' }}>
              <AttachFileIcon />
            </IconButton>
            <IconButton sx={{ color: '#666' }}>
              <ImageIcon />
            </IconButton>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#f5f5f5',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: '#CCFDF2' },
                  '&.Mui-focused fieldset': { borderColor: '#00838F' },
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              sx={{
                bgcolor: newMessage.trim() ? '#00838F' : '#e0e0e0',
                color: 'white',
                '&:hover': { bgcolor: '#006b75' },
                '&.Mui-disabled': { color: '#999' },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
