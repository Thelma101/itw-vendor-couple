import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  AccessTime,
  Add,
  AutoAwesome,
  CalendarToday,
  Cake,
  CameraAlt,
  Celebration,
  Church,
  Delete,
  DirectionsCar,
  Edit,
  ExpandMore,
  FilterAlt,
  GridView,
  Groups,
  Insights,
  LocationOn,
  MusicNote,
  Nightlife,
  Person,
  Print,
  Restaurant,
  Schedule,
  Search,
  Share,
  Spa,
  ViewList,
  ViewTimeline,
} from '@mui/icons-material'

import Nav from '@/couple/components/Nav'
import Footer from '@/marketing/components/Footer'

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
  ceremony: '#8B4557',
  photos: '#1E6091',
  cocktail: '#6B4423',
  reception: '#2D5A27',
  dinner: '#B88900',
  cake: '#C96C87',
  dancing: '#7A2CBF',
  transport: '#374151',
  beauty: '#D9467A',
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

const PAGE_SIZE = 6

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

const getSession = (time: string) => {
  const hour = Number.parseInt(time.split(':')[0], 10)
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
}

export default function DayOfTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>(defaultTimeline)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState(0)
  const [view, setView] = useState<'timeline' | 'agenda' | 'cards'>('timeline')
  const [expandedEvents, setExpandedEvents] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
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

  const categories = useMemo(() => ['all', ...Object.keys(categoryLabels)], [])

  const filteredEvents = useMemo(() => {
    return timeline.filter((event) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        event.title.toLowerCase().includes(q) ||
        event.location?.toLowerCase().includes(q) ||
        event.vendors?.some((v) => v.toLowerCase().includes(q))

      if (!matchesSearch) return false
      if (filterTab === 0) return true
      return event.category === categories[filterTab]
    })
  }, [timeline, searchQuery, filterTab, categories])

  const visibleEvents = useMemo(() => filteredEvents.slice(0, visibleCount), [filteredEvents, visibleCount])
  const hasMore = visibleCount < filteredEvents.length

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
    setExpandedEvents([])
  }, [searchQuery, filterTab, view])

  const eventsBySession = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = { Morning: [], Afternoon: [], Evening: [] }
    visibleEvents.forEach((event) => groups[getSession(event.time)].push(event))
    return groups
  }, [visibleEvents])

  const totalEvents = timeline.length
  const uniqueVendors = new Set(timeline.flatMap((e) => e.vendors || [])).size
  const uniqueLocations = new Set(timeline.map((e) => e.location).filter(Boolean)).size

  const calculateDuration = () => {
    if (timeline.length === 0) return '0h'
    const firstTime = timeline[0].time
    const lastEvent = timeline[timeline.length - 1]
    const endTime = lastEvent.endTime || lastEvent.time
    const [startH, startM] = firstTime.split(':').map(Number)
    const [endH, endM] = endTime.split(':').map(Number)
    const totalMins = endH * 60 + endM - (startH * 60 + startM)
    const hours = Math.floor(totalMins / 60)
    const mins = totalMins % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const toggleExpanded = (id: string) => {
    setExpandedEvents((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

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
      vendors: formData.vendors ? formData.vendors.split(',').map((v) => v.trim()) : undefined,
      notes: formData.notes || undefined,
    }

    if (editingEvent) {
      setTimeline((prev) => prev.map((e) => (e.id === editingEvent.id ? newEvent : e)))
    } else {
      setTimeline((prev) => [...prev, newEvent].sort((a, b) => a.time.localeCompare(b.time)))
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setTimeline((prev) => prev.filter((e) => e.id !== id))
    setExpandedEvents((prev) => prev.filter((item) => item !== id))
  }

  const renderSharedEventMeta = (event: TimelineEvent) => (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center" sx={{ mt: 1 }}>
      <Chip
        size="small"
        label={categoryLabels[event.category]}
        icon={categoryIcons[event.category] as React.ReactElement}
        sx={{
          borderRadius: 2,
          bgcolor: `${categoryColors[event.category]}18`,
          color: categoryColors[event.category],
          fontWeight: 700,
          '& .MuiChip-icon': { color: 'inherit' },
        }}
      />
      {event.location && (
        <Chip
          size="small"
          icon={<LocationOn sx={{ fontSize: 14 }} />}
          label={event.location}
          sx={{ borderRadius: 2, bgcolor: '#F6F8FA', color: '#334155' }}
        />
      )}
      {event.vendors?.slice(0, 2).map((vendor) => (
        <Chip
          key={`${event.id}-${vendor}`}
          size="small"
          variant="outlined"
          icon={<Person sx={{ fontSize: 14 }} />}
          label={vendor}
          sx={{ borderRadius: 2, borderColor: '#CBD5E1', color: '#334155' }}
        />
      ))}
      {event.vendors && event.vendors.length > 2 && (
        <Chip size="small" label={`+${event.vendors.length - 2} more`} sx={{ borderRadius: 2, bgcolor: '#EEF2FF', color: '#4338CA' }} />
      )}
    </Stack>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F9FC', display: 'flex', flexDirection: 'column' }}>
        <Nav />

        <Box sx={{ flex: 1, px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1440, width: '100%', mx: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              background: 'linear-gradient(120deg, #FFFFFF 0%, #F1FAFB 55%, #FFF5F7 100%)',
              mb: 3,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'absolute', right: -30, top: -40, width: 170, height: 170, borderRadius: '50%', bgcolor: '#00838F0D' }} />
            <Box sx={{ position: 'absolute', right: 100, bottom: -35, width: 120, height: 120, borderRadius: '50%', bgcolor: '#EB19480D' }} />
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-start', lg: 'center' }}>
              <Box sx={{ zIndex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <AutoAwesome sx={{ color: '#00838F' }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3, color: '#0F766E' }}>
                    Wedding Command Center
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: { xs: 34, md: 42 }, lineHeight: 1.1, fontWeight: 800, color: '#0B2D31' }}>
                  Day-of Timeline
                </Typography>
                <Typography sx={{ fontSize: 16, color: '#425466', mt: 1 }}>
                  A focused run-of-show with fewer distractions and faster decisions.
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2, flexWrap: 'wrap' }}>
                  <Chip icon={<CalendarToday sx={{ fontSize: 16 }} />} label={weddingDate} sx={{ bgcolor: '#00838F', color: '#fff', fontWeight: 700 }} />
                  <Chip icon={<Insights sx={{ fontSize: 16 }} />} label={`${totalEvents} milestones`} sx={{ bgcolor: '#EB194814', color: '#B42349', fontWeight: 700 }} />
                </Stack>
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'block' }, zIndex: 1 }} aria-hidden="true">
                <Box
                  component="svg"
                  viewBox="0 0 320 160"
                  sx={{ width: { md: 260, lg: 320 }, height: 'auto' }}
                >
                  <rect x="0" y="0" width="320" height="160" rx="24" fill="#FFFFFF" />
                  <path d="M30 125 C60 95, 100 100, 140 70 C180 40, 230 45, 285 25" stroke="#00838F" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <circle cx="30" cy="125" r="8" fill="#00838F" />
                  <circle cx="140" cy="70" r="8" fill="#1E6091" />
                  <circle cx="285" cy="25" r="8" fill="#EB1948" />
                  <rect x="24" y="20" width="92" height="26" rx="13" fill="#E6F7F8" />
                  <text x="70" y="38" fill="#0F766E" fontSize="11" textAnchor="middle" fontFamily="Arial">Flow Health</text>
                  <rect x="206" y="108" width="90" height="26" rx="13" fill="#FDE8EE" />
                  <text x="251" y="126" fill="#B42349" fontSize="11" textAnchor="middle" fontFamily="Arial">On Schedule</text>
                </Box>
              </Box>
            </Stack>
          </Paper>

          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, width: '100%' }}>
              {[
                { label: 'Total Events', value: totalEvents, caption: 'scheduled activities', color: '#00838F', icon: <Schedule /> },
                { label: 'Duration', value: calculateDuration(), caption: 'ceremony to send-off', color: '#2D5A27', icon: <AccessTime /> },
                { label: 'Vendors', value: uniqueVendors, caption: 'involved partners', color: '#B88900', icon: <Groups /> },
                { label: 'Locations', value: uniqueLocations, caption: 'unique venues', color: '#B42349', icon: <LocationOn /> },
              ].map((card) => (
                <Paper
                  key={card.label}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    bgcolor: '#FFFFFF',
                    transition: 'transform 0.24s ease, box-shadow 0.24s ease',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)' },
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.2 }}>
                    <Box sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: `${card.color}1A`, color: card.color, display: 'grid', placeItems: 'center' }}>
                      {card.icon}
                    </Box>
                    <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{card.label}</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: card.color }}>{card.value}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>{card.caption}</Typography>
                </Paper>
              ))}
            </Box>

            <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ flexShrink: 0 }}>
              <Button variant="outlined" startIcon={<Print />} sx={{ borderColor: '#00838F', color: '#00838F', borderRadius: 6, textTransform: 'none', fontWeight: 700, px: 2.5 }}>Print</Button>
              <Button variant="outlined" startIcon={<Share />} sx={{ borderColor: '#00838F', color: '#00838F', borderRadius: 6, textTransform: 'none', fontWeight: 700, px: 2.5 }}>Share</Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: '#EB1948',
                  color: '#FFFFFF',
                  borderRadius: 6,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  boxShadow: '0 8px 18px rgba(235, 25, 72, 0.28)',
                  '&:hover': { bgcolor: '#C41438', transform: 'translateY(-1px)' },
                }}
                aria-label="Add timeline event"
              >
                Add Event
              </Button>
            </Stack>
          </Stack>

          <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', mb: 3 }}>
            <Stack direction={{ xs: 'column', xl: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', xl: 'center' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ flex: 1 }}>
                <TextField
                  placeholder="Search events, places, vendors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search sx={{ color: '#64748B' }} /></InputAdornment>,
                    sx: { borderRadius: 2.5 },
                  }}
                  sx={{ minWidth: { xs: '100%', md: 290 }, maxWidth: 380 }}
                  inputProps={{ 'aria-label': 'Search timeline events' }}
                />

                <Tabs
                  value={filterTab}
                  onChange={(_, v) => setFilterTab(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="Filter timeline by category"
                  sx={{
                    minHeight: 42,
                    '& .MuiTab-root': { minHeight: 42, textTransform: 'none', fontSize: 13, fontWeight: 700 },
                    '& .MuiTabs-indicator': { height: 3, borderRadius: 2, bgcolor: '#00838F' },
                  }}
                >
                  <Tab icon={<FilterAlt sx={{ fontSize: 16 }} />} iconPosition="start" label="All" />
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <Tab key={key} label={label} icon={categoryIcons[key] as React.ReactElement} iconPosition="start" />
                  ))}
                </Tabs>
              </Stack>

              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(_, nextView) => {
                  if (nextView !== null) setView(nextView)
                }}
                size="small"
                aria-label="Select timeline layout"
                sx={{
                  bgcolor: '#F8FAFC',
                  borderRadius: 3,
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    px: 1.6,
                    color: '#64748B',
                    '&.Mui-selected': { bgcolor: '#D9F2F4', color: '#0F766E' },
                  },
                }}
              >
                <ToggleButton value="timeline" aria-label="Timeline view"><ViewTimeline fontSize="small" /></ToggleButton>
                <ToggleButton value="agenda" aria-label="Agenda view"><ViewList fontSize="small" /></ToggleButton>
                <ToggleButton value="cards" aria-label="Cards view"><GridView fontSize="small" /></ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '280px 1fr' }, gap: 3 }}>
            <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0', display: { xs: 'none', lg: 'block' }, height: 'fit-content', position: 'sticky', top: 24 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#334155', letterSpacing: 0.2, mb: 2 }}>Category Pulse</Typography>
              <Stack spacing={1}>
                {Object.entries(categoryLabels).map(([key, label]) => {
                  const count = timeline.filter((event) => event.category === key).length
                  return (
                    <Box key={key} sx={{ p: 1.2, borderRadius: 2.5, border: '1px solid #EEF2F7', bgcolor: '#FFFFFF', transition: 'all 0.2s ease', '&:hover': { borderColor: `${categoryColors[key]}66`, transform: 'translateX(3px)' } }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: `${categoryColors[key]}22`, color: categoryColors[key], display: 'grid', placeItems: 'center' }}>{categoryIcons[key]}</Box>
                        <Typography sx={{ fontSize: 13, color: '#334155', fontWeight: 600, flex: 1 }}>{label}</Typography>
                        <Chip label={count} size="small" sx={{ bgcolor: `${categoryColors[key]}1A`, color: categoryColors[key], fontWeight: 700, height: 20 }} />
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Paper>

            <Box>
              {filteredEvents.length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #E2E8F0', textAlign: 'center', bgcolor: '#FFFFFF' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#334155', mb: 1.5 }}>No events found</Typography>
                  <Typography sx={{ color: '#64748B' }}>Try a different search term or remove category filters.</Typography>
                </Paper>
              ) : (
                <>
                  {view === 'timeline' && (
                    <Stack spacing={1.2}>
                      {visibleEvents.map((event) => (
                        <Accordion
                          key={event.id}
                          expanded={expandedEvents.includes(event.id)}
                          onChange={() => toggleExpanded(event.id)}
                          disableGutters
                          elevation={0}
                          sx={{
                            borderRadius: '16px !important',
                            border: '1px solid #E2E8F0',
                            overflow: 'hidden',
                            background: '#FFFFFF',
                            transition: 'all 0.24s ease',
                            '&:before': { display: 'none' },
                            '&:hover': { borderColor: '#00838F66', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)' },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore sx={{ color: '#475569' }} />}
                            sx={{ px: 2.2, py: 1.2, '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 } }}
                            aria-controls={`${event.id}-content`}
                            id={`${event.id}-header`}
                          >
                            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: { xs: 90, md: 124 } }}>
                              <Typography sx={{ fontSize: 13, color: '#0F766E', fontWeight: 800 }}>{formatTime(event.time)}</Typography>
                              {event.endTime && <Typography sx={{ fontSize: 12, color: '#64748B' }}>- {formatTime(event.endTime)}</Typography>}
                            </Stack>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontSize: 16, color: '#0F172A', fontWeight: 700 }}>{event.title}</Typography>
                              <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.2 }}>
                                {event.description || 'Tap to view complete event details, vendor handoff, and notes.'}
                              </Typography>
                              {renderSharedEventMeta(event)}
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0, pb: 2.2, px: 2.2 }}>
                            <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, bgcolor: '#F8FAFC', border: '1px dashed #CBD5E1' }}>
                              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#334155', mb: 1 }}>Event Details</Typography>
                              <Typography sx={{ fontSize: 14, color: '#334155', mb: 1.2 }}>
                                {event.description || 'No detailed notes yet. Add context to support your wedding team.'}
                              </Typography>
                              {event.vendors && event.vendors.length > 0 && (
                                <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
                                  {event.vendors.map((vendor) => (
                                    <Chip key={`${event.id}-full-${vendor}`} icon={<Person sx={{ fontSize: 14 }} />} label={vendor} variant="outlined" sx={{ borderColor: '#CBD5E1', color: '#334155' }} />
                                  ))}
                                </Stack>
                              )}
                              <Stack direction="row" spacing={0.8} justifyContent="flex-end">
                                <Tooltip title="Edit event"><IconButton onClick={() => handleOpenDialog(event)} aria-label={`Edit ${event.title}`}><Edit fontSize="small" /></IconButton></Tooltip>
                                <Tooltip title="Delete event"><IconButton onClick={() => handleDelete(event.id)} aria-label={`Delete ${event.title}`}><Delete fontSize="small" /></IconButton></Tooltip>
                              </Stack>
                            </Paper>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Stack>
                  )}

                  {view === 'agenda' && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                      {Object.entries(eventsBySession).map(([session, events]) => (
                        <Paper key={session} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 2, bgcolor: '#FFFFFF' }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A', mb: 1.5 }}>{session}</Typography>
                          <Stack spacing={1}>
                            {events.length === 0 && (
                              <Typography sx={{ fontSize: 13, color: '#94A3B8' }}>No events in this block.</Typography>
                            )}
                            {events.map((event) => (
                              <Card
                                key={event.id}
                                elevation={0}
                                sx={{
                                  border: '1px solid #EDF2F7',
                                  borderRadius: 2.5,
                                  p: 1.5,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  '&:hover': { borderColor: `${categoryColors[event.category]}66`, transform: 'translateY(-2px)' },
                                }}
                                onClick={() => toggleExpanded(event.id)}
                                aria-label={`Expand details for ${event.title}`}
                              >
                                <Typography sx={{ fontSize: 12, color: categoryColors[event.category], fontWeight: 800 }}>{formatTime(event.time)}</Typography>
                                <Typography sx={{ fontSize: 14, color: '#0F172A', fontWeight: 700, mb: 0.5 }}>{event.title}</Typography>
                                {expandedEvents.includes(event.id) && (
                                  <Typography sx={{ fontSize: 13, color: '#64748B' }}>{event.description || 'No notes yet.'}</Typography>
                                )}
                              </Card>
                            ))}
                          </Stack>
                        </Paper>
                      ))}
                    </Box>
                  )}

                  {view === 'cards' && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                      {visibleEvents.map((event) => (
                        <Card
                          key={event.id}
                          elevation={0}
                          sx={{
                            borderRadius: 3,
                            border: '1px solid #E2E8F0',
                            p: 2,
                            background: `linear-gradient(180deg, #FFFFFF 0%, ${categoryColors[event.category]}09 100%)`,
                            transition: 'all 0.24s ease',
                            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)' },
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" spacing={2}>
                            <Box>
                              <Typography sx={{ fontSize: 12, fontWeight: 800, color: categoryColors[event.category] }}>{formatTime(event.time)}</Typography>
                              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#0F172A', mt: 0.5 }}>{event.title}</Typography>
                              {renderSharedEventMeta(event)}
                              <Typography sx={{ fontSize: 13, color: '#475569', mt: 1.2 }}>
                                {event.description || 'Add event notes and owner actions for stronger execution.'}
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                              <IconButton onClick={() => handleOpenDialog(event)} aria-label={`Edit ${event.title}`}><Edit fontSize="small" /></IconButton>
                              <IconButton onClick={() => handleDelete(event.id)} aria-label={`Delete ${event.title}`}><Delete fontSize="small" /></IconButton>
                            </Stack>
                          </Stack>
                        </Card>
                      ))}
                    </Box>
                  )}

                  {hasMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5 }}>
                      <Button
                        onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                        variant="outlined"
                        sx={{ borderRadius: 6, textTransform: 'none', fontWeight: 700, borderColor: '#00838F66', color: '#0F766E' }}
                      >
                        Load more events
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.2} sx={{ mt: 0.5 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="End Time (optional)"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>

              <TextField label="Event Title" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} fullWidth />

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} label="Category" onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}>
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

              <TextField label="Location" value={formData.location} onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))} fullWidth />
              <TextField label="Vendors (comma-separated)" value={formData.vendors} onChange={(e) => setFormData((prev) => ({ ...prev, vendors: e.target.value }))} fullWidth />
              <TextField label="Description / Notes" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} fullWidth multiline rows={3} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!formData.time || !formData.title}
              sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 700 }}
            >
              {editingEvent ? 'Save Changes' : 'Add Event'}
            </Button>
          </DialogActions>
        </Dialog>

        <Footer />
      </Box>
  )
}
