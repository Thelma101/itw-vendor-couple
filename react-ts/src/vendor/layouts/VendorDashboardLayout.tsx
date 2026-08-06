import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Box, IconButton, Avatar, Badge } from '@mui/material'
import { Logout, NotificationsNone } from '@mui/icons-material'
import { authApi } from '@/shared/lib/api'
import VendorBottomNav from '@/vendor/components/VendorBottomNav'
import Logo from '@/marketing/components/Logo'
import { VENDOR_PROFILE } from '@/vendor/lib/vendorProfile'

const mainNavItems = [
  { label: 'Overview', path: '/vendor', end: true },
  { label: 'Leads', path: '/vendor/leads' },
  { label: 'Bookings', path: '/vendor/bookings' },
  { label: 'Messages', path: '/vendor/messages' },
  { label: 'Services', path: '/vendor/services' },
  { label: 'Portfolio', path: '/vendor/portfolio' },
  { label: 'Plan', path: '/vendor/subscription' },
  { label: 'Account', path: '/vendor/account' },
]

export default function VendorDashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string, end?: boolean) => {
    if (end) return location.pathname === path || location.pathname === `${path}/` || location.pathname === '/vendor/overview'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    authApi.logout()
    navigate('/signin')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F4F7F8',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        fontFamily: 'var(--font-ui)',
        color: '#0B2D31',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E2E8F0',
          color: '#0B2D31',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important', px: { xs: 2, md: 3 }, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flexShrink: 0 }}>
            <Logo linkToHome height={36} />
            <Box sx={{ display: { xs: 'none', sm: 'block' }, borderLeft: '1px solid #E2E8F0', pl: 2, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Box
                  component="span"
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: { sm: 17, md: 19 },
                    color: '#0B2D31',
                    lineHeight: 1.2,
                  }}
                >
                  {VENDOR_PROFILE.businessName}
                </Box>
                {VENDOR_PROFILE.verified ? (
                  <Box
                    component="span"
                    sx={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      textTransform: 'uppercase',
                      px: 1,
                      py: 0.25,
                      borderRadius: 999,
                      bgcolor: 'rgba(15,118,110,0.08)',
                      color: '#0F766E',
                      border: '1px solid #CCFBF1',
                    }}
                  >
                    Verified
                  </Box>
                ) : null}
              </Box>
              <Box sx={{ fontSize: 12, color: '#64748B', mt: 0.25, fontFamily: 'var(--font-ui)' }}>
                {VENDOR_PROFILE.category} · {VENDOR_PROFILE.location}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
              flex: 1,
              justifyContent: 'center',
              overflowX: 'auto',
            }}
          >
            {mainNavItems.map((item) => {
              const active = isActive(item.path, item.end)
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: active ? '#0F766E' : '#475569',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: active ? 700 : 600,
                    fontSize: 13.5,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                    bgcolor: active ? 'rgba(15, 118, 110, 0.08)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(15, 118, 110, 0.06)',
                      color: '#0F766E',
                    },
                  }}
                >
                  {item.label}
                </Button>
              )
            })}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            <IconButton aria-label="Notifications" sx={{ color: '#64748B' }}>
              <Badge variant="dot" color="primary" overlap="circular" sx={{ '& .MuiBadge-badge': { bgcolor: '#0F766E' } }}>
                <NotificationsNone />
              </Badge>
            </IconButton>
            <IconButton onClick={() => navigate('/vendor/account')} aria-label="Account" sx={{ p: 0.5 }}>
              <Avatar src={VENDOR_PROFILE.avatar} sx={{ width: 36, height: 36, border: '2px solid #CCFBF1' }} />
            </IconButton>
            <IconButton
              onClick={handleLogout}
              aria-label="Sign out"
              sx={{ display: { xs: 'none', md: 'inline-flex' }, color: '#94A3B8', '&:hover': { color: '#BE123C' } }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, width: '100%', overflowX: 'hidden', pb: { xs: 10, md: 3 } }}>
        <Outlet />
      </Box>

      <VendorBottomNav />
    </Box>
  )
}
