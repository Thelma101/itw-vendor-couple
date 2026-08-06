import type { ReactNode } from 'react'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import AutoAwesome from '@mui/icons-material/AutoAwesome'
import Nav from '@/couple/components/Nav'
import CoupleBottomNav from '@/couple/components/CoupleBottomNav'

interface CouplePageShellProps {
  title?: string
  subtitle?: string
  badge?: string
  actions?: ReactNode
  children: ReactNode
  /** Skip page hero — used by planning hub */
  bare?: boolean
}

export default function CouplePageShell({
  title,
  subtitle,
  badge,
  actions,
  children,
  bare = false,
}: CouplePageShellProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F7F8', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Nav />

      <Box
        sx={{
          flex: 1,
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 2.5, md: 4 },
          pb: { xs: 12, md: 6 },
          maxWidth: 1280,
          width: '100%',
          mx: 'auto',
          minWidth: 0,
        }}
      >
        {!bare && title ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              background: 'linear-gradient(120deg, #FFFFFF 0%, #F0FDFA 55%, #FFFBEB 100%)',
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'absolute', right: -40, top: -50, width: 180, height: 180, borderRadius: '50%', bgcolor: '#0F766E0F' }} />
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
              sx={{ position: 'relative', zIndex: 1 }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <AutoAwesome sx={{ color: '#0F766E', fontSize: 18 }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0F766E', letterSpacing: 0.3 }}>
                    Elevated Planning Experience
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontSize: { xs: 26, md: 36 },
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: '#0B2D31',
                  }}
                >
                  {title}
                </Typography>
                {subtitle ? (
                  <Typography sx={{ fontSize: 15, color: '#475569', mt: 1 }}>{subtitle}</Typography>
                ) : null}
                {badge ? (
                  <Chip
                    label={badge}
                    sx={{ mt: 1.6, bgcolor: '#0F766E', color: '#fff', fontWeight: 700, borderRadius: 2.5 }}
                  />
                ) : null}
              </Box>
              {actions ? (
                <Box
                  sx={{
                    flexShrink: 0,
                    width: { xs: '100%', md: 'auto' },
                    display: 'flex',
                    justifyContent: { xs: 'stretch', md: 'flex-end' },
                    '& .MuiButton-root': {
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    },
                    '& .MuiStack-root': {
                      flexWrap: { xs: 'wrap', md: 'nowrap' },
                      width: { xs: '100%', md: 'auto' },
                    },
                  }}
                >
                  {actions}
                </Box>
              ) : null}
            </Stack>
          </Paper>
        ) : null}

        {children}
      </Box>

      <CoupleBottomNav />
    </Box>
  )
}
