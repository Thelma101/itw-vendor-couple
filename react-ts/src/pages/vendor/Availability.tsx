import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventIcon from '@mui/icons-material/Event';
import BlockIcon from '@mui/icons-material/Block';

interface BookedDate {
  date: string;
  couple: string;
  type: 'booked' | 'blocked';
}

const initialBookings: BookedDate[] = [
  { date: '2026-01-15', couple: 'Sarah & Michael', type: 'booked' },
  { date: '2026-01-22', couple: '', type: 'blocked' },
  { date: '2026-02-14', couple: 'Valentine Booking', type: 'booked' },
  { date: '2026-02-28', couple: 'Amara & Uche', type: 'booked' },
  { date: '2026-03-15', couple: 'Jane & John', type: 'booked' },
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

export default function Availability() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [bookings, setBookings] = useState<BookedDate[]>(initialBookings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [blockType, setBlockType] = useState<'blocked' | 'booked'>('blocked');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDateStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.find(b => b.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setDialogOpen(true);
  };

  const handleBlockDate = () => {
    if (selectedDate) {
      const existing = bookings.find(b => b.date === selectedDate);
      if (existing) {
        setBookings(prev => prev.filter(b => b.date !== selectedDate));
      } else {
        setBookings(prev => [...prev, { date: selectedDate, couple: blockType === 'booked' ? 'New Booking' : '', type: blockType }]);
      }
    }
    setDialogOpen(false);
  };

  const upcomingBookings = bookings
    .filter(b => b.type === 'booked' && new Date(b.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 24, color: '#002528' }}>
            Availability Calendar
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#666', mt: 0.5 }}>
            Manage your availability and block dates
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Calendar */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2', boxShadow: 'none' }}>
            {/* Month Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <IconButton onClick={prevMonth}><ChevronLeftIcon /></IconButton>
              <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#002528' }}>
                {monthNames[month]} {year}
              </Typography>
              <IconButton onClick={nextMonth}><ChevronRightIcon /></IconButton>
            </Box>

            {/* Day Headers */}
            <Grid container sx={{ mb: 1 }}>
              {dayNames.map(day => (
                <Grid size={{ xs: 12/7 }} key={day}>
                  <Typography sx={{ textAlign: 'center', fontWeight: 600, fontSize: 13, color: '#666' }}>
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* Calendar Days */}
            <Grid container>
              {/* Empty cells for days before first of month */}
              {[...Array(firstDay)].map((_, i) => (
                <Grid size={{ xs: 12/7 }} key={`empty-${i}`}>
                  <Box sx={{ height: 80 }} />
                </Grid>
              ))}
              
              {/* Days of the month */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const status = getDateStatus(day);
                const isPast = new Date(year, month, day) < new Date(new Date().setHours(0, 0, 0, 0));
                
                return (
                  <Grid size={{ xs: 12/7 }} key={day}>
                    <Box
                      onClick={() => !isPast && handleDateClick(day)}
                      sx={{
                        height: 80,
                        p: 1,
                        border: '1px solid #f5f5f5',
                        cursor: isPast ? 'default' : 'pointer',
                        opacity: isPast ? 0.4 : 1,
                        bgcolor: status?.type === 'booked' ? '#E8F5E9' : status?.type === 'blocked' ? '#FFEBEE' : 'transparent',
                        '&:hover': { bgcolor: !isPast && !status ? '#FFFFFF' : undefined },
                        position: 'relative',
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#002528' }}>
                        {day}
                      </Typography>
                      {status && (
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            icon={status.type === 'booked' ? <EventIcon sx={{ fontSize: 14 }} /> : <BlockIcon sx={{ fontSize: 14 }} />}
                            label={status.type === 'booked' ? 'Booked' : 'Blocked'}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: 10,
                              bgcolor: status.type === 'booked' ? '#4CAF50' : '#f44336',
                              color: 'white',
                              '& .MuiChip-icon': { color: 'white' },
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 3, mt: 3, pt: 2, borderTop: '1px solid #f5f5f5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#E8F5E9' }} />
                <Typography sx={{ fontSize: 13, color: '#666' }}>Booked</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#FFEBEE' }} />
                <Typography sx={{ fontSize: 13, color: '#666' }}>Blocked</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 1, border: '1px solid #ddd' }} />
                <Typography sx={{ fontSize: 13, color: '#666' }}>Available</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Upcoming Bookings */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2', boxShadow: 'none' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#002528', mb: 3 }}>
              Upcoming Bookings
            </Typography>
            {upcomingBookings.length === 0 ? (
              <Typography sx={{ fontSize: 14, color: '#666' }}>No upcoming bookings</Typography>
            ) : (
              upcomingBookings.map((booking, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: '#FFFFFF',
                    borderRadius: 2,
                    borderLeft: '3px solid #00838F',
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#002528' }}>
                    {booking.couple}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: '#666' }}>
                    {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
              ))
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Block Date Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Manage Date</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: '#666' }}>
            {selectedDate && new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
          <FormControl fullWidth>
            <Select value={blockType} onChange={(e) => setBlockType(e.target.value as 'blocked' | 'booked')}>
              <MenuItem value="blocked">Block Date (Unavailable)</MenuItem>
              <MenuItem value="booked">Mark as Booked</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          {bookings.find(b => b.date === selectedDate) ? (
            <Button onClick={handleBlockDate} color="error">Remove Block</Button>
          ) : (
            <Button variant="contained" onClick={handleBlockDate} sx={{ bgcolor: '#00838F' }}>Confirm</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
