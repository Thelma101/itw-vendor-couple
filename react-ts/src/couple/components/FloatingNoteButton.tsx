import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  Typography,
} from '@mui/material'
import { Edit, ViewAgenda } from '@mui/icons-material'
import { useNotes } from '@/shared/contexts/NotesContext'
import { useLocation } from 'react-router-dom'
import NotesDrawer from './NotesDrawer'

const POS_KEY = 'itw_note_fab_pos'

type Pos = { x: number; y: number }

function loadPos(): Pos {
  try {
    const raw = localStorage.getItem(POS_KEY)
    if (!raw) return { x: 24, y: 96 }
    const p = JSON.parse(raw) as Pos
    if (typeof p.x === 'number' && typeof p.y === 'number') return p
  } catch {
    /* ignore */
  }
  return { x: 24, y: 96 }
}

function clampPos(x: number, y: number, size = 56): Pos {
  const pad = 8
  const maxX = Math.max(pad, window.innerWidth - size - pad)
  const maxY = Math.max(pad, window.innerHeight - size - pad)
  return {
    x: Math.min(Math.max(pad, x), maxX),
    y: Math.min(Math.max(pad, y), maxY),
  }
}

/**
 * Draggable floating note FAB — available on couple pages.
 * Drag to reposition; tap to open quick note. Position is remembered.
 */
export default function FloatingNoteButton() {
  const location = useLocation()
  const pageName = location.pathname.split('/').filter(Boolean).pop() || 'page'
  const size = 56

  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewNotesOpen, setViewNotesOpen] = useState(false)
  const [pos, setPos] = useState<Pos>(() =>
    typeof window !== 'undefined' ? clampPos(loadPos().x, loadPos().y, size) : { x: 24, y: 96 },
  )
  const [dragging, setDragging] = useState(false)

  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  })
  const posRef = useRef(pos)
  posRef.current = pos

  const { currentNote, setCurrentNote, addNote } = useNotes()

  useEffect(() => {
    const onResize = () => setPos((p) => clampPos(p.x, p.y, size))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const endDrag = useCallback(() => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    setDragging(false)
    const next = clampPos(posRef.current.x, posRef.current.y, size)
    setPos(next)
    localStorage.setItem(POS_KEY, JSON.stringify(next))
  }, [])

  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      if (!dragRef.current.active) return
      const dx = clientX - dragRef.current.startX
      const dy = clientY - dragRef.current.startY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true
      setPos(
        clampPos(
          dragRef.current.originX + dx,
          dragRef.current.originY + dy,
          size,
        ),
      )
    }

    const onPointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.active || !e.touches[0]) return
      e.preventDefault()
      onMove(e.touches[0].clientX, e.touches[0].clientY)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', endDrag)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', endDrag)
    }
  }, [endDrag])

  const startDrag = (clientX: number, clientY: number) => {
    dragRef.current = {
      active: true,
      moved: false,
      startX: clientX,
      startY: clientY,
      originX: posRef.current.x,
      originY: posRef.current.y,
    }
    setDragging(true)
  }

  const handleClick = () => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false
      return
    }
    setDialogOpen(true)
  }

  const handleSave = () => {
    addNote(currentNote, pageName)
    setDialogOpen(false)
  }

  // Keep above couple bottom nav on mobile (left side default also works)
  const bottomSafe = typeof window !== 'undefined' && window.innerWidth < 600 ? 88 : 24

  useEffect(() => {
    // nudge first load away from bottom nav if still at default-ish bottom
    setPos((p) => {
      const maxY = window.innerHeight - size - bottomSafe
      if (p.y > maxY) return clampPos(p.x, maxY, size)
      return p
    })
  }, [bottomSafe])

  return (
    <>
      <Fab
        onPointerDown={(e) => {
          if (e.button !== 0) return
          e.currentTarget.setPointerCapture?.(e.pointerId)
          startDrag(e.clientX, e.clientY)
        }}
        onClick={handleClick}
        sx={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          right: 'auto',
          bottom: 'auto',
          bgcolor: '#0F766E',
          color: '#FFFFFF',
          width: size,
          height: size,
          borderRadius: '50%',
          touchAction: 'none',
          zIndex: 1200,
          boxShadow: dragging
            ? '0 12px 32px rgba(15, 118, 110, 0.45)'
            : '0 8px 24px rgba(15, 118, 110, 0.3)',
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging ? 'none' : 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            bgcolor: '#0D9488',
            transform: dragging ? 'none' : 'scale(1.05)',
          },
        }}
        aria-label="Add note — drag to move"
        title="Add note · drag to move"
      >
        <Edit />
      </Fab>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 16, color: '#0F172A', pb: 1 }}>
          Quick Note
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.5 }}>
            Page: {pageName.replace(/-/g, ' ').toUpperCase()} · FAB is draggable anytime
          </Typography>
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
              },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              onClick={() => setViewNotesOpen(true)}
              variant="text"
              startIcon={<ViewAgenda />}
              sx={{ fontWeight: 700, color: '#0F766E', fontSize: 12 }}
            >
              View all notes
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => setDialogOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                color="secondary"
                disabled={!currentNote.trim()}
              >
                Save Note
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <NotesDrawer open={viewNotesOpen} onClose={() => setViewNotesOpen(false)} />
    </>
  )
}
