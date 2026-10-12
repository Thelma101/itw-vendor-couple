import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StorefrontIcon from '@mui/icons-material/Storefront'
import Nav from '@/couple/components/Nav'
import BackButton from '@/shared/components/BackButton'
import { useShortlist } from '@/shared/contexts/ShortlistContext'
import { apiErrorMessage, directoryApi, inquiriesApi, type DirectoryVendorDetail } from '@/shared/lib/api'
import { VendorImage, formatDate, naira, priceLabel } from '@/couple/live/liveVendor'

const CUSTOM = '__custom__'
const font = "'Open Sans', sans-serif"
const primaryBtnSx = {
  background: 'linear-gradient(229.87deg, #EB1948 65.18%, #B52344 232.03%)',
  color: 'white',
  fontFamily: font,
  fontWeight: 600,
  textTransform: 'none',
  px: 4,
  '&:hover': { opacity: 0.9 },
  '&.Mui-disabled': { background: '#ccc', color: '#fff' },
} as const

function Shell({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3, pb: { xs: 10, md: 4 } }}>
        <BackButton fallbackPath="/couple/shortlist" sx={{ mb: 2 }} />
        {children}
      </Box>
    </Box>
  )
}

function PickVendor() {
  const navigate = useNavigate()
  const { items } = useShortlist()
  return (
    <Shell>
      <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: { xs: 22, md: 28 }, color: '#002528', mb: 1 }}>
        Request a booking
      </Typography>
      <Typography sx={{ fontFamily: font, fontSize: 14, color: '#666', mb: 3 }}>
        Choose the vendor you'd like to book. They'll confirm availability and pricing before anything is final.
      </Typography>
      <Card sx={{ border: '0.25px solid #00838F', p: { xs: 2, md: 3 }, maxWidth: 720 }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <StorefrontIcon sx={{ fontSize: 44, color: '#94A3B8', mb: 1 }} />
            <Typography sx={{ fontWeight: 700, mb: 1 }}>No vendor selected yet</Typography>
            <Typography sx={{ fontSize: 14, color: '#666', mb: 2.5 }}>
              Find a vendor you love, then tap “Request a booking” on their profile.
            </Typography>
            <Button onClick={() => navigate('/couple/search-results')} sx={primaryBtnSx}>
              Browse vendors
            </Button>
          </Box>
        ) : (
          <>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>From your shortlist</Typography>
            <Stack divider={<Divider />} spacing={1.5}>
              {items.map((item) => (
                <Stack key={item.id} direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                    <VendorImage src={item.image} name={item.name} rounded={1.5} sx={{ width: 56, height: 56, flexShrink: 0, fontSize: 20 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, color: '#002528' }}>{item.name}</Typography>
                      <Typography sx={{ fontSize: 13, color: '#666' }}>
                        {item.category} · {priceLabel(item.price, 'from ')}
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/couple/booking?vendor=${encodeURIComponent(item.id)}`)}
                    sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#00838F', color: '#00838F', flexShrink: 0 }}
                  >
                    Request booking
                  </Button>
                </Stack>
              ))}
            </Stack>
            <Button onClick={() => navigate('/couple/search-results')} sx={{ mt: 2, textTransform: 'none', color: '#00838F', fontWeight: 600 }}>
              Browse more vendors
            </Button>
          </>
        )}
      </Card>
    </Shell>
  )
}

export default function LiveBooking() {
  const [params] = useSearchParams()
  const vendorId = params.get('vendor') || params.get('vendorId') || ''
  if (!vendorId) return <PickVendor />
  return <BookingRequest key={vendorId} vendorId={vendorId} initialPackage={params.get('package') || ''} />
}

function BookingRequest({ vendorId, initialPackage }: { vendorId: string; initialPackage: string }) {
  const navigate = useNavigate()
  const [detail, setDetail] = useState<DirectoryVendorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const [packageId, setPackageId] = useState('')
  const [addOnIds, setAddOnIds] = useState<string[]>([])
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [venue, setVenue] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError('')
    setNotFound(false)
    directoryApi
      .get(vendorId)
      .then((data) => {
        if (cancelled) return
        setDetail(data)
        const pkgs = data.services.filter((s) => s.type === 'Package' && s.active !== false)
        const match = initialPackage ? pkgs.find((p) => p.name.toLowerCase() === initialPackage.toLowerCase()) : undefined
        setPackageId(match ? match.id : pkgs.length ? '' : CUSTOM)
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
  }, [vendorId, initialPackage, reloadKey])

  const packages = useMemo(() => (detail?.services || []).filter((s) => s.type === 'Package' && s.active !== false), [detail])
  const addOns = useMemo(() => (detail?.services || []).filter((s) => s.type === 'Add-on' && s.active !== false), [detail])
  const selectedPackage = packages.find((p) => p.id === packageId)
  const selectedAddOns = addOns.filter((a) => addOnIds.includes(a.id))
  const estimate = (selectedPackage?.price || 0) + selectedAddOns.reduce((sum, a) => sum + (a.price || 0), 0)
  const today = new Date().toISOString().slice(0, 10)
  const canSubmit = Boolean(packageId) && Boolean(eventDate) && !submitting

  const submit = async () => {
    if (!detail || !canSubmit) return
    const guests = Number.parseInt(guestCount, 10)
    const lines = [
      selectedPackage ? `Package: ${selectedPackage.name}` : 'Package: not sure yet — please send a custom quote',
      selectedAddOns.length ? `Add-ons: ${selectedAddOns.map((a) => a.name).join(', ')}` : '',
      venue.trim() ? `Venue: ${venue.trim()}` : '',
      notes.trim(),
    ].filter(Boolean)
    setSubmitting(true)
    setSubmitError('')
    try {
      await inquiriesApi.create({
        vendorId: detail.card.id,
        kind: 'booking',
        packageName: selectedPackage?.name || 'Custom quote',
        amount: estimate > 0 ? estimate : undefined,
        eventDate,
        guestCount: Number.isFinite(guests) && guests > 0 ? guests : undefined,
        location: venue.trim() || undefined,
        message: `Booking request for ${formatDate(eventDate)}.\n${lines.join('\n')}`,
      })
      setSent(true)
    } catch (err) {
      setSubmitError(apiErrorMessage(err, 'Your booking request could not be sent. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !detail) {
    return (
      <Shell>
        <Box sx={{ display: 'grid', placeItems: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#00838F' }} />
        </Box>
      </Shell>
    )
  }

  if (!detail) {
    return (
      <Shell>
        <Card sx={{ border: '0.25px solid #00838F', p: 4, maxWidth: 520, mx: 'auto', textAlign: 'center' }}>
          <StorefrontIcon sx={{ fontSize: 44, color: '#94A3B8', mb: 1 }} />
          <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>{notFound ? 'Vendor not found' : 'Something went wrong'}</Typography>
          <Typography sx={{ fontSize: 14, color: '#666', mb: 3 }}>
            {notFound ? 'This vendor may have left iTheeWed or the link is incorrect.' : loadError}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
            {!notFound ? (
              <Button variant="outlined" onClick={() => setReloadKey((k) => k + 1)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Try again
              </Button>
            ) : null}
            <Button onClick={() => navigate('/couple/search-results')} sx={primaryBtnSx}>
              Browse vendors
            </Button>
          </Stack>
        </Card>
      </Shell>
    )
  }

  const { card } = detail

  if (sent) {
    return (
      <Shell>
        <Card sx={{ border: '0.25px solid #00838F', p: { xs: 3, md: 5 }, maxWidth: 560, mx: 'auto', textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 72, color: '#22c55e', mb: 1.5 }} />
          <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: 24, color: '#002528', mb: 1 }}>Request sent</Typography>
          <Typography sx={{ fontFamily: font, fontSize: 15, color: '#555', mb: 3 }}>
            {card.name} will review your request and confirm availability and pricing. You can chat with them in Messages, and
            track the status in My Vendors.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => navigate('/couple/my-vendors')}
              sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#00838F', color: '#00838F' }}
            >
              View My Vendors
            </Button>
            <Button onClick={() => navigate(`/couple/messages?vendor=${encodeURIComponent(card.id)}`)} sx={primaryBtnSx}>
              Open Messages
            </Button>
          </Stack>
        </Card>
      </Shell>
    )
  }

  return (
    <Shell>
      <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: { xs: 22, md: 28 }, color: '#002528', mb: 1 }}>
        Request a booking
      </Typography>
      <Typography sx={{ fontFamily: font, fontSize: 14, color: '#666', mb: 3 }}>
        Nothing is charged now. {card.name} will confirm your date and final price before the booking is locked in.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, minWidth: 0 }}>
        <Box sx={{ flex: 1, minWidth: 0, order: { xs: 2, md: 1 } }}>
          <Card sx={{ border: '0.25px solid #00838F', p: { xs: 2, md: 3 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Package</Typography>
            <TextField
              select
              fullWidth
              label="Choose a package"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              sx={{ mb: 2 }}
            >
              {packages.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} — {priceLabel(p.price)}
                </MenuItem>
              ))}
              <MenuItem value={CUSTOM}>Not sure yet — ask for a custom quote</MenuItem>
            </TextField>
            {selectedPackage?.description ? (
              <Typography sx={{ fontSize: 13, color: '#666', mt: -1, mb: 2 }}>{selectedPackage.description}</Typography>
            ) : null}

            {addOns.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.5 }}>Add-ons (optional)</Typography>
                {addOns.map((a) => (
                  <FormControlLabel
                    key={a.id}
                    sx={{ display: 'flex' }}
                    control={
                      <Checkbox
                        checked={addOnIds.includes(a.id)}
                        onChange={(e) =>
                          setAddOnIds((prev) => (e.target.checked ? [...prev, a.id] : prev.filter((x) => x !== a.id)))
                        }
                        sx={{ '&.Mui-checked': { color: '#00838F' } }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 14 }}>
                        {a.name} <span style={{ color: '#B45309', fontWeight: 700 }}>{a.price > 0 ? `+${naira(a.price)}` : '(price on request)'}</span>
                      </Typography>
                    }
                  />
                ))}
              </Box>
            ) : null}

            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Event details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Event date"
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
              />
              <TextField
                label="Guest count"
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Venue / location"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                sx={{ gridColumn: { sm: '1 / -1' } }}
              />
              <TextField
                label="Notes for the vendor"
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Timings, style, special requests…"
                sx={{ gridColumn: { sm: '1 / -1' } }}
              />
            </Box>

            {submitError ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            ) : null}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Button onClick={() => void submit()} disabled={!canSubmit} sx={{ ...primaryBtnSx, minWidth: 200 }}>
                {submitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={18} sx={{ color: 'white' }} />
                    <span>Sending…</span>
                  </Box>
                ) : (
                  'Send booking request'
                )}
              </Button>
            </Box>
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', md: 350 }, flexShrink: 0, order: { xs: 1, md: 2 } }}>
          <Card sx={{ border: '0.25px solid #00838F', p: { xs: 2, md: 3 }, position: { xs: 'static', md: 'sticky' }, top: 20 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <VendorImage
                src={detail.profile.avatar || card.avatar || card.image}
                name={card.name}
                rounded={1.5}
                sx={{ width: 64, height: 64, flexShrink: 0, fontSize: 24 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, color: '#002528' }}>{card.name}</Typography>
                <Typography sx={{ fontSize: 13, color: '#666' }}>
                  {card.category}
                  {card.location ? ` · ${card.location}` : ''}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: 1 }}>
              <Typography sx={{ fontSize: 14, color: '#666' }}>{selectedPackage ? selectedPackage.name : 'Package'}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {selectedPackage ? priceLabel(selectedPackage.price) : packageId === CUSTOM ? 'Custom quote' : '—'}
              </Typography>
            </Box>
            {selectedAddOns.map((a) => (
              <Box key={a.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: 1 }}>
                <Typography sx={{ fontSize: 13, color: '#666' }}>{a.name}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{a.price > 0 ? `+${naira(a.price)}` : 'On request'}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Estimated total</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#00838F' }}>{estimate > 0 ? naira(estimate) : 'To be quoted'}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: '#64748B', mt: 1.5 }}>
              The vendor confirms the final price. No payment is taken when you send this request.
            </Typography>
          </Card>
        </Box>
      </Box>
    </Shell>
  )
}
