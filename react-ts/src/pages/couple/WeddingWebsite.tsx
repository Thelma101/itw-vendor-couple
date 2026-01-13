import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Switch,
  FormControlLabel,
  Card,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import {
  Palette,
  Image,
  Event,
  LocationOn,
  Share,
  Visibility,
  Edit,
  ContentCopy,
  Check,
  PhotoCamera,
  Link as LinkIcon,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface WeddingWebsite {
  url: string
  published: boolean
  theme: string
  coverImage: string
  coupleNames: { partner1: string; partner2: string }
  weddingDate: string
  weddingTime: string
  venue: { name: string; address: string }
  story: string
  rsvpEnabled: boolean
  registryLinks: Array<{ name: string; url: string }>
  photos: string[]
  schedule: Array<{ time: string; event: string; location?: string }>
}

const themes = [
  { id: 'elegant', name: 'Elegant', primary: '#1a1a1a', secondary: '#d4af37', bg: '#faf9f6' },
  { id: 'romantic', name: 'Romantic', primary: '#8b4557', secondary: '#e8b4b8', bg: '#fff5f5' },
  { id: 'modern', name: 'Modern', primary: '#00838F', secondary: '#EB1948', bg: '#ffffff' },
  { id: 'garden', name: 'Garden', primary: '#2d5a27', secondary: '#a8d5a2', bg: '#f5faf5' },
  { id: 'beach', name: 'Beach', primary: '#1e6091', secondary: '#74c0fc', bg: '#f0f9ff' },
  { id: 'rustic', name: 'Rustic', primary: '#6b4423', secondary: '#d4a574', bg: '#fdf6ec' },
]

export default function WeddingWebsite() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [website, setWebsite] = useState<WeddingWebsite>({
    url: 'sarah-and-james',
    published: true,
    theme: 'modern',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop',
    coupleNames: { partner1: 'Sarah', partner2: 'James' },
    weddingDate: '2026-10-15',
    weddingTime: '14:00',
    venue: { name: 'Grand Ballroom', address: '123 Victoria Island, Lagos' },
    story: "We met at a coffee shop in 2020 and instantly connected over our shared love of travel and adventure. After three wonderful years together, James proposed during a sunset walk on the beach in Cape Town. We can't wait to celebrate our love with all of you!",
    rsvpEnabled: true,
    registryLinks: [
      { name: 'Amazon', url: 'https://amazon.com/registry/...' },
      { name: 'Zola', url: 'https://zola.com/registry/...' },
    ],
    photos: [
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=400&fit=crop',
    ],
    schedule: [
      { time: '14:00', event: 'Wedding Ceremony', location: 'Main Chapel' },
      { time: '15:00', event: 'Cocktail Hour', location: 'Garden Terrace' },
      { time: '16:00', event: 'Reception', location: 'Grand Ballroom' },
      { time: '18:00', event: 'Dinner Service' },
      { time: '20:00', event: 'First Dance & Party' },
    ],
  })

  const currentTheme = themes.find(t => t.id === website.theme) || themes[2]
  const websiteUrl = `https://itheewed.com/w/${website.url}`

  const copyUrl = () => {
    navigator.clipboard.writeText(websiteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateWebsite = (updates: Partial<WeddingWebsite>) => {
    setWebsite(prev => ({ ...prev, ...updates }))
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9' }}>
      <Nav />
      
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1a1a1a" gutterBottom>
              Wedding Website
            </Typography>
            <Typography color="text.secondary">
              Create a beautiful wedding website to share with your guests
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => setPreviewOpen(true)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<Share />}
              sx={{ bgcolor: '#EB1948', '&:hover': { bgcolor: '#c41438' }, borderRadius: 2, textTransform: 'none' }}
            >
              Share
            </Button>
          </Box>
        </Box>

        {/* Website URL Card */}
        <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinkIcon sx={{ color: '#00838F' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Your wedding website</Typography>
                <Typography fontWeight={600}>{websiteUrl}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={copied ? <Check /> : <ContentCopy />}
                onClick={copyUrl}
                sx={{ textTransform: 'none' }}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={website.published}
                    onChange={(e) => updateWebsite({ published: e.target.checked })}
                    color="primary"
                  />
                }
                label={website.published ? 'Published' : 'Draft'}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              size="small"
              label="Custom URL"
              value={website.url}
              onChange={(e) => updateWebsite({ url: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              slotProps={{
                input: { startAdornment: <Typography color="text.secondary" sx={{ mr: 0.5 }}>itheewed.com/w/</Typography> }
              }}
              sx={{ width: 350 }}
            />
          </Box>
        </Paper>

        {/* Editor Tabs */}
        <Paper sx={{ borderRadius: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              borderBottom: '1px solid #eee',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
              '& .Mui-selected': { color: '#00838F' },
              '& .MuiTabs-indicator': { bgcolor: '#00838F' },
            }}
          >
            <Tab icon={<Palette />} label="Design" iconPosition="start" />
            <Tab icon={<Edit />} label="Content" iconPosition="start" />
            <Tab icon={<Event />} label="Schedule" iconPosition="start" />
            <Tab icon={<Image />} label="Photos" iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Design Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>Choose a Theme</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2, mb: 4 }}>
                  {themes.map(theme => (
                    <Card
                      key={theme.id}
                      onClick={() => updateWebsite({ theme: theme.id })}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: website.theme === theme.id ? '2px solid #00838F' : '1px solid #eee',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#00838F' },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: theme.primary }} />
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: theme.secondary }} />
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: theme.bg, border: '1px solid #eee' }} />
                      </Box>
                      <Typography fontWeight={600}>{theme.name}</Typography>
                      {website.theme === theme.id && (
                        <Chip label="Active" size="small" sx={{ mt: 1, bgcolor: '#e8f5e9', color: '#2e7d32' }} />
                      )}
                    </Card>
                  ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={600} gutterBottom>Cover Image</Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundImage: `url(${website.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<PhotoCamera />}
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                      textTransform: 'none',
                    }}
                  >
                    Change Cover
                  </Button>
                </Box>
              </Box>
            )}

            {/* Content Tab */}
            {activeTab === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={600}>Couple Details</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Partner 1 Name"
                    value={website.coupleNames.partner1}
                    onChange={(e) => updateWebsite({ coupleNames: { ...website.coupleNames, partner1: e.target.value } })}
                  />
                  <TextField
                    label="Partner 2 Name"
                    value={website.coupleNames.partner2}
                    onChange={(e) => updateWebsite({ coupleNames: { ...website.coupleNames, partner2: e.target.value } })}
                  />
                </Box>

                <Divider />

                <Typography variant="h6" fontWeight={600}>Wedding Details</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Wedding Date"
                    type="date"
                    value={website.weddingDate}
                    onChange={(e) => updateWebsite({ weddingDate: e.target.value })}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    label="Wedding Time"
                    type="time"
                    value={website.weddingTime}
                    onChange={(e) => updateWebsite({ weddingTime: e.target.value })}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Box>
                <TextField
                  label="Venue Name"
                  value={website.venue.name}
                  onChange={(e) => updateWebsite({ venue: { ...website.venue, name: e.target.value } })}
                />
                <TextField
                  label="Venue Address"
                  value={website.venue.address}
                  onChange={(e) => updateWebsite({ venue: { ...website.venue, address: e.target.value } })}
                />

                <Divider />

                <Typography variant="h6" fontWeight={600}>Our Story</Typography>
                <TextField
                  multiline
                  rows={4}
                  value={website.story}
                  onChange={(e) => updateWebsite({ story: e.target.value })}
                  placeholder="Share your love story with your guests..."
                />

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={600}>RSVP</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={website.rsvpEnabled}
                        onChange={(e) => updateWebsite({ rsvpEnabled: e.target.checked })}
                      />
                    }
                    label="Enable RSVP"
                  />
                </Box>
              </Box>
            )}

            {/* Schedule Tab */}
            {activeTab === 2 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>Wedding Day Schedule</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => updateWebsite({
                      schedule: [...website.schedule, { time: '', event: '', location: '' }]
                    })}
                    sx={{ textTransform: 'none' }}
                  >
                    Add Event
                  </Button>
                </Box>

                {website.schedule.map((item, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto', gap: 2, alignItems: 'center' }}>
                      <TextField
                        label="Time"
                        type="time"
                        size="small"
                        value={item.time}
                        onChange={(e) => {
                          const newSchedule = [...website.schedule]
                          newSchedule[index].time = e.target.value
                          updateWebsite({ schedule: newSchedule })
                        }}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <TextField
                        label="Event"
                        size="small"
                        value={item.event}
                        onChange={(e) => {
                          const newSchedule = [...website.schedule]
                          newSchedule[index].event = e.target.value
                          updateWebsite({ schedule: newSchedule })
                        }}
                      />
                      <TextField
                        label="Location (optional)"
                        size="small"
                        value={item.location || ''}
                        onChange={(e) => {
                          const newSchedule = [...website.schedule]
                          newSchedule[index].location = e.target.value
                          updateWebsite({ schedule: newSchedule })
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newSchedule = website.schedule.filter((_, i) => i !== index)
                          updateWebsite({ schedule: newSchedule })
                        }}
                      >
                        ×
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}

            {/* Photos Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>Photo Gallery</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Add your favorite photos to share with guests
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
                  {website.photos.map((photo, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        paddingTop: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        '&:hover .overlay': { opacity: 1 },
                      }}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <IconButton sx={{ color: 'white' }}>
                          <Edit />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}

                  {/* Add Photo Button */}
                  <Box
                    sx={{
                      paddingTop: '100%',
                      position: 'relative',
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': { borderColor: '#00838F' },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 32, color: '#ccc', mb: 1 }} />
                      <Typography color="text.secondary">Add Photo</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Website Preview</Typography>
            <IconButton onClick={() => setPreviewOpen(false)}>×</IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {/* Preview Website */}
          <Box sx={{ bgcolor: currentTheme.bg, minHeight: 500 }}>
            {/* Hero Section */}
            <Box
              sx={{
                height: 350,
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${website.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Typography variant="overline" sx={{ letterSpacing: 4, mb: 1 }}>WE'RE GETTING MARRIED</Typography>
              <Typography variant="h2" fontWeight={700} sx={{ fontFamily: 'serif' }}>
                {website.coupleNames.partner1} & {website.coupleNames.partner2}
              </Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                {new Date(website.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600} sx={{ color: currentTheme.primary, mb: 2 }}>
                Our Story
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                {website.story}
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h5" fontWeight={600} sx={{ color: currentTheme.primary, mb: 2 }}>
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Venue
              </Typography>
              <Typography fontWeight={600}>{website.venue.name}</Typography>
              <Typography color="text.secondary">{website.venue.address}</Typography>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h5" fontWeight={600} sx={{ color: currentTheme.primary, mb: 2 }}>
                Schedule
              </Typography>
              {website.schedule.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography fontWeight={600}>{item.time} - {item.event}</Typography>
                  {item.location && <Typography variant="body2" color="text.secondary">{item.location}</Typography>}
                </Box>
              ))}

              {website.rsvpEnabled && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: currentTheme.primary,
                      '&:hover': { bgcolor: currentTheme.primary },
                      px: 6,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    RSVP Now
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  )
}
