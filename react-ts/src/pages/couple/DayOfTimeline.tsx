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
  Tabs,
  Tab,
  InputAdornment,
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
  Search,
  CalendarToday,
  AccessTime,
  Groups,
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
  ceremony: <Church sx={{ fontSize: 18 }} />,
  photos: <CameraAlt sx={{ fontSize: 18 }} />,
  cocktail: <Nightlife sx={{ fontSize: 18 }} />,
  reception: <Celebration sx={{ fontSize: 18 }} />,
  dinner: <Restaurant sx={{ fontSize: 18 }} />,
  cake: <Cake sx={{ fontSize: 18 }} />,
  dancing: <MusicNote sx={{ fontSize: 18 }} />,
  transport: <DirectionsCar sx={{ fontSize: 18 }} />,
  beauty: <Spa sx={{ fontSize: 18 }} />,
  other: <Schedule sx={{ fontSize: 18 }} />,
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

const categoryLabels: Record<string, string> = {
  ceremony: 'Ceremony',
  photos: 'Photos',
  cocktail: 'Cocktail',
  reception: 'Reception',
  dinner: 'Dinner',
  cake: 'Cake',
  dancing: 'Dancing',
  transport: 'Transport',
  beauty: 'Beauty',
  other: 'Other',
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState(0)
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

  // Stats
  const totalEvents = timeline.length
  const uniqueVendors = new Set(timeline.flatMap(e => e.vendors || [])).size
  const uniqueLocations = new Set(timeline.map(e => e.location).filter(Boolean)).size

  // Calculate total duration
  const calculateDuration = () => {
    if (timeline.length === 0) return '0 hours'
    const firstTime = timeline[0].time
    const lastEvent = timeline[timeline.length - 1]
    const endTime = lastEvent.endTime || lastEvent.time
    const [startH, startM] = firstTime.split(':').map(Number)
    const [endH, endM] = endTime.split(':').map(Number)
    const totalMins = (endH * 60 + endM) - (startH * 60 + startM)
    const hours = Math.floor(totalMins / 60)
    const mins = totalMins % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`
  }

  // Filter events
  const categories = ['all', ...Object.keys(categoryLabels)]
  const filteredEvents = timeline.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.vendors?.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (!matchesSearch) return false
    if (filterTab === 0) return true
    return event.category === categories[filterTab]
  })

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      
      <Box sx={{ flex: 1, px: 4, py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 32, fontWeight: 700, color: '#002528' }}>
              Day-of Timeline
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666', mt: 0.5 }}>
              Plan every moment of your wedding day
            </Typography>
            <Chip
              icon={<CalendarToday sx={{ fontSize: 16 }} />}
              label={weddingDate}
              sx={{ mt: 1.5, bgcolor: '#00838F', color: 'white', fontFamily: "'Open Sans', sans-serif", fontWeight: 600 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              sx={{ borderColor: '#00838F', color: '#00838F', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              sx={{ borderColor: '#00838F', color: '#00838F', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Share
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ bgcolor: '#EB1948', '&:hover': { bgcolor: '#c41438' }, borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              Add Event
            </Button>
          </Box>
        </Box>

        {/* Stats Cards Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e8f5f5', borderRadius: 2 }}>
                <Schedule sx={{ color: '#00838F' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Total Events</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#002528' }}>
              {totalEvents}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              Scheduled activities
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                <AccessTime sx={{ color: '#4caf50' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Duration</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#4caf50' }}>
              {calculateDuration()}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              {timeline.length > 0 ? `${formatTime(timeline[0].time)} - ${formatTime(timeline[timeline.length - 1].endTime || timeline[timeline.length - 1].time)}` : 'No events yet'}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#fff3e0', borderRadius: 2 }}>
                <Groups sx={{ color: '#F5A623' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Vendors</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#F5A623' }}>
              {uniqueVendors}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              Involved parties
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#fce4ec', borderRadius: 2 }}>
                <LocationOn sx={{ color: '#EB1948' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Locations</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#EB1948' }}>
              {uniqueLocations}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              Different venues
            </Typography>
          </Paper>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#999' }} /></InputAdornment>,
              sx: { fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white', borderRadius: 2 }
            }}
            sx={{ minWidth: 250 }}
          />
          <Tabs 
            value={filterTab} 
            onChange={(_, v) => setFilterTab(v)} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              bgcolor: 'white', borderRadius: 2, minHeight: 40,
              '& .MuiTab-root': { minHeight: 40, textTransform: 'none', fontFamily: "'Open Sans', sans-serif", fontSize: 13 }
            }}
          >
            <Tab label="All" />
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Tab key={key} label={label} icon={categoryIcons[key] as React.ReactElement} iconPosition="start" sx={{ minHeight: 40 }} />
            ))}
          </Tabs>
        </Box>

        {/* Two Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '280px 1fr' }, gap: 3 }}>
          {/* Category Legend Sidebar */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0', height: 'fit-content', display: { xs: 'none', lg: 'block' } }}>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#002528', mb: 2 }}>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {Object.entries(categoryLabels).map(([key, label]) => {
                const count = timeline.filter(e => e.category === key).length
                return (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: categoryColors[key], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {categoryIcons[key]}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#002528' }}>{label}</Typography>
                    </Box>
                    <Chip label={count} size="small" sx={{ bgcolor: `${categoryColors[key]}20`, color: categoryColors[key], fontWeight: 600, fontSize: 11, height: 22 }} />
                  </Box>
                )
              })}
            </Box>
          </Paper>

          {/* Timeline */}
          <Box>
            {filteredEvents.length > 0 ? (
              <Box sx={{ position: 'relative' }}>
                {/* Vertical Line */}
                <Box sx={{ position: 'absolute', left: { xs: 16, md: 75 }, top: 20, bottom: 20, width: 3, bgcolor: '#e0e0e0', borderRadius: 2 }} />

                {filteredEvents.map((event) => (
                  <Box key={event.id} sx={{ display: 'flex', mb: 2, position: 'relative' }}>
                    {/* Time - Hidden on mobile */}
                    <Box sx={{ width: 60, textAlign: 'right', pr: 2, pt: 1.5, display: { xs: 'none', md: 'block' } }}>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14, color: '#002528' }}>
                        {formatTime(event.time)}
                      </Typography>
                      {event.endTime && (
                        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#999' }}>
                          to {formatTime(event.endTime)}
                        </Typography>
                      )}
                    </Box>

                    {/* Dot */}
                    <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: categoryColors[event.category] || '#00838F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 1, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      {categoryIcons[event.category]}
                    </Box>

                    {/* Card */}
                    <Card sx={{ flex: 1, ml: 2, p: 2.5, borderRadius: 3, borderLeft: `4px solid ${categoryColors[event.category] || '#00838F'}`, border: '1px solid #e0e0e0', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }, transition: 'all 0.2s' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          {/* Mobile time display */}
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: categoryColors[event.category], fontWeight: 600, mb: 0.5, display: { xs: 'block', md: 'none' } }}>
                            {formatTime(event.time)}{event.endTime && ` - ${formatTime(event.endTime)}`}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528' }}>
                              {event.title}
                            </Typography>
                            <Chip 
                              label={categoryLabels[event.category]} 
                              size="small" 
                              sx={{ height: 20, fontSize: 10, bgcolor: `${categoryColors[event.category]}20`, color: categoryColors[event.category], fontWeight: 600 }} 
                            />
                          </Box>
                          
                          {event.location && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <LocationOn sx={{ fontSize: 16, color: '#999' }} />
                              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>
                                {event.location}
                              </Typography>
                            </Box>
                          )}

                          {event.description && (
                            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666', mb: 1 }}>
                              {event.description}
                            </Typography>
                          )}

                          {event.vendors && event.vendors.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                              {event.vendors.map((vendor, i) => (
                                <Chip
                                  key={i}
                                  icon={<Person sx={{ fontSize: 14 }} />}
                                  label={vendor}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 24, fontSize: 11, fontFamily: "'Open Sans', sans-serif", borderColor: '#e0e0e0' }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => handleOpenDialog(event)}>
                            <Edit fontSize="small" sx={{ color: '#666' }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(event.id)}>
                            <Delete fontSize="small" sx={{ color: '#999' }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <Schedule sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, color: '#666', mb: 1 }}>
                  No events found
                </Typography>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#999' }}>
                  {searchQuery || filterTab > 0 ? 'Try adjusting your search or filters' : 'Start building your wedding day timeline'}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600 }}>
          {editingEvent ? 'Edit Event' : 'Add Event'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
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
                <MenuItem value="beauty">Hair & Makeup</MenuItem>
                <MenuItem value="photos">Photos</MenuItem>
                <MenuItem value="transport">Transport</MenuItem>
                <MenuItem value="ceremony">Ceremony</MenuItem>
                <MenuItem value="cocktail">Cocktail Hour</MenuItem>
                <MenuItem value="reception">Reception</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
                <MenuItem value="cake">Cake</MenuItem>
                <MenuItem value="dancing">Dancing</MenuItem>
                <MenuItem value="other">Other</MenuItem>
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
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.time || !formData.title}
            sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none' }}
          >
            {editingEvent ? 'Save Changes' : 'Add Event'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}
