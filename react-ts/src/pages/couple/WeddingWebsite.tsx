import { useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { ExpandMore, Language, Publish, Lock, Public, BarChart, LocalDining } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'
import FloatingNoteButton from '@/components/couple/FloatingNoteButton'

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface HotelBlock {
  id: string
  name: string
  address: string
  discount: string
  bookingUrl: string
}

interface WebsiteDraft {
  title: string
  subtitle: string
  story: string
  template: string
  fontFamily: string
  colorPalette: string
  faqItems: FAQItem[]
  hotelBlocks: HotelBlock[]
  matchStationery: boolean
  isPublished: boolean
  requiresPassword: boolean
  password: string
  customDomain: string
  enableAnalytics: boolean
  enableAdvancedRsvp: boolean
}

const key = 'itw_website'

// Template categories with templates
const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'romantic', label: 'Romantic' },
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'beach', label: 'Beach' },
  { id: 'warm', label: 'Warm' },
  { id: 'dramatic', label: 'Dramatic' },
  { id: 'rustic', label: 'Rustic' },
  { id: 'glamour', label: 'Glamour' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'boho', label: 'Boho' },
  { id: 'botanical', label: 'Botanical' },
]

// Template definitions with color palettes
const TEMPLATE_LIBRARY = [
  {
    id: 'eternal-love',
    name: 'Eternal Love',
    category: 'romantic',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    colors: ['#1a1a1a', '#e91e63', '#0288d1', '#673ab7', '#ff9800'],
  },
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    category: 'modern',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    colors: ['#000000', '#e91e63', '#0288d1', '#673ab7', '#bdbdbd'],
  },
  {
    id: 'timeless-classic',
    name: 'Timeless Classic',
    category: 'classic',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    colors: ['#2c2c2c', '#d81b60', '#1976d2', '#512da8', '#fff59d'],
  },
  {
    id: 'beach-breeze',
    name: 'Beach Breeze',
    category: 'beach',
    image: 'https://images.unsplash.com/photo-1519225421421-fa52c8b67d4d?w=800',
    colors: ['#00838f', '#00bcd4', '#81c784', '#ffeb3b', '#fff9c4'],
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    category: 'warm',
    image: 'https://images.unsplash.com/photo-1519667882399-924fce2bada1?w=800',
    colors: ['#8b6914', '#ffa500', '#ff8c42', '#ffb347', '#ffe4b5'],
  },
  {
    id: 'dramatic-elegance',
    name: 'Dramatic Elegance',
    category: 'dramatic',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800',
    colors: ['#1a1a2e', '#16213e', '#e94560', '#d4a574', '#0f3460'],
  },
  {
    id: 'rustic-charm',
    name: 'Rustic Charm',
    category: 'rustic',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    colors: ['#6b4423', '#8b5a3c', '#d4a574', '#a0826d', '#c19a6b'],
  },
  {
    id: 'glamorous',
    name: 'Glamorous',
    category: 'glamour',
    image: 'https://images.unsplash.com/photo-1519741040246-84a7b64e9b31?w=800',
    colors: ['#2a2a2a', '#d4af37', '#c0c0c0', '#ffd700', '#27251f'],
  },
  {
    id: 'zen-minimal',
    name: 'Zen Minimal',
    category: 'minimalist',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800',
    colors: ['#ffffff', '#f0f0f0', '#cccccc', '#808080', '#333333'],
  },
  {
    id: 'boho-chic',
    name: 'Boho Chic',
    category: 'boho',
    image: 'https://images.unsplash.com/photo-1519225421421-fa52c8b67d4d?w=800',
    colors: ['#d4a574', '#8b7355', '#daa520', '#ff69b4', '#20b2aa'],
  },
  {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    category: 'botanical',
    image: 'https://images.unsplash.com/photo-1519741040246-84a7b64e9b31?w=800',
    colors: ['#228b22', '#6b8e23', '#3cb371', '#87ceeb', '#daa520'],
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    category: 'romantic',
    image: 'https://images.unsplash.com/photo-1519667881351-b36ae43fc0d8?w=800',
    colors: ['#b76e79', '#f0a8a8', '#daa520', '#ffffff', '#8b6f47'],
  },
]

const FONTS = [
  'Inter',
  'Playfair Display',
  'Cormorant Garamond',
  'Montserrat',
  'Lora',
  'Raleway',
  'Poppins',
  'Merriweather',
  'Roboto',
  'Quicksand',
  'Opensans',
  'Crimson Text',
  'DM Sans',
  'Syne',
]

const readDraft = (): WebsiteDraft => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return {
        title: 'Our Wedding Day',
        subtitle: 'Join us for the celebration',
        story: '',
        template: 'eternal-love',
        fontFamily: 'Playfair Display',
        colorPalette: '#e91e63',
        faqItems: [],
        hotelBlocks: [],
        matchStationery: false,
        isPublished: false,
        requiresPassword: false,
        password: '',
        customDomain: '',
        enableAnalytics: false,
        enableAdvancedRsvp: false,
      }
    }
    const parsed = JSON.parse(raw) as WebsiteDraft
    return {
      title: parsed.title || 'Our Wedding Day',
      subtitle: parsed.subtitle || 'Join us for the celebration',
      story: parsed.story || '',
      template: parsed.template || 'eternal-love',
      fontFamily: parsed.fontFamily || 'Playfair Display',
      colorPalette: parsed.colorPalette || '#e91e63',
      faqItems: parsed.faqItems || [],
      hotelBlocks: parsed.hotelBlocks || [],
      matchStationery: Boolean(parsed.matchStationery),
      isPublished: Boolean(parsed.isPublished),
      requiresPassword: Boolean(parsed.requiresPassword),
      password: parsed.password || '',
      customDomain: parsed.customDomain || '',
      enableAnalytics: Boolean(parsed.enableAnalytics),
      enableAdvancedRsvp: Boolean(parsed.enableAdvancedRsvp),
    }
  } catch {
    return {
      title: 'Our Wedding Day',
      subtitle: 'Join us for the celebration',
      story: '',
      template: 'eternal-love',
      fontFamily: 'Playfair Display',
      colorPalette: '#e91e63',
      faqItems: [],
      hotelBlocks: [],
      matchStationery: false,
      isPublished: false,
      requiresPassword: false,
      password: '',
      customDomain: '',
      enableAnalytics: false,
      enableAdvancedRsvp: false,
    }
  }
}

export default function WeddingWebsite() {
  const [draft, setDraft] = useState<WebsiteDraft>(readDraft)
  const [tabIndex, setTabIndex] = useState(0)
  const [newFaqQuestion, setNewFaqQuestion] = useState('')
  const [newFaqAnswer, setNewFaqAnswer] = useState('')
  const [newHotelName, setNewHotelName] = useState('')
  const [newHotelAddress, setNewHotelAddress] = useState('')
  const [newHotelDiscount, setNewHotelDiscount] = useState('')
  const [newHotelUrl, setNewHotelUrl] = useState('')

  const update = (next: WebsiteDraft) => {
    setDraft(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  const previewUrl = draft.customDomain
    ? `${draft.customDomain}.wedding`
    : `itheewed.com/${draft.title.toLowerCase().replace(/\s+/g, '-')}`

  const addFaqItem = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      const newItem: FAQItem = {
        id: Date.now().toString(),
        question: newFaqQuestion,
        answer: newFaqAnswer,
      }
      update({ ...draft, faqItems: [...draft.faqItems, newItem] })
      setNewFaqQuestion('')
      setNewFaqAnswer('')
    }
  }

  const removeFaqItem = (id: string) => {
    update({ ...draft, faqItems: draft.faqItems.filter((item) => item.id !== id) })
  }

  const addHotelBlock = () => {
    if (newHotelName.trim() && newHotelAddress.trim()) {
      const newHotel: HotelBlock = {
        id: Date.now().toString(),
        name: newHotelName,
        address: newHotelAddress,
        discount: newHotelDiscount,
        bookingUrl: newHotelUrl,
      }
      update({ ...draft, hotelBlocks: [...draft.hotelBlocks, newHotel] })
      setNewHotelName('')
      setNewHotelAddress('')
      setNewHotelDiscount('')
      setNewHotelUrl('')
    }
  }

  const removeHotelBlock = (id: string) => {
    update({ ...draft, hotelBlocks: draft.hotelBlocks.filter((hotel) => hotel.id !== id) })
  }

  const [templateCategory, setTemplateCategory] = useState('all')
  const filteredTemplates = templateCategory === 'all' ? TEMPLATE_LIBRARY : TEMPLATE_LIBRARY.filter((t) => t.category === templateCategory)

  return (
    <CouplePageShell
      title="Wedding Website"
      subtitle="Publish a beautiful guest-facing page with strong privacy controls and clear content flow."
      badge={draft.isPublished ? 'Published' : 'Draft'}
      actions={
        <Button
          variant="contained"
          startIcon={<Publish />}
          onClick={() => update({ ...draft, isPublished: true })}
          sx={{ bgcolor: '#EB1948', textTransform: 'none', fontWeight: 700, borderRadius: 6, '&:hover': { bgcolor: '#C41438' } }}
        >
          Publish
        </Button>
      }
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.2fr 1fr' }, gap: 2.5 }}>
        {/* Main Content Editor */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Tabs for different sections */}
          <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 0 }}>
            <Tabs
              value={tabIndex}
              onChange={(_, newValue) => setTabIndex(newValue)}
              sx={{
                borderBottom: '1px solid #E2E8F0',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
              }}
            >
              <Tab label="Basic Content" />
              <Tab label="Design & Fonts" />
              <Tab label="Guest Q&A" />
              <Tab label="Hotel Blocks" />
              <Tab label="Advanced Settings" />
            </Tabs>

            {/* TAB 1: Basic Content */}
            {tabIndex === 0 && (
              <Box sx={{ p: 2.2 }}>
                <Stack spacing={1.8}>
                  <TextField
                    label="Page title"
                    value={draft.title}
                    onChange={(event) => update({ ...draft, title: event.target.value })}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Subtitle"
                    value={draft.subtitle}
                    onChange={(event) => update({ ...draft, subtitle: event.target.value })}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Your Story"
                    value={draft.story}
                    onChange={(event) => update({ ...draft, story: event.target.value })}
                    fullWidth
                    multiline
                    rows={5}
                    size="small"
                    helperText="Tell your love story in your own words"
                  />
                </Stack>
              </Box>
            )}

            {/* TAB 2: Design & Fonts */}
            {tabIndex === 1 && (
              <Box sx={{ p: 2.2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1.2, color: '#0F172A' }}>Website Template</Typography>
                    
                    {/* Category Filter */}
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      {TEMPLATE_CATEGORIES.map((cat) => (
                        <Chip
                          key={cat.id}
                          label={cat.label}
                          onClick={() => setTemplateCategory(cat.id)}
                          sx={{
                            bgcolor: templateCategory === cat.id ? '#00838F' : '#E2E8F0',
                            color: templateCategory === cat.id ? '#fff' : '#0F172A',
                            fontWeight: templateCategory === cat.id ? 700 : 500,
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </Stack>

                    {/* Template Grid */}
                    <Grid container spacing={2}>
                      {filteredTemplates.map((tmpl) => (
                        <Grid size={{ xs: 6, sm: 4 }} key={tmpl.id}>
                          <Card
                            onClick={() => update({ ...draft, template: tmpl.id, colorPalette: tmpl.colors[0] })}
                            sx={{
                              cursor: 'pointer',
                              border: draft.template === tmpl.id ? '3px solid #00838F' : '1px solid #E2E8F0',
                              overflow: 'hidden',
                              transition: 'all 0.2s',
                              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(15,23,42,0.12)' },
                            }}
                          >
                            {/* Template Preview */}
                            <Box
                              sx={{
                                height: 120,
                                backgroundColor: '#F0F4F8',
                                backgroundImage: `url(${tmpl.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            />
                            
                            {/* Template Info */}
                            <Box sx={{ p: 1.2 }}>
                              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0F172A', mb: 0.8 }}>{tmpl.name}</Typography>
                              
                              {/* Color Palette */}
                              <Stack direction="row" spacing={0.5}>
                                {tmpl.colors.map((color, idx) => (
                                  <Box
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      update({ ...draft, template: tmpl.id, colorPalette: color })
                                    }}
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: '50%',
                                      backgroundColor: color,
                                      border: draft.colorPalette === color && draft.template === tmpl.id ? '2px solid #0F172A' : '1px solid #E2E8F0',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      '&:hover': { transform: 'scale(1.2)' },
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1, color: '#0F172A' }}>Font Customisation</Typography>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.2 }}>Choose from 14 premium fonts</Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel>Font Family</InputLabel>
                      <Select
                        value={draft.fontFamily}
                        label="Font Family"
                        onChange={(event) => update({ ...draft, fontFamily: event.target.value })}
                      >
                        {FONTS.map((font) => (
                          <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                            {font}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Divider />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Matching Stationery</Typography>
                      <Typography sx={{ fontSize: 12, color: '#64748B' }}>Apply website theme to stationery items</Typography>
                    </Box>
                    <Switch checked={draft.matchStationery} onChange={(event) => update({ ...draft, matchStationery: event.target.checked })} />
                  </Stack>
                </Stack>
              </Box>
            )}

            {/* TAB 3: Guest Q&A */}
            {tabIndex === 2 && (
              <Box sx={{ p: 2.2 }}>
                <Stack spacing={1.8}>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1, color: '#0F172A' }}>Guest Q&A / FAQ</Typography>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.2 }}>Add frequently asked questions to help your guests</Typography>
                  </Box>

                  {draft.faqItems.length > 0 && (
                    <Box>
                      {draft.faqItems.map((item) => (
                        <Accordion key={item.id} disableGutters elevation={0} sx={{ border: '1px solid #E2E8F0', mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{item.question}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Stack spacing={1} sx={{ width: '100%' }}>
                              <Typography sx={{ fontSize: 13, color: '#475569' }}>{item.answer}</Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => removeFaqItem(item.id)}
                                sx={{ alignSelf: 'flex-start' }}
                              >
                                Remove
                              </Button>
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  )}

                  <Divider />

                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1, color: '#0F172A' }}>Add New FAQ</Typography>
                    <Stack spacing={1}>
                      <TextField
                        label="Question"
                        value={newFaqQuestion}
                        onChange={(event) => setNewFaqQuestion(event.target.value)}
                        fullWidth
                        size="small"
                        placeholder="e.g., What time is the ceremony?"
                      />
                      <TextField
                        label="Answer"
                        value={newFaqAnswer}
                        onChange={(event) => setNewFaqAnswer(event.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        placeholder="Provide a helpful answer"
                      />
                      <Button variant="contained" onClick={addFaqItem} sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 600 }}>
                        Add FAQ Item
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* TAB 4: Hotel Blocks */}
            {tabIndex === 3 && (
              <Box sx={{ p: 2.2 }}>
                <Stack spacing={1.8}>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1, color: '#0F172A' }}>Hotel Blocks & Travel</Typography>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.2 }}>Recommend hotels and provide booking information for guests</Typography>
                  </Box>

                  {draft.hotelBlocks.length > 0 && (
                    <Box>
                      {draft.hotelBlocks.map((hotel) => (
                        <Card key={hotel.id} sx={{ p: 1.5, mb: 1, border: '1px solid #E2E8F0' }}>
                          <Stack spacing={0.8}>
                            <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{hotel.name}</Typography>
                            <Typography sx={{ fontSize: 12, color: '#64748B' }}>{hotel.address}</Typography>
                            {hotel.discount && <Chip label={`${hotel.discount} discount`} size="small" sx={{ width: 'fit-content' }} />}
                            <Stack direction="row" spacing={1}>
                              {hotel.bookingUrl && (
                                <Button size="small" href={hotel.bookingUrl} target="_blank" variant="outlined">
                                  Book
                                </Button>
                              )}
                              <Button size="small" color="error" variant="outlined" onClick={() => removeHotelBlock(hotel.id)}>
                                Remove
                              </Button>
                            </Stack>
                          </Stack>
                        </Card>
                      ))}
                    </Box>
                  )}

                  <Divider />

                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1, color: '#0F172A' }}>Add Hotel Block</Typography>
                    <Stack spacing={1}>
                      <TextField
                        label="Hotel Name"
                        value={newHotelName}
                        onChange={(event) => setNewHotelName(event.target.value)}
                        fullWidth
                        size="small"
                        placeholder="e.g., Sheraton Lagos"
                      />
                      <TextField
                        label="Address"
                        value={newHotelAddress}
                        onChange={(event) => setNewHotelAddress(event.target.value)}
                        fullWidth
                        size="small"
                        placeholder="Hotel location"
                      />
                      <TextField
                        label="Guest Discount (Optional)"
                        value={newHotelDiscount}
                        onChange={(event) => setNewHotelDiscount(event.target.value)}
                        fullWidth
                        size="small"
                        placeholder="e.g., 15%"
                      />
                      <TextField
                        label="Booking URL (Optional)"
                        value={newHotelUrl}
                        onChange={(event) => setNewHotelUrl(event.target.value)}
                        fullWidth
                        size="small"
                        placeholder="https://..."
                      />
                      <Button variant="contained" onClick={addHotelBlock} sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 600 }}>
                        Add Hotel Block
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* TAB 5: Advanced Settings */}
            {tabIndex === 4 && (
              <Box sx={{ p: 2.2 }}>
                <Stack spacing={2}>
                  {/* Privacy Controls */}
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1.2, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Lock sx={{ fontSize: 18 }} />
                      Privacy Controls
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Require password</Typography>
                          <Typography sx={{ fontSize: 11, color: '#64748B' }}>Password-protect your wedding website</Typography>
                        </Box>
                        <Switch checked={draft.requiresPassword} onChange={(event) => update({ ...draft, requiresPassword: event.target.checked })} />
                      </Stack>
                      {draft.requiresPassword && (
                        <TextField
                          label="Guest password"
                          value={draft.password}
                          onChange={(event) => update({ ...draft, password: event.target.value })}
                          size="small"
                          type="password"
                        />
                      )}
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Custom Domain (Premium) */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Public sx={{ fontSize: 18, color: '#0F766E' }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Custom Domain</Typography>
                      <Chip label="Premium" size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: 10 }} />
                    </Stack>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1 }}>Use your own domain (e.g. sarah-and-james.com)</Typography>
                    <TextField
                      label="Custom Domain"
                      value={draft.customDomain}
                      onChange={(event) => update({ ...draft, customDomain: event.target.value })}
                      fullWidth
                      size="small"
                      placeholder="sarah-and-james"
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">.wedding</InputAdornment>,
                        },
                      }}
                    />
                  </Box>

                  <Divider />

                  {/* Website Analytics (Premium) */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <BarChart sx={{ fontSize: 18, color: '#0F766E' }} />
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Website Analytics</Typography>
                          <Chip label="Premium" size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: 10, mt: 0.5 }} />
                        </Box>
                      </Stack>
                      <Typography sx={{ fontSize: 11, color: '#64748B', mt: 0.5 }}>Track visits, RSVP rates, and engagement</Typography>
                    </Box>
                    <Switch checked={draft.enableAnalytics} onChange={(event) => update({ ...draft, enableAnalytics: event.target.checked })} />
                  </Stack>

                  <Divider />

                  {/* Advanced RSVP (Premium) */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocalDining sx={{ fontSize: 18, color: '#0F766E' }} />
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Advanced RSVP + Meal Choice</Typography>
                          <Chip label="Premium" size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: 10, mt: 0.5 }} />
                        </Box>
                      </Stack>
                      <Typography sx={{ fontSize: 11, color: '#64748B', mt: 0.5 }}>Meal selection, dietary notes, and song requests</Typography>
                    </Box>
                    <Switch checked={draft.enableAdvancedRsvp} onChange={(event) => update({ ...draft, enableAdvancedRsvp: event.target.checked })} />
                  </Stack>
                </Stack>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Live Preview Panel */}
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 2.2, height: 'fit-content', position: 'sticky', top: 80 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
            <Language sx={{ color: '#0F766E' }} />
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Live Preview</Typography>
          </Stack>

          <Box
            sx={{
              border: '1px solid #E2E8F0',
              borderRadius: 3,
              p: 2,
              bgcolor: '#FCFDFE',
              fontFamily: draft.fontFamily,
              mb: 1.8,
            }}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0B2D31', fontFamily: draft.fontFamily }}>{draft.title || 'Untitled wedding page'}</Typography>
            <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.8 }}>{draft.subtitle}</Typography>
            <Typography sx={{ fontSize: 12, color: '#475569', mt: 1.2, lineHeight: 1.5 }}>{draft.story || 'Your story will appear here in a refined narrative layout.'}</Typography>

            {draft.faqItems.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0F172A', mb: 1 }}>FAQs ({draft.faqItems.length})</Typography>
                <Box sx={{ fontSize: 11, color: '#64748B' }}>Guest questions available</Box>
              </Box>
            )}

            {draft.hotelBlocks.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0F172A', mb: 1 }}>Hotels ({draft.hotelBlocks.length})</Typography>
                <Box sx={{ fontSize: 11, color: '#64748B' }}>Recommended accommodations</Box>
              </Box>
            )}
          </Box>

          <Stack spacing={1}>
            <Chip
              label={draft.isPublished ? 'Publicly accessible' : 'Not yet published'}
              sx={{ alignSelf: 'flex-start', bgcolor: draft.isPublished ? '#DCFCE7' : '#FEF3C7', color: draft.isPublished ? '#166534' : '#92400E', fontWeight: 700 }}
            />
            <Typography sx={{ fontSize: 12, color: '#64748B', wordBreak: 'break-all' }}>
              <strong>URL:</strong> {previewUrl}
            </Typography>

            {draft.matchStationery && <Chip label="✓ Stationery matched" size="small" sx={{ bgcolor: '#DCFCE7', color: '#166534', alignSelf: 'flex-start' }} />}
            {draft.requiresPassword && <Chip label="🔒 Password protected" size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', alignSelf: 'flex-start' }} />}
            {draft.enableAnalytics && <Chip label="📊 Analytics enabled" size="small" sx={{ bgcolor: '#EFF6FF', color: '#1E40AF', alignSelf: 'flex-start' }} />}
            {draft.enableAdvancedRsvp && <Chip label="🍽️ Advanced RSVP" size="small" sx={{ bgcolor: '#F3E8FF', color: '#6B21A8', alignSelf: 'flex-start' }} />}
          </Stack>
        </Paper>
      </Box>
      <FloatingNoteButton />
    </CouplePageShell>
  )
}
