import { useState, useMemo } from 'react'
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
  InputAdornment,
  Card,
} from '@mui/material'
import {
  Add,
  Delete,
  CheckCircle,
  Schedule,
  Flag,
  Search,
  ExpandMore,
  ExpandLess,
  CalendarMonth,
  TrendingUp,
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
  color: string
  tasks: Task[]
}

const initialChecklist: ChecklistCategory[] = [
  {
    id: '1',
    title: '12+ Months Before',
    timeframe: '12+ months',
    color: '#8b4557',
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
    color: '#1e6091',
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
    color: '#2d5a27',
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
    color: '#d4af37',
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
    color: '#9c27b0',
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
    color: '#EB1948',
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['1', '2', '3'])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const totalTasks = checklist.reduce((acc, cat) => acc + cat.tasks.length, 0)
  const completedTasks = checklist.reduce((acc, cat) => acc + cat.tasks.filter(t => t.completed).length, 0)
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const highPriorityRemaining = checklist.reduce((acc, cat) => 
    acc + cat.tasks.filter(t => !t.completed && t.priority === 'high').length, 0)
  
  const upcomingTasks = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return checklist.flatMap(cat => 
      cat.tasks.filter(t => {
        const dueDate = new Date(t.dueDate)
        return !t.completed && dueDate >= today && dueDate <= nextWeek
      }).map(t => ({ ...t, categoryTitle: cat.title }))
    )
  }, [checklist])

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

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'completed' && task.completed) ||
        (filterStatus === 'pending' && !task.completed)
      return matchesSearch && matchesPriority && matchesStatus
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      
      <Box sx={{ flex: 1, px: 4, py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 32, fontWeight: 700, color: '#002528' }}>
              Wedding Checklist
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666', mt: 0.5 }}>
              Stay on track with your wedding planning timeline
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              bgcolor: '#EB1948',
              '&:hover': { bgcolor: '#c41438' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: "'Open Sans', sans-serif",
              px: 3,
            }}
          >
            Add Task
          </Button>
        </Box>

        {/* Stats Cards Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e8f5f5', borderRadius: 2 }}>
                <TrendingUp sx={{ color: '#00838F' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>Overall Progress</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 32, fontWeight: 700, color: '#002528', mb: 1 }}>
              {Math.round(progress)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#00838F', borderRadius: 4 } }} 
            />
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 1 }}>
              {completedTasks} of {totalTasks} tasks done
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                <CheckCircle sx={{ color: '#4caf50' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>Completed</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 32, fontWeight: 700, color: '#4caf50' }}>
              {completedTasks}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 1 }}>
              Tasks finished
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#ffebee', borderRadius: 2 }}>
                <Flag sx={{ color: '#EB1948' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>High Priority</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 32, fontWeight: 700, color: '#EB1948' }}>
              {highPriorityRemaining}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 1 }}>
              Tasks need attention
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#fff3e0', borderRadius: 2 }}>
                <CalendarMonth sx={{ color: '#F5A623' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>Due This Week</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 32, fontWeight: 700, color: '#F5A623' }}>
              {upcomingTasks.length}
            </Typography>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', mt: 1 }}>
              Tasks coming up
            </Typography>
          </Paper>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#999' }} /></InputAdornment>,
              sx: { fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white', borderRadius: 2 }
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              displayEmpty
              sx={{ fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white', borderRadius: 2 }}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
              <MenuItem value="medium">Medium Priority</MenuItem>
              <MenuItem value="low">Low Priority</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              displayEmpty
              sx={{ fontFamily: "'Open Sans', sans-serif", backgroundColor: 'white', borderRadius: 2 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Main Content - Two Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 350px' }, gap: 3 }}>
          {/* Checklist Categories Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {checklist.map(category => {
              const filteredTasks = filterTasks(category.tasks)
              const catCompleted = category.tasks.filter(t => t.completed).length
              const catTotal = category.tasks.length
              const catProgress = catTotal > 0 ? (catCompleted / catTotal) * 100 : 0
              const isExpanded = expandedCategories.includes(category.id)

              if (filteredTasks.length === 0 && (searchQuery || filterPriority !== 'all' || filterStatus !== 'all')) {
                return null
              }

              return (
                <Card key={category.id} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                  <Box 
                    onClick={() => toggleCategory(category.id)}
                    sx={{ 
                      display: 'flex', alignItems: 'center', p: 2.5, cursor: 'pointer', bgcolor: 'white',
                      borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none',
                      '&:hover': { bgcolor: '#fafafa' }
                    }}
                  >
                    <Box sx={{ width: 4, height: 40, bgcolor: category.color, borderRadius: 2, mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528' }}>
                        {category.title}
                      </Typography>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                        {catCompleted}/{catTotal} completed
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 80 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={catProgress}
                          sx={{ height: 6, borderRadius: 3, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: catProgress === 100 ? '#4caf50' : category.color } }} 
                        />
                      </Box>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#666', minWidth: 35 }}>
                        {Math.round(catProgress)}%
                      </Typography>
                      {catProgress === 100 && <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />}
                      {isExpanded ? <ExpandLess sx={{ color: '#666' }} /> : <ExpandMore sx={{ color: '#666' }} />}
                    </Box>
                  </Box>

                  {isExpanded && (
                    <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                      {filteredTasks.map(task => (
                        <Box
                          key={task.id}
                          sx={{
                            display: 'flex', alignItems: 'center', py: 1.5, px: 2, mb: 1,
                            bgcolor: task.completed ? '#f5f5f5' : 'white', borderRadius: 2,
                            border: '1px solid', borderColor: task.completed ? '#e0e0e0' : '#eee',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: '#00838F', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
                          }}
                        >
                          <Checkbox
                            checked={task.completed}
                            onChange={() => toggleTask(category.id, task.id)}
                            sx={{ color: getPriorityColor(task.priority), '&.Mui-checked': { color: '#4caf50' } }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#999' : '#002528' }}>
                              {task.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Schedule sx={{ fontSize: 12, color: '#999' }} />
                                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#999' }}>
                                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Typography>
                              </Box>
                              <Chip label={task.priority} size="small" sx={{ height: 18, fontSize: 10, bgcolor: `${getPriorityColor(task.priority)}15`, color: getPriorityColor(task.priority), fontWeight: 600 }} />
                            </Box>
                          </Box>
                          <IconButton size="small" onClick={() => deleteTask(category.id, task.id)} sx={{ color: '#999', '&:hover': { color: '#EB1948' } }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              )
            })}
          </Box>

          {/* Sidebar */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0', position: 'sticky', top: 20 }}>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528', mb: 2 }}>
                📅 Due This Week
              </Typography>
              {upcomingTasks.length === 0 ? (
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666', textAlign: 'center', py: 3 }}>
                  No tasks due this week! 🎉
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {upcomingTasks.slice(0, 6).map(task => (
                    <Box key={task.id} sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2, borderLeft: `3px solid ${getPriorityColor(task.priority)}` }}>
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#002528', mb: 0.5 }}>
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                          {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </Typography>
                        <Chip label={task.priority} size="small" sx={{ height: 16, fontSize: 9, bgcolor: `${getPriorityColor(task.priority)}15`, color: getPriorityColor(task.priority), fontWeight: 600 }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#666', mb: 1.5 }}>
                  Priority Legend
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    { priority: 'high', label: 'High Priority', color: '#EB1948' },
                    { priority: 'medium', label: 'Medium Priority', color: '#F5A623' },
                    { priority: 'low', label: 'Low Priority', color: '#00838F' },
                  ].map(item => (
                    <Box key={item.priority} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Add Task Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600 }}>Add Custom Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField label="Task Title" fullWidth value={newTask.title} onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))} />
            <FormControl fullWidth>
              <InputLabel>Timeline Category</InputLabel>
              <Select value={selectedCategory} label="Timeline Category" onChange={(e) => setSelectedCategory(e.target.value)}>
                {checklist.map(cat => (<MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField label="Due Date" type="date" fullWidth value={newTask.dueDate} onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={newTask.priority} label="Priority" onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}>
                <MenuItem value="high">🔴 High Priority</MenuItem>
                <MenuItem value="medium">🟡 Medium Priority</MenuItem>
                <MenuItem value="low">🟢 Low Priority</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Notes (optional)" fullWidth multiline rows={2} value={newTask.notes} onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setAddDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={addTask} disabled={!newTask.title || !selectedCategory} sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none' }}>
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}
