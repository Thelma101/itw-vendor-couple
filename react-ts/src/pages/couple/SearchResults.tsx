import { useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Rating,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  ExpandMore,
  Favorite,
  FavoriteBorder,
  GridView,
  LocationOn,
  Search,
  ViewList,
  Info,
} from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CouplePageShell from '@/components/couple/CouplePageShell'
import { mockVendors } from '@/data/mockVendors'
import { useShortlist } from '@/contexts/ShortlistContext'

const PAGE_SIZE = 8
const MAX_BUDGET = 5000000  // Unlimited budget for vendors

const parsePrice = (value: string) => Number.parseInt(value.replace(/[^0-9]/g, ''), 10) || 0

export default function SearchResults() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initialCategory = params.get('category')

  const { addToShortlist, removeFromShortlist, isInShortlist } = useShortlist()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory ? initialCategory.toLowerCase() : 'all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [maxPrice, setMaxPrice] = useState(MAX_BUDGET)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const categories = useMemo(() => ['all', ...new Set(mockVendors.map((vendor) => vendor.category.toLowerCase()))], [])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return mockVendors
      .filter((vendor) => {
        const matchesQuery =
          vendor.name.toLowerCase().includes(normalized) ||
          vendor.location.toLowerCase().includes(normalized) ||
          vendor.category.toLowerCase().includes(normalized)

        const matchesCategory = category === 'all' || vendor.category.toLowerCase() === category
        const matchesPrice = parsePrice(vendor.price) <= maxPrice

        return matchesQuery && matchesCategory && matchesPrice
      })
      .sort((a, b) => b.rating - a.rating)
  }, [query, category, maxPrice])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  return (
    <CouplePageShell
      title="Hire Vendors"
      subtitle="Discover, compare, and shortlist vendors with less noise and faster decisions."
      badge={`${filtered.length} matches`}
    >
      <Paper elevation={0} sx={{ p: 2.2, border: '1px solid #E2E8F0', borderRadius: 3, mb: 2.5 }}>
        <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', xl: 'center' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} sx={{ flex: 1 }}>
            <TextField
              placeholder="Search vendor, location, or category"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setVisibleCount(PAGE_SIZE)
              }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#64748B' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{ 'aria-label': 'Search vendors' }}
              sx={{ minWidth: { xs: '100%', md: 320 } }}
            />

            <ToggleButtonGroup
              exclusive
              value={view}
              onChange={(_, next) => {
                if (next) setView(next)
              }}
              size="small"
              aria-label="Vendor result view"
              sx={{ bgcolor: '#F8FAFC', borderRadius: 2.5 }}
            >
              <ToggleButton value="grid" aria-label="Grid view"><GridView fontSize="small" /></ToggleButton>
              <ToggleButton value="list" aria-label="List view"><ViewList fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        {/* Budget Filter Section */}
        <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid #EDF2F7' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Maximum Budget Per Vendor</Typography>
            <Tooltip title="This filter shows only vendors whose pricing is within your maximum budget" placement="top">
              <Info sx={{ fontSize: 16, color: '#94A3B8', cursor: 'help' }} />
            </Tooltip>
          </Stack>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr auto' }, gap: 2, alignItems: 'center' }}>
            <Slider
              value={maxPrice}
              onChange={(_, newValue) => {
                setMaxPrice(newValue as number)
                setVisibleCount(PAGE_SIZE)
              }}
              min={100000}
              max={MAX_BUDGET}
              step={50000}
              marks={[
                { value: 100000, label: 'N100K' },
                { value: 500000, label: 'N500K' },
                { value: 1000000, label: 'N1M' },
                { value: 2000000, label: 'N2M' },
                { value: 5000000, label: 'N5M+' },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `N${(value / 1000000).toFixed(1)}M`}
              sx={{
                '& .MuiSlider-track': { bgcolor: '#0F766E', border: 'none' },
                '& .MuiSlider-thumb': { bgcolor: '#0F766E', border: '3px solid white', boxShadow: '0 2px 8px rgba(15,118,110,0.3)' },
                '& .MuiSlider-mark[data-index]': { bgcolor: '#E2E8F0' },
                '& .MuiSlider-markLabel': { fontSize: 11, color: '#64748B', top: 24 },
              }}
            />
            
            <Box sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>N{maxPrice.toLocaleString()}</Typography>
              <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>{filtered.length} vendors match</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Accordion elevation={0} disableGutters sx={{ border: '1px solid #E2E8F0', borderRadius: '12px !important', mb: 2.5, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>Category Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {categories.map((item) => (
              <Chip
                key={item}
                label={item === 'all' ? 'All' : item.replace(/\b\w/g, (char) => char.toUpperCase())}
                onClick={() => {
                  setCategory(item)
                  setVisibleCount(PAGE_SIZE)
                }}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                  bgcolor: category === item ? '#00838F' : '#F8FAFC',
                  color: category === item ? '#fff' : '#334155',
                }}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {view === 'grid' ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
          {visible.map((vendor) => {
            const inShortlist = isInShortlist(vendor.id)

            return (
              <Paper
                key={vendor.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  transition: 'all 0.22s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(15,23,42,0.12)' },
                }}
              >
                <Box sx={{ position: 'relative', height: 180, backgroundColor: '#F0F4F8', overflow: 'hidden' }}>
                  <Box component="img" src={vendor.image} alt={vendor.name} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }} />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, transparent 70%, rgba(15,23,42,0.2))',
                    }}
                  />
                  <IconButton
                    aria-label={inShortlist ? `Remove ${vendor.name} from shortlist` : `Add ${vendor.name} to shortlist`}
                    onClick={() => {
                      if (inShortlist) removeFromShortlist(vendor.id)
                      else addToShortlist({ id: vendor.id, name: vendor.name, category: vendor.category, image: vendor.image, price: parsePrice(vendor.price) })
                    }}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      bgcolor: '#FFFFFFD9',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: '#FFFFFF', transform: 'scale(1.1)' },
                    }}
                  >
                    {inShortlist ? <Favorite sx={{ color: '#EB1948', fontSize: 20 }} /> : <FavoriteBorder sx={{ color: '#334155', fontSize: 20 }} />}
                  </IconButton>
                  <Chip
                    label={vendor.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      left: 8,
                      bottom: 8,
                      borderRadius: 2,
                      bgcolor: '#FFFFFF',
                      color: '#4338CA',
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  />
                </Box>

                <Box sx={{ p: 1.8, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>{vendor.name}</Typography>
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.8, mb: 0.6 }}>
                    <Rating value={vendor.rating} readOnly precision={0.1} size="small" />
                    <Typography sx={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>({vendor.reviewCount})</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.6} alignItems="flex-start" sx={{ mb: 1 }}>
                    <LocationOn sx={{ fontSize: 13, color: '#64748B', mt: 0.2, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 12, color: '#64748B', lineHeight: 1.3 }}>{vendor.location}</Typography>
                  </Stack>
                  <Box sx={{ flex: 1 }} />
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1.2 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#0F766E' }}>{vendor.price}</Typography>
                  </Stack>
                  <Button onClick={() => navigate(`/couple/vendor/${vendor.id}`)} fullWidth variant="contained" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, bgcolor: '#00838F', fontSize: 12, py: 1, '&:hover': { bgcolor: '#006670' } }}>
                    View Details
                  </Button>
                </Box>
              </Paper>
            )
          })}
        </Box>
      ) : (
        <Stack spacing={1.8}>
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
                  gridTemplateColumns: { xs: '90px 1fr', sm: '110px 1fr' },
                  gap: 1.8,
                  alignItems: 'start',
                  transition: 'all 0.2s ease',
                  '&:hover': { boxShadow: '0 8px 20px rgba(15,23,42,0.1)', borderColor: '#0F766E' },
                }}
              >
                {/* Image */}
                <Box sx={{ position: 'relative', height: 90, borderRadius: 2.5, overflow: 'hidden', backgroundColor: '#F0F4F8' }}>
                  <Box component="img" src={vendor.image} alt={vendor.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <IconButton
                    aria-label={inShortlist ? `Remove from shortlist` : `Add to shortlist`}
                    onClick={() => {
                      if (inShortlist) removeFromShortlist(vendor.id)
                      else addToShortlist({ id: vendor.id, name: vendor.name, category: vendor.category, image: vendor.image, price: parsePrice(vendor.price) })
                    }}
                    sx={{
                      position: 'absolute',
                      right: 2,
                      top: 2,
                      width: 32,
                      height: 32,
                      bgcolor: '#FFFFFFD9',
                      backdropFilter: 'blur(4px)',
                      '&:hover': { bgcolor: '#FFFFFF' },
                    }}
                  >
                    {inShortlist ? <Favorite sx={{ color: '#EB1948', fontSize: 16 }} /> : <FavoriteBorder sx={{ color: '#334155', fontSize: 16 }} />}
                  </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1.6, alignItems: 'center' }}>
                  <Stack spacing={1}>
                    <Box>
                      <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>{vendor.name}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.4 }}>
                        <Rating value={vendor.rating} readOnly precision={0.1} size="small" />
                        <Typography sx={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>({vendor.reviewCount})</Typography>
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOn sx={{ fontSize: 13, color: '#64748B' }} />
                      <Typography sx={{ fontSize: 12, color: '#64748B' }}>{vendor.location}</Typography>
                    </Stack>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip label={vendor.category} size="small" sx={{ borderRadius: 1.5, bgcolor: '#EEF2FF', color: '#4338CA', fontWeight: 700, fontSize: 11 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#0F766E' }}>{vendor.price}</Typography>
                    </Box>
                  </Stack>

                  <Button
                    onClick={() => navigate(`/couple/vendor/${vendor.id}`)}
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                      bgcolor: '#00838F',
                      whiteSpace: 'nowrap',
                      height: 'fit-content',
                      '&:hover': { bgcolor: '#006670' },
                    }}
                  >
                    View
                  </Button>
                </Box>
              </Paper>
            )
          })}
        </Stack>
      )}

      {visibleCount < filtered.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5 }}>
          <Button onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)} variant="outlined" sx={{ textTransform: 'none', borderRadius: 6, fontWeight: 700 }}>
            Load more vendors
          </Button>
        </Box>
      )}
    </CouplePageShell>
  )
}
