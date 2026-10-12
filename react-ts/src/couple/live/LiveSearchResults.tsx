import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Rating,
  Slider,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  CompareArrows,
  Favorite,
  FavoriteBorder,
  GridView,
  Info,
  LocationOn,
  Search,
  Storefront,
  ViewList,
} from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CouplePageShell from '@/couple/components/CouplePageShell'
import VendorPreviewModal from '@/couple/components/VendorPreviewModal'
import CompareVendorsModal from '@/couple/components/CompareVendorsModal'
import FloatingNoteButton from '@/couple/components/FloatingNoteButton'
import { apiErrorMessage, directoryApi, type DirectoryVendor } from '@/shared/lib/api'
import { useShortlist } from '@/shared/contexts/ShortlistContext'
import { VendorImage, priceLabel, shortlistItemFromCard } from '@/couple/live/liveVendor'

const PAGE_SIZE = 12
const MAX_BUDGET = 10_000_000

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase())

export default function LiveSearchResults() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { addToShortlist, removeFromShortlist, isInShortlist, updateNotes, items: shortlistItems } = useShortlist()

  const [query, setQuery] = useState(() => params.get('q') || params.get('search') || '')
  const [location, setLocation] = useState(() => params.get('location') || '')
  const [category, setCategory] = useState(() => (params.get('category') || 'all').toLowerCase())
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [maxPrice, setMaxPrice] = useState(() => {
    const fromUrl = Number(params.get('maxPrice'))
    return Number.isFinite(fromUrl) && fromUrl > 0 ? Math.min(fromUrl, MAX_BUDGET) : MAX_BUDGET
  })
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  const [vendors, setVendors] = useState<DirectoryVendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const compareParam = params.get('compare')
    if (!compareParam) return
    const ids = compareParam.split(',').filter(Boolean).slice(0, 3)
    if (ids.length) {
      setCompareIds(ids)
      if (ids.length >= 2) setCompareOpen(true)
    }
  }, [params])

  // Category is filtered client-side so the chips can show real counts per category.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const t = window.setTimeout(() => {
      directoryApi
        .list({
          q: query.trim() || undefined,
          location: location.trim() || undefined,
          maxPrice: maxPrice < MAX_BUDGET ? maxPrice : undefined,
          limit: 100,
        })
        .then((data) => {
          if (cancelled) return
          setVendors(data.results)
          setError('')
        })
        .catch((err) => {
          if (!cancelled) setError(apiErrorMessage(err, 'We could not load vendors right now. Please try again.'))
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 300)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [query, location, maxPrice, reloadKey])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: vendors.length }
    for (const v of vendors) {
      const key = v.category.toLowerCase()
      counts[key] = (counts[key] || 0) + 1
    }
    return counts
  }, [vendors])

  const categories = useMemo(() => {
    const keys = Object.keys(categoryCounts).filter((k) => k !== 'all')
    if (category !== 'all' && !keys.some((k) => k.includes(category))) keys.push(category)
    return ['all', ...keys]
  }, [categoryCounts, category])

  const filtered = useMemo(
    () => (category === 'all' ? vendors : vendors.filter((v) => v.category.toLowerCase().includes(category))),
    [vendors, category],
  )
  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const selected = selectedIndex !== null ? visible[selectedIndex] : undefined

  const toggleShortlist = useCallback(
    (vendor: DirectoryVendor) => {
      if (isInShortlist(vendor.id)) removeFromShortlist(vendor.id)
      else addToShortlist(shortlistItemFromCard(vendor))
    },
    [addToShortlist, isInShortlist, removeFromShortlist],
  )

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const clearFilters = () => {
    setQuery('')
    setLocation('')
    setCategory('all')
    setMaxPrice(MAX_BUDGET)
    setVisibleCount(PAGE_SIZE)
  }

  const hasFilters = Boolean(query.trim() || location.trim() || maxPrice < MAX_BUDGET)

  const emptyState = (() => {
    if (category !== 'all' && vendors.length > 0) {
      return {
        title: `No ${titleCase(category)} vendors have joined yet`,
        body: 'New vendors are joining iTheeWed every week. Try another category in the meantime.',
        action: { label: 'Show all categories', onClick: () => setCategory('all') },
      }
    }
    if (category !== 'all' || hasFilters) {
      return {
        title: category !== 'all' ? `No ${titleCase(category)} vendors have joined yet` : 'No vendors match your search',
        body: 'Try a broader search, a different location or a higher budget.',
        action: { label: 'Clear filters', onClick: clearFilters },
      }
    }
    return {
      title: 'No vendors have joined yet',
      body: 'Vendors are signing up now — check back soon. Anything you shortlist will be saved to your account.',
      action: { label: 'Go to dashboard', onClick: () => navigate('/couple/dashboard') },
    }
  })()

  const contactVendor = (vendor: DirectoryVendor) => navigate(`/couple/messages?vendor=${encodeURIComponent(vendor.id)}`)

  return (
    <CouplePageShell
      title="Hire Vendors"
      subtitle="Browse real vendors on iTheeWed, compare prices and portfolios, and message them directly."
      badge={loading ? 'Searching…' : `${filtered.length} ${filtered.length === 1 ? 'match' : 'matches'}`}
    >
      <Paper elevation={0} sx={{ p: 2.2, border: '1px solid #E2E8F0', borderRadius: 3, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems={{ md: 'center' }}>
          <TextField
            placeholder="Search vendors, services or keywords…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#64748B' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="Location (e.g. Lekki)"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
            size="small"
            sx={{ minWidth: { md: 220 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn sx={{ color: '#64748B' }} />
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup
            exclusive
            value={view}
            onChange={(_, next) => next && setView(next)}
            size="small"
            sx={{ bgcolor: '#F8FAFC', borderRadius: 2.5, flexShrink: 0 }}
          >
            <ToggleButton value="grid" aria-label="Grid">
              <GridView fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list" aria-label="List">
              <ViewList fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #EDF2F7' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
              Max budget{maxPrice >= MAX_BUDGET ? ': any' : ''}
            </Typography>
            <Tooltip title="Only show vendors whose starting price is within this ceiling">
              <Info sx={{ fontSize: 16, color: '#94A3B8' }} />
            </Tooltip>
          </Stack>
          <Slider
            value={maxPrice}
            onChange={(_, v) => {
              setMaxPrice(v as number)
              setVisibleCount(PAGE_SIZE)
            }}
            min={100000}
            max={MAX_BUDGET}
            step={50000}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => (v >= MAX_BUDGET ? 'Any' : `₦${(v / 1000).toFixed(0)}K`)}
            sx={{
              '& .MuiSlider-track': { bgcolor: '#0F766E' },
              '& .MuiSlider-thumb': { bgcolor: '#0F766E' },
            }}
          />
        </Box>
      </Paper>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-1">
        {categories.map((item) => {
          const count = item === 'all' ? vendors.length : vendors.filter((v) => v.category.toLowerCase().includes(item)).length
          const label = item === 'all' ? `All (${count})` : `${titleCase(item)} (${count})`
          return (
            <Chip
              key={item}
              label={label}
              onClick={() => {
                setCategory(item)
                setVisibleCount(PAGE_SIZE)
              }}
              sx={{
                fontWeight: 700,
                borderRadius: 999,
                flexShrink: 0,
                bgcolor: category === item ? '#0F766E' : '#F1F5F9',
                color: category === item ? '#fff' : '#334155',
              }}
            />
          )
        })}
      </div>

      {error ? (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setReloadKey((k) => k + 1)}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : null}

      {loading && vendors.length === 0 ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0F766E' }} />
        </Box>
      ) : !error && filtered.length === 0 ? (
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px dashed #CBD5E1', borderRadius: 3, textAlign: 'center' }}>
          <Storefront sx={{ fontSize: 44, color: '#94A3B8', mb: 1 }} />
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#0F172A' }}>{emptyState.title}</Typography>
          <Typography sx={{ color: '#64748B', fontSize: 14, mt: 0.75, mb: 2.5, maxWidth: 460, mx: 'auto' }}>
            {emptyState.body}
          </Typography>
          <Button
            variant="contained"
            onClick={emptyState.action.onClick}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, bgcolor: '#0F766E', '&:hover': { bgcolor: '#0D9488' } }}
          >
            {emptyState.action.label}
          </Button>
        </Paper>
      ) : view === 'grid' ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {visible.map((vendor, index) => {
            const inShortlist = isInShortlist(vendor.id)
            const note = shortlistItems.find((i) => i.id === vendor.id)?.notes || ''
            const comparing = compareIds.includes(vendor.id)
            return (
              <Paper
                key={vendor.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: comparing ? '2px solid #0F766E' : '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#fff',
                }}
              >
                <Box sx={{ position: 'relative', height: { xs: 200, md: 240 }, bgcolor: '#F1F5F9' }}>
                  <VendorImage
                    src={vendor.image || vendor.avatar}
                    name={vendor.name}
                    sx={{ width: '100%', height: '100%', fontSize: 56 }}
                    onClick={() => setSelectedIndex(index)}
                  />
                  <Chip
                    label={vendor.category}
                    size="small"
                    sx={{ position: 'absolute', left: 12, top: 12, bgcolor: 'rgba(255,255,255,0.95)', fontWeight: 800, fontSize: 11 }}
                  />
                  <IconButton
                    aria-label={inShortlist ? 'Remove from shortlist' : 'Add to shortlist'}
                    onClick={() => toggleShortlist(vendor)}
                    sx={{ position: 'absolute', right: 10, top: 10, bgcolor: 'rgba(255,255,255,0.92)' }}
                  >
                    {inShortlist ? <Favorite sx={{ color: '#EB1948' }} /> : <FavoriteBorder sx={{ color: '#334155' }} />}
                  </IconButton>
                </Box>

                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 17, color: '#0F172A' }}>{vendor.name}</Typography>
                  {vendor.location ? (
                    <Stack direction="row" spacing={0.6} alignItems="center">
                      <LocationOn sx={{ fontSize: 14, color: '#64748B' }} />
                      <Typography sx={{ fontSize: 13, color: '#64748B' }}>{vendor.location}</Typography>
                    </Stack>
                  ) : null}
                  {vendor.rating > 0 ? (
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Rating value={vendor.rating} readOnly size="small" precision={0.1} />
                      <Typography sx={{ fontSize: 12, color: '#64748B' }}>({vendor.reviewCount})</Typography>
                    </Stack>
                  ) : null}
                  {vendor.description ? (
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: '#475569',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {vendor.description}
                    </Typography>
                  ) : null}
                  {vendor.features.length ? (
                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                      {vendor.features.slice(0, 4).map((f) => (
                        <Chip key={f} label={f} size="small" sx={{ fontSize: 11, bgcolor: '#F1F5F9' }} />
                      ))}
                    </Stack>
                  ) : null}

                  <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 0.6 }}>STARTING PRICE</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#0F766E', fontSize: 16 }}>{priceLabel(vendor.price)}</Typography>
                  </Box>

                  <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 1.2, border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#0F766E', mb: 0.5, letterSpacing: 0.5 }}>
                      YOUR NOTE
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Add a private note (saves to your shortlist)…"
                      value={note}
                      onChange={(e) => {
                        if (!inShortlist) addToShortlist({ ...shortlistItemFromCard(vendor), notes: e.target.value })
                        else updateNotes(vendor.id, e.target.value)
                      }}
                      multiline
                      minRows={2}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', fontSize: 13 } }}
                    />
                  </Box>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ sm: 'center' }}
                    justifyContent="space-between"
                    sx={{ mt: 'auto', pt: 0.5 }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={comparing}
                          onChange={() => toggleCompare(vendor.id)}
                          color="default"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#0F766E' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#0F766E' },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: comparing ? '#0F766E' : '#475569' }}>Compare</Typography>
                      }
                      sx={{ mr: 0, ml: 0 }}
                    />
                    {inShortlist ? (
                      <Chip
                        label="Shortlisted"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: 11,
                          height: 26,
                          border: '1px solid #99F6E4',
                          borderRadius: 1.5,
                          bgcolor: '#F0FDFA',
                          color: '#0F766E',
                          alignSelf: { xs: 'flex-start', sm: 'center' },
                        }}
                      />
                    ) : null}
                    <Button
                      variant="contained"
                      onClick={() => contactVendor(vendor)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        bgcolor: '#0F766E',
                        px: 2.5,
                        width: { xs: '100%', sm: 'auto' },
                        '&:hover': { bgcolor: '#0D9488' },
                      }}
                    >
                      Message
                    </Button>
                  </Stack>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(`/couple/vendor/${vendor.id}`)}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, borderColor: '#CBD5E1', color: '#0F172A' }}
                  >
                    View profile
                  </Button>
                </Box>
              </Paper>
            )
          })}
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {visible.map((vendor) => {
            const inShortlist = isInShortlist(vendor.id)
            return (
              <Paper
                key={vendor.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  display: 'grid',
                  gridTemplateColumns: { xs: '88px 1fr', md: '120px 1fr auto' },
                  gap: 1.5,
                  alignItems: 'center',
                }}
              >
                <VendorImage src={vendor.image || vendor.avatar} name={vendor.name} rounded={2} sx={{ width: '100%', height: 88 }} />
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>{vendor.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                    {vendor.category}
                    {vendor.location ? ` · ${vendor.location}` : ''}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, color: '#0F766E', mt: 0.5 }}>{priceLabel(vendor.price)}</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={compareIds.includes(vendor.id)}
                        onChange={() => toggleCompare(vendor.id)}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#0F766E' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#0F766E' },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: 12, fontWeight: 700 }}>Compare</Typography>}
                    sx={{ mr: 1 }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/couple/vendor/${vendor.id}`)}
                    sx={{ textTransform: 'none', bgcolor: '#0F766E', fontWeight: 700 }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => contactVendor(vendor)}
                    sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#0F766E', color: '#0F766E' }}
                  >
                    Message
                  </Button>
                  <IconButton
                    aria-label={inShortlist ? 'Remove from shortlist' : 'Add to shortlist'}
                    onClick={() => toggleShortlist(vendor)}
                  >
                    {inShortlist ? <Favorite sx={{ color: '#EB1948' }} /> : <FavoriteBorder />}
                  </IconButton>
                </Stack>
              </Paper>
            )
          })}
        </Stack>
      )}

      {visibleCount < filtered.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            onClick={() => setVisibleCount((p) => p + PAGE_SIZE)}
            variant="outlined"
            sx={{ textTransform: 'none', borderRadius: 6, fontWeight: 700 }}
          >
            Load more vendors
          </Button>
        </Box>
      ) : null}

      {selected ? (
        <VendorPreviewModal
          open
          onClose={() => setSelectedIndex(null)}
          vendor={{
            id: selected.id,
            name: selected.name,
            category: selected.category,
            image: selected.image || selected.avatar,
            images: [selected.image, selected.avatar].filter(Boolean),
            rating: selected.rating,
            reviewCount: selected.reviewCount,
            location: selected.location,
            price: priceLabel(selected.price),
          }}
          isInShortlist={isInShortlist(selected.id)}
          onAddToShortlist={() => addToShortlist(shortlistItemFromCard(selected))}
          onRemoveFromShortlist={() => removeFromShortlist(selected.id)}
          onPrevVendor={() => setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNextVendor={() => setSelectedIndex((i) => (i !== null && i < visible.length - 1 ? i + 1 : i))}
          canGoPrev={(selectedIndex ?? 0) > 0}
          canGoNext={(selectedIndex ?? 0) < visible.length - 1}
        />
      ) : null}

      {compareIds.length > 0 ? (
        <Box
          sx={{
            position: 'fixed',
            left: { xs: 12, md: 'auto' },
            right: { xs: 12, md: 28 },
            bottom: { xs: 80, md: 28 },
            zIndex: 40,
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}
        >
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              border: '1px solid #CCFBF1',
              bgcolor: 'rgba(255,255,255,0.98)',
              px: { xs: 1.25, sm: 1.5 },
              py: 1,
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: '100%', sm: 360 },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
              <Box sx={{ minWidth: 0, pl: 0.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  Compare {compareIds.length}/3
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#64748B', display: { xs: 'none', sm: 'block' } }}>
                  {compareIds.length < 2 ? 'Pick one more vendor' : 'Ready to compare'}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
                <Button
                  size="small"
                  onClick={() => setCompareIds([])}
                  sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B', minWidth: 0, px: 1 }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CompareArrows sx={{ fontSize: 18 }} />}
                  disabled={compareIds.length < 2}
                  onClick={() => setCompareOpen(true)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: '#0F766E',
                    px: 1.75,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#0D9488', boxShadow: 'none' },
                    '&.Mui-disabled': { bgcolor: '#E2E8F0', color: '#94A3B8' },
                  }}
                >
                  Open
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      ) : null}

      <CompareVendorsModal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        vendorIds={compareIds}
        vendors={vendors
          .filter((v) => compareIds.includes(v.id))
          .map((v) => ({
            id: v.id,
            name: v.name,
            price: v.price,
            category: v.category,
            image: v.image || v.avatar,
            location: v.location,
            rating: v.rating,
            reviewCount: v.reviewCount,
          }))}
        onClear={() => {
          setCompareIds([])
          setCompareOpen(false)
        }}
      />

      <FloatingNoteButton />
    </CouplePageShell>
  )
}
