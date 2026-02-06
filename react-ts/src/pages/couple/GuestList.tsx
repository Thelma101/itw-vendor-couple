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
  Chip,
  Avatar,
  Tabs,
  Tab,
  InputAdornment,
  Checkbox,
  Card,
  FormControlLabel,
  Switch,
} from '@mui/material'
import {
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
  PersonAdd,
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
  { id: '9', firstName: 'Aisha', lastName: 'Mohammed', email: 'aisha@email.com', phone: '+234 802 345 6789', group: 'bride', category: 'friend', rsvpStatus: 'attending', plusOne: false, mealPreference: 'halal', tableNumber: 4 },
  { id: '10', firstName: 'Chidi', lastName: 'Okafor', email: 'chidi@email.com', group: 'groom', category: 'family', rsvpStatus: 'attending', plusOne: true, plusOneName: 'Ngozi Okafor', mealPreference: 'standard', tableNumber: 2 },
]

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState(0)
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [formData, setFormData] = useState<Partial<Guest>>({
    firstName: '', lastName: '', email: '', phone: '', group: 'mutual', category: 'friend',
    rsvpStatus: 'pending', plusOne: false, plusOneName: '', mealPreference: undefined, tableNumber: undefined, notes: '',
  })

  // Stats
  const totalGuests = guests.length
  const totalWithPlusOnes = guests.reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0)
  const attending = guests.filter(g => g.rsvpStatus === 'attending').length
  const attendingWithPlusOnes = guests.filter(g => g.rsvpStatus === 'attending').reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0)
  const pending = guests.filter(g => g.rsvpStatus === 'pending').length
  const declined = guests.filter(g => g.rsvpStatus === 'declined').length
  const maybe = guests.filter(g => g.rsvpStatus === 'maybe').length

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
      case 3: return guest.rsvpStatus === 'declined' || guest.rsvpStatus === 'maybe'
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
        firstName: '', lastName: '', email: '', phone: '', group: 'mutual', category: 'friend',
        rsvpStatus: 'pending', plusOne: false, plusOneName: '', mealPreference: undefined, tableNumber: undefined, notes: '',
      })
    }
    setDialogOpen(true)
  }

  const handleSave = () => {
    const newGuest: Guest = {
      id: editingGuest?.id || Date.now().toString(),
      firstName: formData.firstName || '', lastName: formData.lastName || '',
      email: formData.email || undefined, phone: formData.phone || undefined,
      group: formData.group || 'mutual', category: formData.category || 'friend',
      rsvpStatus: formData.rsvpStatus || 'pending', plusOne: formData.plusOne || false,
      plusOneName: formData.plusOneName || undefined, mealPreference: formData.mealPreference,
      tableNumber: formData.tableNumber, notes: formData.notes,
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
    setSelectedGuests(prev => prev.filter(gId => gId !== id))
  }

  const handleSelectAll = () => {
    if (selectedGuests.length === filteredGuests.length) {
      setSelectedGuests([])
    } else {
      setSelectedGuests(filteredGuests.map(g => g.id))
    }
  }

  const handleSelectGuest = (id: string) => {
    setSelectedGuests(prev => 
      prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
    )
  }

  const getStatusColor = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'attending': return { bg: '#e8f5e9', color: '#2e7d32', icon: <CheckCircle sx={{ fontSize: 14 }} /> }
      case 'pending': return { bg: '#fff3e0', color: '#ef6c00', icon: <HelpOutline sx={{ fontSize: 14 }} /> }
      case 'declined': return { bg: '#ffebee', color: '#c62828', icon: <Cancel sx={{ fontSize: 14 }} /> }
      case 'maybe': return { bg: '#e3f2fd', color: '#1565c0', icon: <HelpOutline sx={{ fontSize: 14 }} /> }
    }
  }

  const getGroupColor = (group: Guest['group']) => {
    switch (group) {
      case 'bride': return '#e8b4b8'
      case 'groom': return '#1e6091'
      case 'mutual': return '#9c27b0'
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      
      <Box sx={{ flex: 1, px: 4, py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 32, fontWeight: 700, color: '#002528' }}>
              Guest List
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666', mt: 0.5 }}>
              Manage your wedding guests and track RSVPs
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              sx={{ borderColor: '#00838F', color: '#00838F', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => handleOpenDialog()}
              sx={{ bgcolor: '#EB1948', '&:hover': { bgcolor: '#c41438' }, borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              Add Guest
            </Button>
          </Box>
        </Box>

        {/* Stats Cards Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 3, mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e8f5f5', borderRadius: 2 }}>
                <Group sx={{ color: '#00838F' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Total Invited</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#002528' }}>
              {totalGuests}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              {totalWithPlusOnes} with plus ones
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                <CheckCircle sx={{ color: '#4caf50' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Attending</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#4caf50' }}>
              {attending}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              {attendingWithPlusOnes} total headcount
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#fff3e0', borderRadius: 2 }}>
                <HelpOutline sx={{ color: '#F5A623' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Pending</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#F5A623' }}>
              {pending}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              Awaiting response
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#ffebee', borderRadius: 2 }}>
                <Cancel sx={{ color: '#EB1948' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Declined</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#EB1948' }}>
              {declined}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              Can't make it
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                <LocalDining sx={{ color: '#1565c0' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Maybe</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#1565c0' }}>
              {maybe}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
              Unsure
            </Typography>
          </Paper>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#999' }} /></InputAdornment>,
              sx: { fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white', borderRadius: 2 }
            }}
            sx={{ minWidth: 250 }}
          />
          <Tabs 
            value={filterTab} 
            onChange={(_, v) => setFilterTab(v)} 
            sx={{ 
              bgcolor: 'white', borderRadius: 2, minHeight: 40,
              '& .MuiTab-root': { minHeight: 40, textTransform: 'none', fontFamily: "'Open Sans', sans-serif", fontSize: 13 }
            }}
          >
            <Tab label="All" />
            <Tab label="Attending" />
            <Tab label="Pending" />
            <Tab label="Declined" />
            <Tab label="Bride's Side" />
            <Tab label="Groom's Side" />
          </Tabs>
        </Box>

        {/* Select All */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, px: 1 }}>
          <Checkbox 
            checked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
            indeterminate={selectedGuests.length > 0 && selectedGuests.length < filteredGuests.length}
            onChange={handleSelectAll}
            sx={{ color: '#00838F', '&.Mui-checked': { color: '#00838F' } }}
          />
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>
            {selectedGuests.length > 0 ? `${selectedGuests.length} selected` : `${filteredGuests.length} guests`}
          </Typography>
        </Box>

        {/* Guest Cards Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }, gap: 2 }}>
          {filteredGuests.map((guest) => {
            const statusStyle = getStatusColor(guest.rsvpStatus)
            return (
              <Card key={guest.id} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0', transition: 'all 0.2s', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                  {/* Selection & Color Bar */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fafafa', px: 1, py: 2 }}>
                    <Checkbox 
                      checked={selectedGuests.includes(guest.id)}
                      onChange={() => handleSelectGuest(guest.id)}
                      size="small"
                      sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#00838F' } }}
                    />
                    <Box sx={{ width: 4, flex: 1, mt: 1, bgcolor: getGroupColor(guest.group), borderRadius: 2 }} />
                  </Box>
                  
                  <Box sx={{ flex: 1, p: 2.5 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: getGroupColor(guest.group), width: 44, height: 44, fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16 }}>
                          {getInitials(guest.firstName, guest.lastName)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528' }}>
                            {guest.firstName} {guest.lastName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                            <Chip 
                              label={guest.group === 'bride' ? "Bride's" : guest.group === 'groom' ? "Groom's" : 'Mutual'} 
                              size="small" 
                              sx={{ height: 18, fontSize: 10, bgcolor: `${getGroupColor(guest.group)}20`, color: getGroupColor(guest.group), fontWeight: 600 }} 
                            />
                            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                              {guest.category}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip 
                          icon={statusStyle.icon}
                          label={guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)} 
                          size="small" 
                          sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600, fontFamily: "'Open Sans', sans-serif", fontSize: 11, '& .MuiChip-icon': { color: statusStyle.color } }} 
                        />
                      </Box>
                    </Box>

                    {/* Contact Info */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                      {guest.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email sx={{ fontSize: 14, color: '#999' }} />
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>{guest.email}</Typography>
                        </Box>
                      )}
                      {guest.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone sx={{ fontSize: 14, color: '#999' }} />
                          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>{guest.phone}</Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Details Row */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                      {guest.plusOne && (
                        <Chip 
                          icon={<Person sx={{ fontSize: 14 }} />}
                          label={guest.plusOneName || '+1'} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, borderColor: '#e0e0e0' }} 
                        />
                      )}
                      {guest.mealPreference && (
                        <Chip 
                          icon={<LocalDining sx={{ fontSize: 14 }} />}
                          label={guest.mealPreference} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, borderColor: '#e0e0e0' }} 
                        />
                      )}
                      {guest.tableNumber && (
                        <Chip 
                          label={`Table ${guest.tableNumber}`} 
                          size="small" 
                          sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, bgcolor: '#e8f5f5', color: '#00838F', fontWeight: 600 }} 
                        />
                      )}
                      
                      <Box sx={{ flex: 1 }} />
                      
                      <IconButton size="small" onClick={() => handleOpenDialog(guest)}>
                        <Edit fontSize="small" sx={{ color: '#666' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(guest.id)}>
                        <Delete fontSize="small" sx={{ color: '#999' }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Card>
            )
          })}
        </Box>

        {filteredGuests.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Person sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, color: '#666', mb: 1 }}>
              No guests found
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#999' }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600 }}>
          {editingGuest ? 'Edit Guest' : 'Add Guest'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="First Name" fullWidth value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} />
              <TextField label="Last Name" fullWidth value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Email" type="email" fullWidth value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
              <TextField label="Phone" fullWidth value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Group</InputLabel>
                <Select value={formData.group} label="Group" onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value as Guest['group'] }))}>
                  <MenuItem value="bride">Bride's Side</MenuItem>
                  <MenuItem value="groom">Groom's Side</MenuItem>
                  <MenuItem value="mutual">Mutual</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} label="Category" onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Guest['category'] }))}>
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="friend">Friend</MenuItem>
                  <MenuItem value="colleague">Colleague</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>RSVP Status</InputLabel>
                <Select value={formData.rsvpStatus} label="RSVP Status" onChange={(e) => setFormData(prev => ({ ...prev, rsvpStatus: e.target.value as Guest['rsvpStatus'] }))}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="attending">Attending</MenuItem>
                  <MenuItem value="declined">Declined</MenuItem>
                  <MenuItem value="maybe">Maybe</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Meal Preference</InputLabel>
                <Select value={formData.mealPreference || ''} label="Meal Preference" onChange={(e) => setFormData(prev => ({ ...prev, mealPreference: e.target.value as Guest['mealPreference'] }))}>
                  <MenuItem value="">Not specified</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="vegan">Vegan</MenuItem>
                  <MenuItem value="halal">Halal</MenuItem>
                  <MenuItem value="kosher">Kosher</MenuItem>
                  <MenuItem value="gluten-free">Gluten-free</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={<Switch checked={formData.plusOne} onChange={(e) => setFormData(prev => ({ ...prev, plusOne: e.target.checked }))} />}
                label="Plus One"
                sx={{ '& .MuiFormControlLabel-label': { fontFamily: "'Open Sans', sans-serif", fontSize: 14 } }}
              />
              {formData.plusOne && (
                <TextField label="Plus One Name" fullWidth value={formData.plusOneName} onChange={(e) => setFormData(prev => ({ ...prev, plusOneName: e.target.value }))} />
              )}
            </Box>
            <TextField label="Table Number" type="number" fullWidth value={formData.tableNumber || ''} onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: parseInt(e.target.value) || undefined }))} />
            <TextField label="Notes" fullWidth multiline rows={2} value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!formData.firstName || !formData.lastName} sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none' }}>
            {editingGuest ? 'Save Changes' : 'Add Guest'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}
