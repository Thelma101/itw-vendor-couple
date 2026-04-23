import { useState } from 'react'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { Delete, Edit, Calendar } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'
import { useNotes } from '@/contexts/NotesContext'
import FloatingNoteButton from '@/components/couple/FloatingNoteButton'

export default function NotesPage() {
  const context = useNotes()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  
  if (!context) {
    return (
      <CouplePageShell title="My Notes" subtitle="View and manage your wedding planning notes.">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <Typography sx={{ fontSize: 16, color: '#64748B' }}>Unable to load notes</Typography>
        </Paper>
      </CouplePageShell>
    )
  }

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <CouplePageShell
      title="My Notes"
      subtitle="View, edit, and manage all your wedding planning notes in one place."
      badge={`${notes.length} notes`}
    >
      {notes.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <Typography sx={{ fontSize: 16, color: '#64748B', mb: 1 }}>No notes yet</Typography>
          <Typography sx={{ fontSize: 13, color: '#94A3B8' }}>Start jotting down your ideas and reminders using the floating note button.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {notes.map((note) => (
            <Card
              key={note.id}
              elevation={0}
              sx={{
                p: 2.2,
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(15,23,42,0.08)',
                },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#0F766E', bgcolor: '#E6F7F8', px: 1.2, py: 0.4, borderRadius: 1 }}>
                      {note.page.replace(/-/g, ' ').toUpperCase()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94A3B8' }}>
                      <Calendar sx={{ fontSize: 13 }} />
                      <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>{formatDate(note.timestamp)}</Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: '#334155',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontFamily: 'inherit',
                    }}
                  >
                    {note.content}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(note.id, note.content)}
                    sx={{ color: '#0F766E', '&:hover': { bgcolor: '#E6F7F8' } }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteNote(note.id)} sx={{ color: '#B42349', '&:hover': { bgcolor: '#FEF2F2' } }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      {/* Edit Dialog */}
      <Dialog open={editingId !== null} onClose={handleCancel} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>Edit Note</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: 13,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCancel} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E' }} disabled={!editText.trim()}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      <FloatingNoteButton page="notes" />
    </CouplePageShell>
  )
}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCancel} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, bgcolor: '#0F766E' }} disabled={!editText.trim()}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </CouplePageShell>
  )
}
