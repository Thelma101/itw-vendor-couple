import type { ReactNode } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import BackButton from '@/shared/components/BackButton'

interface VendorPageShellProps {
  title?: string
  subtitle?: string
  badge?: string
  actions?: ReactNode
  children: ReactNode
  bare?: boolean
}

const VENDOR_HOME_PATHS = new Set(['/vendor', '/vendor/', '/vendor/overview', '/vendor/dashboard'])

export default function VendorPageShell({
  title,
  subtitle,
  badge,
  actions,
  children,
  bare = false,
}: VendorPageShellProps) {
  const { pathname } = useLocation()
  const isVendorHome = VENDOR_HOME_PATHS.has(pathname)

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 2.5, md: 4 },
        pb: { xs: 12, md: 6 },
        maxWidth: 1280,
        width: '100%',
        mx: 'auto',
        minWidth: 0,
        fontFamily: 'var(--font-ui)',
      }}
    >
      {!isVendorHome ? <BackButton fallbackPath="/vendor/overview" sx={{ mb: 1.5 }} /> : null}
      {!bare && title ? (
        <Box
          sx={{
            mb: 3,
            pb: 2.5,
            borderBottom: '1px solid #E2E8F0',
          }}
        >
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
                  fontFamily: 'var(--font-ui)',
                }}
              >
                Bloom desk
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
                <Typography sx={{ fontSize: 15, color: '#64748B', mt: 1, fontFamily: 'var(--font-ui)', maxWidth: 560 }}>
                  {subtitle}
                </Typography>
              ) : null}
              {badge ? (
                <Chip
                  label={badge}
                  size="small"
                  sx={{ mt: 1.5, bgcolor: '#0B2D31', color: '#fff', fontWeight: 700, borderRadius: 999, fontFamily: 'var(--font-ui)' }}
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
                  gap: 1,
                  flexWrap: 'wrap',
                  '& button, & .MuiButton-root': { whiteSpace: 'nowrap' },
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
  )
}
