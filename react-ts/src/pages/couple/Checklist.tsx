import { useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Add, Delete, EventAvailable, ExpandMore, Schedule, TaskAlt } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'

interface Task {
  id: string
  title: string
  notes: string
  completed: boolean
  dueDate: string
}

const storageKey = 'itw_checklist'

const defaultTasks: Task[] = [
  { id: '1', title: 'Book a Wedding Venue', notes: 'Ensure it fits 300 guests with indoor and outdoor options.', completed: true, dueDate: '2026-05-10' },
  { id: '2', title: 'Hire a Caterer', notes: 'Tastings arranged for next week.', completed: false, dueDate: '2026-06-15' },
  { id: '3', title: 'Send Invitations', notes: 'Finalize the design first.', completed: false, dueDate: '2026-07-01' }
]

const readTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(storageKey)
    const stored = raw ? (JSON.parse(raw) as Task[]) : []
    return stored.length > 0 ? stored : defaultTasks
  } catch {
    return defaultTasks
  }
}

const formatDate = (value: string) => {
  if (!value) return 'No due date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Checklist() {
  const [tasks, setTasks] = useState<Task[]>(readTasks)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', notes: '', dueDate: '' })

  const save = (next: Task[]) => {
    setTasks(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length
    const upcoming = tasks.filter((task) => !task.completed && task.dueDate).length
    return { total: tasks.length, completed, upcoming, open: tasks.length - completed }
  }, [tasks])

  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  const orderedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
  }, [tasks])

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: String(Date.now()),
      title: newTask.title.trim(),
      notes: newTask.notes.trim(),
      dueDate: newTask.dueDate,
      completed: false,
    }

    save([...tasks, task])
    setNewTask({ title: '', notes: '', dueDate: '' })
    setDialogOpen(false)
  }

  const toggleTask = (id: string) => {
    save(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const removeTask = (id: string) => {
    save(tasks.filter((task) => task.id !== id))
  }

  const getTaskTone = (task: Task) => {
    if (task.completed) {
      return { label: 'Done', bg: '#DCFCE7', color: '#166534' }
    }

    if (!task.dueDate) {
      return { label: 'Flexible', bg: '#F1F5F9', color: '#475569' }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(task.dueDate)
    due.setHours(0, 0, 0, 0)
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / 86400000)

    if (daysLeft < 0) return { label: 'Overdue', bg: '#FEE2E2', color: '#B91C1C' }
    if (daysLeft <= 7) return { label: 'This week', bg: '#FEF3C7', color: '#92400E' }
    return { label: 'Upcoming', bg: '#E0F2FE', color: '#0C4A6E' }
  }

  return (
    <CouplePageShell
      title="Checklist"
      subtitle="Keep the planning flow calm and visible with a tidy list of what is done, what is due next, and what still needs attention."
      badge={`${stats.completed}/${stats.total || 0} complete`}
      actions={
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 700, borderRadius: 6, px: 2.8, '&:hover': { bgcolor: '#006670' } }}
        >
          Add Task
        </Button>
      }
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.3fr 0.9fr' }, gap: 2.5 }}>
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F0FDFA 100%)',
              mb: 2.5,
            }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5, mb: 2.4 }}>
              {[
                { label: 'Completed', value: stats.completed, icon: <TaskAlt sx={{ color: '#0F766E' }} />, bg: '#ECFDF5' },
                { label: 'Still open', value: stats.open, icon: <Schedule sx={{ color: '#B45309' }} />, bg: '#FFF7ED' },
                { label: 'With due dates', value: stats.upcoming, icon: <EventAvailable sx={{ color: '#1D4ED8' }} />, bg: '#EFF6FF' },
              ].map((item) => (
                <Paper key={item.label} elevation={0} sx={{ p: 1.8, borderRadius: 3, bgcolor: item.bg, border: '1px solid rgba(148,163,184,0.12)' }}>
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: '#fff', display: 'grid', placeItems: 'center' }}>{item.icon}</Box>
                    <Typography sx={{ color: '#475569', fontWeight: 700, fontSize: 13 }}>{item.label}</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>{item.value}</Typography>
                </Paper>
              ))}
            </Box>

            <Box sx={{ mb: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                <Typography sx={{ fontWeight: 700, color: '#334155', fontSize: 13 }}>Overall progress</Typography>
                <Typography sx={{ fontWeight: 800, color: '#0F766E', fontSize: 13 }}>{Math.round(progress)}%</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 999,
                  bgcolor: '#E2E8F0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #00838F 0%, #26BDC3 100%)',
                  },
                }}
              />
            </Box>
          </Paper>

          <Stack spacing={1.2}>
            {orderedTasks.length === 0 && <Typography sx={{ color: '#64748B' }}>No tasks yet. Add your first planning task.</Typography>}

            {orderedTasks.map((task) => {
              const tone = getTaskTone(task)

              return (
          <Accordion key={task.id} disableGutters elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '18px !important', bgcolor: '#fff', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2 }}>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ width: '100%' }}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  inputProps={{ 'aria-label': `Mark ${task.title} completed` }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: task.completed ? '#94A3B8' : '#0F172A', textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                  </Typography>
                  <Stack direction="row" spacing={0.8} sx={{ mt: 0.8, flexWrap: 'wrap' }}>
                    <Chip size="small" label={tone.label} sx={{ borderRadius: 2, bgcolor: tone.bg, color: tone.color, fontWeight: 700 }} />
                    <Chip size="small" label={task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'Add a due date'} sx={{ borderRadius: 2, bgcolor: '#F8FAFC', color: '#475569', fontWeight: 700 }} />
                  </Stack>
                </Box>
                <IconButton aria-label={`Delete ${task.title}`} onClick={() => removeTask(task.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
              <Typography sx={{ color: '#64748B', fontSize: 14 }}>{task.notes || 'No notes yet for this task.'}</Typography>
            </AccordionDetails>
          </Accordion>
              )
            })}
          </Stack>
        </Box>

        <Stack spacing={2.5}>
          <Paper elevation={0} sx={{ p: 2.4, borderRadius: 4, border: '1px solid #E2E8F0' }}>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0F172A', mb: 0.8 }}>What to focus on next</Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B', mb: 2 }}>
              Keep the momentum on the items that shape the guest experience first.
            </Typography>
            <Stack spacing={1.1}>
              {orderedTasks.filter((task) => !task.completed).slice(0, 3).map((task) => (
                <Box key={task.id} sx={{ p: 1.6, borderRadius: 3, bgcolor: '#F8FAFC', border: '1px solid #EDF2F7' }}>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A', mb: 0.4 }}>{task.title}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#64748B' }}>{task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No due date yet'}</Typography>
                </Box>
              ))}
              {orderedTasks.filter((task) => !task.completed).length === 0 && (
                <Typography sx={{ color: '#64748B', fontSize: 14 }}>Everything is checked off for now. Add a new task when you are ready.</Typography>
              )}
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2.4, borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF7F8' }}>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0F172A', mb: 0.8 }}>A calmer way to use this page</Typography>
            <Stack spacing={1}>
              {[
                'Keep tasks short and action-based so each item feels finishable.',
                'Use notes for vendor names, quotes, or family follow-ups.',
                'Set due dates only where timing matters to avoid visual clutter.',
              ].map((tip) => (
                <Typography key={tip} sx={{ fontSize: 14, color: '#475569' }}>
                  {tip}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Task title" value={newTask.title} onChange={(event) => setNewTask((prev) => ({ ...prev, title: event.target.value }))} fullWidth />
            <TextField
              label="Due date"
              type="date"
              value={newTask.dueDate}
              onChange={(event) => setNewTask((prev) => ({ ...prev, dueDate: event.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField label="Notes" value={newTask.notes} onChange={(event) => setNewTask((prev) => ({ ...prev, notes: event.target.value }))} multiline rows={3} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={addTask} variant="contained" sx={{ textTransform: 'none', bgcolor: '#00838F' }}>Save Task</Button>
        </DialogActions>
      </Dialog>
    </CouplePageShell>
  )
}
