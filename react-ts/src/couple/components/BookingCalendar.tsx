import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  EventAvailable, 
  EventBusy, 
  AccessTime, 
  Close,
  CheckCircle,
  Info,
} from '@mui/icons-material';

interface BookingCalendarProps {
  vendorId: string;
  vendorName: string;
  onBookingConfirm?: (bookingDetails: BookingDetails) => void;
}

export interface BookingDetails {
  date: Date;
  timeSlot: string;
  serviceType: string;
  duration: number;
  specialRequests: string;
  contactMethod: 'phone' | 'email' | 'whatsapp';
}

interface TimeSlot {
  time: string;
  available: boolean;
  booked?: string;
}

const serviceTypes = [
  { value: 'consultation', label: 'Free Consultation', duration: 1 },
  { value: 'site-visit', label: 'Site Visit', duration: 2 },
  { value: 'full-service', label: 'Full Service Booking', duration: 8 },
  { value: 'half-day', label: 'Half Day Service', duration: 4 },
];

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    slots.push({
      time,
      available: Math.random() > 0.3, // 70% availability simulation
    });
  }
  return slots;
};

export default function BookingCalendar({ vendorName, onBookingConfirm }: BookingCalendarProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());
  const [bookingDetails, setBookingDetails] = useState<Partial<BookingDetails>>({
    serviceType: 'consultation',
    duration: 1,
    specialRequests: '',
    contactMethod: 'phone',
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Simulated blocked dates
  const blockedDates = [
    new Date(2026, 1, 14),
    new Date(2026, 1, 21),
    new Date(2026, 1, 28),
  ];

  const isDateDisabled = (date: Date) => {
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
    const isBlocked = blockedDates.some(
      blockedDate =>
        blockedDate.getDate() === date.getDate() &&
        blockedDate.getMonth() === date.getMonth() &&
        blockedDate.getFullYear() === date.getFullYear()
    );
    return isPast || isBlocked;
  };

  const handleDateChange = (date: Date | null) => {
    if (date && !isDateDisabled(date)) {
      setSelectedDate(date);
      // Regenerate time slots for selected date
      setTimeSlots(generateTimeSlots());
      setSelectedTab(1);
    }
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setBookingDetails(prev => ({ ...prev, timeSlot: slot.time }));
    }
  };

  const handleServiceTypeChange = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    setBookingDetails(prev => ({
      ...prev,
      serviceType,
      duration: service?.duration || 1,
    }));
  };

  const handleConfirmBooking = () => {
    if (selectedDate && bookingDetails.timeSlot) {
      const fullDetails: BookingDetails = {
        date: selectedDate,
        timeSlot: bookingDetails.timeSlot!,
        serviceType: bookingDetails.serviceType || 'consultation',
        duration: bookingDetails.duration || 1,
        specialRequests: bookingDetails.specialRequests || '',
        contactMethod: bookingDetails.contactMethod || 'phone',
      };
      
      if (onBookingConfirm) {
        onBookingConfirm(fullDetails);
      }
      
      setConfirmOpen(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setConfirmOpen(false);
        setSelectedDate(null);
        setSelectedTab(0);
        setBookingDetails({
          serviceType: 'consultation',
          duration: 1,
          specialRequests: '',
          contactMethod: 'phone',
        });
      }, 2000);
    }
  };

  const canProceed = selectedDate && bookingDetails.timeSlot;

  return (
    <>
      <Button
        variant="contained"
        startIcon={<EventAvailable />}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: '#00838F',
          '&:hover': { bgcolor: '#006064' },
          textTransform: 'none',
          fontWeight: 600,
          px: 3,
        }}
      >
        Check Availability & Book
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
              Book {vendorName}
            </Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Tabs value={selectedTab} onChange={(_e, v) => setSelectedTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Select Date" />
            <Tab label="Select Time" disabled={!selectedDate} />
            <Tab label="Details" disabled={!bookingDetails.timeSlot} />
          </Tabs>

          {/* Tab 0: Date Selection */}
          {selectedTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 13 }}>
                  Select your preferred date. Blocked dates are unavailable.
                </Typography>
              </Alert>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    shouldDisableDate={isDateDisabled}
                    sx={{
                      '& .MuiPickersDay-root.Mui-selected': {
                        bgcolor: '#00838F',
                      },
                      '& .MuiPickersDay-root.Mui-disabled': {
                        bgcolor: '#ffebee',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#00838F' }} />
                  <Typography sx={{ fontSize: 13 }}>Selected</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ffebee' }} />
                  <Typography sx={{ fontSize: 13 }}>Blocked</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Tab 1: Time Selection */}
          {selectedTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 13 }}>
                  Selected Date: {selectedDate?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Typography>
              </Alert>

              <Typography sx={{ fontWeight: 600, mb: 2 }}>Select Service Type:</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {serviceTypes.map((service) => (
                  <Grid size={{ xs: 6 }} key={service.value}>
                    <Card
                      onClick={() => handleServiceTypeChange(service.value)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: bookingDetails.serviceType === service.value ? '2px solid #00838F' : '1px solid #ddd',
                        bgcolor: bookingDetails.serviceType === service.value ? '#E0F7FA' : 'white',
                        '&:hover': { borderColor: '#00838F' },
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                        {service.label}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#666', mt: 0.5 }}>
                        Duration: {service.duration} hour{service.duration > 1 ? 's' : ''}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Typography sx={{ fontWeight: 600, mb: 2 }}>Available Time Slots:</Typography>
              <Grid container spacing={1.5}>
                {timeSlots.map((slot) => (
                  <Grid size={{ xs: 4 }} key={slot.time}>
                    <Button
                      fullWidth
                      variant={bookingDetails.timeSlot === slot.time ? 'contained' : 'outlined'}
                      disabled={!slot.available}
                      onClick={() => handleTimeSlotSelect(slot)}
                      startIcon={slot.available ? <AccessTime /> : <EventBusy />}
                      sx={{
                        bgcolor: bookingDetails.timeSlot === slot.time ? '#00838F' : 'transparent',
                        color: bookingDetails.timeSlot === slot.time ? 'white' : slot.available ? '#00838F' : '#999',
                        borderColor: slot.available ? '#00838F' : '#ddd',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: bookingDetails.timeSlot === slot.time ? '#006064' : '#E0F7FA',
                        },
                        '&.Mui-disabled': {
                          bgcolor: '#f5f5f5',
                          borderColor: '#ddd',
                        },
                      }}
                    >
                      {slot.time}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Tab 2: Additional Details */}
          {selectedTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  Booking Summary
                </Typography>
                <Typography sx={{ fontSize: 12, mt: 0.5 }}>
                  Date: {selectedDate?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  <br />
                  Time: {bookingDetails.timeSlot}
                  <br />
                  Service: {serviceTypes.find(s => s.value === bookingDetails.serviceType)?.label}
                </Typography>
              </Alert>

              <Typography sx={{ fontWeight: 600, mb: 1 }}>Preferred Contact Method:</Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                  value={bookingDetails.contactMethod}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, contactMethod: e.target.value as 'phone' | 'email' | 'whatsapp' }))}
                  size="small"
                >
                  <MenuItem value="phone">Phone Call</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                </Select>
              </FormControl>

              <Typography sx={{ fontWeight: 600, mb: 1 }}>Special Requests (Optional):</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={bookingDetails.specialRequests}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any specific requirements or questions for the vendor..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          {selectedTab < 2 && selectedDate && (
            <Button
              variant="contained"
              onClick={() => setSelectedTab(prev => prev + 1)}
              disabled={selectedTab === 1 && !bookingDetails.timeSlot}
              sx={{
                bgcolor: '#00838F',
                textTransform: 'none',
                '&:hover': { bgcolor: '#006064' },
              }}
            >
              Continue
            </Button>
          )}
          {selectedTab === 2 && (
            <Button
              variant="contained"
              onClick={handleConfirmBooking}
              disabled={!canProceed}
              startIcon={<CheckCircle />}
              sx={{
                bgcolor: '#00838F',
                textTransform: 'none',
                '&:hover': { bgcolor: '#006064' },
              }}
            >
              Confirm Booking Request
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={confirmOpen} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
          <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 1 }}>
            Booking Request Sent!
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#666' }}>
            The vendor will contact you shortly via your preferred method.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
