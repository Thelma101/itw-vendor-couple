import { useState } from 'react'
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material'
import { ViewAgenda } from '@mui/icons-material'
import NotesDrawer from './NotesDrawer'

export default function FloatingViewNotesButton() {
  const [drawerOpen, setDrawerOpen] = useState(false)

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
          onClick={() => setDrawerOpen(true)}
          aria-label="View all notes"
        />
      </SpeedDial>

      <NotesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
