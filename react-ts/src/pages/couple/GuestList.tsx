import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Tabs,
  Tab,
  InputAdornment,
  Checkbox,
} from '@mui/material'
import {
  Add,
  Delete,
  Edit,
  Search,
  Email,
  Phone,
  Person,
  Group,
  CheckCircle,
  HelpOutline,
  Cancel,
  LocalDining,
  FileDownload,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface Guest {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  group: 'bride' | 'groom' | 'mutual'
  category: 'family' | 'friend' | 'colleague' | 'other'
  rsvpStatus: 'pending' | 'attending' | 'declined' | 'maybe'
  plusOne: boolean
  plusOneName?: string
  mealPreference?: 'standard' | 'vegetarian' | 'vegan' | 'halal' | 'kosher' | 'gluten-free' | 'other'
  tableNumber?: number
  notes?: string
}

const initialGuests: Guest[] = [
  { id: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@email.com', phone: '+234 801 234 5678', group: 'bride', category: 'family', rsvpStatus: 'attending', plusOne: true, plusOneName: 'Michael Johnson', mealPreference: 'standard', tableNumber: 1 },
  { id: '2', firstName: 'David', lastName: 'Williams', email: 'david@email.com', group: 'groom', category: 'friend', rsvpStatus: 'attending', plusOne: false, mealPreference: 'vegetarian', tableNumber: 3 },
  { id: '3', firstName: 'Emily', lastName: 'Brown', email: 'emily@email.com', group: 'bride', category: 'friend', rsvpStatus: 'pending', plusOne: true },
  { id: '4', firstName: 'James', lastName: 'Taylor', group: 'groom', category: 'family', rsvpStatus: 'attending', plusOne: true, plusOneName: 'Lisa Taylor', mealPreference: 'halal', tableNumber: 2 },
  { id: '5', firstName: 'Olivia', lastName: 'Anderson', email: 'olivia@email.com', group: 'mutual', category: 'colleague', rsvpStatus: 'declined', plusOne: false },
  { id: '6', firstName: 'Daniel', lastName: 'Martinez', email: 'daniel@email.com', group: 'groom', category: 'friend', rsvpStatus: 'maybe', plusOne: true },
  { id: '7', firstName: 'Sophia', lastName: 'Garcia', group: 'bride', category: 'family', rsvpStatus: 'attending', plusOne: false, mealPreference: 'vegan', tableNumber: 1 },
  { id: '8', firstName: 'Ethan', lastName: 'Robinson', email: 'ethan@email.com', group: 'mutual', category: 'friend', rsvpStatus: 'pending', plusOne: true },
]

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState(0)
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [formData, setFormData] = useState<Partial<Guest>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    group: 'mutual',
    category: 'friend',
    rsvpStatus: 'pending',
    plusOne: false,
    plusOneName: '',
    mealPreference: undefined,
    tableNumber: undefined,
    notes: '',
  })

  // Stats
  const totalGuests = guests.length
  const totalWithPlusOnes = guests.reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0)
  const attending = guests.filter(g => g.rsvpStatus === 'attending').length
  const attendingWithPlusOnes = guests.filter(g => g.rsvpStatus === 'attending').reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0)
  const pending = guests.filter(g => g.rsvpStatus === 'pending').length
  const declined = guests.filter(g => g.rsvpStatus === 'declined').length

  // Filtered guests
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    switch (filterTab) {
      case 1: return guest.rsvpStatus === 'attending'
      case 2: return guest.rsvpStatus === 'pending'
      case 3: return guest.rsvpStatus === 'declined'
      case 4: return guest.group === 'bride'
      case 5: return guest.group === 'groom'
      default: return true
    }
  })

  const handleOpenDialog = (guest?: Guest) => {
    if (guest) {
      setEditingGuest(guest)
      setFormData({ ...guest })
    } else {
      setEditingGuest(null)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        group: 'mutual',
        category: 'friend',
        rsvpStatus: 'pending',
        plusOne: false,
        plusOneName: '',
        mealPreference: undefined,
        tableNumber: undefined,
        notes: '',
      })
    }
    setDialogOpen(true)
  }

  const handleSave = () => {
    const newGuest: Guest = {
      id: editingGuest?.id || Date.now().toString(),
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email,
      phone: formData.phone,
      group: formData.group || 'mutual',
      category: formData.category || 'friend',
      rsvpStatus: formData.rsvpStatus || 'pending',
      plusOne: formData.plusOne || false,
      plusOneName: formData.plusOneName,
      mealPreference: formData.mealPreference,
      tableNumber: formData.tableNumber,
      notes: formData.notes,
    }

    if (editingGuest) {
      setGuests(prev => prev.map(g => g.id === editingGuest.id ? newGuest : g))
    } else {
      setGuests(prev => [...prev, newGuest])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id))
  }

  const handleBulkDelete = () => {
    setGuests(prev => prev.filter(g => !selectedGuests.includes(g.id)))
    setSelectedGuests([])
  }

  const toggleSelectAll = () => {
    if (selectedGuests.length === filteredGuests.length) {
      setSelectedGuests([])
    } else {
      setSelectedGuests(filteredGuests.map(g => g.id))
    }
  }

  const getRsvpChip = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'attending':
        return <Chip icon={<CheckCircle sx={{ fontSize: 16 }} />} label="Attending" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
      case 'pending':
        return <Chip icon={<HelpOutline sx={{ fontSize: 16 }} />} label="Pending" size="small" sx={{ bgcolor: '#fff3e0', color: '#ef6c00', fontWeight: 600 }} />
      case 'declined':
        return <Chip icon={<Cancel sx={{ fontSize: 16 }} />} label="Declined" size="small" sx={{ bgcolor: '#ffebee', color: '#c62828', fontWeight: 600 }} />
      case 'maybe':
        return <Chip icon={<HelpOutline sx={{ fontSize: 16 }} />} label="Maybe" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }} />
    }
  }

  const getGroupColor = (group: Guest['group']) => {
    switch (group) {
      case 'bride': return '#EB1948'
      case 'groom': return '#00838F'
      case 'mutual': return '#9c27b0'
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9' }}>
      <Nav />
      
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="#1a1a1a" gutterBottom>
            Guest List
          </Typography>
          <Typography color="text.secondary">
            Manage your wedding guests, track RSVPs, and organize seating
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Group sx={{ fontSize: 32, color: '#00838F', mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>{totalWithPlusOnes}</Typography>
            <Typography variant="body2" color="text.secondary">Total Invited</Typography>
            <Typography variant="caption" color="text.secondary">({totalGuests} guests + {totalWithPlusOnes - totalGuests} plus ones)</Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <CheckCircle sx={{ fontSize: 32, color: '#2e7d32', mb: 1 }} />
            <Typography variant="h4" fontWeight={700} color="#2e7d32">{attendingWithPlusOnes}</Typography>
            <Typography variant="body2" color="text.secondary">Attending</Typography>
            <Typography variant="caption" color="#2e7d32">({attending} confirmed)</Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <HelpOutline sx={{ fontSize: 32, color: '#ef6c00', mb: 1 }} />
            <Typography variant="h4" fontWeight={700} color="#ef6c00">{pending}</Typography>
            <Typography variant="body2" color="text.secondary">Awaiting Response</Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: '#ffebee' }}>
            <Cancel sx={{ fontSize: 32, color: '#c62828', mb: 1 }} />
            <Typography variant="h4" fontWeight={700} color="#c62828">{declined}</Typography>
            <Typography variant="body2" color="text.secondary">Declined</Typography>
          </Paper>
        </Box>

        {/* Actions Row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: '#EB1948',
              '&:hover': { bgcolor: '#c41438' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Add Guest
          </Button>

          {selectedGuests.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleBulkDelete}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Delete Selected ({selectedGuests.length})
            </Button>
          )}

          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            sx={{ borderRadius: 2, textTransform: 'none', ml: 'auto' }}
          >
            Export CSV
          </Button>
        </Box>

        {/* Search and Filter */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search guests..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 250 }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                }
              }}
            />
            <Tabs 
              value={filterTab} 
              onChange={(_, v) => setFilterTab(v)}
              sx={{ 
                '& .MuiTab-root': { textTransform: 'none', minWidth: 'auto' },
                '& .Mui-selected': { color: '#00838F' },
                '& .MuiTabs-indicator': { bgcolor: '#00838F' },
              }}
            >
              <Tab label={`All (${totalGuests})`} />
              <Tab label={`Attending (${attending})`} />
              <Tab label={`Pending (${pending})`} />
              <Tab label={`Declined (${declined})`} />
              <Tab label="Bride's Side" />
              <Tab label="Groom's Side" />
            </Tabs>
          </Box>
        </Paper>

        {/* Guest Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                    indeterminate={selectedGuests.length > 0 && selectedGuests.length < filteredGuests.length}
                    onChange={toggleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Guest</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Side</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>RSVP</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Plus One</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Meal</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Table</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id} hover selected={selectedGuests.includes(guest.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedGuests.includes(guest.id)}
                      onChange={() => {
                        setSelectedGuests(prev => 
                          prev.includes(guest.id) 
                            ? prev.filter(id => id !== guest.id)
                            : [...prev, guest.id]
                        )
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: getGroupColor(guest.group), fontSize: 14 }}>
                        {guest.firstName[0]}{guest.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={500}>{guest.firstName} {guest.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">{guest.category}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {guest.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption">{guest.email}</Typography>
                        </Box>
                      )}
                      {guest.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption">{guest.phone}</Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={guest.group === 'bride' ? "Bride's" : guest.group === 'groom' ? "Groom's" : 'Mutual'}
                      size="small"
                      sx={{ 
                        bgcolor: `${getGroupColor(guest.group)}15`,
                        color: getGroupColor(guest.group),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{getRsvpChip(guest.rsvpStatus)}</TableCell>
                  <TableCell>
                    {guest.plusOne ? (
                      <Box>
                        <CheckCircle sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
                        {guest.plusOneName && <Typography variant="caption">{guest.plusOneName}</Typography>}
                      </Box>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {guest.mealPreference ? (
                      <Chip 
                        icon={<LocalDining sx={{ fontSize: 14 }} />}
                        label={guest.mealPreference}
                        size="small"
                        variant="outlined"
                      />
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {guest.tableNumber ? (
                      <Chip label={`Table ${guest.tableNumber}`} size="small" sx={{ bgcolor: '#e3f2fd' }} />
                    ) : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(guest)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(guest.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredGuests.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, mt: 2 }}>
            <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No guests found</Typography>
            <Typography color="text.secondary">Try adjusting your search or filters</Typography>
          </Paper>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add Guest'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
              <TextField
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </Box>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            <TextField
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Side</InputLabel>
                <Select
                  value={formData.group}
                  label="Side"
                  onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value as Guest['group'] }))}
                >
                  <MenuItem value="bride">Bride's Side</MenuItem>
                  <MenuItem value="groom">Groom's Side</MenuItem>
                  <MenuItem value="mutual">Mutual</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Guest['category'] }))}
                >
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="friend">Friend</MenuItem>
                  <MenuItem value="colleague">Colleague</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <FormControl fullWidth>
              <InputLabel>RSVP Status</InputLabel>
              <Select
                value={formData.rsvpStatus}
                label="RSVP Status"
                onChange={(e) => setFormData(prev => ({ ...prev, rsvpStatus: e.target.value as Guest['rsvpStatus'] }))}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="attending">Attending</MenuItem>
                <MenuItem value="declined">Declined</MenuItem>
                <MenuItem value="maybe">Maybe</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Checkbox
                checked={formData.plusOne}
                onChange={(e) => setFormData(prev => ({ ...prev, plusOne: e.target.checked }))}
              />
              <Typography>Has Plus One</Typography>
            </Box>
            {formData.plusOne && (
              <TextField
                label="Plus One Name"
                fullWidth
                value={formData.plusOneName}
                onChange={(e) => setFormData(prev => ({ ...prev, plusOneName: e.target.value }))}
              />
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Meal Preference</InputLabel>
                <Select
                  value={formData.mealPreference || ''}
                  label="Meal Preference"
                  onChange={(e) => setFormData(prev => ({ ...prev, mealPreference: e.target.value as Guest['mealPreference'] }))}
                >
                  <MenuItem value="">Not specified</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="vegan">Vegan</MenuItem>
                  <MenuItem value="halal">Halal</MenuItem>
                  <MenuItem value="kosher">Kosher</MenuItem>
                  <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Table Number"
                type="number"
                fullWidth
                value={formData.tableNumber || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: parseInt(e.target.value) || undefined }))}
              />
            </Box>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.firstName || !formData.lastName}
            sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' } }}
          >
            {editingGuest ? 'Save Changes' : 'Add Guest'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}
