import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { Add, ExpandMore, Delete, Edit as EditIcon, EditNote, Search } from '@mui/icons-material'
import CouplePageShell from '@/couple/components/CouplePageShell'
import EditNoteDrawer from '@/couple/components/EditNoteDrawer'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { useFormDialog } from '@/shared/hooks/useFormDialog'
import { STATUS_STYLES, STORAGE_KEYS } from '@/shared/lib/constants'
import { usePlan } from '@/shared/contexts/PlanContext'
import PlanBadge from '@/shared/components/PlanBadge'
import { planningApi, isNetworkError } from '@/shared/lib/api'

interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  group: string
  notes?: string
  status: 'Invited' | 'Confirmed' | 'Pending'
}

const defaultGuests: Guest[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', group: 'Friends', status: 'Confirmed' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', group: "Bride's Family", status: 'Pending' },
  { id: '3', name: 'Michael Johnson', email: 'michael.j@example.com', group: "Groom's Family", status: 'Invited' }
]

function rsvpToStatus(rsvp?: string): Guest['status'] {
  if (rsvp === 'yes') return 'Confirmed'
  if (rsvp === 'maybe') return 'Pending'
  return 'Invited'
}

function statusToRsvp(status: Guest['status']): 'pending' | 'yes' | 'maybe' {
  if (status === 'Confirmed') return 'yes'
  if (status === 'Pending') return 'maybe'
  return 'pending'
}

function mapApiGuest(g: any): Guest {
  return {
    id: g.id,
    name: g.name,
    email: g.email || '',
    phone: g.phone || '',
    group: g.group || 'Friends',
    notes: g.notes || '',
    status: rsvpToStatus(g.rsvp),
  }
}

export default function GuestList() {
  const { guestCap, isPremium, setPlan } = usePlan()
  const { data: guests, save: sync } = useLocalStorage<Guest[]>(STORAGE_KEYS.GUEST_LIST, defaultGuests)
  const [apiReady, setApiReady] = useState(false)
  const atGuestCap = !isPremium && guests.length >= guestCap
  const [filter, setFilter] = useState<'All' | Guest['status']>('All')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [noteDrawerOpen, setNoteDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [toast, setToast] = useState('')
  const { form, updateForm, dialogOpen, openDialog, closeDialog, handleSave: saveGuest } = useFormDialog(
    { name: '', email: '', phone: '', group: '', notes: '' },
    async (formData) => {
      if (!isPremium && guests.length >= guestCap) return
      if (apiReady) {
        try {
          const created = await planningApi.createGuest({
            name: formData.name.trim(),
            email: formData.email.trim() || undefined,
            phone: formData.phone.trim() || undefined,
            group: formData.group.trim() || 'Friends',
            notes: formData.notes.trim() || undefined,
            rsvp: 'pending',
            side: 'both',
          })
          sync([...guests, mapApiGuest(created)])
          return
        } catch {
          /* local fallback */
        }
      }
      const guest: Guest = {
        id: String(Date.now()),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        group: formData.group.trim() || 'Friends',
        notes: formData.notes.trim(),
        status: 'Invited',
      }
      sync([...guests, guest])
    },
    (formData) => formData.name.trim().length > 0 && (isPremium || guests.length < guestCap)
  )

  useEffect(() => {
    void (async () => {
      try {
        const rows = await planningApi.listGuests()
        if (Array.isArray(rows) && rows.length) {
          sync(rows.map(mapApiGuest))
          setApiReady(true)
        }
      } catch (error) {
        if (!isNetworkError(error)) console.warn(error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visible = useMemo(() => {
    const filtered = filter === 'All' ? guests : guests.filter((guest) => guest.status === filter)
    const query = search.trim().toLowerCase()

    if (!query) return filtered

    return filtered.filter((guest) => {
      return [guest.name, guest.email, guest.group].some((value) => value.toLowerCase().includes(query))
    })
  }, [filter, guests, search])

  const stats = useMemo(() => {
    return {
      invited: guests.filter((guest) => guest.status === 'Invited').length,
      pending: guests.filter((guest) => guest.status === 'Pending').length,
      confirmed: guests.filter((guest) => guest.status === 'Confirmed').length,
      groups: new Set(guests.map((guest) => guest.group)).size,
    }
  }, [guests])

  const addGuest = () => {
    saveGuest()
    setToast('Guest added')
  }

  const openEdit = (guest: Guest) => {
    setEditingGuest({ ...guest })
  }

  const saveEdit = async () => {
    if (!editingGuest?.name.trim()) return
    if (apiReady) {
      try {
        await planningApi.updateGuest(editingGuest.id, {
          name: editingGuest.name.trim(),
          email: editingGuest.email.trim() || undefined,
          phone: editingGuest.phone?.trim() || undefined,
          group: editingGuest.group,
          notes: editingGuest.notes || undefined,
          rsvp: statusToRsvp(editingGuest.status),
        })
      } catch {
        /* keep local */
      }
    }
    sync(guests.map((g) => (g.id === editingGuest.id ? editingGuest : g)))
    setEditingGuest(null)
    setToast('Guest updated')
  }

  const cycleStatus = async (id: string) => {
    const current = guests.find((g) => g.id === id)
    if (!current) return
    const nextStatus: Guest['status'] =
      current.status === 'Invited' ? 'Pending' : current.status === 'Pending' ? 'Confirmed' : 'Invited'
    if (apiReady) {
      try {
        await planningApi.updateGuest(id, { rsvp: statusToRsvp(nextStatus) })
      } catch {
        /* local */
      }
    }
    sync(guests.map((guest) => (guest.id === id ? { ...guest, status: nextStatus } : guest)))
  }

  const deleteGuest = async (id: string) => {
    if (apiReady) {
      try {
        await planningApi.deleteGuest(id)
      } catch {
        /* local */
      }
    }
    sync(guests.filter((guest) => guest.id !== id))
    setDeleteConfirm(null)
  }

  const initials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')

  return (
    <CouplePageShell
      title="Guest List"
      subtitle="Keep RSVPs, family groups, and attendance momentum in one place with a layout that feels more polished than a plain spreadsheet."
      badge={`${guests.length} total guests`}
      actions={
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ width: { xs: '100%', sm: 'auto' }, '& .MuiButton-root': { whiteSpace: 'nowrap', minHeight: 42 } }}
        >
          <PlanBadge />
          <Button
            variant="outlined"
            startIcon={<EditNote />}
            onClick={() => setNoteDrawerOpen(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              borderColor: '#0F766E',
              color: '#0F766E',
              px: 2.5,
            }}
          >
            Add Note
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openDialog}
            disabled={atGuestCap}
            sx={{
              bgcolor: '#0F766E',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 2.5,
              boxShadow: '0 8px 18px rgba(15,118,110,0.25)',
              '&:hover': { bgcolor: '#0D9488' },
              '&.Mui-disabled': { bgcolor: '#CBD5E1', color: '#64748B' },
            }}
          >
            Add Guest
          </Button>
        </Stack>
      }
    >
      {!isPremium ? (
        <Paper elevation={0} sx={{ mb: 2, p: 2, borderRadius: 3, border: '1px solid #FDE68A', bgcolor: '#FFFBEB' }}>
          <Typography sx={{ fontSize: 13, color: '#92400E' }}>
            Standard plan includes up to <strong>{guestCap}</strong> guests ({guests.length}/{guestCap} used).
            {atGuestCap ? ' Limit reached — ' : ' '}
            <Button onClick={() => setPlan('premium')} sx={{ textTransform: 'none', fontWeight: 700, color: '#0F766E', p: 0, minWidth: 0 }}>
              Try Premium for unlimited
            </Button>
          </Typography>
        </Paper>
      ) : null}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.18fr', lg: '1.18fr 0.92fr' }, gap: 2.5 }}>
        <Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5, mb: 2.4 }}>
            {(
              [
                { key: 'Confirmed', label: 'Confirmed', value: stats.confirmed, bg: '#ECFDF5', color: '#15803D', filterable: true },
                { key: 'Pending', label: 'Pending', value: stats.pending, bg: '#FFF7ED', color: '#B45309', filterable: true },
                { key: 'Invited', label: 'Invited', value: stats.invited, bg: '#EFF6FF', color: '#1D4ED8', filterable: true },
                { key: null, label: 'Groups', value: stats.groups, bg: '#F5F3FF', color: '#6D28D9', filterable: false },
              ] as const
            ).map((item) => {
              const active = item.filterable && filter === item.key
              return (
                <Paper
                  key={item.label}
                  elevation={0}
                  onClick={() => {
                    if (item.filterable && item.key) setFilter(item.key)
                  }}
                  sx={{
                    p: 1.8,
                    borderRadius: 3,
                    border: active ? `2px solid ${item.color}` : '1px solid #E2E8F0',
                    bgcolor: item.bg,
                    cursor: item.filterable ? 'pointer' : 'default',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: 26, fontWeight: 800, color: item.color }}>{item.value}</Typography>
                </Paper>
              )
            })}
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              mb: 2.2,
              bgcolor: '#fff',
            }}
          >
            <Stack spacing={1.5}>
              <TextField
                placeholder="Search by name, email, or group…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    bgcolor: '#F8FAFC',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#0F766E' },
                  },
                }}
              />
              <ToggleButtonGroup
                exclusive
                value={filter}
                onChange={(_e, value: 'All' | Guest['status'] | null) => {
                  if (value) setFilter(value)
                }}
                fullWidth
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                  gap: 1,
                  bgcolor: 'transparent',
                  '& .MuiToggleButtonGroup-grouped': {
                    border: '1px solid #E2E8F0 !important',
                    borderRadius: '10px !important',
                    margin: 0,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#475569',
                    py: 0.9,
                    bgcolor: '#F8FAFC',
                    '&.Mui-selected': {
                      bgcolor: '#0F766E',
                      color: '#fff',
                      borderColor: '#0F766E !important',
                      '&:hover': { bgcolor: '#0D9488' },
                    },
                    '&:hover': { bgcolor: '#F1F5F9' },
                  },
                }}
              >
                <ToggleButton value="All">All</ToggleButton>
                <ToggleButton value="Invited">Invited</ToggleButton>
                <ToggleButton value="Pending">Pending</ToggleButton>
                <ToggleButton value="Confirmed">Confirmed</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Paper>

          <Stack spacing={1.2}>
            {visible.map((guest) => {
              const tone = STATUS_STYLES[guest.status]

              return (
                <Paper key={guest.id} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 4, transition: 'all 0.2s ease', '&:hover': { boxShadow: '0 12px 24px rgba(15,23,42,0.06)' } }}>
                  <Box sx={{ p: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 1.5 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: '#E6FFFB', color: '#0F766E', fontWeight: 800 }}>{initials(guest.name)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>{guest.name}</Typography>
                          <Typography sx={{ fontSize: 13, color: '#64748B' }}>{guest.phone || 'No phone provided'}</Typography>
                          <Chip label={guest.group} size="small" sx={{ mt: 0.8, bgcolor: '#F8FAFC', color: '#475569', fontWeight: 700 }} />
                        </Box>
                      </Stack>
                      <Stack direction={{ xs: 'row', md: 'column' }} spacing={1} alignItems={{ xs: 'center', md: 'flex-end' }}>
                        <Chip label={guest.status} sx={{ bgcolor: tone.bg, color: tone.color, fontWeight: 800 }} />
                        <Stack direction="row" spacing={0.5}>
                          <Button onClick={() => cycleStatus(guest.id)} size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: 2.2, fontWeight: 700 }}>
                            Move Status
                          </Button>
                          <IconButton size="small" onClick={() => openEdit(guest)} sx={{ color: '#0F766E', '&:hover': { bgcolor: '#F0FDFA' } }} aria-label="Edit guest">
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeleteConfirm(guest.id)} sx={{ color: '#B91C1C', '&:hover': { bgcolor: '#FEF2F2' } }} aria-label="Delete guest">
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Stack>

                    {(guest.email || guest.notes) && (
                      <Accordion elevation={0} disableGutters sx={{ border: 'none', '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ p: 0, minHeight: 'auto', '& .MuiAccordionSummary-content': { m: 0 } }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#0F766E' }}>View details</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: '12px 0 0 0', pt: 1.5, borderTop: '1px solid #EDF2F7' }}>
                          <Stack spacing={1}>
                            {guest.email && (
                              <Box>
                                <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, mb: 0.3 }}>EMAIL</Typography>
                                <Typography sx={{ fontSize: 13, color: '#0F172A' }}>{guest.email}</Typography>
                              </Box>
                            )}
                            {guest.notes && (
                              <Box>
                                <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, mb: 0.3 }}>NOTES</Typography>
                                <Typography sx={{ fontSize: 13, color: '#0F172A' }}>{guest.notes}</Typography>
                              </Box>
                            )}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Box>
                </Paper>
              )
            })}

            {visible.length === 0 && <Typography sx={{ color: '#64748B' }}>No guests match this view right now.</Typography>}
          </Stack>
        </Box>

        <Stack spacing={2.5}>
          <Paper elevation={0} sx={{ p: 2.4, borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF7F8' }}>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0F172A', mb: 0.8 }}>RSVP pulse</Typography>
            <Typography sx={{ fontSize: 14, color: '#475569', mb: 1.4 }}>
              {stats.confirmed > stats.pending
                ? 'Most of your recent responses are moving in the right direction.'
                : 'You still have a healthy number of people to follow up with before final counts.'}
            </Typography>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 14, color: '#475569' }}>Confirmed guests help you lock catering and seating faster.</Typography>
              <Typography sx={{ fontSize: 14, color: '#475569' }}>Pending guests are your best next follow-up list for the week.</Typography>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2.4, borderRadius: 4, border: '1px solid #E2E8F0' }}>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0F172A', mb: 1 }}>Host notes</Typography>
            <Stack spacing={1}>
              {[
                'Use groups to separate family, wedding party, colleagues, and out-of-town guests.',
                'Keep email optional so you can still add relatives quickly during conversations.',
                'Advance statuses steadily instead of waiting until every response arrives at once.',
              ].map((tip) => (
                <Typography key={tip} sx={{ fontSize: 14, color: '#475569' }}>
                  {tip}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Remove Guest?</DialogTitle>
        <DialogContent>
          <Typography>This guest will be permanently removed from your list. This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteConfirm && deleteGuest(deleteConfirm)}
            variant="contained"
            sx={{ textTransform: 'none', bgcolor: '#B91C1C' }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Note Drawer */}
      <EditNoteDrawer open={noteDrawerOpen} onClose={() => setNoteDrawerOpen(false)} />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Guest</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Full name" required value={form.name} onChange={(event) => updateForm({ name: event.target.value })} />
            <TextField label="Phone number" required value={form.phone} onChange={(event) => updateForm({ phone: event.target.value })} placeholder="+234" />
            <TextField label="Group" value={form.group} onChange={(event) => updateForm({ group: event.target.value })} placeholder="Friends, Family, Colleagues..." />
            <Accordion elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Optional Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <TextField label="Email" value={form.email} onChange={(event) => updateForm({ email: event.target.value })} />
                  <TextField
                    label="Notes"
                    value={form.notes}
                    onChange={(event) => updateForm({ notes: event.target.value })}
                    placeholder="Dietary restrictions, seating preferences, etc."
                    multiline
                    rows={2}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={addGuest} variant="contained" sx={{ textTransform: 'none', bgcolor: '#0F766E', fontWeight: 700 }}>Save Guest</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editingGuest} onClose={() => setEditingGuest(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Guest</DialogTitle>
        <DialogContent>
          {editingGuest ? (
            <Stack spacing={2} sx={{ mt: 0.5 }}>
              <TextField
                label="Full name"
                required
                value={editingGuest.name}
                onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
              />
              <TextField
                label="Phone"
                value={editingGuest.phone || ''}
                onChange={(e) => setEditingGuest({ ...editingGuest, phone: e.target.value })}
              />
              <TextField
                label="Email"
                value={editingGuest.email}
                onChange={(e) => setEditingGuest({ ...editingGuest, email: e.target.value })}
              />
              <TextField
                label="Group"
                value={editingGuest.group}
                onChange={(e) => setEditingGuest({ ...editingGuest, group: e.target.value })}
              />
              <TextField
                select
                label="Status"
                value={editingGuest.status}
                onChange={(e) =>
                  setEditingGuest({ ...editingGuest, status: e.target.value as Guest['status'] })
                }
              >
                <MenuItem value="Invited">Invited</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
              </TextField>
              <TextField
                label="Notes"
                multiline
                minRows={2}
                value={editingGuest.notes || ''}
                onChange={(e) => setEditingGuest({ ...editingGuest, notes: e.target.value })}
              />
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingGuest(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={saveEdit} variant="contained" sx={{ textTransform: 'none', bgcolor: '#0F766E', fontWeight: 700 }}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={2200} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ fontWeight: 600 }} onClose={() => setToast('')}>
          {toast}
        </Alert>
      </Snackbar>
    </CouplePageShell>
  )
}
