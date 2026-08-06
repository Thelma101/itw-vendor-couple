import { Box, CircularProgress, Typography } from '@mui/material'

export default function RouteLoader() {
  return (
    <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center', px: 2 }} role="status" aria-live="polite">
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={28} sx={{ color: '#00838F', mb: 1.5 }} />
        <Typography sx={{ fontSize: 14, color: '#475569' }}>Loading page...</Typography>
      </Box>
    </Box>
  )
}
