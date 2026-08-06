import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackButton from '@/shared/components/BackButton';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Nav from '@/couple/components/Nav';
import { useShortlist } from '@/shared/contexts/ShortlistContext';
import { useNotifications } from '@/shared/contexts/NotificationContext';
import BookingStep0 from '@/couple/components/booking/BookingStep0';
import BookingStep1 from '@/couple/components/booking/BookingStep1';
import BookingStep2 from '@/couple/components/booking/BookingStep2';
import BookingStep3 from '@/couple/components/booking/BookingStep3';
import { mockVendors } from '@/shared/data/mockVendors';

const steps = ['Review Vendors', 'Event Details', 'Payment', 'Confirmation'];

const parsePrice = (value: string | number) => {
  if (typeof value === 'number') return value;
  return Number.parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
};

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items: shortlistItems, clearShortlist, addToShortlist, isInShortlist } = useShortlist();
  const { addNotification } = useNotifications();
  
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [formData, setFormData] = useState({
    serviceDate: '',
    serviceTime: '',
    weddingDate: '',
    ceremonyTime: '',
    receptionTime: '',
    guestCount: '',
    venue: '',
    specialRequests: '',
    agreeTerms: false,
    paymentMethod: 'paystack'
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Hydrate shortlist from ?vendorId= so Book now works without prior shortlist
  useEffect(() => {
    const vendorId = searchParams.get('vendorId');
    if (!vendorId || isInShortlist(vendorId)) return;
    const fromMock = mockVendors.find((v) => v.id === vendorId);
    const name = searchParams.get('vendorName') || fromMock?.name || 'Selected vendor';
    const price = fromMock ? parsePrice(fromMock.price) : 150000;
    addToShortlist({
      id: vendorId,
      name,
      price,
      category: fromMock?.category || 'Vendor',
      image: fromMock?.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    });
  }, [searchParams, addToShortlist, isInShortlist]);

  const queryVendorId = searchParams.get('vendorId');
  const items = useMemo(() => {
    if (queryVendorId) {
      const match = shortlistItems.filter((i) => i.id === queryVendorId);
      if (match.length) return match;
    }
    return shortlistItems;
  }, [shortlistItems, queryVendorId]);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const depositAmount = totalPrice * 0.3; // 30% deposit

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const generateBookingRef = () => {
    return 'ITW-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final confirmation - process payment
      setIsProcessing(true);
      const ref = generateBookingRef();
      setBookingRef(ref);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        
        // Add notification for successful booking
        addNotification({
          type: 'booking',
          title: 'Booking Confirmed!',
          message: `Your booking ${ref} has been confirmed. ${items.length} vendors have been notified.`,
          link: '/couple/my-vendors'
        });
        
        // Add notification for each vendor
        items.forEach(item => {
          addNotification({
            type: 'message',
            title: `${item.name} notified`,
            message: 'Vendor will contact you within 24 hours to discuss details.',
            avatar: item.image
          });
        });
      }, 2500);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleConfirmBooking = () => {
    clearShortlist();
    navigate('/couple/my-vendors');
  };

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return items.length === 0;
      case 1:
        return !formData.serviceDate || !formData.serviceTime; // Only service date and time are required
      case 2:
        return !formData.agreeTerms;
      default:
        return false;
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />
      
      {/* Header */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <BackButton fallbackPath="/couple/shortlist" sx={{ mb: 2 }} />

        <Typography sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: { xs: 22, md: 28 },
          color: '#002528',
          mb: 1
        }}>
          Complete Your Booking
        </Typography>
        
        <Typography sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: 14,
          color: '#666'
        }}>
          Secure your wedding vendors with a 30% deposit
        </Typography>
      </Box>

      {/* Stepper */}
      <Box sx={{ px: { xs: 1, md: 4 }, mb: 3, overflowX: 'auto' }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ minWidth: { xs: 320, sm: 'auto' } }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: { xs: 10, sm: 12 }
                  },
                  '& .Mui-active': {
                    color: '#00838F !important'
                  },
                  '& .Mui-completed': {
                    color: '#22c55e !important'
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

        {/* Main Content */}
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            pb: { xs: 10, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            minWidth: 0,
          }}
        >
          
          {/* Left Column - Step Content */}
          <Box sx={{ flex: 1, minWidth: 0, order: { xs: 2, md: 1 } }}>
            <Card sx={{ border: '0.25px solid #00838F', p: { xs: 2, md: 3 } }}>
              {activeStep === 0 && <BookingStep0 items={items} onNext={() => setActiveStep(1)} />}
              {activeStep === 1 && (
                <BookingStep1
                  formData={formData}
                  onFormChange={(field: string, value: string) => setFormData({ ...formData, [field]: value })}
                  onNext={() => setActiveStep(2)}
                  isNextDisabled={!formData.serviceDate || !formData.venue}
                />
              )}
              {activeStep === 2 && (
                <BookingStep2
                  formData={formData}
                  onFormChange={(field: string, value: any) => setFormData({ ...formData, [field]: value })}
                  onNext={() => setActiveStep(3)}
                  totalPrice={totalPrice}
                  depositAmount={depositAmount}
                />
              )}
              {activeStep === 3 && (
                <BookingStep3
                  formData={formData}
                  items={items}
                  totalPrice={totalPrice}
                  depositAmount={depositAmount}
                />
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  disabled={activeStep === 0 || isProcessing}
                  onClick={handleBack}
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    textTransform: 'none',
                    color: '#666'
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isNextDisabled() || isProcessing}
                  sx={{
                    background: 'linear-gradient(229.87deg, #EB1948 65.18%, #B52344 232.03%)',
                    color: 'white',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 4,
                    minWidth: { xs: 140, sm: 180 },
                    flex: { xs: 1, sm: 'none' },
                    '&:hover': { opacity: 0.9 },
                    '&:disabled': { backgroundColor: '#ccc', color: '#999' }
                  }}
                >
                  {isProcessing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={18} sx={{ color: 'white' }} />
                      <span>Processing...</span>
                    </Box>
                  ) : activeStep === steps.length - 1 ? 'Confirm & Pay' : 'Continue'}
                </Button>
              </Box>
            </Card>
          </Box>

        {/* Right Column - Order Summary */}
        <Box sx={{ width: { xs: '100%', md: 350 }, flexShrink: 0, order: { xs: 1, md: 2 } }}>
          <Card sx={{ border: '0.25px solid #00838F', p: { xs: 2, md: 3 }, position: { xs: 'static', md: 'sticky' }, top: 20 }}>
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: '#002528',
              mb: 3
            }}>
              Order Summary
            </Typography>
            
            {items.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: '#666', mb: 2 }}>
                No vendors in this booking yet. Add one from search or shortlist.
              </Typography>
            ) : null}

            {items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 13,
                  color: '#444',
                  maxWidth: '60%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.name}
                </Typography>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#002528',
                  flexShrink: 0
                }}>
                  {formatPrice(item.price)}
                </Typography>
              </Box>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>
                Subtotal
              </Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
                {formatPrice(totalPrice)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>
                Platform Fee (5%)
              </Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
                {formatPrice(totalPrice * 0.05)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>
                Total
              </Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#002528' }}>
                {formatPrice(totalPrice * 1.05)}
              </Typography>
            </Box>
            
            <Box sx={{
              mt: 3,
              p: 2,
              backgroundColor: '#f0fdfa',
              borderRadius: 2
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#166534' }}>
                  Due Now (30%)
                </Typography>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: { xs: 18, md: 20 },
                  fontWeight: 700,
                  color: '#00838F'
                }}>
                  {formatPrice(depositAmount * 1.05)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 5 }}>
          <CelebrationIcon sx={{ fontSize: 80, color: '#22c55e', mb: 2 }} />
          <Typography sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            fontSize: 28,
            color: '#002528',
            mb: 1
          }}>
            Booking Confirmed! 🎉
          </Typography>
          <Typography sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 16,
            color: '#666',
            mb: 2
          }}>
            Your wedding vendors have been successfully booked!
          </Typography>
          
          <Box sx={{
            p: 2,
            backgroundColor: '#f0fdfa',
            borderRadius: 2,
            mb: 3,
            display: 'inline-block'
          }}>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mb: 0.5 }}>
              Booking Reference
            </Typography>
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: '#00838F',
              letterSpacing: 2
            }}>
              {bookingRef}
            </Typography>
          </Box>
          
          <Typography sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            color: '#444',
            mb: 2
          }}>
            Confirmation emails have been sent to you and all {items.length} vendors.
          </Typography>
          
          <Box sx={{
            p: 2,
            backgroundColor: '#fffbeb',
            borderRadius: 2,
            mb: 4,
            textAlign: 'left'
          }}>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#92400e', mb: 1 }}>
              What's Next?
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#92400e' }}>
              • Vendors will contact you within 24 hours<br/>
              • Check your messages for vendor communications<br/>
              • Remaining balance due 7 days before your wedding
            </Typography>
          </Box>
          
          <Button
            onClick={handleConfirmBooking}
            sx={{
              background: 'linear-gradient(229.87deg, #EB1948 65.18%, #B52344 232.03%)',
              color: 'white',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              '&:hover': { opacity: 0.9 }
            }}
          >
            View My Bookings
          </Button>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Booking confirmed!
        </Alert>
      </Snackbar>
</Box>
  );
};

export default Booking;
