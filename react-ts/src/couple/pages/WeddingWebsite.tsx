import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
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
import {
  ExpandMore,
  Language,
  Publish,
  Lock,
  Public,
  BarChart,
  LocalDining,
  OpenInNew,
  AddPhotoAlternateOutlined,
  DeleteOutline,
  ContentCopy,
  VisibilityOff,
} from '@mui/icons-material'
import CouplePageShell from '@/couple/components/CouplePageShell'
import FloatingNoteButton from '@/couple/components/FloatingNoteButton'
import SoftGate from '@/shared/components/SoftGate'
import { useAccount } from '@/shared/contexts/AccountContext'
import { apiErrorMessage, websiteApi, type WeddingSite } from '@/shared/lib/api'
import { uploadImage } from '@/shared/lib/imageCompress'
import { coupleIdentity } from '@/couple/planning-live/coupleIdentity'
import {
  type FAQItem,
  type HotelBlock,
  type ScheduleItem,
  type WebsiteDraft,
  MAX_GALLERY_PHOTOS,
  defaultDraft,
  draftToServerData,
  normalizeDraft,
  publicSiteUrl,
  slugify,
} from '@/couple/planning-live/weddingWebsite'

const key = 'itw_website'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function IconButtonSmall({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={label}
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: 4,
        right: 4,
        width: 26,
        height: 26,
        borderRadius: '50%',
        border: 'none',
        bgcolor: 'rgba(15,23,42,0.65)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
      }}
    >
      <DeleteOutline sx={{ fontSize: 16 }} />
    </Box>
  )
}

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
    return raw ? normalizeDraft(JSON.parse(raw)) : defaultDraft()
  } catch {
    return defaultDraft()
  }
}

export default function WeddingWebsite() {
  const navigate = useNavigate()
  const { isDemo, user, profile, loading: accountLoading } = useAccount()
  const live = !isDemo
  const [draft, setDraft] = useState<WebsiteDraft>(() => (live ? defaultDraft() : readDraft()))
  const [tabIndex, setTabIndex] = useState(0)
  const [newFaqQuestion, setNewFaqQuestion] = useState('')
  const [newFaqAnswer, setNewFaqAnswer] = useState('')
  const [newHotelName, setNewHotelName] = useState('')
  const [newHotelAddress, setNewHotelAddress] = useState('')
  const [newHotelDiscount, setNewHotelDiscount] = useState('')
  const [newHotelUrl, setNewHotelUrl] = useState('')
  const [publishNote, setPublishNote] = useState('')

  const [siteLoading, setSiteLoading] = useState(live)
  const [siteError, setSiteError] = useState('')
  const [siteLoaded, setSiteLoaded] = useState(false)
  const [slug, setSlug] = useState('')
  const [slugInput, setSlugInput] = useState('')
  const [published, setPublished] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [uploading, setUploading] = useState<'hero' | 'gallery' | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [newSlot, setNewSlot] = useState({ time: '', title: '', detail: '' })
  const draftRef = useRef(draft)
  draftRef.current = draft
  const editVersion = useRef(0)
  const loadStarted = useRef(false)

  const update = (next: WebsiteDraft) => {
    setDraft(next)
    if (live) {
      draftRef.current = next
      editVersion.current += 1
      setDirty(true)
      return
    }
    localStorage.setItem(key, JSON.stringify(next))
  }

  const prefilledDraft = (): WebsiteDraft => {
    const identity = coupleIdentity(user, profile)
    const names = identity.displayName !== 'Your wedding' ? identity.displayName : ''
    return {
      ...defaultDraft(),
      title: names || 'Our Wedding Day',
      weddingDate: identity.weddingDate,
      venue: identity.venue,
      location: identity.location,
    }
  }

  const applySite = (site: WeddingSite) => {
    setSlug(site.slug)
    setSlugInput(site.slug)
    setPublished(site.published)
  }

  const loadSite = async () => {
    setSiteLoading(true)
    setSiteError('')
    try {
      const site = await websiteApi.mine()
      const next = site ? normalizeDraft(site.data) : prefilledDraft()
      setDraft(next)
      draftRef.current = next
      if (site) applySite(site)
      setDirty(false)
      setSiteLoaded(true)
    } catch (err) {
      setSiteError(apiErrorMessage(err, 'Could not load your wedding website. Please try again.'))
    } finally {
      setSiteLoading(false)
    }
  }

  useEffect(() => {
    if (!live || accountLoading || loadStarted.current) return
    loadStarted.current = true
    void loadSite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, accountLoading])

  /** Saves the current draft to the account; resolves with the saved site or null on failure. */
  const persist = async (body: { published?: boolean; slug?: string } = {}): Promise<WeddingSite | null> => {
    const version = editVersion.current
    setSaveState('saving')
    setSaveError('')
    try {
      const site = await websiteApi.save({
        data: draftToServerData(draftRef.current),
        slug: body.slug ?? (slug || slugify(draftRef.current.title)),
        ...(body.published !== undefined ? { published: body.published } : {}),
      })
      applySite(site)
      if (editVersion.current === version) setDirty(false)
      setSaveState('saved')
      return site
    } catch (err) {
      setSaveState('error')
      setSaveError(apiErrorMessage(err, 'Could not save your website. Check your connection and try again.'))
      return null
    }
  }

  useEffect(() => {
    if (!live || !dirty || !siteLoaded) return
    const timer = window.setTimeout(() => void persist(), 1200)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, dirty, siteLoaded, draft])

  const handlePublishLive = async () => {
    setPublishing(true)
    const site = await persist({ published: true })
    setPublishing(false)
    if (site) setPublishNote(`Your website is live at ${publicSiteUrl(site.slug)}`)
  }

  const handleUnpublish = async () => {
    setPublishing(true)
    try {
      const site = await websiteApi.save({ published: false })
      applySite(site)
      setPublishNote('Your website is now hidden from guests. Publish again whenever you are ready.')
    } catch (err) {
      setSaveState('error')
      setSaveError(apiErrorMessage(err, 'Could not unpublish your website. Please try again.'))
    } finally {
      setPublishing(false)
    }
  }

  const saveAddress = async () => {
    const nextSlug = slugify(slugInput)
    const site = await persist({ slug: nextSlug })
    if (site) {
      setPublishNote(
        site.slug === nextSlug
          ? `Website address saved: ${publicSiteUrl(site.slug)}`
          : `That address was taken, so we saved ${publicSiteUrl(site.slug)} instead.`,
      )
    }
  }

  const openLivePreview = async () => {
    if (dirty || !slug) {
      const site = await persist()
      if (!site) return
    }
    navigate('/couple/wedding-website/preview')
  }

  const copyText = (text: string, note: string) => {
    void navigator.clipboard?.writeText(text)
    setPublishNote(note)
  }

  const onHeroFile = async (file?: File | null) => {
    if (!file) return
    setUploading('hero')
    setUploadError('')
    try {
      const url = await uploadImage(file)
      update({ ...draftRef.current, heroImage: url })
    } catch (err) {
      setUploadError(apiErrorMessage(err, err instanceof Error ? err.message : 'Could not upload that photo.'))
    } finally {
      setUploading(null)
    }
  }

  const onGalleryFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading('gallery')
    setUploadError('')
    try {
      const room = MAX_GALLERY_PHOTOS - (draftRef.current.gallery?.length || 0)
      const urls: string[] = []
      for (const file of Array.from(files).slice(0, Math.max(0, room))) {
        urls.push(await uploadImage(file))
      }
      update({ ...draftRef.current, gallery: [...(draftRef.current.gallery || []), ...urls] })
    } catch (err) {
      setUploadError(apiErrorMessage(err, err instanceof Error ? err.message : 'Could not upload that photo.'))
    } finally {
      setUploading(null)
    }
  }

  const addScheduleSlot = () => {
    if (!newSlot.title.trim()) return
    const slot: ScheduleItem = {
      id: Date.now().toString(),
      time: newSlot.time.trim(),
      title: newSlot.title.trim(),
      detail: newSlot.detail.trim(),
    }
    update({ ...draft, schedule: [...(draft.schedule || []), slot] })
    setNewSlot({ time: '', title: '', detail: '' })
  }

  const liveUrl = slug ? publicSiteUrl(slug) : ''

  const publicSlug = draft.customDomain
    ? draft.customDomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
    : draft.publishedSlug || slugify(draft.title)

  const previewUrl = draft.isPublished
    ? `https://itheewed.com/w/${publicSlug}`
    : `Draft · will publish as itheewed.com/w/${slugify(draft.title)}`

  const handlePublish = () => {
    const slug = draft.customDomain
      ? draft.customDomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
      : slugify(draft.title)
    const next = { ...draft, isPublished: true, publishedSlug: slug }
    update(next)
    const path = `/couple/wedding-website?published=${encodeURIComponent(slug)}`
    window.history.replaceState(null, '', path)
    setPublishNote(`Marked published. Preview freely at ${window.location.origin}/w/${slug} — itheewed.com goes live once the domain is connected.`)
  }

  const localPreviewPath = `/w/${publicSlug || slugify(draft.title)}`
  const localPreviewUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${localPreviewPath}` : localPreviewPath

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

  if (live && (siteLoading || !siteLoaded)) {
    return (
      <CouplePageShell title="Wedding Website" subtitle="Publish a beautiful guest-facing page your guests can open from any device.">
        {siteError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => void loadSite()} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Retry
              </Button>
            }
          >
            {siteError}
          </Alert>
        ) : (
          <Typography sx={{ color: '#64748B', py: 6, textAlign: 'center' }}>Loading your wedding website…</Typography>
        )}
      </CouplePageShell>
    )
  }

  return (
    <CouplePageShell
      title="Wedding Website"
      subtitle={
        live
          ? 'Publish a beautiful guest-facing page your guests can open from any device.'
          : 'Publish a beautiful guest-facing page with strong privacy controls and clear content flow.'
      }
      badge={(live ? published : draft.isPublished) ? 'Published' : 'Draft'}
      actions={
        live ? (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="outlined"
              startIcon={<OpenInNew />}
              disabled={saveState === 'saving'}
              onClick={() => void openLivePreview()}
              sx={{ width: { xs: '100%', sm: 'auto' }, borderColor: '#0F766E', color: '#0F766E' }}
            >
              Preview site
            </Button>
            {published ? (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<VisibilityOff />}
                disabled={publishing}
                onClick={() => void handleUnpublish()}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Unpublish
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Publish />}
                disabled={publishing}
                onClick={() => void handlePublishLive()}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {publishing ? 'Publishing…' : 'Publish'}
              </Button>
            )}
          </Stack>
        ) : (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<OpenInNew />}
            onClick={() => {
              update(draft)
              navigate(localPreviewPath)
            }}
            sx={{ width: { xs: '100%', sm: 'auto' }, borderColor: '#0F766E', color: '#0F766E' }}
          >
            Preview site
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Publish />}
            onClick={handlePublish}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {draft.isPublished ? 'Update publish' : 'Publish'}
          </Button>
        </Stack>
        )
      }
    >
      {publishNote ? (
        <Paper elevation={0} sx={{ mb: 2, p: 1.5, borderRadius: 2, border: '1px solid #A7F3D0', bgcolor: '#ECFDF5' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#065F46', wordBreak: 'break-word' }}>{publishNote}</Typography>
        </Paper>
      ) : null}
      {live && saveState === 'error' ? (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => void persist()} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Try again
            </Button>
          }
        >
          {saveError}
        </Alert>
      ) : null}
      {live && saveState !== 'error' ? (
        <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.5, fontWeight: 600 }}>
          {saveState === 'saving' || dirty ? 'Saving changes…' : saveState === 'saved' ? 'All changes saved to your account' : 'Changes save automatically'}
        </Typography>
      ) : null}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' }, gap: 2.5, minWidth: 0 }}>
        {/* Main Content Editor */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, minWidth: 0 }}>
          {/* Tabs for different sections */}
          <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 0, overflow: 'hidden' }}>
            <Tabs
              value={tabIndex}
              onChange={(_, newValue) => setTabIndex(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                borderBottom: '1px solid #E2E8F0',
                minHeight: 48,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: 13, md: 14 },
                  minHeight: 48,
                  px: { xs: 1.5, md: 2 },
                },
              }}
            >
              <Tab label="Basic" />
              <Tab label="Design" />
              <Tab label="Q&A" />
              <Tab label="Hotels" />
              <Tab label="Advanced" />
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
                  {live ? (
                    <>
                      <Divider />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Wedding details</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                        <TextField
                          label="Wedding date"
                          type="date"
                          value={draft.weddingDate || ''}
                          onChange={(event) => update({ ...draft, weddingDate: event.target.value })}
                          size="small"
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                          label="Ceremony time"
                          value={draft.ceremonyTime || ''}
                          onChange={(event) => update({ ...draft, ceremonyTime: event.target.value })}
                          size="small"
                          placeholder="e.g. 1:00 PM"
                        />
                        <TextField
                          label="Venue"
                          value={draft.venue || ''}
                          onChange={(event) => update({ ...draft, venue: event.target.value })}
                          size="small"
                        />
                        <TextField
                          label="Area / city"
                          value={draft.location || ''}
                          onChange={(event) => update({ ...draft, location: event.target.value })}
                          size="small"
                          placeholder="e.g. Victoria Island, Lagos"
                        />
                      </Box>

                      <Divider />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Photos</Typography>
                      {uploadError ? <Alert severity="error">{uploadError}</Alert> : null}
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                        <Box
                          sx={{
                            width: { xs: '100%', sm: 180 },
                            height: 100,
                            borderRadius: 2,
                            border: '1px dashed #CBD5E1',
                            bgcolor: '#F8FAFC',
                            backgroundImage: draft.heroImage ? `url(${draft.heroImage})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {draft.heroImage ? null : <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>Cover photo</Typography>}
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Button
                            component="label"
                            variant="outlined"
                            size="small"
                            startIcon={<AddPhotoAlternateOutlined />}
                            disabled={uploading !== null}
                            sx={{ textTransform: 'none', borderColor: '#0F766E', color: '#0F766E' }}
                          >
                            {uploading === 'hero' ? 'Uploading…' : draft.heroImage ? 'Change cover' : 'Upload cover photo'}
                            <input
                              hidden
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                void onHeroFile(event.target.files?.[0])
                                event.target.value = ''
                              }}
                            />
                          </Button>
                          {draft.heroImage ? (
                            <Button size="small" color="inherit" onClick={() => update({ ...draft, heroImage: '' })} sx={{ textTransform: 'none' }}>
                              Remove
                            </Button>
                          ) : null}
                        </Stack>
                      </Stack>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                        {(draft.gallery || []).map((src, idx) => (
                          <Box
                            key={`${src}-${idx}`}
                            sx={{
                              position: 'relative',
                              aspectRatio: '1 / 1',
                              borderRadius: 2,
                              backgroundImage: `url(${src})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          >
                            <IconButtonSmall
                              label="Remove photo"
                              onClick={() => update({ ...draft, gallery: (draft.gallery || []).filter((_, i) => i !== idx) })}
                            />
                          </Box>
                        ))}
                      </Box>
                      {(draft.gallery?.length || 0) < MAX_GALLERY_PHOTOS ? (
                        <Button
                          component="label"
                          variant="text"
                          size="small"
                          startIcon={<AddPhotoAlternateOutlined />}
                          disabled={uploading !== null}
                          sx={{ alignSelf: 'flex-start', textTransform: 'none', color: '#0F766E', fontWeight: 700 }}
                        >
                          {uploading === 'gallery' ? 'Uploading…' : `Add gallery photos (${draft.gallery?.length || 0}/${MAX_GALLERY_PHOTOS})`}
                          <input
                            hidden
                            multiple
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              void onGalleryFiles(event.target.files)
                              event.target.value = ''
                            }}
                          />
                        </Button>
                      ) : null}

                      <Divider />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Day-of schedule</Typography>
                      {(draft.schedule || []).map((slot) => (
                        <Stack key={slot.id} direction="row" spacing={1} alignItems="center" sx={{ p: 1.2, borderRadius: 2, border: '1px solid #E2E8F0' }}>
                          <Typography sx={{ width: 76, fontSize: 12, fontWeight: 800, color: '#0F766E', flexShrink: 0 }}>{slot.time || '—'}</Typography>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{slot.title}</Typography>
                            {slot.detail ? <Typography sx={{ fontSize: 12, color: '#64748B' }}>{slot.detail}</Typography> : null}
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => update({ ...draft, schedule: (draft.schedule || []).filter((s) => s.id !== slot.id) })}
                            sx={{ textTransform: 'none' }}
                          >
                            Remove
                          </Button>
                        </Stack>
                      ))}
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '110px 1fr' }, gap: 1 }}>
                        <TextField label="Time" size="small" value={newSlot.time} onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })} placeholder="1:00 PM" />
                        <TextField label="What's happening" size="small" value={newSlot.title} onChange={(e) => setNewSlot({ ...newSlot, title: e.target.value })} placeholder="Ceremony" />
                      </Box>
                      <TextField label="Details (optional)" size="small" value={newSlot.detail} onChange={(e) => setNewSlot({ ...newSlot, detail: e.target.value })} />
                      <Button
                        variant="outlined"
                        onClick={addScheduleSlot}
                        disabled={!newSlot.title.trim()}
                        sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600, borderColor: '#0F766E', color: '#0F766E' }}
                      >
                        Add to schedule
                      </Button>
                    </>
                  ) : null}
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

                  {live ? null : (
                    <>
                  <Divider />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Matching Stationery</Typography>
                      <Typography sx={{ fontSize: 12, color: '#64748B' }}>Apply website theme to stationery items</Typography>
                    </Box>
                    <Switch checked={draft.matchStationery} onChange={(event) => update({ ...draft, matchStationery: event.target.checked })} />
                  </Stack>
                    </>
                  )}
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
            {tabIndex === 4 && live && (
              <Box sx={{ p: 2.2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Public sx={{ fontSize: 18, color: '#0F766E' }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Website address</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1 }}>
                      Choose the link guests will use. Letters, numbers and dashes only.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <TextField
                        value={slugInput}
                        onChange={(event) => setSlugInput(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        fullWidth
                        size="small"
                        placeholder={slugify(draft.title)}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">{`${window.location.host}/w/`}</InputAdornment>,
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        disabled={saveState === 'saving' || !slugify(slugInput || draft.title) || slugify(slugInput) === slug}
                        onClick={() => void saveAddress()}
                        sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
                      >
                        Save address
                      </Button>
                    </Stack>
                  </Box>

                  <Divider />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Published</Typography>
                      <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                        When on, anyone with your link can view the website. Turn off to hide it from guests.
                      </Typography>
                    </Box>
                    <Switch
                      checked={published}
                      disabled={publishing}
                      onChange={(event) => void (event.target.checked ? handlePublishLive() : handleUnpublish())}
                    />
                  </Stack>
                </Stack>
              </Box>
            )}
            {tabIndex === 4 && !live && (
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
                  <SoftGate featureId="website-custom-domain">
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Public sx={{ fontSize: 18, color: '#0F766E' }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Custom Domain</Typography>
                      <Chip label="Premium" size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: 10 }} />
                    </Stack>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1 }}>Use your own domain (e.g. adaeze-and-chidi.com)</Typography>
                    <TextField
                      label="Custom Domain"
                      value={draft.customDomain}
                      onChange={(event) => update({ ...draft, customDomain: event.target.value })}
                      fullWidth
                      size="small"
                      placeholder="adaeze-and-chidi"
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">.wedding</InputAdornment>,
                        },
                      }}
                    />
                  </Box>
                  </SoftGate>

                  <Divider />

                  {/* Website Analytics (Premium) */}
                  <SoftGate featureId="website-analytics">
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
                  </SoftGate>

                  <Divider />

                  {/* Advanced RSVP (Premium) */}
                  <SoftGate featureId="website-rsvp-adv">
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
                  </SoftGate>
                </Stack>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Live Preview Panel */}
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #E2E8F0',
            borderRadius: 3,
            p: { xs: 1.75, md: 2.2 },
            height: 'fit-content',
            position: { xs: 'static', lg: 'sticky' },
            top: 80,
            minWidth: 0,
            order: { xs: -1, lg: 0 },
          }}
        >
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
            {live && (draft.weddingDate || draft.venue) ? (
              <Typography sx={{ fontSize: 12, color: '#0F766E', mt: 0.8, fontWeight: 700 }}>
                {[draft.weddingDate, draft.venue].filter(Boolean).join(' · ')}
              </Typography>
            ) : null}
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

          {live ? (
            <Stack spacing={1}>
              <Chip
                label={published ? 'Publicly accessible' : 'Not yet published'}
                sx={{ alignSelf: 'flex-start', bgcolor: published ? '#DCFCE7' : '#FEF3C7', color: published ? '#166534' : '#92400E', fontWeight: 700 }}
              />
              {published && liveUrl ? (
                <>
                  <Typography sx={{ fontSize: 13, color: '#0F766E', wordBreak: 'break-all', fontWeight: 700 }}>
                    <strong>Your public link:</strong> {liveUrl}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 0.5 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      startIcon={<OpenInNew />}
                      onClick={() => window.open(liveUrl, '_blank', 'noopener')}
                    >
                      Open website
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ContentCopy />}
                      onClick={() => copyText(liveUrl, 'Link copied — share it with your guests')}
                      sx={{ borderColor: '#0F766E', color: '#0F766E' }}
                    >
                      Copy link
                    </Button>
                  </Stack>
                </>
              ) : (
                <>
                  <Typography sx={{ fontSize: 13, color: '#64748B', wordBreak: 'break-all' }}>
                    Publish your website to get a link you can share with guests
                    {liveUrl ? <> — it will be <strong>{liveUrl}</strong></> : null}.
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    startIcon={<OpenInNew />}
                    disabled={saveState === 'saving'}
                    onClick={() => void openLivePreview()}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Open preview
                  </Button>
                </>
              )}
            </Stack>
          ) : (
          <Stack spacing={1}>
            <Chip
              label={draft.isPublished ? 'Publicly accessible' : 'Not yet published'}
              sx={{ alignSelf: 'flex-start', bgcolor: draft.isPublished ? '#DCFCE7' : '#FEF3C7', color: draft.isPublished ? '#166534' : '#92400E', fontWeight: 700 }}
            />
            <Typography
              sx={{
                fontSize: 13,
                color: draft.isPublished ? '#0F766E' : '#64748B',
                wordBreak: 'break-all',
                fontWeight: draft.isPublished ? 700 : 500,
              }}
            >
              <strong>When live:</strong> {previewUrl}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#0F172A', wordBreak: 'break-all', fontWeight: 600 }}>
              <strong>Preview now (free):</strong> {localPreviewUrl}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 0.5 }}>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                startIcon={<OpenInNew />}
                onClick={() => {
                  update(draft)
                  navigate(localPreviewPath)
                }}
              >
                Open preview
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  void navigator.clipboard?.writeText(localPreviewUrl)
                  setPublishNote('Preview link copied — share with your co-planner')
                }}
                sx={{ borderColor: '#0F766E', color: '#0F766E' }}
              >
                Copy preview link
              </Button>
            </Stack>
            {draft.isPublished ? (
              <Button
                size="small"
                variant="text"
                onClick={() => {
                  void navigator.clipboard?.writeText(`https://itheewed.com/w/${publicSlug}`)
                  setPublishNote('Live URL copied (for after domain launch)')
                }}
                sx={{ alignSelf: 'flex-start', fontWeight: 700, color: '#64748B' }}
              >
                Copy future live URL
              </Button>
            ) : null}

            {draft.matchStationery && <Chip label="✓ Stationery matched" size="small" sx={{ bgcolor: '#DCFCE7', color: '#166534', alignSelf: 'flex-start' }} />}
            {draft.requiresPassword && <Chip label="🔒 Password protected" size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', alignSelf: 'flex-start' }} />}
            {draft.enableAnalytics && <Chip label="📊 Analytics enabled" size="small" sx={{ bgcolor: '#EFF6FF', color: '#1E40AF', alignSelf: 'flex-start' }} />}
            {draft.enableAdvancedRsvp && <Chip label="🍽️ Advanced RSVP" size="small" sx={{ bgcolor: '#F3E8FF', color: '#6B21A8', alignSelf: 'flex-start' }} />}
          </Stack>
          )}
        </Paper>
      </Box>
      <FloatingNoteButton />
    </CouplePageShell>
  )
}
