import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Slide,
  Checkbox,
  Fade,
} from '@mui/material'
import {
  Edit,
  Delete,
  Close,
  ArrowBack,
  PersonAdd,
  GroupAdd,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

/* ───────── tokens (from Figma — shared with Checklist) ───────── */
const T = {
  bg: '#FFF6F9',
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

/* ───────── types ───────── */
interface Guest {
  id: string
  name: string
  type: 'single' | 'couple' | 'family' | 'others'
  category: 'single' | 'couple' | 'family' | 'others'
  email: string
  group: string
  phone: string
}
type FilterTab = 'all' | 'single' | 'couple' | 'family' | 'others'
type InnerView = null | 'detail'

/* ───────── data ───────── */
const seed: Guest[] = []

/* ───────── helpers ───────── */
const STORAGE = 'itw_guestlist'
const load = (): Guest[] => { try { const r = localStorage.getItem(STORAGE); return r ? JSON.parse(r) : seed } catch { return seed } }
const save = (g: Guest[]) => { try { localStorage.setItem(STORAGE, JSON.stringify(g)) } catch {/**/} }

/* ═══════ COMPONENT ═══════ */
export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>(load)
  const [tab, setTab] = useState<FilterTab>('all')
  const [innerView, setInnerView] = useState<InnerView>(null)
  const [selected, setSelected] = useState<Guest | null>(null)
  const [editing, setEditing] = useState<Guest | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newGuest, setNewGuest] = useState({ name: '', type: 'single' as Guest['type'], email: '', group: 'Groom Family', phone: '' })
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'info' | 'error' }>({ open: false, msg: '', sev: 'success' })
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => { save(guests) }, [guests])

  const notify = useCallback((msg: string, sev: 'success' | 'info' | 'error' = 'success') => setSnack({ open: true, msg, sev }), [])

  /* ── counts ── */
  const counts = useMemo(() => ({
    all: guests.length,
    single: guests.filter(g => g.type === 'single').length,
    couple: guests.filter(g => g.type === 'couple').length,
    family: guests.filter(g => g.type === 'family').length,
    others: guests.filter(g => g.type === 'others').length,
  }), [guests])

  const filtered = useMemo(() => {
    if (tab === 'single') return guests.filter(g => g.type === 'single')
    if (tab === 'couple') return guests.filter(g => g.type === 'couple')
    if (tab === 'family') return guests.filter(g => g.type === 'family')
    if (tab === 'others') return guests.filter(g => g.type === 'others')
    return guests
  }, [guests, tab])

  /* ── actions ── */
  const deleteGuest = useCallback((id: string) => {
    setGuests(p => p.filter(g => g.id !== id))
    if (selected?.id === id) { setSelected(null); setInnerView(null) }
  }, [selected])
  const confirmDelete = useCallback((id: string) => setDeleteTarget(id), [])
  const handleDeleteConfirmed = useCallback(() => {
    if (deleteTarget) deleteGuest(deleteTarget)
    setDeleteTarget(null)
  }, [deleteTarget, deleteGuest])

  const addGuest = useCallback(() => {
    if (!newGuest.name.trim()) return
    setGuests(p => [...p, {
      id: `${Date.now()}`,
      name: newGuest.name.trim(),
      type: newGuest.type,
      category: newGuest.type,
      email: newGuest.email,
      group: newGuest.group,
      phone: newGuest.phone,
    }])
    setNewGuest({ name: '', type: 'single', email: '', group: 'Groom Family', phone: '' })
    setAddOpen(false)
    notify('Guest added', 'success')
  }, [newGuest, notify])

  const updateGuest = useCallback((u: Guest) => {
    setGuests(p => p.map(g => g.id === u.id ? u : g))
    setEditing(null)
    setSelected(u)
    notify('Guest updated', 'success')
  }, [notify])

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const openDetail = (g: Guest) => { setSelected(g); setEditing(null); setInnerView('detail') }
  const closePanel = () => { setInnerView(null); setSelected(null); setEditing(null) }

  /* ── badge styles per tab ── */
  const tabMeta: Record<FilterTab, { label: string; badgeBg: string; badgeColor: string; count: number }> = {
    all:    { label: 'All', badgeBg: T.menuSelector, badgeColor: T.primaryBlack, count: counts.all },
    single: { label: 'Single', badgeBg: T.success, badgeColor: '#fff', count: counts.single },
    couple: { label: 'Couple', badgeBg: T.primaryBlack, badgeColor: '#fff', count: counts.couple },
    family: { label: 'Family', badgeBg: 'none', badgeColor: '#fff', count: counts.family },
    others: { label: 'Others', badgeBg: '#F5A623', badgeColor: '#fff', count: counts.others },
  }

  /* sidebar items — Guest-list is active */
  const sidebarItems: { label: string; key: string; href?: string }[] = [
    { label: 'My Budget', key: 'budget', href: '/couple/budget' },
    { label: 'My Guest-list', key: 'guests' },
    { label: 'Favourites', key: 'favourites', href: '/couple/favourites' },
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
              My Guest List
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 15, color: T.textSub, mt: 0.3 }}>
              Manage your guests like a pro
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
            const isActive = item.key === 'guests'
            return (
              <Box key={item.key}>
                <Box
                  component="a"
                  onClick={(e: React.MouseEvent) => { if (item.href) { window.location.href = item.href; e.preventDefault() } }}
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
              {(['all', 'single', 'couple', 'family', 'others'] as FilterTab[]).map((key) => {
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

                    {/* Badge */}
                    <Box sx={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: key === 'family' ? T.accentGrad : m.badgeBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Typography sx={{
                        fontFamily: T.font, fontWeight: 600, fontSize: 10,
                        color: m.badgeColor, lineHeight: 1,
                      }}>
                        {m.count}
                      </Typography>
                    </Box>

                    {/* Active underline */}
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

            {/* Add button */}
            <Button
              onClick={() => setAddOpen(true)}
              sx={{
                bgcolor: T.primary, color: '#fff',
                fontFamily: T.font, fontWeight: 600, fontSize: 16,
                textTransform: 'none', px: 2, py: '10px',
                borderRadius: 0, lineHeight: 'normal',
                minWidth: 'auto', whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#006670' },
              }}
            >
              Add a Guest
            </Button>
          </Box>

          {/* ── Guest List ── */}
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
                      <PersonAdd sx={{ fontSize: 30, color: T.primary, opacity: 0.7 }} />
                    </Box>
                    <Box sx={{
                      position: 'absolute', bottom: 0, left: 0,
                      width: 62, height: 62, borderRadius: '12px',
                      bgcolor: 'rgba(0,131,143,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: 'rotate(-5deg)',
                      boxShadow: '0 2px 8px rgba(0,131,143,0.1)',
                    }}>
                      <GroupAdd sx={{ fontSize: 30, color: T.primary }} />
                    </Box>
                  </Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 0.8 }}>
                    {tab === 'all' ? 'Your Guest-List is Empty' : `No ${tabMeta[tab].label} Guests Yet`}
                  </Typography>
                  <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>
                    {tab === 'all' ? 'Add your first Guest' : 'Try a different filter'}
                  </Typography>
                </Box>
              </Fade>
            ) : (
              paged.map((guest) => (
                <Box
                  key={guest.id}
                  sx={{
                    display: 'flex', alignItems: 'center',
                    px: { xs: 2, md: '27px' }, py: 0,
                    borderBottom: T.border,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    minHeight: 80,
                    '&:hover': { bgcolor: 'rgba(0,131,143,0.02)' },
                  }}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={checkedIds.has(guest.id)}
                    onChange={() => toggleCheck(guest.id)}
                    size="small"
                    sx={{
                      p: 0, mr: 2,
                      color: T.primary,
                      '&.Mui-checked': { color: T.primary },
                      '& .MuiSvgIcon-root': { fontSize: 20 },
                    }}
                  />

                  {/* Name */}
                  <Typography
                    onClick={() => openDetail(guest)}
                    sx={{
                      fontFamily: T.font, fontWeight: 600, fontSize: 16,
                      color: T.text, lineHeight: 'normal',
                      width: { xs: 120, md: 140 }, flexShrink: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {guest.name}
                  </Typography>

                  {/* Category */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 400, fontSize: 14,
                    color: T.textSub, lineHeight: 'normal',
                    width: { xs: 60, md: 70 }, flexShrink: 0,
                    textTransform: 'capitalize',
                  }}>
                    {guest.category}
                  </Typography>

                  {/* Type */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 400, fontSize: 14,
                    color: T.textSub, lineHeight: 'normal',
                    width: { xs: 60, md: 70 }, flexShrink: 0,
                    textTransform: 'capitalize',
                    display: { xs: 'none', md: 'block' },
                  }}>
                    {guest.type}
                  </Typography>

                  {/* Email */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 400, fontSize: 14,
                    color: T.textSub, lineHeight: 'normal',
                    width: { xs: 0, md: 130 }, flexShrink: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: { xs: 'none', md: 'block' },
                  }}>
                    {guest.email}
                  </Typography>

                  {/* Group */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 400, fontSize: 14,
                    color: T.textSub, lineHeight: 'normal',
                    width: { xs: 0, md: 100 }, flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                  }}>
                    {guest.group}
                  </Typography>

                  {/* Phone */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 400, fontSize: 14,
                    color: T.textSub, lineHeight: 'normal',
                    flex: 1,
                    display: { xs: 'none', md: 'block' },
                  }}>
                    {guest.phone}
                  </Typography>

                  {/* Edit icon */}
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); setEditing({ ...guest }); setSelected(guest); setInnerView('detail') }}
                    sx={{ color: T.primary, mx: 0.5 }}
                  >
                    <Edit sx={{ fontSize: 16 }} />
                  </IconButton>

                  {/* Delete icon */}
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); confirmDelete(guest.id) }}
                    sx={{ color: T.accent }}
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
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
        </Box>
      </Box>

      {/* ──── DELETE CONFIRM MODAL ──── */}
      <DeleteConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmed}
        successMessage="Guest Deleted Successfully"
      />

      {/* ──── INNER VIEW SLIDE-OVER ──── */}
      <Slide direction="left" in={innerView !== null} mountOnEnter unmountOnExit>
        <Box sx={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: { xs: '100%', sm: 420 }, bgcolor: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 1300,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2, borderBottom: `1px solid rgba(0,131,143,0.15)` }}>
            <IconButton size="small" onClick={closePanel}><ArrowBack sx={{ fontSize: 20, color: '#666' }} /></IconButton>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: T.primaryBlack, flex: 1 }}>
              {editing ? 'Edit Guest' : 'Guest Details'}
            </Typography>
            <IconButton size="small" onClick={closePanel}><Close sx={{ fontSize: 20, color: '#666' }} /></IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {innerView === 'detail' && selected && (
              editing ? (
                <Fade in timeout={250}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField label="Full Name" fullWidth value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select value={editing.type} label="Type" onChange={e => setEditing({ ...editing, type: e.target.value as Guest['type'], category: e.target.value as Guest['category'] })}>
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="couple">Couple</MenuItem>
                        <MenuItem value="family">Family</MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField label="Email" type="email" fullWidth value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Group" fullWidth value={editing.group} onChange={e => setEditing({ ...editing, group: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Phone" fullWidth value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                      <Button fullWidth variant="contained" onClick={() => updateGuest(editing)} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>Save</Button>
                      <Button fullWidth variant="outlined" onClick={() => setEditing(null)} sx={{ borderColor: 'rgba(0,131,143,0.25)', color: '#666', textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>Cancel</Button>
                    </Box>
                  </Box>
                </Fade>
              ) : (
                <Fade in timeout={250}>
                  <Box>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 3, lineHeight: 1.3 }}>{selected.name}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        { label: 'Type', value: selected.type },
                        { label: 'Category', value: selected.category },
                        { label: 'Email', value: selected.email || '—' },
                        { label: 'Group', value: selected.group || '—' },
                        { label: 'Phone', value: selected.phone || '—' },
                      ].map(row => (
                        <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid rgba(0,131,143,0.1)' }}>
                          <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.textSub, textTransform: 'capitalize' }}>{row.label}</Typography>
                          <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.text, textTransform: 'capitalize' }}>{row.value}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                      <Button fullWidth variant="contained" startIcon={<Edit />} onClick={() => setEditing({ ...selected })} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>Edit</Button>
                    </Box>
                    <Button fullWidth startIcon={<Delete />} onClick={() => { confirmDelete(selected.id); closePanel() }} sx={{ mt: 1.5, color: T.accent, textTransform: 'none', fontWeight: 600, fontFamily: T.font, '&:hover': { bgcolor: 'rgba(235,25,72,0.04)' } }}>Delete Guest</Button>
                  </Box>
                </Fade>
              )
            )}
          </Box>
        </Box>
      </Slide>
      {innerView !== null && <Box onClick={closePanel} sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,37,40,0.25)', backdropFilter: 'blur(2px)', zIndex: 1299 }} />}

      {/* ──── ADD DIALOG ──── */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, border: '1px solid rgba(0,131,143,0.15)' } }}>
        <DialogTitle sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: T.primaryBlack, pb: 0 }}>Add New Guest</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField label="Full Name" fullWidth autoFocus placeholder="e.g. Doctor Enimada" value={newGuest.name} onChange={e => setNewGuest(p => ({ ...p, name: e.target.value }))} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={newGuest.type} label="Type" onChange={e => setNewGuest(p => ({ ...p, type: e.target.value as Guest['type'] }))} sx={{ fontFamily: T.font }}>
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="couple">Couple</MenuItem>
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Group" fullWidth placeholder="e.g. Groom Family" value={newGuest.group} onChange={e => setNewGuest(p => ({ ...p, group: e.target.value }))} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Email" type="email" fullWidth placeholder="e.g. irene@gmail.com" value={newGuest.email} onChange={e => setNewGuest(p => ({ ...p, email: e.target.value }))} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
              <TextField label="Phone" fullWidth placeholder="e.g. 08066045863" value={newGuest.phone} onChange={e => setNewGuest(p => ({ ...p, phone: e.target.value }))} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={addGuest} disabled={!newGuest.name.trim()} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, px: 3 }}>Add Guest</Button>
        </DialogActions>
      </Dialog>

      {/* ──── SNACKBAR ──── */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} TransitionComponent={Slide}>
        <Alert onClose={() => setSnack(p => ({ ...p, open: false }))} severity={snack.sev} variant="filled" sx={{ fontFamily: T.font, fontWeight: 600, borderRadius: 1 }}>{snack.msg}</Alert>
      </Snackbar>

      <Footer />
    </Box>
  )
}
