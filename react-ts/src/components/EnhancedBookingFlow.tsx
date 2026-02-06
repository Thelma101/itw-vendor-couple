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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Payment,
  CheckCircle,
  Receipt,
  CalendarMonth,
  LocationOn,
  Phone,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';

interface EnhancedBookingFlowProps {
  vendor: {
    id: string;
    name: string;
    category: string;
    image: string;
    price: number;
    location: string;
  };
  onComplete?: (bookingData: BookingData) => void;
}

interface BookingData {
  eventDetails: {
    date: string;
    time: string;
    venue: string;
    guestCount: string;
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    alternativeContact?: string;
  };
  payment: {
    method: 'paystack' | 'flutterwave' | 'bank-transfer';
    amount: number;
    depositPaid: boolean;
  };
  specialRequests: string;
}

const steps = ['Event Details', 'Contact Information', 'Payment', 'Confirmation'];

export default function EnhancedBookingFlow({ vendor, onComplete }: EnhancedBookingFlowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  
  const [bookingData, setBookingData] = useState<BookingData>({
    eventDetails: {
      date: '',
      time: '',
      venue: '',
      guestCount: '',
    },
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      alternativeContact: '',
    },
    payment: {
      method: 'paystack',
      amount: vendor.price * 0.3, // 30% deposit
      depositPaid: false,
    },
    specialRequests: '',
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final step - process booking
      processBooking();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const processBooking = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const ref = `ITW-${Date.now().toString(36).toUpperCase()}`;
      setBookingReference(ref);
      setBookingComplete(true);
      setLoading(false);
      
      if (onComplete) {
        onComplete({ ...bookingData, payment: { ...bookingData.payment, depositPaid: true } });
      }
    }, 2500);
  };

  const updateEventDetails = (field: keyof BookingData['eventDetails'], value: string) => {
    setBookingData(prev => ({
      ...prev,
      eventDetails: { ...prev.eventDetails, [field]: value },
    }));
  };

  const updateContactInfo = (field: keyof BookingData['contactInfo'], value: string) => {
    setBookingData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value },
    }));
  };

  const updatePayment = (field: keyof BookingData['payment'], value: string | number | boolean) => {
    setBookingData(prev => ({
      ...prev,
      payment: { ...prev.payment, [field]: value },
    }));
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return bookingData.eventDetails.date && bookingData.eventDetails.time;
      case 1:
        return bookingData.contactInfo.name && bookingData.contactInfo.email && bookingData.contactInfo.phone;
      case 2:
        return bookingData.payment.method;
      default:
        return true;
    }
  };

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  if (bookingComplete) {
    return (
      <Dialog open={bookingComplete} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
          <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 3 }} />
          <Typography sx={{ fontWeight: 700, fontSize: 24, mb: 2 }}>
            Booking Confirmed!
          </Typography>
          <Typography sx={{ fontSize: 16, color: '#666', mb: 3 }}>
            Your booking reference: <strong>{bookingReference}</strong>
          </Typography>
          
          <Card sx={{ p: 3, bgcolor: '#FFF6F9', mb: 3 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 2 }}>
              Booking Summary
            </Typography>
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={vendor.image} />
                </ListItemAvatar>
                <ListItemText
                  primary={vendor.name}
                  secondary={vendor.category}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Event Date"
                  secondary={new Date(bookingData.eventDetails.date).toLocaleDateString('en-GB', { 
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Time"
                  secondary={bookingData.eventDetails.time}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Deposit Paid"
                  secondary={formatPrice(bookingData.payment.amount)}
                />
              </ListItem>
            </List>
          </Card>

          <Alert severity="info" sx={{ mb: 3 }}>
            A confirmation email has been sent to {bookingData.contactInfo.email}. 
            The vendor will contact you within 24 hours.
          </Alert>

          <Button
            variant="contained"
            onClick={() => window.location.href = '/couple/my-vendors'}
            sx={{
              bgcolor: '#00838F',
              textTransform: 'none',
              px: 4,
              '&:hover': { bgcolor: '#006064' },
            }}
          >
            View My Vendors
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Box>
      {/* Vendor Summary Card */}
      <Card sx={{ p: 3, mb: 4, border: '1px solid #CCFDF2', boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box
            component="img"
            src={vendor.image}
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              objectFit: 'cover',
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 1 }}>
              {vendor.name}
            </Typography>
            <Chip label={vendor.category} size="small" sx={{ mb: 1 }} />
            <Typography sx={{ fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <LocationOn sx={{ fontSize: 16 }} /> {vendor.location}
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#00838F' }}>
              {formatPrice(vendor.price)}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Stepper */}
      <Card sx={{ p: 3, mb: 4, border: '1px solid #CCFDF2', boxShadow: 'none' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                  },
                  '& .Mui-active': {
                    color: '#00838F !important',
                  },
                  '& .Mui-completed': {
                    color: '#4CAF50 !important',
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      {/* Step Content */}
      <Card sx={{ p: 4, border: '1px solid #CCFDF2', boxShadow: 'none', minHeight: 400 }}>
        {/* Step 0: Event Details */}
        {activeStep === 0 && (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 3 }}>
              Event Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                type="date"
                label="Event Date"
                value={bookingData.eventDetails.date}
                onChange={(e) => updateEventDetails('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
              
              <TextField
                type="time"
                label="Event Time"
                value={bookingData.eventDetails.time}
                onChange={(e) => updateEventDetails('time', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              
              <TextField
                label="Venue/Location"
                value={bookingData.eventDetails.venue}
                onChange={(e) => updateEventDetails('venue', e.target.value)}
                placeholder="Enter venue name or address"
                fullWidth
              />
              
              <TextField
                type="number"
                label="Expected Guest Count"
                value={bookingData.eventDetails.guestCount}
                onChange={(e) => updateEventDetails('guestCount', e.target.value)}
                placeholder="e.g. 200"
                fullWidth
              />

              <TextField
                label="Special Requests or Questions"
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any specific requirements..."
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </Box>
        )}

        {/* Step 1: Contact Information */}
        {activeStep === 1 && (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 3 }}>
              Contact Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Full Name"
                value={bookingData.contactInfo.name}
                onChange={(e) => updateContactInfo('name', e.target.value)}
                placeholder="Enter your full name"
                fullWidth
                required
              />
              
              <TextField
                type="email"
                label="Email Address"
                value={bookingData.contactInfo.email}
                onChange={(e) => updateContactInfo('email', e.target.value)}
                placeholder="your.email@example.com"
                fullWidth
                required
              />
              
              <TextField
                type="tel"
                label="Phone Number"
                value={bookingData.contactInfo.phone}
                onChange={(e) => updateContactInfo('phone', e.target.value)}
                placeholder="+234 XXX XXX XXXX"
                fullWidth
                required
              />
              
              <TextField
                type="tel"
                label="Alternative Contact (Optional)"
                value={bookingData.contactInfo.alternativeContact}
                onChange={(e) => updateContactInfo('alternativeContact', e.target.value)}
                placeholder="Backup phone number"
                fullWidth
              />

              <Alert severity="info">
                The vendor will use this information to contact you regarding your booking.
              </Alert>
            </Box>
          </Box>
        )}

        {/* Step 2: Payment */}
        {activeStep === 2 && (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 2 }}>
              Payment Method
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              A deposit of {formatPrice(bookingData.payment.amount)} (30% of total) is required to secure your booking.
            </Alert>

            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                Select Payment Method
              </FormLabel>
              <RadioGroup
                value={bookingData.payment.method}
                onChange={(e) => updatePayment('method', e.target.value)}
              >
                <Card sx={{ p: 2, mb: 2, border: bookingData.payment.method === 'paystack' ? '2px solid #00838F' : '1px solid #ddd' }}>
                  <FormControlLabel
                    value="paystack"
                    control={<Radio sx={{ color: '#00838F', '&.Mui-checked': { color: '#00838F' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Payment />
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>Paystack</Typography>
                          <Typography sx={{ fontSize: 12, color: '#666' }}>
                            Pay with card, bank transfer, or USSD
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Card>

                <Card sx={{ p: 2, mb: 2, border: bookingData.payment.method === 'flutterwave' ? '2px solid #00838F' : '1px solid #ddd' }}>
                  <FormControlLabel
                    value="flutterwave"
                    control={<Radio sx={{ color: '#00838F', '&.Mui-checked': { color: '#00838F' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Payment />
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>Flutterwave</Typography>
                          <Typography sx={{ fontSize: 12, color: '#666' }}>
                            Secure payment with Flutterwave
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Card>

                <Card sx={{ p: 2, border: bookingData.payment.method === 'bank-transfer' ? '2px solid #00838F' : '1px solid #ddd' }}>
                  <FormControlLabel
                    value="bank-transfer"
                    control={<Radio sx={{ color: '#00838F', '&.Mui-checked': { color: '#00838F' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Receipt />
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>Bank Transfer</Typography>
                          <Typography sx={{ fontSize: 12, color: '#666' }}>
                            Manual bank transfer (requires verification)
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Card>
              </RadioGroup>
            </FormControl>

            <Card sx={{ p: 3, mt: 3, bgcolor: '#FFF6F9' }}>
              <Typography sx={{ fontWeight: 600, mb: 2 }}>
                Payment Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Full Amount:</Typography>
                <Typography>{formatPrice(vendor.price)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Deposit (30%):</Typography>
                <Typography sx={{ fontWeight: 600, color: '#00838F' }}>
                  {formatPrice(bookingData.payment.amount)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 600 }}>Balance Due:</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {formatPrice(vendor.price - bookingData.payment.amount)}
                </Typography>
              </Box>
            </Card>
          </Box>
        )}

        {/* Step 3: Confirmation */}
        {activeStep === 3 && (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 3 }}>
              Review & Confirm
            </Typography>

            <Card sx={{ p: 3, mb: 3, bgcolor: '#FFF6F9' }}>
              <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth /> Event Details
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography sx={{ fontSize: 14, mb: 1 }}>
                  <strong>Date:</strong> {new Date(bookingData.eventDetails.date).toLocaleDateString('en-GB', { 
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 1 }}>
                  <strong>Time:</strong> {bookingData.eventDetails.time}
                </Typography>
                {bookingData.eventDetails.venue && (
                  <Typography sx={{ fontSize: 14, mb: 1 }}>
                    <strong>Venue:</strong> {bookingData.eventDetails.venue}
                  </Typography>
                )}
                {bookingData.eventDetails.guestCount && (
                  <Typography sx={{ fontSize: 14 }}>
                    <strong>Guests:</strong> {bookingData.eventDetails.guestCount}
                  </Typography>
                )}
              </Box>
            </Card>

            <Card sx={{ p: 3, mb: 3, bgcolor: '#FFF6F9' }}>
              <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone /> Contact Information
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography sx={{ fontSize: 14, mb: 1 }}>
                  <strong>Name:</strong> {bookingData.contactInfo.name}
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 1 }}>
                  <strong>Email:</strong> {bookingData.contactInfo.email}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  <strong>Phone:</strong> {bookingData.contactInfo.phone}
                </Typography>
              </Box>
            </Card>

            <Card sx={{ p: 3, mb: 3, bgcolor: '#FFF6F9' }}>
              <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Payment /> Payment
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography sx={{ fontSize: 14, mb: 1 }}>
                  <strong>Method:</strong> {bookingData.payment.method.replace('-', ' ').toUpperCase()}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  <strong>Amount:</strong> {formatPrice(bookingData.payment.amount)}
                </Typography>
              </Box>
            </Card>

            {bookingData.specialRequests && (
              <Card sx={{ p: 3, bgcolor: '#FFF6F9' }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  Special Requests:
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#666' }}>
                  {bookingData.specialRequests}
                </Typography>
              </Card>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
                <CircularProgress size={24} sx={{ color: '#00838F' }} />
                <Typography>Processing payment...</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            startIcon={<ArrowBack />}
            sx={{ textTransform: 'none' }}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
            sx={{
              bgcolor: '#00838F',
              textTransform: 'none',
              px: 4,
              '&:hover': { bgcolor: '#006064' },
            }}
          >
            {activeStep === steps.length - 1 ? 'Confirm & Pay' : 'Continue'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
