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
  InputAdornment,
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
  Public,
  VisibilityOff,
  Delete,
  Close,
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
              Wedding Website
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666', mt: 0.5 }}>
              Create a beautiful wedding website to share with your guests
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => setPreviewOpen(true)}
              sx={{ borderColor: '#00838F', color: '#00838F', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<Share />}
              sx={{ bgcolor: '#EB1948', '&:hover': { bgcolor: '#c41438' }, borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              Share
            </Button>
          </Box>
        </Box>

        {/* Stats Cards Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: website.published ? '#e8f5e9' : '#fff3e0', borderRadius: 2 }}>
                {website.published ? <Public sx={{ color: '#4caf50' }} /> : <VisibilityOff sx={{ color: '#F5A623' }} />}
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Status</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: website.published ? '#4caf50' : '#F5A623' }}>
              {website.published ? 'Live' : 'Draft'}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              {website.published ? 'Visible to guests' : 'Not yet published'}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e8f5f5', borderRadius: 2 }}>
                <Palette sx={{ color: '#00838F' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Theme</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#002528' }}>
              {currentTheme.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: currentTheme.primary }} />
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: currentTheme.secondary }} />
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: currentTheme.bg, border: '1px solid #e0e0e0' }} />
            </Box>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#fce4ec', borderRadius: 2 }}>
                <Image sx={{ color: '#EB1948' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Photos</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#EB1948' }}>
              {website.photos.length}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              In gallery
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                <Event sx={{ color: '#1565c0' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Schedule</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#1565c0' }}>
              {website.schedule.length}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              Events planned
            </Typography>
          </Paper>
        </Box>

        {/* Website URL Card */}
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: '#e8f5f5', borderRadius: 2 }}>
                <LinkIcon sx={{ color: '#00838F' }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>Your wedding website</Typography>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528' }}>{websiteUrl}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={copied ? <Check /> : <ContentCopy />}
                onClick={copyUrl}
                sx={{ textTransform: 'none', fontFamily: "'Open Sans', sans-serif", fontWeight: 600, color: copied ? '#4caf50' : '#00838F' }}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={website.published}
                    onChange={(e) => updateWebsite({ published: e.target.checked })}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#4caf50' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4caf50' } }}
                  />
                }
                label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>{website.published ? 'Published' : 'Draft'}</Typography>}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              size="small"
              label="Custom URL"
              value={website.url}
              onChange={(e) => updateWebsite({ url: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Typography sx={{ color: '#666', fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>itheewed.com/w/</Typography></InputAdornment>,
                sx: { fontFamily: "'Open Sans', sans-serif", borderRadius: 2 }
              }}
              sx={{ width: 400 }}
            />
          </Box>
        </Paper>

        {/* Two Column Layout: Editor + Preview */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 400px' }, gap: 3 }}>
          {/* Editor Panel */}
          <Paper sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontFamily: "'Open Sans', sans-serif", minHeight: 56 },
                '& .Mui-selected': { color: '#00838F' },
                '& .MuiTabs-indicator': { bgcolor: '#00838F' },
              }}
            >
              <Tab icon={<Palette sx={{ fontSize: 20 }} />} label="Design" iconPosition="start" />
              <Tab icon={<Edit sx={{ fontSize: 20 }} />} label="Content" iconPosition="start" />
              <Tab icon={<Event sx={{ fontSize: 20 }} />} label="Schedule" iconPosition="start" />
              <Tab icon={<Image sx={{ fontSize: 20 }} />} label="Photos" iconPosition="start" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Design Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 600, color: '#002528', mb: 2 }}>Choose a Theme</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 2, mb: 4 }}>
                    {themes.map(theme => (
                      <Card
                        key={theme.id}
                        onClick={() => updateWebsite({ theme: theme.id })}
                        sx={{
                          p: 2, cursor: 'pointer', borderRadius: 2,
                          border: website.theme === theme.id ? '2px solid #00838F' : '1px solid #e0e0e0',
                          transition: 'all 0.2s', '&:hover': { borderColor: '#00838F' },
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5 }}>
                          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: theme.primary }} />
                          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: theme.secondary }} />
                          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: theme.bg, border: '1px solid #e0e0e0' }} />
                        </Box>
                        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14, color: '#002528' }}>{theme.name}</Typography>
                        {website.theme === theme.id && (
                          <Chip label="Active" size="small" sx={{ mt: 1, bgcolor: '#e8f5e9', color: '#2e7d32', height: 22, fontSize: 11, fontWeight: 600 }} />
                        )}
                      </Card>
                    ))}
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 600, color: '#002528', mb: 2 }}>Cover Image</Typography>
                  <Box
                    sx={{
                      width: '100%', height: 250, borderRadius: 3, overflow: 'hidden', position: 'relative',
                      backgroundImage: `url(${website.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<PhotoCamera />}
                      sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                    >
                      Change Cover
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Content Tab */}
              {activeTab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 600, color: '#002528' }}>Couple Details</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField label="Partner 1 Name" value={website.coupleNames.partner1} onChange={(e) => updateWebsite({ coupleNames: { ...website.coupleNames, partner1: e.target.value } })} />
                    <TextField label="Partner 2 Name" value={website.coupleNames.partner2} onChange={(e) => updateWebsite({ coupleNames: { ...website.coupleNames, partner2: e.target.value } })} />
                  </Box>

                  <Divider />

                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 600, color: '#002528' }}>Wedding Details</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField label="Wedding Date" type="date" value={website.weddingDate} onChange={(e) => updateWebsite({ weddingDate: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
                    <TextField label="Wedding Time" type="time" value={website.weddingTime} onChange={(e) => updateWebsite({ weddingTime: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
                  </Box>
                  <TextField label="Venue Name" value={website.venue.name} onChange={(e) => updateWebsite({ venue: { ...website.venue, name: e.target.value } })} />
                  <TextField label="Venue Address" value={website.venue.address} onChange={(e) => updateWebsite({ venue: { ...website.venue, address: e.target.value } })} />

                  <Divider />

                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 600, color: '#002528' }}>Our Story</Typography>
                  <TextField multiline rows={4} value={website.story} onChange={(e) => updateWebsite({ story: e.target.value })} placeholder="Share your love story with your guests..." />

                  <Divider />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 600, color: '#002528' }}>RSVP</Typography>
                    <FormControlLabel
                      control={<Switch checked={website.rsvpEnabled} onChange={(e) => updateWebsite({ rsvpEnabled: e.target.checked })} />}
                      label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>Enable RSVP</Typography>}
                    />
                  </Box>
                </Box>
              )}

              {/* Schedule Tab */}
              {activeTab === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 600, color: '#002528' }}>Wedding Day Schedule</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => updateWebsite({ schedule: [...website.schedule, { time: '', event: '', location: '' }] })}
                      sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, borderColor: '#00838F', color: '#00838F' }}
                    >
                      Add Event
                    </Button>
                  </Box>

                  {website.schedule.map((item, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '100px 1fr 1fr auto' }, gap: 2, alignItems: 'center' }}>
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
                          label="Location"
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
                          sx={{ color: '#999' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* Photos Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 600, color: '#002528', mb: 1 }}>Photo Gallery</Typography>
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666', mb: 3 }}>
                    Add your favorite photos to share with guests
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
                    {website.photos.map((photo, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative', paddingTop: '100%', borderRadius: 2, overflow: 'hidden',
                          '&:hover .overlay': { opacity: 1 },
                        }}
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Box
                          className="overlay"
                          sx={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: 'opacity 0.2s', gap: 1,
                          }}
                        >
                          <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}

                    <Box
                      sx={{
                        paddingTop: '100%', position: 'relative', border: '2px dashed #ccc', borderRadius: 2,
                        cursor: 'pointer', '&:hover': { borderColor: '#00838F', bgcolor: '#f5f5f5' },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <PhotoCamera sx={{ fontSize: 32, color: '#ccc', mb: 1 }} />
                        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#999' }}>Add Photo</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Live Preview Sidebar */}
          <Paper sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden', height: 'fit-content', display: { xs: 'none', xl: 'block' } }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#002528' }}>Live Preview</Typography>
              <Chip label="Desktop" size="small" sx={{ fontSize: 11, height: 22 }} />
            </Box>
            <Box sx={{ bgcolor: currentTheme.bg, height: 500, overflowY: 'auto' }}>
              {/* Mini Hero */}
              <Box
                sx={{
                  height: 140, backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${website.coverImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center',
                }}
              >
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, letterSpacing: 2, mb: 0.5 }}>WE'RE GETTING MARRIED</Typography>
                <Typography sx={{ fontFamily: "serif", fontSize: 20, fontWeight: 700 }}>
                  {website.coupleNames.partner1} & {website.coupleNames.partner2}
                </Typography>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, mt: 0.5 }}>
                  {new Date(website.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Typography>
              </Box>

              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: currentTheme.primary, mb: 1 }}>Our Story</Typography>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666', lineHeight: 1.6 }}>
                  {website.story.slice(0, 150)}...
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: currentTheme.primary, mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  Venue
                </Typography>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>{website.venue.name}</Typography>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>{website.venue.address}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: currentTheme.primary, mb: 1 }}>Schedule</Typography>
                {website.schedule.slice(0, 3).map((item, i) => (
                  <Box key={i} sx={{ mb: 1 }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>{item.time && formatTime(item.time)} - {item.event}</Typography>
                  </Box>
                ))}
                {website.schedule.length > 3 && (
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, color: '#999' }}>+{website.schedule.length - 3} more events</Typography>
                )}

                {website.rsvpEnabled && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 2, bgcolor: currentTheme.primary, '&:hover': { bgcolor: currentTheme.primary }, textTransform: 'none', fontWeight: 600, fontSize: 12 }}
                  >
                    RSVP Now
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Full Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600 }}>Website Preview</Typography>
          <IconButton onClick={() => setPreviewOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ bgcolor: currentTheme.bg, minHeight: 500 }}>
            <Box
              sx={{
                height: 350, backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${website.coverImage})`,
                backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center',
              }}
            >
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, letterSpacing: 4, mb: 1 }}>WE'RE GETTING MARRIED</Typography>
              <Typography sx={{ fontFamily: "serif", fontSize: 48, fontWeight: 700 }}>
                {website.coupleNames.partner1} & {website.coupleNames.partner2}
              </Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 20, mt: 2 }}>
                {new Date(website.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>

            <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, textAlign: 'center' }}>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 24, fontWeight: 600, color: currentTheme.primary, mb: 2 }}>Our Story</Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', mb: 4, lineHeight: 1.8 }}>{website.story}</Typography>

              <Divider sx={{ my: 4 }} />

              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 24, fontWeight: 600, color: currentTheme.primary, mb: 2 }}>
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Venue
              </Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600 }}>{website.venue.name}</Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666' }}>{website.venue.address}</Typography>

              <Divider sx={{ my: 4 }} />

              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 24, fontWeight: 600, color: currentTheme.primary, mb: 2 }}>Schedule</Typography>
              {website.schedule.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600 }}>{item.time && formatTime(item.time)} - {item.event}</Typography>
                  {item.location && <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>{item.location}</Typography>}
                </Box>
              ))}

              {website.rsvpEnabled && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ bgcolor: currentTheme.primary, '&:hover': { bgcolor: currentTheme.primary }, px: 6, py: 1.5, textTransform: 'none', fontWeight: 600 }}
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
