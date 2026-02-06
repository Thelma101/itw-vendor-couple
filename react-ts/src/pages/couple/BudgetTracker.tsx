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
  Chip,
  InputAdornment,
  Card,
  Tabs,
  Tab,
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
  Receipt,
  Search,
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
  'Venue', 'Catering', 'Photography', 'Videography', 'Florist', 'Music/DJ',
  'Wedding Cake', 'Attire', 'Hair & Makeup', 'Transportation', 'Invitations',
  'Decorations', 'Officiant', 'Rings', 'Favors', 'Gifts', 'Honeymoon', 'Other',
]

const categoryColors: Record<string, string> = {
  'Venue': '#8b4557', 'Catering': '#1e6091', 'Photography': '#2d5a27', 'Videography': '#9c27b0',
  'Florist': '#e91e63', 'Music/DJ': '#ff9800', 'Wedding Cake': '#e8b4b8', 'Attire': '#00bcd4',
  'Hair & Makeup': '#f48fb1', 'Transportation': '#607d8b', 'Invitations': '#d4af37',
  'Decorations': '#4caf50', 'Officiant': '#795548', 'Rings': '#ffd700', 'Favors': '#9e9e9e',
  'Gifts': '#ff5722', 'Honeymoon': '#03a9f4', 'Other': '#00838F',
}

const initialBudget: BudgetItem[] = [
  { id: '1', category: 'Venue', vendor: 'Grand Ballroom', estimated: 500000, actual: 480000, paid: 240000 },
  { id: '2', category: 'Catering', vendor: 'Elite Catering Co', estimated: 350000, actual: 380000, paid: 190000 },
  { id: '3', category: 'Photography', vendor: 'Moments Studio', estimated: 150000, actual: 150000, paid: 75000 },
  { id: '4', category: 'Videography', estimated: 120000, actual: 0, paid: 0 },
  { id: '5', category: 'Florist', vendor: 'Bloom & Petal', estimated: 80000, actual: 95000, paid: 47500 },
  { id: '6', category: 'Music/DJ', estimated: 100000, actual: 0, paid: 0 },
  { id: '7', category: 'Wedding Cake', estimated: 60000, actual: 0, paid: 0 },
  { id: '8', category: 'Attire', estimated: 200000, actual: 180000, paid: 180000 },
  { id: '9', category: 'Hair & Makeup', estimated: 50000, actual: 0, paid: 0 },
  { id: '10', category: 'Transportation', estimated: 80000, actual: 0, paid: 0 },
  { id: '11', category: 'Invitations', estimated: 40000, actual: 35000, paid: 35000 },
  { id: '12', category: 'Decorations', estimated: 100000, actual: 0, paid: 0 },
  { id: '13', category: 'Rings', estimated: 150000, actual: 140000, paid: 140000 },
  { id: '14', category: 'Honeymoon', estimated: 300000, actual: 0, paid: 0 },
]

export default function BudgetTracker() {
  const [totalBudget, setTotalBudget] = useState(2500000)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudget)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState(0)
  const [formData, setFormData] = useState({
    category: '', vendor: '', estimated: '', actual: '', paid: '', notes: '',
  })

  const totalEstimated = budgetItems.reduce((acc, item) => acc + item.estimated, 0)
  const totalActual = budgetItems.reduce((acc, item) => acc + item.actual, 0)
  const totalPaid = budgetItems.reduce((acc, item) => acc + item.paid, 0)
  const remaining = totalBudget - totalActual
  const budgetUsedPercent = (totalActual / totalBudget) * 100
  const paidPercent = totalActual > 0 ? (totalPaid / totalActual) * 100 : 0

  const filteredItems = budgetItems.filter(item => {
    const matchesSearch = item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false
    
    switch (filterTab) {
      case 1: return item.paid >= item.actual && item.actual > 0 // Paid
      case 2: return item.paid > 0 && item.paid < item.actual // Partial
      case 3: return item.actual > 0 && item.paid === 0 // Booked
      case 4: return item.actual === 0 // Pending
      default: return true
    }
  })

  const handleOpenDialog = (item?: BudgetItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        category: item.category, vendor: item.vendor || '',
        estimated: item.estimated.toString(), actual: item.actual.toString(),
        paid: item.paid.toString(), notes: item.notes || '',
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
      category: formData.category, vendor: formData.vendor || undefined,
      estimated: parseFloat(formData.estimated) || 0, actual: parseFloat(formData.actual) || 0,
      paid: parseFloat(formData.paid) || 0, notes: formData.notes || undefined,
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
      return <Chip label="Paid" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontFamily: "'Open Sans', sans-serif", fontSize: 11 }} />
    }
    if (item.paid > 0) {
      return <Chip label="Partial" size="small" sx={{ bgcolor: '#fff3e0', color: '#ef6c00', fontWeight: 600, fontFamily: "'Open Sans', sans-serif", fontSize: 11 }} />
    }
    if (item.actual > 0) {
      return <Chip label="Booked" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600, fontFamily: "'Open Sans', sans-serif", fontSize: 11 }} />
    }
    return <Chip label="Pending" size="small" sx={{ bgcolor: '#f5f5f5', color: '#757575', fontWeight: 600, fontFamily: "'Open Sans', sans-serif", fontSize: 11 }} />
  }

  const getCategoryColor = (category: string) => categoryColors[category] || '#00838F'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      
      <Box sx={{ flex: 1, px: 4, py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 32, fontWeight: 700, color: '#002528' }}>
              Budget Tracker
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666', mt: 0.5 }}>
              Track your wedding expenses and stay within budget
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ bgcolor: '#EB1948', '&:hover': { bgcolor: '#c41438' }, borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Add Expense
          </Button>
        </Box>

        {/* Stats Cards Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 3, mb: 4 }}>
          {/* Total Budget */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e8f5f5', borderRadius: 2 }}>
                <AccountBalance sx={{ color: '#00838F' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Total Budget</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 24, fontWeight: 700, color: '#002528' }}>
              {formatCurrency(totalBudget)}
            </Typography>
            <TextField
              size="small" type="number" value={totalBudget}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
              sx={{ mt: 1.5, width: '100%', '& input': { fontFamily: "'Open Sans', sans-serif", fontSize: 13 } }}
              InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
            />
          </Paper>

          {/* Spent */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: totalActual > totalBudget ? '#ffebee' : '#e8f5e9', borderRadius: 2 }}>
                <TrendingUp sx={{ color: totalActual > totalBudget ? '#EB1948' : '#4caf50' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Spent</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 24, fontWeight: 700, color: totalActual > totalBudget ? '#EB1948' : '#002528' }}>
              {formatCurrency(totalActual)}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 1 }}>
              {Math.round(budgetUsedPercent)}% of budget
            </Typography>
          </Paper>

          {/* Paid */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                <Savings sx={{ color: '#4caf50' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Paid</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 24, fontWeight: 700, color: '#4caf50' }}>
              {formatCurrency(totalPaid)}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 1 }}>
              {Math.round(paidPercent)}% of spent
            </Typography>
          </Paper>

          {/* Outstanding */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#fff3e0', borderRadius: 2 }}>
                <Receipt sx={{ color: '#F5A623' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Outstanding</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 24, fontWeight: 700, color: '#F5A623' }}>
              {formatCurrency(totalActual - totalPaid)}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 1 }}>
              Still to pay
            </Typography>
          </Paper>

          {/* Remaining */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: remaining < 0 ? '#ffebee' : 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: remaining < 0 ? '#ffcdd2' : '#e8f5e9', borderRadius: 2 }}>
                {remaining < 0 ? <Warning sx={{ color: '#EB1948' }} /> : <TrendingDown sx={{ color: '#4caf50' }} />}
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>Remaining</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 24, fontWeight: 700, color: remaining < 0 ? '#EB1948' : '#4caf50' }}>
              {formatCurrency(Math.abs(remaining))}
            </Typography>
            {remaining < 0 && (
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#EB1948', fontWeight: 600, mt: 1 }}>
                Over budget!
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Budget Progress Bar */}
        <Paper sx={{ p: 3, borderRadius: 3, mb: 4, border: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528' }}>
              Budget Usage
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18, color: budgetUsedPercent > 100 ? '#EB1948' : '#00838F' }}>
              {Math.round(budgetUsedPercent)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(budgetUsedPercent, 100)}
            sx={{ height: 16, borderRadius: 8, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: budgetUsedPercent > 100 ? '#EB1948' : budgetUsedPercent > 80 ? '#F5A623' : '#00838F', borderRadius: 8 } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
              Estimated: {formatCurrency(totalEstimated)}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
              {budgetUsedPercent > 100 ? 'Over' : 'Under'} by: {formatCurrency(Math.abs(remaining))}
            </Typography>
          </Box>
        </Paper>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#999' }} /></InputAdornment>,
              sx: { fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white', borderRadius: 2 }
            }}
            sx={{ minWidth: 250 }}
          />
          <Tabs value={filterTab} onChange={(_, v) => setFilterTab(v)} sx={{ bgcolor: 'white', borderRadius: 2, minHeight: 40, '& .MuiTab-root': { minHeight: 40, textTransform: 'none', fontFamily: "'Open Sans', sans-serif", fontSize: 13 } }}>
            <Tab label="All" />
            <Tab label="Paid" />
            <Tab label="Partial" />
            <Tab label="Booked" />
            <Tab label="Pending" />
          </Tabs>
        </Box>

        {/* Budget Items Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }, gap: 2 }}>
          {filteredItems.map((item) => (
            <Card key={item.id} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0', transition: 'all 0.2s', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                {/* Color Bar */}
                <Box sx={{ width: 6, bgcolor: getCategoryColor(item.category) }} />
                
                <Box sx={{ flex: 1, p: 2.5 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528' }}>
                        {item.category}
                      </Typography>
                      {item.vendor && (
                        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 0.5 }}>
                          {item.vendor}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getStatusChip(item)}
                      <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                        <Edit fontSize="small" sx={{ color: '#666' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(item.id)}>
                        <Delete fontSize="small" sx={{ color: '#999' }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Amounts */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                    <Box>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Estimated
                      </Typography>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#002528' }}>
                        {formatCurrency(item.estimated)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Actual
                      </Typography>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: item.actual > item.estimated ? '#EB1948' : '#002528' }}>
                        {item.actual > 0 ? formatCurrency(item.actual) : '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Paid
                      </Typography>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#4caf50' }}>
                        {item.paid > 0 ? formatCurrency(item.paid) : '-'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Progress Bar for this item */}
                  {item.actual > 0 && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                          Payment Progress
                        </Typography>
                        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 600, color: '#666' }}>
                          {Math.round((item.paid / item.actual) * 100)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(item.paid / item.actual) * 100}
                        sx={{ height: 6, borderRadius: 3, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: item.paid >= item.actual ? '#4caf50' : '#F5A623', borderRadius: 3 } }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Summary Footer */}
        <Paper sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: '#002528', border: 'none' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3, textAlign: 'center' }}>
            <Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>Total Estimated</Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 20, fontWeight: 700, color: 'white' }}>{formatCurrency(totalEstimated)}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>Total Spent</Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 20, fontWeight: 700, color: totalActual > totalBudget ? '#ff6b6b' : '#4caf50' }}>{formatCurrency(totalActual)}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>Total Paid</Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#4caf50' }}>{formatCurrency(totalPaid)}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>Budget Remaining</Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 20, fontWeight: 700, color: remaining < 0 ? '#ff6b6b' : '#4caf50' }}>{formatCurrency(remaining)}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600 }}>{editingItem ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={formData.category} label="Category" onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}>
                {defaultCategories.map(cat => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField label="Vendor Name (optional)" fullWidth value={formData.vendor} onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))} />
            <TextField label="Estimated Cost" type="number" fullWidth value={formData.estimated} onChange={(e) => setFormData(prev => ({ ...prev, estimated: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }} />
            <TextField label="Actual Cost" type="number" fullWidth value={formData.actual} onChange={(e) => setFormData(prev => ({ ...prev, actual: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }} />
            <TextField label="Amount Paid" type="number" fullWidth value={formData.paid} onChange={(e) => setFormData(prev => ({ ...prev, paid: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }} />
            <TextField label="Notes (optional)" fullWidth multiline rows={2} value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none' }}>
            {editingItem ? 'Save Changes' : 'Add Expense'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}
