import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Tabs,
  Tab,
  LinearProgress,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';

// Mock analytics data
const monthlyRevenue = [
  { month: 'Jul', value: 850000 },
  { month: 'Aug', value: 1200000 },
  { month: 'Sep', value: 950000 },
  { month: 'Oct', value: 1450000 },
  { month: 'Nov', value: 1800000 },
  { month: 'Dec', value: 2100000 },
  { month: 'Jan', value: 1650000 },
];

const bookingsByPackage = [
  { name: 'Essential', value: 45, color: '#00838F' },
  { name: 'Premium', value: 85, color: '#4CAF50' },
  { name: 'Luxury', value: 26, color: '#FF9800' },
];

const trafficSources = [
  { source: 'Direct Search', visits: 2840, percentage: 45 },
  { source: 'Social Media', visits: 1890, percentage: 30 },
  { source: 'Referrals', visits: 940, percentage: 15 },
  { source: 'Email', visits: 630, percentage: 10 },
];

const topPerformingServices = [
  { service: 'Wedding Photography', bookings: 45, revenue: 5850000, growth: 12 },
  { service: 'Pre-Wedding Shoot', bookings: 32, revenue: 2400000, growth: 8 },
  { service: 'Drone Coverage', bookings: 28, revenue: 1960000, growth: 15 },
  { service: 'Same-Day Edit', bookings: 18, revenue: 1260000, growth: -3 },
];

const recentReviews = [
  { couple: 'Sarah & Michael', rating: 5, comment: 'Absolutely amazing work! Every photo was perfect.', date: '2 days ago' },
  { couple: 'Temi & Femi', rating: 5, comment: 'Professional, creative, and so easy to work with!', date: '1 week ago' },
  { couple: 'Ada & Chidi', rating: 4, comment: 'Great service overall. Highly recommend!', date: '2 weeks ago' },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState(0);

  const stats = [
    { label: 'Total Views', value: '12,847', change: '+18.5%', trend: 'up', icon: <VisibilityIcon />, color: '#00838F' },
    { label: 'Unique Visitors', value: '4,293', change: '+12.3%', trend: 'up', icon: <PeopleIcon />, color: '#4CAF50' },
    { label: 'Bookings', value: '156', change: '+8.7%', trend: 'up', icon: <EventIcon />, color: '#FF9800' },
    { label: 'Conversion Rate', value: '3.6%', change: '+0.5%', trend: 'up', icon: <StarIcon />, color: '#EB1948' },
  ];

  const formatCurrency = (value: number) => `₦${(value / 1000000).toFixed(1)}M`;
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 24, color: '#002528' }}>
          Analytics
        </Typography>
        <Tabs
          value={timeRange}
          onChange={(_, v) => setTimeRange(v)}
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            border: '1px solid #CCFDF2',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 80 },
            '& .Mui-selected': { color: '#00838F' },
            '& .MuiTabs-indicator': { bgcolor: '#00838F' },
          }}
        >
          <Tab label="7 Days" />
          <Tab label="30 Days" />
          <Tab label="90 Days" />
          <Tab label="1 Year" />
        </Tabs>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: stat.trend === 'up' ? '#4CAF50' : '#f44336' }}>
                  {stat.trend === 'up' ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  <Typography sx={{ fontSize: 13, fontWeight: 600, ml: 0.5 }}>{stat.change}</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 28, color: '#002528' }}>{stat.value}</Typography>
              <Typography sx={{ fontSize: 14, color: '#666' }}>{stat.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Revenue Chart & Package Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2', boxShadow: 'none', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#002528' }}>Revenue Overview</Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#00838F' }}>
                {formatCurrency(monthlyRevenue.reduce((sum, m) => sum + m.value, 0))}
              </Typography>
            </Box>
            {/* Simple Bar Chart */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 200 }}>
              {monthlyRevenue.map((month, index) => (
                <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#002528', mb: 0.5 }}>
                    {formatCurrency(month.value)}
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: `${(month.value / maxRevenue) * 150}px`,
                      bgcolor: '#00838F',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                      '&:hover': { bgcolor: '#006b75' },
                    }}
                  />
                  <Typography sx={{ fontSize: 12, color: '#666', mt: 1 }}>{month.month}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2', boxShadow: 'none', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#002528', mb: 3 }}>Bookings by Package</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {bookingsByPackage.map((pkg, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#002528' }}>{pkg.name}</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: pkg.color }}>{pkg.value} bookings</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(pkg.value / Math.max(...bookingsByPackage.map(p => p.value))) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: '#f5f5f5',
                      '& .MuiLinearProgress-bar': { bgcolor: pkg.color, borderRadius: 5 },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Traffic Sources & Top Services */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2', boxShadow: 'none' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#002528', mb: 3 }}>Traffic Sources</Typography>
            {trafficSources.map((source, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 14, color: '#002528' }}>{source.source}</Typography>
                  <Typography sx={{ fontSize: 14, color: '#666' }}>{source.visits.toLocaleString()} visits</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={source.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#f5f5f5',
                    '& .MuiLinearProgress-bar': { bgcolor: '#00838F', borderRadius: 4 },
                  }}
                />
              </Box>
            ))}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2', boxShadow: 'none' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#002528', mb: 3 }}>Top Performing Services</Typography>
            {topPerformingServices.map((service, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: index < topPerformingServices.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#002528' }}>{service.service}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#666' }}>{service.bookings} bookings</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#002528' }}>
                    ₦{(service.revenue / 1000000).toFixed(1)}M
                  </Typography>
                  <Chip
                    label={`${service.growth > 0 ? '+' : ''}${service.growth}%`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 11,
                      bgcolor: service.growth > 0 ? '#E8F5E9' : '#FFEBEE',
                      color: service.growth > 0 ? '#4CAF50' : '#f44336',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>

      {/* Recent Reviews */}
      <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2', boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <StarIcon sx={{ color: '#FF9800' }} />
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#002528' }}>Recent Reviews</Typography>
          <Chip label="4.8 avg" size="small" sx={{ bgcolor: '#FFF3E0', color: '#FF9800', fontWeight: 600 }} />
        </Box>
        <Grid container spacing={3}>
          {recentReviews.map((review, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#002528' }}>{review.couple}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.25 }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} sx={{ fontSize: 16, color: i < review.rating ? '#FF9800' : '#ddd' }} />
                    ))}
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 14, color: '#666', mb: 1, lineHeight: 1.5 }}>"{review.comment}"</Typography>
                <Typography sx={{ fontSize: 12, color: '#999' }}>{review.date}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
}
