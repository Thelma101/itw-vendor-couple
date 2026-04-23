import { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, TextField, Typography, Stack, IconButton } from '@mui/material'
import { Edit, Close, ViewAgenda } from '@mui/icons-material'
import { useNotes } from '@/contexts/NotesContext'
import { useLocation } from 'react-router-dom'
import NotesDrawer from './NotesDrawer'

export default function FloatingNoteButton() {
  const [open, setOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { currentNote, setCurrentNote, addNote } = useNotes()
  const location = useLocation()
  const isDashboard = location.pathname === '/couple/dashboard'

  const pageName = location.pathname.split('/').pop() || 'page'

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSave = () => {
    addNote(currentNote, pageName)
    handleClose()
  }

  if (!isDashboard) return null

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        onClick={handleOpen}
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

      {/* Note Input Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
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
              onClick={() => setDrawerOpen(true)}
              variant="text"
              startIcon={<ViewAgenda />}
              sx={{ textTransform: 'none', fontWeight: 700, color: '#0F766E', fontSize: 12 }}
            >
              View all notes
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                Cancel
              </Button>
              <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E' }} disabled={!currentNote.trim()}>
                Save Note
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Notes Drawer */}
      <NotesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}