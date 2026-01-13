import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  LinearProgress,
  Chip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Add,
  ExpandMore,
  Delete,
  CheckCircle,
  Schedule,
  Flag,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface Task {
  id: string
  title: string
  completed: boolean
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  notes?: string
}

interface ChecklistCategory {
  id: string
  title: string
  timeframe: string
  tasks: Task[]
}

const initialChecklist: ChecklistCategory[] = [
  {
    id: '1',
    title: '12+ Months Before',
    timeframe: '12+ months',
    tasks: [
      { id: '1-1', title: 'Set your wedding date', completed: true, dueDate: '2025-01-15', priority: 'high' },
      { id: '1-2', title: 'Determine your budget', completed: true, dueDate: '2025-01-20', priority: 'high' },
      { id: '1-3', title: 'Create guest list draft', completed: false, dueDate: '2025-01-25', priority: 'high' },
      { id: '1-4', title: 'Research and book venue', completed: false, dueDate: '2025-02-01', priority: 'high' },
      { id: '1-5', title: 'Start researching vendors', completed: false, dueDate: '2025-02-15', priority: 'medium' },
    ],
  },
  {
    id: '2',
    title: '9-11 Months Before',
    timeframe: '9-11 months',
    tasks: [
      { id: '2-1', title: 'Book photographer', completed: false, dueDate: '2025-03-01', priority: 'high' },
      { id: '2-2', title: 'Book videographer', completed: false, dueDate: '2025-03-01', priority: 'medium' },
      { id: '2-3', title: 'Book caterer', completed: false, dueDate: '2025-03-15', priority: 'high' },
      { id: '2-4', title: 'Shop for wedding dress', completed: false, dueDate: '2025-04-01', priority: 'high' },
      { id: '2-5', title: 'Book entertainment/DJ/Band', completed: false, dueDate: '2025-04-01', priority: 'medium' },
      { id: '2-6', title: 'Send save-the-dates', completed: false, dueDate: '2025-04-15', priority: 'medium' },
    ],
  },
  {
    id: '3',
    title: '6-8 Months Before',
    timeframe: '6-8 months',
    tasks: [
      { id: '3-1', title: 'Book florist', completed: false, dueDate: '2025-05-01', priority: 'medium' },
      { id: '3-2', title: 'Order wedding cake', completed: false, dueDate: '2025-05-15', priority: 'medium' },
      { id: '3-3', title: 'Book officiant', completed: false, dueDate: '2025-05-20', priority: 'high' },
      { id: '3-4', title: 'Plan honeymoon', completed: false, dueDate: '2025-06-01', priority: 'low' },
      { id: '3-5', title: 'Register for gifts', completed: false, dueDate: '2025-06-15', priority: 'medium' },
    ],
  },
  {
    id: '4',
    title: '3-5 Months Before',
    timeframe: '3-5 months',
    tasks: [
      { id: '4-1', title: 'Book transportation', completed: false, dueDate: '2025-07-01', priority: 'medium' },
      { id: '4-2', title: 'Order invitations', completed: false, dueDate: '2025-07-15', priority: 'high' },
      { id: '4-3', title: 'Plan rehearsal dinner', completed: false, dueDate: '2025-08-01', priority: 'medium' },
      { id: '4-4', title: 'Book hair and makeup', completed: false, dueDate: '2025-08-01', priority: 'medium' },
      { id: '4-5', title: 'Purchase wedding rings', completed: false, dueDate: '2025-08-15', priority: 'high' },
    ],
  },
  {
    id: '5',
    title: '1-2 Months Before',
    timeframe: '1-2 months',
    tasks: [
      { id: '5-1', title: 'Send invitations', completed: false, dueDate: '2025-09-01', priority: 'high' },
      { id: '5-2', title: 'Finalize guest count', completed: false, dueDate: '2025-09-20', priority: 'high' },
      { id: '5-3', title: 'Create seating chart', completed: false, dueDate: '2025-09-25', priority: 'medium' },
      { id: '5-4', title: 'Confirm all vendor details', completed: false, dueDate: '2025-09-28', priority: 'high' },
      { id: '5-5', title: 'Final dress fitting', completed: false, dueDate: '2025-09-30', priority: 'high' },
    ],
  },
  {
    id: '6',
    title: 'Wedding Week',
    timeframe: 'Final week',
    tasks: [
      { id: '6-1', title: 'Confirm timeline with vendors', completed: false, dueDate: '2025-10-01', priority: 'high' },
      { id: '6-2', title: 'Pack for honeymoon', completed: false, dueDate: '2025-10-03', priority: 'medium' },
      { id: '6-3', title: 'Rehearsal dinner', completed: false, dueDate: '2025-10-04', priority: 'high' },
      { id: '6-4', title: 'Get marriage license', completed: false, dueDate: '2025-10-04', priority: 'high' },
      { id: '6-5', title: 'Enjoy your wedding day! 🎉', completed: false, dueDate: '2025-10-05', priority: 'high' },
    ],
  },
]

export default function Checklist() {
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(initialChecklist)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'medium' as Task['priority'], notes: '' })
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['1', '2'])

  const totalTasks = checklist.reduce((acc, cat) => acc + cat.tasks.length, 0)
  const completedTasks = checklist.reduce((acc, cat) => acc + cat.tasks.filter(t => t.completed).length, 0)
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const toggleTask = (categoryId: string, taskId: string) => {
    setChecklist(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, tasks: cat.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
        : cat
    ))
  }

  const deleteTask = (categoryId: string, taskId: string) => {
    setChecklist(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, tasks: cat.tasks.filter(t => t.id !== taskId) }
        : cat
    ))
  }

  const addTask = () => {
    if (!newTask.title || !selectedCategory) return
    const taskId = `${selectedCategory}-${Date.now()}`
    setChecklist(prev => prev.map(cat => 
      cat.id === selectedCategory 
        ? { ...cat, tasks: [...cat.tasks, { ...newTask, id: taskId, completed: false }] }
        : cat
    ))
    setNewTask({ title: '', dueDate: '', priority: 'medium', notes: '' })
    setAddDialogOpen(false)
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#EB1948'
      case 'medium': return '#F5A623'
      case 'low': return '#00838F'
    }
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9' }}>
      <Nav />
      
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="#1a1a1a" gutterBottom>
            Wedding Checklist
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Stay on track with your wedding planning timeline
          </Typography>

          {/* Progress Overview */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: '#00838F' }} />
                <Typography fontWeight={600}>
                  {completedTasks} of {totalTasks} tasks completed
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} color="#00838F">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#00838F',
                  borderRadius: 5,
                }
              }} 
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Chip icon={<Flag sx={{ color: '#EB1948 !important' }} />} label="High Priority" size="small" variant="outlined" />
              <Chip icon={<Flag sx={{ color: '#F5A623 !important' }} />} label="Medium" size="small" variant="outlined" />
              <Chip icon={<Flag sx={{ color: '#00838F !important' }} />} label="Low" size="small" variant="outlined" />
            </Box>
          </Paper>
        </Box>

        {/* Add Task Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
          sx={{
            mb: 3,
            bgcolor: '#EB1948',
            '&:hover': { bgcolor: '#c41438' },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Add Custom Task
        </Button>

        {/* Checklist Categories */}
        {checklist.map(category => {
          const catCompleted = category.tasks.filter(t => t.completed).length
          const catTotal = category.tasks.length
          const catProgress = catTotal > 0 ? (catCompleted / catTotal) * 100 : 0

          return (
            <Accordion 
              key={category.id}
              expanded={expandedCategories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
              sx={{ 
                mb: 2, 
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600}>{category.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {catCompleted}/{catTotal} completed
                    </Typography>
                  </Box>
                  <Box sx={{ width: 100, mr: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={catProgress}
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: catProgress === 100 ? '#4caf50' : '#00838F',
                        }
                      }} 
                    />
                  </Box>
                  {catProgress === 100 && (
                    <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {category.tasks.map(task => (
                  <Box
                    key={task.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                      px: 2,
                      mb: 1,
                      bgcolor: task.completed ? '#f5f5f5' : 'white',
                      borderRadius: 2,
                      border: '1px solid #eee',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#00838F' },
                    }}
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTask(category.id, task.id)}
                      sx={{ 
                        color: getPriorityColor(task.priority),
                        '&.Mui-checked': { color: '#4caf50' },
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        sx={{ 
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                        <Chip 
                          label={task.priority} 
                          size="small" 
                          sx={{ 
                            height: 20,
                            fontSize: 10,
                            bgcolor: `${getPriorityColor(task.priority)}20`,
                            color: getPriorityColor(task.priority),
                            fontWeight: 600,
                          }} 
                        />
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={() => deleteTask(category.id, task.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Box>

      {/* Add Task Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Custom Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Task Title"
              fullWidth
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {checklist.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes (optional)"
              fullWidth
              multiline
              rows={2}
              value={newTask.notes}
              onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={addTask}
            sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' } }}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}
