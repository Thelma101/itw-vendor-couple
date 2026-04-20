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
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Add, Delete, ExpandMore } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'

interface Task {
  id: string
  title: string
  notes: string
  completed: boolean
  dueDate: string
}

const storageKey = 'itw_checklist'

const readTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
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
    return { total: tasks.length, completed }
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

  return (
    <CouplePageShell
      title="Checklist"
      subtitle="Break planning into clear, manageable tasks with progressive detail and fast completion."
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
      <Stack spacing={1.2}>
        {tasks.length === 0 && <Typography sx={{ color: '#64748B' }}>No tasks yet. Add your first planning task.</Typography>}

        {tasks.map((task) => (
          <Accordion key={task.id} disableGutters elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '14px !important', '&:before': { display: 'none' } }}>
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
                  {task.dueDate && (
                    <Chip size="small" label={`Due ${task.dueDate}`} sx={{ mt: 0.6, borderRadius: 2, bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }} />
                  )}
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
        ))}
      </Stack>

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
