import { PropsWithChildren } from 'react'
import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, Box } from '@mui/material'
import { Link, useLocation, Outlet } from 'react-router-dom'
import clsx from 'clsx'

const navItems = [
  { label: 'Overview', to: '/vendor' },
  { label: 'Bookings', to: '/vendor/bookings' },
  { label: 'Messages', to: '/vendor/messages' },
  { label: 'Portfolio', to: '/vendor/portfolio' },
  { label: 'Services', to: '/vendor/services' },
  { label: 'Availability', to: '/vendor/availability' },
  { label: 'Settings', to: '/vendor/settings' },
]

export default function VendorDashboardLayout(_: PropsWithChildren) {
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" color="inherit" elevation={0} className="border-b border-gray-200">
        <Toolbar>
          <Typography variant="h6" className="font-semibold">I Thee Wed — Vendor</Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: 240, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' } }}>
        <Toolbar />
        <List>
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <ListItemButton key={item.to} component={Link} to={item.to} className={clsx('rounded-md mx-2', active ? 'bg-primary-50' : '')}>
                <ListItemText primaryTypographyProps={{ className: clsx(active ? 'text-primary-600 font-medium' : 'text-gray-700') }} primary={item.label} />
              </ListItemButton>
            )
          })}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }} className="bg-gray-50">
        <Toolbar />
        <div className="px-6 py-6">
          <Outlet />
        </div>
      </Box>
    </Box>
  )
}
