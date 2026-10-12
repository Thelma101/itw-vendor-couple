import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Close, ChevronRight } from '@mui/icons-material'
import { useShortlist } from '@/shared/contexts/ShortlistContext'
import { mockVendors } from '@/shared/data/mockVendors'
import { useAccount } from '@/shared/contexts/AccountContext'
import { directoryApi } from '@/shared/lib/api'
import { VendorImage } from '@/couple/live/liveVendor'

export type CompareVendorInput = {
  id: string
  name: string
  price: number | string
  category: string
  image: string
  location?: string
  rating?: number
  reviewCount?: number
}

type CompareRow = {
  id: string
  name: string
  price: number
  category: string
  image: string
  location: string
  rating: number
  reviewCount: number
}

function naira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

function toPrice(value: number | string) {
  if (typeof value === 'number') return value
  return Number.parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0
}

interface CompareVendorsModalProps {
  open: boolean
  onClose: () => void
  vendorIds: string[]
  vendors?: CompareVendorInput[]
  onClear?: () => void
}

export default function CompareVendorsModal({
  open,
  onClose,
  vendorIds,
  vendors: provided,
  onClear,
}: CompareVendorsModalProps) {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { items, isInShortlist, addToShortlist, removeFromShortlist } = useShortlist()
  const { isDemo } = useAccount()
  const ids = vendorIds.slice(0, 3)
  const [fetched, setFetched] = useState<Record<string, CompareRow>>({})
  const [fetchError, setFetchError] = useState('')
  const [fetching, setFetching] = useState(false)

  const unresolvedIds = ids.filter(
    (id) => !provided?.some((v) => v.id === id) && !items.some((i) => i.id === id) && !fetched[id],
  )
  const unresolvedKey = unresolvedIds.join(',')

  useEffect(() => {
    if (isDemo || !open || !unresolvedKey) return
    let cancelled = false
    setFetching(true)
    Promise.allSettled(unresolvedKey.split(',').map((id) => directoryApi.get(id)))
      .then((results) => {
        if (cancelled) return
        const next: Record<string, CompareRow> = {}
        let failed = 0
        for (const r of results) {
          if (r.status !== 'fulfilled') {
            failed += 1
            continue
          }
          const c = r.value.card
          next[c.id] = {
            id: c.id,
            name: c.name,
            price: c.price || 0,
            category: c.category,
            image: c.image || c.avatar,
            location: c.location,
            rating: c.rating,
            reviewCount: c.reviewCount,
          }
        }
        setFetched((prev) => ({ ...prev, ...next }))
        setFetchError(failed ? 'Some vendors could not be loaded — they may no longer be listed.' : '')
      })
      .finally(() => {
        if (!cancelled) setFetching(false)
      })
    return () => {
      cancelled = true
    }
  }, [isDemo, open, unresolvedKey])

  const vendors = useMemo(() => {
    const pool: CompareRow[] = []

    for (const id of ids) {
      const fromProp = provided?.find((v) => v.id === id)
      if (fromProp) {
        pool.push({
          id: fromProp.id,
          name: fromProp.name,
          price: toPrice(fromProp.price),
          category: fromProp.category,
          image: fromProp.image,
          location: fromProp.location || '',
          rating: fromProp.rating ?? (isDemo ? 4.8 : 0),
          reviewCount: fromProp.reviewCount ?? (isDemo ? 40 : 0),
        })
        continue
      }
      const fromShortlist = items.find((i) => i.id === id)
      if (fromShortlist) {
        pool.push({
          id: fromShortlist.id,
          name: fromShortlist.name,
          price: Number(fromShortlist.price) || 0,
          category: fromShortlist.category,
          image: fromShortlist.image,
          location: isDemo ? '' : fromShortlist.location || '',
          rating: isDemo ? 4.8 : fromShortlist.rating || 0,
          reviewCount: isDemo ? 40 : 0,
        })
        continue
      }
      if (!isDemo) {
        if (fetched[id]) pool.push(fetched[id])
        continue
      }
      const fromMock = mockVendors.find((v) => v.id === id)
      if (fromMock) {
        pool.push({
          id: fromMock.id,
          name: fromMock.name,
          price: toPrice(fromMock.price),
          category: fromMock.category,
          image: fromMock.image,
          location: fromMock.location,
          rating: fromMock.rating,
          reviewCount: fromMock.reviewCount,
        })
      }
    }
    return pool
  }, [ids, items, provided, isDemo, fetched])

  const bestPriceId = useMemo(() => {
    const priced = isDemo ? vendors : vendors.filter((v) => v.price > 0)
    if (!priced.length) return null
    return priced.reduce((best, v) => (v.price < best.price ? v : best)).id
  }, [vendors, isDemo])

  const bestRatingId = useMemo(() => {
    const rated = isDemo ? vendors : vendors.filter((v) => v.rating > 0)
    if (!rated.length) return null
    return rated.reduce((best, v) => (v.rating > best.rating ? v : best)).id
  }, [vendors, isDemo])

  const priceText = (v: CompareRow) => (isDemo || v.price > 0 ? naira(v.price) : 'On request')
  const showRating = (v: CompareRow) => isDemo || v.rating > 0
  const messageLink = (v: CompareRow) => `/couple/messages?vendor=${encodeURIComponent(isDemo ? v.name : v.id)}`

  const featureRows = [
    { label: 'Category', get: (v: CompareRow) => v.category },
    { label: 'Location', get: (v: CompareRow) => v.location || '—' },
    {
      label: 'Starting price',
      get: priceText,
      highlight: (v: CompareRow) => v.id === bestPriceId,
    },
    {
      label: 'Rating',
      get: (v: CompareRow) => (showRating(v) ? `${v.rating} (${v.reviewCount})` : 'No reviews yet'),
      highlight: (v: CompareRow) => v.id === bestRatingId,
    },
    { label: 'Shortlisted', get: (v: CompareRow) => (isInShortlist(v.id) ? 'Yes' : 'No') },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? '100%' : '92vh',
          m: isMobile ? 0 : undefined,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          pr: 1,
          py: { xs: 1.5, md: 2 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: { xs: 18, md: 20 } }}>
            Compare vendors
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.25 }}>
            {vendors.length} selected · pick the best fit
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
          {onClear ? (
            <Button onClick={onClear} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B', minWidth: 0 }}>
              Clear
            </Button>
          ) : null}
          <IconButton onClick={onClose} aria-label="Close compare">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: '#F8FAFC', px: { xs: 1.5, md: 3 }, py: { xs: 1.5, md: 2 } }}>
        {fetching && vendors.length < 2 ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
            <CircularProgress size={28} sx={{ color: '#0F766E' }} />
          </Box>
        ) : vendors.length < 2 ? (
          <Paper
            elevation={0}
            sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', textAlign: 'center', bgcolor: '#fff' }}
          >
            <Typography sx={{ color: '#64748B' }}>
              {fetchError || 'Toggle Compare on at least 2 vendors to see them side by side.'}
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {/* Mobile: stacked comparison cards with one primary CTA */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              {vendors.map((v) => {
                const saved = isInShortlist(v.id)
                return (
                  <Paper
                    key={v.id}
                    elevation={0}
                    sx={{ borderRadius: 2.5, border: '1px solid #E2E8F0', overflow: 'hidden', bgcolor: '#fff' }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5, p: 1.5 }}>
                      {isDemo ? (
                        <Box
                          component="img"
                          src={v.image}
                          alt={v.name}
                          sx={{ width: 72, height: 72, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                        />
                      ) : (
                        <VendorImage src={v.image} name={v.name} rounded={1.5} sx={{ width: 72, height: 72, flexShrink: 0 }} />
                      )}
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" spacing={0.5} sx={{ mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                          {v.id === bestPriceId ? (
                            <Chip
                              size="small"
                              label="Best price"
                              sx={{ height: 22, fontSize: 11, bgcolor: '#ECFDF5', color: '#047857', fontWeight: 700 }}
                            />
                          ) : null}
                          {v.id === bestRatingId ? (
                            <Chip
                              size="small"
                              label="Top rated"
                              sx={{ height: 22, fontSize: 11, bgcolor: '#FFF7ED', color: '#C2410C', fontWeight: 700 }}
                            />
                          ) : null}
                        </Stack>
                        <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: 15, lineHeight: 1.25 }}>
                          {v.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: '#64748B', mt: 0.25 }}>
                          {v.category}
                          {v.location ? ` · ${v.location}` : ''}
                        </Typography>
                        {showRating(v) ? (
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                            <Rating value={v.rating} readOnly size="small" precision={0.1} sx={{ fontSize: 14 }} />
                            <Typography sx={{ fontSize: 11, color: '#64748B' }}>({v.reviewCount})</Typography>
                          </Stack>
                        ) : null}
                        <Typography sx={{ mt: 0.5, fontWeight: 800, color: '#0F766E', fontSize: 16 }}>
                          {priceText(v)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ px: 1.5, pb: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        endIcon={<ChevronRight />}
                        onClick={() => {
                          onClose()
                          navigate(`/couple/vendor/${v.id}`)
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          bgcolor: '#0F766E',
                          borderRadius: 2,
                          py: 1,
                          gridColumn: '1 / -1',
                          '&:hover': { bgcolor: '#0D9488' },
                        }}
                      >
                        View full profile
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                          onClose()
                          navigate(messageLink(v))
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          borderColor: '#CBD5E1',
                          color: '#334155',
                          borderRadius: 2,
                        }}
                      >
                        Message
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() =>
                          saved
                            ? removeFromShortlist(v.id)
                            : addToShortlist({
                                id: v.id,
                                name: v.name,
                                price: v.price,
                                category: v.category,
                                image: v.image,
                              })
                        }
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          borderColor: '#CBD5E1',
                          color: '#334155',
                          borderRadius: 2,
                        }}
                      >
                        {saved ? 'Unshortlist' : 'Shortlist'}
                      </Button>
                    </Box>
                  </Paper>
                )
              })}

              {/* Spec strip between cards */}
              <Paper elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #E2E8F0', bgcolor: '#fff', p: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#0F172A', mb: 1.25 }}>
                  Side-by-side specs
                </Typography>
                <Stack spacing={1.25}>
                  {featureRows.map((row) => (
                    <Box key={row.label}>
                      <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 0.4, mb: 0.5 }}>
                        {row.label.toUpperCase()}
                      </Typography>
                      <Stack spacing={0.5}>
                        {vendors.map((v) => (
                          <Box
                            key={v.id}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: 1,
                              py: 0.6,
                              px: 1,
                              borderRadius: 1.5,
                              bgcolor: row.highlight?.(v) ? 'rgba(15,118,110,0.08)' : '#F8FAFC',
                            }}
                          >
                            <Typography sx={{ fontSize: 12, color: '#64748B', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {v.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                fontWeight: row.highlight?.(v) ? 800 : 600,
                                color: row.highlight?.(v) ? '#0F766E' : '#0F172A',
                                textAlign: 'right',
                                flexShrink: 0,
                              }}
                            >
                              {row.get(v)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Box>

            {/* Desktop: columns + table */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(vendors.length, 3)}, 1fr)`,
                  gap: 2,
                  mb: 2.5,
                }}
              >
                {vendors.map((v) => {
                  const saved = isInShortlist(v.id)
                  return (
                    <Paper
                      key={v.id}
                      elevation={0}
                      sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden', bgcolor: '#fff' }}
                    >
                      {isDemo ? (
                        <Box component="img" src={v.image} alt={v.name} sx={{ width: '100%', height: 140, objectFit: 'cover' }} />
                      ) : (
                        <VendorImage src={v.image} name={v.name} sx={{ width: '100%', height: 140 }} />
                      )}
                      <Box sx={{ p: 2 }}>
                        <Stack direction="row" spacing={0.75} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                          {v.id === bestPriceId ? (
                            <Chip size="small" label="Best price" sx={{ bgcolor: '#ECFDF5', color: '#047857', fontWeight: 700 }} />
                          ) : null}
                          {v.id === bestRatingId ? (
                            <Chip size="small" label="Top rated" sx={{ bgcolor: '#FFF7ED', color: '#C2410C', fontWeight: 700 }} />
                          ) : null}
                        </Stack>
                        <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>{v.name}</Typography>
                        <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.5 }}>
                          {v.category}
                          {v.location ? ` · ${v.location}` : ''}
                        </Typography>
                        {showRating(v) ? (
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                            <Rating value={v.rating} readOnly size="small" precision={0.1} />
                            <Typography sx={{ fontSize: 12, color: '#64748B' }}>({v.reviewCount})</Typography>
                          </Stack>
                        ) : null}
                        <Typography sx={{ mt: 1.5, fontWeight: 800, color: '#0F766E', fontSize: 18 }}>
                          {priceText(v)}
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 2 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {
                              onClose()
                              navigate(`/couple/vendor/${v.id}`)
                            }}
                            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E', '&:hover': { bgcolor: '#0D9488' } }}
                          >
                            View profile
                          </Button>
                          <Stack direction="row" spacing={1}>
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => {
                                onClose()
                                navigate(messageLink(v))
                              }}
                              sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#0F766E', color: '#0F766E' }}
                            >
                              Message
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() =>
                                saved
                                  ? removeFromShortlist(v.id)
                                  : addToShortlist({
                                      id: v.id,
                                      name: v.name,
                                      price: v.price,
                                      category: v.category,
                                      image: v.image,
                                    })
                              }
                              sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#CBD5E1', color: '#334155' }}
                            >
                              {saved ? 'Saved' : 'Shortlist'}
                            </Button>
                          </Stack>
                        </Stack>
                      </Box>
                    </Paper>
                  )
                })}
              </Box>

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflowX: 'auto' }}
              >
                <Table size="small" sx={{ minWidth: 480 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ fontWeight: 800 }}>Feature</TableCell>
                      {vendors.map((v) => (
                        <TableCell key={v.id} align="center" sx={{ fontWeight: 800 }}>
                          {v.name}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {featureRows.map((row) => (
                      <TableRow key={row.label}>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>{row.label}</TableCell>
                        {vendors.map((v) => (
                          <TableCell
                            key={v.id}
                            align="center"
                            sx={{
                              fontWeight: row.highlight?.(v) ? 800 : 500,
                              color: row.highlight?.(v) ? '#0F766E' : '#0F172A',
                              bgcolor: row.highlight?.(v) ? 'rgba(15,118,110,0.06)' : 'transparent',
                            }}
                          >
                            {row.get(v)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}
