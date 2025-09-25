import { Card, CardContent, Typography, Grid, Box, Chip, Button, Avatar, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material'
import { TrendingUp, TrendingDown, CalendarToday, Message, AttachMoney, People } from '@mui/icons-material'

const kpis = [
  { 
    label: 'Total Revenue', 
    value: '$12,450', 
    change: '+12.5%', 
    trend: 'up',
    icon: <AttachMoney sx={{ color: 'success.main' }} />,
    color: 'success'
  },
  { 
    label: 'Active Bookings', 
    value: '8', 
    change: '+2 this week', 
    trend: 'up',
    icon: <CalendarToday sx={{ color: 'primary.main' }} />,
    color: 'primary'
  },
  { 
    label: 'New Inquiries', 
    value: '15', 
    change: '+5 today', 
    trend: 'up',
    icon: <Message sx={{ color: 'info.main' }} />,
    color: 'info'
  },
  { 
    label: 'Portfolio Views', 
    value: '1,234', 
    change: '-2.1%', 
    trend: 'down',
    icon: <People sx={{ color: 'warning.main' }} />,
    color: 'warning'
  },
]

const recentBookings = [
  { id: 'BK-001', couple: 'Sarah & John', date: '2024-12-15', status: 'Confirmed', amount: '$2,500' },
  { id: 'BK-002', couple: 'Emma & David', date: '2024-12-20', status: 'Pending', amount: '$1,800' },
  { id: 'BK-003', couple: 'Lisa & Mike', date: '2024-12-22', status: 'Confirmed', amount: '$3,200' },
]

const recentMessages = [
  { from: 'Jennifer & Tom', message: 'Hi! We love your portfolio. Are you available for...', time: '2 min ago', unread: true },
  { from: 'Maria & Carlos', message: 'Thank you for the quote. We\'d like to book...', time: '1 hour ago', unread: true },
  { from: 'Anna & James', message: 'Perfect! See you on Saturday.', time: '3 hours ago', unread: false },
]

export default function Overview() {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Dashboard Overview
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Here's what's happening with your business today
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, index) => (
          <Grid key={index} item xs={12} sm={6} lg={3}>
            <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" className="text-gray-500 mb-1">
                      {kpi.label}
                    </Typography>
                    <Typography variant="h4" className="font-bold text-gray-800">
                      {kpi.value}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: `${kpi.color}.50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {kpi.icon}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                  )}
                  <Typography 
                    variant="body2" 
                    className={kpi.trend === 'up' ? 'text-success-600' : 'text-error-600'}
                  >
                    {kpi.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Bookings */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" className="font-semibold">
                  Recent Bookings
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <List>
                {recentBookings.map((booking, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {booking.couple.split(' ')[0][0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={booking.couple}
                      secondary={`${booking.date} • ${booking.amount}`}
                    />
                    <Chip 
                      label={booking.status} 
                      color={booking.status === 'Confirmed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Messages */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" className="font-semibold">
                  Recent Messages
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <List>
                {recentMessages.map((message, index) => (
                  <ListItem key={index} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                      <Typography variant="body2" className="font-medium">
                        {message.from}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {message.time}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      className="text-gray-600 mb-2"
                      sx={{ 
                        fontWeight: message.unread ? 600 : 400,
                        color: message.unread ? 'text.primary' : 'text.secondary'
                      }}
                    >
                      {message.message}
                    </Typography>
                    {message.unread && (
                      <Chip label="New" color="primary" size="small" />
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
