import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Snackbar,
  Alert,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import {
  CameraAlt as CameraAltIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Event as EventIcon,
  LeaderboardOutlined,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  WorkspacePremiumOutlined,
} from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import { VENDOR_PROFILE } from '@/vendor/lib/vendorProfile'
import { authApi } from '@/shared/lib/api'
import { usePlan } from '@/shared/contexts/PlanContext'
import ReferralInviteCard from '@/shared/components/ReferralInviteCard'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null}
    </div>
  )
}

const fieldSx = {
  '& .MuiInputBase-root': { fontFamily: 'var(--font-ui)' },
  '& .MuiInputLabel-root': { fontFamily: 'var(--font-ui)' },
}

export default function AccountInformation() {
  const navigate = useNavigate()
  const { isPremium } = usePlan()
  const [tabValue, setTabValue] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [logoutDialog, setLogoutDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  const [profile, setProfile] = useState({
    firstName: VENDOR_PROFILE.ownerFirstName as string,
    lastName: 'Okonkwo',
    businessName: VENDOR_PROFILE.businessName as string,
    category: VENDOR_PROFILE.category as string,
    email: 'hello@bloomandco.ng',
    phone: '+234 801 234 5678',
    website: 'https://bloomandco.ng',
    location: VENDOR_PROFILE.location as string,
    bio: 'Full-service wedding planning and styling for couples across Lagos.',
    avatar: VENDOR_PROFILE.avatar,
  })

  const [notifications, setNotifications] = useState({
    emailLeads: true,
    emailBookings: true,
    emailMessages: true,
    emailPromotions: false,
    pushLeads: true,
    pushBookings: true,
    pushMessages: true,
  })

  const handleSaveProfile = () => {
    setEditMode(false)
    setSnackbarMessage('Profile updated successfully!')
    setSnackbarOpen(true)
  }

  const handleLogout = () => {
    setLogoutDialog(false)
    authApi.logout()
    navigate('/signin')
  }

  const handleDeleteAccount = () => {
    setDeleteDialog(false)
    authApi.logout()
    navigate('/')
  }

  return (
    <VendorPageShell
      title="Account"
      subtitle="Business profile, alerts, and security — same calm layout as the couple experience."
      badge={isPremium ? 'Premium' : 'Standard'}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          minWidth: 0,
        }}
      >
        {/* Left sidebar */}
        <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
          <Card
            elevation={0}
            sx={{
              border: '1px solid #CCFBF1',
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: '#fff',
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar src={profile.avatar} sx={{ width: 120, height: 120, mx: 'auto', border: '3px solid #CCFBF1' }} />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#0F766E',
                  color: 'white',
                  width: 36,
                  height: 36,
                  '&:hover': { backgroundColor: '#0D9488' },
                }}
                aria-label="Change photo"
              >
                <CameraAltIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 22,
                color: '#0B2D31',
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              {profile.businessName}
            </Typography>
            <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: '#64748B', mb: 0.5 }}>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#94A3B8', mb: 2 }}>
              {profile.bio.slice(0, 72)}
              {profile.bio.length > 72 ? '…' : ''}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <LeaderboardOutlined sx={{ fontSize: 16, color: '#0F766E' }} />
                  <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18 }}>12</Typography>
                </Box>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#666' }}>Leads</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <EventIcon sx={{ fontSize: 16, color: '#0F766E' }} />
                  <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18 }}>4</Typography>
                </Box>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#666' }}>Bookings</Typography>
              </Box>
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#f0fdfa', borderRadius: 2 }}>
              <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#666' }}>Location</Typography>
              <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: '#0F766E' }}>
                {profile.location}
              </Typography>
            </Box>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid #CCFBF1', p: 2, mt: 2, borderRadius: 3, bgcolor: '#fff' }}>
            <Button
              fullWidth
              startIcon={<WorkspacePremiumOutlined />}
              onClick={() => navigate('/vendor/subscription')}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: 'var(--font-ui)',
                textTransform: 'none',
                color: '#0B2D31',
                py: 1.5,
                '&:hover': { backgroundColor: '#f0fdfa' },
              }}
            >
              {isPremium ? 'Manage plan' : 'Upgrade to Premium'}
            </Button>
            <Button
              fullWidth
              startIcon={<LeaderboardOutlined />}
              onClick={() => navigate('/vendor/leads')}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: 'var(--font-ui)',
                textTransform: 'none',
                color: '#0B2D31',
                py: 1.5,
                '&:hover': { backgroundColor: '#f0fdfa' },
              }}
            >
              Lead inbox
            </Button>
            <Button
              fullWidth
              startIcon={<EventIcon />}
              onClick={() => navigate('/vendor/bookings')}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: 'var(--font-ui)',
                textTransform: 'none',
                color: '#0B2D31',
                py: 1.5,
                '&:hover': { backgroundColor: '#f0fdfa' },
              }}
            >
              Bookings
            </Button>
            <Divider sx={{ my: 1 }} />
            <Button
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={() => setLogoutDialog(true)}
              sx={{
                justifyContent: 'flex-start',
                fontFamily: 'var(--font-ui)',
                textTransform: 'none',
                color: '#EB1948',
                py: 1.5,
                '&:hover': { backgroundColor: '#fff5f7' },
              }}
            >
              Log Out
            </Button>
          </Card>
        </Box>

        {/* Main tabs */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Card elevation={0} sx={{ border: '1px solid #CCFBF1', borderRadius: 3, bgcolor: '#fff', overflow: 'hidden' }}>
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: '1px solid #e0e0e0',
                '& .MuiTab-root': {
                  fontFamily: 'var(--font-ui)',
                  textTransform: 'none',
                  fontWeight: 600,
                },
                '& .Mui-selected': { color: '#0F766E !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#0F766E' },
              }}
            >
              <Tab icon={<PersonIcon />} iconPosition="start" label="Business info" />
              <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />
              <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />
              <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, color: '#0B2D31' }}>
                    Business information
                  </Typography>
                  {!editMode ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      sx={{ fontFamily: 'var(--font-ui)', textTransform: 'none', color: '#0F766E' }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        onClick={() => setEditMode(false)}
                        sx={{ fontFamily: 'var(--font-ui)', textTransform: 'none', color: '#666' }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        sx={{
                          backgroundColor: '#0F766E',
                          fontFamily: 'var(--font-ui)',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#0D9488' },
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 3,
                  }}
                >
                  <TextField
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    label="Business Name"
                    value={profile.businessName}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={{ ...fieldSx, gridColumn: { sm: '1 / -1' } }}
                  />
                  <TextField
                    label="Category"
                    value={profile.category}
                    onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    label="Location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    label="Phone Number"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    label="Website"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                    sx={{ ...fieldSx, gridColumn: { sm: '1 / -1' } }}
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
                  sx={{ mt: 3, ...fieldSx }}
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: { xs: 2, md: 3 } }}>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, color: '#0B2D31', mb: 3 }}>
                  Notification preferences
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#0F766E',
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Email
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 4 }}>
                  {(
                    [
                      ['emailLeads', 'New lead alerts'],
                      ['emailBookings', 'Booking confirmations and updates'],
                      ['emailMessages', 'New messages from couples'],
                      ['emailPromotions', 'Tips and platform promotions'],
                    ] as const
                  ).map(([key, label]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Switch
                          checked={notifications[key]}
                          onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                          sx={{
                            '& .Mui-checked': { color: '#0F766E' },
                            '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#0F766E' },
                          }}
                        />
                      }
                      label={<Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>{label}</Typography>}
                    />
                  ))}
                </Box>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#0F766E',
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Push
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {(
                    [
                      ['pushLeads', 'Lead unlocks and replies'],
                      ['pushBookings', 'Booking status changes'],
                      ['pushMessages', 'Message notifications'],
                    ] as const
                  ).map(([key, label]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Switch
                          checked={notifications[key]}
                          onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                          sx={{
                            '& .Mui-checked': { color: '#0F766E' },
                            '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#0F766E' },
                          }}
                        />
                      }
                      label={<Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>{label}</Typography>}
                    />
                  ))}
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, color: '#0B2D31' }}>
                  Security
                </Typography>
                <TextField label="Current password" type="password" fullWidth sx={fieldSx} />
                <TextField label="New password" type="password" fullWidth sx={fieldSx} />
                <TextField label="Confirm new password" type="password" fullWidth sx={fieldSx} />
                <Button
                  variant="contained"
                  sx={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#0F766E',
                    fontFamily: 'var(--font-ui)',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#0D9488' },
                  }}
                  onClick={() => {
                    setSnackbarMessage('Password updated')
                    setSnackbarOpen(true)
                  }}
                >
                  Update password
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box sx={{ px: { xs: 2, md: 3 } }}>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, color: '#0B2D31', mb: 2 }}>
                  Account settings
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <ReferralInviteCard audience="vendor" />
                </Box>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: '#64748B', mb: 3 }}>
                  Free listing with optional boosts. Manage visibility packs anytime.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/vendor/subscription')}
                  sx={{
                    borderColor: '#0F766E',
                    color: '#0F766E',
                    fontFamily: 'var(--font-ui)',
                    textTransform: 'none',
                    fontWeight: 700,
                    mb: 4,
                  }}
                >
                  Open grow &amp; billing
                </Button>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: '#EB1948', mb: 1 }}>
                  Danger zone
                </Typography>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialog(true)}
                  sx={{ fontFamily: 'var(--font-ui)', textTransform: 'none', color: '#EB1948' }}
                >
                  Delete account
                </Button>
              </Box>
            </TabPanel>
          </Card>
        </Box>
      </Box>

      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <DialogTitle sx={{ fontFamily: 'var(--font-ui)' }}>Log out?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>
            You&apos;ll need to sign in again to manage leads and bookings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" sx={{ textTransform: 'none' }}>
            Log out
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle sx={{ fontFamily: 'var(--font-ui)' }}>Delete account?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>
            This removes your vendor profile from discovery. This demo action only signs you out.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" sx={{ textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ fontFamily: 'var(--font-ui)' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </VendorPageShell>
  )
}
