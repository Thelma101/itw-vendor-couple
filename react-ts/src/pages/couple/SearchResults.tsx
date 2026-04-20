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
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
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
} from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CouplePageShell from '@/components/couple/CouplePageShell'
import { mockVendors } from '@/data/mockVendors'
import { useShortlist } from '@/contexts/ShortlistContext'

const PAGE_SIZE = 8

const parsePrice = (value: string) => Number.parseInt(value.replace(/[^0-9]/g, ''), 10) || 0

export default function SearchResults() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initialCategory = params.get('category')

  const { addToShortlist, removeFromShortlist, isInShortlist } = useShortlist()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory ? initialCategory.toLowerCase() : 'all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [maxPrice, setMaxPrice] = useState(1500000)
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

          <Chip
            label={`Budget cap: N${maxPrice.toLocaleString()}`}
            onClick={() => setMaxPrice((prev) => (prev >= 1500000 ? 250000 : prev + 250000))}
            sx={{ bgcolor: '#E6F7F8', color: '#0F766E', fontWeight: 700, borderRadius: 2.2 }}
          />
        </Stack>
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

      <Box sx={{ display: 'grid', gridTemplateColumns: view === 'grid' ? { xs: '1fr', sm: '1fr 1fr', xl: 'repeat(3, 1fr)' } : '1fr', gap: 2 }}>
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
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(15,23,42,0.08)' },
              }}
            >
              <Box sx={{ position: 'relative', height: 170 }}>
                <Box component="img" src={vendor.image} alt={vendor.name} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton
                  aria-label={inShortlist ? `Remove ${vendor.name} from shortlist` : `Add ${vendor.name} to shortlist`}
                  onClick={() => {
                    if (inShortlist) removeFromShortlist(vendor.id)
                    else addToShortlist({ id: vendor.id, name: vendor.name, category: vendor.category, image: vendor.image, price: parsePrice(vendor.price) })
                  }}
                  sx={{ position: 'absolute', right: 10, top: 10, bgcolor: '#FFFFFFD9', '&:hover': { bgcolor: '#FFFFFF' } }}
                >
                  {inShortlist ? <Favorite sx={{ color: '#EB1948' }} /> : <FavoriteBorder sx={{ color: '#334155' }} />}
                </IconButton>
              </Box>

              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0F172A' }}>{vendor.name}</Typography>
                <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.6 }}>
                  <Rating value={vendor.rating} readOnly precision={0.1} size="small" />
                  <Typography sx={{ fontSize: 12, color: '#64748B' }}>({vendor.reviewCount})</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.7 }}>
                  <LocationOn sx={{ fontSize: 15, color: '#64748B' }} />
                  <Typography sx={{ fontSize: 13, color: '#64748B' }}>{vendor.location}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mt: 1.4 }}>
                  <Chip label={vendor.category} size="small" sx={{ borderRadius: 2, bgcolor: '#EEF2FF', color: '#4338CA', fontWeight: 700 }} />
                  <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#0F766E' }}>{vendor.price}</Typography>
                </Stack>
                <Button onClick={() => navigate(`/couple/vendor/${vendor.id}`)} fullWidth variant="contained" sx={{ mt: 1.6, textTransform: 'none', fontWeight: 700, borderRadius: 2.2, bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' } }}>
                  View Vendor
                </Button>
              </Box>
            </Paper>
          )
        })}
      </Box>

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
