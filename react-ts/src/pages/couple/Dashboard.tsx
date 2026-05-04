import { useMemo } from 'react'
import { Button } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import CouplePageShell from '@/components/couple/CouplePageShell'
import FloatingNoteButton from '@/components/couple/FloatingNoteButton'
import DashboardStats from '@/components/couple/dashboard/DashboardStats'
import DashboardCharts from '@/components/couple/dashboard/DashboardCharts'
import DashboardActions from '@/components/couple/dashboard/DashboardActions'

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
      <DashboardStats doneTasks={stats.doneTasks} totalTasks={stats.totalTasks} guestCount={stats.guestCount} spent={stats.spent} totalBudget={stats.totalBudget} websitePublished={stats.websitePublished} />

      {/* Charts */}
      <DashboardCharts budgetData={stats.budgetData} timelineData={stats.timelineData} />

      {/* Actions - Priorities, Quick Routes, Upcoming Tasks */}
      <DashboardActions budgetHealthy={stats.budgetHealthy} spent={stats.spent} totalBudget={stats.totalBudget} planningProgress={stats.planningProgress} doneTasks={stats.doneTasks} upcomingTasks={stats.upcomingTasks} upcomingTasksList={stats.upcomingTasksList} />

      {/* Floating Notes Button */}
      <FloatingNoteButton variant="speed-dial-dual" />
    </CouplePageShell>
  )
}
