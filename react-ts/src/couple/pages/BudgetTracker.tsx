import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Add, CheckCircle, WarningAmber, EditNote, Save } from '@mui/icons-material'
import CouplePageShell from '@/couple/components/CouplePageShell'
import EditNoteDrawer from '@/couple/components/EditNoteDrawer'
import EditExpenseDrawer from '@/couple/components/drawers/EditExpenseDrawer'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { useFormDialog } from '@/shared/hooks/useFormDialog'
import { formatCurrency } from '@/shared/lib/formatters'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import BudgetSummary from '@/couple/components/budget/BudgetSummary'
import ExpensesList from '@/couple/components/budget/ExpensesList'
import { planningApi, isNetworkError } from '@/shared/lib/api'

interface Expense {
  id: string
  category: string
  estimated: number
  actual: number
}

const defaultExpenses: Expense[] = [
  { id: '1', category: 'Venue & Logistics', estimated: 1000000, actual: 1200000 },
  { id: '2', category: 'Catering & Drinks', estimated: 500000, actual: 450000 },
  { id: '3', category: 'Photography & Video', estimated: 250000, actual: 0 },
]

function mapApiExpense(e: any): Expense {
  const amount = Number(e.amount) || 0
  const committed = e.status === 'committed' || e.status === 'paid'
  return {
    id: e.id,
    category: e.category || e.title || 'Expense',
    estimated: amount,
    actual: committed ? amount : Number(e.actual) || 0,
  }
}

export default function BudgetTracker() {
  const { data: totalBudgetData, save: syncTotalBudget } = useLocalStorage<number>(STORAGE_KEYS.BUDGET_TOTAL, 2500000)
  const { data: expenses, save: syncExpenses } = useLocalStorage<Expense[]>(STORAGE_KEYS.BUDGET_EXPENSES, defaultExpenses)
  const [totalBudget, setTotalBudget] = useState(totalBudgetData)
  const [apiReady, setApiReady] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [noteDrawerOpen, setNoteDrawerOpen] = useState(false)
  const [toast, setToast] = useState('')
  const { form, updateForm, dialogOpen, openDialog, closeDialog, handleSave: saveExpense } = useFormDialog(
    { category: '', estimated: '', actual: '' },
    async (formData) => {
      const estimated = Number(formData.estimated) || 0
      const actual = Number(formData.actual) || 0
      if (apiReady) {
        try {
          const created = await planningApi.createExpense({
            category: formData.category.trim(),
            title: formData.category.trim(),
            amount: actual || estimated,
            status: actual > 0 ? 'committed' : 'planned',
          })
          syncExpenses([...expenses, mapApiExpense(created)])
          return
        } catch {
          /* local */
        }
      }
      const next: Expense = {
        id: String(Date.now()),
        category: formData.category.trim(),
        estimated,
        actual,
      }
      syncExpenses([...expenses, next])
    },
    (formData) => formData.category.trim().length > 0
  )

  useEffect(() => {
    void (async () => {
      try {
        const budget = await planningApi.getBudget()
        if (budget?.totalBudget != null) {
          setTotalBudget(budget.totalBudget)
          syncTotalBudget(budget.totalBudget)
        }
        if (Array.isArray(budget?.expenses) && budget.expenses.length) {
          syncExpenses(budget.expenses.map(mapApiExpense))
        }
        setApiReady(true)
      } catch (error) {
        if (!isNetworkError(error)) console.warn(error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addExpense = () => {
    saveExpense()
  }

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense)
    setEditingId(expense.id)
  }

  const handleExpenseDrawerChange = (field: string, value: any) => {
    if (editingExpense) {
      setEditingExpense({ ...editingExpense, [field]: value })
    }
  }

  const handleSaveExpense = async () => {
    if (editingExpense && editingId) {
      if (apiReady) {
        try {
          await planningApi.updateExpense(editingId, {
            category: editingExpense.category,
            title: editingExpense.category,
            amount: editingExpense.actual || editingExpense.estimated,
            status: editingExpense.actual > 0 ? 'committed' : 'planned',
          })
        } catch {
          /* local */
        }
      }
      const updated = expenses.map((exp) => (exp.id === editingId ? editingExpense : exp))
      syncExpenses(updated)
      setEditingExpense(null)
      setEditingId(null)
    }
  }

  const handleDeleteExpenseFromDrawer = () => {
    if (editingId) {
      setDeleteConfirm(editingId)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (apiReady) {
      try {
        await planningApi.deleteExpense(id)
      } catch {
        /* local */
      }
    }
    syncExpenses(expenses.filter((exp) => exp.id !== id))
    setDeleteConfirm(null)
  }

  const handleSaveBudget = async () => {
    syncTotalBudget(totalBudget)
    syncExpenses(expenses)
    if (apiReady) {
      try {
        await planningApi.updateBudget({ totalBudget })
      } catch {
        /* local */
      }
    }
    setToast('Budget saved')
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

  return (
    <CouplePageShell
      title="Budget"
      subtitle="See the full shape of your wedding spend at a glance, with room for better choices instead of budget panic."
      badge={`Remaining ${formatCurrency(remaining)}`}
      actions={
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Tooltip title="Persists your total budget envelope on this device">
            <Button
              onClick={handleSaveBudget}
              variant="contained"
              startIcon={<Save />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 700,
                bgcolor: '#0F766E',
                px: 2.5,
                '&:hover': { bgcolor: '#0D9488' },
              }}
            >
              Save Budget
            </Button>
          </Tooltip>
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
            sx={{
              bgcolor: '#0B2D31',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 2.5,
              '&:hover': { bgcolor: '#134E4A' },
            }}
          >
            Add Expense
          </Button>
        </Stack>
      }
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.2fr) minmax(0, 0.95fr)' },
          gap: 2.5,
          minWidth: 0,
          width: '100%',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <BudgetSummary
            totalBudget={totalBudget}
            setTotalBudget={setTotalBudget}
            planned={planned}
            committed={committed}
            remaining={remaining}
            progress={progress}
            overBudget={overBudget}
            formatCurrency={formatCurrency}
            onAddExpenseClick={openDialog}
            onNoteClick={() => setNoteDrawerOpen(true)}
            onSaveClick={handleSaveBudget}
          />

          <ExpensesList
            expenses={expenses}
            onEdit={handleEditClick}
            onDelete={(id) => setDeleteConfirm(id)}
            formatCurrency={formatCurrency}
          />
        </Box>

        <Stack spacing={2.5} sx={{ minWidth: 0 }}>
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

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Expense</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Category" value={form.category} onChange={(event) => updateForm({ category: event.target.value })} />
            <TextField label="Estimated" type="number" value={form.estimated} onChange={(event) => updateForm({ estimated: event.target.value })} />
            <TextField label="Actual" type="number" value={form.actual} onChange={(event) => updateForm({ actual: event.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={addExpense} variant="contained" sx={{ textTransform: 'none', bgcolor: '#00838F' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Expense?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteConfirm && handleDeleteExpense(deleteConfirm)}
            variant="contained"
            sx={{ textTransform: 'none', bgcolor: '#B91C1C' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Note Drawer */}
      <EditNoteDrawer open={noteDrawerOpen} onClose={() => setNoteDrawerOpen(false)} />

      {/* Edit Expense Drawer */}
      {editingExpense && (
        <EditExpenseDrawer
          open={editingId !== null}
          onClose={() => {
            setEditingExpense(null)
            setEditingId(null)
          }}
          data={{
            category: editingExpense.category,
            estimated: editingExpense.estimated,
            actual: editingExpense.actual,
          }}
          onChange={handleExpenseDrawerChange}
          onSave={handleSaveExpense}
          onDelete={handleDeleteExpenseFromDrawer}
          title="Edit Expense"
        />
      )}

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setToast('')} sx={{ fontWeight: 600 }}>
          {toast}
        </Alert>
      </Snackbar>
    </CouplePageShell>
  )
}
