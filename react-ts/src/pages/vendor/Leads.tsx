import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CancelIcon from '@mui/icons-material/Cancel';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

interface Lead {
  id: string;
  coupleName: string;
  email: string;
  phone: string;
  weddingDate: string;
  budget: string;
  eventType: string;
  guestCount: number;
  message: string;
  source: 'website' | 'referral' | 'social' | 'direct';
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiating' | 'won' | 'lost';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  lastContact: string;
  avatar: string;
  notes: string[];
  value: number;
}

const mockLeads: Lead[] = [
  {
    id: 'L001',
    coupleName: 'Chioma & David',
    email: 'chioma.david@email.com',
    phone: '+234 801 234 5678',
    weddingDate: '2026-06-15',
    budget: '₦2,000,000 - ₦3,000,000',
    eventType: 'Traditional + White Wedding',
    guestCount: 350,
    message: 'We love your work! Looking for a photographer who can capture both our traditional and white wedding ceremonies.',
    source: 'website',
    status: 'new',
    priority: 'high',
    createdAt: '2026-01-13T10:30:00',
    lastContact: '2026-01-13T10:30:00',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    notes: [],
    value: 2500000,
  },
  {
    id: 'L002',
    coupleName: 'Amaka & Tunde',
    email: 'amaka.tunde@gmail.com',
    phone: '+234 802 345 6789',
    weddingDate: '2026-08-22',
    budget: '₦1,500,000 - ₦2,000,000',
    eventType: 'White Wedding',
    guestCount: 200,
    message: 'Interested in your Premium package. Can we schedule a call?',
    source: 'referral',
    status: 'contacted',
    priority: 'high',
    createdAt: '2026-01-12T14:20:00',
    lastContact: '2026-01-13T09:00:00',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    notes: ['Called and discussed requirements', 'Sending proposal tomorrow'],
    value: 1800000,
  },
  {
    id: 'L003',
    coupleName: 'Sarah & Michael',
    email: 'sarah.michael@yahoo.com',
    phone: '+234 803 456 7890',
    weddingDate: '2026-04-10',
    budget: '₦500,000 - ₦800,000',
    eventType: 'Intimate Wedding',
    guestCount: 80,
    message: 'Looking for a simple but elegant setup for our intimate ceremony.',
    source: 'social',
    status: 'proposal_sent',
    priority: 'medium',
    createdAt: '2026-01-10T11:45:00',
    lastContact: '2026-01-12T16:30:00',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    notes: ['Met in person', 'Proposal sent via email', 'Waiting for response'],
    value: 650000,
  },
  {
    id: 'L004',
    coupleName: 'Blessing & Emeka',
    email: 'blessing.emeka@email.com',
    phone: '+234 804 567 8901',
    weddingDate: '2026-12-18',
    budget: '₦3,000,000+',
    eventType: 'Destination Wedding',
    guestCount: 150,
    message: 'Planning a destination wedding in Dubai. Need full coverage.',
    source: 'direct',
    status: 'negotiating',
    priority: 'high',
    createdAt: '2026-01-08T09:15:00',
    lastContact: '2026-01-13T11:00:00',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    notes: ['High budget client', 'Negotiating travel costs', 'Very interested'],
    value: 3500000,
  },
  {
    id: 'L005',
    coupleName: 'Fatima & Ibrahim',
    email: 'fatima.ibrahim@outlook.com',
    phone: '+234 805 678 9012',
    weddingDate: '2026-05-20',
    budget: '₦800,000 - ₦1,200,000',
    eventType: 'Nikkai Ceremony',
    guestCount: 250,
    message: 'Need coverage for our Nikkai ceremony with cultural sensitivity.',
    source: 'website',
    status: 'won',
    priority: 'medium',
    createdAt: '2026-01-05T13:00:00',
    lastContact: '2026-01-11T14:00:00',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    notes: ['Contract signed', 'Deposit received', 'Pre-wedding shoot scheduled'],
    value: 1000000,
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: 'New', color: '#1976d2', bgColor: '#e3f2fd' },
  contacted: { label: 'Contacted', color: '#9c27b0', bgColor: '#f3e5f5' },
  qualified: { label: 'Qualified', color: '#ff9800', bgColor: '#fff3e0' },
  proposal_sent: { label: 'Proposal Sent', color: '#00838F', bgColor: '#e0f7fa' },
  negotiating: { label: 'Negotiating', color: '#ed6c02', bgColor: '#fff8e1' },
  won: { label: 'Won', color: '#2e7d32', bgColor: '#e8f5e9' },
  lost: { label: 'Lost', color: '#d32f2f', bgColor: '#ffebee' },
};

const priorityConfig: Record<string, { color: string }> = {
  high: { color: '#d32f2f' },
  medium: { color: '#ed6c02' },
  low: { color: '#2e7d32' },
};

export default function Leads() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setActionLeadId] = useState<string | null>(null);

  const leads = mockLeads;

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.coupleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    if (activeTab === 0) return matchesSearch && matchesStatus;
    if (activeTab === 1) return matchesSearch && matchesStatus && lead.status === 'new';
    if (activeTab === 2) return matchesSearch && matchesStatus && ['contacted', 'qualified', 'proposal_sent', 'negotiating'].includes(lead.status);
    if (activeTab === 3) return matchesSearch && matchesStatus && lead.status === 'won';
    if (activeTab === 4) return matchesSearch && matchesStatus && lead.status === 'lost';
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    active: leads.filter(l => ['contacted', 'qualified', 'proposal_sent', 'negotiating'].includes(l.status)).length,
    won: leads.filter(l => l.status === 'won').length,
    conversionRate: Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100),
    pipelineValue: leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((sum, l) => sum + l.value, 0),
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, leadId: string) => {
    setAnchorEl(event.currentTarget);
    setActionLeadId(leadId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionLeadId(null);
  };

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
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
            Leads & Inquiries
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>
            Manage your wedding inquiries and convert them to bookings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<NoteAddIcon />}
          sx={{
            bgcolor: '#00838F',
            '&:hover': { bgcolor: '#006064' },
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          Add Lead
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 4 }}>
        <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2' }}>
          <Typography sx={{ color: '#666', fontSize: 12, mb: 1 }}>Total Leads</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 28, color: '#002528' }}>{stats.total}</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2' }}>
          <Typography sx={{ color: '#666', fontSize: 12, mb: 1 }}>New Inquiries</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 28, color: '#1976d2' }}>{stats.new}</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2' }}>
          <Typography sx={{ color: '#666', fontSize: 12, mb: 1 }}>Active Pipeline</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 28, color: '#ff9800' }}>{stats.active}</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2' }}>
          <Typography sx={{ color: '#666', fontSize: 12, mb: 1 }}>Conversion Rate</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 28, color: '#2e7d32' }}>{stats.conversionRate}%</Typography>
            <TrendingUpIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
          </Box>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #CCFDF2' }}>
          <Typography sx={{ color: '#666', fontSize: 12, mb: 1 }}>Pipeline Value</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#00838F' }}>{formatCurrency(stats.pipelineValue)}</Typography>
        </Card>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search leads..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <MenuItem key={key} value={key}>{config.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button startIcon={<FilterListIcon />} sx={{ textTransform: 'none' }}>
            More Filters
          </Button>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
            '& .Mui-selected': { color: '#00838F' },
            '& .MuiTabs-indicator': { bgcolor: '#00838F' },
          }}
        >
          <Tab label={`All (${leads.length})`} />
          <Tab label={`New (${stats.new})`} />
          <Tab label={`In Progress (${stats.active})`} />
          <Tab label={`Won (${stats.won})`} />
          <Tab label="Lost" />
        </Tabs>
      </Card>

      {/* Leads List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredLeads.map((lead) => (
          <Card
            key={lead.id}
            sx={{
              p: 3,
              borderRadius: 3,
              border: lead.status === 'new' ? '2px solid #1976d2' : '1px solid #eee',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
            }}
            onClick={() => openLeadDetails(lead)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                <Avatar src={lead.avatar} sx={{ width: 56, height: 56 }} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#002528' }}>
                      {lead.coupleName}
                    </Typography>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: priorityConfig[lead.priority].color,
                      }}
                    />
                    <Chip
                      label={statusConfig[lead.status].label}
                      size="small"
                      sx={{
                        bgcolor: statusConfig[lead.status].bgColor,
                        color: statusConfig[lead.status].color,
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                    {lead.status === 'new' && (
                      <Chip label="NEW" size="small" sx={{ bgcolor: '#1976d2', color: 'white', fontSize: 10 }} />
                    )}
                  </Box>
                  <Typography sx={{ color: '#666', fontSize: 13, mb: 1 }}>
                    {lead.eventType} • {lead.guestCount} guests • {lead.budget}
                  </Typography>
                  <Typography sx={{ color: '#444', fontSize: 14, mb: 1.5 }} noWrap>
                    "{lead.message}"
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EventIcon sx={{ fontSize: 16, color: '#00838F' }} />
                      <Typography sx={{ fontSize: 12, color: '#666' }}>
                        Wedding: {formatDate(lead.weddingDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                      <Typography sx={{ fontSize: 12, color: '#666' }}>
                        Last contact: {getTimeAgo(lead.lastContact)}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, color: '#999' }}>
                      Source: {lead.source}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#00838F' }}>
                  {formatCurrency(lead.value)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Send Email">
                    <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                      <EmailIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Call">
                    <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                      <PhoneIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="WhatsApp">
                    <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                      <WhatsAppIcon sx={{ fontSize: 18, color: '#25D366' }} />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, lead.id);
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Progress indicator for pipeline leads */}
            {['contacted', 'qualified', 'proposal_sent', 'negotiating'].includes(lead.status) && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 11, color: '#666' }}>Pipeline Progress</Typography>
                  <Typography sx={{ fontSize: 11, color: '#666' }}>
                    {['contacted', 'qualified', 'proposal_sent', 'negotiating'].indexOf(lead.status) + 1}/4
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={((['contacted', 'qualified', 'proposal_sent', 'negotiating'].indexOf(lead.status) + 1) / 4) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#eee',
                    '& .MuiLinearProgress-bar': { bgcolor: '#00838F', borderRadius: 3 },
                  }}
                />
              </Box>
            )}
          </Card>
        ))}
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} /> Mark as Contacted
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EmailIcon sx={{ mr: 1, fontSize: 18 }} /> Send Proposal
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <StarIcon sx={{ mr: 1, fontSize: 18 }} /> Mark as Won
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: '#d32f2f' }}>
          <CancelIcon sx={{ mr: 1, fontSize: 18 }} /> Mark as Lost
        </MenuItem>
      </Menu>

      {/* Lead Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedLead && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={selectedLead.avatar} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{selectedLead.coupleName}</Typography>
                    <Chip
                      label={statusConfig[selectedLead.status].label}
                      size="small"
                      sx={{
                        bgcolor: statusConfig[selectedLead.status].bgColor,
                        color: statusConfig[selectedLead.status].color,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#00838F' }}>
                  {formatCurrency(selectedLead.value)}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 2, color: '#002528' }}>Contact Information</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ color: '#666', fontSize: 18 }} />
                      <Typography>{selectedLead.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ color: '#666', fontSize: 18 }} />
                      <Typography>{selectedLead.phone}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 2, color: '#002528' }}>Event Details</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography><strong>Type:</strong> {selectedLead.eventType}</Typography>
                    <Typography><strong>Date:</strong> {formatDate(selectedLead.weddingDate)}</Typography>
                    <Typography><strong>Guests:</strong> {selectedLead.guestCount}</Typography>
                    <Typography><strong>Budget:</strong> {selectedLead.budget}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 1, color: '#002528' }}>Message</Typography>
                <Typography sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                  "{selectedLead.message}"
                </Typography>
              </Box>
              {selectedLead.notes.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ fontWeight: 600, mb: 1, color: '#002528' }}>Notes</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {selectedLead.notes.map((note, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#00838F' }} />
                        <Typography sx={{ fontSize: 14 }}>{note}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                sx={{ textTransform: 'none' }}
              >
                Call
              </Button>
              <Button
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                sx={{ textTransform: 'none', color: '#25D366', borderColor: '#25D366' }}
              >
                WhatsApp
              </Button>
              <Button
                variant="contained"
                startIcon={<EmailIcon />}
                sx={{ textTransform: 'none', bgcolor: '#00838F', '&:hover': { bgcolor: '#006064' } }}
              >
                Send Proposal
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
