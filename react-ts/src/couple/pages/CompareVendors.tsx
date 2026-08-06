import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'

/** Legacy /couple/compare?ids=… redirects back to search with compare open via query. */
export default function CompareVendors() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const ids = params.get('ids') || ''

  useEffect(() => {
    const q = new URLSearchParams()
    if (ids) q.set('compare', ids)
    navigate(`/couple/search-results?${q.toString()}`, { replace: true })
  }, [ids, navigate])

  return (
    <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center', gap: 1 }}>
      <CircularProgress size={28} sx={{ color: '#0F766E' }} />
      <Typography sx={{ color: '#64748B', fontSize: 14 }}>Opening compare…</Typography>
    </Box>
  )
}
