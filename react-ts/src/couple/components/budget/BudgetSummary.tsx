import { Box, Paper, Stack, Typography, LinearProgress, TextField, Button, Tooltip } from '@mui/material'
import { EditNote, Add, CheckCircle, WarningAmber, Save } from '@mui/icons-material'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'

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

const Y_TICKS = [100_000, 200_000, 300_000, 400_000, 500_000, 1_000_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000]

function formatAxis(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
  return `₦${Math.round(value / 1000)}K`
}

export default function BudgetSummary({
  totalBudget,
  setTotalBudget,
  committed,
  planned,
  remaining,
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

  const chartMax = Math.max(5_000_000, totalBudget, planned, committed, 500_000)
  const chartData = [
    { label: 'Envelope', amount: totalBudget },
    { label: 'Planned', amount: planned },
    { label: 'Committed', amount: committed },
    { label: 'Remaining', amount: Math.max(remaining, 0) },
  ]

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
            fullWidth
            sx={{ maxWidth: { xs: '100%', md: 280 } }}
            inputProps={{ step: 100000, min: 100000 }}
            helperText="Scale shown from ₦100K up to ₦5M+"
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  bgcolor: overBudget > 0 ? '#DC2626' : '#0F766E',
                },
              }}
            />
            <Typography sx={{ fontSize: 13, color: '#64748B', mt: 1.2 }}>
              {formatCurrency(committed)} committed out of {formatCurrency(totalBudget)}.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 1.75, md: 2.5 }, borderRadius: 4, border: '1px solid #E2E8F0', mb: 2.5, overflow: 'hidden' }}>
        <Typography sx={{ fontWeight: 800, color: '#0F172A', mb: 1.5 }}>Spend snapshot</Typography>
        <Box sx={{ width: '100%', height: { xs: 220, md: 260 }, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" stroke="#94A3B8" style={{ fontSize: 11 }} interval={0} />
              <YAxis
                stroke="#94A3B8"
                style={{ fontSize: 10 }}
                domain={[0, chartMax]}
                ticks={Y_TICKS.filter((t) => t <= chartMax).filter((t, i) => i % 2 === 0 || t >= 1_000_000)}
                tickFormatter={formatAxis}
                width={48}
              />
              <RechartsTooltip
                formatter={(value) => formatCurrency(Number(value ?? 0))}
                contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0F766E"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0F766E' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        <Typography sx={{ fontSize: 12, color: '#64748B', mt: 1 }}>
          Y-axis: ₦100K → ₦5M (extends above ₦5M when your envelope is higher).
        </Typography>
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

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          mb: 2.5,
          display: { xs: 'none', sm: 'flex' },
          '& .MuiButton-root': { whiteSpace: 'nowrap' },
        }}
      >
        <Tooltip title="Saves your total budget envelope">
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={onSaveClick}
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700, bgcolor: '#0F766E', px: 2.5 }}
          >
            Save Budget
          </Button>
        </Tooltip>
        <Button
          variant="outlined"
          startIcon={<EditNote />}
          onClick={onNoteClick}
          sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, borderColor: '#0F766E', color: '#0F766E', px: 2.5 }}
        >
          Add Note
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddExpenseClick}
          sx={{ bgcolor: '#0B2D31', textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 2.5, '&:hover': { bgcolor: '#134E4A' } }}
        >
          Add Expense
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', flex: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 700, mb: 0.5 }}>Planned</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{formatCurrency(planned)}</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', flex: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 700, mb: 0.5 }}>Remaining Planned</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: plannedGap > 0 ? '#0F766E' : '#B42349' }}>
            {formatCurrency(Math.max(plannedGap, 0))}
          </Typography>
        </Paper>
      </Stack>
    </Box>
  )
}
