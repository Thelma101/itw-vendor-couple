import { useState } from 'react'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useNotes } from '@/shared/contexts/NotesContext'
import { useLocation } from 'react-router-dom'

interface EditNoteDrawerProps {
  open: boolean
  onClose: () => void
}

export default function EditNoteDrawer({ open, onClose }: EditNoteDrawerProps) {
  const { currentNote, setCurrentNote, addNote } = useNotes()
  const location = useLocation()
  const [saved, setSaved] = useState(false)

  const pageName = location.pathname.split('/').pop() || 'page'

  const handleSave = () => {
    if (currentNote.trim()) {
      addNote(currentNote, pageName)
      setSaved(true)
      setCurrentNote('')
      setTimeout(() => {
        onClose()
        setSaved(false)
      }, 1500)
    }
  }

  const handleClose = () => {
    setCurrentNote('')
    setSaved(false)
    onClose()
  }

  return (
    <Drawer anchor="right" open={open} onClose={handleClose} PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, borderRadius: 0 } }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2.2, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Add Note</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748B', mt: 0.3 }}>Page: {pageName.replace(/-/g, ' ').toUpperCase()}</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 2.2, display: 'flex', flexDirection: 'column' }}>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={6}
            placeholder="Jot down your thoughts, reminders, or ideas..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: 13,
                fontFamily: 'inherit',
              },
              mb: 2,
            }}
          />

          {saved && (
            <Typography sx={{ fontSize: 12, color: '#15803D', bgcolor: '#ECFDF5', p: 1.2, borderRadius: 1.5, textAlign: 'center', fontWeight: 700, mb: 1.5 }}>
              ✓ Note saved successfully
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
            <Button onClick={handleClose} fullWidth variant="outlined" sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}>
              Cancel
            </Button>
            <Button onClick={handleSave} fullWidth variant="contained" sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700, bgcolor: '#0F766E' }} disabled={!currentNote.trim()}>
              Save Note
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}
