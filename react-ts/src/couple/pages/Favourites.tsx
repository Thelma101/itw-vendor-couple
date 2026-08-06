import { useState, useMemo, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Slide,
  Fade,
} from '@mui/material'
import {
  FavoriteBorder,
  Favorite,
  OpenInNew,
  Delete,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useShortlist } from '@/shared/contexts/ShortlistContext'
import Nav from '@/couple/components/Nav'
import Footer from '@/marketing/components/Footer'
import DeleteConfirmModal from '@/shared/components/DeleteConfirmModal'

/* ───────── tokens (from Figma) ───────── */
const T = {
  bg: '#FFFFFF',
  primary: '#00838F',
  primaryBlack: '#002528',
  accentGrad: 'linear-gradient(255.71deg, #EB1948 65.18%, #B52344 232.03%)',
  accent: '#EB1948',
  menuSelector: '#ECEBA2',
  success: '#008F53',
  text: '#2d2d2d',
  textSub: '#aaaaaa',
  font: "'Open Sans', sans-serif",
  border: '0.25px solid #00838F',
  borderBlack: '0.25px solid #002528',
}

type FilterTab = 'all' | 'venues' | 'services' | 'catering'

/* ═══════ COMPONENT ═══════ */
export default function Favourites() {
  const { items, removeFromShortlist } = useShortlist()
  const navigate = useNavigate()
  const [tab, setTab] = useState<FilterTab>('all')
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'info' | 'error' }>({ open: false, msg: '', sev: 'success' })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const confirmDelete = useCallback((id: string) => setDeleteTarget(id), [])
  const handleDeleteConfirmed = useCallback(() => {
    if (deleteTarget) {
      removeFromShortlist(deleteTarget)
    }
    setDeleteTarget(null)
  }, [deleteTarget, removeFromShortlist])

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`

  /* category mapping for tabs */
  const categorize = (cat: string): FilterTab => {
    const lower = cat.toLowerCase()
    if (lower.includes('venue') || lower.includes('hall') || lower.includes('garden')) return 'venues'
    if (lower.includes('cater') || lower.includes('food') || lower.includes('cake')) return 'catering'
    return 'services'
  }

  const counts = useMemo(() => ({
    all: items.length,
    venues: items.filter(i => categorize(i.category) === 'venues').length,
    services: items.filter(i => categorize(i.category) === 'services').length,
    catering: items.filter(i => categorize(i.category) === 'catering').length,
  }), [items])

  const filtered = useMemo(() => {
    if (tab === 'all') return items
    return items.filter(i => categorize(i.category) === tab)
  }, [items, tab])

  const tabMeta: Record<FilterTab, { label: string; badgeBg: string; badgeColor: string; count: number }> = {
    all:      { label: 'All', badgeBg: T.menuSelector, badgeColor: T.primaryBlack, count: counts.all },
    venues:   { label: 'Venues', badgeBg: T.success, badgeColor: '#fff', count: counts.venues },
    services: { label: 'Services', badgeBg: T.primaryBlack, badgeColor: '#fff', count: counts.services },
    catering: { label: 'Catering', badgeBg: 'none', badgeColor: '#fff', count: counts.catering },
  }

  /* sidebar items */
  const sidebarItems: { label: string; key: string; href?: string }[] = [
    { label: 'My Budget', key: 'budget', href: '/couple/budget' },
    { label: 'My Guest-list', key: 'guests', href: '/couple/guest-list' },
    { label: 'Favourites', key: 'favourites' },
    { label: 'To-do list', key: 'todo', href: '/couple/checklist' },
  ]

  /* ═══════ RENDER ═══════ */
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: T.bg, display: 'flex', flexDirection: 'column' }}>
      <Nav />

      {/* ──── PAGE HEADER ──── */}
      <Box sx={{ px: { xs: 3, md: '120px' }, pt: { xs: 4, md: '40px' }, pb: { xs: 3, md: '28px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 4, height: 48, background: T.accentGrad, borderRadius: 2, flexShrink: 0 }} />
          <Box>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: { xs: 24, md: 28 }, color: T.primaryBlack, lineHeight: 1.2 }}>
              My Favourites
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 15, color: T.textSub, mt: 0.3 }}>
              Your hand-picked vendors for the big day
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ──── MAIN LAYOUT ──── */}
      <Box sx={{
        flex: 1, display: 'flex',
        px: { xs: 2, md: '120px' },
        pb: 8, gap: { xs: 0, md: '24px' },
        flexDirection: { xs: 'column', md: 'row' },
      }}>
        {/* ═══ SIDEBAR ═══ */}
        <Box sx={{
          width: { xs: '100%', md: 304 }, flexShrink: 0,
          bgcolor: '#fff', border: T.border,
          display: 'flex', flexDirection: 'column',
          mb: { xs: 2, md: 0 },
          height: 'fit-content',
        }}>
          {sidebarItems.map((item, i) => {
            const isActive = item.key === 'favourites'
            return (
              <Box key={item.key}>
                <Box
                  component="a"
                  onClick={(e: React.MouseEvent) => { if (item.href) { navigate(item.href); e.preventDefault() } }}
                  sx={{
                    display: 'flex', alignItems: 'center',
                    height: i === 0 ? 61 : i === 1 ? 59 : 48,
                    px: 3,
                    bgcolor: isActive ? T.primary : '#fff',
                    cursor: 'pointer',
                    borderBottom: i < 3 ? (i === 0 ? T.border : i === 1 ? T.borderBlack : T.border) : 'none',
                    transition: 'background 0.2s',
                    textDecoration: 'none',
                    '&:hover': { bgcolor: isActive ? T.primary : 'rgba(0,131,143,0.04)' },
                  }}
                >
                  <Typography sx={{
                    fontFamily: T.font,
                    fontWeight: isActive ? 700 : 600,
                    fontSize: 16, lineHeight: '50px',
                    color: isActive ? '#fff' : T.primaryBlack,
                  }}>
                    {item.label}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>

        {/* ═══ CONTENT ═══ */}
        <Box sx={{
          flex: 1, bgcolor: '#fff', border: T.border,
          display: 'flex', flexDirection: 'column',
          minHeight: 599,
        }}>
          {/* ── Tab Row ── */}
          <Box sx={{
            display: 'flex', alignItems: 'center',
            pl: { xs: 2, md: '57px' }, pr: { xs: 2, md: 3 },
            height: 61,
            borderBottom: T.border,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: '60px' }, flex: 1 }}>
              {(['all', 'venues', 'services', 'catering'] as FilterTab[]).map((key) => {
                const m = tabMeta[key]
                const isActive = tab === key
                return (
                  <Box
                    key={key}
                    onClick={() => setTab(key)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.8,
                      cursor: 'pointer', position: 'relative', py: 1,
                    }}
                  >
                    <Typography sx={{
                      fontFamily: T.font, fontWeight: 600, fontSize: 16,
                      color: isActive ? T.primary : T.primaryBlack,
                      transition: 'color 0.2s',
                    }}>
                      {m.label}
                    </Typography>
                    <Box sx={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: key === 'catering' ? T.accentGrad : m.badgeBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Typography sx={{
                        fontFamily: T.font, fontWeight: 600, fontSize: 10,
                        color: m.badgeColor, lineHeight: 1,
                      }}>
                        {m.count}
                      </Typography>
                    </Box>
                    {isActive && (
                      <Box sx={{
                        position: 'absolute', bottom: -1, left: 0,
                        width: '100%', height: 2.5,
                        bgcolor: T.primary, borderRadius: 2,
                      }} />
                    )}
                  </Box>
                )
              })}
            </Box>

            <Button
              onClick={() => navigate('/couple/select-vendors')}
              sx={{
                bgcolor: T.primary, color: '#fff',
                fontFamily: T.font, fontWeight: 600, fontSize: 16,
                textTransform: 'none', px: 2, py: '10px',
                borderRadius: 0, lineHeight: 'normal',
                minWidth: 'auto', whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#006670' },
              }}
            >
              Browse Vendors
            </Button>
          </Box>

          {/* ── Vendor List ── */}
          <Box sx={{ flex: 1 }}>
            {(() => {
              const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
              const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
              return <>
            {filtered.length === 0 ? (
              <Fade in timeout={400}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, px: 3 }}>
                  {/* Overlapping document icons */}
                  <Box sx={{ position: 'relative', width: 80, height: 80, mb: 3 }}>
                    <Box sx={{
                      position: 'absolute', top: 0, right: 0,
                      width: 62, height: 62, borderRadius: '12px',
                      bgcolor: 'rgba(0,131,143,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: 'rotate(8deg)',
                    }}>
                      <FavoriteBorder sx={{ fontSize: 30, color: T.primary, opacity: 0.7 }} />
                    </Box>
                    <Box sx={{
                      position: 'absolute', bottom: 0, left: 0,
                      width: 62, height: 62, borderRadius: '12px',
                      bgcolor: 'rgba(0,131,143,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: 'rotate(-5deg)',
                      boxShadow: '0 2px 8px rgba(0,131,143,0.1)',
                    }}>
                      <Favorite sx={{ fontSize: 30, color: T.primary }} />
                    </Box>
                  </Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 0.8 }}>
                    {tab === 'all' ? 'Your Favourites List is Empty' : `No ${tabMeta[tab].label} Favourited Yet`}
                  </Typography>
                  <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub, mb: 3 }}>
                    {tab === 'all' ? 'Browse vendors and tap the heart to save your picks' : 'Try a different filter'}
                  </Typography>
                  <Button
                    onClick={() => navigate('/couple/select-vendors')}
                    sx={{
                      bgcolor: T.primary, color: '#fff',
                      fontFamily: T.font, fontWeight: 600, fontSize: 14,
                      textTransform: 'none', px: 4, py: 1.2,
                      borderRadius: 0,
                      '&:hover': { bgcolor: '#006670' },
                    }}
                  >
                    Browse Vendors
                  </Button>
                </Box>
              </Fade>
            ) : (
              paged.map((vendor) => (
                <Box
                  key={vendor.id}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2.5,
                    px: { xs: 2, md: '57px' }, py: 2.8,
                    borderBottom: T.border,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: 'rgba(0,131,143,0.02)' },
                  }}
                  onClick={() => navigate(`/couple/vendor/${vendor.id}`)}
                >
                  {/* Vendor image */}
                  <Box
                    component="img"
                    src={vendor.image}
                    alt={vendor.name}
                    sx={{
                      width: 64, height: 64,
                      borderRadius: '8px',
                      objectFit: 'cover',
                      bgcolor: '#e0e0e0',
                      flexShrink: 0,
                    }}
                  />

                  {/* Vendor info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{
                      fontFamily: T.font, fontWeight: 600, fontSize: 16,
                      color: T.text, lineHeight: 'normal', mb: 0.4,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {vendor.name}
                    </Typography>
                    <Typography sx={{
                      fontFamily: T.font, fontSize: 14,
                      color: T.textSub, lineHeight: 'normal',
                    }}>
                      {vendor.category} · {formatPrice(vendor.price)}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); navigate(`/couple/vendor/${vendor.id}`) }}
                      sx={{ color: T.primary }}
                    >
                      <OpenInNew sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        confirmDelete(vendor.id)
                      }}
                      sx={{ color: T.accent }}
                    >
                      <Delete sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 1, py: 2, borderTop: T.border,
              }}>
                <Box
                  component="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  sx={{
                    fontFamily: T.font, fontWeight: 600, fontSize: 13,
                    color: page === 1 ? T.textSub : T.primary,
                    border: 'none', background: 'none', cursor: page === 1 ? 'default' : 'pointer',
                    px: 1.5, py: 0.5,
                  }}
                >
                  Prev
                </Box>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <Box
                    key={n}
                    component="button"
                    onClick={() => setPage(n)}
                    sx={{
                      width: 32, height: 32, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: T.font, fontWeight: 600, fontSize: 13,
                      border: 'none', cursor: 'pointer',
                      bgcolor: n === page ? T.primary : 'transparent',
                      color: n === page ? '#fff' : T.primaryBlack,
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: n === page ? T.primary : 'rgba(0,131,143,0.08)' },
                    }}
                  >
                    {n}
                  </Box>
                ))}
                <Box
                  component="button"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  sx={{
                    fontFamily: T.font, fontWeight: 600, fontSize: 13,
                    color: page === totalPages ? T.textSub : T.primary,
                    border: 'none', background: 'none', cursor: page === totalPages ? 'default' : 'pointer',
                    px: 1.5, py: 0.5,
                  }}
                >
                  Next
                </Box>
              </Box>
            )}
            </>
            })()}
          </Box>

          {/* Footer summary */}
          {items.length > 0 && (
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: { xs: 2, md: '57px' }, py: 2,
              borderTop: T.border, bgcolor: T.bg,
            }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.primaryBlack }}>
                {items.length} {items.length === 1 ? 'vendor' : 'vendors'} saved · Estimated total: {formatPrice(items.reduce((s, i) => s + i.price, 0))}
              </Typography>
              <Button
                onClick={() => navigate('/couple/booking')}
                sx={{
                  background: T.accentGrad, color: '#fff',
                  fontFamily: T.font, fontWeight: 600, fontSize: 14,
                  textTransform: 'none', px: 3, py: 1,
                  borderRadius: 0,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Proceed to Booking
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* ──── DELETE CONFIRM MODAL ──── */}
      <DeleteConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmed}
        successMessage="Favourite Removed Successfully"
      />

      {/* ──── SNACKBAR ──── */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} TransitionComponent={Slide}>
        <Alert onClose={() => setSnack(p => ({ ...p, open: false }))} severity={snack.sev} variant="filled" sx={{ fontFamily: T.font, fontWeight: 600, borderRadius: 1 }}>{snack.msg}</Alert>
      </Snackbar>

      <Footer />
    </Box>
  )
}
