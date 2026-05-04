import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Add, CheckCircle, WarningAmber, EditNote } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'
import EditNoteDrawer from '@/components/couple/EditNoteDrawer'
import EditExpenseDrawer from '@/components/couple/drawers/EditExpenseDrawer'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useFormDialog } from '@/hooks/useFormDialog'
import { formatCurrency } from '@/lib/formatters'
import { STORAGE_KEYS } from '@/lib/constants'
import BudgetSummary from '@/components/couple/budget/BudgetSummary'
import ExpensesList from '@/components/couple/budget/ExpensesList'

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

export default function BudgetTracker() {
  const { data: totalBudgetData } = useLocalStorage<number>(STORAGE_KEYS.BUDGET_TOTAL, 2500000)
  const { data: expenses, save: syncExpenses } = useLocalStorage<Expense[]>(STORAGE_KEYS.BUDGET_EXPENSES, defaultExpenses)
  const [totalBudget, setTotalBudget] = useState(totalBudgetData)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [noteDrawerOpen, setNoteDrawerOpen] = useState(false)
  const { form, updateForm, dialogOpen, openDialog, closeDialog, handleSave: saveExpense } = useFormDialog(
    { category: '', estimated: '', actual: '' },
    (formData) => {
      const next: Expense = {
        id: String(Date.now()),
        category: formData.category.trim(),
        estimated: Number(formData.estimated) || 0,
        actual: Number(formData.actual) || 0,
      }
      syncExpenses([...expenses, next])
    },
    (formData) => formData.category.trim().length > 0
  )

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

  const handleSaveExpense = () => {
    if (editingExpense && editingId) {
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

  const handleDeleteExpense = (id: string) => {
    syncExpenses(expenses.filter(exp => exp.id !== id))
    setDeleteConfirm(null)
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
        <Stack direction="row" spacing={1}>
          <Tooltip title="Saves your total budget envelope so it persists across sessions">
            <Button
              onClick={() => {
                localStorage.setItem(STORAGE_KEYS.BUDGET_TOTAL, String(totalBudget))
              }}
              variant="outlined"
              sx={{ textTransform: 'none', borderRadius: 6, fontWeight: 700 }}
            >
              Save Budget
            </Button>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<EditNote />}
            onClick={() => setNoteDrawerOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 6 }}
          >
            Add Note
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openDialog}
            sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 700, borderRadius: 6, '&:hover': { bgcolor: '#006670' } }}
          >
            Add Expense
          </Button>
        </Stack>
      }
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.2fr 0.95fr' }, gap: 2.5 }}>
        <Box>
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
            onSaveClick={() => {}}
          />

          <ExpensesList
            expenses={expenses}
            onEdit={handleEditClick}
            onDelete={(id) => setDeleteConfirm(id)}
            formatCurrency={formatCurrency}
          />
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
    </CouplePageShell>
  )
}
