import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  Typography,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useMediaQuery,
} from '@mui/material'
import { Edit, ViewAgenda, Add } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useNotes } from '@/shared/contexts/NotesContext'
import { useLocation } from 'react-router-dom'
import NotesDrawer from './NotesDrawer'
import EditNoteDrawer from './EditNoteDrawer'

export type FloatingNoteButtonVariant = 'dialog' | 'speed-dial-dual' | 'draggable' | 'speed-dial-view' | 'default'

interface FloatingNoteButtonProps {
  variant?: FloatingNoteButtonVariant
}

/**
 * Unified floating note button component supporting multiple variants
 * - 'dialog': FAB with quick note dialog (dashboard, notes page)
 * - 'speed-dial-dual': SpeedDial with Add/View options
 * - 'draggable': Draggable FAB that can be moved around
 * - 'speed-dial-view': SpeedDial with just View option
 * - 'default': Standard FAB (fallback)
 */
export default function FloatingNoteButton({ variant = 'dialog' }: FloatingNoteButtonProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const location = useLocation()
  const isDashboard = location.pathname === '/couple/dashboard'
  const pageName = location.pathname.split('/').pop() || 'page'

  // State management
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editNoteDrawerOpen, setEditNoteDrawerOpen] = useState(false)
  const [viewNotesDrawerOpen, setViewNotesDrawerOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 32, y: 32 })

  const { currentNote, setCurrentNote, addNote } = useNotes()

  // Handlers
  const handleQuickNoteSave = () => {
    addNote(currentNote, pageName)
    setDialogOpen(false)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    const maxX = window.innerWidth - 80
    const maxY = window.innerHeight - 80

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Render variants
  if (variant === 'dialog') {
    if (!isDashboard) return null

    return (
      <>
        <Fab
          onClick={() => setDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            bgcolor: '#0F766E',
            color: '#FFFFFF',
            width: 56,
            height: 56,
            '&:hover': {
              bgcolor: '#006670',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            zIndex: 999,
            boxShadow: '0 8px 24px rgba(15, 118, 110, 0.3)',
          }}
          aria-label="Add note"
        >
          <Edit />
        </Fab>

        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ fontWeight: 800, fontSize: 16, color: '#0F172A', pb: 1 }}>Quick Note</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.5 }}>Page: {pageName.replace(/-/g, ' ').toUpperCase()}</Typography>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={4}
              placeholder="Jot down your thoughts, reminders, or ideas..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: 13,
                  fontFamily: 'inherit',
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                onClick={() => setViewNotesDrawerOpen(true)}
                variant="text"
                startIcon={<ViewAgenda />}
                sx={{ textTransform: 'none', fontWeight: 700, color: '#0F766E', fontSize: 12 }}
              >
                View all notes
              </Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleDialogClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                  Cancel
                </Button>
                <Button onClick={handleQuickNoteSave} variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E' }} disabled={!currentNote.trim()}>
                  Save Note
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        <NotesDrawer open={viewNotesDrawerOpen} onClose={() => setViewNotesDrawerOpen(false)} />
      </>
    )
  }

  if (variant === 'speed-dial-dual') {
    return (
      <>
        <SpeedDial
          ariaLabel="Notes menu"
          sx={{
            position: 'fixed',
            bottom: isMobile ? 88 : 32,
            right: isMobile ? 16 : 32,
            zIndex: 999,
          }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<Add />}
            tooltipTitle="Add Note"
            onClick={() => setEditNoteDrawerOpen(true)}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            icon={<ViewAgenda />}
            tooltipTitle="View Notes"
            onClick={() => setViewNotesDrawerOpen(true)}
            tooltipPlacement="left"
          />
        </SpeedDial>

        <EditNoteDrawer open={editNoteDrawerOpen} onClose={() => setEditNoteDrawerOpen(false)} />
        <NotesDrawer open={viewNotesDrawerOpen} onClose={() => setViewNotesDrawerOpen(false)} />
      </>
    )
  }

  if (variant === 'draggable') {
    return (
      <>
        <Box
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          sx={{ position: 'fixed', inset: 0, zIndex: isDragging ? 9998 : -1, cursor: isDragging ? 'grabbing' : 'auto' }}
        />

        <Fab
          onClick={() => setEditNoteDrawerOpen(true)}
          onMouseDown={handleMouseDown}
          onTouchStart={(e) => {
            setIsDragging(true)
            setDragStart({
              x: e.touches[0].clientX - position.x,
              y: e.touches[0].clientY - position.y,
            })
          }}
          sx={{
            position: 'fixed',
            bottom: `${position.y}px`,
            right: `${position.x}px`,
            bgcolor: '#0F766E',
            color: '#FFFFFF',
            width: 56,
            height: 56,
            '&:hover': {
              bgcolor: '#006670',
              transform: 'scale(1.1)',
            },
            transition: isDragging ? 'none' : 'all 0.3s ease',
            zIndex: 999,
            boxShadow: '0 8px 24px rgba(15, 118, 110, 0.3)',
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
          aria-label="Add note"
          title="Add note (drag to move)"
        >
          <Edit />
        </Fab>

        <EditNoteDrawer open={editNoteDrawerOpen} onClose={() => setEditNoteDrawerOpen(false)} />
      </>
    )
  }

  if (variant === 'speed-dial-view') {
    return (
      <>
        <SpeedDial
          ariaLabel="View notes menu"
          sx={{
            position: 'fixed',
            bottom: 32,
            left: 32,
            zIndex: 999,
          }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<ViewAgenda />}
            tooltipTitle="View all notes"
            tooltipOpen
            onClick={() => setViewNotesDrawerOpen(true)}
            aria-label="View all notes"
          />
        </SpeedDial>

        <NotesDrawer open={viewNotesDrawerOpen} onClose={() => setViewNotesDrawerOpen(false)} />
      </>
    )
  }

  // Default variant - simple dialog FAB
  return (
    <Fab
      onClick={() => setDialogOpen(true)}
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        bgcolor: '#0F766E',
        color: '#FFFFFF',
        width: 56,
        height: 56,
        '&:hover': {
          bgcolor: '#006670',
          transform: 'scale(1.1)',
        },
        transition: 'all 0.3s ease',
        zIndex: 999,
        boxShadow: '0 8px 24px rgba(15, 118, 110, 0.3)',
      }}
      aria-label="Add note"
    >
      <Edit />
    </Fab>
  )
}
