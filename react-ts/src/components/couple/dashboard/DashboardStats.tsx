import { Box, Paper, Stack, Typography } from '@mui/material'
import { ChecklistRtl, Groups, AccountBalanceWallet, Language } from '@mui/icons-material'

interface DashboardStatsProps {
  doneTasks: number
  totalTasks: number
  guestCount: number
  spent: number
  totalBudget: number
  websitePublished: boolean
}

export default function DashboardStats({
  doneTasks,
  totalTasks,
  guestCount,
  spent,
  totalBudget,
  websitePublished,
}: DashboardStatsProps) {
  const cards = [
    { label: 'Checklist Progress', value: `${doneTasks}/${totalTasks || 0}`, sub: 'tasks completed', icon: <ChecklistRtl />, color: '#0F766E' },
    { label: 'Guest List', value: guestCount, sub: 'guests tracked', icon: <Groups />, color: '#1E6091' },
    { label: 'Budget Spend', value: `N${spent.toLocaleString()}`, sub: `of N${totalBudget.toLocaleString()}`, icon: <AccountBalanceWallet />, color: '#B88900' },
    { label: 'Website Status', value: websitePublished ? 'Live' : 'Draft', sub: 'sharing readiness', icon: <Language />, color: websitePublished ? '#2D5A27' : '#B42349' },
  ]

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.2, mb: 3 }}>
      {cards.map((card) => (
        <Paper
          key={card.label}
          elevation={0}
          sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px rgba(15,23,42,0.08)' } }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: `${card.color}1A`, color: card.color, display: 'grid', placeItems: 'center' }}>{card.icon}</Box>
            <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>{card.label}</Typography>
          </Stack>
          <Typography sx={{ fontSize: { xs: 20, md: 26 }, fontWeight: 800, color: '#0F172A' }}>{card.value}</Typography>
          <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>{card.sub}</Typography>
        </Paper>
      ))}
    </Box>
  )
}
