import { Box, Typography, Grid, Link, IconButton } from '@mui/material'
import { QrCode } from '@mui/icons-material'
import Logo from '@/marketing/components/Logo'

const footerLinks = {
  column1: [
    'Wedding websites',
    'Marketplace', 
    'Wedding invitations',
    'Get The ithewed app',
    'Wedding budget',
    'Wedding checklist',
    'Wedding guest list'
  ],
  column2: [
    'Wedding Ideas & etiquette',
    'Engagement',
    'Parties & events', 
    'Wedding dresses',
    'Gifts',
    'Real Wedding photos',
    'Community'
  ]
}

export default function Footer() {
  return (
    <Box sx={{ 
      bgcolor: 'var(--color-primary)', 
      color: 'white', 
      py: 6, 
      px: 4,
      mt: 'auto'
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={4} alignItems="center">
          {/* Logo */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Logo variant="white" height={40} linkToHome />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your trusted partner in creating unforgettable wedding experiences.
            </Typography>
          </Grid>

          {/* Column 1 Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              {footerLinks.column1.map((link, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    display: 'block',
                    color: 'white',
                    textDecoration: 'none',
                    mb: 1,
                    '&:hover': {
                      textDecoration: 'underline',
                      opacity: 0.8
                    }
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Column 2 Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              {footerLinks.column2.map((link, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    display: 'block',
                    color: 'white',
                    textDecoration: 'none',
                    mb: 1,
                    '&:hover': {
                      textDecoration: 'underline',
                      opacity: 0.8
                    }
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* App Download */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Itheewed App is Available on
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-end' } }}>
                <Box sx={{ 
                  display: 'inline-block', 
                  bgcolor: 'white', 
                  p: 2, 
                  borderRadius: 1,
                  textAlign: 'center'
                }}>
                  <IconButton disabled>
                    <QrCode sx={{ fontSize: 60, color: 'var(--color-primary)' }} />
                  </IconButton>
                  <Typography variant="caption" sx={{ color: 'var(--color-primary)', display: 'block' }}>
                    iOS
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'inline-block', 
                  bgcolor: 'white', 
                  p: 2, 
                  borderRadius: 1,
                  textAlign: 'center'
                }}>
                  <IconButton disabled>
                    <QrCode sx={{ fontSize: 60, color: 'var(--color-primary)' }} />
                  </IconButton>
                  <Typography variant="caption" sx={{ color: 'var(--color-primary)', display: 'block' }}>
                    Android
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box sx={{ 
          borderTop: '1px solid rgba(255,255,255,0.2)', 
          mt: 4, 
          pt: 3,
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 ithee wed. All rights reserved. | Privacy Policy | Terms of Service
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
