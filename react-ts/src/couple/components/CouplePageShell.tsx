import type { ReactNode } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import Nav from '@/couple/components/Nav'
import CoupleBottomNav from '@/couple/components/CoupleBottomNav'
import BackButton from '@/shared/components/BackButton'

interface CouplePageShellProps {
  title?: string
  subtitle?: string
  badge?: string
  actions?: ReactNode
  children: ReactNode
  /** Skip page hero — used by planning hub */
  bare?: boolean
}

const COUPLE_HOME_PATHS = new Set(['/couple', '/couple/', '/couple/dashboard'])

export default function CouplePageShell({
  title,
  subtitle,
  badge,
  actions,
  children,
  bare = false,
}: CouplePageShellProps) {
  const { pathname } = useLocation()
  const isCoupleHome = COUPLE_HOME_PATHS.has(pathname)

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
        {!isCoupleHome ? <BackButton fallbackPath="/couple/dashboard" sx={{ mb: 1.5 }} /> : null}
        {!bare && title ? (
          <Box sx={{ mb: 3, pb: 2.5, borderBottom: '1px solid #E2E8F0' }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'flex-end' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#0F5C56',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    mb: 1,
                  }}
                >
                  Your wedding
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontSize: { xs: 28, md: 36 },
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: '#0B2D31',
                  }}
                >
                  {title}
                </Typography>
                {subtitle ? (
                  <Typography sx={{ fontSize: 15, color: '#64748B', mt: 1, maxWidth: 560 }}>{subtitle}</Typography>
                ) : null}
                {badge ? (
                  <Chip
                    label={badge}
                    size="small"
                    sx={{ mt: 1.5, bgcolor: '#0B2D31', color: '#fff', fontWeight: 700, borderRadius: 999 }}
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
          </Box>
        ) : null}

        {children}
      </Box>

      <CoupleBottomNav />
    </Box>
  )
}
