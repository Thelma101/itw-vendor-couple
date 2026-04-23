import { useState } from 'react'
import { Fab, Box } from '@mui/material'
import { Edit } from '@mui/icons-material'
import EditNoteDrawer from './EditNoteDrawer'

export default function FloatingAddNoteButton() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [position, setPosition] = useState({ x: 32, y: 32 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

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

    // Keep within viewport bounds
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

  return (
    <>
      <Box
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        sx={{ position: 'fixed', inset: 0, zIndex: isDragging ? 9998 : -1, cursor: isDragging ? 'grabbing' : 'auto' }}
      />

      <Fab
        onClick={() => setDrawerOpen(true)}
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

      <EditNoteDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
