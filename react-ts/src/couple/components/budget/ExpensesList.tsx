import { Paper, IconButton, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Stack } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import React from 'react'

interface Expense {
  id: string
  category: string
  estimated: number
  actual: number
}

interface ExpensesListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
  formatCurrency: (value: number) => string
}

export default function ExpensesList({ expenses, onEdit, onDelete, formatCurrency }: ExpensesListProps) {
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)

  return (
    <>
      {/* Mobile cards */}
      <Stack spacing={1.25} sx={{ display: { xs: 'flex', md: 'none' }, mb: 0 }}>
        {expenses.map((expense) => {
          const diff = expense.actual - expense.estimated
          const diffColor = diff > 0 ? '#B91C1C' : diff < 0 ? '#166534' : '#64748B'
          return (
            <Paper
              key={expense.id}
              elevation={0}
              sx={{ p: 1.75, borderRadius: 3, border: '1px solid #E2E8F0' }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: 15 }}>{expense.category}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>Estimated</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(expense.estimated)}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>Actual</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(expense.actual)}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>Diff</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: diffColor }}>
                        {diff > 0 ? '+' : ''}
                        {formatCurrency(diff)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Stack direction="row" spacing={0.25}>
                  <IconButton size="small" onClick={() => onEdit(expense)} sx={{ color: '#0F766E' }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => setDeleteConfirm(expense.id)} sx={{ color: '#B91C1C' }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          )
        })}
      </Stack>

      {/* Desktop table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: 12 }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748B', fontSize: 12 }}>
                  Estimated
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748B', fontSize: 12 }}>
                  Actual
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748B', fontSize: 12 }}>
                  Diff
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#64748B', fontSize: 12 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => {
                const diff = expense.actual - expense.estimated
                const diffColor = diff > 0 ? '#B91C1C' : diff < 0 ? '#166534' : '#64748B'

                return (
                  <TableRow key={expense.id} sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                    <TableCell sx={{ color: '#0F172A', fontWeight: 600, fontSize: 14 }}>{expense.category}</TableCell>
                    <TableCell align="right" sx={{ color: '#0F172A', fontWeight: 700 }}>
                      {formatCurrency(expense.estimated)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#0F172A', fontWeight: 700 }}>
                      {formatCurrency(expense.actual)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: diffColor, fontWeight: 700 }}>
                      {diff > 0 ? '+' : ''}
                      {formatCurrency(diff)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(expense)}
                        sx={{ color: '#00838F', '&:hover': { backgroundColor: '#E0F7FA' } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteConfirm(expense.id)}
                        sx={{ color: '#B91C1C', '&:hover': { backgroundColor: '#FEF2F2' } }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete expense?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748B' }}>This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (deleteConfirm) onDelete(deleteConfirm)
              setDeleteConfirm(null)
            }}
            sx={{ textTransform: 'none' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
