import { useState } from 'react'
import { SpeedDial, SpeedDialAction, SpeedDialIcon, useMediaQuery } from '@mui/material'
import { Add, ViewAgenda } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import EditNoteDrawer from './EditNoteDrawer'
import NotesDrawer from './NotesDrawer'

export default function FloatingNotesButton() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [editNoteOpen, setEditNoteOpen] = useState(false)
  const [viewNotesOpen, setViewNotesOpen] = useState(false)

  return (
    <>
      <SpeedDial
        ariaLabel="Notes menu"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 32,
          right: isMobile ? 16 : 32,
          zIndex: 999,
        }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<Add />}
          tooltipTitle="Add Note"
          onClick={() => setEditNoteOpen(true)}
          tooltipPlacement="left"
        />
        <SpeedDialAction
          icon={<ViewAgenda />}
          tooltipTitle="View Notes"
          onClick={() => setViewNotesOpen(true)}
          tooltipPlacement="left"
        />
      </SpeedDial>

      {/* Edit Note Drawer */}
      <EditNoteDrawer open={editNoteOpen} onClose={() => setEditNoteOpen(false)} />

      {/* View Notes Drawer */}
      <NotesDrawer open={viewNotesOpen} onClose={() => setViewNotesOpen(false)} />
    </>
  )
}
