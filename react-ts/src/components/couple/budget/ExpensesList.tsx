import { Paper, IconButton, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
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
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  return (
    <>
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
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
                      {diff > 0 ? '+' : ''}{formatCurrency(diff)}
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

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this expense? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (deleteConfirm) {
                onDelete(deleteConfirm)
              }
            }}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
