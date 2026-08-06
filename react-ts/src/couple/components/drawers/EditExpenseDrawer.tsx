import { Stack, Box, Drawer, IconButton, TextField, Typography, Button } from '@mui/material'
import { Close } from '@mui/icons-material'

interface EditExpenseDrawerProps {
  open: boolean
  onClose: () => void
  data?: {
    category: string
    estimated: number
    actual: number
  }
  onChange?: (field: string, value: any) => void
  onSave?: () => void
  onDelete?: () => void
  title?: string
}

export default function EditExpenseDrawer({
  open,
  onClose,
  data = { category: '', estimated: 0, actual: 0 },
  onChange,
  onSave,
  onDelete,
  title = 'Edit Expense',
}: EditExpenseDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, borderRadius: 0 } }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2.2, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{title}</Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close drawer">
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 2.2, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Stack spacing={2}>
            <TextField
              label="Category"
              value={data.category}
              onChange={(e) => onChange?.('category', e.target.value)}
              fullWidth
              inputProps={{ 'aria-label': 'Expense category' }}
            />
            <TextField
              label="Estimated"
              type="number"
              value={data.estimated}
              onChange={(e) => onChange?.('estimated', Number(e.target.value))}
              fullWidth
              inputProps={{ 'aria-label': 'Estimated amount' }}
            />
            <TextField
              label="Actual"
              type="number"
              value={data.actual}
              onChange={(e) => onChange?.('actual', Number(e.target.value))}
              fullWidth
              inputProps={{ 'aria-label': 'Actual amount' }}
            />
          </Stack>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ p: 2.2, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1 }}>
          <Button
            onClick={onDelete}
            variant="outlined"
            color="error"
            fullWidth
            sx={{ textTransform: 'none', fontWeight: 700 }}
            aria-label="Delete expense"
          >
            Delete
          </Button>
          <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              fullWidth
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              variant="contained"
              fullWidth
              sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#00838F' }}
              aria-label="Save changes"
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}
