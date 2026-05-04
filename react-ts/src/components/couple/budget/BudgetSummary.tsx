import { Box, Paper, Stack, Typography, LinearProgress, TextField, Button, Tooltip } from '@mui/material'
import { EditNote, Add, CheckCircle, WarningAmber } from '@mui/icons-material'

interface BudgetSummaryProps {
  totalBudget: number
  setTotalBudget: (value: number) => void
  committed: number
  planned: number
  remaining: number
  progress: number
  overBudget: number
  formatCurrency: (value: number) => string
  onSaveClick: () => void
  onNoteClick: () => void
  onAddExpenseClick: () => void
}

export default function BudgetSummary({
  totalBudget,
  setTotalBudget,
  committed,
  planned,
  progress,
  overBudget,
  formatCurrency,
  onSaveClick,
  onNoteClick,
  onAddExpenseClick,
}: BudgetSummaryProps) {
  const plannedGap = totalBudget - (committed + planned)
  const statusTone =
    overBudget > 0
      ? {
          label: 'Over budget',
          helper: 'Spend is above the total envelope.',
          color: '#B91C1C',
          bg: '#FEF2F2',
          icon: <WarningAmber sx={{ color: '#B91C1C' }} />,
        }
      : {
          label: 'In good shape',
          helper: 'You still have room to make vendor choices.',
          color: '#166534',
          bg: '#F0FDF4',
          icon: <CheckCircle sx={{ color: '#166534' }} />,
        }

  return (
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
            onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
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

      <Paper
        elevation={0}
        sx={{ p: 2.5, borderRadius: 4, border: '1px solid #E2E8F0', backgroundColor: statusTone.bg, mb: 2.5 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {statusTone.icon}
          <Box>
            <Typography sx={{ fontWeight: 700, color: statusTone.color, fontSize: 14 }}>{statusTone.label}</Typography>
            <Typography sx={{ fontSize: 12, color: '#666', mt: 0.3 }}>{statusTone.helper}</Typography>
          </Box>
        </Stack>
      </Paper>

      <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
        <Tooltip title="Saves your total budget envelope">
          <Button variant="outlined" onClick={onSaveClick} sx={{ textTransform: 'none', borderRadius: 6, fontWeight: 700, flex: 1 }}>
            Save Budget
          </Button>
        </Tooltip>
        <Button
          variant="outlined"
          startIcon={<EditNote />}
          onClick={onNoteClick}
          sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 6, flex: 1 }}
        >
          Add Note
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddExpenseClick}
          sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 700, borderRadius: 6, flex: 1, '&:hover': { bgcolor: '#006670' } }}
        >
          Add Expense
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', flex: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 700, mb: 0.5 }}>Planned</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{formatCurrency(planned)}</Typography>
          <Typography sx={{ fontSize: 11, color: '#94A3B8', mt: 1 }}>Across {planned > 0 ? 'categories' : 'no categories'}</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', flex: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 700, mb: 0.5 }}>Remaining Planned</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: plannedGap > 0 ? '#0F766E' : '#B42349' }}>
            {formatCurrency(Math.max(plannedGap, 0))}
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#94A3B8', mt: 1 }}>To commit across budget</Typography>
        </Paper>
      </Stack>
    </Box>
  )
}
