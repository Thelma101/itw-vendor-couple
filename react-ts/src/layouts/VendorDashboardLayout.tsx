import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, Box, Avatar, IconButton, Badge } from '@mui/material'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { Notifications, Settings, Menu as MenuIcon } from '@mui/icons-material'
import clsx from 'clsx'

const navItems = [
  { label: 'Dashboard', to: '/vendor', icon: '📊' },
  { label: 'Bookings', to: '/vendor/bookings', icon: '📅' },
  { label: 'Messages', to: '/vendor/messages', icon: '💬' },
  { label: 'Portfolio', to: '/vendor/portfolio', icon: '🖼️' },
  { label: 'Services', to: '/vendor/services', icon: '⚙️' },
  { label: 'Availability', to: '/vendor/availability', icon: '📆' },
  { label: 'Analytics', to: '/vendor/analytics', icon: '📈' },
  { label: 'Settings', to: '/vendor/settings', icon: '⚙️' },
]

export default function VendorDashboardLayout() {
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Sidebar */}
      <Drawer 
        variant="permanent" 
        sx={{ 
          width: 280, 
          [`& .MuiDrawer-paper`]: { 
            width: 280, 
            boxSizing: 'border-box',
            bgcolor: 'white',
            borderRight: '1px solid',
            borderColor: 'grey.200',
          } 
        }}
      >
        {/* Logo/Brand */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="h5" className="font-bold text-primary-600">
            I Thee Wed
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Vendor Dashboard
          </Typography>
        </Box>

        {/* Navigation */}
        <List sx={{ px: 2, py: 2 }}>
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <ListItemButton 
                key={item.to} 
                component={Link} 
                to={item.to} 
                className={clsx(
                  'rounded-lg mb-1',
                  active ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                )}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.50',
                    color: 'primary.600',
                    '&:hover': {
                      bgcolor: 'primary.100',
                    },
                  },
                }}
              >
                <Box sx={{ mr: 2, fontSize: '1.2rem' }}>{item.icon}</Box>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{ 
                    className: clsx(
                      'font-medium',
                      active ? 'text-primary-600' : 'text-gray-700'
                    )
                  }} 
                />
              </ListItemButton>
            )
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ mr: 2, display: { md: 'none' } }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className="font-semibold text-gray-800">
                Welcome back, Sarah! 👋
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton>
                <Settings />
              </IconButton>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                S
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'grey.50' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
