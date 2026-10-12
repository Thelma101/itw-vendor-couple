import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
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
import BackButton from '@/shared/components/BackButton';
import { useNavigate } from 'react-router-dom';
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
import Nav from '@/couple/components/Nav';
import ReferralInviteCard from '@/shared/components/ReferralInviteCard';
import { apiErrorMessage, authApi, inquiriesApi, meApi, passwordApi, type Profile as AccountProfile } from '@/shared/lib/api';
import { profileNumber, profileString, useAccount } from '@/shared/contexts/AccountContext';
import { useShortlist } from '@/shared/contexts/ShortlistContext';
import { uploadImage } from '@/shared/lib/imageCompress';
import { coupleIdentity, joinPartnerNames, parseLocalDate } from '@/couple/planning-live/coupleIdentity';

type NotificationPrefs = {
  emailBookings: boolean;
  emailMessages: boolean;
  emailPromotions: boolean;
  pushBookings: boolean;
  pushMessages: boolean;
  pushReminders: boolean;
};

type AccountSettings = {
  notifications: NotificationPrefs;
  language: string;
  currency: string;
};

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  emailBookings: true,
  emailMessages: true,
  emailPromotions: false,
  pushBookings: true,
  pushMessages: true,
  pushReminders: true,
};

type LiveForm = {
  username: string;
  phone: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  location: string;
  venue: string;
  guestCount: string;
  budget: string;
  bio: string;
};

function readSettings(profile: AccountProfile): AccountSettings {
  const raw = (profile.settings && typeof profile.settings === 'object' ? profile.settings : {}) as Partial<AccountSettings>;
  const notifications = (raw.notifications && typeof raw.notifications === 'object' ? raw.notifications : {}) as Partial<NotificationPrefs>;
  const merged = { ...DEFAULT_NOTIFICATIONS };
  (Object.keys(DEFAULT_NOTIFICATIONS) as Array<keyof NotificationPrefs>).forEach((key) => {
    if (typeof notifications[key] === 'boolean') merged[key] = notifications[key] as boolean;
  });
  return {
    notifications: merged,
    language: typeof raw.language === 'string' ? raw.language : 'en',
    currency: typeof raw.currency === 'string' ? raw.currency : 'ngn',
  };
}

function formFromAccount(username: string, phone: string, profile: AccountProfile): LiveForm {
  const guestCount = profileNumber(profile, 'guestCount', 0);
  const budget = profileNumber(profile, 'budget', 0);
  return {
    username,
    phone,
    partnerOne: profileString(profile, 'partnerOne'),
    partnerTwo: profileString(profile, 'partnerTwo'),
    weddingDate: profileString(profile, 'weddingDate'),
    location: profileString(profile, 'location'),
    venue: profileString(profile, 'venue'),
    guestCount: guestCount ? String(guestCount) : '',
    budget: budget ? String(budget) : '',
    bio: profileString(profile, 'bio'),
  };
}

const fieldSx = { '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } };

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
  const avatarInputRef = useRef<HTMLInputElement>(null);
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

  const [demoNotifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  const { isDemo, user, profile: accountProfile, loading: accountLoading, update } = useAccount();
  const live = !isDemo;
  const { totalItems: shortlistCount } = useShortlist();
  const identity = coupleIdentity(user, accountProfile);
  const settings = useMemo(() => readSettings(accountProfile), [accountProfile]);
  const notifications = live ? settings.notifications : demoNotifications;
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [liveForm, setLiveForm] = useState<LiveForm>(() =>
    formFromAccount(user?.username || '', user?.phone_number || '', accountProfile),
  );
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bookedCount, setBookedCount] = useState<number | null>(null);
  const [reset, setReset] = useState<{ step: 'idle' | 'sending' | 'code' | 'saving'; code: string; password: string; confirm: string }>({
    step: 'idle',
    code: '',
    password: '',
    confirm: '',
  });

  const notify = useCallback((message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  useEffect(() => {
    if (live && !editMode) {
      setLiveForm(formFromAccount(user?.username || '', user?.phone_number || '', accountProfile));
    }
  }, [live, editMode, user, accountProfile]);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    inquiriesApi
      .list()
      .then((rows) => {
        if (!cancelled) setBookedCount(rows.filter((r) => r.status === 'confirmed' || r.status === 'completed').length);
      })
      .catch(() => {
        if (!cancelled) setBookedCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  const saveSettings = async (next: AccountSettings, message: string) => {
    try {
      await update({ profile: { settings: next } });
      notify(message);
    } catch (err) {
      notify(apiErrorMessage(err, 'Could not save your settings. Please try again.'), 'error');
    }
  };

  const setNotificationPref = (key: keyof NotificationPrefs, value: boolean) => {
    if (!live) {
      setNotifications({ ...demoNotifications, [key]: value });
      return;
    }
    void saveSettings({ ...settings, notifications: { ...settings.notifications, [key]: value } }, 'Notification preferences saved');
  };

  const handleSaveLiveProfile = async () => {
    const username = liveForm.username.trim();
    if (!username) {
      notify('Please enter a name for your account.', 'error');
      return;
    }
    const guestCount = liveForm.guestCount.trim() === '' ? '' : Number(liveForm.guestCount);
    const budget = liveForm.budget.trim() === '' ? '' : Number(liveForm.budget);
    if ((guestCount !== '' && (!Number.isFinite(guestCount) || guestCount < 0)) || (budget !== '' && (!Number.isFinite(budget) || budget < 0))) {
      notify('Guest count and budget must be positive numbers.', 'error');
      return;
    }
    const partnerOne = liveForm.partnerOne.trim();
    const partnerTwo = liveForm.partnerTwo.trim();
    setSaving(true);
    try {
      await update({
        username,
        phone_number: liveForm.phone.trim() || undefined,
        profile: {
          partnerOne,
          partnerTwo,
          displayName: joinPartnerNames(partnerOne, partnerTwo) || username,
          weddingDate: liveForm.weddingDate,
          location: liveForm.location.trim(),
          venue: liveForm.venue.trim(),
          guestCount,
          budget,
          bio: liveForm.bio.trim(),
        },
      });
      setEditMode(false);
      notify('Profile updated successfully!');
    } catch (err) {
      notify(apiErrorMessage(err, 'Could not save your profile. Please try again.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = () => {
    if (live) {
      void handleSaveLiveProfile();
      return;
    }
    setEditMode(false);
    setSnackbarMessage('Profile updated successfully!');
    setSnackbarOpen(true);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) {
      notify('Please choose an image file', live ? 'error' : 'success');
      return;
    }
    if (live) {
      setAvatarUploading(true);
      try {
        const avatar = await uploadImage(file);
        await update({ profile: { avatar } });
        notify('Profile photo updated');
      } catch (err) {
        notify(apiErrorMessage(err, err instanceof Error ? err.message : 'Could not upload your photo. Please try again.'), 'error');
      } finally {
        setAvatarUploading(false);
      }
      return;
    }
    const url = URL.createObjectURL(file);
    setProfile((prev) => {
      if (prev.avatar.startsWith('blob:')) URL.revokeObjectURL(prev.avatar);
      return { ...prev, avatar: url };
    });
    setSnackbarMessage('Profile photo updated');
    setSnackbarOpen(true);
  };

  const handleLogout = () => {
    setLogoutDialog(false);
    if (!authApi.logout()) navigate('/signin');
  };

  const handleDeleteAccount = async () => {
    if (!live) {
      setDeleteDialog(false);
      navigate('/');
      return;
    }
    setDeleting(true);
    try {
      await meApi.remove();
      setDeleteDialog(false);
      if (!authApi.logout()) navigate('/');
    } catch (err) {
      notify(apiErrorMessage(err, 'Could not delete your account. Please try again.'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const sendResetCode = async () => {
    if (!user?.email) {
      notify('Add an email address to your account to reset your password.', 'error');
      return;
    }
    setReset((r) => ({ ...r, step: 'sending' }));
    try {
      const res = await passwordApi.forgot(user.email);
      if (!res.emailEnabled) {
        setReset((r) => ({ ...r, step: 'idle' }));
        notify('Password reset emails are not available right now. Please contact support.', 'error');
        return;
      }
      setReset((r) => ({ ...r, step: 'code' }));
      notify(`We sent a reset code to ${user.email}`);
    } catch (err) {
      setReset((r) => ({ ...r, step: 'idle' }));
      notify(apiErrorMessage(err, 'Could not send a reset code'), 'error');
    }
  };

  const submitReset = async () => {
    if (!user?.email) return;
    if (reset.password.length < 8) {
      notify('Use at least 8 characters for your new password', 'error');
      return;
    }
    if (reset.password !== reset.confirm) {
      notify('Passwords do not match', 'error');
      return;
    }
    setReset((r) => ({ ...r, step: 'saving' }));
    try {
      await passwordApi.reset(user.email, reset.code.trim(), reset.password);
      setReset({ step: 'idle', code: '', password: '', confirm: '' });
      notify('Password updated');
    } catch (err) {
      setReset((r) => ({ ...r, step: 'code' }));
      notify(apiErrorMessage(err, 'Could not update your password'), 'error');
    }
  };

  const liveWeddingDate = parseLocalDate(identity.weddingDate);
  const cardAvatar = live ? identity.avatar || undefined : profile.avatar;
  const cardName = live ? identity.displayName : `${profile.firstName} & ${profile.partnerName}`;
  const cardBio = live ? profileString(accountProfile, 'bio') : profile.bio;

  return (
    <Box sx={{ backgroundColor: '#F4F7F8', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />
      
      {/* Header */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}>
        <BackButton fallbackPath="/couple/dashboard" sx={{ mb: 2 }} />

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

      <Box sx={{ px: { xs: 2, md: 4 }, pb: { xs: 12, md: 4 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, minWidth: 0, overflowX: 'hidden' }}>
        {/* Left Sidebar - Profile Card */}
        <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
          <Card sx={{ border: '0.25px solid #00838F', p: 3, textAlign: 'center' }}>
            {/* Avatar */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
              <Avatar
                src={cardAvatar}
                sx={{ width: 120, height: 120, mx: 'auto', bgcolor: '#0F766E', fontSize: 36, fontWeight: 700 }}
              >
                {live ? identity.initials : null}
              </Avatar>
              <IconButton
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                aria-label="Change profile photo"
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
                {avatarUploading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <CameraAltIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>

            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: '#002528',
              mb: 0.5
            }}>
              {live && accountLoading && !user ? 'Loading…' : cardName}
            </Typography>
            {live && user?.email ? (
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#94A3B8', mb: 1, wordBreak: 'break-all' }}>
                {user.email}
              </Typography>
            ) : null}
            
            <Typography sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              color: '#666',
              mb: 2
            }}>
              {cardBio || (live ? 'Add a short bio about the two of you.' : '')}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Quick Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <FavoriteIcon sx={{ fontSize: 16, color: '#EB1948' }} />
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>
                    {live ? shortlistCount : 5}
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
                    {live ? (bookedCount ?? '—') : 3}
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                  Booked
                </Typography>
              </Box>
            </Box>

            {live ? (
              <Box sx={{ p: 2, backgroundColor: '#f0fdfa', borderRadius: 2, mt: 2 }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                  Wedding Date
                </Typography>
                {liveWeddingDate ? (
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 16, color: '#00838F' }}>
                    {liveWeddingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </Typography>
                ) : (
                  <Button
                    size="small"
                    onClick={() => {
                      setTabValue(0);
                      setEditMode(true);
                    }}
                    sx={{ fontFamily: "'Open Sans', sans-serif", textTransform: 'none', fontWeight: 700, color: '#00838F', p: 0, minWidth: 0 }}
                  >
                    Add your wedding date
                  </Button>
                )}
              </Box>
            ) : profile.weddingDate && (
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
                        disabled={saving}
                        sx={{
                          backgroundColor: '#00838F',
                          fontFamily: "'Open Sans', sans-serif",
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#006d75' }
                        }}
                      >
                        {saving ? 'Saving…' : 'Save Changes'}
                      </Button>
                    </Box>
                  )}
                </Box>

                {live ? (
                  <>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                      <TextField
                        label="Account name"
                        value={liveForm.username}
                        onChange={(e) => setLiveForm({ ...liveForm, username: e.target.value })}
                        disabled={!editMode}
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Email Address"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        helperText="Email can't be changed here"
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Phone Number"
                        value={liveForm.phone}
                        onChange={(e) => setLiveForm({ ...liveForm, phone: e.target.value })}
                        disabled={!editMode}
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Wedding Date"
                        type="date"
                        value={liveForm.weddingDate}
                        onChange={(e) => setLiveForm({ ...liveForm, weddingDate: e.target.value })}
                        disabled={!editMode}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                      <TextField
                        label="Your first name"
                        value={liveForm.partnerOne}
                        onChange={(e) => setLiveForm({ ...liveForm, partnerOne: e.target.value })}
                        disabled={!editMode}
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Partner's first name"
                        value={liveForm.partnerTwo}
                        onChange={(e) => setLiveForm({ ...liveForm, partnerTwo: e.target.value })}
                        disabled={!editMode}
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="City / Location"
                        value={liveForm.location}
                        onChange={(e) => setLiveForm({ ...liveForm, location: e.target.value })}
                        disabled={!editMode}
                        placeholder="e.g. Lagos"
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Venue"
                        value={liveForm.venue}
                        onChange={(e) => setLiveForm({ ...liveForm, venue: e.target.value })}
                        disabled={!editMode}
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Estimated guest count"
                        type="number"
                        value={liveForm.guestCount}
                        onChange={(e) => setLiveForm({ ...liveForm, guestCount: e.target.value })}
                        disabled={!editMode}
                        inputProps={{ min: 0 }}
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Estimated budget (₦)"
                        type="number"
                        value={liveForm.budget}
                        onChange={(e) => setLiveForm({ ...liveForm, budget: e.target.value })}
                        disabled={!editMode}
                        inputProps={{ min: 0 }}
                        fullWidth
                        sx={fieldSx}
                      />
                    </Box>
                    <TextField
                      label="Bio"
                      value={liveForm.bio}
                      onChange={(e) => setLiveForm({ ...liveForm, bio: e.target.value })}
                      disabled={!editMode}
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mt: 3, ...fieldSx }}
                    />
                  </>
                ) : (
                <>
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
                </>
                )}
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
                        onChange={(e) => setNotificationPref('emailBookings', e.target.checked)}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>Booking confirmations and updates</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailMessages}
                        onChange={(e) => setNotificationPref('emailMessages', e.target.checked)}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>New messages from vendors</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailPromotions}
                        onChange={(e) => setNotificationPref('emailPromotions', e.target.checked)}
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
                        onChange={(e) => setNotificationPref('pushBookings', e.target.checked)}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>Booking status changes</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushMessages}
                        onChange={(e) => setNotificationPref('pushMessages', e.target.checked)}
                        sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00838F' } }}
                      />
                    }
                    label={<Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>New messages</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushReminders}
                        onChange={(e) => setNotificationPref('pushReminders', e.target.checked)}
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

                {live ? (
                  <Card sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#002528', mb: 1 }}>
                      Change Password
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666', mb: 2 }}>
                      {reset.step === 'idle' || reset.step === 'sending'
                        ? `We'll email a one-time code to ${user?.email || 'your account email'} so you can set a new password.`
                        : 'Enter the code from your email and choose a new password.'}
                    </Typography>
                    {reset.step === 'idle' || reset.step === 'sending' ? (
                      <Button
                        variant="contained"
                        disabled={reset.step === 'sending' || !user?.email}
                        onClick={() => void sendResetCode()}
                        sx={{ backgroundColor: '#00838F', fontFamily: "'Open Sans', sans-serif", textTransform: 'none', '&:hover': { backgroundColor: '#006d75' } }}
                      >
                        {reset.step === 'sending' ? 'Sending…' : 'Email me a reset code'}
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Code from your email" value={reset.code} onChange={(e) => setReset((r) => ({ ...r, code: e.target.value }))} fullWidth sx={fieldSx} />
                        <TextField label="New Password" type="password" value={reset.password} onChange={(e) => setReset((r) => ({ ...r, password: e.target.value }))} fullWidth sx={fieldSx} />
                        <TextField label="Confirm New Password" type="password" value={reset.confirm} onChange={(e) => setReset((r) => ({ ...r, confirm: e.target.value }))} fullWidth sx={fieldSx} />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            disabled={reset.step === 'saving' || !reset.code.trim()}
                            onClick={() => void submitReset()}
                            sx={{ backgroundColor: '#00838F', fontFamily: "'Open Sans', sans-serif", textTransform: 'none', '&:hover': { backgroundColor: '#006d75' } }}
                          >
                            {reset.step === 'saving' ? 'Updating…' : 'Update password'}
                          </Button>
                          <Button
                            onClick={() => setReset({ step: 'idle', code: '', password: '', confirm: '' })}
                            sx={{ fontFamily: "'Open Sans', sans-serif", textTransform: 'none', color: '#666' }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Card>
                ) : (
                <>
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
                </>
                )}
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

                <Box sx={{ mb: 3 }}>
                  <ReferralInviteCard audience="couple" />
                </Box>

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
                      {...(live
                        ? {
                            value: settings.language,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                              void saveSettings({ ...settings, language: e.target.value }, 'Language saved'),
                          }
                        : { defaultValue: 'en' })}
                      SelectProps={{ native: true }}
                      sx={{ width: 200, '& .MuiInputBase-root': { fontFamily: "'Open Sans', sans-serif" } }}
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                    </TextField>
                    <TextField
                      select
                      label="Currency"
                      {...(live
                        ? {
                            value: settings.currency,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                              void saveSettings({ ...settings, currency: e.target.value }, 'Currency saved'),
                          }
                        : { defaultValue: 'ngn' })}
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
          <Button disabled={deleting} onClick={() => setDeleteDialog(false)} sx={{ fontFamily: "'Open Sans', sans-serif", textTransform: 'none' }}>
            Cancel
          </Button>
          <Button disabled={deleting} onClick={() => void handleDeleteAccount()} sx={{ fontFamily: "'Open Sans', sans-serif", textTransform: 'none', color: '#dc2626' }}>
            {deleting ? 'Deleting…' : 'Delete Permanently'}
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
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
</Box>
  );
};

export default Profile;
