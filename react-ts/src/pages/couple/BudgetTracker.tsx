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
import { Add, CheckCircle, Savings, TrendingUp, WarningAmber } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'

interface Expense {
  id: string
  category: string
  estimated: number
  actual: number
}

const budgetKey = 'itw_total_budget'
const expenseKey = 'itw_budget'

const defaultExpenses: Expense[] = [
  { id: '1', category: 'Venue & Logistics', estimated: 1000000, actual: 1200000 },
  { id: '2', category: 'Catering & Drinks', estimated: 500000, actual: 450000 },
  { id: '3', category: 'Photography & Video', estimated: 250000, actual: 0 },
]

const readExpenses = (): Expense[] => {
  try {
    const raw = localStorage.getItem(expenseKey)
    const stored = raw ? (JSON.parse(raw) as Expense[]) : []
    return stored.length > 0 ? stored : defaultExpenses
  } catch {
    return defaultExpenses
  }
}

const formatCurrency = (value: number) => `N${value.toLocaleString()}`

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
  const overBudget = Math.max(committed - totalBudget, 0)
  const plannedGap = planned - committed
  const statusTone =
    overBudget > 0
      ? {
          label: 'Over budget',
          helper: 'Spend is above the total envelope, so the next decisions should focus on trade-offs.',
          color: '#B91C1C',
          bg: '#FEF2F2',
          icon: <WarningAmber sx={{ color: '#B91C1C' }} />,
        }
      : {
          label: 'In good shape',
          helper: 'You still have room to make vendor choices without the page feeling alarmist.',
          color: '#166534',
          bg: '#F0FDF4',
          icon: <CheckCircle sx={{ color: '#166534' }} />,
        }

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
      subtitle="See the full shape of your wedding spend at a glance, with room for better choices instead of budget panic."
      badge={`Remaining ${formatCurrency(remaining)}`}
      actions={
        <Stack direction="row" spacing={1}>
          <Button
            onClick={() => {
              // Save the total budget to localStorage so it persists across page refreshes
              // This ensures your wedding budget envelope is retained even after closing/reopening
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.2fr 0.95fr' }, gap: 2.5 }}>
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 45%, #FFF7F7 100%)',
              mb: 2.5,
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
              <TextField
                label="Total wedding budget"
                type="number"
                value={totalBudget}
                onChange={(event) => setTotalBudget(Number(event.target.value) || 0)}
                sx={{ maxWidth: 280 }}
              />
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                  <Typography sx={{ fontSize: 13, color: '#64748B', fontWeight: 700 }}>Budget usage</Typography>
                  <Typography sx={{ fontSize: 13, color: overBudget > 0 ? '#B91C1C' : '#0F766E', fontWeight: 800 }}>
                    {Math.round(progress)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 10,
                    borderRadius: 999,
                    bgcolor: '#E5E7EB',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 999,
                      bgcolor: overBudget > 0 ? '#DC2626' : '#00838F',
                    },
                  }}
                />
                <Typography sx={{ fontSize: 13, color: '#64748B', mt: 1.2 }}>
                  {formatCurrency(committed)} committed out of {formatCurrency(totalBudget)}.
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2.5 }}>
            {[
              { label: 'Planned', value: planned, color: '#4338CA', icon: <TrendingUp sx={{ color: '#4338CA' }} />, bg: '#EEF2FF' },
              { label: 'Committed', value: committed, color: '#B42349', icon: <WarningAmber sx={{ color: '#B42349' }} />, bg: '#FFF1F5' },
              { label: 'Remaining', value: remaining, color: '#0F766E', icon: <Savings sx={{ color: '#0F766E' }} />, bg: '#ECFDF5' },
            ].map((stat) => (
              <Paper key={stat.label} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 4, p: 2.1 }}>
                <Stack direction="row" spacing={1.1} alignItems="center" sx={{ mb: 1 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: 2.5, bgcolor: stat.bg, display: 'grid', placeItems: 'center' }}>{stat.icon}</Box>
                  <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>{stat.label}</Typography>
                </Stack>
                <Typography sx={{ fontSize: 25, color: stat.color, fontWeight: 800 }}>{formatCurrency(stat.value)}</Typography>
              </Paper>
            ))}
          </Box>

          <Stack spacing={1.2}>
            {expenses.map((expense) => {
              const categoryProgress = expense.estimated > 0 ? Math.min((expense.actual / expense.estimated) * 100, 100) : 0
              const categoryOver = Math.max(expense.actual - expense.estimated, 0)

              return (
                <Paper key={expense.id} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 4, p: 2.1 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Box sx={{ flex: 1, width: '100%' }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>{expense.category}</Typography>
                        {categoryOver > 0 ? (
                          <Chip label={`+${formatCurrency(categoryOver)}`} size="small" sx={{ bgcolor: '#FEF2F2', color: '#B91C1C', fontWeight: 700 }} />
                        ) : null}
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={categoryProgress}
                        sx={{
                          height: 8,
                          borderRadius: 999,
                          bgcolor: '#E2E8F0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 999,
                            bgcolor: categoryOver > 0 ? '#DC2626' : '#00838F',
                          },
                        }}
                      />
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      <Chip label={`Estimate ${formatCurrency(expense.estimated)}`} sx={{ bgcolor: '#EEF2FF', color: '#4338CA', fontWeight: 700 }} />
                      <Chip label={`Actual ${formatCurrency(expense.actual)}`} sx={{ bgcolor: '#FDE8EE', color: '#B42349', fontWeight: 700 }} />
                    </Stack>
                  </Stack>
                </Paper>
              )
            })}

            {expenses.length === 0 && <Typography sx={{ color: '#64748B' }}>No expenses recorded yet.</Typography>}
          </Stack>
        </Box>

        <Stack spacing={2.5}>
          <Paper elevation={0} sx={{ p: 2.4, borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: statusTone.bg }}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: 2.5, bgcolor: '#fff', display: 'grid', placeItems: 'center' }}>{statusTone.icon}</Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>{statusTone.label}</Typography>
                <Typography sx={{ fontSize: 13, color: statusTone.color, fontWeight: 700 }}>
                  {overBudget > 0 ? `${formatCurrency(overBudget)} above budget` : `${formatCurrency(remaining)} still available`}
                </Typography>
              </Box>
            </Stack>
            <Typography sx={{ fontSize: 14, color: '#475569' }}>{statusTone.helper}</Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 2.4, borderRadius: 4, border: '1px solid #E2E8F0' }}>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0F172A', mb: 1 }}>Budget notes</Typography>
            <Stack spacing={1}>
              {[
                `Planned vs actual difference: ${formatCurrency(plannedGap)}`,
                overBudget > 0 ? 'Trim lower-priority items or renegotiate optional upgrades.' : 'You still have room to absorb a few final planning decisions.',
                'Use this page as a decision board, not just a ledger, so it helps you choose what matters most.',
              ].map((item) => (
                <Typography key={item} sx={{ fontSize: 14, color: '#475569' }}>
                  {item}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Box>

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
