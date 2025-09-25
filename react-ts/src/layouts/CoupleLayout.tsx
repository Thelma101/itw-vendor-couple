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
          borderColor: 'grey.200',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ mr: 2, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" className="font-bold text-primary-600">
              ❤️ ithee wed
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            {navItems.map((item) => (
              <Typography 
                key={item}
                variant="body2" 
                className="text-gray-700 hover:text-primary-600 cursor-pointer font-medium"
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: 'success.main',
                '&:hover': { bgcolor: 'success.dark' },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Show work
            </Button>
            <IconButton>
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
