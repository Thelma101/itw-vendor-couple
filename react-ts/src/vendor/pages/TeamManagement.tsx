import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Avatar,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  AvatarGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BlockIcon from '@mui/icons-material/Block';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'owner' | 'admin' | 'photographer' | 'assistant' | 'editor';
  status: 'active' | 'pending' | 'inactive';
  permissions: string[];
  joinDate: string;
  lastActive: string;
  assignedBookings: number;
  completedJobs: number;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: 'T001',
    name: 'Thelma Akpata',
    email: 'thelma@itheewedevents.ng',
    phone: '+234 803 555 1001',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'owner',
    status: 'active',
    permissions: ['all'],
    joinDate: '2020-01-15',
    lastActive: '2026-01-13',
    assignedBookings: 24,
    completedJobs: 312,
  },
  {
    id: 'T002',
    name: 'Adaeze Okonkwo',
    email: 'ada@itheewedevents.ng',
    phone: '+234 805 555 2002',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'admin',
    status: 'active',
    permissions: ['bookings', 'messages', 'calendar', 'reviews', 'leads'],
    joinDate: '2021-06-20',
    lastActive: '2026-01-15',
    assignedBookings: 18,
    completedJobs: 156,
  },
  {
    id: 'T003',
    name: 'Chukwuemeka Nnamdi',
    email: 'emeka@itheewedevents.ng',
    phone: '+234 806 555 3003',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    role: 'photographer',
    status: 'active',
    permissions: ['calendar', 'assigned_bookings'],
    joinDate: '2022-03-10',
    lastActive: '2026-01-14',
    assignedBookings: 12,
    completedJobs: 89,
  },
  {
    id: 'T004',
    name: 'Fatima Hassan',
    email: 'fatima@itheewedevents.ng',
    phone: '+234 807 555 4004',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    role: 'photographer',
    status: 'active',
    permissions: ['calendar', 'assigned_bookings'],
    joinDate: '2023-01-08',
    lastActive: '2026-01-15',
    assignedBookings: 8,
    completedJobs: 45,
  },
  {
    id: 'T005',
    name: 'David Obi',
    email: 'david@itheewedevents.ng',
    phone: '+234 808 555 5005',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    role: 'assistant',
    status: 'active',
    permissions: ['calendar', 'assigned_bookings'],
    joinDate: '2024-02-15',
    lastActive: '2026-01-13',
    assignedBookings: 6,
    completedJobs: 28,
  },
  {
    id: 'T006',
    name: 'Grace Akpan',
    email: 'grace@itheewedevents.ng',
    phone: '+234 809 555 6006',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    role: 'editor',
    status: 'pending',
    permissions: ['gallery'],
    joinDate: '2026-01-10',
    lastActive: '2026-01-10',
    assignedBookings: 0,
    completedJobs: 0,
  },
];

const roleConfig = {
  owner: { label: 'Owner', color: '#7b1fa2', bg: '#f3e5f5' },
  admin: { label: 'Admin', color: '#1976d2', bg: '#e3f2fd' },
  photographer: { label: 'Photographer', color: '#00838F', bg: '#e0f7fa' },
  assistant: { label: 'Assistant', color: '#388e3c', bg: '#e8f5e9' },
  editor: { label: 'Editor', color: '#f57c00', bg: '#fff3e0' },
};

const statusConfig = {
  active: { label: 'Active', color: '#2e7d32', bg: '#e8f5e9', icon: CheckCircleIcon },
  pending: { label: 'Pending Invite', color: '#f57c00', bg: '#fff3e0', icon: PendingIcon },
  inactive: { label: 'Inactive', color: '#d32f2f', bg: '#ffebee', icon: BlockIcon },
};

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return <AdminPanelSettingsIcon />;
      case 'photographer':
        return <PhotoCameraIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setDetailDialogOpen(true);
  };

  const activeMembers = mockTeamMembers.filter((m) => m.status === 'active');
  const pendingMembers = mockTeamMembers.filter((m) => m.status === 'pending');

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
            Team Management
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>
            Manage your team members and their permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setInviteDialogOpen(true)}
          sx={{
            textTransform: 'none',
            bgcolor: '#00838F',
            '&:hover': { bgcolor: '#006064' },
            borderRadius: 2,
          }}
        >
          Invite Team Member
        </Button>
      </Box>

      {/* Team Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
        <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <AvatarGroup
            max={4}
            sx={{
              justifyContent: 'center',
              mb: 2,
              '& .MuiAvatar-root': { width: 40, height: 40, border: '2px solid white' },
            }}
          >
            {mockTeamMembers.slice(0, 5).map((member) => (
              <Avatar key={member.id} src={member.avatar} />
            ))}
          </AvatarGroup>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#002528' }}>
            {mockTeamMembers.length}
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>Total Members</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#002528' }}>
            {activeMembers.length}
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>Active</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <PendingIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#002528' }}>
            {pendingMembers.length}
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>Pending Invites</Typography>
        </Card>
        <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <CalendarTodayIcon sx={{ fontSize: 40, color: '#00838F', mb: 1 }} />
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#002528' }}>68</Typography>
          <Typography sx={{ color: '#666', fontSize: 14 }}>Total Assigned Jobs</Typography>
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
          <Tab label={`All Members (${mockTeamMembers.length})`} />
          <Tab label="Photographers" />
          <Tab label="Admins" />
          <Tab label="Roles & Permissions" />
        </Tabs>
      </Card>

      {/* Team Members Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
        {mockTeamMembers.map((member) => {
          const role = roleConfig[member.role];
          const status = statusConfig[member.status];
          const StatusIcon = status.icon;

          return (
            <Card
              key={member.id}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
              }}
              onClick={() => handleMemberClick(member)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar src={member.avatar} sx={{ width: 64, height: 64 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#002528', fontSize: 18 }}>
                      {member.name}
                    </Typography>
                    <Chip
                      icon={getRoleIcon(member.role)}
                      label={role.label}
                      size="small"
                      sx={{
                        bgcolor: role.bg,
                        color: role.color,
                        mt: 0.5,
                        '& .MuiChip-icon': { color: role.color },
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Chip
                    icon={<StatusIcon sx={{ fontSize: 14 }} />}
                    label={status.label}
                    size="small"
                    sx={{
                      bgcolor: status.bg,
                      color: status.color,
                      '& .MuiChip-icon': { color: status.color },
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
                  <EmailIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: 14 }}>{member.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
                  <PhoneIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: 14 }}>{member.phone}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#002528' }}>
                      {member.assignedBookings}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#666' }}>Assigned</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#002528' }}>
                      {member.completedJobs}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#666' }}>Completed</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 12, color: '#999' }}>
                  Last active: {formatDate(member.lastActive)}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* Invite Team Member Dialog */}
      <Dialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Invite Team Member</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField fullWidth label="Full Name" placeholder="Enter team member's name" />
            <TextField fullWidth label="Email Address" type="email" placeholder="email@example.com" />
            <TextField fullWidth label="Phone Number" placeholder="+234 800 000 0000" />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select defaultValue="" label="Role">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="photographer">Photographer</MenuItem>
                <MenuItem value="assistant">Assistant</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </FormControl>
            <Typography sx={{ fontWeight: 600, color: '#002528', mt: 1 }}>Permissions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={<Switch defaultChecked sx={{ '& .Mui-checked': { color: '#00838F' } }} />}
                label="View Calendar & Bookings"
              />
              <FormControlLabel
                control={<Switch sx={{ '& .Mui-checked': { color: '#00838F' } }} />}
                label="Manage Messages"
              />
              <FormControlLabel
                control={<Switch sx={{ '& .Mui-checked': { color: '#00838F' } }} />}
                label="View Analytics"
              />
              <FormControlLabel
                control={<Switch sx={{ '& .Mui-checked': { color: '#00838F' } }} />}
                label="Manage Gallery"
              />
              <FormControlLabel
                control={<Switch sx={{ '& .Mui-checked': { color: '#00838F' } }} />}
                label="Respond to Reviews"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setInviteDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ textTransform: 'none', bgcolor: '#00838F', '&:hover': { bgcolor: '#006064' } }}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Member Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Team Member Details
          <IconButton sx={{ position: 'absolute', right: 16, top: 12 }}>
            <MoreVertIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Avatar src={selectedMember.avatar} sx={{ width: 80, height: 80 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#002528' }}>
                    {selectedMember.name}
                  </Typography>
                  <Chip
                    label={roleConfig[selectedMember.role].label}
                    size="small"
                    sx={{
                      bgcolor: roleConfig[selectedMember.role].bg,
                      color: roleConfig[selectedMember.role].color,
                      mt: 0.5,
                    }}
                  />
                  <Typography sx={{ fontSize: 14, color: '#666', mt: 1 }}>
                    Member since {formatDate(selectedMember.joinDate)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon sx={{ color: '#666' }} />
                  <Typography>{selectedMember.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon sx={{ color: '#666' }} />
                  <Typography>{selectedMember.phone}</Typography>
                </Box>
              </Box>

              <Typography sx={{ fontWeight: 600, color: '#002528', mb: 2 }}>
                Performance
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#00838F' }}>
                    {selectedMember.assignedBookings}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#666' }}>Current Assignments</Typography>
                </Card>
                <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#4CAF50' }}>
                    {selectedMember.completedJobs}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#666' }}>Jobs Completed</Typography>
                </Card>
              </Box>

              <Typography sx={{ fontWeight: 600, color: '#002528', mb: 2 }}>Permissions</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedMember.permissions.map((permission) => (
                  <Chip key={permission} label={permission} size="small" sx={{ bgcolor: '#e3f2fd' }} />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            sx={{ textTransform: 'none' }}
          >
            Remove Member
          </Button>
          <Box>
            <Button onClick={() => setDetailDialogOpen(false)} sx={{ textTransform: 'none' }}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ textTransform: 'none', ml: 1, bgcolor: '#00838F', '&:hover': { bgcolor: '#006064' } }}
            >
              Edit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
