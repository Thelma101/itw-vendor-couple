import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  TextField,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  InputAdornment,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PercentIcon from '@mui/icons-material/Percent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bundle' | 'earlybird' | 'lastminute';
  discount: number;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  minBookingValue?: number;
  applicableServices: string[];
  isActive: boolean;
  views: number;
  conversions: number;
}

const mockPromotions: Promotion[] = [
  {
    id: 'P001',
    name: 'Early Bird 2026 Discount',
    type: 'percentage',
    discount: 15,
    code: 'EARLY2026',
    description: 'Book your 2026 wedding before March 2026 and save 15% on any package',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    usageLimit: 50,
    usedCount: 23,
    minBookingValue: 500000,
    applicableServices: ['Premium Package', 'Luxury Package', 'Destination Package'],
    isActive: true,
    views: 1250,
    conversions: 23,
  },
  {
    id: 'P002',
    name: 'Valentine Special',
    type: 'bundle',
    discount: 0,
    code: 'LOVE2026',
    description: 'Free engagement shoot with any full-day wedding package booked in February',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    usageLimit: 20,
    usedCount: 8,
    applicableServices: ['Full-Day Package', 'Premium Package', 'Luxury Package'],
    isActive: true,
    views: 890,
    conversions: 8,
  },
  {
    id: 'P003',
    name: 'Weekday Wedding Discount',
    type: 'percentage',
    discount: 20,
    code: 'WEEKDAY20',
    description: 'Get 20% off for weddings held Monday through Thursday',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 100,
    usedCount: 34,
    applicableServices: ['All Services'],
    isActive: true,
    views: 2100,
    conversions: 34,
  },
  {
    id: 'P004',
    name: 'Last Minute Flash Sale',
    type: 'fixed',
    discount: 100000,
    code: 'FLASH100K',
    description: '₦100,000 off for bookings within the next 2 weeks',
    startDate: '2026-01-10',
    endDate: '2026-01-24',
    usageLimit: 5,
    usedCount: 5,
    minBookingValue: 350000,
    applicableServices: ['Available dates only'],
    isActive: false,
    views: 450,
    conversions: 5,
  },
  {
    id: 'P005',
    name: 'Referral Reward',
    type: 'percentage',
    discount: 10,
    code: 'REFER10',
    description: 'Referred couples get 10% off their booking',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    usageLimit: 200,
    usedCount: 67,
    applicableServices: ['All Services'],
    isActive: true,
    views: 3200,
    conversions: 67,
  },
];

export default function Promotions() {
  const [activeTab, setActiveTab] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const totalBookingsFromPromos = 137;
  const conversionRate = 5.8;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <PercentIcon />;
      case 'fixed':
        return <AttachMoneyIcon />;
      case 'bundle':
        return <CardGiftcardIcon />;
      default:
        return <LocalOfferIcon />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return { bg: '#e3f2fd', color: '#1976d2' };
      case 'fixed':
        return { bg: '#e8f5e9', color: '#2e7d32' };
      case 'bundle':
        return { bg: '#fce4ec', color: '#c2185b' };
      case 'earlybird':
        return { bg: '#fff3e0', color: '#e65100' };
      case 'lastminute':
        return { bg: '#f3e5f5', color: '#7b1fa2' };
      default:
        return { bg: '#f5f5f5', color: '#666' };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const activePromotions = mockPromotions.filter((p) => p.isActive);
  const expiredPromotions = mockPromotions.filter((p) => !p.isActive);

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
            Promotions & Offers
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>
            Create special offers to attract more bookings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            textTransform: 'none',
            bgcolor: '#00838F',
            '&:hover': { bgcolor: '#006064' },
            borderRadius: 2,
          }}
        >
          Create Promotion
        </Button>
      </Box>

      {/* Stats Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
        <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <LocalOfferIcon sx={{ fontSize: 40, color: '#00838F', mb: 1 }} />
          <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#002528' }}>
            {activePromotions.length}
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>Active Promotions</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <TrendingUpIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
          <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#002528' }}>
            {totalBookingsFromPromos}
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>Total Promo Bookings</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <VisibilityIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
          <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#002528' }}>
            {conversionRate}%
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>Conversion Rate</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <AttachMoneyIcon sx={{ fontSize: 40, color: '#c2185b', mb: 1 }} />
          <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#002528' }}>
            ₦2.45M
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>Savings Offered</Typography>
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
          <Tab label={`Active (${activePromotions.length})`} />
          <Tab label={`Expired (${expiredPromotions.length})`} />
          <Tab label="Scheduled" />
          <Tab label="Analytics" />
        </Tabs>
      </Card>

      {/* Promotions List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {(activeTab === 0 ? activePromotions : expiredPromotions).map((promo) => {
          const typeStyle = getTypeColor(promo.type);
          const daysRemaining = getDaysRemaining(promo.endDate);
          const usagePercentage = (promo.usedCount / promo.usageLimit) * 100;

          return (
            <Card key={promo.id} sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      bgcolor: typeStyle.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: typeStyle.color,
                    }}
                  >
                    {getTypeIcon(promo.type)}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#002528', fontSize: 18 }}>
                      {promo.name}
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: 14 }}>{promo.description}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={promo.isActive}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#00838F' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            bgcolor: '#00838F',
                          },
                        }}
                      />
                    }
                    label={promo.isActive ? 'Active' : 'Inactive'}
                  />
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                {/* Promo Code */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: '#f5f5f5',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: '1px dashed #ccc',
                  }}
                >
                  <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>
                    {promo.code}
                  </Typography>
                  <IconButton size="small">
                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>

                {/* Discount Value */}
                <Chip
                  label={
                    promo.type === 'percentage'
                      ? `${promo.discount}% OFF`
                      : promo.type === 'fixed'
                      ? `${formatCurrency(promo.discount)} OFF`
                      : 'Bundle Deal'
                  }
                  sx={{
                    bgcolor: typeStyle.bg,
                    color: typeStyle.color,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                />

                {/* Dates */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#666' }}>
                  <CalendarTodayIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: 13 }}>
                    {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                  </Typography>
                </Box>

                {/* Days Remaining */}
                {promo.isActive && daysRemaining > 0 && (
                  <Chip
                    icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                    label={`${daysRemaining} days left`}
                    size="small"
                    sx={{
                      bgcolor: daysRemaining <= 7 ? '#fff3e0' : '#e3f2fd',
                      color: daysRemaining <= 7 ? '#e65100' : '#1976d2',
                    }}
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Usage Progress */}
                <Box sx={{ flex: 1, mr: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: 13, color: '#666' }}>
                      Usage: {promo.usedCount} / {promo.usageLimit}
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#002528' }}>
                      {Math.round(usagePercentage)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={usagePercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#eee',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: usagePercentage >= 90 ? '#f44336' : '#00838F',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, color: '#002528' }}>
                      {promo.views.toLocaleString()}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#666' }}>Views</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, color: '#002528' }}>
                      {promo.conversions}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#666' }}>Conversions</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, color: '#4CAF50' }}>
                      {((promo.conversions / promo.views) * 100).toFixed(1)}%
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#666' }}>Conv. Rate</Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  sx={{
                    ml: 3,
                    textTransform: 'none',
                    borderColor: '#00838F',
                    color: '#00838F',
                  }}
                >
                  Share
                </Button>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* Create Promotion Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Promotion</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Promotion Name"
              placeholder="e.g., Summer Wedding Special"
            />
            <Select fullWidth defaultValue="percentage" displayEmpty>
              <MenuItem value="percentage">Percentage Discount</MenuItem>
              <MenuItem value="fixed">Fixed Amount Off</MenuItem>
              <MenuItem value="bundle">Bundle Deal / Free Add-on</MenuItem>
            </Select>
            <TextField
              fullWidth
              label="Discount Value"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}
            />
            <TextField fullWidth label="Promo Code" placeholder="e.g., SUMMER2026" />
            <TextField fullWidth label="Description" multiline rows={2} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} />
              <TextField fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} />
            </Box>
            <TextField fullWidth label="Usage Limit" type="number" placeholder="50" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ textTransform: 'none', bgcolor: '#00838F', '&:hover': { bgcolor: '#006064' } }}
          >
            Create Promotion
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
