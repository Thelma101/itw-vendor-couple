import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Nav from '@/couple/components/Nav'

export default function TermsOfService() {
  const navigate = useNavigate()
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Nav />
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 2, py: 4 }}>
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: '1px solid #E2E8F0', borderRadius: 3 }}>
          <Typography sx={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#0B2D31', mb: 1 }}>
            Terms of Service
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', mb: 3 }}>Last updated: August 2026 · Soft-launch draft</Typography>
          <Stack spacing={2} sx={{ fontSize: 14, color: '#334155', lineHeight: 1.7 }}>
            <Typography>
              By using ItheeWed you agree to these terms. Replace with counsel-reviewed terms before national public launch and before collecting live payments beyond test mode.
            </Typography>
            <Typography fontWeight={700}>The service</Typography>
            <Typography>
              ItheeWed provides wedding planning tools for couples and listing / lead tools for vendors in Nigeria. Couples may use core planning features free of charge. Vendors may list free; optional boosts and paid plans may apply.
            </Typography>
            <Typography fontWeight={700}>Accounts</Typography>
            <Typography>
              You must provide accurate information and keep credentials secure. You are responsible for activity under your account.
            </Typography>
            <Typography fontWeight={700}>Vendors & couples</Typography>
            <Typography>
              ItheeWed is a marketplace/facilitator. We do not guarantee bookings, vendor quality, or couple responses. Contracts for wedding services are between couple and vendor unless we explicitly intermediate payments later.
            </Typography>
            <Typography fontWeight={700}>Payments</Typography>
            <Typography>
              Boost and subscription fees are generally non-refundable once activated, except where required by law or our written refund policy. Payment processors’ terms also apply.
            </Typography>
            <Typography fontWeight={700}>Acceptable use</Typography>
            <Typography>
              No fraud, spam, scraping, harassment, or posting illegal content. We may suspend accounts that harm the marketplace or users.
            </Typography>
            <Typography fontWeight={700}>Limitation</Typography>
            <Typography>
              To the fullest extent permitted by law, ItheeWed is not liable for indirect damages arising from vendor–couple disputes or third-party services.
            </Typography>
          </Stack>
          <Button onClick={() => navigate(-1)} sx={{ mt: 3 }} variant="outlined">
            Back
          </Button>
        </Paper>
      </Box>
    </Box>
  )
}
