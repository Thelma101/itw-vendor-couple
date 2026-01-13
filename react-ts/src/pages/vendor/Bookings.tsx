import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNotifications } from '../../contexts/NotificationContext';

interface Booking {
  id: string;
  couple: string;
  email: string;
  phone: string;
  date: string;
  package: string;
  amount: number;
  deposit: number;
  depositPaid: boolean;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  avatar: string;
  guestCount: number;
  venue: string;
  specialRequests: string;
  createdAt: string;
}

const initialBookings: Booking[] = [
  {
    id: 'BKG-201',
    couple: 'Sarah & Michael',
    email: 'sarah.michael@email.com',
    phone: '+234 801 234 5678',
    date: '2026-03-15',
    package: 'Premium',
    amount: 350000,
    deposit: 105000,
    depositPaid: true,
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    guestCount: 200,
    venue: 'Eko Hotel & Suites',
    specialRequests: 'Traditional and white wedding coverage needed.',
    createdAt: '2025-12-20',
  },
  {
    id: 'BKG-202',
    couple: 'Jane & John',
    email: 'jane.john@email.com',
    phone: '+234 802 345 6789',
    date: '2026-04-22',
    package: 'Luxury',
    amount: 650000,
    deposit: 195000,
    depositPaid: false,
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    guestCount: 350,
    venue: 'Oriental Hotel',
    specialRequests: 'Drone footage and same-day edits required.',
    createdAt: '2026-01-05',
  },
  {
    id: 'BKG-203',
    couple: 'Amara & Uche',
    email: 'amara.uche@email.com',
    phone: '+234 803 456 7890',
    date: '2026-02-28',
    package: 'Essential',
    amount: 150000,
    deposit: 45000,
    depositPaid: true,
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    guestCount: 100,
    venue: 'The George Hotel',
    specialRequests: 'Focus on candid photography.',
    createdAt: '2025-11-15',
  },
  {
    id: 'BKG-204',
    couple: 'Lara & Kunle',
    email: 'lara.kunle@email.com',
    phone: '+234 804 567 8901',
    date: '2026-05-10',
    package: 'Premium',
    amount: 350000,
    deposit: 105000,
    depositPaid: false,
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    guestCount: 250,
    venue: 'Federal Palace Hotel',
    specialRequests: 'Engagement shoot included.',
    createdAt: '2026-01-10',
  },
  {
    id: 'BKG-205',
    couple: 'Temi & Femi',
    email: 'temi.femi@email.com',
    phone: '+234 805 678 9012',
    date: '2025-11-20',
    package: 'Luxury',
    amount: 650000,
    deposit: 195000,
    depositPaid: true,
    status: 'Completed',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    guestCount: 400,
    venue: 'Landmark Event Centre',
    specialRequests: 'Full coverage with photo album.',
    createdAt: '2025-08-01',
  },
  {
    id: 'BKG-206',
    couple: 'Ada & Chidi',
    email: 'ada.chidi@email.com',
    phone: '+234 806 789 0123',
    date: '2025-10-15',
    package: 'Essential',
    amount: 150000,
    deposit: 45000,
    depositPaid: true,
    status: 'Cancelled',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100',
    guestCount: 80,
    venue: 'Civic Centre',
    specialRequests: 'Simple coverage.',
    createdAt: '2025-07-20',
  },
];

export default function VendorBookings() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { addNotification } = useNotifications();

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return { bg: '#E8F5E9', text: '#4CAF50' };
      case 'Pending':
        return { bg: '#FFF3E0', text: '#FF9800' };
      case 'Completed':
        return { bg: '#E3F2FD', text: '#2196F3' };
      case 'Cancelled':
        return { bg: '#FFEBEE', text: '#f44336' };
      default:
        return { bg: '#f5f5f5', text: '#666' };
    }
  };

  const tabs = [
    { label: 'All', count: bookings.length },
    { label: 'Pending', count: bookings.filter(b => b.status === 'Pending').length },
    { label: 'Confirmed', count: bookings.filter(b => b.status === 'Confirmed').length },
    { label: 'Completed', count: bookings.filter(b => b.status === 'Completed').length },
    { label: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length },
  ];

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.couple.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = tabValue === 0 || b.status === tabs[tabValue].label;
    return matchesSearch && matchesTab;
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, booking: Booking) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleStatusChange = (newStatus: Booking['status']) => {
    if (selectedBooking) {
      setBookings(prev =>
        prev.map(b => (b.id === selectedBooking.id ? { ...b, status: newStatus } : b))
      );
      addNotification({
        type: 'booking',
        title: 'Booking Updated',
        message: `${selectedBooking.couple}'s booking has been ${newStatus.toLowerCase()}.`,
        avatar: selectedBooking.avatar,
      });
    }
    setAnchorEl(null);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailOpen(true);
  };

  const stats = [
    { label: 'Total Revenue', value: formatPrice(bookings.filter(b => b.status !== 'Cancelled').reduce((sum, b) => sum + b.amount, 0)), icon: <AttachMoneyIcon /> },
    { label: 'Pending Deposits', value: formatPrice(bookings.filter(b => !b.depositPaid && b.status === 'Pending').reduce((sum, b) => sum + b.deposit, 0)), icon: <AccessTimeIcon /> },
    { label: 'This Month', value: bookings.filter(b => new Date(b.date).getMonth() === new Date().getMonth()).length, icon: <CalendarMonthIcon /> },
    { label: 'Completed', value: bookings.filter(b => b.status === 'Completed').length, icon: <CheckCircleIcon /> },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            fontSize: 24,
            color: '#002528',
          }}
        >
          Bookings
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#00838F',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            '&:hover': { bgcolor: '#006b75' },
          }}
        >
          + New Booking
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid #CCFDF2',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: '#00838F15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00838F',
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#002528' }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#666' }}>
                  {stat.label}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid #CCFDF2',
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #CCFDF2' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search bookings..."
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
                width: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              sx={{
                flex: 1,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 'auto',
                  px: 2,
                },
                '& .Mui-selected': { color: '#00838F' },
                '& .MuiTabs-indicator': { bgcolor: '#00838F' },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.label}
                      <Chip
                        label={tab.count}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 11,
                          bgcolor: tabValue === index ? '#00838F15' : '#f5f5f5',
                          color: tabValue === index ? '#00838F' : '#666',
                        }}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>
        </Box>

        {/* Bookings List */}
        <Box>
          {filteredBookings.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: '#666' }}>No bookings found</Typography>
            </Box>
          ) : (
            filteredBookings.map((booking, index) => (
              <Box
                key={booking.id}
                onClick={() => handleViewDetails(booking)}
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: index < filteredBookings.length - 1 ? '1px solid #f5f5f5' : 'none',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#fafafa' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Avatar src={booking.avatar} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#002528' }}>
                      {booking.couple}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#666' }}>
                      {booking.id} • {booking.package} Package
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 12, color: '#666' }}>Date</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#002528' }}>
                      {new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 12, color: '#666' }}>Amount</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#002528' }}>
                      {formatPrice(booking.amount)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 12, color: '#666' }}>Deposit</Typography>
                    <Chip
                      label={booking.depositPaid ? 'Paid' : 'Pending'}
                      size="small"
                      sx={{
                        bgcolor: booking.depositPaid ? '#E8F5E9' : '#FFF3E0',
                        color: booking.depositPaid ? '#4CAF50' : '#FF9800',
                        fontWeight: 600,
                        height: 24,
                      }}
                    />
                  </Box>
                  <Chip
                    label={booking.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(booking.status).bg,
                      color: getStatusColor(booking.status).text,
                      fontWeight: 600,
                      minWidth: 90,
                    }}
                  />
                  <IconButton onClick={(e) => handleMenuClick(e, booking)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setDetailOpen(true); setAnchorEl(null); }}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Confirmed')}>
          <CheckCircleIcon sx={{ mr: 1, color: '#4CAF50', fontSize: 18 }} />
          Confirm Booking
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Completed')}>
          <CheckCircleIcon sx={{ mr: 1, color: '#2196F3', fontSize: 18 }} />
          Mark Completed
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleStatusChange('Cancelled')} sx={{ color: '#f44336' }}>
          <CancelIcon sx={{ mr: 1, fontSize: 18 }} />
          Cancel Booking
        </MenuItem>
      </Menu>

      {/* Booking Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        {selectedBooking && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedBooking.avatar} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
                    {selectedBooking.couple}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: '#666' }}>
                    {selectedBooking.id}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    label={selectedBooking.status}
                    sx={{
                      bgcolor: getStatusColor(selectedBooking.status).bg,
                      color: getStatusColor(selectedBooking.status).text,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 2, bgcolor: '#FFF6F9', border: 'none', boxShadow: 'none' }}>
                    <Typography sx={{ fontWeight: 600, mb: 2, color: '#002528' }}>
                      Event Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonthIcon sx={{ color: '#00838F', fontSize: 20 }} />
                        <Typography sx={{ fontSize: 14 }}>
                          {new Date(selectedBooking.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: '#00838F', fontSize: 20 }} />
                        <Typography sx={{ fontSize: 14 }}>
                          {selectedBooking.guestCount} Guests
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 14, color: '#666' }}>
                        <strong>Venue:</strong> {selectedBooking.venue}
                      </Typography>
                      <Typography sx={{ fontSize: 14, color: '#666' }}>
                        <strong>Package:</strong> {selectedBooking.package}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 2, bgcolor: '#FFF6F9', border: 'none', boxShadow: 'none' }}>
                    <Typography sx={{ fontWeight: 600, mb: 2, color: '#002528' }}>
                      Payment Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: 14, color: '#666' }}>Total Amount</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                          {formatPrice(selectedBooking.amount)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: 14, color: '#666' }}>Deposit (30%)</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                          {formatPrice(selectedBooking.deposit)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: 14, color: '#666' }}>Deposit Status</Typography>
                        <Chip
                          label={selectedBooking.depositPaid ? 'Paid' : 'Pending'}
                          size="small"
                          sx={{
                            bgcolor: selectedBooking.depositPaid ? '#E8F5E9' : '#FFF3E0',
                            color: selectedBooking.depositPaid ? '#4CAF50' : '#FF9800',
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: 14, color: '#666' }}>Balance</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                          {formatPrice(selectedBooking.amount - (selectedBooking.depositPaid ? selectedBooking.deposit : 0))}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Card sx={{ p: 2, bgcolor: '#FFF6F9', border: 'none', boxShadow: 'none' }}>
                    <Typography sx={{ fontWeight: 600, mb: 2, color: '#002528' }}>
                      Contact Information
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: '#00838F', fontSize: 20 }} />
                        <Typography sx={{ fontSize: 14 }}>{selectedBooking.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ color: '#00838F', fontSize: 20 }} />
                        <Typography sx={{ fontSize: 14 }}>{selectedBooking.phone}</Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                {selectedBooking.specialRequests && (
                  <Grid size={{ xs: 12 }}>
                    <Card sx={{ p: 2, bgcolor: '#FFF6F9', border: 'none', boxShadow: 'none' }}>
                      <Typography sx={{ fontWeight: 600, mb: 1, color: '#002528' }}>
                        Special Requests
                      </Typography>
                      <Typography sx={{ fontSize: 14, color: '#666' }}>
                        {selectedBooking.specialRequests}
                      </Typography>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={() => setDetailOpen(false)} sx={{ color: '#666' }}>
                Close
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: '#00838F', color: '#00838F' }}
              >
                Send Message
              </Button>
              {selectedBooking.status === 'Pending' && (
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006b75' } }}
                  onClick={() => {
                    handleStatusChange('Confirmed');
                    setDetailOpen(false);
                  }}
                >
                  Confirm Booking
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
