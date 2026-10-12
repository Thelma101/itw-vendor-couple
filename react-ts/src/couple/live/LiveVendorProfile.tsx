import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SendIcon from '@mui/icons-material/Send'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'
import LanguageIcon from '@mui/icons-material/Language'
import StorefrontIcon from '@mui/icons-material/Storefront'
import Nav from '@/couple/components/Nav'
import BackButton from '@/shared/components/BackButton'
import { useShortlist } from '@/shared/contexts/ShortlistContext'
import { apiErrorMessage, directoryApi, inquiriesApi, threadsApi, type DirectoryVendorDetail } from '@/shared/lib/api'
import { VendorImage, naira, priceLabel, shortlistItemFromCard } from '@/couple/live/liveVendor'

const cardSx = { border: '0.25px solid #00838F', backgroundColor: 'white', p: 3, mb: 3 } as const
const headingSx = { fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18, color: '#002528', mb: 2 } as const

function instagramUrl(handle: string) {
  if (/^https?:\/\//i.test(handle)) return handle
  return `https://instagram.com/${handle.replace(/^@/, '')}`
}

function websiteUrl(site: string) {
  return /^https?:\/\//i.test(site) ? site : `https://${site}`
}

function whatsappUrl(number: string) {
  return `https://wa.me/${number.replace(/[^0-9]/g, '')}`
}

const emptyForm = { weddingDate: '', guestCount: '', budget: '', message: '' }

type ContactLink = { icon: ReactNode; label: string; href: string }

export default function LiveVendorProfile() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id = '' } = useParams<{ id: string }>()
  const { addToShortlist, removeFromShortlist, isInShortlist } = useShortlist()
  const portfolioRef = useRef<HTMLDivElement>(null)
  const fromPreview = (location.state as { fromPreview?: boolean } | null)?.fromPreview === true

  const [detail, setDetail] = useState<DirectoryVendorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquiryPackage, setInquiryPackage] = useState('')
  const [inquiryForm, setInquiryForm] = useState(emptyForm)
  const [sending, setSending] = useState(false)
  const [inquirySent, setInquirySent] = useState(false)
  const [startingThread, setStartingThread] = useState(false)
  const [lightbox, setLightbox] = useState<{ album: number; index: number } | null>(null)
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setLoadError('')
    directoryApi
      .get(id)
      .then((data) => {
        if (!cancelled) setDetail(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 400)) setNotFound(true)
        else setLoadError(apiErrorMessage(err, 'We could not load this vendor. Please try again.'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  useEffect(() => {
    if (detail && location.hash === '#portfolio') {
      portfolioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [detail, location.hash])

  const packages = useMemo(
    () => (detail?.services || []).filter((s) => s.type === 'Package' && s.active !== false),
    [detail],
  )
  const addOns = useMemo(
    () => (detail?.services || []).filter((s) => s.type === 'Add-on' && s.active !== false),
    [detail],
  )
  const albums = useMemo(
    () => (detail?.portfolio || []).filter((a) => a.published !== false && (a.cover || a.gallery?.length)),
    [detail],
  )
  const albumImages = (albumIndex: number) => {
    const album = albums[albumIndex]
    if (!album) return []
    const gallery = (album.gallery || []).filter(Boolean)
    return gallery.length ? gallery : [album.cover].filter(Boolean)
  }

  const openMessages = useCallback(async () => {
    if (!detail) return
    setStartingThread(true)
    try {
      const thread = await threadsApi.start({ vendorId: detail.card.id })
      navigate(`/couple/messages?thread=${encodeURIComponent(thread.id)}`)
    } catch (err) {
      setToast({ message: apiErrorMessage(err, 'Could not open a conversation. Please try again.'), severity: 'error' })
    } finally {
      setStartingThread(false)
    }
  }, [detail, navigate])

  const goToBooking = (packageName?: string) => {
    if (!detail) return
    const q = new URLSearchParams({ vendor: detail.card.id })
    if (packageName) q.set('package', packageName)
    navigate(`/couple/booking?${q.toString()}`)
  }

  const openInquiry = (packageName = '') => {
    setInquiryPackage(packageName)
    setInquirySent(false)
    setInquiryOpen(true)
  }

  const submitInquiry = async () => {
    if (!detail) return
    const guestCount = Number.parseInt(inquiryForm.guestCount, 10)
    const budget = Number.parseInt(inquiryForm.budget.replace(/[^0-9]/g, ''), 10)
    const intro = inquiryPackage ? `I'm interested in your "${inquiryPackage}" package.` : ''
    const message = [intro, inquiryForm.message.trim()].filter(Boolean).join('\n\n')
    setSending(true)
    try {
      await inquiriesApi.create({
        vendorId: detail.card.id,
        kind: 'inquiry',
        message: message || `Hi ${detail.card.name}, I'd love a quote for my wedding.`,
        eventDate: inquiryForm.weddingDate || undefined,
        guestCount: Number.isFinite(guestCount) && guestCount > 0 ? guestCount : undefined,
        budget: Number.isFinite(budget) && budget > 0 ? budget : undefined,
        packageName: inquiryPackage || undefined,
      })
      setInquirySent(true)
      setInquiryForm(emptyForm)
    } catch (err) {
      setToast({ message: apiErrorMessage(err, 'Your request could not be sent. Please try again.'), severity: 'error' })
    } finally {
      setSending(false)
    }
  }

  if (loading && !detail) {
    return (
      <Box sx={{ backgroundColor: '#FFF6F9', minHeight: '100vh' }}>
        <Nav />
        <Box sx={{ display: 'grid', placeItems: 'center', py: 12 }}>
          <CircularProgress sx={{ color: '#00838F' }} />
        </Box>
      </Box>
    )
  }

  if (notFound || loadError || !detail) {
    return (
      <Box sx={{ backgroundColor: '#FFF6F9', minHeight: '100vh' }}>
        <Nav />
        <Box sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
          <BackButton fallbackPath="/couple/search-results" />
        </Box>
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 8, display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ ...cardSx, maxWidth: 520, width: '100%', textAlign: 'center', py: 5 }}>
            <StorefrontIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1 }} />
            <Typography sx={{ ...headingSx, mb: 1 }}>{notFound || !loadError ? 'Vendor not found' : 'Something went wrong'}</Typography>
            <Typography sx={{ color: '#666', fontSize: 14, mb: 3 }}>
              {notFound || !loadError
                ? 'This vendor may have left iTheeWed or the link is incorrect.'
                : loadError}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
              {loadError ? (
                <Button variant="outlined" onClick={() => setReloadKey((k) => k + 1)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                  Try again
                </Button>
              ) : null}
              <Button
                variant="contained"
                onClick={() => navigate('/couple/search-results')}
                sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#00838F', '&:hover': { bgcolor: '#006d75' } }}
              >
                Browse vendors
              </Button>
            </Stack>
          </Card>
        </Box>
      </Box>
    )
  }

  const { card, profile } = detail
  const avatarSrc = profile.avatar || card.avatar || card.image
  const isFavorited = isInShortlist(card.id)
  const contacts: ContactLink[] = []
  if (profile.phone) contacts.push({ icon: <PhoneIcon fontSize="small" />, label: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` })
  if (profile.whatsapp) contacts.push({ icon: <WhatsAppIcon fontSize="small" />, label: 'WhatsApp', href: whatsappUrl(profile.whatsapp) })
  if (profile.instagram) contacts.push({ icon: <InstagramIcon fontSize="small" />, label: profile.instagram, href: instagramUrl(profile.instagram) })
  if (profile.website) contacts.push({ icon: <LanguageIcon fontSize="small" />, label: profile.website.replace(/^https?:\/\//i, ''), href: websiteUrl(profile.website) })

  const handleFavorite = () => {
    if (isFavorited) {
      removeFromShortlist(card.id)
      setToast({ message: 'Removed from shortlist', severity: 'success' })
    } else {
      addToShortlist(shortlistItemFromCard(card))
      setToast({ message: 'Added to shortlist', severity: 'success' })
    }
  }

  const lightboxImages = lightbox ? albumImages(lightbox.album) : []

  return (
    <Box sx={{ backgroundColor: '#FFF6F9', minHeight: '100vh' }}>
      <Nav />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 2, md: 4 }, py: 2 }}>
        <BackButton fallbackPath="/couple/search-results" label={fromPreview ? 'Back to Preview' : undefined} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 3 },
          px: { xs: 2, md: 4 },
          pb: { xs: 10, md: 4 },
          minWidth: 0,
        }}
      >
        {/* Profile card */}
        <Box sx={{ width: { xs: '100%', md: 340 }, flexShrink: 0, maxWidth: '100%' }}>
          <Card sx={{ border: '0.25px solid #00838F', backgroundColor: 'white', p: { xs: 2, md: 3 }, position: { xs: 'static', md: 'sticky' }, top: 20 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton
                onClick={handleFavorite}
                aria-label={isFavorited ? 'Remove from shortlist' : 'Add to shortlist'}
                sx={{ color: isFavorited ? '#EB1948' : '#ccc' }}
              >
                {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {avatarSrc ? (
                <Avatar src={avatarSrc} alt={card.name} sx={{ width: 150, height: 150, border: '3px solid #00838F' }} />
              ) : (
                <VendorImage name={card.name} rounded="50%" sx={{ width: 150, height: 150, fontSize: 56, border: '3px solid #00838F' }} />
              )}
            </Box>

            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 20, color: '#002528', textAlign: 'center', mb: 1 }}>
              {card.name}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666', textAlign: 'center', mb: 1 }}>
              {card.category}
            </Typography>
            {card.location ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 2 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: '#00838F' }} />
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#002528' }}>{card.location}</Typography>
              </Box>
            ) : null}

            <Divider sx={{ my: 2 }} />

            {card.rating > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Rating value={card.rating} readOnly precision={0.1} size="small" />
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{card.rating}</Typography>
                <Typography sx={{ fontSize: 12, color: '#666' }}>({card.reviewCount} reviews)</Typography>
              </Box>
            ) : null}

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                {card.price > 0 ? 'Starting at' : 'Pricing'}
              </Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: card.price > 0 ? 24 : 18, fontWeight: 700, color: '#00838F' }}>
                {priceLabel(card.price)}
              </Typography>
            </Box>

            {profile.responseTime || profile.yearsInBusiness > 0 ? (
              <Stack spacing={0.75} sx={{ mb: 3 }}>
                {profile.responseTime ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, p: 1, backgroundColor: '#f0fdf4', borderRadius: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                    <Typography sx={{ fontSize: 12, color: '#166534' }}>Usually responds {profile.responseTime}</Typography>
                  </Box>
                ) : null}
                {profile.yearsInBusiness > 0 ? (
                  <Typography sx={{ fontSize: 12, color: '#475569', textAlign: 'center' }}>
                    {profile.yearsInBusiness} {profile.yearsInBusiness === 1 ? 'year' : 'years'} in business
                  </Typography>
                ) : null}
              </Stack>
            ) : null}

            <Button
              fullWidth
              onClick={() => openInquiry()}
              sx={{
                background: 'linear-gradient(229.87deg, #EB1948 65.18%, #B52344 232.03%)',
                color: 'white',
                fontWeight: 700,
                fontSize: 16,
                textTransform: 'none',
                borderRadius: 1,
                py: 1.5,
                mb: 1.5,
                '&:hover': { opacity: 0.9 },
              }}
            >
              Request Quote
            </Button>
            <Button
              fullWidth
              variant="outlined"
              disabled={startingThread}
              onClick={() => void openMessages()}
              startIcon={startingThread ? <CircularProgress size={16} /> : undefined}
              sx={{ borderColor: '#00838F', color: '#00838F', fontWeight: 600, fontSize: 14, textTransform: 'none', borderRadius: 1, py: 1, mb: 1.5 }}
            >
              Send Message
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => goToBooking()}
              sx={{ color: '#00838F', fontWeight: 600, fontSize: 14, textTransform: 'none' }}
            >
              Request a booking
            </Button>

            {contacts.length ? (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748B', mb: 1, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Contact
                </Typography>
                <Stack spacing={1}>
                  {contacts.map((c) => (
                    <Box
                      key={c.href}
                      component="a"
                      href={c.href}
                      target={c.href.startsWith('tel:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0F766E', textDecoration: 'none', fontSize: 14, wordBreak: 'break-all', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {c.icon}
                      <span>{c.label}</span>
                    </Box>
                  ))}
                </Stack>
              </>
            ) : null}
          </Card>
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {profile.cover ? (
            <Box
              component="img"
              src={profile.cover}
              alt=""
              sx={{ width: '100%', height: { xs: 180, md: 280 }, objectFit: 'cover', borderRadius: 1, mb: 3, display: 'block' }}
            />
          ) : null}

          <Card sx={cardSx}>
            <Typography sx={headingSx}>About</Typography>
            {profile.tagline ? (
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#0F766E', mb: 1 }}>{profile.tagline}</Typography>
            ) : null}
            <Typography sx={{ fontSize: 14, color: '#444', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {profile.bio || card.description || `${card.name} hasn't added a description yet. Send them a message to learn more.`}
            </Typography>
          </Card>

          <Card sx={cardSx}>
            <Typography sx={{ ...headingSx, mb: 3 }}>Pricing Packages</Typography>
            {packages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography sx={{ fontSize: 14, color: '#666', mb: 2 }}>
                  {card.name} hasn't published packages yet. Request a quote and they'll send you pricing.
                </Typography>
                <Button variant="outlined" onClick={() => openInquiry()} sx={{ textTransform: 'none', borderColor: '#00838F', color: '#00838F', fontWeight: 600 }}>
                  Request a quote
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                {packages.map((pkg) => (
                  <Box
                    key={pkg.id}
                    sx={{
                      border: pkg.popular ? '2px solid #00838F' : '1px solid #e0e0e0',
                      borderRadius: 2,
                      p: 2.5,
                      position: 'relative',
                      backgroundColor: pkg.popular ? '#f0fdfa' : 'white',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {pkg.popular ? (
                      <Chip
                        label="Most Popular"
                        size="small"
                        sx={{ position: 'absolute', top: -10, right: 10, backgroundColor: '#00838F', color: 'white', fontSize: 11, fontWeight: 600 }}
                      />
                    ) : null}
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#002528', mb: 0.5 }}>{pkg.name}</Typography>
                    {pkg.description ? (
                      <Typography sx={{ fontSize: 12, color: '#666', mb: 1.5 }}>{pkg.description}</Typography>
                    ) : null}
                    <Typography sx={{ fontWeight: 700, fontSize: 22, color: '#00838F', mb: 2 }}>{priceLabel(pkg.price)}</Typography>
                    {(pkg.features || []).map((feature) => (
                      <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                        <CheckCircleIcon sx={{ fontSize: 14, color: '#22c55e' }} />
                        <Typography sx={{ fontSize: 12, color: '#444' }}>{feature}</Typography>
                      </Box>
                    ))}
                    <Box sx={{ mt: 'auto', pt: 2, display: 'grid', gap: 1 }}>
                      <Button
                        fullWidth
                        variant={pkg.popular ? 'contained' : 'outlined'}
                        onClick={() => goToBooking(pkg.name)}
                        sx={{
                          backgroundColor: pkg.popular ? '#00838F' : 'transparent',
                          borderColor: '#00838F',
                          color: pkg.popular ? 'white' : '#00838F',
                          fontWeight: 600,
                          fontSize: 13,
                          textTransform: 'none',
                          borderRadius: 1,
                          '&:hover': { backgroundColor: pkg.popular ? '#006d75' : '#f0fdfa' },
                        }}
                      >
                        Request this package
                      </Button>
                      <Button
                        fullWidth
                        size="small"
                        onClick={() => openInquiry(pkg.name)}
                        sx={{ textTransform: 'none', color: '#64748B', fontSize: 12 }}
                      >
                        Ask a question
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {addOns.length > 0 ? (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#002528', mb: 1.5 }}>Optional add-ons</Typography>
                <Typography sx={{ fontSize: 12, color: '#666', mb: 2 }}>
                  Stack these on any package — they are extras, not stand-alone bookings.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
                  {addOns.map((addon) => (
                    <Box
                      key={addon.id}
                      sx={{ border: '1px solid #fde68a', bgcolor: '#fffbeb', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#0B2D31' }}>{addon.name}</Typography>
                        {addon.description ? (
                          <Typography sx={{ fontSize: 12, color: '#666', mt: 0.5 }}>{addon.description}</Typography>
                        ) : null}
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#B45309', whiteSpace: 'nowrap' }}>
                        {addon.price > 0 ? `+${naira(addon.price)}` : 'On request'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : null}
          </Card>

          <Card sx={cardSx}>
            <Typography sx={headingSx}>Reviews</Typography>
            {card.reviewCount > 0 && card.rating > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={card.rating} readOnly precision={0.1} size="small" />
                <Typography sx={{ fontWeight: 600 }}>{card.rating}</Typography>
                <Typography sx={{ fontSize: 13, color: '#666' }}>from {card.reviewCount} reviews</Typography>
              </Box>
            ) : (
              <Typography sx={{ fontSize: 14, color: '#666' }}>No reviews yet.</Typography>
            )}
          </Card>

          <Box id="portfolio" ref={portfolioRef}>
            <Card sx={{ ...cardSx, mb: 0 }}>
              <Typography sx={{ ...headingSx, mb: 3 }}>Portfolio</Typography>
              {albums.length === 0 ? (
                <Typography sx={{ fontSize: 14, color: '#666' }}>{card.name} hasn't published any portfolio albums yet.</Typography>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {albums.map((album, index) => {
                    const count = albumImages(index).length
                    return (
                      <Box
                        key={album.id}
                        onClick={() => setLightbox({ album: index, index: 0 })}
                        sx={{ position: 'relative', height: 250, overflow: 'hidden', borderRadius: 1, cursor: 'zoom-in', '&:hover img': { transform: 'scale(1.03)' } }}
                      >
                        <img
                          src={album.cover || albumImages(index)[0]}
                          alt={album.title || `Album ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, transparent 50%, rgba(0,37,40,0.7) 100%)',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            p: 2,
                            gap: 1,
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'white' }}>{album.title}</Typography>
                          {count > 1 ? (
                            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>{count} photos</Typography>
                          ) : null}
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              )}
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Inquiry dialog */}
      <Dialog open={inquiryOpen} onClose={() => !sending && setInquiryOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {inquirySent ? 'Request sent' : 'Request a Quote'}
          <IconButton onClick={() => setInquiryOpen(false)} size="small" disabled={sending} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {inquirySent ? (
          <>
            <DialogContent sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 56, color: '#22c55e', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>Your request is on its way to {card.name}</Typography>
              <Typography sx={{ fontSize: 14, color: '#666' }}>
                We've started a conversation for you — their reply will appear in Messages, and you can track the request in My Vendors.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0, gap: 1, flexWrap: 'wrap' }}>
              <Button onClick={() => navigate('/couple/my-vendors')} sx={{ textTransform: 'none', color: '#00838F' }}>
                View My Vendors
              </Button>
              <Button
                onClick={() => navigate(`/couple/messages?vendor=${encodeURIComponent(card.id)}`)}
                variant="contained"
                sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#00838F', '&:hover': { bgcolor: '#006d75' } }}
              >
                Go to Messages
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, mt: 1 }}>
                {avatarSrc ? (
                  <Avatar src={avatarSrc} sx={{ width: 56, height: 56 }} />
                ) : (
                  <VendorImage name={card.name} rounded="50%" sx={{ width: 56, height: 56, fontSize: 22 }} />
                )}
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{card.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#666' }}>
                    {card.category}
                    {inquiryPackage ? ` · ${inquiryPackage}` : ''}
                  </Typography>
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Wedding Date"
                type="date"
                value={inquiryForm.weddingDate}
                onChange={(e) => setInquiryForm({ ...inquiryForm, weddingDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().slice(0, 10) }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Estimated Guest Count"
                type="number"
                placeholder="e.g. 150"
                value={inquiryForm.guestCount}
                onChange={(e) => setInquiryForm({ ...inquiryForm, guestCount: e.target.value })}
                inputProps={{ min: 1 }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Budget (₦)"
                placeholder="e.g. 400000"
                inputMode="numeric"
                value={inquiryForm.budget}
                onChange={(e) => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                placeholder="Tell the vendor about your wedding vision, specific requirements, or questions..."
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={() => setInquiryOpen(false)} disabled={sending} sx={{ textTransform: 'none', color: '#666' }}>
                Cancel
              </Button>
              <Button
                onClick={() => void submitInquiry()}
                disabled={sending}
                startIcon={sending ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <SendIcon />}
                sx={{
                  background: 'linear-gradient(229.87deg, #EB1948 65.18%, #B52344 232.03%)',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { opacity: 0.9 },
                  '&.Mui-disabled': { color: 'white', opacity: 0.7 },
                }}
              >
                {sending ? 'Sending…' : 'Send Inquiry'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Portfolio lightbox */}
      <Dialog open={lightbox !== null} onClose={() => setLightbox(null)} maxWidth={false} fullScreen PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.94)' } }}>
        <IconButton
          onClick={() => setLightbox(null)}
          sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', zIndex: 2 }}
          aria-label="Close portfolio"
        >
          <CloseIcon />
        </IconButton>
        {lightbox && lightboxImages.length ? (
          <>
            {lightboxImages.length > 1 ? (
              <>
                <IconButton
                  onClick={() => setLightbox((l) => (l ? { ...l, index: (l.index - 1 + lightboxImages.length) % lightboxImages.length } : l))}
                  sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff', bgcolor: 'rgba(255,255,255,0.12)' }}
                  aria-label="Previous photo"
                >
                  <ChevronLeftIcon fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={() => setLightbox((l) => (l ? { ...l, index: (l.index + 1) % lightboxImages.length } : l))}
                  sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff', bgcolor: 'rgba(255,255,255,0.12)' }}
                  aria-label="Next photo"
                >
                  <ChevronRightIcon fontSize="large" />
                </IconButton>
              </>
            ) : null}
            <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', p: { xs: 2, md: 6 } }}>
              <Box
                component="img"
                src={lightboxImages[lightbox.index]}
                alt={albums[lightbox.album]?.title || 'Portfolio'}
                sx={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
              />
            </Box>
            <Typography sx={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', color: '#fff', fontWeight: 700 }}>
              {lightbox.index + 1} / {lightboxImages.length} · {albums[lightbox.album]?.title || card.name}
            </Typography>
          </>
        ) : null}
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToast(null)} severity={toast?.severity || 'success'}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
