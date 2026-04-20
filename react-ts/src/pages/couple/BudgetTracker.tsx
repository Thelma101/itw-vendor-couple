import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'

interface Expense {
  id: string
  category: string
  estimated: number
  actual: number
}

const budgetKey = 'itw_total_budget'
const expenseKey = 'itw_budget'

const readExpenses = (): Expense[] => {
  try {
    const raw = localStorage.getItem(expenseKey)
    return raw ? (JSON.parse(raw) as Expense[]) : []
  } catch {
    return []
  }
}

export default function BudgetTracker() {
  const [totalBudget, setTotalBudget] = useState(Number(localStorage.getItem(budgetKey)) || 2500000)
  const [expenses, setExpenses] = useState<Expense[]>(readExpenses)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ category: '', estimated: '', actual: '' })

  const syncExpenses = (next: Expense[]) => {
    setExpenses(next)
    localStorage.setItem(expenseKey, JSON.stringify(next))
  }

  const committed = useMemo(() => expenses.reduce((sum, item) => sum + item.actual, 0), [expenses])
  const planned = useMemo(() => expenses.reduce((sum, item) => sum + item.estimated, 0), [expenses])
  const remaining = Math.max(totalBudget - committed, 0)
  const progress = totalBudget > 0 ? Math.min((committed / totalBudget) * 100, 100) : 0

  const addExpense = () => {
    if (!form.category.trim()) return
    const next: Expense = {
      id: String(Date.now()),
      category: form.category.trim(),
      estimated: Number(form.estimated) || 0,
      actual: Number(form.actual) || 0,
    }
    syncExpenses([...expenses, next])
    setForm({ category: '', estimated: '', actual: '' })
    setDialogOpen(false)
  }

  return (
    <CouplePageShell
      title="Budget"
      subtitle="Track estimates, committed spend, and remaining funds with instant clarity."
      badge={`Remaining N${remaining.toLocaleString()}`}
      actions={
        <Stack direction="row" spacing={1}>
          <Button
            onClick={() => {
              localStorage.setItem(budgetKey, String(totalBudget))
            }}
            variant="outlined"
            sx={{ textTransform: 'none', borderRadius: 6, fontWeight: 700 }}
          >
            Save Budget
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 700, borderRadius: 6, '&:hover': { bgcolor: '#006670' } }}
          >
            Add Expense
          </Button>
        </Stack>
      }
    >
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', mb: 2.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
            label="Total wedding budget"
            type="number"
            value={totalBudget}
            onChange={(event) => setTotalBudget(Number(event.target.value) || 0)}
            sx={{ maxWidth: 280 }}
          />
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.6 }}>
              <Typography sx={{ fontSize: 13, color: '#64748B', fontWeight: 700 }}>Budget Usage</Typography>
              <Typography sx={{ fontSize: 13, color: '#0F766E', fontWeight: 800 }}>{Math.round(progress)}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 8, bgcolor: '#E5E7EB', '& .MuiLinearProgress-bar': { bgcolor: '#00838F' } }} />
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2.5 }}>
        {[
          { label: 'Planned', value: planned, color: '#4338CA' },
          { label: 'Committed', value: committed, color: '#B42349' },
          { label: 'Remaining', value: remaining, color: '#0F766E' },
        ].map((stat) => (
          <Paper key={stat.label} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>{stat.label}</Typography>
            <Typography sx={{ fontSize: 24, color: stat.color, fontWeight: 800 }}>N{stat.value.toLocaleString()}</Typography>
          </Paper>
        ))}
      </Box>

      <Stack spacing={1}>
        {expenses.map((expense) => (
          <Paper key={expense.id} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>{expense.category}</Typography>
              <Stack direction="row" spacing={1}>
                <Chip label={`Est: N${expense.estimated.toLocaleString()}`} sx={{ bgcolor: '#EEF2FF', color: '#4338CA', fontWeight: 700 }} />
                <Chip label={`Act: N${expense.actual.toLocaleString()}`} sx={{ bgcolor: '#FDE8EE', color: '#B42349', fontWeight: 700 }} />
              </Stack>
            </Stack>
          </Paper>
        ))}

        {expenses.length === 0 && <Typography sx={{ color: '#64748B' }}>No expenses recorded yet.</Typography>}
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Expense</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Category" value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} />
            <TextField label="Estimated" type="number" value={form.estimated} onChange={(event) => setForm((prev) => ({ ...prev, estimated: event.target.value }))} />
            <TextField label="Actual" type="number" value={form.actual} onChange={(event) => setForm((prev) => ({ ...prev, actual: event.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={addExpense} variant="contained" sx={{ textTransform: 'none', bgcolor: '#00838F' }}>Save</Button>
        </DialogActions>
      </Dialog>
    </CouplePageShell>
  )
}
