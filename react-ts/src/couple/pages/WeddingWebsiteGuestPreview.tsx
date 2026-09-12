import { useMemo } from 'react'
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Lock } from '@mui/icons-material'

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
 * Guest-facing wedding site preview — works on localhost / app host
 * without purchasing a custom itheewed domain.
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

  if (!draft || !match) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'grid', placeItems: 'center', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, maxWidth: 420, textAlign: 'center', border: '1px solid #E2E8F0', borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#0F172A', mb: 1 }}>No preview available</Typography>
          <Typography sx={{ fontSize: 14, color: '#64748B', mb: 2.5 }}>
            Save your wedding website content first, then open Preview again.
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => navigate('/couple/wedding-website')}>
            Back to editor
          </Button>
        </Paper>
      </Box>
    )
  }

  const accent = draft.colorPalette || '#0F766E'

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#FAFAF9',
        backgroundImage: `linear-gradient(180deg, ${accent}12 0%, #FAFAF9 42%)`,
      }}
    >
      <Box
        sx={{
          maxWidth: 720,
          mx: 'auto',
          px: { xs: 2.5, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            size="small"
            label="Preview — no domain required"
            sx={{ bgcolor: '#ECFDF5', color: '#047857', fontWeight: 700 }}
          />
          {draft.isPublished ? (
            <Chip size="small" label="Marked published" sx={{ bgcolor: '#DCFCE7', color: '#166534', fontWeight: 700 }} />
          ) : (
            <Chip size="small" label="Draft preview" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }} />
          )}
          {draft.requiresPassword ? (
            <Chip size="small" icon={<Lock sx={{ fontSize: 14 }} />} label="Password gate (demo)" sx={{ fontWeight: 700 }} />
          ) : null}
        </Stack>

        <Typography
          sx={{
            fontFamily: draft.fontFamily || 'Cormorant Garamond, Georgia, serif',
            fontSize: { xs: 36, md: 48 },
            fontWeight: 700,
            color: '#0B2D31',
            lineHeight: 1.15,
          }}
        >
          {draft.title || 'Our Wedding'}
        </Typography>
        <Typography sx={{ fontSize: { xs: 16, md: 18 }, color: '#64748B', mt: 1.5, fontFamily: draft.fontFamily }}>
          {draft.subtitle}
        </Typography>

        <Box
          sx={{
            mt: 3,
            height: 4,
            width: 72,
            borderRadius: 999,
            bgcolor: accent,
          }}
        />

        <Typography
          sx={{
            mt: 4,
            fontSize: 15,
            lineHeight: 1.75,
            color: '#334155',
            fontFamily: draft.fontFamily,
            whiteSpace: 'pre-wrap',
          }}
        >
          {draft.story || 'Your love story will appear here for guests.'}
        </Typography>

        {draft.faqItems?.length > 0 ? (
          <Box sx={{ mt: 5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#0F172A', mb: 2 }}>Guest Q&A</Typography>
            <Stack spacing={1.5}>
              {draft.faqItems.map((item) => (
                <Paper key={item.id} elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{item.question}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.75, lineHeight: 1.6 }}>{item.answer}</Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        ) : null}

        {draft.hotelBlocks?.length > 0 ? (
          <Box sx={{ mt: 5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#0F172A', mb: 2 }}>Where to Stay</Typography>
            <Stack spacing={1.5}>
              {draft.hotelBlocks.map((hotel) => (
                <Paper key={hotel.id} elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{hotel.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.5 }}>{hotel.address}</Typography>
                  {hotel.discount ? (
                    <Chip size="small" label={`${hotel.discount} guest rate`} sx={{ mt: 1, bgcolor: `${accent}18`, color: accent, fontWeight: 700 }} />
                  ) : null}
                </Paper>
              ))}
            </Stack>
          </Box>
        ) : null}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 5 }}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/couple/wedding-website')}>
            Back to editor
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const path = `${window.location.origin}/w/${expectedSlug}`
              void navigator.clipboard?.writeText(path)
            }}
          >
            Copy preview link
          </Button>
        </Stack>

        <Typography sx={{ mt: 3, fontSize: 12, color: '#94A3B8', wordBreak: 'break-all' }}>
          Preview URL (works now): {`${typeof window !== 'undefined' ? window.location.origin : ''}/w/${expectedSlug}`}
          <br />
          After you go live with ItheeWed: https://itheewed.com/w/{expectedSlug}
        </Typography>
      </Box>
    </Box>
  )
}
