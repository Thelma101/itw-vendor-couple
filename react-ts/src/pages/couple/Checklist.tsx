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
  Menu,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Fade,
  Chip,
} from '@mui/material'
import {
  Edit,
  Delete,
  ContentCopy,
  CheckCircle,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Close,
  CalendarToday,
  AccessTime,
  Flag,
  ArrowBack,
  Notifications,
  AutoAwesome,
  ViewCompact,
  ContentPaste,
  OpenInNew,
  PostAdd,
  NoteAdd,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

/* ───────── tokens (from Figma) ───────── */
const T = {
  bg: '#FFFFFF',
  primary: '#00838F',
  primaryBlack: '#002528',
  accentGrad: 'linear-gradient(255.71deg, #EB1948 65.18%, #B52344 232.03%)',
  heroGrad: 'linear-gradient(199.11deg, #EB1948 65.18%, #B52344 232.03%)',
  accent: '#EB1948',
  menuSelector: '#ECEBA2',
  success: '#008F53',
  text: '#2d2d2d',
  textSub: '#aaaaaa',
  font: "'Open Sans', sans-serif",
  border: '0.25px solid #00838F',
  borderBlack: '0.25px solid #002528',
}

/* ───────── keyframes ───────── */
const kf = `
@keyframes diamondFloat{0%,100%{transform:rotate(45deg) translateY(0)}50%{transform:rotate(45deg) translateY(-6px)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
`

/* ───────── types ───────── */
interface Task {
  id: string
  title: string
  completed: boolean
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  notes: string
  createdAt: string
  category: string
}
type FilterTab = 'all' | 'completed' | 'pending' | 'due'
type InnerView = null | 'detail' | 'settings' | 'share'

/* ───────── data ───────── */
const seed: Task[] = []

/* ───────── helpers ───────── */
const STORAGE = 'itw_checklist'
const load = (): Task[] => { try { const r = localStorage.getItem(STORAGE); return r ? JSON.parse(r) : seed } catch { return seed } }
const save = (t: Task[]) => { try { localStorage.setItem(STORAGE, JSON.stringify(t)) } catch {/**/} }
const fmtDate = (d: string) => {
  const dt = new Date(d)
  const day = String(dt.getDate()).padStart(2, '0')
  const mon = dt.toLocaleString('en-GB', { month: 'long' })
  const yr = dt.getFullYear()
  const h = dt.getHours()
  const m = String(dt.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${day} ${mon} ${yr}, ${h12}:${m}${ampm}`
}
const isDueSoon = (d: string) => { const diff = new Date(d).getTime() - Date.now(); return diff > 0 && diff < 7 * 864e5 }
const isOverdue = (d: string) => new Date(d).getTime() < Date.now()
const pColor = (p: Task['priority']) => p === 'high' ? T.accent : p === 'medium' ? '#F5A623' : T.primary

/* ═══════ COMPONENT ═══════ */
export default function Checklist() {
  const [tasks, setTasks] = useState<Task[]>(load)
  const [tab, setTab] = useState<FilterTab>('all')
  const [innerView, setInnerView] = useState<InnerView>(null)
  const [selected, setSelected] = useState<Task | null>(null)
  const [editing, setEditing] = useState<Task | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'medium' as Task['priority'], notes: '', category: 'Planning' })
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success'|'info'|'error' }>({ open: false, msg: '', sev: 'success' })
  const [ctx, setCtx] = useState<{ el: HTMLElement | null; task: Task | null }>({ el: null, task: null })
  const [settings, setSettings] = useState({ showDueDates: true, notifications: true, autoSort: false, compactView: false })
  const [dragId, setDragId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => { if (!document.getElementById('ck-kf')) { const s = document.createElement('style'); s.id = 'ck-kf'; s.textContent = kf; document.head.appendChild(s) } }, [])
  useEffect(() => { save(tasks) }, [tasks])

  const notify = useCallback((msg: string, sev: 'success'|'info'|'error' = 'success') => setSnack({ open: true, msg, sev }), [])

  /* ── counts ── */
  const counts = useMemo(() => {
    const all = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = tasks.filter(t => !t.completed).length
    const due = tasks.filter(t => !t.completed && (isDueSoon(t.dueDate) || isOverdue(t.dueDate))).length
    return { all, completed, pending, due }
  }, [tasks])

  const filtered = useMemo(() => {
    if (tab === 'completed') return tasks.filter(t => t.completed)
    if (tab === 'pending') return tasks.filter(t => !t.completed)
    if (tab === 'due') return tasks.filter(t => !t.completed && (isDueSoon(t.dueDate) || isOverdue(t.dueDate)))
    return tasks
  }, [tasks, tab])

  /* ── actions ── */
  const toggleTask = useCallback((id: string) => {
    setTasks(p => p.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    const t = tasks.find(x => x.id === id)
    notify(t?.completed ? 'Task reopened' : 'Task completed ✓', t?.completed ? 'info' : 'success')
  }, [tasks, notify])
  const deleteTask = useCallback((id: string) => {
    setTasks(p => p.filter(t => t.id !== id))
    if (selected?.id === id) { setSelected(null); setInnerView(null) }
  }, [selected])
  const confirmDelete = useCallback((id: string) => setDeleteTarget(id), [])
  const handleDeleteConfirmed = useCallback(() => {
    if (deleteTarget) deleteTask(deleteTarget)
    setDeleteTarget(null)
  }, [deleteTarget, deleteTask])
  const duplicateTask = useCallback((t: Task) => {
    setTasks(p => [...p, { ...t, id: `${Date.now()}`, title: `${t.title} (copy)`, completed: false, createdAt: new Date().toISOString() }])
    notify('Task duplicated', 'success')
  }, [notify])
  const addTask = useCallback(() => {
    if (!newTask.title.trim()) return
    setTasks(p => [...p, { id: `${Date.now()}`, title: newTask.title.trim(), completed: false, dueDate: newTask.dueDate || new Date(Date.now() + 30*864e5).toISOString(), priority: newTask.priority, notes: newTask.notes, createdAt: new Date().toISOString(), category: newTask.category }])
    setNewTask({ title: '', dueDate: '', priority: 'medium', notes: '', category: 'Planning' })
    setAddOpen(false); notify('Task added ✓', 'success')
  }, [newTask, notify])
  const updateTask = useCallback((u: Task) => { setTasks(p => p.map(t => t.id === u.id ? u : t)); setEditing(null); setSelected(u); notify('Task updated', 'success') }, [notify])

  /* ── drag ── */
  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); return }
    setTasks(p => { const a = [...p]; const fi = a.findIndex(t => t.id === dragId); const ti = a.findIndex(t => t.id === targetId); const [m] = a.splice(fi, 1); a.splice(ti, 0, m); return a })
    setDragId(null)
  }

  const openDetail = (t: Task) => { setSelected(t); setEditing(null); setInnerView('detail') }
  const closePanel = () => { setInnerView(null); setSelected(null); setEditing(null) }

  const categories = [...new Set(tasks.map(t => t.category))].sort()

  /* ── badge styles per tab ── */
  const tabMeta: Record<FilterTab, { label: string; badgeBg: string; badgeColor: string; count: number }> = {
    all:       { label: 'All', badgeBg: T.menuSelector, badgeColor: T.primaryBlack, count: counts.all },
    completed: { label: 'Completed', badgeBg: T.success, badgeColor: '#fff', count: counts.completed },
    pending:   { label: 'Pending', badgeBg: T.primaryBlack, badgeColor: '#fff', count: counts.pending },
    due:       { label: 'Due', badgeBg: 'none', badgeColor: '#fff', count: counts.due },
  }

  /* sidebar items */
  const sidebarItems: { label: string; key: string; href?: string }[] = [
    { label: 'My Budget', key: 'budget', href: '/couple/budget' },
    { label: 'My Guest-list', key: 'guests', href: '/couple/guest-list' },
    { label: 'Favourites', key: 'favourites', href: '/couple/favourites' },
    { label: 'To-do list', key: 'todo' },
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
              Wedding To-Do List
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 15, color: T.textSub, mt: 0.3 }}>
              Track every detail for your perfect day
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
            const isActive = item.key === 'todo'
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
            {/* Tabs */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: '60px' }, flex: 1 }}>
              {(['all', 'completed', 'pending', 'due'] as FilterTab[]).map((key) => {
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
                      background: key === 'due' ? T.accentGrad : m.badgeBg,
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
                bgcolor: T.primary,
                color: '#fff',
                fontFamily: T.font, fontWeight: 600, fontSize: 16,
                textTransform: 'none',
                px: 2, py: '10px',
                borderRadius: 0,
                lineHeight: 'normal',
                minWidth: 'auto',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#006670' },
              }}
            >
              Add a Task
            </Button>
          </Box>

          {/* ── Task List ── */}
          <Box sx={{ flex: 1 }}>
            {(() => {
              const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
              const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
              return <>
            {filtered.length === 0 ? (
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
                    <PostAdd sx={{ fontSize: 30, color: T.primary, opacity: 0.7 }} />
                  </Box>
                  <Box sx={{
                    position: 'absolute', bottom: 0, left: 0,
                    width: 62, height: 62, borderRadius: '12px',
                    bgcolor: 'rgba(0,131,143,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: 'rotate(-5deg)',
                    boxShadow: '0 2px 8px rgba(0,131,143,0.1)',
                  }}>
                    <NoteAdd sx={{ fontSize: 30, color: T.primary }} />
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 0.8 }}>
                  {tab === 'completed' ? 'No Completed Tasks Yet' : tab === 'pending' ? 'All Tasks are Done!' : tab === 'due' ? 'No Tasks Due Soon' : 'Your Todo-List is Empty'}
                </Typography>
                <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>
                  {tab === 'all' ? 'Add your first Task' : 'Try a different filter'}
                </Typography>
              </Box>
            ) : (
              paged.map((task) => (
                <Box
                  key={task.id}
                  draggable
                  onDragStart={() => setDragId(task.id)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => onDrop(task.id)}
                  onClick={() => openDetail(task)}
                  onContextMenu={(e) => { e.preventDefault(); setCtx({ el: e.currentTarget as HTMLElement, task }) }}
                  sx={{
                    px: { xs: 2, md: '57px' },
                    py: 2.8,
                    borderBottom: T.border,
                    cursor: 'pointer',
                    opacity: dragId === task.id ? 0.35 : 1,
                    transition: 'background 0.2s, opacity 0.2s',
                    '&:hover': { bgcolor: 'rgba(0,131,143,0.02)' },
                  }}
                >
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 600, fontSize: 16,
                    color: task.completed ? T.textSub : T.text,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    lineHeight: 'normal', mb: 0.6,
                  }}>
                    {task.title}
                  </Typography>
                  <Typography sx={{
                    fontFamily: T.font, fontWeight: 600, fontSize: 14,
                    color: T.textSub, lineHeight: 'normal',
                  }}>
                    {fmtDate(task.dueDate)}
                  </Typography>
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
        successMessage="Task Deleted Successfully"
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
              {innerView === 'detail' ? 'Task Details' : innerView === 'settings' ? 'Settings' : 'Share Checklist'}
            </Typography>
            <IconButton size="small" onClick={closePanel}><Close sx={{ fontSize: 20, color: '#666' }} /></IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {/* TASK DETAIL */}
            {innerView === 'detail' && selected && (
              editing ? (
                <Fade in timeout={250}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField label="Title" fullWidth value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Due Date" type="datetime-local" fullWidth value={editing.dueDate.slice(0, 16)} onChange={e => setEditing({ ...editing, dueDate: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select value={editing.priority} label="Priority" onChange={e => setEditing({ ...editing, priority: e.target.value as Task['priority'] })}>
                        <MenuItem value="high">High</MenuItem><MenuItem value="medium">Medium</MenuItem><MenuItem value="low">Low</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select value={editing.category} label="Category" onChange={e => setEditing({ ...editing, category: e.target.value })}>
                        {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <TextField label="Notes" fullWidth multiline rows={3} value={editing.notes} onChange={e => setEditing({ ...editing, notes: e.target.value })} />
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                      <Button fullWidth variant="contained" onClick={() => updateTask(editing)} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>Save</Button>
                      <Button fullWidth variant="outlined" onClick={() => setEditing(null)} sx={{ borderColor: 'rgba(0,131,143,0.25)', color: '#666', textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>Cancel</Button>
                    </Box>
                  </Box>
                </Fade>
              ) : (
                <Fade in timeout={250}>
                  <Box>
                    {/* Status + Priority */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                      <Chip label={selected.completed ? 'Completed' : 'Pending'} size="small" sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 11, bgcolor: selected.completed ? 'rgba(0,143,83,0.1)' : 'rgba(245,166,35,0.1)', color: selected.completed ? T.success : '#F5A623' }} />
                      <Chip label={selected.priority} size="small" sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 11, textTransform: 'capitalize', bgcolor: `${pColor(selected.priority)}15`, color: pColor(selected.priority) }} />
                    </Box>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 2, lineHeight: 1.3 }}>{selected.title}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CalendarToday sx={{ fontSize: 16, color: T.textSub }} />
                        <Typography sx={{ fontFamily: T.font, fontSize: 14, color: '#666' }}>Due: {fmtDate(selected.dueDate)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AccessTime sx={{ fontSize: 16, color: T.textSub }} />
                        <Typography sx={{ fontFamily: T.font, fontSize: 14, color: '#666' }}>Created: {new Date(selected.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Flag sx={{ fontSize: 16, color: pColor(selected.priority) }} />
                        <Typography sx={{ fontFamily: T.font, fontSize: 14, color: '#666', textTransform: 'capitalize' }}>{selected.priority} priority</Typography>
                      </Box>
                    </Box>
                    {/* category */}
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>Category</Typography>
                      <Chip label={selected.category} sx={{ fontFamily: T.font, fontWeight: 600, bgcolor: 'rgba(0,131,143,0.08)', color: T.primary }} />
                    </Box>
                    {/* notes */}
                    {selected.notes && (
                      <Box sx={{ mb: 3 }}>
                        <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>Notes</Typography>
                        <Box sx={{ p: 2, bgcolor: T.bg, borderRadius: 1, border: '1px solid rgba(0,131,143,0.15)' }}>
                          <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.text, lineHeight: 1.7 }}>{selected.notes}</Typography>
                        </Box>
                      </Box>
                    )}
                    {/* actions */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                      <Button fullWidth variant="contained" startIcon={<Edit />} onClick={() => setEditing({ ...selected })} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>Edit</Button>
                      <Button variant="outlined" startIcon={<ContentCopy />} onClick={() => { duplicateTask(selected); closePanel() }} sx={{ borderColor: 'rgba(0,131,143,0.25)', color: '#666', textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1, px: 2, minWidth: 'auto' }}>Duplicate</Button>
                    </Box>
                    <Button fullWidth variant="outlined" startIcon={selected.completed ? <CheckCircle /> : <CheckCircle />} onClick={() => { toggleTask(selected.id); setSelected({ ...selected, completed: !selected.completed }) }}
                      sx={{ mt: 1.5, borderColor: selected.completed ? 'rgba(245,166,35,0.3)' : 'rgba(0,143,83,0.3)', color: selected.completed ? '#F5A623' : T.success, textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1 }}>
                      {selected.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </Button>
                    <Button fullWidth startIcon={<Delete />} onClick={() => { confirmDelete(selected.id); closePanel() }} sx={{ mt: 1, color: T.accent, textTransform: 'none', fontWeight: 600, fontFamily: T.font, '&:hover': { bgcolor: 'rgba(235,25,72,0.04)' } }}>Delete</Button>
                  </Box>
                </Fade>
              )
            )}

            {/* SETTINGS */}
            {innerView === 'settings' && (
              <Fade in timeout={250}>
                <Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 2 }}>Display</Typography>
                  {[
                    { key: 'showDueDates' as const, label: 'Show due dates', desc: 'Display dates below tasks', icon: <CalendarToday sx={{ fontSize: 20, color: T.primary }} /> },
                    { key: 'compactView' as const, label: 'Compact view', desc: 'Reduce spacing', icon: <ViewCompact sx={{ fontSize: 20, color: T.primary }} /> },
                  ].map(o => (
                    <Box key={o.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, borderBottom: '1px solid rgba(0,131,143,0.1)' }}>
                      {o.icon}
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.text }}>{o.label}</Typography>
                        <Typography sx={{ fontFamily: T.font, fontSize: 12, color: T.textSub }}>{o.desc}</Typography>
                      </Box>
                      <Switch checked={settings[o.key]} onChange={() => setSettings(p => ({ ...p, [o.key]: !p[o.key] }))} sx={{ '& .Mui-checked': { color: T.primary }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: T.primary } }} />
                    </Box>
                  ))}
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.06em', mt: 4, mb: 2 }}>Behavior</Typography>
                  {[
                    { key: 'notifications' as const, label: 'Notifications', desc: 'Reminders for upcoming tasks', icon: <Notifications sx={{ fontSize: 20, color: T.primary }} /> },
                    { key: 'autoSort' as const, label: 'Auto-sort by priority', desc: 'Sort tasks by priority level', icon: <AutoAwesome sx={{ fontSize: 20, color: T.primary }} /> },
                  ].map(o => (
                    <Box key={o.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, borderBottom: '1px solid rgba(0,131,143,0.1)' }}>
                      {o.icon}
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.text }}>{o.label}</Typography>
                        <Typography sx={{ fontFamily: T.font, fontSize: 12, color: T.textSub }}>{o.desc}</Typography>
                      </Box>
                      <Switch checked={settings[o.key]} onChange={() => setSettings(p => ({ ...p, [o.key]: !p[o.key] }))} sx={{ '& .Mui-checked': { color: T.primary }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: T.primary } }} />
                    </Box>
                  ))}
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.06em', mt: 4, mb: 2 }}>Data</Typography>
                  <Button fullWidth variant="outlined" onClick={() => { setTasks(seed); notify('Reset to defaults', 'info') }} sx={{ borderColor: T.accent, color: T.accent, textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1, '&:hover': { bgcolor: 'rgba(235,25,72,0.04)', borderColor: T.accent } }}>Reset to Default Tasks</Button>
                </Box>
              </Fade>
            )}

            {/* SHARE */}
            {innerView === 'share' && (
              <Fade in timeout={250}>
                <Box>
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', mx: 'auto', mb: 2, background: T.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShareIcon sx={{ fontSize: 24, color: '#fff' }} />
                    </Box>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: T.primaryBlack, mb: 0.5 }}>Share Your Checklist</Typography>
                    <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>Share progress with your partner or planner.</Typography>
                  </Box>
                  <Divider sx={{ my: 2, borderColor: 'rgba(0,131,143,0.1)' }} />
                  <Button fullWidth variant="outlined" startIcon={<ContentPaste />}
                    onClick={() => {
                      const progress = counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0
                      const txt = tasks.map(t => `${t.completed ? '✅' : '⬜'} ${t.title} — ${fmtDate(t.dueDate)}`).join('\n')
                      navigator.clipboard.writeText(`Wedding Checklist (${progress}% complete)\n\n${txt}`)
                      notify('Copied to clipboard!', 'success')
                    }}
                    sx={{ borderColor: 'rgba(0,131,143,0.25)', color: T.primary, textTransform: 'none', fontWeight: 600, fontFamily: T.font, borderRadius: 1, py: 1.5, mb: 3, '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' } }}>
                    Copy as Text
                  </Button>
                  <Box sx={{ p: 2.5, bgcolor: T.bg, borderRadius: 1, border: '1px solid rgba(0,131,143,0.15)' }}>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.primaryBlack, mb: 1.5 }}>Summary</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                      {[
                        { l: 'Total', v: counts.all, c: T.primary },
                        { l: 'Completed', v: counts.completed, c: T.success },
                        { l: 'Pending', v: counts.pending, c: '#F5A623' },
                        { l: 'Progress', v: `${counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0}%`, c: T.primary },
                      ].map(s => (
                        <Box key={s.l} sx={{ textAlign: 'center', p: 1.5, bgcolor: '#fff', borderRadius: 1 }}>
                          <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: s.c }}>{s.v}</Typography>
                          <Typography sx={{ fontFamily: T.font, fontSize: 11, color: T.textSub, fontWeight: 600 }}>{s.l}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Fade>
            )}
          </Box>

          {/* panel footer with settings/share shortcuts (detail view only) */}
          {innerView === 'detail' && !editing && (
            <Box sx={{ display: 'flex', borderTop: '1px solid rgba(0,131,143,0.15)', p: 1.5, gap: 1 }}>
              <Button size="small" startIcon={<SettingsIcon sx={{ fontSize: '16px !important' }} />} onClick={() => setInnerView('settings')} sx={{ flex: 1, textTransform: 'none', fontFamily: T.font, fontWeight: 600, fontSize: 13, color: '#666' }}>Settings</Button>
              <Button size="small" startIcon={<ShareIcon sx={{ fontSize: '16px !important' }} />} onClick={() => setInnerView('share')} sx={{ flex: 1, textTransform: 'none', fontFamily: T.font, fontWeight: 600, fontSize: 13, color: '#666' }}>Share</Button>
            </Box>
          )}
        </Box>
      </Slide>
      {innerView !== null && <Box onClick={closePanel} sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,37,40,0.25)', backdropFilter: 'blur(2px)', zIndex: 1299 }} />}

      {/* ──── CONTEXT MENU ──── */}
      <Menu anchorEl={ctx.el} open={!!ctx.el} onClose={() => setCtx({ el: null, task: null })}
        PaperProps={{ sx: { borderRadius: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid rgba(0,131,143,0.15)', minWidth: 170 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={() => { if (ctx.task) openDetail(ctx.task); setCtx({ el: null, task: null }) }} sx={{ fontFamily: T.font, fontSize: 13 }}>
          <ListItemIcon><OpenInNew sx={{ fontSize: 18 }} /></ListItemIcon><ListItemText primaryTypographyProps={{ fontFamily: T.font, fontSize: 13 }}>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { if (ctx.task) { setEditing({ ...ctx.task }); setSelected(ctx.task); setInnerView('detail') }; setCtx({ el: null, task: null }) }} sx={{ fontFamily: T.font, fontSize: 13 }}>
          <ListItemIcon><Edit sx={{ fontSize: 18 }} /></ListItemIcon><ListItemText primaryTypographyProps={{ fontFamily: T.font, fontSize: 13 }}>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { if (ctx.task) duplicateTask(ctx.task); setCtx({ el: null, task: null }) }} sx={{ fontFamily: T.font, fontSize: 13 }}>
          <ListItemIcon><ContentCopy sx={{ fontSize: 18 }} /></ListItemIcon><ListItemText primaryTypographyProps={{ fontFamily: T.font, fontSize: 13 }}>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { if (ctx.task) toggleTask(ctx.task.id); setCtx({ el: null, task: null }) }} sx={{ fontFamily: T.font, fontSize: 13 }}>
          <ListItemIcon><CheckCircle sx={{ fontSize: 18, color: T.success }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontFamily: T.font, fontSize: 13 }}>{ctx.task?.completed ? 'Mark Incomplete' : 'Mark Complete'}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { if (ctx.task) confirmDelete(ctx.task.id); setCtx({ el: null, task: null }) }} sx={{ fontFamily: T.font, fontSize: 13, color: T.accent }}>
          <ListItemIcon><Delete sx={{ fontSize: 18, color: T.accent }} /></ListItemIcon><ListItemText primaryTypographyProps={{ fontFamily: T.font, fontSize: 13, color: T.accent }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* ──── ADD DIALOG ──── */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, border: '1px solid rgba(0,131,143,0.15)' } }}>
        <DialogTitle sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: T.primaryBlack, pb: 0 }}>Add New Task</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField label="Task Title" fullWidth autoFocus placeholder="e.g. Confirm catering menu" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Due Date" type="datetime-local" fullWidth value={newTask.dueDate} onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={newTask.priority} label="Priority" onChange={e => setNewTask(p => ({ ...p, priority: e.target.value as Task['priority'] }))} sx={{ fontFamily: T.font }}>
                  <MenuItem value="high">High</MenuItem><MenuItem value="medium">Medium</MenuItem><MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={newTask.category} label="Category" onChange={e => setNewTask(p => ({ ...p, category: e.target.value }))} sx={{ fontFamily: T.font }}>
                {['Planning', 'Budget', 'Guests', 'Gifts', 'Venue', 'Vendors', 'Attire', 'Stationery', 'Decor', 'Catering', 'Ceremony', 'Travel'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Notes (optional)" fullWidth multiline rows={2} value={newTask.notes} onChange={e => setNewTask(p => ({ ...p, notes: e.target.value }))} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={addTask} disabled={!newTask.title.trim()} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, px: 3 }}>Add Task</Button>
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
