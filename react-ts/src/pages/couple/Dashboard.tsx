import { useMemo } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Stack, Typography } from '@mui/material'
import { ExpandMore, ArrowForward, ChecklistRtl, Groups, AccountBalanceWallet, Language, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import CouplePageShell from '@/components/couple/CouplePageShell'

interface ChecklistTask {
  completed: boolean
}

interface Guest {
  name: string
}

interface BudgetItem {
  actual: number
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

    const totalTasks = tasks.length
    const doneTasks = tasks.filter((task) => task.completed).length
    const spent = budget.reduce((sum, item) => sum + (item.actual || 0), 0)

    return {
      totalTasks,
      doneTasks,
      guestCount: guests.length,
      spent,
      websitePublished: website.published,
    }
  }, [])

  const cards = [
    { label: 'Checklist Progress', value: `${stats.doneTasks}/${stats.totalTasks || 0}`, sub: 'tasks completed', icon: <ChecklistRtl />, color: '#0F766E' },
    { label: 'Guest List', value: stats.guestCount, sub: 'guests tracked', icon: <Groups />, color: '#1E6091' },
    { label: 'Budget Spend', value: `N${stats.spent.toLocaleString()}`, sub: 'committed amount', icon: <AccountBalanceWallet />, color: '#B88900' },
    { label: 'Website Status', value: stats.websitePublished ? 'Live' : 'Draft', sub: 'sharing readiness', icon: <Language />, color: stats.websitePublished ? '#2D5A27' : '#B42349' },
  ]

  return (
    <CouplePageShell
      title="Planning Dashboard"
      subtitle="A single command center for wedding progress, priorities, and fast actions."
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

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.25fr 1fr' }, gap: 2.5 }}>
        <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0F172A', mb: 1.4 }}>Top Priorities</Typography>
          {[
            { title: 'Finish unchecked planning items', desc: 'Resolve pending tasks to reduce ceremony-day surprises.', path: '/couple/checklist' },
            { title: 'Finalize high-impact vendors', desc: 'Book venue, photo, and catering slots before availability drops.', path: '/couple/search-results' },
            { title: 'Confirm final budget envelope', desc: 'Review committed spend versus planned budget.', path: '/couple/budget' },
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

        <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0F172A', mb: 1.2 }}>Quick Routes</Typography>
          <Stack spacing={1}>
            {[
              ['Guest List', '/couple/guests'],
              ['Wedding Website', '/couple/website'],
              ['Day-of Timeline', '/couple/timeline'],
              ['AskWed Assistant', '/couple/askwed'],
            ].map(([label, path]) => (
              <Button key={label} onClick={() => navigate(path)} variant="outlined" endIcon={<ArrowForward />} sx={{ justifyContent: 'space-between', textTransform: 'none', borderRadius: 2.5, borderColor: '#D1E8EB', color: '#334155', fontWeight: 700, py: 1 }}>
                {label}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Box>
    </CouplePageShell>
  )
}
