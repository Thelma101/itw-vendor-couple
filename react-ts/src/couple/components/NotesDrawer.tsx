import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,

  Chip,
} from '@mui/material'
import { Delete, Edit, Close, DateRange } from '@mui/icons-material'
import { useNotes } from '@/shared/contexts/NotesContext'

interface NotesDrawerProps {
  open: boolean
  onClose: () => void
}

export default function NotesDrawer({ open, onClose }: NotesDrawerProps) {
  const context = useNotes()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  if (!context) return null

  const { getAllNotes, deleteNote, updateNote } = context
  const notes = getAllNotes()

  const handleEdit = (id: string, content: string) => {
    setEditingId(id)
    setEditText(content)
  }

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      updateNote(editingId, editText)
      setEditingId(null)
      setEditText('')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleDelete = (id: string) => {
    deleteNote(id)
    setDeleteConfirm(null)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, borderRadius: 0 } }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2.2, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>My Notes</Typography>
              <Typography sx={{ fontSize: 12, color: '#64748B', mt: 0.3 }}>{notes.length} notes</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Notes List */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2.2 }}>
            <Stack spacing={1.8}>
              {notes.length === 0 ? (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 14, color: '#64748B' }}>No notes yet</Typography>
                  <Typography sx={{ fontSize: 12, color: '#94A3B8', mt: 0.5 }}>Start adding notes from any page</Typography>
                </Paper>
              ) : (
                notes.map((note) => (
                  <Paper
                    key={note.id}
                    elevation={0}
                    sx={{
                      p: 1.8,
                      borderRadius: 2.2,
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
                        borderColor: '#00838F',
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Chip
                            label={note.page.replace(/-/g, ' ').toUpperCase()}
                            size="small"
                            sx={{ bgcolor: '#E6F7F8', color: '#0F766E', fontWeight: 700, fontSize: 11, mb: 0.8 }}
                          />
                          <Typography sx={{ fontSize: 13, color: '#0F172A', lineHeight: 1.6, wordBreak: 'break-word' }}>{note.content}</Typography>
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(note.id, note.content)}
                            sx={{ color: '#00838F', '&:hover': { bgcolor: '#E0F2F1' } }}
                          >
                            <Edit sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setDeleteConfirm(note.id)}
                            sx={{ color: '#B91C1C', '&:hover': { bgcolor: '#FEF2F2' } }}
                          >
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Stack>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DateRange sx={{ fontSize: 12, color: '#94A3B8' }} />
                        <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>{formatDate(note.timestamp)}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Edit Dialog */}
      <Dialog open={editingId !== null} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={5}
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            sx={{ mt: 1.5 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCancel} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ textTransform: 'none', bgcolor: '#00838F' }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Note?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            variant="contained"
            sx={{ textTransform: 'none', bgcolor: '#B91C1C' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
