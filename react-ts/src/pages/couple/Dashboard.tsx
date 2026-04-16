import React from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  LinearProgress,
  Button,
  Chip,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MessageIcon from '@mui/icons-material/Message';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useShortlist } from '../../contexts/ShortlistContext';

// Mock user data
const userData = {
  name: 'Thelma & David',
  weddingDate: '2026-06-15',
  daysUntilWedding: 154,
  avatar: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200',
  location: 'Lagos, Nigeria'
};

// Wedding planning checklist
const checklist = [
  { id: 1, task: 'Book Venue', completed: true, category: 'Venue' },
  { id: 2, task: 'Hire Photographer', completed: true, category: 'Photography' },
  { id: 3, task: 'Choose Florist', completed: false, category: 'Florist' },
  { id: 4, task: 'Book Caterer', completed: false, category: 'Catering' },
  { id: 5, task: 'Find DJ/Band', completed: false, category: 'Music' },
  { id: 6, task: 'Order Wedding Cake', completed: false, category: 'Cake' },
  { id: 7, task: 'Rent Bridal Car', completed: false, category: 'Car Rental' },
  { id: 8, task: 'Book Makeup Artist', completed: false, category: 'Makeup' },
];

// Recently viewed vendors
const recentVendors = [
  {
    id: '1',
    name: 'Regina Ugwu',
    type: 'Photographer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 4.8,
    price: '₦150,000'
  },
  {
    id: '2',
    name: 'Emerald Gardens',
    type: 'Venue',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100',
    rating: 4.9,
    price: '₦500,000'
  },
  {
    id: '3',
    name: 'Divine Catering',
    type: 'Caterer',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=100',
    rating: 4.7,
    price: '₦300,000'
  }
];

// Upcoming appointments
const appointments = [
  {
    id: 1,
    vendor: 'Emerald Gardens',
    type: 'Venue Tour',
    date: 'Jan 20, 2025',
    time: '2:00 PM',
    status: 'confirmed'
  },
  {
    id: 2,
    vendor: 'Divine Catering',
    type: 'Menu Tasting',
    date: 'Jan 25, 2025',
    time: '11:00 AM',
    status: 'pending'
  }
];

// Quick action cards
const quickActions = [
  { icon: <SearchIcon />, label: 'Find Vendors', path: '/couple/select-vendors', color: '#00838F' },
  { icon: <FavoriteIcon />, label: 'My Shortlist', path: '/couple/shortlist', color: '#EB1948' },
  { icon: <CalendarMonthIcon />, label: 'My Bookings', path: '/couple/my-vendors', color: '#22c55e' },
  { icon: <MessageIcon />, label: 'Messages', path: '/couple/messages', color: '#8b5cf6' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { items: shortlistItems } = useShortlist();

  const completedTasks = checklist.filter(item => item.completed).length;
  const progressPercentage = (completedTasks / checklist.length) * 100;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Nav />

      {/* Welcome Banner */}
      <Box sx={{
        background: 'linear-gradient(135deg, #00838F 0%, #006d75 100%)',
        color: 'white',
        px: 4,
        py: 4,
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              src={userData.avatar}
              sx={{ width: 80, height: 80, border: '3px solid white' }}
            />
            <Box>
              <Typography sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                fontSize: 28
              }}>
                Welcome back, {userData.name}! 💍
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EventIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>
                    {formatDate(userData.weddingDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>
                    {userData.location}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Countdown */}
          <Card sx={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            p: 2,
            textAlign: 'center',
            minWidth: 150
          }}>
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 48,
              color: 'white',
              lineHeight: 1
            }}>
              {userData.daysUntilWedding}
            </Typography>
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              color: 'rgba(255,255,255,0.9)'
            }}>
              days until your big day
            </Typography>
          </Card>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 4, pb: 4, maxWidth: 1200, mx: 'auto' }}>

        {/* Quick Actions */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          mb: 4
        }}>
          {quickActions.map((action, index) => (
            <Card
              key={index}
              onClick={() => navigate(action.path)}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                border: '0.25px solid #00838F',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: `${action.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: action.color
              }}>
                {React.cloneElement(action.icon, { sx: { fontSize: 28 } })}
              </Box>
              <Typography sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: '#002528'
              }}>
                {action.label}
              </Typography>
              {action.label === 'My Shortlist' && shortlistItems.length > 0 && (
                <Chip
                  label={shortlistItems.length}
                  size="small"
                  sx={{
                    backgroundColor: '#EB1948',
                    color: 'white',
                    height: 20,
                    fontSize: 11
                  }}
                />
              )}
            </Card>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>

          {/* Left Column */}
          <Box>
            {/* Planning Progress */}
            <Card sx={{
              p: 3,
              mb: 3,
              border: '0.25px solid #00838F'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#002528'
                }}>
                  Wedding Planning Progress
                </Typography>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#00838F'
                }}>
                  {completedTasks}/{checklist.length} tasks
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  mb: 3,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#00838F',
                    borderRadius: 5
                  }
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {checklist.map((item) => (
                  <Chip
                    key={item.id}
                    icon={item.completed ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : undefined}
                    label={item.task}
                    onClick={() => !item.completed && navigate(`/couple/search-results?category=${item.category}`)}
                    sx={{
                      backgroundColor: item.completed ? '#dcfce7' : '#f5f5f5',
                      color: item.completed ? '#166534' : '#666',
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 12,
                      cursor: item.completed ? 'default' : 'pointer',
                      '&:hover': !item.completed ? { backgroundColor: '#e5e5e5' } : {},
                      '& .MuiChip-icon': {
                        color: '#22c55e'
                      }
                    }}
                  />
                ))}
              </Box>
            </Card>

            {/* Recently Viewed */}
            <Card sx={{
              p: 3,
              border: '0.25px solid #00838F'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#002528'
                }}>
                  Recently Viewed Vendors
                </Typography>
                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/couple/select-vendors')}
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    textTransform: 'none',
                    color: '#00838F',
                    fontWeight: 600
                  }}
                >
                  Browse All
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentVendors.map((vendor) => (
                  <Box
                    key={vendor.id}
                    onClick={() => navigate(`/couple/vendor/${vendor.id}`)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <Avatar
                      src={vendor.image}
                      sx={{ width: 56, height: 56, borderRadius: 2 }}
                      variant="rounded"
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: '#002528'
                      }}>
                        {vendor.name}
                      </Typography>
                      <Typography sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: 12,
                        color: '#666'
                      }}>
                        {vendor.type}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Rating value={vendor.rating} readOnly size="small" precision={0.1} />
                        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>
                          {vendor.rating}
                        </Typography>
                      </Box>
                      <Typography sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#00838F'
                      }}>
                        {vendor.price}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>

          {/* Right Column */}
          <Box>
            {/* Upcoming Appointments */}
            <Card sx={{
              p: 3,
              mb: 3,
              border: '0.25px solid #00838F'
            }}>
              <Typography sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: '#002528',
                mb: 2
              }}>
                Upcoming Appointments
              </Typography>
              {appointments.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {appointments.map((apt) => (
                    <Box
                      key={apt.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e5e5'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          color: '#002528'
                        }}>
                          {apt.vendor}
                        </Typography>
                        <Chip
                          label={apt.status}
                          size="small"
                          sx={{
                            backgroundColor: apt.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                            color: apt.status === 'confirmed' ? '#166534' : '#92400e',
                            fontFamily: "'Open Sans', sans-serif",
                            fontSize: 10,
                            height: 20,
                            textTransform: 'capitalize'
                          }}
                        />
                      </Box>
                      <Typography sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: 12,
                        color: '#666'
                      }}>
                        {apt.type}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <CalendarMonthIcon sx={{ fontSize: 14, color: '#00838F' }} />
                        <Typography sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: 12,
                          color: '#00838F',
                          fontWeight: 500
                        }}>
                          {apt.date} at {apt.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 14,
                  color: '#666',
                  textAlign: 'center',
                  py: 3
                }}>
                  No upcoming appointments
                </Typography>
              )}
            </Card>

            {/* Quick Tips */}
            <Card sx={{
              p: 3,
              border: '0.25px solid #00838F',
              background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)'
            }}>
              <Typography sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: '#002528',
                mb: 2
              }}>
                💡 Planning Tips
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#00838F',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    1
                  </Box>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: '#444',
                    lineHeight: 1.5
                  }}>
                    Book vendors 6-12 months in advance to secure your preferred dates.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#00838F',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    2
                  </Box>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: '#444',
                    lineHeight: 1.5
                  }}>
                    Request quotes from at least 3 vendors before making a decision.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#00838F',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    3
                  </Box>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: '#444',
                    lineHeight: 1.5
                  }}>
                    Read reviews from past couples to make informed choices.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Dashboard;
