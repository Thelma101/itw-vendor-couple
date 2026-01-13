import { useState, useRef } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Add,
  Delete,
  TableRestaurant,
  ZoomIn,
  ZoomOut,
  Save,
  Print,
  Download,
  GridOn,
  Circle,
  Square,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface Guest {
  id: string
  name: string
  tableId: string | null
  group: 'bride' | 'groom' | 'mutual'
  category: 'family' | 'friend' | 'colleague'
  mealPreference?: string
}

interface TableConfig {
  id: string
  name: string
  shape: 'round' | 'rectangle' | 'square'
  capacity: number
  x: number
  y: number
  rotation: number
  guests: string[]
}

const initialGuests: Guest[] = [
  { id: 'g1', name: 'Sarah Johnson', tableId: 't1', group: 'bride', category: 'family' },
  { id: 'g2', name: 'Michael Johnson', tableId: 't1', group: 'bride', category: 'family' },
  { id: 'g3', name: 'David Williams', tableId: 't2', group: 'groom', category: 'friend' },
  { id: 'g4', name: 'Emily Brown', tableId: null, group: 'bride', category: 'friend' },
  { id: 'g5', name: 'James Taylor', tableId: 't1', group: 'groom', category: 'family' },
  { id: 'g6', name: 'Lisa Taylor', tableId: 't1', group: 'groom', category: 'family' },
  { id: 'g7', name: 'Olivia Anderson', tableId: 't3', group: 'mutual', category: 'colleague' },
  { id: 'g8', name: 'Daniel Martinez', tableId: null, group: 'groom', category: 'friend' },
  { id: 'g9', name: 'Sophia Garcia', tableId: 't2', group: 'bride', category: 'family' },
  { id: 'g10', name: 'Ethan Robinson', tableId: null, group: 'mutual', category: 'friend' },
  { id: 'g11', name: 'Amara Okafor', tableId: 't3', group: 'bride', category: 'friend' },
  { id: 'g12', name: 'Chidi Eze', tableId: 't2', group: 'groom', category: 'friend' },
]

const initialTables: TableConfig[] = [
  { id: 't1', name: 'Table 1', shape: 'round', capacity: 8, x: 150, y: 150, rotation: 0, guests: ['g1', 'g2', 'g5', 'g6'] },
  { id: 't2', name: 'Table 2', shape: 'round', capacity: 8, x: 350, y: 150, rotation: 0, guests: ['g3', 'g9', 'g12'] },
  { id: 't3', name: 'Table 3', shape: 'round', capacity: 8, x: 250, y: 300, rotation: 0, guests: ['g7', 'g11'] },
]

export default function SeatingChart() {
  const theme = useTheme()
  useMediaQuery(theme.breakpoints.down('md')) // For responsive awareness
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [tables, setTables] = useState<TableConfig[]>(initialTables)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [draggedGuest, setDraggedGuest] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [tableDialogOpen, setTableDialogOpen] = useState(false)
  const [newTable, setNewTable] = useState<{ name: string; shape: 'round' | 'rectangle' | 'square'; capacity: number }>({ name: '', shape: 'round', capacity: 8 })
  const [showGrid, setShowGrid] = useState(true)

  const unassignedGuests = guests.filter(g => !g.tableId)
  const assignedCount = guests.filter(g => g.tableId).length

  const getGroupColor = (group: Guest['group']) => {
    switch (group) {
      case 'bride': return '#EB1948'
      case 'groom': return '#00838F'
      case 'mutual': return '#9c27b0'
    }
  }

  const handleDragStart = (guestId: string) => {
    setDraggedGuest(guestId)
  }

  const handleDrop = (tableId: string) => {
    if (draggedGuest) {
      const table = tables.find(t => t.id === tableId)
      if (table && table.guests.length < table.capacity) {
        // Remove from old table
        setTables(tables.map(t => ({
          ...t,
          guests: t.guests.filter(g => g !== draggedGuest)
        })))
        
        // Add to new table
        setTables(prev => prev.map(t => 
          t.id === tableId 
            ? { ...t, guests: [...t.guests, draggedGuest] }
            : t
        ))
        
        // Update guest
        setGuests(guests.map(g => 
          g.id === draggedGuest ? { ...g, tableId } : g
        ))
      }
      setDraggedGuest(null)
    }
  }

  const handleDropToUnassigned = () => {
    if (draggedGuest) {
      // Remove from table
      setTables(tables.map(t => ({
        ...t,
        guests: t.guests.filter(g => g !== draggedGuest)
      })))
      
      // Update guest
      setGuests(guests.map(g => 
        g.id === draggedGuest ? { ...g, tableId: null } : g
      ))
      
      setDraggedGuest(null)
    }
  }

  const addTable = () => {
    const newTableConfig: TableConfig = {
      id: `t${Date.now()}`,
      name: newTable.name || `Table ${tables.length + 1}`,
      shape: newTable.shape,
      capacity: newTable.capacity,
      x: 200 + (tables.length * 50) % 300,
      y: 200 + (tables.length * 30) % 200,
      rotation: 0,
      guests: [],
    }
    setTables([...tables, newTableConfig])
    setTableDialogOpen(false)
    setNewTable({ name: '', shape: 'round', capacity: 8 })
  }

  const deleteTable = (tableId: string) => {
    // Unassign all guests from this table
    setGuests(guests.map(g => 
      g.tableId === tableId ? { ...g, tableId: null } : g
    ))
    setTables(tables.filter(t => t.id !== tableId))
    setSelectedTable(null)
  }

  const TableShape = ({ table, isSelected }: { table: TableConfig; isSelected: boolean }) => {
    const tableGuests = guests.filter(g => table.guests.includes(g.id))
    const isFull = tableGuests.length >= table.capacity
    
    const size = table.shape === 'round' ? 120 : table.shape === 'rectangle' ? 160 : 100
    const height = table.shape === 'rectangle' ? 80 : size

    return (
      <Box
        onClick={() => setSelectedTable(table.id)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(table.id)}
        sx={{
          position: 'absolute',
          left: table.x * zoom,
          top: table.y * zoom,
          transform: `scale(${zoom}) rotate(${table.rotation}deg)`,
          transformOrigin: 'center',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* Table Surface */}
        <Box
          sx={{
            width: size,
            height: height,
            borderRadius: table.shape === 'round' ? '50%' : table.shape === 'rectangle' ? 2 : 1,
            bgcolor: isFull ? '#e8f5e9' : 'white',
            border: isSelected ? '3px solid #00838F' : '2px solid #ccc',
            boxShadow: isSelected ? '0 0 10px rgba(0,131,143,0.3)' : 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="body2" fontWeight={600}>{table.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {tableGuests.length}/{table.capacity}
          </Typography>
        </Box>

        {/* Guest Avatars around table */}
        {tableGuests.map((guest, index) => {
          const angle = (index / table.capacity) * 2 * Math.PI - Math.PI / 2
          const radius = (size / 2) + 25
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          
          return (
            <Tooltip key={guest.id} title={guest.name}>
              <Avatar
                draggable
                onDragStart={() => handleDragStart(guest.id)}
                sx={{
                  position: 'absolute',
                  width: 32,
                  height: 32,
                  fontSize: 12,
                  bgcolor: getGroupColor(guest.group),
                  left: size / 2 + x - 16,
                  top: height / 2 + y - 16,
                  cursor: 'grab',
                  border: '2px solid white',
                  boxShadow: 1,
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                {guest.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
            </Tooltip>
          )
        })}
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9' }}>
      <Nav />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, md: 3 }, py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1a1a1a" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
              Seating Chart
            </Typography>
            <Typography color="text.secondary">
              Drag and drop guests to assign them to tables
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<Print />} sx={{ textTransform: 'none' }}>Print</Button>
            <Button variant="outlined" startIcon={<Download />} sx={{ textTransform: 'none' }}>Export</Button>
            <Button variant="contained" startIcon={<Save />} sx={{ bgcolor: '#00838F', textTransform: 'none' }}>Save</Button>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight={700} color="#00838F">{tables.length}</Typography>
            <Typography variant="body2" color="text.secondary">Tables</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight={700} color="#00838F">{guests.length}</Typography>
            <Typography variant="body2" color="text.secondary">Total Guests</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#e8f5e9' }}>
            <Typography variant="h4" fontWeight={700} color="#2e7d32">{assignedCount}</Typography>
            <Typography variant="body2" color="text.secondary">Assigned</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#fff3e0' }}>
            <Typography variant="h4" fontWeight={700} color="#ef6c00">{unassignedGuests.length}</Typography>
            <Typography variant="body2" color="text.secondary">Unassigned</Typography>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          {/* Left Panel - Unassigned Guests */}
          <Paper 
            sx={{ 
              width: { xs: '100%', md: 280 }, 
              p: 2, 
              borderRadius: 3,
              maxHeight: { xs: 200, md: 600 },
              overflow: 'auto',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropToUnassigned}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Unassigned ({unassignedGuests.length})
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              {unassignedGuests.map(guest => (
                <Chip
                  key={guest.id}
                  draggable
                  onDragStart={() => handleDragStart(guest.id)}
                  avatar={
                    <Avatar sx={{ bgcolor: getGroupColor(guest.group) }}>
                      {guest.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  }
                  label={guest.name}
                  sx={{ 
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' },
                    justifyContent: 'flex-start',
                  }}
                />
              ))}
              {unassignedGuests.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  All guests assigned! 🎉
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Center - Canvas */}
          <Paper 
            ref={canvasRef}
            sx={{ 
              flex: 1, 
              minHeight: { xs: 400, md: 600 }, 
              borderRadius: 3, 
              position: 'relative',
              overflow: 'hidden',
              bgcolor: showGrid ? '#fafafa' : 'white',
              backgroundImage: showGrid ? 'radial-gradient(#ddd 1px, transparent 1px)' : 'none',
              backgroundSize: '20px 20px',
            }}
          >
            {/* Toolbar */}
            <Box sx={{ 
              position: 'absolute', 
              top: 8, 
              left: 8, 
              display: 'flex', 
              gap: 1, 
              zIndex: 10,
              flexWrap: 'wrap',
            }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<Add />}
                onClick={() => setTableDialogOpen(true)}
                sx={{ bgcolor: '#EB1948', '&:hover': { bgcolor: '#c41438' }, textTransform: 'none' }}
              >
                Add Table
              </Button>
              <IconButton size="small" onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} sx={{ bgcolor: 'white' }}>
                <ZoomIn fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} sx={{ bgcolor: 'white' }}>
                <ZoomOut fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => setShowGrid(!showGrid)} 
                sx={{ bgcolor: showGrid ? '#00838F' : 'white', color: showGrid ? 'white' : 'inherit' }}
              >
                <GridOn fontSize="small" />
              </IconButton>
            </Box>

            {/* Tables */}
            {tables.map(table => (
              <TableShape 
                key={table.id} 
                table={table} 
                isSelected={selectedTable === table.id}
              />
            ))}

            {tables.length === 0 && (
              <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}>
                <TableRestaurant sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography color="text.secondary">Click "Add Table" to get started</Typography>
              </Box>
            )}
          </Paper>

          {/* Right Panel - Table Details */}
          {selectedTable && (
            <Paper sx={{ width: { xs: '100%', md: 280 }, p: 2, borderRadius: 3 }}>
              {(() => {
                const table = tables.find(t => t.id === selectedTable)
                if (!table) return null
                const tableGuests = guests.filter(g => table.guests.includes(g.id))
                
                return (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>{table.name}</Typography>
                      <IconButton size="small" color="error" onClick={() => deleteTable(table.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        icon={table.shape === 'round' ? <Circle /> : <Square />}
                        label={`${table.shape} • ${table.capacity} seats`}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Guests ({tableGuests.length}/{table.capacity})
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {tableGuests.map(guest => (
                        <Box 
                          key={guest.id}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            p: 1,
                            bgcolor: '#f5f5f5',
                            borderRadius: 1,
                          }}
                        >
                          <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: getGroupColor(guest.group) }}>
                            {guest.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Typography variant="body2" sx={{ flex: 1 }}>{guest.name}</Typography>
                          <Chip 
                            label={guest.group} 
                            size="small" 
                            sx={{ 
                              height: 20, 
                              fontSize: 10,
                              bgcolor: `${getGroupColor(guest.group)}20`,
                              color: getGroupColor(guest.group),
                            }} 
                          />
                        </Box>
                      ))}
                    </Box>
                  </>
                )
              })()}
            </Paper>
          )}
        </Box>

        {/* Legend */}
        <Paper sx={{ p: 2, mt: 3, borderRadius: 3 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>Legend</Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: '#EB1948', fontSize: 10 }}>B</Avatar>
              <Typography variant="body2">Bride's Side</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: '#00838F', fontSize: 10 }}>G</Avatar>
              <Typography variant="body2">Groom's Side</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: '#9c27b0', fontSize: 10 }}>M</Avatar>
              <Typography variant="body2">Mutual</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Add Table Dialog */}
      <Dialog open={tableDialogOpen} onClose={() => setTableDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Table</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Table Name"
              fullWidth
              value={newTable.name}
              onChange={(e) => setNewTable(prev => ({ ...prev, name: e.target.value }))}
              placeholder={`Table ${tables.length + 1}`}
            />
            <FormControl fullWidth>
              <InputLabel>Shape</InputLabel>
              <Select
                value={newTable.shape}
                label="Shape"
                onChange={(e) => setNewTable(prev => ({ ...prev, shape: e.target.value as 'round' | 'rectangle' | 'square' }))}
              >
                <MenuItem value="round">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Circle fontSize="small" /> Round
                  </Box>
                </MenuItem>
                <MenuItem value="rectangle">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Square fontSize="small" /> Rectangle
                  </Box>
                </MenuItem>
                <MenuItem value="square">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Square fontSize="small" /> Square
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Capacity"
              type="number"
              fullWidth
              value={newTable.capacity}
              onChange={(e) => setNewTable(prev => ({ ...prev, capacity: parseInt(e.target.value) || 8 }))}
              slotProps={{ htmlInput: { min: 2, max: 20 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTableDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={addTable}
            sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' } }}
          >
            Add Table
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}
