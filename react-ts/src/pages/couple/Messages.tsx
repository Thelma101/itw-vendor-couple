import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography,
} from '@mui/material';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';
import { useNotifications } from '../../contexts/NotificationContext';
import ConversationList from '../../components/couple/messages/ConversationList';
import MessageThread from '../../components/couple/messages/MessageThread';

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

  const filteredConversations = conversations.filter(conv =>
    conv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.vendorType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ backgroundColor: '#FFF6F9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      
      {/* Page Header */}
      <Box sx={{ px: 4, py: 3 }}>
        <BackButton fallbackPath="/couple/dashboard" sx={{ mb: 2 }} />
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
        <ConversationList
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectConversation={selectConversation}
        />

        <MessageThread
          conversation={selectedConversation}
          newMessage={newMessage}
          onMessageChange={setNewMessage}
          onSendMessage={handleSendMessage}
        />
      </Box>

      <Footer />
    </Box>
  );
};

export default Messages;
