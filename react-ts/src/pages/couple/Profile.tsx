import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Avatar,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'Thelma',
    lastName: 'Akpata',
    email: 'thelma.akpata@email.com',
    phone: '+234 812 345 6789',
    partnerName: 'James',
    weddingDate: '2026-06-15',
    bio: 'Planning our dream wedding together! 💍',
    location: 'Lagos, Nigeria',
    avatar: 'https://www.figma.com/api/mcp/asset/bcffd6cc-e39b-4753-8297-cc196391845c'
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailMessages: true,
    emailPromotions: false,
    pushBookings: true,
    pushMessages: true,
    pushReminders: true
  });

  const handleSaveProfile = () => {
    setEditMode(false);
    setSnackbarMessage('Profile updated successfully!');
    setSnackbarOpen(true);
  };

  const handleLogout = () => {
    setLogoutDialog(false);
    // In a real app, clear auth tokens here
    navigate('/');
  };

  const handleDeleteAccount = () => {
    setDeleteDialog(false);
    // In a real app, call API to delete account
    navigate('/');
  };

  return (
    <Box sx={{ backgroundColor: '#FFF6F9', minHeight: '100vh' }}>
      <Nav />
      
      {/* Header */}
      <Box sx={{ px: 4, py: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: '#002528',
            textTransform: 'none',
            mb: 2
          }}
        >
          Back
        </Button>

        <Typography sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: 28,
          color: '#002528',
          mb: 1
        }}>
          My Profile
        </Typography>
      </Box>

      <Box sx={{ px: 4, pb: 4, display: 'flex', gap: 3 }}>
        {/* Left Sidebar - Profile Card */}
        <Box sx={{ width: 300 }}>
          <Card sx={{ border: '0.25px solid #00838F', p: 3, textAlign: 'center' }}>
            {/* Avatar */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={profile.avatar}
                sx={{ width: 120, height: 120, mx: 'auto' }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#00838F',
                  color: 'white',
                  width: 36,
                  height: 36,
                  '&:hover': { backgroundColor: '#006d75' }
                }}
              >
                <CameraAltIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: '#002528',
              mb: 0.5
            }}>
              {profile.firstName} & {profile.partnerName}
            </Typography>
            
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              color: '#666',
              mb: 2
            }}>
              {profile.bio}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Quick Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <FavoriteIcon sx={{ fontSize: 16, color: '#EB1948' }} />
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>
                    5
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                  Shortlisted
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <EventIcon sx={{ fontSize: 16, color: '#00838F' }} />
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>
                    3
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                  Booked
                </Typography>
              </Box>
            </Box>

            {profile.weddingDate && (
              <Box sx={{
                p: 2,
                backgroundColor: '#f0fdfa',
                borderRadius: 2,
                mt: 2
              }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                  Wedding Date
                </Typography>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 16, color: '#00838F' }}>
                  {new Date(profile.weddingDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
            )}
          </Card>

          {/* Quick Actions */}
          <Card sx={{ border: '0.25px solid #00838F', p: 2, mt: 2 }}>
            <Button
              fullWidth
              startIcon={<FavoriteIcon />}
              onClick={() => navigate('/couple/shortlist')}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: "'Open Sans', sans-serif",
                textTransform: 'none',
                color: '#002528',
                py: 1.5,
                '&:hover': { backgroundColor: '#f0fdfa' }
              }}
            >
              My Shortlist
            </Button>
            <Button
              fullWidth
              startIcon={<EventIcon />}
              onClick={() => navigate('/couple/my-vendors')}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: "'Open Sans', sans-serif",
                textTransform: 'none',
                color: '#002528',
                py: 1.5,
                '&:hover': { backgroundColor: '#f0fdfa' }
              }}
            >
              My Bookings
            </Button>
            <Divider sx={{ my: 1 }} />
            <Button
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={() => setLogoutDialog(true)}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: "'Open Sans', sans-serif",
                textTransform: 'none',
                color: '#EB1948',
                py: 1.5,
                '&:hover': { backgroundColor: '#fff5f7' }
              }}
            >
              Log Out
            </Button>
          </Card>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ border: '0.25px solid #00838F' }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{
                borderBottom: '1px solid #e0e0e0',
                '& .MuiTab-root': {
                  fontFamily: "'Open Sans', sans-serif",
                  textTransform: 'none',
                  fontWeight: 600
                },
                '& .Mui-selected': { color: '#00838F' },
                '& .MuiTabs-indicator': { backgroundColor: '#00838F' }
              }}
            >
              <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Info" />
              <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />
              <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />
              <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
            </Tabs>

            {/* Personal Info Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#002528'
                  }}>
                    Personal Information
                  </Typography>
                  {!editMode ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        textTransform: 'none',
                        color: '#00838F'
                      }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        onClick={() => setEditMode(false)}
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          textTransform: 'none',
                          color: '#666'
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        sx={{
                          backgroundColor: '#00838F',
                          fontFamily: "'Open Sans', sans-serif",
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#006d75' }
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                  <TextField
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Phone Number"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Partner's Name"
                    value={profile.partnerName}
                    onChange={(e) => setProfile({ ...profile, partnerName: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Wedding Date"
                    type="date"
                    value={profile.weddingDate}
                    onChange={(e) => setProfile({ ...profile, weddingDate: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                  />
                </Box>

                <TextField
                  label="Bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mt: 3, '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                />
              </Box>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#002528',
                  mb: 3
                }}>
                  Notification Preferences
                </Typography>

                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#00838F',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}>
                  Email Notifications
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailBookings}
                        onChange={(e) => setNotifications({ ...notifications, emailBookings: e.target.checked })}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>Booking confirmations and updates</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailMessages}
                        onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>New messages from vendors</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailPromotions}
                        onChange={(e) => setNotifications({ ...notifications, emailPromotions: e.target.checked })}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>Promotions and special offers</Typography>}
                  />
                </Box>

                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#00838F',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}>
                  Push Notifications
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushBookings}
                        onChange={(e) => setNotifications({ ...notifications, pushBookings: e.target.checked })}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>Booking status changes</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushMessages}
                        onChange={(e) => setNotifications({ ...notifications, pushMessages: e.target.checked })}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>New messages</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushReminders}
                        onChange={(e) => setNotifications({ ...notifications, pushReminders: e.target.checked })}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>Payment reminders</Typography>}
                  />
                </Box>
              </Box>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3 }}>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#002528',
                  mb: 3
                }}>
                  Security Settings
                </Typography>

                <Card sx={{ p: 3, border: '1px solid #e0e0e0', mb: 3 }}>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#002528',
                    mb: 1
                  }}>
                    Change Password
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: '#666',
                    mb: 2
                  }}>
                    Update your password to keep your account secure
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Current Password"
                      type="password"
                      fullWidth
                      sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                    />
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                    />
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      sx={{ '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                    />
                    <Button
                      sx={{
                        alignSelf: 'flex-start',
                        backgroundColor: '#00838F',
                        color: 'white',
                        fontFamily: "'Open Sans', sans-serif",
                        textTransform: 'none',
                        px: 3,
                        '&:hover': { backgroundColor: '#006d75' }
                      }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Card>

                <Card sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#002528',
                    mb: 1
                  }}>
                    Two-Factor Authentication
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: '#666',
                    mb: 2
                  }}>
                    Add an extra layer of security to your account
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#00838F',
                      color: '#00838F',
                      fontFamily: "'Open Sans', sans-serif",
                      textTransform: 'none',
                      '&:hover': { backgroundColor: '#f0fdfa' }
                    }}
                  >
                    Enable 2FA
                  </Button>
                </Card>
              </Box>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ p: 3 }}>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#002528',
                  mb: 3
                }}>
                  Account Settings
                </Typography>

                <Card sx={{ p: 3, border: '1px solid #e0e0e0', mb: 3 }}>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#002528',
                    mb: 1
                  }}>
                    Language & Region
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: '#666',
                    mb: 2
                  }}>
                    Set your preferred language and currency
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      select
                      label="Language"
                      defaultValue="en"
                      SelectProps={{ native: true }}
                      sx={{ width: 200, '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                    </TextField>
                    <TextField
                      select
                      label="Currency"
                      defaultValue="ngn"
                      SelectProps={{ native: true }}
                      sx={{ width: 200, '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                    >
                      <option value="ngn">Nigerian Naira (₦)</option>
                      <option value="usd">US Dollar ($)</option>
                      <option value="gbp">British Pound (£)</option>
                    </TextField>
                  </Box>
                </Card>

                <Card sx={{ p: 3, border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#991b1b',
                    mb: 1
                  }}>
                    Danger Zone
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 13,
                    color: '#666',
                    mb: 2
                  }}>
                    Once you delete your account, there is no going back. Please be certain.
                  </Typography>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialog(true)}
                    sx={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      fontFamily: "'Open Sans', sans-serif",
                      textTransform: 'none',
                      '&:hover': { backgroundColor: '#b91c1c' }
                    }}
                  >
                    Delete Account
                  </Button>
                </Card>
              </Box>
            </TabPanel>
          </Card>
        </Box>
      </Box>

      {/* Logout Dialog */}
      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <DialogTitle sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700 }}>
          Log Out
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif" }}>
            Are you sure you want to log out of your account?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)} sx={{ fontFamily: "'Open Sans', sans-serif", textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleLogout} sx={{ fontFamily: "'Open Sans', sans-serif", textTransform: 'none', color: '#EB1948' }}>
            Log Out
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: '#dc2626' }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif" }}>
            This action cannot be undone. All your data, bookings, and conversations will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} sx={{ fontFamily: "'Open Sans', sans-serif", textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} sx={{ fontFamily: "'Open Sans', sans-serif", textTransform: 'none', color: '#dc2626' }}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default Profile;
