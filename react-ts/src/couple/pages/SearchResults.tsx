import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
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
  Favorite,
  FavoriteBorder,
  GridView,
  LocationOn,
  Search,
  ViewList,
  Info,
  CompareArrows,
} from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CouplePageShell from '@/couple/components/CouplePageShell'
import { mockVendors } from '@/shared/data/mockVendors'
import { searchApi } from '@/shared/lib/api'
import { useShortlist } from '@/shared/contexts/ShortlistContext'
import VendorPreviewModal from '@/couple/components/VendorPreviewModal'
import CompareVendorsModal from '@/couple/components/CompareVendorsModal'
import FloatingNoteButton from '@/couple/components/FloatingNoteButton'

type VendorCard = (typeof mockVendors)[0] & { images?: string[] }

const PAGE_SIZE = 12
const MAX_BUDGET = 10_000_000
const parsePrice = (value: string) => Number.parseInt(value.replace(/[^0-9]/g, ''), 10) || 0

const statusFor = (id: string, shortlisted: boolean) => {
  if (shortlisted) {
    return { label: 'Shortlisted', bgcolor: '#F0FDFA', color: '#0F766E', borderColor: '#99F6E4' }
  }
  const n = id.charCodeAt(0) % 3
  if (n === 0) {
    return { label: 'Enquiry sent', bgcolor: '#F0F9FF', color: '#0369A1', borderColor: '#BAE6FD' }
  }
  if (n === 1) {
    return { label: 'Quote received', bgcolor: '#FFF7ED', color: '#C2410C', borderColor: '#FED7AA' }
  }
  return { label: 'Available', bgcolor: '#F8FAFC', color: '#475569', borderColor: '#E2E8F0' }
}

export default function SearchResults() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initialCategory = params.get('category')
  const { addToShortlist, removeFromShortlist, isInShortlist, updateNotes, items: shortlistItems } =
    useShortlist()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory ? initialCategory.toLowerCase() : 'all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [maxPrice, setMaxPrice] = useState(MAX_BUDGET)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [selectedVendor, setSelectedVendor] = useState<VendorCard | null>(null)
  const [selectedVendorIndex, setSelectedVendorIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [apiVendors, setApiVendors] = useState<VendorCard[] | null>(null)
  const [searchEngine, setSearchEngine] = useState<'elasticsearch' | 'memory' | 'local'>('local')

  useEffect(() => {
    const compareParam = params.get('compare')
    if (!compareParam) return
    const ids = compareParam.split(',').filter(Boolean).slice(0, 3)
    if (ids.length) {
      setCompareIds(ids)
      if (ids.length >= 2) setCompareOpen(true)
    }
  }, [params])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const data = await searchApi.vendors({
          q: query || undefined,
          category: category === 'all' ? undefined : category,
          maxPrice,
          limit: 40,
        })
        if (cancelled) return
        setSearchEngine(data.engine)
        setApiVendors(
          data.results.map((v) => ({
            id: v.id,
            name: v.name,
            price: `N${v.price.toLocaleString('en-NG')}`,
            image: v.image,
            images: [v.image, v.image, v.image],
            category: v.category,
            location: v.location,
            fullAddress: v.location,
            rating: v.rating,
            reviewCount: v.reviewCount,
          })),
        )
      } catch {
        if (!cancelled) {
          setApiVendors(null)
          setSearchEngine('local')
        }
      }
    }
    const t = window.setTimeout(() => void run(), 250)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [query, category, maxPrice])

  const source = apiVendors || mockVendors

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: source.length }
    for (const v of source) {
      const key = v.category.toLowerCase()
      counts[key] = (counts[key] || 0) + 1
    }
    return counts
  }, [source])

  const categories = useMemo(() => ['all', ...Object.keys(categoryCounts).filter((k) => k !== 'all')], [categoryCounts])

  const filtered = useMemo(() => {
    if (apiVendors) return [...apiVendors].sort((a, b) => b.rating - a.rating)
    const normalized = query.trim().toLowerCase()
    return mockVendors
      .filter((vendor) => {
        const matchesQuery =
          !normalized ||
          vendor.name.toLowerCase().includes(normalized) ||
          vendor.location.toLowerCase().includes(normalized) ||
          vendor.category.toLowerCase().includes(normalized)
        const matchesCategory = category === 'all' || vendor.category.toLowerCase() === category
        const matchesPrice = parsePrice(vendor.price) <= maxPrice
        return matchesQuery && matchesCategory && matchesPrice
      })
      .sort((a, b) => b.rating - a.rating)
  }, [query, category, maxPrice, apiVendors])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const openModal = (vendor: VendorCard, index: number) => {
    setSelectedVendor(vendor)
    setSelectedVendorIndex(index)
    setModalOpen(true)
  }

  return (
    <CouplePageShell
      title="Hire Vendors"
      subtitle={`Compare prices, portfolios, and lock in your dream curators${searchEngine !== 'local' ? ` · ${searchEngine}` : ''}.`}
      badge={`${filtered.length} matches`}
    >
      <Paper elevation={0} sx={{ p: 2.2, border: '1px solid #E2E8F0', borderRadius: 3, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems={{ md: 'center' }}>
          <TextField
            placeholder="Search vendors, location, or category…"
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
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>Max budget</Typography>
            <Tooltip title="Only show vendors within this ceiling">
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
            valueLabelFormat={(v) => `₦${(v / 1000).toFixed(0)}K`}
            sx={{
              '& .MuiSlider-track': { bgcolor: '#0F766E' },
              '& .MuiSlider-thumb': { bgcolor: '#0F766E' },
            }}
          />
        </Box>
      </Paper>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-1">
        {categories.map((item) => {
          const count = categoryCounts[item] || 0
          const label =
            item === 'all' ? `All (${count})` : `${item.replace(/\b\w/g, (c) => c.toUpperCase())} (${count})`
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

      {view === 'grid' ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {visible.map((vendor, index) => {
            const inShortlist = isInShortlist(vendor.id)
            const note = shortlistItems.find((i) => i.id === vendor.id)?.notes || ''
            const status = statusFor(vendor.id, inShortlist)
            const thumbs = [vendor.image, vendor.image, vendor.image]
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
                  <Box
                    component="img"
                    src={vendor.image}
                    alt={vendor.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => openModal(vendor, index)}
                  />
                  <Chip
                    label={vendor.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      left: 12,
                      top: 12,
                      bgcolor: 'rgba(255,255,255,0.95)',
                      fontWeight: 800,
                      fontSize: 11,
                      letterSpacing: 0.4,
                    }}
                  />
                  <IconButton
                    aria-label="Toggle shortlist"
                    onClick={() => {
                      if (inShortlist) removeFromShortlist(vendor.id)
                      else
                        addToShortlist({
                          id: vendor.id,
                          name: vendor.name,
                          category: vendor.category,
                          image: vendor.image,
                          price: parsePrice(vendor.price),
                        })
                    }}
                    sx={{ position: 'absolute', right: 10, top: 10, bgcolor: 'rgba(255,255,255,0.92)' }}
                  >
                    {inShortlist ? (
                      <Favorite sx={{ color: '#EB1948' }} />
                    ) : (
                      <FavoriteBorder sx={{ color: '#334155' }} />
                    )}
                  </IconButton>
                  <Stack direction="row" spacing={0.8} sx={{ position: 'absolute', left: 12, bottom: 12 }}>
                    {thumbs.map((src, i) => (
                      <Box
                        key={i}
                        component="img"
                        src={src}
                        alt=""
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1.5,
                          objectFit: 'cover',
                          border: '2px solid #fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 17, color: '#0F172A' }}>{vendor.name}</Typography>
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <LocationOn sx={{ fontSize: 14, color: '#64748B' }} />
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>{vendor.location}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Rating value={vendor.rating} readOnly size="small" precision={0.1} />
                    <Typography sx={{ fontSize: 12, color: '#64748B' }}>({vendor.reviewCount})</Typography>
                  </Stack>

                  <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 0.6 }}>
                      EST. PRICE
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: '#0F766E', fontSize: 16 }}>{vendor.price}</Typography>
                  </Box>

                  <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 1.2, border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#0F766E', mb: 0.5, letterSpacing: 0.5 }}>
                      YOUR NOTE
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Add a private note…"
                      value={note}
                      onChange={(e) => {
                        if (!inShortlist) {
                          addToShortlist({
                            id: vendor.id,
                            name: vendor.name,
                            category: vendor.category,
                            image: vendor.image,
                            price: parsePrice(vendor.price),
                            notes: e.target.value,
                          })
                        } else {
                          updateNotes(vendor.id, e.target.value)
                        }
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
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: comparing ? '#0F766E' : '#475569' }}>
                          Compare
                        </Typography>
                      }
                      sx={{ mr: 0, ml: 0 }}
                    />
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: 11,
                        height: 26,
                        border: '1px solid',
                        borderRadius: 1.5,
                        bgcolor: status.bgcolor,
                        color: status.color,
                        borderColor: status.borderColor,
                        alignSelf: { xs: 'flex-start', sm: 'center' },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate(`/couple/messages?vendor=${encodeURIComponent(vendor.name)}`)
                      }
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
                      Contact
                    </Button>
                  </Stack>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(`/couple/vendor/${vendor.id}`)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                      borderColor: '#CBD5E1',
                      color: '#0F172A',
                    }}
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
          {visible.map((vendor, index) => {
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
                <Box
                  component="img"
                  src={vendor.image}
                  alt=""
                  sx={{ width: '100%', height: 88, objectFit: 'cover', borderRadius: 2 }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>{vendor.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                    {vendor.category} · {vendor.location}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, color: '#0F766E', mt: 0.5 }}>{vendor.price}</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
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
                  <IconButton
                    onClick={() =>
                      inShortlist
                        ? removeFromShortlist(vendor.id)
                        : addToShortlist({
                            id: vendor.id,
                            name: vendor.name,
                            category: vendor.category,
                            image: vendor.image,
                            price: parsePrice(vendor.price),
                          })
                    }
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

      {selectedVendor ? (
        <VendorPreviewModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedVendor(null)
          }}
          vendor={{
            ...selectedVendor,
            images: selectedVendor.images || [selectedVendor.image, selectedVendor.image, selectedVendor.image],
          }}
          isInShortlist={isInShortlist(selectedVendor.id)}
          onAddToShortlist={() =>
            addToShortlist({
              id: selectedVendor.id,
              name: selectedVendor.name,
              category: selectedVendor.category,
              image: selectedVendor.image,
              price: parsePrice(selectedVendor.price),
            })
          }
          onRemoveFromShortlist={() => removeFromShortlist(selectedVendor.id)}
          onPrevVendor={() => {
            const i = selectedVendorIndex - 1
            if (i >= 0) {
              setSelectedVendor(visible[i])
              setSelectedVendorIndex(i)
            }
          }}
          onNextVendor={() => {
            const i = selectedVendorIndex + 1
            if (i < visible.length) {
              setSelectedVendor(visible[i])
              setSelectedVendorIndex(i)
            }
          }}
          canGoPrev={selectedVendorIndex > 0}
          canGoNext={selectedVendorIndex < visible.length - 1}
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
              backdropFilter: 'blur(10px)',
              px: { xs: 1.25, sm: 1.5 },
              py: 1,
              boxShadow: '0 12px 36px rgba(15,23,42,0.18)',
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: '100%', sm: 360 },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: '100%' }}
            >
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
        vendors={visible
          .filter((v) => compareIds.includes(v.id))
          .map((v) => ({
            id: v.id,
            name: v.name,
            price: parsePrice(v.price),
            category: v.category,
            image: v.image,
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
