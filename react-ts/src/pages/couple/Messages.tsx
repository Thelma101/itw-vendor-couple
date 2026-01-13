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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useNotifications } from '../../contexts/NotificationContext';

interface Message {
  id: number;
  sender: 'user' | 'vendor';
  text: string;
  time: string;
  unread?: boolean;
}

interface Conversation {
  id: number;
  vendorName: string;
  vendorType: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

// Mock conversations
const initialConversations: Conversation[] = [
  {
    id: 1,
    vendorName: 'Regina Ugwu',
    vendorType: 'Photographer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: 'Hi! Thank you for your inquiry. I would love to capture your special day!',
    timestamp: '2 hours ago',
    unread: 2,
    online: true,
    messages: [
      { id: 1, sender: 'user', text: 'Hi Regina! I saw your portfolio and love your work. We are planning our wedding for March 2025.', time: '10:30 AM' },
      { id: 2, sender: 'vendor', text: 'Hi! Thank you so much for reaching out! I would love to hear more about your wedding vision.', time: '10:45 AM' },
      { id: 3, sender: 'user', text: 'We are having a traditional ceremony in Lagos followed by a white wedding. About 200 guests.', time: '11:00 AM' },
      { id: 4, sender: 'vendor', text: 'That sounds beautiful! I have experience with both traditional and white weddings. What date in March are you looking at?', time: '11:15 AM' },
      { id: 5, sender: 'user', text: 'We are thinking March 15th. Is that date available?', time: '11:30 AM' },
      { id: 6, sender: 'vendor', text: 'Hi! Thank you for your inquiry. I would love to capture your special day!', time: '2 hours ago', unread: true },
    ]
  },
  {
    id: 2,
    vendorName: 'Adaeze Flowers',
    vendorType: 'Florist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    lastMessage: 'The bridal bouquet mockup is ready for your review.',
    timestamp: '1 day ago',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: 'user', text: 'Hello! I need floral arrangements for my wedding in March.', time: 'Yesterday 9:00 AM' },
      { id: 2, sender: 'vendor', text: 'Hello! I would be happy to help. What colors are you thinking?', time: 'Yesterday 9:30 AM' },
      { id: 3, sender: 'vendor', text: 'The bridal bouquet mockup is ready for your review.', time: '1 day ago' },
    ]
  },
  {
    id: 3,
    vendorName: 'Emerald Events',
    vendorType: 'Wedding Planner',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    lastMessage: 'I have sent over the venue options as discussed.',
    timestamp: '3 days ago',
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: 'vendor', text: 'Thank you for booking with us! I am excited to work on your wedding.', time: '3 days ago' },
      { id: 2, sender: 'vendor', text: 'I have sent over the venue options as discussed.', time: '3 days ago' },
    ]
  },
  {
    id: 4,
    vendorName: 'Divine Catering',
    vendorType: 'Caterer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    lastMessage: 'Menu tasting is scheduled for next Saturday.',
    timestamp: '5 days ago',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: 'user', text: 'We need catering for 200 guests.', time: '5 days ago' },
      { id: 2, sender: 'vendor', text: 'Menu tasting is scheduled for next Saturday.', time: '5 days ago' },
    ]
  }
];

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
        sender: 'user',
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

      // Simulate vendor reply after 2 seconds
      setTimeout(() => {
        const replyMsg: Message = {
          id: updatedConversation.messages.length + 2,
          sender: 'vendor',
          text: 'Thank you for your message! I will get back to you shortly.',
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

        // Add notification for the reply
        addNotification({
          type: 'message',
          title: 'New Message',
          message: `${selectedConversation.vendorName}: "${replyMsg.text}"`,
          avatar: selectedConversation.avatar,
          link: '/couple/messages',
        });
      }, 2000);
    }
  };

  const selectConversation = (conv: Conversation) => {
    // Mark as read
    const updated = { ...conv, unread: 0 };
    setConversations(prev => prev.map(c => (c.id === conv.id ? updated : c)));
    setSelectedConversation(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.vendorType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ backgroundColor: '#FFF6F9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      
      {/* Page Header */}
      <Box sx={{ px: 4, py: 3 }}>
        <Typography sx={{ 
          fontFamily: "'Open Sans', sans-serif", 
          fontWeight: 700, 
          fontSize: 28, 
          color: '#002528' 
        }}>
          Messages
        </Typography>
        <Typography sx={{ 
          fontFamily: "'Open Sans', sans-serif", 
          fontSize: 14, 
          color: '#666',
          mt: 0.5
        }}>
          Communicate with your wedding vendors
        </Typography>
      </Box>

      {/* Messages Container */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        gap: 2, 
        px: 4, 
        pb: 4,
        minHeight: 600
      }}>
        
        {/* Conversations List */}
        <Card sx={{ 
          width: 360, 
          border: '0.25px solid #00838F', 
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Search */}
          <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <TextField
              fullWidth
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#999', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: { 
                  fontFamily: "'Open Sans', sans-serif",
                  borderRadius: 2,
                  backgroundColor: '#f5f5f5'
                }
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
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    conv.online ? (
                      <Box sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: '#22c55e',
                        borderRadius: '50%',
                        border: '2px solid white'
                      }} />
                    ) : null
                  }
                >
                  <Avatar src={conv.avatar} sx={{ width: 48, height: 48 }} />
                </Badge>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ 
                      fontFamily: "'Open Sans', sans-serif", 
                      fontWeight: conv.unread > 0 ? 700 : 600, 
                      fontSize: 14, 
                      color: '#002528' 
                    }}>
                      {conv.vendorName}
                    </Typography>
                    <Typography sx={{ 
                      fontFamily: "'Open Sans', sans-serif", 
                      fontSize: 11, 
                      color: '#999' 
                    }}>
                      {conv.timestamp}
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    fontFamily: "'Open Sans', sans-serif", 
                    fontSize: 11, 
                    color: '#00838F',
                    mb: 0.5
                  }}>
                    {conv.vendorType}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        </Card>

        {/* Chat Window */}
        <Card sx={{ 
          flex: 1, 
          border: '0.25px solid #00838F', 
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            borderBottom: '1px solid #eee' 
          }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                selectedConversation.online ? (
                  <Box sx={{
                    width: 10,
                    height: 10,
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                    border: '2px solid white'
                  }} />
                ) : null
              }
            >
              <Avatar src={selectedConversation.avatar} sx={{ width: 44, height: 44 }} />
            </Badge>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ 
                fontFamily: "'Open Sans', sans-serif", 
                fontWeight: 600, 
                fontSize: 16, 
                color: '#002528' 
              }}>
                {selectedConversation.vendorName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ 
                  fontFamily: "'Open Sans', sans-serif", 
                  fontSize: 12, 
                  color: '#666' 
                }}>
                  {selectedConversation.vendorType}
                </Typography>
                {selectedConversation.online ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, backgroundColor: '#22c55e', borderRadius: '50%' }} />
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#22c55e' }}>
                      Online
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 12, color: '#999' }} />
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#999' }}>
                      Last seen {selectedConversation.timestamp}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            backgroundColor: '#fafafa'
          }}>
            {selectedConversation.messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    backgroundColor: msg.sender === 'user' ? '#00838F' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#002528',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    p: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography sx={{ 
                    fontFamily: "'Open Sans', sans-serif", 
                    fontSize: 14,
                    lineHeight: 1.5
                  }}>
                    {msg.text}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    alignItems: 'center', 
                    gap: 0.5, 
                    mt: 1 
                  }}>
                    <Typography sx={{ 
                      fontFamily: "'Open Sans', sans-serif", 
                      fontSize: 10,
                      color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#999'
                    }}>
                      {msg.time}
                    </Typography>
                    {msg.sender === 'user' && (
                      <CheckCircleIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }} />
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid #eee',
            backgroundColor: 'white'
          }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <IconButton size="small" sx={{ color: '#666' }}>
                <AttachFileIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#666' }}>
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
                    fontFamily: "'Open Sans', sans-serif",
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: 'transparent'
                    },
                    '&:hover fieldset': {
                      borderColor: '#00838F'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00838F'
                    }
                  }
                }}
              />
              <IconButton 
                onClick={handleSendMessage}
                sx={{ 
                  backgroundColor: '#00838F',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#006d75'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Box>

      <Footer />
    </Box>
  );
};

export default Messages;
