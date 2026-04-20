import type { ReactNode } from 'react'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import AutoAwesome from '@mui/icons-material/AutoAwesome'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface CouplePageShellProps {
  title: string
  subtitle: string
  badge?: string
  actions?: ReactNode
  children: ReactNode
}

export default function CouplePageShell({ title, subtitle, badge, actions, children }: CouplePageShellProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F9FC', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <Box sx={{ flex: 1, px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1440, width: '100%', mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 4,
            border: '1px solid #E2E8F0',
            background: 'linear-gradient(120deg, #FFFFFF 0%, #F1FAFB 55%, #FFF5F7 100%)',
            mb: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', right: -40, top: -50, width: 180, height: 180, borderRadius: '50%', bgcolor: '#00838F0F' }} />
          <Box sx={{ position: 'absolute', right: 90, bottom: -30, width: 110, height: 110, borderRadius: '50%', bgcolor: '#EB194812' }} />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <AutoAwesome sx={{ color: '#0F766E', fontSize: 18 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0F766E', letterSpacing: 0.3 }}>
                  Elevated Planning Experience
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 800, lineHeight: 1.1, color: '#0B2D31' }}>{title}</Typography>
              <Typography sx={{ fontSize: 15, color: '#475569', mt: 1 }}>{subtitle}</Typography>
              {badge && (
                <Chip
                  label={badge}
                  sx={{ mt: 1.6, bgcolor: '#00838F', color: '#fff', fontWeight: 700, borderRadius: 2.5 }}
                />
              )}
            </Box>
            {actions ? <Box>{actions}</Box> : null}
          </Stack>
        </Paper>

        {children}
      </Box>

      <Footer />
    </Box>
  )
}
