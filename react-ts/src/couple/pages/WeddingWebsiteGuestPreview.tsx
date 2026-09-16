import { useMemo } from 'react'
import { Box, Button, Chip, IconButton, Stack, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowBack, Close, Lock, PlaceOutlined, CalendarMonthOutlined } from '@mui/icons-material'

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
  publishedSlug?: string
}

const key = 'itw_website'
const HERO =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80'
const GALLERY = [
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
]

function readDraft(): WebsiteDraft | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as WebsiteDraft
  } catch {
    return null
  }
}

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'our-wedding'
  )
}

/**
 * Guest-facing wedding site preview — industry-style invitation layout.
 * Routes: /w/:slug  and  /couple/wedding-website/preview
 */
export default function WeddingWebsiteGuestPreview() {
  const { slug: routeSlug } = useParams<{ slug?: string }>()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const draft = useMemo(() => readDraft(), [])

  const expectedSlug = draft
    ? draft.customDomain
      ? draft.customDomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
      : draft.publishedSlug || slugify(draft.title || 'our-wedding')
    : ''

  const requested = routeSlug || params.get('slug') || expectedSlug
  const match = Boolean(draft && (!requested || requested === expectedSlug))

  const leavePreview = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/couple/wedding-website')
  }

  if (!draft || !match) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'grid', placeItems: 'center', p: 3 }}>
        <Box sx={{ p: 4, maxWidth: 420, textAlign: 'center', border: '1px solid #E2E8F0', borderRadius: 3, bgcolor: '#fff' }}>
          <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#0F172A', mb: 1 }}>No preview available</Typography>
          <Typography sx={{ fontSize: 14, color: '#64748B', mb: 2.5 }}>
            Save your wedding website content first, then open Preview again.
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => navigate('/couple/wedding-website')}>
            Back to editor
          </Button>
        </Box>
      </Box>
    )
  }

  const accent = draft.colorPalette || '#0F766E'
  const displayFont = draft.fontFamily || '"Cormorant Garamond", Georgia, serif'
  const story =
    draft.story?.trim() ||
    'We met, we laughed, and somehow Lagos made room for forever. We cannot wait to celebrate with the people who shaped our story.'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F3EE', color: '#1C1917' }}>
      {/* Preview chrome */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1.5, md: 2.5 },
          py: 1,
          bgcolor: 'rgba(11,45,49,0.92)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={leavePreview}
          sx={{ color: '#fff', textTransform: 'none', fontWeight: 700, cursor: 'pointer' }}
        >
          Back to editor
        </Button>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size="small"
            label={draft.isPublished ? 'Published preview' : 'Draft preview'}
            sx={{ bgcolor: draft.isPublished ? '#DCFCE7' : '#FEF3C7', color: draft.isPublished ? '#166534' : '#92400E', fontWeight: 700 }}
          />
          <IconButton aria-label="Close preview" onClick={leavePreview} sx={{ color: '#fff', cursor: 'pointer' }}>
            <Close />
          </IconButton>
        </Stack>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '72vh', md: '88vh' },
          backgroundImage: `linear-gradient(180deg, rgba(11,45,49,0.35) 0%, rgba(11,45,49,0.72) 100%), url(${HERO})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box sx={{ width: '100%', px: { xs: 3, md: 8 }, pb: { xs: 6, md: 10 }, pt: 10, color: '#fff' }}>
          <Typography
            sx={{
              fontFamily: displayFont,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              fontSize: 12,
              opacity: 0.9,
              mb: 2,
            }}
          >
            Together with their families
          </Typography>
          <Typography
            sx={{
              fontFamily: displayFont,
              fontSize: { xs: 44, md: 76 },
              fontWeight: 600,
              lineHeight: 1.05,
              maxWidth: 820,
            }}
          >
            {draft.title || 'Our Wedding'}
          </Typography>
          <Typography sx={{ mt: 2, fontSize: { xs: 16, md: 20 }, maxWidth: 520, opacity: 0.92, fontFamily: displayFont }}>
            {draft.subtitle || 'Join us for the celebration'}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: accent,
                color: '#fff',
                px: 3.5,
                py: 1.4,
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                '&:hover': { bgcolor: accent, filter: 'brightness(0.95)' },
              }}
            >
              RSVP
            </Button>
            <Button
              variant="outlined"
              href="#details"
              sx={{
                borderColor: 'rgba(255,255,255,0.7)',
                color: '#fff',
                px: 3,
                py: 1.3,
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 999,
                cursor: 'pointer',
              }}
            >
              Wedding details
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box id="details" sx={{ maxWidth: 980, mx: 'auto', px: { xs: 2.5, md: 4 }, py: { xs: 6, md: 9 } }}>
        {/* When & where */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{
            mb: 7,
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            bgcolor: '#fff',
            border: '1px solid #E7E0D6',
          }}
        >
          <Stack direction="row" spacing={1.5} flex={1}>
            <CalendarMonthOutlined sx={{ color: accent }} />
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#78716C' }}>
                When
              </Typography>
              <Typography sx={{ fontFamily: displayFont, fontSize: 22, mt: 0.5 }}>Saturday · 15 March 2027</Typography>
              <Typography sx={{ fontSize: 14, color: '#57534E', mt: 0.5 }}>Ceremony 1:00 PM · Reception to follow</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} flex={1}>
            <PlaceOutlined sx={{ color: accent }} />
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#78716C' }}>
                Where
              </Typography>
              <Typography sx={{ fontFamily: displayFont, fontSize: 22, mt: 0.5 }}>The Civic Centre</Typography>
              <Typography sx={{ fontSize: 14, color: '#57534E', mt: 0.5 }}>Victoria Island, Lagos</Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Story */}
        <Box sx={{ textAlign: 'center', mb: 8, maxWidth: 680, mx: 'auto' }}>
          <Typography
            sx={{
              fontFamily: displayFont,
              fontSize: 13,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: accent,
              mb: 2,
            }}
          >
            Our story
          </Typography>
          <Typography sx={{ fontFamily: displayFont, fontSize: { xs: 28, md: 36 }, fontWeight: 600, lineHeight: 1.2, mb: 2.5 }}>
            A love written in two cities
          </Typography>
          <Typography sx={{ fontSize: 16, lineHeight: 1.85, color: '#44403C', whiteSpace: 'pre-wrap' }}>{story}</Typography>
        </Box>

        {/* Gallery strip */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 1.5,
            mb: 8,
          }}
        >
          {GALLERY.map((src) => (
            <Box
              key={src}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '4 / 5',
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </Box>

        {/* Schedule */}
        <Box sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: displayFont, fontSize: 32, textAlign: 'center', mb: 3 }}>Day-of schedule</Typography>
          <Stack spacing={0}>
            {[
              { time: '1:00 PM', title: 'Ceremony', detail: 'Guests seated · vows exchanged' },
              { time: '2:30 PM', title: 'Cocktail hour', detail: 'Courtyard drinks & photos' },
              { time: '4:00 PM', title: 'Reception', detail: 'Dinner, toasts, and first dance' },
            ].map((row, i) => (
              <Stack
                key={row.time}
                direction="row"
                spacing={3}
                sx={{
                  py: 2.5,
                  borderTop: i === 0 ? `1px solid ${accent}55` : '1px solid #E7E0D6',
                  borderBottom: i === 2 ? `1px solid ${accent}55` : undefined,
                  alignItems: 'baseline',
                }}
              >
                <Typography sx={{ width: 88, fontWeight: 800, color: accent, fontSize: 13 }}>{row.time}</Typography>
                <Box>
                  <Typography sx={{ fontFamily: displayFont, fontSize: 22 }}>{row.title}</Typography>
                  <Typography sx={{ fontSize: 14, color: '#57534E' }}>{row.detail}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        {draft.faqItems?.length > 0 ? (
          <Box sx={{ mb: 8 }}>
            <Typography sx={{ fontFamily: displayFont, fontSize: 32, textAlign: 'center', mb: 3 }}>Guest Q&A</Typography>
            <Stack spacing={2}>
              {draft.faqItems.map((item) => (
                <Box key={item.id} sx={{ p: 2.5, bgcolor: '#fff', borderRadius: 2, border: '1px solid #E7E0D6' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{item.question}</Typography>
                  <Typography sx={{ fontSize: 14, color: '#57534E', mt: 0.75, lineHeight: 1.65 }}>{item.answer}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        ) : null}

        {draft.hotelBlocks?.length > 0 ? (
          <Box sx={{ mb: 8 }}>
            <Typography sx={{ fontFamily: displayFont, fontSize: 32, textAlign: 'center', mb: 3 }}>Where to stay</Typography>
            <Stack spacing={2}>
              {draft.hotelBlocks.map((hotel) => (
                <Box key={hotel.id} sx={{ p: 2.5, bgcolor: '#fff', borderRadius: 2, border: '1px solid #E7E0D6' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{hotel.name}</Typography>
                  <Typography sx={{ fontSize: 14, color: '#57534E', mt: 0.5 }}>{hotel.address}</Typography>
                  {hotel.discount ? (
                    <Chip size="small" label={`${hotel.discount} guest rate`} sx={{ mt: 1, bgcolor: `${accent}18`, color: accent, fontWeight: 700 }} />
                  ) : null}
                </Box>
              ))}
            </Stack>
          </Box>
        ) : null}

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontFamily: displayFont, fontSize: 28, mb: 1 }}>We cannot wait to celebrate with you</Typography>
          {draft.requiresPassword ? (
            <Chip size="small" icon={<Lock sx={{ fontSize: 14 }} />} label="Password gate enabled" sx={{ fontWeight: 700, mb: 2 }} />
          ) : null}
          <Typography sx={{ fontSize: 12, color: '#A8A29E', wordBreak: 'break-all' }}>
            Preview: {typeof window !== 'undefined' ? window.location.origin : ''}/w/{expectedSlug}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
