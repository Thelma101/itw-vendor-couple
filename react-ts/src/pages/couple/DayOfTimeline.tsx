import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Card,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Add,
  Delete,
  Edit,
  Schedule,
  LocationOn,
  Person,
  Celebration,
  Restaurant,
  MusicNote,
  CameraAlt,
  DirectionsCar,
  Spa,
  Church,
  Nightlife,
  Cake,
  Print,
  Share,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface TimelineEvent {
  id: string
  time: string
  endTime?: string
  title: string
  location?: string
  description?: string
  category: string
  vendors?: string[]
  notes?: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  ceremony: <Church />,
  photos: <CameraAlt />,
  cocktail: <Nightlife />,
  reception: <Celebration />,
  dinner: <Restaurant />,
  cake: <Cake />,
  dancing: <MusicNote />,
  transport: <DirectionsCar />,
  beauty: <Spa />,
  other: <Schedule />,
}

const categoryColors: Record<string, string> = {
  ceremony: '#8b4557',
  photos: '#1e6091',
  cocktail: '#6b4423',
  reception: '#2d5a27',
  dinner: '#d4af37',
  cake: '#e8b4b8',
  dancing: '#9c27b0',
  transport: '#424242',
  beauty: '#f48fb1',
  other: '#00838F',
}

const defaultTimeline: TimelineEvent[] = [
  { id: '1', time: '08:00', endTime: '10:00', title: 'Hair & Makeup', location: 'Bridal Suite', category: 'beauty', vendors: ['Glamour Studio'], description: 'Bride and bridesmaids getting ready' },
  { id: '2', time: '10:30', endTime: '11:30', title: 'First Look Photos', location: 'Garden', category: 'photos', vendors: ['Moments Photography'] },
  { id: '3', time: '12:00', endTime: '12:30', title: 'Bridal Party Arrives', location: 'Venue Entrance', category: 'transport' },
  { id: '4', time: '13:00', endTime: '13:45', title: 'Wedding Ceremony', location: 'Main Chapel', category: 'ceremony', description: 'Officiated by Pastor John' },
  { id: '5', time: '14:00', endTime: '15:00', title: 'Cocktail Hour', location: 'Terrace', category: 'cocktail', vendors: ['Elite Catering'] },
  { id: '6', time: '14:30', endTime: '15:30', title: 'Couple Photos', location: 'Various locations', category: 'photos', vendors: ['Moments Photography', 'Cinematic Films'] },
  { id: '7', time: '15:30', endTime: '16:00', title: 'Grand Entrance', location: 'Grand Ballroom', category: 'reception' },
  { id: '8', time: '16:00', endTime: '17:30', title: 'Dinner Service', location: 'Grand Ballroom', category: 'dinner', vendors: ['Elite Catering'] },
  { id: '9', time: '17:30', endTime: '18:00', title: 'Speeches & Toasts', location: 'Grand Ballroom', category: 'reception' },
  { id: '10', time: '18:00', endTime: '18:30', title: 'Cake Cutting', location: 'Grand Ballroom', category: 'cake' },
  { id: '11', time: '18:30', endTime: '19:00', title: 'First Dance', location: 'Dance Floor', category: 'dancing' },
  { id: '12', time: '19:00', endTime: '22:00', title: 'Party & Dancing', location: 'Grand Ballroom', category: 'dancing', vendors: ['DJ Beats'] },
  { id: '13', time: '22:00', title: 'Send Off', location: 'Main Entrance', category: 'other', description: 'Sparkler exit' },
]

export default function DayOfTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>(defaultTimeline)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
  const [formData, setFormData] = useState({
    time: '',
    endTime: '',
    title: '',
    location: '',
    description: '',
    category: 'other',
    vendors: '',
    notes: '',
  })

  const weddingDate = 'October 15, 2026'

  const handleOpenDialog = (event?: TimelineEvent) => {
    if (event) {
      setEditingEvent(event)
      setFormData({
        time: event.time,
        endTime: event.endTime || '',
        title: event.title,
        location: event.location || '',
        description: event.description || '',
        category: event.category,
        vendors: event.vendors?.join(', ') || '',
        notes: event.notes || '',
      })
    } else {
      setEditingEvent(null)
      setFormData({
        time: '',
        endTime: '',
        title: '',
        location: '',
        description: '',
        category: 'other',
        vendors: '',
        notes: '',
      })
    }
    setDialogOpen(true)
  }

  const handleSave = () => {
    const newEvent: TimelineEvent = {
      id: editingEvent?.id || Date.now().toString(),
      time: formData.time,
      endTime: formData.endTime || undefined,
      title: formData.title,
      location: formData.location || undefined,
      description: formData.description || undefined,
      category: formData.category,
      vendors: formData.vendors ? formData.vendors.split(',').map(v => v.trim()) : undefined,
      notes: formData.notes || undefined,
    }

    if (editingEvent) {
      setTimeline(prev => prev.map(e => e.id === editingEvent.id ? newEvent : e))
    } else {
      setTimeline(prev => [...prev, newEvent].sort((a, b) => a.time.localeCompare(b.time)))
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setTimeline(prev => prev.filter(e => e.id !== id))
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9' }}>
      <Nav />
      
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1a1a1a" gutterBottom>
              Day-of Timeline
            </Typography>
            <Typography color="text.secondary">
              Plan every moment of your wedding day
            </Typography>
            <Chip
              icon={<Schedule />}
              label={weddingDate}
              sx={{ mt: 1, bgcolor: '#00838F', color: 'white' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Share
            </Button>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight={700} color="#00838F">{timeline.length}</Typography>
            <Typography variant="body2" color="text.secondary">Events</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight={700} color="#00838F">
              {timeline.length > 0 ? formatTime(timeline[0].time) : '--'}
            </Typography>
            <Typography variant="body2" color="text.secondary">First Event</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight={700} color="#00838F">
              {timeline.length > 0 ? formatTime(timeline[timeline.length - 1].time) : '--'}
            </Typography>
            <Typography variant="body2" color="text.secondary">Last Event</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight={700} color="#00838F">
              {new Set(timeline.flatMap(e => e.vendors || [])).size}
            </Typography>
            <Typography variant="body2" color="text.secondary">Vendors</Typography>
          </Paper>
        </Box>

        {/* Add Event Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            mb: 3,
            bgcolor: '#EB1948',
            '&:hover': { bgcolor: '#c41438' },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Add Event
        </Button>

        {/* Timeline */}
        <Box sx={{ position: 'relative' }}>
          {/* Vertical Line */}
          <Box
            sx={{
              position: 'absolute',
              left: 95,
              top: 0,
              bottom: 0,
              width: 3,
              bgcolor: '#e0e0e0',
              borderRadius: 2,
            }}
          />

          {timeline.map((event) => (
            <Box
              key={event.id}
              sx={{
                display: 'flex',
                mb: 2,
                position: 'relative',
              }}
            >
              {/* Time */}
              <Box sx={{ width: 80, textAlign: 'right', pr: 2, pt: 1 }}>
                <Typography fontWeight={700} color="#1a1a1a">
                  {formatTime(event.time)}
                </Typography>
                {event.endTime && (
                  <Typography variant="caption" color="text.secondary">
                    to {formatTime(event.endTime)}
                  </Typography>
                )}
              </Box>

              {/* Dot */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: categoryColors[event.category] || '#00838F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  zIndex: 1,
                  flexShrink: 0,
                }}
              >
                {categoryIcons[event.category]}
              </Box>

              {/* Card */}
              <Card
                sx={{
                  flex: 1,
                  ml: 2,
                  p: 2,
                  borderRadius: 2,
                  borderLeft: `4px solid ${categoryColors[event.category] || '#00838F'}`,
                  '&:hover': { boxShadow: 3 },
                  transition: 'box-shadow 0.2s',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                      {event.title}
                    </Typography>
                    
                    {event.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                    )}

                    {event.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {event.description}
                      </Typography>
                    )}

                    {event.vendors && event.vendors.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {event.vendors.map((vendor, i) => (
                          <Chip
                            key={i}
                            icon={<Person sx={{ fontSize: 14 }} />}
                            label={vendor}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24, fontSize: 12 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => handleOpenDialog(event)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(event.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>

        {timeline.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No events yet</Typography>
            <Typography color="text.secondary">Start building your wedding day timeline</Typography>
          </Paper>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Start Time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="End Time (optional)"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
            <TextField
              label="Event Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="beauty">💄 Hair & Makeup</MenuItem>
                <MenuItem value="photos">📸 Photos</MenuItem>
                <MenuItem value="transport">🚗 Transport</MenuItem>
                <MenuItem value="ceremony">💒 Ceremony</MenuItem>
                <MenuItem value="cocktail">🍸 Cocktail Hour</MenuItem>
                <MenuItem value="reception">🎉 Reception</MenuItem>
                <MenuItem value="dinner">🍽️ Dinner</MenuItem>
                <MenuItem value="cake">🎂 Cake</MenuItem>
                <MenuItem value="dancing">💃 Dancing</MenuItem>
                <MenuItem value="other">📋 Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
            <TextField
              label="Vendors (comma-separated)"
              fullWidth
              value={formData.vendors}
              onChange={(e) => setFormData(prev => ({ ...prev, vendors: e.target.value }))}
              placeholder="e.g., DJ Beats, Elite Catering"
            />
            <TextField
              label="Description / Notes"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.time || !formData.title}
            sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' } }}
          >
            {editingEvent ? 'Save Changes' : 'Add Event'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}
