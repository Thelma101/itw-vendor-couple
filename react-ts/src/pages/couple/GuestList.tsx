import { useMemo, useState } from 'react'
import {
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
  group: string
  status: 'Invited' | 'Confirmed' | 'Pending'
}

const key = 'itw_guestlist'

const readGuests = (): Guest[] => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Guest[]) : []
  } catch {
    return []
  }
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>(readGuests)
  const [filter, setFilter] = useState<'All' | Guest['status']>('All')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', group: '' })

  const sync = (next: Guest[]) => {
    setGuests(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  const visible = useMemo(() => (filter === 'All' ? guests : guests.filter((guest) => guest.status === filter)), [guests, filter])

  const addGuest = () => {
    if (!form.name.trim()) return

    const guest: Guest = {
      id: String(Date.now()),
      name: form.name.trim(),
      email: form.email.trim(),
      group: form.group.trim() || 'Friends',
      status: 'Invited',
    }

    sync([...guests, guest])
    setDialogOpen(false)
    setForm({ name: '', email: '', group: '' })
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

  return (
    <CouplePageShell
      title="Guest List"
      subtitle="Organize attendees with clear status stages and cleaner, lower-stress tracking."
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
      <Stack direction="row" spacing={1} sx={{ mb: 2.2 }}>
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

      <Stack spacing={1}>
        {visible.map((guest) => (
          <Paper key={guest.id} elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>{guest.name}</Typography>
                <Typography sx={{ fontSize: 13, color: '#64748B' }}>{guest.email || 'No email'} • {guest.group}</Typography>
              </Box>
              <Button onClick={() => cycleStatus(guest.id)} size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: 2.2, fontWeight: 700 }}>
                {guest.status}
              </Button>
            </Stack>
          </Paper>
        ))}

        {visible.length === 0 && <Typography sx={{ color: '#64748B' }}>No guests in this filter.</Typography>}
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Guest</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Full name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            <TextField label="Email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            <TextField label="Group" value={form.group} onChange={(event) => setForm((prev) => ({ ...prev, group: event.target.value }))} />
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
