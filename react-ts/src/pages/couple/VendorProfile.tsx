import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button, 
  Card, 
  Rating, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { addRecentlyViewed } from '../../components/home/RecentlyViewed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useShortlist } from '../../contexts/ShortlistContext';

// Mock vendor data
const vendorData = {
  id: '1',
  name: 'Regina Ugwu',
  type: 'Stylist, Photographer',
  location: 'Ikeja, Lagos',
  rating: 4.8,
  reviewCount: 127,
  verified: true,
  responseTime: 'Within 24 hours',
  startingPrice: 150000,
  bio: 'Award-winning wedding photographer and stylist with over 8 years of experience capturing beautiful moments. Specializing in candid photography, bridal styling, and creating timeless memories for couples.',
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
};

// Pricing packages
const packages = [
  {
    name: 'Essential',
    price: 150000,
    description: 'Perfect for intimate ceremonies',
    features: ['4 hours coverage', '100 edited photos', 'Online gallery', '1 photographer'],
    popular: false
  },
  {
    name: 'Premium',
    price: 350000,
    description: 'Our most popular package',
    features: ['8 hours coverage', '300 edited photos', 'Online gallery', '2 photographers', 'Engagement shoot', 'Photo album'],
    popular: true
  },
  {
    name: 'Luxury',
    price: 650000,
    description: 'The complete experience',
    features: ['Full day coverage', 'Unlimited photos', 'Online gallery', '3 photographers', 'Engagement shoot', 'Premium album', 'Drone footage', 'Same-day edits'],
    popular: false
  }
];

// Mock reviews
const reviews = [
  {
    id: 1,
    author: 'Sarah & Michael',
    date: 'December 2024',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    text: 'Regina was absolutely incredible! She captured every special moment of our day perfectly. The photos are stunning and we couldn\'t be happier.',
    package: 'Premium Package'
  },
  {
    id: 2,
    author: 'Chioma & David',
    date: 'November 2024',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    text: 'Professional, creative, and so easy to work with. Regina made us feel comfortable throughout the entire process. Highly recommend!',
    package: 'Luxury Package'
  },
  {
    id: 3,
    author: 'Amara & Tunde',
    date: 'October 2024',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    text: 'Beautiful work and great attention to detail. Delivered all photos on time and was very responsive to our requests.',
    package: 'Essential Package'
  }
];

// Availability calendar (next 30 days)
const generateAvailability = () => {
  const availability: { date: Date; available: boolean }[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    availability.push({
      date,
      available: Math.random() > 0.3 // 70% available
    });
  }
  return availability;
};

// Portfolio images
const portfolioWorks = [
  { image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', title: 'Sarah & Michael\nWedding' },
  { image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', title: '' },
  { image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600', title: '' },
  { image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600', title: 'Chioma & David' },
  { image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600', title: '' },
  { image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600', title: '' },
];

const VendorProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToShortlist, removeFromShortlist, isInShortlist } = useShortlist();
  
  // Check if we came from a preview modal
  const fromPreview = location.state?.fromPreview === true;
  // const previewSource = location.state?.source || ''; // 'home' or 'search'
  // const previewVendorId = location.state?.vendorId || null;
  
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [inquiryForm, setInquiryForm] = useState({
    weddingDate: '',
    guestCount: '',
    budget: '',
    message: ''
  });
  
  const availability = generateAvailability();
  const isFavorited = isInShortlist(vendorData.id);

  // Track recently viewed vendor
  useEffect(() => {
    addRecentlyViewed({
      id: vendorData.id,
      name: vendorData.name,
      category: vendorData.type,
      image: vendorData.profileImage,
      rating: vendorData.rating,
      reviewCount: vendorData.reviewCount,
      price: vendorData.startingPrice.toString(),
      location: vendorData.location,
    });
  }, [vendorData.id]);

  const handleFavorite = () => {
    if (isFavorited) {
      removeFromShortlist(vendorData.id);
      setSnackbarMessage('Removed from shortlist');
    } else {
      addToShortlist({
        id: vendorData.id,
        name: vendorData.name,
        price: vendorData.startingPrice,
        category: vendorData.type,
        image: vendorData.profileImage
      });
      setSnackbarMessage('Added to shortlist');
    }
    setSnackbarOpen(true);
  };

  const handleInquirySubmit = () => {
    setInquiryOpen(false);
    setSnackbarMessage('Inquiry sent! Vendor will respond within 24 hours.');
    setSnackbarOpen(true);
    setInquiryForm({ weddingDate: '', guestCount: '', budget: '', message: '' });
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <Box sx={{ backgroundColor: '#FFF6F9', minHeight: '100vh' }}>
      <Nav />
      
      {/* Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 4, py: 2 }}>
        <BackButton
          fallbackPath="/couple/search-results"
          label={fromPreview ? 'Back to Preview' : undefined}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, px: 4, pb: 4 }}>
        
        {/* Left Sidebar - Profile Card */}
        <Box sx={{ width: 340, flexShrink: 0 }}>
          <Card sx={{ 
            border: '0.25px solid #00838F', 
            backgroundColor: 'white', 
            p: 3,
            position: 'sticky',
            top: 20
          }}>
            {/* Favorite Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton onClick={handleFavorite} sx={{ color: isFavorited ? '#EB1948' : '#ccc' }}>
                {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            {/* Profile Image */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar
                src={vendorData.profileImage}
                sx={{ width: 150, height: 150, border: '3px solid #00838F' }}
              />
            </Box>

            {/* Vendor Name & Verified Badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Typography sx={{ 
                fontFamily: "'Open Sans', sans-serif", 
                fontWeight: 700, 
                fontSize: 20, 
                color: '#002528',
                textAlign: 'center'
              }}>
                {vendorData.name}
              </Typography>
              {vendorData.verified && (
                <VerifiedIcon sx={{ color: '#00838F', fontSize: 20 }} />
              )}
            </Box>

            {/* Vendor Type */}
            <Typography sx={{ 
              fontFamily: "'Open Sans', sans-serif", 
              fontSize: 14, 
              color: '#666',
              textAlign: 'center',
              mb: 1
            }}>
              {vendorData.type}
            </Typography>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 2 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: '#00838F' }} />
              <Typography sx={{ 
                fontFamily: "'Open Sans', sans-serif", 
                fontSize: 14, 
                color: '#002528' 
              }}>
                {vendorData.location}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Rating value={vendorData.rating} readOnly precision={0.1} size="small" />
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
                {vendorData.rating}
              </Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                ({vendorData.reviewCount} reviews)
              </Typography>
            </Box>

            {/* Starting Price */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                Starting at
              </Typography>
              <Typography sx={{ 
                fontFamily: "'Open Sans', sans-serif", 
                fontSize: 24, 
                fontWeight: 700, 
                color: '#00838F' 
              }}>
                {formatPrice(vendorData.startingPrice)}
              </Typography>
            </Box>

            {/* Response Time */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1, 
              mb: 3,
              p: 1,
              backgroundColor: '#f0fdf4',
              borderRadius: 1
            }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: '#22c55e' }} />
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#166534' }}>
                Responds {vendorData.responseTime}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Button
              fullWidth
              onClick={() => setInquiryOpen(true)}
              sx={{
                background: 'linear-gradient(229.87deg, #EB1948 65.18%, #B52344 232.03%)',
                color: 'white',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                textTransform: 'none',
                borderRadius: 1,
                py: 1.5,
                mb: 1.5,
                '&:hover': { opacity: 0.9 }
              }}
            >
              Request Quote
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/couple/messages')}
              sx={{
                borderColor: '#00838F',
                color: '#00838F',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                textTransform: 'none',
                borderRadius: 1,
                py: 1,
                '&:hover': { backgroundColor: '#f0fdfa' }
              }}
            >
              Send Message
            </Button>
          </Card>
        </Box>

        {/* Right Section - Main Content */}
        <Box sx={{ flex: 1 }}>
          
          {/* About Section */}
          <Card sx={{ 
            border: '0.25px solid #00838F', 
            backgroundColor: 'white', 
            p: 3, 
            mb: 3 
          }}>
            <Typography sx={{ 
              fontFamily: "'Open Sans', sans-serif", 
              fontWeight: 700, 
              fontSize: 18, 
              color: '#002528', 
              mb: 2 
            }}>
              About
            </Typography>
            <Typography sx={{ 
              fontFamily: "'Open Sans', sans-serif", 
              fontSize: 14, 
              color: '#444',
              lineHeight: 1.7
            }}>
              {vendorData.bio}
            </Typography>
          </Card>

          {/* Pricing Packages */}
          <Card sx={{ 
            border: '0.25px solid #00838F', 
            backgroundColor: 'white', 
            p: 3, 
            mb: 3 
          }}>
            <Typography sx={{ 
              fontFamily: "'Open Sans', sans-serif", 
              fontWeight: 700, 
              fontSize: 18, 
              color: '#002528', 
              mb: 3 
            }}>
              Pricing Packages
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {packages.map((pkg, index) => (
                <Box
                  key={index}
                  sx={{
                    border: pkg.popular ? '2px solid #00838F' : '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 2.5,
                    position: 'relative',
                    backgroundColor: pkg.popular ? '#f0fdfa' : 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {pkg.popular && (
                    <Chip 
                      label="Most Popular" 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: -10, 
                        right: 10,
                        backgroundColor: '#00838F',
                        color: 'white',
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: 11,
                        fontWeight: 600
                      }} 
                    />
                  )}
                  <Typography sx={{ 
                    fontFamily: "'Open Sans', sans-serif", 
                    fontWeight: 700, 
                    fontSize: 16, 
                    color: '#002528',
                    mb: 0.5
                  }}>
                    {pkg.name}
                  </Typography>
                  <Typography sx={{ 
                    fontFamily: "'Open Sans', sans-serif", 
                    fontSize: 12, 
                    color: '#666',
                    mb: 1.5
                  }}>
                    {pkg.description}
                  </Typography>
                  <Typography sx={{ 
                    fontFamily: "'Open Sans', sans-serif", 
                    fontWeight: 700, 
                    fontSize: 22, 
                    color: '#00838F',
                    mb: 2
                  }}>
                    {formatPrice(pkg.price)}
                  </Typography>
                  {pkg.features.map((feature, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                      <CheckCircleIcon sx={{ fontSize: 14, color: '#22c55e' }} />
                      <Typography sx={{ 
                        fontFamily: "'Open Sans', sans-serif", 
                        fontSize: 12, 
                        color: '#444' 
                      }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                  <Button
                    fullWidth
                    variant={pkg.popular ? 'contained' : 'outlined'}
                    onClick={() => setInquiryOpen(true)}
                    sx={{
                      mt: 2,
                      backgroundColor: pkg.popular ? '#00838F' : 'transparent',
                      borderColor: '#00838F',
                      color: pkg.popular ? 'white' : '#00838F',
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 13,
                      textTransform: 'none',
                      borderRadius: 1,
                      '&:hover': { 
                        backgroundColor: pkg.popular ? '#006d75' : '#f0fdfa'
                      }
                    }}
                  >
                    Select Package
                  </Button>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Availability Calendar */}
          <Card sx={{ 
            border: '0.25px solid #00838F', 
            backgroundColor: 'white', 
            p: 3, 
            mb: 3 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarMonthIcon sx={{ color: '#00838F' }} />
              <Typography sx={{ 
                fontFamily: "'Open Sans', sans-serif", 
                fontWeight: 700, 
                fontSize: 18, 
                color: '#002528' 
              }}>
                Availability
              </Typography>
            </Box>
            <Typography sx={{ 
              fontFamily: "'Open Sans', sans-serif", 
              fontSize: 13, 
              color: '#666',
              mb: 2
            }}>
              Next 30 days • Green = Available
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: 1 
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Typography key={day} sx={{ 
                  fontFamily: "'Open Sans', sans-serif", 
                  fontSize: 11, 
                  color: '#666',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  {day}
                </Typography>
              ))}
              {availability.map((day, i) => (
                <Box
                  key={i}
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    backgroundColor: day.available ? '#dcfce7' : '#fee2e2',
                    border: '1px solid',
                    borderColor: day.available ? '#22c55e' : '#fca5a5',
                    cursor: day.available ? 'pointer' : 'default',
                    transition: 'transform 0.2s',
                    '&:hover': day.available ? {
                      transform: 'scale(1.1)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    } : {}
                  }}
                >
                  <Typography sx={{ 
                    fontFamily: "'Open Sans', sans-serif", 
                    fontSize: 12, 
                    fontWeight: 500,
                    color: day.available ? '#166534' : '#991b1b'
                  }}>
                    {day.date.getDate()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Reviews Section */}
          <Card sx={{ 
            border: '0.25px solid #00838F', 
            backgroundColor: 'white', 
            p: 3, 
            mb: 3 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ 
                fontFamily: "'Open Sans', sans-serif", 
                fontWeight: 700, 
                fontSize: 18, 
                color: '#002528' 
              }}>
                Reviews ({vendorData.reviewCount})
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={vendorData.rating} readOnly precision={0.1} size="small" />
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16 }}>
                  {vendorData.rating}
                </Typography>
              </Box>
            </Box>
            
            {reviews.map((review, index) => (
              <Box key={review.id}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Avatar src={review.avatar} sx={{ width: 48, height: 48 }} />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Box>
                        <Typography sx={{ 
                          fontFamily: "'Open Sans', sans-serif", 
                          fontWeight: 600, 
                          fontSize: 14, 
                          color: '#002528' 
                        }}>
                          {review.author}
                        </Typography>
                        <Typography sx={{ 
                          fontFamily: "'Open Sans', sans-serif", 
                          fontSize: 12, 
                          color: '#666' 
                        }}>
                          {review.date} • {review.package}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography sx={{ 
                      fontFamily: "'Open Sans', sans-serif", 
                      fontSize: 14, 
                      color: '#444',
                      lineHeight: 1.6,
                      mt: 1
                    }}>
                      {review.text}
                    </Typography>
                  </Box>
                </Box>
                {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
            
            <Button
              fullWidth
              variant="text"
              sx={{
                mt: 2,
                color: '#00838F',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              View All {vendorData.reviewCount} Reviews
            </Button>
          </Card>

          {/* Portfolio Gallery */}
          <Card sx={{ 
            border: '0.25px solid #00838F', 
            backgroundColor: 'white', 
            p: 3 
          }}>
            <Typography sx={{ 
              fontFamily: "'Open Sans', sans-serif", 
              fontWeight: 700, 
              fontSize: 18, 
              color: '#002528', 
              mb: 3 
            }}>
              Portfolio
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 2 
            }}>
              {portfolioWorks.map((work, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    height: 250,
                    overflow: 'hidden',
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    },
                    '&:hover .overlay': {
                      opacity: 1
                    }
                  }}
                >
                  <img
                    src={work.image}
                    alt={work.title || `Portfolio ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(0,37,40,0.7) 100%)',
                      opacity: work.title ? 1 : 0,
                      transition: 'opacity 0.3s',
                      display: 'flex',
                      alignItems: 'flex-end',
                      p: 2
                    }}
                  >
                    {work.title && (
                      <Typography sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: 'white',
                        whiteSpace: 'pre-line'
                      }}>
                        {work.title}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                sx={{
                  backgroundColor: '#00838F',
                  color: 'white',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: 'none',
                  borderRadius: 1,
                  px: 4,
                  py: 1.5,
                  '&:hover': { backgroundColor: '#006d75' }
                }}
              >
                View Full Portfolio
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Inquiry Dialog */}
      <Dialog 
        open={inquiryOpen} 
        onClose={() => setInquiryOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          fontFamily: "'Open Sans', sans-serif", 
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Request a Quote
          <IconButton onClick={() => setInquiryOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, mt: 1 }}>
            <Avatar src={vendorData.profileImage} sx={{ width: 56, height: 56 }} />
            <Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600 }}>
                {vendorData.name}
              </Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>
                {vendorData.type}
              </Typography>
            </Box>
          </Box>
          
          <TextField
            fullWidth
            label="Wedding Date"
            type="date"
            value={inquiryForm.weddingDate}
            onChange={(e) => setInquiryForm({ ...inquiryForm, weddingDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2, '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
          />
          
          <TextField
            fullWidth
            label="Estimated Guest Count"
            type="number"
            placeholder="e.g., 150"
            value={inquiryForm.guestCount}
            onChange={(e) => setInquiryForm({ ...inquiryForm, guestCount: e.target.value })}
            sx={{ mb: 2, '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
          />
          
          <TextField
            fullWidth
            label="Budget Range"
            placeholder="e.g., ₦200,000 - ₦400,000"
            value={inquiryForm.budget}
            onChange={(e) => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
            sx={{ mb: 2, '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
          />
          
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            placeholder="Tell the vendor about your wedding vision, specific requirements, or questions..."
            value={inquiryForm.message}
            onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
            sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setInquiryOpen(false)}
            sx={{ 
              fontFamily: "'Open Sans', sans-serif",
              textTransform: 'none',
              color: '#666'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInquirySubmit}
            startIcon={<SendIcon />}
            sx={{
              background: 'linear-gradient(229.87deg, #EB1948 65.18%, #B52344 232.03%)',
              color: 'white',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              '&:hover': { opacity: 0.9 }
            }}
          >
            Send Inquiry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default VendorProfile;
