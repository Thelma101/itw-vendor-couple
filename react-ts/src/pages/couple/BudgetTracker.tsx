import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  LinearProgress,
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
  InputAdornment,
} from '@mui/material'
import {
  Add,
  Delete,
  Edit,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Savings,
  Warning,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface BudgetItem {
  id: string
  category: string
  vendor?: string
  estimated: number
  actual: number
  paid: number
  notes?: string
}

const defaultCategories = [
  'Venue',
  'Catering',
  'Photography',
  'Videography',
  'Florist',
  'Music/DJ',
  'Wedding Cake',
  'Attire',
  'Hair & Makeup',
  'Transportation',
  'Invitations',
  'Decorations',
  'Officiant',
  'Rings',
  'Favors',
  'Gifts',
  'Honeymoon',
  'Other',
]

const initialBudget: BudgetItem[] = [
  { id: '1', category: 'Venue', vendor: 'Grand Ballroom', estimated: 15000, actual: 14500, paid: 7250 },
  { id: '2', category: 'Catering', vendor: 'Elite Catering Co', estimated: 8000, actual: 8500, paid: 4000 },
  { id: '3', category: 'Photography', vendor: 'Moments Studio', estimated: 3500, actual: 3500, paid: 1750 },
  { id: '4', category: 'Videography', estimated: 2500, actual: 0, paid: 0 },
  { id: '5', category: 'Florist', vendor: 'Bloom & Petal', estimated: 2000, actual: 2200, paid: 1100 },
  { id: '6', category: 'Music/DJ', estimated: 1500, actual: 0, paid: 0 },
  { id: '7', category: 'Wedding Cake', estimated: 800, actual: 0, paid: 0 },
  { id: '8', category: 'Attire', estimated: 3000, actual: 2800, paid: 2800 },
  { id: '9', category: 'Hair & Makeup', estimated: 500, actual: 0, paid: 0 },
  { id: '10', category: 'Transportation', estimated: 600, actual: 0, paid: 0 },
  { id: '11', category: 'Invitations', estimated: 400, actual: 350, paid: 350 },
  { id: '12', category: 'Decorations', estimated: 1000, actual: 0, paid: 0 },
  { id: '13', category: 'Rings', estimated: 2000, actual: 1800, paid: 1800 },
  { id: '14', category: 'Honeymoon', estimated: 5000, actual: 0, paid: 0 },
]

export default function BudgetTracker() {
  const [totalBudget, setTotalBudget] = useState(50000)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudget)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [formData, setFormData] = useState({
    category: '',
    vendor: '',
    estimated: '',
    actual: '',
    paid: '',
    notes: '',
  })

  const totalEstimated = budgetItems.reduce((acc, item) => acc + item.estimated, 0)
  const totalActual = budgetItems.reduce((acc, item) => acc + item.actual, 0)
  const totalPaid = budgetItems.reduce((acc, item) => acc + item.paid, 0)
  const remaining = totalBudget - totalActual
  const budgetUsedPercent = (totalActual / totalBudget) * 100

  const handleOpenDialog = (item?: BudgetItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        category: item.category,
        vendor: item.vendor || '',
        estimated: item.estimated.toString(),
        actual: item.actual.toString(),
        paid: item.paid.toString(),
        notes: item.notes || '',
      })
    } else {
      setEditingItem(null)
      setFormData({ category: '', vendor: '', estimated: '', actual: '', paid: '', notes: '' })
    }
    setDialogOpen(true)
  }

  const handleSave = () => {
    const newItem: BudgetItem = {
      id: editingItem?.id || Date.now().toString(),
      category: formData.category,
      vendor: formData.vendor || undefined,
      estimated: parseFloat(formData.estimated) || 0,
      actual: parseFloat(formData.actual) || 0,
      paid: parseFloat(formData.paid) || 0,
      notes: formData.notes || undefined,
    }

    if (editingItem) {
      setBudgetItems(prev => prev.map(item => item.id === editingItem.id ? newItem : item))
    } else {
      setBudgetItems(prev => [...prev, newItem])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setBudgetItems(prev => prev.filter(item => item.id !== id))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
  }

  const getStatusChip = (item: BudgetItem) => {
    if (item.paid >= item.actual && item.actual > 0) {
      return <Chip label="Paid" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
    }
    if (item.paid > 0) {
      return <Chip label="Partial" size="small" sx={{ bgcolor: '#fff3e0', color: '#ef6c00', fontWeight: 600 }} />
    }
    if (item.actual > 0) {
      return <Chip label="Booked" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }} />
    }
    return <Chip label="Pending" size="small" sx={{ bgcolor: '#f5f5f5', color: '#757575', fontWeight: 600 }} />
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9' }}>
      <Nav />
      
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="#1a1a1a" gutterBottom>
            Budget Tracker
          </Typography>
          <Typography color="text.secondary">
            Track your wedding expenses and stay within budget
          </Typography>
        </Box>

        {/* Budget Overview Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AccountBalance sx={{ color: '#00838F' }} />
              <Typography variant="body2" color="text.secondary">Total Budget</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700}>{formatCurrency(totalBudget)}</Typography>
            <TextField
              size="small"
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
              sx={{ mt: 1, width: '100%' }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                }
              }}
            />
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUp sx={{ color: totalActual > totalBudget ? '#EB1948' : '#4caf50' }} />
              <Typography variant="body2" color="text.secondary">Spent</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color={totalActual > totalBudget ? '#EB1948' : 'inherit'}>
              {formatCurrency(totalActual)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round(budgetUsedPercent)}% of budget
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Savings sx={{ color: '#00838F' }} />
              <Typography variant="body2" color="text.secondary">Paid</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700}>{formatCurrency(totalPaid)}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatCurrency(totalActual - totalPaid)} remaining
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: remaining < 0 ? '#ffebee' : remaining < totalBudget * 0.1 ? '#fff3e0' : 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {remaining < 0 ? <Warning sx={{ color: '#EB1948' }} /> : <TrendingDown sx={{ color: '#4caf50' }} />}
              <Typography variant="body2" color="text.secondary">Remaining</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color={remaining < 0 ? '#EB1948' : '#4caf50'}>
              {formatCurrency(remaining)}
            </Typography>
            {remaining < 0 && (
              <Typography variant="caption" color="#EB1948" fontWeight={600}>
                Over budget!
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Budget Progress */}
        <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Typography fontWeight={600} gutterBottom>Budget Usage</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(budgetUsedPercent, 100)}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: budgetUsedPercent > 100 ? '#EB1948' : budgetUsedPercent > 80 ? '#F5A623' : '#00838F',
                    borderRadius: 6,
                  },
                }}
              />
            </Box>
            <Typography fontWeight={600} sx={{ minWidth: 50 }}>
              {Math.round(budgetUsedPercent)}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">Estimated: {formatCurrency(totalEstimated)}</Typography>
            <Typography variant="caption" color="text.secondary">Actual: {formatCurrency(totalActual)}</Typography>
          </Box>
        </Paper>

        {/* Add Item Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            mb: 3,
            bgcolor: '#EB1948',
            '&:hover': { bgcolor: '#c41438' },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Add Expense
        </Button>

        {/* Budget Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Vendor</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Estimated</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actual</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Paid</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgetItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{item.category}</TableCell>
                  <TableCell>{item.vendor || '-'}</TableCell>
                  <TableCell align="right">{formatCurrency(item.estimated)}</TableCell>
                  <TableCell align="right" sx={{ color: item.actual > item.estimated ? '#EB1948' : 'inherit' }}>
                    {item.actual > 0 ? formatCurrency(item.actual) : '-'}
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#4caf50', fontWeight: item.paid > 0 ? 600 : 400 }}>
                    {item.paid > 0 ? formatCurrency(item.paid) : '-'}
                  </TableCell>
                  <TableCell>{getStatusChip(item)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(item.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700 }}>TOTAL</TableCell>
                <TableCell></TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(totalEstimated)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: totalActual > totalBudget ? '#EB1948' : 'inherit' }}>
                  {formatCurrency(totalActual)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#4caf50' }}>{formatCurrency(totalPaid)}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {defaultCategories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Vendor Name (optional)"
              fullWidth
              value={formData.vendor}
              onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
            />
            <TextField
              label="Estimated Cost"
              type="number"
              fullWidth
              value={formData.estimated}
              onChange={(e) => setFormData(prev => ({ ...prev, estimated: e.target.value }))}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">₦</InputAdornment> }
              }}
            />
            <TextField
              label="Actual Cost"
              type="number"
              fullWidth
              value={formData.actual}
              onChange={(e) => setFormData(prev => ({ ...prev, actual: e.target.value }))}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">₦</InputAdornment> }
              }}
            />
            <TextField
              label="Amount Paid"
              type="number"
              fullWidth
              value={formData.paid}
              onChange={(e) => setFormData(prev => ({ ...prev, paid: e.target.value }))}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">₦</InputAdornment> }
              }}
            />
            <TextField
              label="Notes (optional)"
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
            sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' } }}
          >
            {editingItem ? 'Save Changes' : 'Add Expense'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}
