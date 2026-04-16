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
  Fade,
  Chip,
  LinearProgress,
  InputAdornment,
} from '@mui/material'
import {
  Edit,
  Delete,
  Close,
  ArrowBack,
  AccountBalanceWallet,
  Receipt,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

/* ───────── tokens (shared with Checklist / GuestList / Favourites) ───────── */
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

/* ───────── types ───────── */
interface BudgetItem {
  id: string
  category: string
  vendor?: string
  estimated: number
  actual: number
  paid: number
  notes?: string
}

type FilterTab = 'all' | 'paid' | 'partial' | 'booked' | 'pending'
type InnerView = null | 'detail'

/* ───────── data ───────── */
const defaultCategories = [
  'Venue', 'Catering', 'Photography', 'Videography', 'Music/DJ',
  'Florist', 'Decor', 'Wedding Planner', 'Cake', 'Attire (Bride)',
  'Attire (Groom)', 'Hair & Makeup', 'Transportation', 'Invitations',
  'Favours', 'Officiant', 'Jewellery', 'Miscellaneous',
]

const seed: BudgetItem[] = []

/* ───────── helpers ───────── */
const STORAGE = 'itw_budget'
const BUDGET_KEY = 'itw_total_budget'
const load = (): BudgetItem[] => { try { const r = localStorage.getItem(STORAGE); return r ? JSON.parse(r) : seed } catch { return seed } }
const save = (b: BudgetItem[]) => { try { localStorage.setItem(STORAGE, JSON.stringify(b)) } catch {/**/} }
const loadBudget = (): number => { try { const r = localStorage.getItem(BUDGET_KEY); return r ? parseFloat(r) : 2500000 } catch { return 2500000 } }
const saveBudget = (v: number) => { try { localStorage.setItem(BUDGET_KEY, v.toString()) } catch {/**/} }

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)

const getStatus = (item: BudgetItem): 'paid' | 'partial' | 'booked' | 'pending' => {
  if (item.paid >= item.actual && item.actual > 0) return 'paid'
  if (item.paid > 0) return 'partial'
  if (item.actual > 0) return 'booked'
  return 'pending'
}

/* ═══════ COMPONENT ═══════ */
export default function BudgetTracker() {
  const [items, setItems] = useState<BudgetItem[]>(load)
  const [totalBudget, setTotalBudget] = useState<number>(loadBudget)
  const [tab, setTab] = useState<FilterTab>('all')
  const [innerView, setInnerView] = useState<InnerView>(null)
  const [selected, setSelected] = useState<BudgetItem | null>(null)
  const [editing, setEditing] = useState<BudgetItem | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newItem, setNewItem] = useState({ category: '', vendor: '', estimated: '', actual: '', paid: '', notes: '' })
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'info' | 'error' }>({ open: false, msg: '', sev: 'success' })
  const [budgetEditOpen, setBudgetEditOpen] = useState(false)
  const [budgetDraft, setBudgetDraft] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => { save(items) }, [items])
  useEffect(() => { saveBudget(totalBudget) }, [totalBudget])

  const notify = useCallback((msg: string, sev: 'success' | 'info' | 'error' = 'success') => setSnack({ open: true, msg, sev }), [])

  /* ── stats ── */
  const stats = useMemo(() => {
    const totalEstimated = items.reduce((s, i) => s + i.estimated, 0)
    const totalActual = items.reduce((s, i) => s + i.actual, 0)
    const totalPaid = items.reduce((s, i) => s + i.paid, 0)
    const remaining = totalBudget - totalActual
    const pct = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0
    return { totalEstimated, totalActual, totalPaid, remaining, pct, outstanding: totalActual - totalPaid }
  }, [items, totalBudget])

  /* ── counts ── */
  const counts = useMemo(() => ({
    all: items.length,
    paid: items.filter(i => getStatus(i) === 'paid').length,
    partial: items.filter(i => getStatus(i) === 'partial').length,
    booked: items.filter(i => getStatus(i) === 'booked').length,
    pending: items.filter(i => getStatus(i) === 'pending').length,
  }), [items])

  const filtered = useMemo(() => {
    if (tab === 'paid') return items.filter(i => getStatus(i) === 'paid')
    if (tab === 'partial') return items.filter(i => getStatus(i) === 'partial')
    if (tab === 'booked') return items.filter(i => getStatus(i) === 'booked')
    if (tab === 'pending') return items.filter(i => getStatus(i) === 'pending')
    return items
  }, [items, tab])

  /* ── actions ── */
  const deleteItem = useCallback((id: string) => {
    setItems(p => p.filter(i => i.id !== id))
    if (selected?.id === id) { setSelected(null); setInnerView(null) }
  }, [selected])
  const confirmDelete = useCallback((id: string) => setDeleteTarget(id), [])
  const handleDeleteConfirmed = useCallback(() => {
    if (deleteTarget) deleteItem(deleteTarget)
    setDeleteTarget(null)
  }, [deleteTarget, deleteItem])

  const addItem = useCallback(() => {
    if (!newItem.category) return
    setItems(p => [...p, {
      id: `${Date.now()}`,
      category: newItem.category,
      vendor: newItem.vendor || undefined,
      estimated: parseFloat(newItem.estimated) || 0,
      actual: parseFloat(newItem.actual) || 0,
      paid: parseFloat(newItem.paid) || 0,
      notes: newItem.notes || undefined,
    }])
    setNewItem({ category: '', vendor: '', estimated: '', actual: '', paid: '', notes: '' })
    setAddOpen(false)
    notify('Expense added', 'success')
  }, [newItem, notify])

  const updateItem = useCallback((u: BudgetItem) => {
    setItems(p => p.map(i => i.id === u.id ? u : i))
    setEditing(null)
    setSelected(u)
    notify('Expense updated', 'success')
  }, [notify])

  const openDetail = (item: BudgetItem) => { setSelected(item); setEditing(null); setInnerView('detail') }
  const closePanel = () => { setInnerView(null); setSelected(null); setEditing(null) }

  /* ── status chip helper ── */
  const statusChip = (item: BudgetItem) => {
    const s = getStatus(item)
    const map = {
      paid: { label: 'Paid', bg: '#e8f5e9', color: '#2e7d32' },
      partial: { label: 'Partial', bg: '#fff3e0', color: '#ef6c00' },
      booked: { label: 'Booked', bg: '#e3f2fd', color: '#1565c0' },
      pending: { label: 'Pending', bg: '#f5f5f5', color: '#757575' },
    }
    const c = map[s]
    return <Chip label={c.label} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontFamily: T.font, fontSize: 11, height: 22, borderRadius: '4px' }} />
  }

  /* ── badge styles per tab ── */
  const tabMeta: Record<FilterTab, { label: string; badgeBg: string; badgeColor: string; count: number }> = {
    all:     { label: 'All', badgeBg: T.menuSelector, badgeColor: T.primaryBlack, count: counts.all },
    paid:    { label: 'Paid', badgeBg: T.success, badgeColor: '#fff', count: counts.paid },
    partial: { label: 'Partial', badgeBg: '#F5A623', badgeColor: '#fff', count: counts.partial },
    booked:  { label: 'Booked', badgeBg: T.primaryBlack, badgeColor: '#fff', count: counts.booked },
    pending: { label: 'Pending', badgeBg: 'none', badgeColor: '#fff', count: counts.pending },
  }

  /* sidebar items — My Budget is active */
  const sidebarItems: { label: string; key: string; href?: string }[] = [
    { label: 'My Budget', key: 'budget' },
    { label: 'My Guest-list', key: 'guests', href: '/couple/guests' },
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
              My Budget
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 15, color: T.textSub, mt: 0.3 }}>
              Track every Naira for your perfect day
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ──── BUDGET SUMMARY BAR ──── */}
      <Box sx={{ px: { xs: 2, md: '120px' }, pb: 2 }}>
        <Box sx={{
          bgcolor: T.primaryBlack, borderRadius: '6px', px: { xs: 2, md: 4 }, py: 2.5,
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 2, md: 5 },
        }}>
          {/* Total Budget */}
          <Box sx={{ cursor: 'pointer' }} onClick={() => { setBudgetDraft(totalBudget.toString()); setBudgetEditOpen(true) }}>
            <Typography sx={{ fontFamily: T.font, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Total Budget
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: '#fff' }}>
              {fmt(totalBudget)}
            </Typography>
          </Box>

          {/* Divider */}
          <Box sx={{ width: '1px', height: 36, bgcolor: 'rgba(255,255,255,0.15)', display: { xs: 'none', md: 'block' } }} />

          {/* Spent */}
          <Box>
            <Typography sx={{ fontFamily: T.font, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Spent
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: stats.totalActual > totalBudget ? '#ff6b6b' : '#4caf50' }}>
              {fmt(stats.totalActual)}
            </Typography>
          </Box>

          <Box sx={{ width: '1px', height: 36, bgcolor: 'rgba(255,255,255,0.15)', display: { xs: 'none', md: 'block' } }} />

          {/* Paid */}
          <Box>
            <Typography sx={{ fontFamily: T.font, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Paid
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: '#4caf50' }}>
              {fmt(stats.totalPaid)}
            </Typography>
          </Box>

          <Box sx={{ width: '1px', height: 36, bgcolor: 'rgba(255,255,255,0.15)', display: { xs: 'none', md: 'block' } }} />

          {/* Outstanding */}
          <Box>
            <Typography sx={{ fontFamily: T.font, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Outstanding
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: '#F5A623' }}>
              {fmt(stats.outstanding)}
            </Typography>
          </Box>

          <Box sx={{ width: '1px', height: 36, bgcolor: 'rgba(255,255,255,0.15)', display: { xs: 'none', md: 'block' } }} />

          {/* Remaining */}
          <Box>
            <Typography sx={{ fontFamily: T.font, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Remaining
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: stats.remaining < 0 ? '#ff6b6b' : '#4caf50' }}>
              {fmt(Math.abs(stats.remaining))}
              {stats.remaining < 0 && <Typography component="span" sx={{ fontFamily: T.font, fontSize: 11, color: '#ff6b6b', ml: 0.5 }}>over</Typography>}
            </Typography>
          </Box>

          {/* Progress bar (far right) */}
          <Box sx={{ flex: 1, minWidth: 120, display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontFamily: T.font, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Budget Usage</Typography>
              <Typography sx={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: stats.pct > 100 ? '#ff6b6b' : '#4caf50' }}>{Math.round(stats.pct)}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(stats.pct, 100)}
              sx={{
                height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.15)',
                '& .MuiLinearProgress-bar': { bgcolor: stats.pct > 100 ? '#ff6b6b' : stats.pct > 80 ? '#F5A623' : '#4caf50', borderRadius: 4 },
              }}
            />
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
            const isActive = item.key === 'budget'
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: '40px' }, flex: 1 }}>
              {(['all', 'paid', 'partial', 'booked', 'pending'] as FilterTab[]).map((key) => {
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
                      background: key === 'pending' ? T.accentGrad : m.badgeBg,
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
              Add Expense
            </Button>
          </Box>

          {/* ── Expense List ── */}
          <Box sx={{ flex: 1 }}>
            {(() => {
              const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
              const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
              return <>
            {filtered.length === 0 ? (
              <Fade in timeout={400}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, px: 3 }}>
                  {/* Overlapping icons */}
                  <Box sx={{ position: 'relative', width: 80, height: 80, mb: 3 }}>
                    <Box sx={{
                      position: 'absolute', top: 0, right: 0,
                      width: 62, height: 62, borderRadius: '12px',
                      bgcolor: 'rgba(0,131,143,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: 'rotate(8deg)',
                    }}>
                      <AccountBalanceWallet sx={{ fontSize: 30, color: T.primary, opacity: 0.7 }} />
                    </Box>
                    <Box sx={{
                      position: 'absolute', bottom: 0, left: 0,
                      width: 62, height: 62, borderRadius: '12px',
                      bgcolor: 'rgba(0,131,143,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: 'rotate(-5deg)',
                      boxShadow: '0 2px 8px rgba(0,131,143,0.1)',
                    }}>
                      <Receipt sx={{ fontSize: 30, color: T.primary }} />
                    </Box>
                  </Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 0.8 }}>
                    {tab === 'all' ? 'Your Budget is Empty' : `No ${tabMeta[tab].label} Expenses Yet`}
                  </Typography>
                  <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>
                    {tab === 'all' ? 'Add your first Expense' : 'Try a different filter'}
                  </Typography>
                </Box>
              </Fade>
            ) : (
              paged.map((item) => (
                <Box
                  key={item.id}
                  onClick={() => openDetail(item)}
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
                  {/* Category */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 600, fontSize: 16,
                    color: T.text, lineHeight: 'normal',
                    width: { xs: 100, md: 140 }, flexShrink: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.category}
                  </Typography>

                  {/* Vendor */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 400, fontSize: 14,
                    color: T.textSub, lineHeight: 'normal',
                    width: { xs: 80, md: 120 }, flexShrink: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: { xs: 'none', md: 'block' },
                  }}>
                    {item.vendor || '—'}
                  </Typography>

                  {/* Estimated */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 400, fontSize: 14,
                    color: T.textSub, lineHeight: 'normal',
                    width: { xs: 80, md: 100 }, flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                  }}>
                    {fmt(item.estimated)}
                  </Typography>

                  {/* Actual */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 600, fontSize: 14,
                    color: item.actual > item.estimated && item.estimated > 0 ? T.accent : T.text,
                    lineHeight: 'normal',
                    width: { xs: 80, md: 100 }, flexShrink: 0,
                  }}>
                    {item.actual > 0 ? fmt(item.actual) : '—'}
                  </Typography>

                  {/* Paid */}
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 600, fontSize: 14,
                    color: T.success, lineHeight: 'normal',
                    width: { xs: 80, md: 100 }, flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                  }}>
                    {item.paid > 0 ? fmt(item.paid) : '—'}
                  </Typography>

                  {/* Status chip */}
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                    {statusChip(item)}

                    {/* Edit icon */}
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); setEditing({ ...item }); setSelected(item); setInnerView('detail') }}
                      sx={{ color: T.primary, mx: 0.5 }}
                    >
                      <Edit sx={{ fontSize: 16 }} />
                    </IconButton>

                    {/* Delete icon */}
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); confirmDelete(item.id) }}
                      sx={{ color: T.accent }}
                    >
                      <Delete sx={{ fontSize: 16 }} />
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
        </Box>
      </Box>

      {/* ──── DELETE CONFIRM MODAL ──── */}
      <DeleteConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmed}
        successMessage="Expense Deleted Successfully"
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2, borderBottom: '1px solid rgba(0,131,143,0.15)' }}>
            <IconButton size="small" onClick={closePanel}><ArrowBack sx={{ fontSize: 20, color: '#666' }} /></IconButton>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: T.primaryBlack, flex: 1 }}>
              {editing ? 'Edit Expense' : 'Expense Details'}
            </Typography>
            <IconButton size="small" onClick={closePanel}><Close sx={{ fontSize: 20, color: '#666' }} /></IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {innerView === 'detail' && selected && (
              editing ? (
                <Fade in timeout={250}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select value={editing.category} label="Category" onChange={e => setEditing({ ...editing, category: e.target.value })}>
                        {defaultCategories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <TextField label="Vendor (optional)" fullWidth value={editing.vendor || ''} onChange={e => setEditing({ ...editing, vendor: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Estimated Cost" type="number" fullWidth value={editing.estimated} onChange={e => setEditing({ ...editing, estimated: parseFloat(e.target.value) || 0 })} InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Actual Cost" type="number" fullWidth value={editing.actual} onChange={e => setEditing({ ...editing, actual: parseFloat(e.target.value) || 0 })} InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Amount Paid" type="number" fullWidth value={editing.paid} onChange={e => setEditing({ ...editing, paid: parseFloat(e.target.value) || 0 })} InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Notes (optional)" fullWidth multiline rows={2} value={editing.notes || ''} onChange={e => setEditing({ ...editing, notes: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                      <Button fullWidth variant="contained" onClick={() => updateItem(editing)} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>Save</Button>
                      <Button fullWidth variant="outlined" onClick={() => setEditing(null)} sx={{ borderColor: 'rgba(0,131,143,0.25)', color: '#666', textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>Cancel</Button>
                    </Box>
                  </Box>
                </Fade>
              ) : (
                <Fade in timeout={250}>
                  <Box>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 0.5, lineHeight: 1.3 }}>{selected.category}</Typography>
                    {selected.vendor && <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub, mb: 3 }}>{selected.vendor}</Typography>}
                    {!selected.vendor && <Box sx={{ mb: 3 }} />}

                    {/* Payment progress */}
                    {selected.actual > 0 && (
                      <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0,131,143,0.04)', borderRadius: '6px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.primaryBlack }}>Payment Progress</Typography>
                          <Typography sx={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.primary }}>{Math.round((selected.paid / selected.actual) * 100)}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((selected.paid / selected.actual) * 100, 100)}
                          sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,131,143,0.1)', '& .MuiLinearProgress-bar': { bgcolor: selected.paid >= selected.actual ? T.success : '#F5A623', borderRadius: 4 } }}
                        />
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        { label: 'Status', value: '' },
                        { label: 'Estimated', value: fmt(selected.estimated) },
                        { label: 'Actual', value: selected.actual > 0 ? fmt(selected.actual) : '—' },
                        { label: 'Paid', value: selected.paid > 0 ? fmt(selected.paid) : '—' },
                        { label: 'Outstanding', value: selected.actual > 0 ? fmt(selected.actual - selected.paid) : '—' },
                        { label: 'Notes', value: selected.notes || '—' },
                      ].map(row => (
                        <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid rgba(0,131,143,0.1)' }}>
                          <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.textSub }}>{row.label}</Typography>
                          {row.label === 'Status' ? statusChip(selected) : (
                            <Typography sx={{
                              fontFamily: T.font, fontWeight: 600, fontSize: 14,
                              color: row.label === 'Paid' ? T.success : row.label === 'Outstanding' && selected.actual - selected.paid > 0 ? '#F5A623' : T.text,
                            }}>
                              {row.value}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                      <Button fullWidth variant="contained" startIcon={<Edit />} onClick={() => setEditing({ ...selected })} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>Edit</Button>
                    </Box>
                    <Button fullWidth startIcon={<Delete />} onClick={() => { confirmDelete(selected.id); closePanel() }} sx={{ mt: 1.5, color: T.accent, textTransform: 'none', fontWeight: 600, fontFamily: T.font, '&:hover': { bgcolor: 'rgba(235,25,72,0.04)' } }}>Delete Expense</Button>
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
        <DialogTitle sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: T.primaryBlack, pb: 0 }}>Add New Expense</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={newItem.category} label="Category" onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))} sx={{ fontFamily: T.font }}>
                {defaultCategories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Vendor Name (optional)" fullWidth placeholder="e.g. Lush Gardens" value={newItem.vendor} onChange={e => setNewItem(p => ({ ...p, vendor: e.target.value }))} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Estimated Cost" type="number" fullWidth value={newItem.estimated} onChange={e => setNewItem(p => ({ ...p, estimated: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
              <TextField label="Actual Cost" type="number" fullWidth value={newItem.actual} onChange={e => setNewItem(p => ({ ...p, actual: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Amount Paid" type="number" fullWidth value={newItem.paid} onChange={e => setNewItem(p => ({ ...p, paid: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
              <TextField label="Notes (optional)" fullWidth value={newItem.notes} onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={addItem} disabled={!newItem.category} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, px: 3 }}>Add Expense</Button>
        </DialogActions>
      </Dialog>

      {/* ──── BUDGET EDIT DIALOG ──── */}
      <Dialog open={budgetEditOpen} onClose={() => setBudgetEditOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2, border: '1px solid rgba(0,131,143,0.15)' } }}>
        <DialogTitle sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: T.primaryBlack, pb: 0 }}>Set Total Budget</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField
            label="Total Budget" type="number" fullWidth autoFocus
            value={budgetDraft}
            onChange={e => setBudgetDraft(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
            sx={{ mt: 1, '& .MuiInputBase-root': { fontFamily: T.font } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setBudgetEditOpen(false)} sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, color: '#666' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => { setTotalBudget(parseFloat(budgetDraft) || 0); setBudgetEditOpen(false); notify('Budget updated') }}
            sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, px: 3 }}
          >
            Save
          </Button>
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
