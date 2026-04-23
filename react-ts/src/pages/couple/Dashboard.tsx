import { useMemo } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import { ExpandMore, ArrowForward, ChecklistRtl, Groups, AccountBalanceWallet, Language, Search, TrendingUp, WarningAmber, CheckCircle, AccessTime } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import CouplePageShell from '@/components/couple/CouplePageShell'
import FloatingNotesButton from '@/components/couple/FloatingNotesButton'

interface ChecklistTask {
  id: string
  title: string
  completed: boolean
  dueDate: string
}

interface Guest {
  name: string
}

interface BudgetItem {
  id: string
  category: string
  actual: number
  estimated: number
}

interface WebsiteState {
  published: boolean
}

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export default function Dashboard() {
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const tasks = readJson<ChecklistTask[]>('itw_checklist', [])
    const guests = readJson<Guest[]>('itw_guestlist', [])
    const budget = readJson<BudgetItem[]>('itw_budget', [])
    const website = readJson<WebsiteState>('itw_website', { published: false })
    const totalBudget = Number(localStorage.getItem('itw_total_budget')) || 2500000

    const totalTasks = tasks.length
    const doneTasks = tasks.filter((task) => task.completed).length
    const upcomingTasks = tasks.filter((task) => !task.completed && new Date(task.dueDate) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)).length
    const spent = budget.reduce((sum, item) => sum + (item.actual || 0), 0)
    const estimated = budget.reduce((sum, item) => sum + (item.estimated || 0), 0)
    const remaining = totalBudget - spent
    const budgetHealthy = spent <= totalBudget * 0.85

    // Budget breakdown for pie chart
    const budgetData = budget.slice(0, 4).map((item) => ({
      name: item.category,
      value: item.actual || 0,
    }))

    // Timeline progress
    const timelineData = [
      { week: 'Week 1', progress: 10 },
      { week: 'Week 2', progress: 25 },
      { week: 'Week 3', progress: 45 },
      { week: 'Week 4', progress: 65 },
      { week: 'This', progress: Math.round((doneTasks / Math.max(totalTasks, 1)) * 100) },
    ]

    // Upcoming tasks
    const upcomingTasksList = tasks
      .filter((task) => !task.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3)

    return {
      totalTasks,
      doneTasks,
      upcomingTasks,
      guestCount: guests.length,
      spent,
      estimated,
      remaining,
      websitePublished: website.published,
      budgetHealthy,
      budgetData,
      timelineData,
      upcomingTasksList,
      totalBudget,
      planningProgress: Math.round((doneTasks / Math.max(totalTasks, 1)) * 100),
    }
  }, [])

  const COLORS = ['#0F766E', '#1E6091', '#B88900', '#2D5A27']

  const cards = [
    { label: 'Checklist Progress', value: `${stats.doneTasks}/${stats.totalTasks || 0}`, sub: 'tasks completed', icon: <ChecklistRtl />, color: '#0F766E' },
    { label: 'Guest List', value: stats.guestCount, sub: 'guests tracked', icon: <Groups />, color: '#1E6091' },
    { label: 'Budget Spend', value: `N${stats.spent.toLocaleString()}`, sub: `of N${stats.totalBudget.toLocaleString()}`, icon: <AccountBalanceWallet />, color: '#B88900' },
    { label: 'Website Status', value: stats.websitePublished ? 'Live' : 'Draft', sub: 'sharing readiness', icon: <Language />, color: stats.websitePublished ? '#2D5A27' : '#B42349' },
  ]

  return (
    <CouplePageShell
      title="Planning Dashboard"
      subtitle="A comprehensive command center for wedding progress, analytics, and quick actions."
      badge="Focus Mode"
      actions={
        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={() => navigate('/couple/search-results')}
          sx={{ bgcolor: '#EB1948', textTransform: 'none', fontWeight: 700, borderRadius: 6, px: 2.8, '&:hover': { bgcolor: '#C41438' } }}
        >
          Hire Vendors
        </Button>
      }
    >
      {/* Key Metrics Cards */}
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
              icon={stats.budgetHealthy ? <CheckCircle sx={{ fontSize: 16 }} /> : <WarningAmber sx={{ fontSize: 16 }} />}
              label={stats.budgetHealthy ? 'On Track' : 'Review'}
              size="small"
              sx={{ ml: 'auto', bgcolor: stats.budgetHealthy ? '#ECFDF5' : '#FEF2F2', color: stats.budgetHealthy ? '#15803D' : '#B42349', fontWeight: 700, fontSize: 12 }}
            />
          </Stack>
          <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.5 }}>Spent vs Budget</Typography>
          <LinearProgress variant="determinate" value={(stats.spent / stats.totalBudget) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: '#EDF2F7', '& .MuiLinearProgress-bar': { bgcolor: stats.spent > stats.totalBudget ? '#B42349' : stats.budgetHealthy ? '#0F766E' : '#F97316' } }} />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Spent</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>N{stats.spent.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Remaining</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: stats.remaining > 0 ? '#0F766E' : '#B42349' }}>N{Math.max(0, stats.remaining).toLocaleString()}</Typography>
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
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F766E', ml: 'auto' }}>{stats.planningProgress}%</Typography>
          </Stack>
          <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.5 }}>Checklist completion</Typography>
          <LinearProgress variant="determinate" value={stats.planningProgress} sx={{ height: 8, borderRadius: 4, bgcolor: '#EDF2F7', '& .MuiLinearProgress-bar': { bgcolor: '#0F766E' } }} />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Completed</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{stats.doneTasks}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Upcoming Due</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: stats.upcomingTasks > 0 ? '#F97316' : '#0F766E' }}>{stats.upcomingTasks}</Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Visualizations Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5, mb: 3 }}>
        {/* Budget Breakdown Pie Chart */}
        <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A', mb: 2 }}>Budget Breakdown</Typography>
          {stats.budgetData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats.budgetData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {stats.budgetData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `N${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 250, display: 'grid', placeItems: 'center' }}>
              <Typography sx={{ color: '#94A3B8' }}>No expense data available</Typography>
            </Box>
          )}
        </Paper>

        {/* Timeline Progress Chart */}
        <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A', mb: 2 }}>Planning Timeline</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="week" stroke="#94A3B8" style={{ fontSize: 12 }} />
              <YAxis stroke="#94A3B8" style={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }} cursor={{ stroke: '#0F766E', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="progress" stroke="#0F766E" strokeWidth={3} dot={{ fill: '#0F766E', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Content Grid - Priorities & Upcoming Tasks */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.25fr 1fr' }, gap: 2.5 }}>
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

        {/* Quick Routes & Actions */}
        <Stack spacing={2}>
          {/* Quick Routes */}
          <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A', mb: 1.2 }}>Quick Routes</Typography>
            <Stack spacing={0.8}>
              {[
                ['Guest List', '/couple/guests'],
                ['Wedding Website', '/couple/wedding-website'],
                ['Day-of Timeline', '/couple/timeline'],
                ['AskWed Assistant', '/couple/askwed'],
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
            {stats.upcomingTasksList.length > 0 ? (
              <Stack spacing={1}>
                {stats.upcomingTasksList.map((task) => (
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

      {/* Floating Notes Button */}
      <FloatingNotesButton />
    </CouplePageShell>
  )
}
