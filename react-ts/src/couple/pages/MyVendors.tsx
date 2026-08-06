import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  Chip,
  Button,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import {
  CheckCircle,
  HourglassEmpty,
  Cancel,
  MessageOutlined,
  StarOutline,
  CalendarMonth,
  LocationOn,
  Close
} from '@mui/icons-material';
import Nav from '@/couple/components/Nav';
import { useNavigate } from 'react-router-dom';

interface BookedVendor {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  location: string;
  bookingDate: string;
  eventDate: string;
  status: 'confirmed' | 'pending' | 'completed';
  depositPaid: number;
  hasRated: boolean;
  userRating?: number;
}

interface Inquiry {
  id: string;
  vendorName: string;
  vendorCategory: string;
  vendorImage: string;
  submittedDate: string;
  status: 'pending' | 'responded' | 'declined';
  message: string;
  response?: string;
}

// Mock booked vendors
const mockBookedVendors: BookedVendor[] = [
  {
    id: '1',
    name: 'Regina Ugwu Photography',
    category: 'Photographer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    price: 350000,
    location: 'Ikeja, Lagos',
    bookingDate: '2025-01-10',
    eventDate: '2025-06-15',
    status: 'confirmed',
    depositPaid: 105000,
    hasRated: false
  },
  {
    id: '2',
    name: 'Emerald Gardens Venue',
    category: 'Venue',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200',
    price: 500000,
    location: 'Lekki, Lagos',
    bookingDate: '2025-01-08',
    eventDate: '2025-06-15',
    status: 'confirmed',
    depositPaid: 150000,
    hasRated: false
  },
  {
    id: '3',
    name: 'Divine Catering Services',
    category: 'Caterer',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=200',
    price: 300000,
    location: 'Victoria Island, Lagos',
    bookingDate: '2025-01-05',
    eventDate: '2025-06-15',
    status: 'pending',
    depositPaid: 90000,
    hasRated: false
  }
];

// Mock inquiries
const mockInquiries: Inquiry[] = [
  {
    id: '1',
    vendorName: 'Adaeze Flowers & Decor',
    vendorCategory: 'Florist',
    vendorImage: 'https://images.unsplash.com/photo-1522653216850-4699c7e43a3a?w=200',
    submittedDate: '2025-01-12',
    status: 'pending',
    message: 'Looking for bridal bouquet and reception centerpieces for 20 tables.'
  },
  {
    id: '2',
    vendorName: 'Sugar Rush Cakes',
    vendorCategory: 'Cake',
    vendorImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200',
    submittedDate: '2025-01-11',
    status: 'responded',
    message: 'Need a 5-tier wedding cake for 200 guests.',
    response: 'Thank you for reaching out! We would love to create your dream cake. Available for a tasting on Jan 25th.'
  }
];

export default function MyVendors() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [bookedVendors, setBookedVendors] = useState<BookedVendor[]>(mockBookedVendors);
  const [inquiries] = useState<Inquiry[]>(mockInquiries);
  
  // Rating dialog state
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<BookedVendor | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [ratingReview, setRatingReview] = useState('');
  
  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'responded':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'declined':
      case 'completed':
        return '#8a8a8a';
      default:
        return '#8a8a8a';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'responded':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'pending':
        return <HourglassEmpty sx={{ fontSize: 16 }} />;
      case 'declined':
        return <Cancel sx={{ fontSize: 16 }} />;
      default:
        return <CheckCircle sx={{ fontSize: 16 }} />;
    }
  };

  const handleOpenRating = (vendor: BookedVendor) => {
    setSelectedVendor(vendor);
    setRatingValue(5);
    setRatingReview('');
    setRatingDialogOpen(true);
  };

  const handleSubmitRating = () => {
    if (selectedVendor) {
      setBookedVendors(prev =>
        prev.map(v =>
          v.id === selectedVendor.id
            ? { ...v, hasRated: true, userRating: ratingValue }
            : v
        )
      );
      setSnackbarMessage(`Thank you for rating ${selectedVendor.name}!`);
      setSnackbarOpen(true);
      setRatingDialogOpen(false);
    }
  };

  const totalBooked = bookedVendors.length;
  const totalSpent = bookedVendors.reduce((sum, v) => sum + v.depositPaid, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9' }}>
      <Nav />
      
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: '#002528',
            mb: 1
          }}>
            My Vendors
          </Typography>
          <Typography sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            color: '#666'
          }}>
            Manage your bookings and track vendor communications
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 4 }}>
          <Card sx={{ p: 3, border: '0.25px solid #00838F' }}>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
              Booked Vendors
            </Typography>
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#002528'
            }}>
              {totalBooked}
            </Typography>
          </Card>
          <Card sx={{ p: 3, border: '0.25px solid #00838F' }}>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
              Deposit Paid
            </Typography>
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#00838F'
            }}>
              {formatPrice(totalSpent)}
            </Typography>
          </Card>
          <Card sx={{ p: 3, border: '0.25px solid #00838F' }}>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
              Pending Inquiries
            </Typography>
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#f59e0b'
            }}>
              {inquiries.filter(i => i.status === 'pending').length}
            </Typography>
          </Card>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: '#e0e0e0', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'none',
                color: '#8a8a8a',
                '&.Mui-selected': { color: '#00838F' }
              },
              '& .MuiTabs-indicator': { backgroundColor: '#00838F' }
            }}
          >
            <Tab label={`Booked (${bookedVendors.length})`} />
            <Tab label={`Inquiries (${inquiries.length})`} />
          </Tabs>
        </Box>

        {/* Booked Vendors Tab */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {bookedVendors.length === 0 ? (
              <Card sx={{ p: 6, textAlign: 'center', border: '0.25px solid #00838F' }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: '#666', mb: 2 }}>
                  No vendors booked yet
                </Typography>
                <Button
                  onClick={() => navigate('/couple/search-results')}
                  sx={{
                    backgroundColor: '#00838F',
                    color: 'white',
                    fontFamily: "'Open Sans', sans-serif",
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#006d75' }
                  }}
                >
                  Find Vendors
                </Button>
              </Card>
            ) : (
              bookedVendors.map((vendor) => (
                <Card key={vendor.id} sx={{ p: 3, border: '0.25px solid #00838F' }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Avatar
                      src={vendor.image}
                      variant="rounded"
                      sx={{ width: 100, height: 100 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: 18,
                            color: '#002528'
                          }}>
                            {vendor.name}
                          </Typography>
                          <Typography sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontSize: 13,
                            color: '#666'
                          }}>
                            {vendor.category}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStatusIcon(vendor.status)}
                          label={vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(vendor.status)}20`,
                            color: getStatusColor(vendor.status),
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn sx={{ fontSize: 16, color: '#00838F' }} />
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                            {vendor.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarMonth sx={{ fontSize: 16, color: '#00838F' }} />
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                            Event: {formatDate(vendor.eventDate)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                          <Box>
                            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                              Total Price
                            </Typography>
                            <Typography sx={{
                              fontFamily: "'Open Sans', sans-serif",
                              fontWeight: 700,
                              fontSize: 16,
                              color: '#002528'
                            }}>
                              {formatPrice(vendor.price)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                              Deposit Paid
                            </Typography>
                            <Typography sx={{
                              fontFamily: "'Open Sans', sans-serif",
                              fontWeight: 700,
                              fontSize: 16,
                              color: '#22c55e'
                            }}>
                              {formatPrice(vendor.depositPaid)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                              Balance Due
                            </Typography>
                            <Typography sx={{
                              fontFamily: "'Open Sans', sans-serif",
                              fontWeight: 700,
                              fontSize: 16,
                              color: '#f59e0b'
                            }}>
                              {formatPrice(vendor.price - vendor.depositPaid)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            startIcon={<MessageOutlined />}
                            onClick={() => navigate('/couple/messages')}
                            sx={{
                              fontFamily: "'Open Sans', sans-serif",
                              textTransform: 'none',
                              color: '#00838F',
                              borderColor: '#00838F',
                              border: '1px solid',
                              '&:hover': { backgroundColor: '#f0fdfa' }
                            }}
                          >
                            Message
                          </Button>
                          {!vendor.hasRated ? (
                            <Button
                              startIcon={<StarOutline />}
                              onClick={() => handleOpenRating(vendor)}
                              sx={{
                                fontFamily: "'Open Sans', sans-serif",
                                textTransform: 'none',
                                backgroundColor: '#00838F',
                                color: 'white',
                                '&:hover': { backgroundColor: '#006d75' }
                              }}
                            >
                              Rate Vendor
                            </Button>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Rating value={vendor.userRating} readOnly size="small" />
                              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                                Rated
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* Inquiries Tab */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {inquiries.length === 0 ? (
              <Card sx={{ p: 6, textAlign: 'center', border: '0.25px solid #00838F' }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: '#666', mb: 2 }}>
                  No inquiries sent yet
                </Typography>
                <Button
                  onClick={() => navigate('/couple/search-results')}
                  sx={{
                    backgroundColor: '#00838F',
                    color: 'white',
                    fontFamily: "'Open Sans', sans-serif",
                    textTransform: 'none'
                  }}
                >
                  Browse Vendors
                </Button>
              </Card>
            ) : (
              inquiries.map((inquiry) => (
                <Card key={inquiry.id} sx={{ p: 3, border: '0.25px solid #00838F' }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Avatar
                      src={inquiry.vendorImage}
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: 16,
                            color: '#002528'
                          }}>
                            {inquiry.vendorName}
                          </Typography>
                          <Typography sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontSize: 12,
                            color: '#666'
                          }}>
                            {inquiry.vendorCategory} • Sent {formatDate(inquiry.submittedDate)}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStatusIcon(inquiry.status)}
                          label={inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(inquiry.status)}20`,
                            color: getStatusColor(inquiry.status),
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      
                      <Box sx={{
                        p: 2,
                        backgroundColor: '#f9fafb',
                        borderRadius: 1,
                        mb: inquiry.response ? 2 : 0
                      }}>
                        <Typography sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: 13,
                          color: '#444'
                        }}>
                          <strong>Your message:</strong> {inquiry.message}
                        </Typography>
                      </Box>
                      
                      {inquiry.response && (
                        <Box sx={{
                          p: 2,
                          backgroundColor: '#f0fdfa',
                          borderRadius: 1,
                          borderLeft: '3px solid #00838F'
                        }}>
                          <Typography sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontSize: 13,
                            color: '#00838F'
                          }}>
                            <strong>Vendor response:</strong> {inquiry.response}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>

      {/* Rating Dialog */}
      <Dialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
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
          Rate {selectedVendor?.name}
          <IconButton onClick={() => setRatingDialogOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              color: '#666',
              mb: 2
            }}>
              How was your experience with this vendor?
            </Typography>
            <Rating
              value={ratingValue}
              onChange={(_, newValue) => setRatingValue(newValue || 5)}
              size="large"
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Write a review (optional)"
              placeholder="Share your experience to help other couples..."
              value={ratingReview}
              onChange={(e) => setRatingReview(e.target.value)}
              sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setRatingDialogOpen(false)}
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              textTransform: 'none',
              color: '#666'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRating}
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
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ fontFamily: "'Open Sans', sans-serif" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
</Box>
  );
}
