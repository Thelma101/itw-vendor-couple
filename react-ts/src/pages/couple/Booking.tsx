import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Avatar,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentIcon from '@mui/icons-material/Payment';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useShortlist } from '../../contexts/ShortlistContext';
import { useNotifications } from '../../contexts/NotificationContext';

const steps = ['Review Vendors', 'Event Details', 'Payment', 'Confirmation'];

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearShortlist } = useShortlist();
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
    <Box sx={{ backgroundColor: '#FFF6F9', minHeight: '100vh' }}>
      <Nav />
      
      {/* Header */}
      <Box sx={{ px: 4, py: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: '#002528',
            textTransform: 'none',
            mb: 2
          }}
        >
          Back
        </Button>

        <Typography sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: 28,
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
      <Box sx={{ px: 4, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 12
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
      <Box sx={{ px: 4, pb: 4, display: 'flex', gap: 3 }}>
        
        {/* Left Column - Step Content */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ border: '0.25px solid #00838F', p: 3 }}>
            
            {/* Step 0: Review Vendors */}
            {activeStep === 0 && (
              <>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#002528',
                  mb: 3
                }}>
                  Selected Vendors ({items.length})
                </Typography>
                
                {items.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', mb: 2 }}>
                      No vendors in your shortlist
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
                      Browse Vendors
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          backgroundColor: '#f9fafb',
                          borderRadius: 2
                        }}
                      >
                        <Avatar
                          src={item.image}
                          variant="rounded"
                          sx={{ width: 60, height: 60 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: 14,
                            color: '#002528'
                          }}>
                            {item.name}
                          </Typography>
                          <Typography sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontSize: 12,
                            color: '#666'
                          }}>
                            {item.category}
                          </Typography>
                        </Box>
                        <Typography sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: 16,
                          color: '#00838F'
                        }}>
                          {formatPrice(item.price)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}

            {/* Step 1: Event Details */}
            {activeStep === 1 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CalendarMonthIcon sx={{ color: '#00838F' }} />
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#002528'
                  }}>
                    Service Delivery Details
                  </Typography>
                </Box>
                
                {/* Required: Service Delivery */}
                <Box sx={{
                  p: 2,
                  backgroundColor: '#f0fdfa',
                  borderRadius: 2,
                  border: '1px solid #00838F',
                  mb: 3
                }}>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#002528',
                    mb: 2
                  }}>
                    When do you need the service? *
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <TextField
                      label="Service Date"
                      type="date"
                      fullWidth
                      required
                      value={formData.serviceDate}
                      onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white' } }}
                    />
                    <TextField
                      label="Service Time"
                      type="time"
                      fullWidth
                      required
                      value={formData.serviceTime}
                      onChange={(e) => setFormData({ ...formData, serviceTime: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white' } }}
                    />
                  </Box>
                </Box>

                {/* Optional: Wedding Details */}
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#666',
                  mb: 2
                }}>
                  Wedding Details (Optional)
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <TextField
                    label="Wedding Date"
                    type="date"
                    fullWidth
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                    helperText="If different from service date"
                  />
                  <TextField
                    label="Expected Guests"
                    type="number"
                    fullWidth
                    placeholder="e.g., 200"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Ceremony Time"
                    type="time"
                    fullWidth
                    value={formData.ceremonyTime}
                    onChange={(e) => setFormData({ ...formData, ceremonyTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Reception Time"
                    type="time"
                    fullWidth
                    value={formData.receptionTime}
                    onChange={(e) => setFormData({ ...formData, receptionTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                </Box>
                
                <TextField
                  label="Venue Address"
                  fullWidth
                  placeholder="Enter event venue address"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  sx={{ mt: 2, '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                />
                
                <TextField
                  label="Special Requests"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Any special requirements or notes for the vendors..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  sx={{ mt: 2, '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                />
              </>
            )}

            {/* Step 2: Payment */}
            {activeStep === 2 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PaymentIcon sx={{ color: '#00838F' }} />
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#002528'
                  }}>
                    Secure Payment
                  </Typography>
                </Box>
                
                <Box sx={{
                  p: 2,
                  backgroundColor: '#f0fdf4',
                  borderRadius: 2,
                  border: '1px solid #22c55e',
                  mb: 3
                }}>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    color: '#166534'
                  }}>
                    💡 You only need to pay 30% deposit now. The remaining balance will be due 7 days before your event.
                  </Typography>
                </Box>

                {/* Platform Protection Notice */}
                <Box sx={{
                  p: 2,
                  backgroundColor: '#fef3c7',
                  borderRadius: 2,
                  border: '1px solid #f59e0b',
                  mb: 3
                }}>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#92400e',
                    mb: 1
                  }}>
                    🛡️ Platform Protection
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: '#92400e'
                  }}>
                    All payments are processed securely through our platform. This protects both you and the vendor with our satisfaction guarantee, dispute resolution, and refund protection.
                  </Typography>
                </Box>

                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#002528',
                  mb: 2
                }}>
                  Select Payment Gateway
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  {/* Paystack */}
                  <Box
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paystack' })}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: formData.paymentMethod === 'paystack' ? '#00838F' : '#e0e0e0',
                      backgroundColor: formData.paymentMethod === 'paystack' ? '#f0fdfa' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#00838F' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 48, height: 48, borderRadius: 2, 
                          backgroundColor: '#00C3F7', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 14 }}>PS</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528' }}>
                            Paystack
                          </Typography>
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                            Cards, Bank Transfer, USSD, Mobile Money
                          </Typography>
                        </Box>
                      </Box>
                      {formData.paymentMethod === 'paystack' && (
                        <CheckCircleIcon sx={{ color: '#00838F' }} />
                      )}
                    </Box>
                  </Box>

                  {/* Flutterwave */}
                  <Box
                    onClick={() => setFormData({ ...formData, paymentMethod: 'flutterwave' })}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: formData.paymentMethod === 'flutterwave' ? '#00838F' : '#e0e0e0',
                      backgroundColor: formData.paymentMethod === 'flutterwave' ? '#f0fdfa' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#00838F' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 48, height: 48, borderRadius: 2, 
                          backgroundColor: '#F5A623', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 14 }}>FW</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528' }}>
                            Flutterwave
                          </Typography>
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                            Cards, Bank Transfer, Barter, Mobile Money
                          </Typography>
                        </Box>
                      </Box>
                      {formData.paymentMethod === 'flutterwave' && (
                        <CheckCircleIcon sx={{ color: '#00838F' }} />
                      )}
                    </Box>
                  </Box>

                  {/* Stripe */}
                  <Box
                    onClick={() => setFormData({ ...formData, paymentMethod: 'stripe' })}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: formData.paymentMethod === 'stripe' ? '#00838F' : '#e0e0e0',
                      backgroundColor: formData.paymentMethod === 'stripe' ? '#f0fdfa' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#00838F' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 48, height: 48, borderRadius: 2, 
                          backgroundColor: '#635BFF', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 14 }}>S</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528' }}>
                            Stripe
                          </Typography>
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                            Cards, Apple Pay, Google Pay
                          </Typography>
                        </Box>
                      </Box>
                      {formData.paymentMethod === 'stripe' && (
                        <CheckCircleIcon sx={{ color: '#00838F' }} />
                      )}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#f8fafc', 
                  borderRadius: 2, 
                  border: '1px solid #e2e8f0',
                  mb: 2
                }}>
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                    🔒 Your payment is secured with industry-standard encryption. You'll be redirected to {formData.paymentMethod === 'paystack' ? 'Paystack' : formData.paymentMethod === 'flutterwave' ? 'Flutterwave' : 'Stripe'}'s secure checkout to complete payment.
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      sx={{ color: '#00838F', '&.Mui-checked': { color: '#00838F' } }}
                    />
                  }
                  label={
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13 }}>
                      I agree to the Terms of Service, Cancellation Policy, and understand that all transactions must go through the platform
                    </Typography>
                  }
                  sx={{ mt: 1 }}
                />
              </>
            )}

            {/* Step 3: Confirmation */}
            {activeStep === 3 && (
              <>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#22c55e', mb: 2 }} />
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 24,
                    color: '#002528',
                    mb: 1
                  }}>
                    Review Your Booking
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    color: '#666'
                  }}>
                    Please review the details before confirming
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {/* Event Details Section */}
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#00838F',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}>
                  Service Delivery Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
                      Service Date
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
                      {formData.serviceDate ? new Date(formData.serviceDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not set'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
                      Service Time
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
                      {formData.serviceTime || 'Not set'}
                    </Typography>
                  </Box>
                  {formData.weddingDate && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
                        Wedding Date
                      </Typography>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
                        {new Date(formData.weddingDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  )}
                  {formData.ceremonyTime && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
                        Ceremony Time
                      </Typography>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
                        {formData.ceremonyTime}
                      </Typography>
                    </Box>
                  )}
                  {formData.receptionTime && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
                        Reception Time
                      </Typography>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
                        {formData.receptionTime}
                      </Typography>
                    </Box>
                  )}
                  {formData.guestCount && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
                        Expected Guests
                      </Typography>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
                        {formData.guestCount}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
                      Venue
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14, maxWidth: '60%', textAlign: 'right' }}>
                      {formData.venue || 'Not set'}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Vendors Section */}
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#00838F',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}>
                  Vendors ({items.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                  {items.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={item.image} sx={{ width: 32, height: 32 }} />
                        <Box>
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                            {item.category}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
                        {formatPrice(item.price)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Payment Section */}
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#00838F',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}>
                  Payment Summary
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
                      Payment Method
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>
                      {formData.paymentMethod === 'paystack' ? 'Paystack' : 
                       formData.paymentMethod === 'flutterwave' ? 'Flutterwave' : 'Stripe'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
                      Total Amount
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
                      {formatPrice(totalPrice * 1.05)}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: '#f0fdfa',
                    borderRadius: 2,
                    mt: 1
                  }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16 }}>
                      Deposit Due Now
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18, color: '#00838F' }}>
                      {formatPrice(depositAmount * 1.05)}
                    </Typography>
                  </Box>
                </Box>

                {formData.specialRequests && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: '#00838F',
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}>
                      Special Requests
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666', fontStyle: 'italic' }}>
                      "{formData.specialRequests}"
                    </Typography>
                  </>
                )}
              </>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
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
                  minWidth: 180,
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
        <Box sx={{ width: 350 }}>
          <Card sx={{ border: '0.25px solid #00838F', p: 3, position: 'sticky', top: 20 }}>
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: '#002528',
              mb: 3
            }}>
              Order Summary
            </Typography>
            
            {items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
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
                  color: '#002528'
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#166534' }}>
                  Due Now (30%)
                </Typography>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 20,
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

      <Footer />
    </Box>
  );
};

export default Booking;
