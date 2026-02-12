import { useState, useEffect, useCallback } from 'react'
import { Box, Typography, Dialog, Fade } from '@mui/material'
import { DeleteOutline } from '@mui/icons-material'

/* ───────── tokens ───────── */
const T = {
  primaryBlack: '#002528',
  primary: '#00838F',
  text: '#555',
  font: "'Open Sans', sans-serif",
}

interface DeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  /** Override prompt text (default: "Are you sure you want to delete this?") */
  message?: string
  /** Override success text (default: "Item Deleted Successfully") */
  successMessage?: string
}

/**
 * Two-phase delete confirmation modal matching Figma designs.
 * Phase 1: "Delete" confirmation with No / Yes buttons
 * Phase 2: Success state with coloured circles + delete icon + "Item Deleted Successfully"
 * Auto-closes after 1.5 s in phase 2.
 */
export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  message = 'Are you sure you want to\ndelete this?',
  successMessage = 'Item Deleted Successfully',
}: DeleteConfirmModalProps) {
  const [phase, setPhase] = useState<'confirm' | 'success'>('confirm')

  /* reset phase whenever the modal opens */
  useEffect(() => {
    if (open) setPhase('confirm')
  }, [open])

  const handleYes = useCallback(() => {
    onConfirm()
    setPhase('success')
    setTimeout(() => {
      onClose()
    }, 1500)
  }, [onConfirm, onClose])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '30px',
          width: 300,
          minHeight: phase === 'confirm' ? 300 : 280,
          maxWidth: '92vw',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          p: 0,
        },
      }}
      slotProps={{ backdrop: { sx: { bgcolor: 'rgba(0,37,40,0.25)', backdropFilter: 'blur(2px)' } } }}
    >
      {phase === 'confirm' ? (
        /* ─── PHASE 1: Confirm ─── */
        <Fade in timeout={200}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 4, py: 5, height: '100%' }}>
            <Typography sx={{
              fontFamily: T.font, fontWeight: 700, fontSize: 18,
              color: T.primaryBlack, mb: 2, textAlign: 'center',
            }}>
              Delete
            </Typography>
            <Typography sx={{
              fontFamily: T.font, fontWeight: 400, fontSize: 14,
              color: T.text, textAlign: 'center', lineHeight: 1.6,
              whiteSpace: 'pre-line', mb: 5,
            }}>
              {message}
            </Typography>

            {/* Buttons row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
              {/* No – primary / solid */}
              <Box
                component="button"
                onClick={onClose}
                sx={{
                  flex: 1,
                  height: 40,
                  bgcolor: T.primary,
                  color: '#fff',
                  border: `1px solid ${T.primary}`,
                  borderRadius: '10px',
                  fontFamily: T.font,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                No
              </Box>
              {/* Yes – text only */}
              <Box
                component="button"
                onClick={handleYes}
                sx={{
                  background: 'none',
                  border: 'none',
                  fontFamily: T.font,
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#2d2d2d',
                  cursor: 'pointer',
                  px: 2, py: 1,
                  '&:hover': { color: T.primary },
                }}
              >
                Yes
              </Box>
            </Box>
          </Box>
        </Fade>
      ) : (
        /* ─── PHASE 2: Success ─── */
        <Fade in timeout={300}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 4, py: 5, height: '100%' }}>
            {/* Coloured circles + delete icon */}
            <Box sx={{ position: 'relative', width: 120, height: 110, mb: 3 }}>
              {/* Yellow circle (large, left-ish) */}
              <Box sx={{
                position: 'absolute', width: 95, height: 95,
                borderRadius: '50%', bgcolor: '#ECEBA2', opacity: 0.6,
                top: 0, left: 5,
              }} />
              {/* Cyan circle (medium, center-bottom) */}
              <Box sx={{
                position: 'absolute', width: 54, height: 54,
                borderRadius: '50%', bgcolor: '#B2EBF2', opacity: 0.7,
                top: 52, left: 30,
              }} />
              {/* Pink circle (small, right) */}
              <Box sx={{
                position: 'absolute', width: 54, height: 54,
                borderRadius: '50%', bgcolor: '#FCE4EC', opacity: 0.7,
                top: 22, right: 0,
              }} />
              {/* Trash icon */}
              <Box sx={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
              }}>
                <DeleteOutline sx={{ fontSize: 36, color: T.primary }} />
              </Box>
            </Box>

            <Typography sx={{
              fontFamily: T.font, fontWeight: 400, fontSize: 14,
              color: T.text, textAlign: 'center',
            }}>
              {successMessage}
            </Typography>
          </Box>
        </Fade>
      )}
    </Dialog>
  )
}
