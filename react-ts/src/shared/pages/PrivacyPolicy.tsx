import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Nav from '@/couple/components/Nav'

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Nav />
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 2, py: 4 }}>
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: '1px solid #E2E8F0', borderRadius: 3 }}>
          <Typography sx={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#0B2D31', mb: 1 }}>
            Privacy Policy
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', mb: 3 }}>Last updated: August 2026 · Soft-launch draft for Nigeria (NDPR-minded)</Typography>
          <Stack spacing={2} sx={{ fontSize: 14, color: '#334155', lineHeight: 1.7 }}>
            <Typography>
              ItheeWed (“we”) helps couples plan weddings and helps vendors get discovered. This draft explains what we collect and why. A lawyer-reviewed NDPR version should replace this before open public launch.
            </Typography>
            <Typography fontWeight={700}>What we collect</Typography>
            <Typography>
              Account details (name, email, phone), wedding planning data you enter (budget, guests, notes), vendor profile and portfolio content, messages between couples and vendors, and basic usage analytics (pages viewed, device type).
            </Typography>
            <Typography fontWeight={700}>How we use it</Typography>
            <Typography>
              To operate the service, match couples with vendors, process optional boost payments, improve product quality, and send transactional messages. We do not sell personal data.
            </Typography>
            <Typography fontWeight={700}>Sharing</Typography>
            <Typography>
              Couples and vendors see information needed to communicate and book. Payment processors (e.g. Paystack) receive payment details. Hosting/analytics providers process data under contract.
            </Typography>
            <Typography fontWeight={700}>Your rights</Typography>
            <Typography>
              You may request access, correction, or deletion of your account data by contacting support. Soft-launch support: reply via in-app help or the email published at launch.
            </Typography>
            <Typography fontWeight={700}>Retention & security</Typography>
            <Typography>
              We retain account data while your account is active and for a reasonable period afterward for legal/compliance needs. We use industry-standard safeguards; no method is 100% secure.
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
