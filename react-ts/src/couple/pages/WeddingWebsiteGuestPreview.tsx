import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Chip, CircularProgress, IconButton, Stack, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowBack, Close, Lock, PlaceOutlined, CalendarMonthOutlined } from '@mui/icons-material'
import { normalizeDraft, slugify, type WebsiteDraft } from '@/couple/planning-live/weddingWebsite'
import { parseLocalDate } from '@/couple/planning-live/coupleIdentity'
import { useAccount } from '@/shared/contexts/AccountContext'
import { websiteApi } from '@/shared/lib/api'
import { IS_LIVE_APP } from '@/shared/lib/session'

const key = 'itw_website'
const HERO =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80'
const GALLERY = [
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
]
const DEMO_STORY =
  'We met, we laughed, and somehow Lagos made room for forever. We cannot wait to celebrate with the people who shaped our story.'
const DEMO_SCHEDULE = [
  { id: 'd1', time: '1:00 PM', title: 'Ceremony', detail: 'Guests seated · vows exchanged' },
  { id: 'd2', time: '2:30 PM', title: 'Cocktail hour', detail: 'Courtyard drinks & photos' },
  { id: 'd3', time: '4:00 PM', title: 'Reception', detail: 'Dinner, toasts, and first dance' },
]

function readDemoDraft(): WebsiteDraft | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? normalizeDraft(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function demoSlug(draft: WebsiteDraft) {
  return draft.customDomain
    ? draft.customDomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
    : draft.publishedSlug || slugify(draft.title || 'our-wedding')
}

type Loaded = { status: 'loading' } | { status: 'missing' } | { status: 'ready'; draft: WebsiteDraft; slug: string; sample: boolean }

/**
 * Guest-facing wedding site — industry-style invitation layout.
 * Routes: /w/:slug (public) and /couple/wedding-website/preview (couple's own preview)
 */
export default function WeddingWebsiteGuestPreview() {
  const { slug: routeSlug } = useParams<{ slug?: string }>()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { isDemo } = useAccount()
  const isPublicRoute = Boolean(routeSlug)
  const requested = routeSlug || params.get('slug') || ''
  const [loaded, setLoaded] = useState<Loaded>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    const demoFallback = (): Loaded => {
      if (IS_LIVE_APP) return { status: 'missing' }
      const draft = readDemoDraft()
      if (!draft) return { status: 'missing' }
      const slug = demoSlug(draft)
      return !requested || requested === slug ? { status: 'ready', draft, slug, sample: true } : { status: 'missing' }
    }

    const load = async (): Promise<Loaded> => {
      if (isPublicRoute) {
        try {
          const site = await websiteApi.public(requested)
          return { status: 'ready', draft: { ...normalizeDraft(site.data), isPublished: true }, slug: site.slug, sample: false }
        } catch {
          return demoFallback()
        }
      }
      if (isDemo) return demoFallback()
      try {
        const site = await websiteApi.mine()
        if (!site) return { status: 'missing' }
        return {
          status: 'ready',
          draft: { ...normalizeDraft(site.data), isPublished: site.published, publishedSlug: site.slug },
          slug: site.slug,
          sample: false,
        }
      } catch {
        return { status: 'missing' }
      }
    }

    void load().then((result) => {
      if (!cancelled) setLoaded(result)
    })
    return () => {
      cancelled = true
    }
  }, [isPublicRoute, isDemo, requested])

  const leavePreview = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/couple/wedding-website')
  }

  if (loaded.status === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'grid', placeItems: 'center' }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (loaded.status === 'missing') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'grid', placeItems: 'center', p: 3 }}>
        <Box sx={{ p: 4, maxWidth: 420, textAlign: 'center', border: '1px solid #E2E8F0', borderRadius: 3, bgcolor: '#fff' }}>
          {isPublicRoute ? (
            <>
              <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#0F172A', mb: 1 }}>Wedding website not found</Typography>
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>
                This link may be mistyped, or the couple hasn&apos;t published their website yet.
              </Typography>
            </>
          ) : (
            <>
              <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#0F172A', mb: 1 }}>No preview available</Typography>
              <Typography sx={{ fontSize: 14, color: '#64748B', mb: 2.5 }}>
                Save your wedding website content first, then open Preview again.
              </Typography>
              <Button variant="contained" color="secondary" onClick={() => navigate('/couple/wedding-website')}>
                Back to editor
              </Button>
            </>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <GuestSite
      draft={loaded.draft}
      slug={loaded.slug}
      sample={loaded.sample}
      showChrome={!isPublicRoute || loaded.sample}
      onLeave={leavePreview}
    />
  )
}

function GuestSite({
  draft,
  slug,
  sample,
  showChrome,
  onLeave,
}: {
  draft: WebsiteDraft
  slug: string
  sample: boolean
  showChrome: boolean
  onLeave: () => void
}) {
  const accent = draft.colorPalette || '#0F766E'
  const displayFont = draft.fontFamily || '"Cormorant Garamond", Georgia, serif'
  const story = draft.story?.trim() || (sample ? DEMO_STORY : '')
  const hero = draft.heroImage || (sample ? HERO : '')
  const gallery = draft.gallery?.length ? draft.gallery : sample ? GALLERY : []
  const schedule = draft.schedule?.length ? draft.schedule : sample ? DEMO_SCHEDULE : []

  const when = useMemo(() => {
    const date = parseLocalDate(draft.weddingDate || '')
    if (date) {
      return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).replace(',', ' ·')
    }
    return sample ? 'Saturday · 15 March 2027' : ''
  }, [draft.weddingDate, sample])
  const whenDetail = draft.ceremonyTime ? `Ceremony ${draft.ceremonyTime}` : sample ? 'Ceremony 1:00 PM · Reception to follow' : ''
  const venue = draft.venue || (sample ? 'The Civic Centre' : '')
  const location = draft.location || (sample ? 'Victoria Island, Lagos' : '')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F3EE', color: '#1C1917' }}>
      {showChrome ? (
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
          <Button startIcon={<ArrowBack />} onClick={onLeave} sx={{ color: '#fff', textTransform: 'none', fontWeight: 700, cursor: 'pointer' }}>
            Back to editor
          </Button>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={draft.isPublished ? 'Published preview' : 'Draft preview'}
              sx={{ bgcolor: draft.isPublished ? '#DCFCE7' : '#FEF3C7', color: draft.isPublished ? '#166534' : '#92400E', fontWeight: 700 }}
            />
            <IconButton aria-label="Close preview" onClick={onLeave} sx={{ color: '#fff', cursor: 'pointer' }}>
              <Close />
            </IconButton>
          </Stack>
        </Box>
      ) : null}

      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '72vh', md: '88vh' },
          background: hero
            ? `linear-gradient(180deg, rgba(11,45,49,0.35) 0%, rgba(11,45,49,0.72) 100%), url(${hero}) center / cover`
            : `linear-gradient(160deg, ${accent} 0%, #0B2D31 100%)`,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box sx={{ width: '100%', px: { xs: 3, md: 8 }, pb: { xs: 6, md: 10 }, pt: 10, color: '#fff' }}>
          <Typography sx={{ fontFamily: displayFont, letterSpacing: '0.35em', textTransform: 'uppercase', fontSize: 12, opacity: 0.9, mb: 2 }}>
            Together with their families
          </Typography>
          <Typography sx={{ fontFamily: displayFont, fontSize: { xs: 44, md: 76 }, fontWeight: 600, lineHeight: 1.05, maxWidth: 820 }}>
            {draft.title || 'Our Wedding'}
          </Typography>
          <Typography sx={{ mt: 2, fontSize: { xs: 16, md: 20 }, maxWidth: 520, opacity: 0.92, fontFamily: displayFont }}>
            {draft.subtitle || 'Join us for the celebration'}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
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
        {when || venue || location ? (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{ mb: 7, p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: '#fff', border: '1px solid #E7E0D6' }}
          >
            {when ? (
              <Stack direction="row" spacing={1.5} flex={1}>
                <CalendarMonthOutlined sx={{ color: accent }} />
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#78716C' }}>When</Typography>
                  <Typography sx={{ fontFamily: displayFont, fontSize: 22, mt: 0.5 }}>{when}</Typography>
                  {whenDetail ? <Typography sx={{ fontSize: 14, color: '#57534E', mt: 0.5 }}>{whenDetail}</Typography> : null}
                </Box>
              </Stack>
            ) : null}
            {venue || location ? (
              <Stack direction="row" spacing={1.5} flex={1}>
                <PlaceOutlined sx={{ color: accent }} />
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#78716C' }}>Where</Typography>
                  <Typography sx={{ fontFamily: displayFont, fontSize: 22, mt: 0.5 }}>{venue || location}</Typography>
                  {venue && location ? <Typography sx={{ fontSize: 14, color: '#57534E', mt: 0.5 }}>{location}</Typography> : null}
                </Box>
              </Stack>
            ) : null}
          </Stack>
        ) : null}

        {story ? (
          <Box sx={{ textAlign: 'center', mb: 8, maxWidth: 680, mx: 'auto' }}>
            <Typography sx={{ fontFamily: displayFont, fontSize: 13, letterSpacing: '0.28em', textTransform: 'uppercase', color: accent, mb: 2 }}>
              Our story
            </Typography>
            <Typography sx={{ fontSize: 16, lineHeight: 1.85, color: '#44403C', whiteSpace: 'pre-wrap' }}>{story}</Typography>
          </Box>
        ) : null}

        {gallery.length ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5, mb: 8 }}>
            {gallery.map((src) => (
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
        ) : null}

        {schedule.length ? (
          <Box sx={{ mb: 8 }}>
            <Typography sx={{ fontFamily: displayFont, fontSize: 32, textAlign: 'center', mb: 3 }}>Day-of schedule</Typography>
            <Stack spacing={0}>
              {schedule.map((row, i) => (
                <Stack
                  key={row.id}
                  direction="row"
                  spacing={3}
                  sx={{
                    py: 2.5,
                    borderTop: i === 0 ? `1px solid ${accent}55` : '1px solid #E7E0D6',
                    borderBottom: i === schedule.length - 1 ? `1px solid ${accent}55` : undefined,
                    alignItems: 'baseline',
                  }}
                >
                  <Typography sx={{ width: 88, fontWeight: 800, color: accent, fontSize: 13 }}>{row.time}</Typography>
                  <Box>
                    <Typography sx={{ fontFamily: displayFont, fontSize: 22 }}>{row.title}</Typography>
                    {row.detail ? <Typography sx={{ fontSize: 14, color: '#57534E' }}>{row.detail}</Typography> : null}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        ) : null}

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
          {sample && draft.requiresPassword ? (
            <Chip size="small" icon={<Lock sx={{ fontSize: 14 }} />} label="Password gate enabled" sx={{ fontWeight: 700, mb: 2 }} />
          ) : null}
          {showChrome ? (
            <Typography sx={{ fontSize: 12, color: '#A8A29E', wordBreak: 'break-all' }}>
              {draft.isPublished ? 'Live at' : 'Will publish at'}: {typeof window !== 'undefined' ? window.location.origin : ''}/w/{slug}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}
