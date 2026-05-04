import { Box, Paper, Stack, Typography, LinearProgress, Chip, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material'
import { TrendingUp, CheckCircle, WarningAmber, ExpandMore, ArrowForward, AccessTime } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface DashboardActionsProps {
  budgetHealthy: boolean
  spent: number
  totalBudget: number
  planningProgress: number
  doneTasks: number
  upcomingTasks: number
  upcomingTasksList: Array<{ id: string; title: string; dueDate: string }>
}

export default function DashboardActions({
  budgetHealthy,
  spent,
  totalBudget,
  planningProgress,
  doneTasks,
  upcomingTasks,
  upcomingTasksList,
}: DashboardActionsProps) {
  const navigate = useNavigate()
  const remaining = totalBudget - spent

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.25fr 1fr' }, gap: 2.5 }}>
      {/* Main Left Section */}
      <Box>
        {/* Planning Health & Budget Status */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 3 }}>
          {/* Budget Health Card */}
          <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6091', display: 'grid', placeItems: 'center' }}>
                <TrendingUp fontSize="small" />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Budget Health</Typography>
              <Chip
                icon={budgetHealthy ? <CheckCircle sx={{ fontSize: 16 }} /> : <WarningAmber sx={{ fontSize: 16 }} />}
                label={budgetHealthy ? 'On Track' : 'Review'}
                size="small"
                sx={{ ml: 'auto', bgcolor: budgetHealthy ? '#ECFDF5' : '#FEF2F2', color: budgetHealthy ? '#15803D' : '#B42349', fontWeight: 700, fontSize: 12 }}
              />
            </Stack>
            <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.5 }}>Spent vs Budget</Typography>
            <LinearProgress variant="determinate" value={(spent / totalBudget) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: '#EDF2F7', '& .MuiLinearProgress-bar': { bgcolor: spent > totalBudget ? '#B42349' : budgetHealthy ? '#0F766E' : '#F97316' } }} />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Spent</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>N{spent.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Remaining</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: remaining > 0 ? '#0F766E' : '#B42349' }}>N{Math.max(0, remaining).toLocaleString()}</Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Planning Progress Card */}
          <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 2, bgcolor: '#F0FDF4', color: '#2D5A27', display: 'grid', placeItems: 'center' }}>
                <CheckCircle fontSize="small" />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Planning Progress</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F766E', ml: 'auto' }}>{planningProgress}%</Typography>
            </Stack>
            <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.5 }}>Checklist completion</Typography>
            <LinearProgress variant="determinate" value={planningProgress} sx={{ height: 8, borderRadius: 4, bgcolor: '#EDF2F7', '& .MuiLinearProgress-bar': { bgcolor: '#0F766E' } }} />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Completed</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{doneTasks}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Upcoming Due</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: upcomingTasks > 0 ? '#F97316' : '#0F766E' }}>{upcomingTasks}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Top Priorities */}
        <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0F172A', mb: 1.4 }}>Top Priorities</Typography>
          {[
            { title: 'Finish unchecked planning items', desc: 'Resolve pending tasks to reduce ceremony-day surprises.', path: '/couple/checklist', icon: '✓' },
            { title: 'Finalize high-impact vendors', desc: 'Book venue, photo, and catering slots before availability drops.', path: '/couple/search-results', icon: '🔍' },
            { title: 'Confirm final budget envelope', desc: 'Review committed spend versus planned budget.', path: '/couple/budget', icon: '💰' },
          ].map((item) => (
            <Accordion key={item.title} elevation={0} disableGutters sx={{ border: '1px solid #EDF2F7', borderRadius: '12px !important', mb: 1, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 1.5, py: 0.2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, px: 1.5, pb: 1.5 }}>
                <Typography sx={{ fontSize: 13, color: '#64748B', mb: 1.2 }}>{item.desc}</Typography>
                <Button onClick={() => navigate(item.path)} size="small" endIcon={<ArrowForward sx={{ fontSize: 14 }} />} sx={{ textTransform: 'none', fontWeight: 700, color: '#0F766E' }}>
                  Open
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>

      {/* Right Section - Quick Routes & Upcoming Tasks */}
      <Stack spacing={2}>
        {/* Quick Routes */}
        <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A', mb: 1.2 }}>Quick Routes</Typography>
          <Stack spacing={0.8}>
            {[
              ['Guest List', '/couple/guests'],

            ].map(([label, path]) => (
              <Button key={label} onClick={() => navigate(path)} variant="outlined" endIcon={<ArrowForward sx={{ fontSize: 12 }} />} sx={{ justifyContent: 'space-between', textTransform: 'none', borderRadius: 2.5, borderColor: '#D1E8EB', color: '#334155', fontWeight: 700, py: 0.8, fontSize: 13 }}>
                {label}
              </Button>
            ))}
          </Stack>
        </Paper>

        {/* Upcoming Tasks */}
        <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A', mb: 1.2 }}>Upcoming Tasks</Typography>
          {upcomingTasksList.length > 0 ? (
            <Stack spacing={1}>
              {upcomingTasksList.map((task) => (
                <Box key={task.id} sx={{ p: 1, borderRadius: 2, bgcolor: '#F8FAFC', border: '1px solid #EDF2F7' }}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <AccessTime sx={{ fontSize: 16, color: '#F97316', mt: 0.2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{task.title}</Typography>
                      <Typography sx={{ fontSize: 11, color: '#64748B', mt: 0.2 }}>Due: {new Date(task.dueDate).toLocaleDateString()}</Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography sx={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', py: 2 }}>No upcoming tasks</Typography>
          )}
        </Paper>
      </Stack>
    </Box>
  )
}
