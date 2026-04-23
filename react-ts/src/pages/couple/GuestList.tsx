import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'

interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  group: string
  notes?: string
  status: 'Invited' | 'Confirmed' | 'Pending'
}

const key = 'itw_guestlist'

const defaultGuests: Guest[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', group: 'Friends', status: 'Confirmed' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', group: "Bride's Family", status: 'Pending' },
  { id: '3', name: 'Michael Johnson', email: 'michael.j@example.com', group: "Groom's Family", status: 'Invited' }
]

const readGuests = (): Guest[] => {
  try {
    const raw = localStorage.getItem(key)
    const stored = raw ? (JSON.parse(raw) as Guest[]) : []
    return stored.length > 0 ? stored : defaultGuests
  } catch {
    return defaultGuests
  }
}

const statusStyles: Record<Guest['status'], { bg: string; color: string }> = {
  Invited: { bg: '#EFF6FF', color: '#1D4ED8' },
  Pending: { bg: '#FFF7ED', color: '#B45309' },
  Confirmed: { bg: '#ECFDF5', color: '#15803D' },
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>(readGuests)
  const [filter, setFilter] = useState<'All' | Guest['status']>('All')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', group: '', notes: '' })
  const [search, setSearch] = useState('')

  const sync = (next: Guest[]) => {
    setGuests(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

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
    if (!form.name.trim()) return

    const guest: Guest = {
      id: String(Date.now()),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      group: form.group.trim() || 'Friends',
      notes: form.notes.trim(),
      status: 'Invited',
    }

    sync([...guests, guest])
    setDialogOpen(false)
    setForm({ name: '', email: '', phone: '', group: '', notes: '' })
  }

  const cycleStatus = (id: string) => {
    sync(
      guests.map((guest) => {
        if (guest.id !== id) return guest
        if (guest.status === 'Invited') return { ...guest, status: 'Pending' }
        if (guest.status === 'Pending') return { ...guest, status: 'Confirmed' }
        return { ...guest, status: 'Invited' }
      })
    )
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 700, borderRadius: 6, '&:hover': { bgcolor: '#006670' } }}
        >
          Add Guest
        </Button>
      }
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.18fr 0.92fr' }, gap: 2.5 }}>
        <Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5, mb: 2.4 }}>
            {[
              { label: 'Confirmed', value: stats.confirmed, bg: '#ECFDF5', color: '#15803D' },
              { label: 'Pending', value: stats.pending, bg: '#FFF7ED', color: '#B45309' },
              { label: 'Invited', value: stats.invited, bg: '#EFF6FF', color: '#1D4ED8' },
              { label: 'Groups', value: stats.groups, bg: '#F5F3FF', color: '#6D28D9' },
            ].map((item) => (
              <Paper key={item.label} elevation={0} sx={{ p: 1.8, borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: item.bg }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>{item.label}</Typography>
                <Typography sx={{ fontSize: 26, fontWeight: 800, color: item.color }}>{item.value}</Typography>
              </Paper>
            ))}
          </Box>

          <Paper elevation={0} sx={{ p: 2.1, borderRadius: 4, border: '1px solid #E2E8F0', mb: 2.2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
              <TextField
                label="Search guests or group"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                sx={{ width: { xs: '100%', md: 320 } }}
              />
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {(['All', 'Invited', 'Pending', 'Confirmed'] as const).map((status) => (
                  <Chip
                    key={status}
                    label={status}
                    onClick={() => setFilter(status)}
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2.4,
                      bgcolor: filter === status ? '#00838F' : '#F1F5F9',
                      color: filter === status ? '#fff' : '#334155',
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>

          <Stack spacing={1.2}>
            {visible.map((guest) => {
              const tone = statusStyles[guest.status]

              return (
                <Paper key={guest.id} elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 4, transition: 'all 0.2s ease', '&:hover': { boxShadow: '0 12px 24px rgba(15,23,42,0.06)' } }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: '#E6FFFB', color: '#0F766E', fontWeight: 800 }}>{initials(guest.name)}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>{guest.name}</Typography>
                        <Typography sx={{ fontSize: 13, color: '#64748B' }}>{guest.email || 'No email provided'}</Typography>
                        <Chip label={guest.group} size="small" sx={{ mt: 0.8, bgcolor: '#F8FAFC', color: '#475569', fontWeight: 700 }} />
                      </Box>
                    </Stack>
                    <Stack direction={{ xs: 'row', md: 'column' }} spacing={1} alignItems={{ xs: 'center', md: 'flex-end' }}>
                      <Chip label={guest.status} sx={{ bgcolor: tone.bg, color: tone.color, fontWeight: 800 }} />
                      <Button onClick={() => cycleStatus(guest.id)} size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: 2.2, fontWeight: 700 }}>
                        Move Status
                      </Button>
                    </Stack>
                  </Stack>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Guest</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Full name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            <TextField label="Email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            <TextField label="Phone number" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="+234 (optional)" />
            <TextField label="Group" value={form.group} onChange={(event) => setForm((prev) => ({ ...prev, group: event.target.value }))} placeholder="Friends, Family, Colleagues..." />
            <TextField
              label="Notes"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Dietary restrictions, seating preferences, etc."
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={addGuest} variant="contained" sx={{ textTransform: 'none', bgcolor: '#00838F' }}>Save Guest</Button>
        </DialogActions>
      </Dialog>
    </CouplePageShell>
  )
}
