import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Badge } from '@mui/material'
import { Notifications, Menu as MenuIcon } from '@mui/icons-material'
import { Outlet } from 'react-router-dom'

const navItems = [
  'Create IV',
  'Hire a vendor', 
  'Plan Wedding',
  'Your Wedding Website',
  'Messages',
  'Blog',
  'Notification'
]

export default function CoupleLayout() {
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
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
            <IconButton color="inherit" sx={{ mr: 2, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" color="inherit" className="font-bold">
              ❤️ ithee wed
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            {navItems.map((item) => (
              <Typography 
                key={item}
                variant="body2"
                color="inherit"
                className="cursor-pointer font-medium"
                sx={{ '&:hover': { color: 'primary.dark' } }}
              >
                {item}
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
