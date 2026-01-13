import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MessageIcon from '@mui/icons-material/Message';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EventIcon from '@mui/icons-material/Event';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DownloadIcon from '@mui/icons-material/Download';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const overviewMetrics: MetricCard[] = [
  {
    title: 'Profile Views',
    value: '2,847',
    change: 12.5,
    icon: <VisibilityIcon />,
    color: '#1976d2',
    bgColor: '#e3f2fd',
  },
  {
    title: 'Inquiries Received',
    value: '156',
    change: 8.3,
    icon: <MessageIcon />,
    color: '#00838F',
    bgColor: '#e0f7fa',
  },
  {
    title: 'Shortlisted',
    value: '342',
    change: -2.1,
    icon: <BookmarkIcon />,
    color: '#f57c00',
    bgColor: '#fff3e0',
  },
  {
    title: 'Bookings',
    value: '23',
    change: 15.2,
    icon: <EventIcon />,
    color: '#388e3c',
    bgColor: '#e8f5e9',
  },
];

const monthlyData = [
  { month: 'Jul', views: 1800, inquiries: 89, bookings: 12 },
  { month: 'Aug', views: 2100, inquiries: 105, bookings: 15 },
  { month: 'Sep', views: 2450, inquiries: 118, bookings: 18 },
  { month: 'Oct', views: 2200, inquiries: 98, bookings: 14 },
  { month: 'Nov', views: 2600, inquiries: 134, bookings: 21 },
  { month: 'Dec', views: 2847, inquiries: 156, bookings: 23 },
];

const trafficSources = [
  { source: 'Direct Search', percentage: 45, visits: 1280 },
  { source: 'Vendor Category Browse', percentage: 28, visits: 797 },
  { source: 'Referral Links', percentage: 15, visits: 427 },
  { source: 'Social Media', percentage: 8, visits: 228 },
  { source: 'Other', percentage: 4, visits: 115 },
];

const topServices = [
  { name: 'Premium Photography Package', views: 1250, inquiries: 78, conversion: 6.2 },
  { name: 'Luxury Full-Day Package', views: 890, inquiries: 45, conversion: 5.1 },
  { name: 'Destination Wedding', views: 420, inquiries: 28, conversion: 6.7 },
  { name: 'Essential Package', views: 287, inquiries: 5, conversion: 1.7 },
];

const competitorInsights = [
  { metric: 'Average Response Time', you: '< 2 hours', market: '8 hours', better: true },
  { metric: 'Review Rating', you: '4.8', market: '4.2', better: true },
  { metric: 'Inquiry-to-Booking Rate', you: '14.7%', market: '11.2%', better: true },
  { metric: 'Starting Price', you: '₦350,000', market: '₦300,000', better: false },
];

export default function BusinessInsights() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('last30');

  const conversionRate = 14.7;
  const avgResponseTime = '1.8 hours';
  const revenueThisMonth = 8450000;
  const avgBookingValue = 675000;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(2)}M`;
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: '#002528',
              mb: 0.5,
            }}
          >
            Business Insights
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>
            Deep analytics to grow your wedding business
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              label="Date Range"
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="last7">Last 7 days</MenuItem>
              <MenuItem value="last30">Last 30 days</MenuItem>
              <MenuItem value="last90">Last 90 days</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              textTransform: 'none',
              borderColor: '#00838F',
              color: '#00838F',
            }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Overview Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
        {overviewMetrics.map((metric) => (
          <Card key={metric.title} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: metric.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: metric.color,
                }}
              >
                {metric.icon}
              </Box>
              <Chip
                icon={
                  metric.change > 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 14 }} />
                  )
                }
                label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                size="small"
                sx={{
                  bgcolor: metric.change > 0 ? '#e8f5e9' : '#ffebee',
                  color: metric.change > 0 ? '#2e7d32' : '#c62828',
                  '& .MuiChip-icon': {
                    color: metric.change > 0 ? '#2e7d32' : '#c62828',
                  },
                }}
              />
            </Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#002528', mt: 2 }}>
              {metric.value}
            </Typography>
            <Typography sx={{ color: '#666', fontSize: 14 }}>{metric.title}</Typography>
          </Card>
        ))}
      </Box>

      {/* Key Performance Indicators */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
        <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#00838F', color: 'white' }}>
          <Typography sx={{ fontSize: 14, opacity: 0.9, mb: 1 }}>Conversion Rate</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700 }}>{conversionRate}%</Typography>
          <Typography sx={{ fontSize: 12, opacity: 0.8 }}>Inquiries → Bookings</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#1976d2', color: 'white' }}>
          <Typography sx={{ fontSize: 14, opacity: 0.9, mb: 1 }}>Avg Response Time</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700 }}>{avgResponseTime}</Typography>
          <Typography sx={{ fontSize: 12, opacity: 0.8 }}>To new inquiries</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#388e3c', color: 'white' }}>
          <Typography sx={{ fontSize: 14, opacity: 0.9, mb: 1 }}>Revenue This Month</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700 }}>
            {formatCurrency(revenueThisMonth)}
          </Typography>
          <Typography sx={{ fontSize: 12, opacity: 0.8 }}>From 12 bookings</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#7b1fa2', color: 'white' }}>
          <Typography sx={{ fontSize: 14, opacity: 0.9, mb: 1 }}>Avg Booking Value</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700 }}>
            {formatCurrency(avgBookingValue)}
          </Typography>
          <Typography sx={{ fontSize: 12, opacity: 0.8 }}>Per wedding</Typography>
        </Card>
      </Box>

      {/* Tabs */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            borderBottom: '1px solid #eee',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
            '& .Mui-selected': { color: '#00838F' },
            '& .MuiTabs-indicator': { bgcolor: '#00838F' },
          }}
        >
          <Tab label="Traffic & Views" />
          <Tab label="Service Performance" />
          <Tab label="Market Comparison" />
          <Tab label="Revenue Analytics" />
        </Tabs>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
          {/* Traffic Trend */}
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 600, color: '#002528', mb: 3 }}>
              Monthly Trend
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {monthlyData.map((data) => (
                <Box key={data.month} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ width: 40, color: '#666' }}>{data.month}</Typography>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        height: 24,
                        borderRadius: 1,
                        bgcolor: '#e3f2fd',
                        width: `${(data.views / 3000) * 100}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 12, color: '#1976d2', fontWeight: 600 }}>
                        {data.views.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, minWidth: 150 }}>
                    <Chip
                      label={`${data.inquiries} inquiries`}
                      size="small"
                      sx={{ bgcolor: '#e0f7fa', color: '#00838F', fontSize: 11 }}
                    />
                    <Chip
                      label={`${data.bookings} booked`}
                      size="small"
                      sx={{ bgcolor: '#e8f5e9', color: '#388e3c', fontSize: 11 }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Traffic Sources */}
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 600, color: '#002528', mb: 3 }}>
              Traffic Sources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {trafficSources.map((source) => (
                <Box key={source.source}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: 14, color: '#002528' }}>{source.source}</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#00838F' }}>
                      {source.percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={source.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#eee',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#00838F',
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: 12, color: '#999', mt: 0.5 }}>
                    {source.visits.toLocaleString()} visits
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      )}

      {activeTab === 1 && (
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 600, color: '#002528', mb: 3 }}>
            Service Performance
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: 2,
                py: 2,
                borderBottom: '2px solid #eee',
              }}
            >
              <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 13 }}>Service</Typography>
              <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 13, textAlign: 'center' }}>
                Views
              </Typography>
              <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 13, textAlign: 'center' }}>
                Inquiries
              </Typography>
              <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 13, textAlign: 'center' }}>
                Conversion
              </Typography>
            </Box>
            {/* Rows */}
            {topServices.map((service, index) => (
              <Box
                key={service.name}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: 2,
                  py: 2,
                  borderBottom: index < topServices.length - 1 ? '1px solid #eee' : 'none',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 500, color: '#002528' }}>{service.name}</Typography>
                <Typography sx={{ textAlign: 'center', color: '#666' }}>
                  {service.views.toLocaleString()}
                </Typography>
                <Typography sx={{ textAlign: 'center', color: '#00838F', fontWeight: 600 }}>
                  {service.inquiries}
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip
                    label={`${service.conversion}%`}
                    size="small"
                    sx={{
                      bgcolor: service.conversion >= 5 ? '#e8f5e9' : '#fff3e0',
                      color: service.conversion >= 5 ? '#2e7d32' : '#f57c00',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      )}

      {activeTab === 2 && (
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <CompareArrowsIcon sx={{ color: '#00838F' }} />
            <Typography sx={{ fontWeight: 600, color: '#002528' }}>
              How You Compare to Market Averages
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {competitorInsights.map((insight, index) => (
              <Box
                key={insight.metric}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: 2,
                  py: 3,
                  borderBottom: index < competitorInsights.length - 1 ? '1px solid #eee' : 'none',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 500, color: '#002528' }}>{insight.metric}</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, color: '#666', mb: 0.5 }}>You</Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: insight.better ? '#2e7d32' : '#002528',
                    }}
                  >
                    {insight.you}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, color: '#666', mb: 0.5 }}>Market Avg</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: 18, color: '#666' }}>
                    {insight.market}
                  </Typography>
                </Box>
                <Chip
                  icon={
                    insight.better ? (
                      <TrendingUpIcon sx={{ fontSize: 14 }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 14 }} />
                    )
                  }
                  label={insight.better ? 'Above Market' : 'Below Market'}
                  size="small"
                  sx={{
                    bgcolor: insight.better ? '#e8f5e9' : '#fff3e0',
                    color: insight.better ? '#2e7d32' : '#f57c00',
                    '& .MuiChip-icon': {
                      color: insight.better ? '#2e7d32' : '#f57c00',
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography sx={{ fontSize: 14, color: '#666', fontStyle: 'italic' }}>
            💡 Tip: Your response time is excellent! Consider adding more competitive pricing tiers
            to capture budget-conscious couples.
          </Typography>
        </Card>
      )}
    </Box>
  );
}
