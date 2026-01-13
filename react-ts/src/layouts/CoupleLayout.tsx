import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Badge } from '@mui/material'
import { Notifications, Menu as MenuIcon } from '@mui/icons-material'
import { Outlet, useNavigate } from 'react-router-dom'
import Logo from '@/components/Logo';

const navItems = [
  { label: 'Find Vendors', path: '/couple/vendor-selection' },
  { label: 'Checklist', path: '/couple/checklist' },
  { label: 'Budget', path: '/couple/budget' },
  { label: 'Guest List', path: '/couple/guests' },
  { label: 'Messages', path: '/couple/messages' },
  { label: 'My Vendors', path: '/couple/my-vendors' },
]

export default function CoupleLayout() {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'segmentColor.main',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', color: 'primary.main' }}>

          
          
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
            <IconButton color="inherit" sx={{ mr: 2, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>

            <Logo />

            <Typography
              variant="h5"
              color="inherit"
              className="font-bold"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/couple')}
            >
              ❤️ ithee wed
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            {navItems.map((item) => (
              <Typography
                key={item.label}
                variant="body2"
                color="inherit"
                className="cursor-pointer font-medium"
                sx={{ '&:hover': { color: 'primary.dark' } }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="text"
              sx={{
                // backgroundImage: 'linear-gradient(90deg, #00838F 0%, #00626b 100%)', // Primary gradient
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 0,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  color: 'white',
                }
              }}
            >
              Show work
            </Button>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              U
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
