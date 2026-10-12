import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import {
  AddPhotoAlternateOutlined,
  CameraAlt as CameraAltIcon,
  ContactPhoneOutlined,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Event as EventIcon,
  LeaderboardOutlined,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  WorkspacePremiumOutlined,
} from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import ReferralInviteCard from '@/shared/components/ReferralInviteCard'
import { profileNumber, profileString, useAccount } from '@/shared/contexts/AccountContext'
import { usePlan } from '@/shared/contexts/PlanContext'
import { apiErrorMessage, authApi, meApi, passwordApi, type Profile, type PublicUser } from '@/shared/lib/api'
import { uploadImage } from '@/shared/lib/imageCompress'
import { isBooked, useInquiries, VENDOR_CATEGORIES } from '@/vendor/lib/live'

const RESPONSE_TIMES = ['Within 1 hour', 'Within a few hours', 'Within a day', 'Within 2–3 days']

const fieldSx = {
  '& .MuiInputBase-root': { fontFamily: 'var(--font-ui)' },
  '& .MuiInputLabel-root': { fontFamily: 'var(--font-ui)' },
}

const sideButtonSx = {
  justifyContent: 'flex-start',
  fontFamily: 'var(--font-ui)',
  textTransform: 'none',
  color: '#0B2D31',
  py: 1.5,
  '&:hover': { backgroundColor: '#f0fdfa' },
} as const

type Form = {
  businessName: string
  ownerName: string
  accountPhone: string
  category: string
  location: string
  city: string
  tagline: string
  bio: string
  startingPrice: string
  yearsInBusiness: string
  responseTime: string
  phone: string
  showPhone: boolean
  whatsapp: string
  instagram: string
  website: string
}

type FieldExtras = {
  required?: boolean
  placeholder?: string
  helperText?: string
  type?: string
  multiline?: boolean
  rows?: number
  min?: number
  fullRow?: boolean
  mt?: number
}

function formFromAccount(user: PublicUser | null, profile: Profile): Form {
  const price = profileNumber(profile, 'startingPrice', 0)
  const years = profileNumber(profile, 'yearsInBusiness', 0)
  return {
    businessName: user?.business_name || '',
    ownerName: profileString(profile, 'ownerName'),
    accountPhone: user?.phone_number || '',
    category: profileString(profile, 'category'),
    location: profileString(profile, 'location'),
    city: profileString(profile, 'city'),
    tagline: profileString(profile, 'tagline'),
    bio: profileString(profile, 'bio'),
    startingPrice: price ? String(price) : '',
    yearsInBusiness: years ? String(years) : '',
    responseTime: profileString(profile, 'responseTime'),
    phone: profileString(profile, 'phone'),
    showPhone: profile.showPhone === true,
    whatsapp: profileString(profile, 'whatsapp'),
    instagram: profileString(profile, 'instagram'),
    website: profileString(profile, 'website'),
  }
}

function TabPanel({ children, value, index }: { children?: ReactNode; index: number; value: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null}
    </div>
  )
}

export default function LiveAccount() {
  const navigate = useNavigate()
  const { isPremium } = usePlan()
  const { user, profile, loading, update } = useAccount()
  const { items } = useInquiries()
  const [tabValue, setTabValue] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<Form>(() => formFromAccount(user, profile))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null)
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' | 'info' } | null>(null)
  const [logoutDialog, setLogoutDialog] = useState(false)
  const [archiveDialog, setArchiveDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reset, setReset] = useState({ step: 'idle' as 'idle' | 'sending' | 'code' | 'saving', code: '', password: '', confirm: '' })
  const avatarRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  const view = editMode ? form : formFromAccount(user, profile)
  const archived = profile.archived === true
  const avatar = profileString(profile, 'avatar')
  const cover = profileString(profile, 'cover')
  const displayName = user?.business_name || user?.username || 'Your business'
  const leadCount = items.filter((i) => i.kind === 'inquiry' && !isBooked(i)).length
  const bookingCount = items.filter(isBooked).length

  const say = (message: string, severity: 'success' | 'error' | 'info' = 'success') => setToast({ message, severity })
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }))

  const startEdit = () => {
    setForm(formFromAccount(user, profile))
    setEditMode(true)
  }

  const handleSave = async () => {
    if (!form.businessName.trim()) {
      say('Business name is required', 'error')
      return
    }
    setSaving(true)
    try {
      await update({
        business_name: form.businessName.trim(),
        phone_number: form.accountPhone.trim() || undefined,
        profile: {
          ownerName: form.ownerName.trim(),
          category: form.category,
          location: form.location.trim(),
          city: form.city.trim(),
          tagline: form.tagline.trim(),
          bio: form.bio.trim(),
          startingPrice: Math.max(0, Number(form.startingPrice) || 0),
          yearsInBusiness: Math.max(0, Number(form.yearsInBusiness) || 0),
          responseTime: form.responseTime,
          phone: form.phone.trim(),
          showPhone: form.showPhone,
          whatsapp: form.whatsapp.trim(),
          instagram: form.instagram.trim().replace(/^@/, ''),
          website: form.website.trim(),
        },
      })
      setEditMode(false)
      say('Profile saved — couples will see these details')
    } catch (err) {
      say(apiErrorMessage(err, 'Could not save your profile. Please try again.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const onImage = async (kind: 'avatar' | 'cover', file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      say('Please choose an image file.', 'error')
      return
    }
    setUploading(kind)
    try {
      const url = await uploadImage(file)
      await update({ profile: { [kind]: url } })
      say(kind === 'avatar' ? 'Profile photo updated' : 'Cover photo updated')
    } catch (err) {
      say(apiErrorMessage(err, err instanceof Error ? err.message : 'Upload failed'), 'error')
    } finally {
      setUploading(null)
      const ref = kind === 'avatar' ? avatarRef : coverRef
      if (ref.current) ref.current.value = ''
    }
  }

  const setArchived = async (value: boolean) => {
    setArchiveDialog(false)
    try {
      await update({ profile: { archived: value } })
      say(value ? 'Profile archived — couples can no longer find you.' : 'Welcome back — your profile is visible to couples again.', value ? 'info' : 'success')
    } catch (err) {
      say(apiErrorMessage(err, 'Could not update your profile visibility'), 'error')
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await meApi.remove()
      setDeleteDialog(false)
      if (!authApi.logout()) navigate('/')
    } catch (err) {
      setDeleting(false)
      say(apiErrorMessage(err, 'Could not delete your account. Please try again.'), 'error')
    }
  }

  const handleLogout = () => {
    setLogoutDialog(false)
    if (!authApi.logout()) navigate('/signin')
  }

  const sendResetCode = async () => {
    if (!user?.email) {
      say('Add an email address to your account to reset your password.', 'error')
      return
    }
    setReset((r) => ({ ...r, step: 'sending' }))
    try {
      const res = await passwordApi.forgot(user.email)
      if (!res.emailEnabled) {
        setReset((r) => ({ ...r, step: 'idle' }))
        say('Password reset emails are not available right now. Please contact support.', 'error')
        return
      }
      setReset((r) => ({ ...r, step: 'code' }))
      say(`We sent a reset code to ${user.email}`, 'info')
    } catch (err) {
      setReset((r) => ({ ...r, step: 'idle' }))
      say(apiErrorMessage(err, 'Could not send a reset code'), 'error')
    }
  }

  const submitReset = async () => {
    if (!user?.email) return
    if (reset.password.length < 8) {
      say('Use at least 8 characters for your new password', 'error')
      return
    }
    if (reset.password !== reset.confirm) {
      say('Passwords do not match', 'error')
      return
    }
    setReset((r) => ({ ...r, step: 'saving' }))
    try {
      await passwordApi.reset(user.email, reset.code.trim(), reset.password)
      setReset({ step: 'idle', code: '', password: '', confirm: '' })
      say('Password updated')
    } catch (err) {
      setReset((r) => ({ ...r, step: 'code' }))
      say(apiErrorMessage(err, 'Could not update your password'), 'error')
    }
  }

  if (loading && !user) {
    return (
      <VendorPageShell title="Account">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#0F766E' }} />
        </Box>
      </VendorPageShell>
    )
  }

  const editable = (label: string, key: keyof Form, extra: FieldExtras = {}) => (
    <TextField
      label={label}
      value={view[key] as string}
      onChange={(e) => set(key, e.target.value as never)}
      disabled={!editMode}
      fullWidth
      required={extra.required}
      placeholder={extra.placeholder}
      helperText={extra.helperText}
      type={extra.type}
      multiline={extra.multiline}
      rows={extra.rows}
      inputProps={extra.min !== undefined ? { min: extra.min } : undefined}
      sx={{ ...fieldSx, gridColumn: extra.fullRow ? { sm: '1 / -1' } : undefined, mt: extra.mt }}
    />
  )

  const editBar = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
      <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, color: '#0B2D31' }}>
        {tabValue === 0 ? 'Business profile' : 'Contact & links'}
      </Typography>
      {!editMode ? (
        <Button startIcon={<EditIcon />} onClick={startEdit} sx={{ fontFamily: 'var(--font-ui)', textTransform: 'none', color: '#0F766E' }}>
          Edit
        </Button>
      ) : (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={() => setEditMode(false)} disabled={saving} sx={{ fontFamily: 'var(--font-ui)', textTransform: 'none', color: '#666' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleSave()}
            disabled={saving}
            sx={{ backgroundColor: '#0F766E', fontFamily: 'var(--font-ui)', textTransform: 'none', '&:hover': { backgroundColor: '#0D9488' } }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </Box>
      )}
    </Box>
  )

  return (
    <VendorPageShell title="Account" subtitle="Your public business profile, contact details, and account settings." badge={isPremium ? 'Paid plan' : 'Starter'}>
      {archived ? (
        <Alert
          severity="warning"
          sx={{ mb: 3, fontFamily: 'var(--font-ui)' }}
          action={
            <Button color="inherit" size="small" onClick={() => void setArchived(false)} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Unarchive
            </Button>
          }
        >
          Your profile is archived. Couples can’t find you in search, but your leads, chats and bookings are kept.
        </Alert>
      ) : null}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, minWidth: 0 }}>
        <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
          <Card elevation={0} sx={{ border: '1px solid #CCFBF1', p: 3, textAlign: 'center', borderRadius: 3, bgcolor: '#fff' }}>
            <input ref={avatarRef} type="file" accept="image/*" hidden onChange={(e) => void onImage('avatar', e.target.files?.[0])} />
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar src={avatar || undefined} sx={{ width: 120, height: 120, mx: 'auto', border: '3px solid #CCFBF1', bgcolor: '#0F766E', fontSize: 44 }}>
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                onClick={() => avatarRef.current?.click()}
                disabled={uploading === 'avatar'}
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
                aria-label="Change profile photo"
              >
                {uploading === 'avatar' ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <CameraAltIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
            <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#0B2D31', mb: 0.5, lineHeight: 1.2 }}>
              {displayName}
            </Typography>
            {profileString(profile, 'ownerName') ? (
              <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: '#64748B', mb: 0.5 }}>{profileString(profile, 'ownerName')}</Typography>
            ) : null}
            <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#94A3B8', mb: 2 }}>
              {profileString(profile, 'category') || 'Category not set'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
              {[
                { icon: <LeaderboardOutlined sx={{ fontSize: 16, color: '#0F766E' }} />, value: leadCount, label: 'Leads' },
                { icon: <EventIcon sx={{ fontSize: 16, color: '#0F766E' }} />, value: bookingCount, label: 'Bookings' },
              ].map((s) => (
                <Box key={s.label} sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    {s.icon}
                    <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18 }}>{s.value}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#666' }}>{s.label}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#f0fdfa', borderRadius: 2 }}>
              <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#666' }}>Location</Typography>
              <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: '#0F766E' }}>
                {profileString(profile, 'location') || 'Not set'}
              </Typography>
            </Box>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid #CCFBF1', p: 2, mt: 2, borderRadius: 3, bgcolor: '#fff' }}>
            <Button fullWidth startIcon={<WorkspacePremiumOutlined />} onClick={() => navigate('/vendor/subscription')} sx={sideButtonSx}>
              {isPremium ? 'Manage plan' : 'Upgrade plan'}
            </Button>
            <Button fullWidth startIcon={<LeaderboardOutlined />} onClick={() => navigate('/vendor/leads')} sx={sideButtonSx}>
              Lead inbox
            </Button>
            <Button fullWidth startIcon={<EventIcon />} onClick={() => navigate('/vendor/bookings')} sx={sideButtonSx}>
              Bookings
            </Button>
            {user?.id ? (
              <Button fullWidth startIcon={<PersonIcon />} onClick={() => navigate(`/couple/vendor/${encodeURIComponent(user.id)}`)} sx={sideButtonSx}>
                View public profile
              </Button>
            ) : null}
            <Divider sx={{ my: 1 }} />
            <Button
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={() => setLogoutDialog(true)}
              sx={{ ...sideButtonSx, color: '#EB1948', '&:hover': { backgroundColor: '#fff5f7' } }}
            >
              Log Out
            </Button>
          </Card>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Card elevation={0} sx={{ border: '1px solid #CCFBF1', borderRadius: 3, bgcolor: '#fff', overflow: 'hidden' }}>
            <Tabs
              value={tabValue}
              onChange={(_, v: number) => setTabValue(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: '1px solid #e0e0e0',
                '& .MuiTab-root': { fontFamily: 'var(--font-ui)', textTransform: 'none', fontWeight: 600 },
                '& .Mui-selected': { color: '#0F766E !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#0F766E' },
              }}
            >
              <Tab icon={<PersonIcon />} iconPosition="start" label="Business profile" />
              <Tab icon={<ContactPhoneOutlined />} iconPosition="start" label="Contact & links" />
              <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />
              <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: { xs: 2, md: 3 } }}>
                {editBar}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {editable('Business name', 'businessName', { required: true, fullRow: true })}
                  {editable('Owner name', 'ownerName')}
                  <TextField
                    select
                    label="Category"
                    value={view.category}
                    onChange={(e) => set('category', e.target.value)}
                    disabled={!editMode}
                    fullWidth
                    sx={fieldSx}
                  >
                    {view.category && !(VENDOR_CATEGORIES as readonly string[]).includes(view.category) ? (
                      <MenuItem value={view.category}>{view.category}</MenuItem>
                    ) : null}
                    {VENDOR_CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                  {editable('Location (area, city)', 'location', { placeholder: 'e.g. Lekki, Lagos' })}
                  {editable('City', 'city', { placeholder: 'e.g. Lagos' })}
                  {editable('Tagline', 'tagline', { placeholder: 'One line couples see under your name', fullRow: true })}
                  {editable('Starting price (₦)', 'startingPrice', { type: 'number', min: 0 })}
                  {editable('Years in business', 'yearsInBusiness', { type: 'number', min: 0 })}
                  <TextField
                    select
                    label="Typical response time"
                    value={view.responseTime}
                    onChange={(e) => set('responseTime', e.target.value)}
                    disabled={!editMode}
                    fullWidth
                    sx={fieldSx}
                  >
                    <MenuItem value="">Not set</MenuItem>
                    {view.responseTime && !RESPONSE_TIMES.includes(view.responseTime) ? (
                      <MenuItem value={view.responseTime}>{view.responseTime}</MenuItem>
                    ) : null}
                    {RESPONSE_TIMES.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                {editable('Bio', 'bio', {
                  multiline: true,
                  rows: 4,
                  placeholder: 'Tell couples about your style, experience and what makes you different.',
                  mt: 3,
                })}

                <Divider sx={{ my: 3 }} />
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: '#0B2D31', mb: 1 }}>Cover photo</Typography>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#64748B', mb: 2 }}>
                  The banner couples see at the top of your profile.
                </Typography>
                <input ref={coverRef} type="file" accept="image/*" hidden onChange={(e) => void onImage('cover', e.target.files?.[0])} />
                {cover ? (
                  <Box component="img" src={cover} alt="Cover" sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 2, border: '1px solid #E2E8F0', mb: 1.5 }} />
                ) : null}
                <Button
                  variant="outlined"
                  startIcon={uploading === 'cover' ? <CircularProgress size={16} /> : <AddPhotoAlternateOutlined />}
                  disabled={uploading === 'cover'}
                  onClick={() => coverRef.current?.click()}
                  sx={{ borderColor: '#0F766E', color: '#0F766E', fontFamily: 'var(--font-ui)', textTransform: 'none', fontWeight: 700 }}
                >
                  {cover ? 'Change cover photo' : 'Upload cover photo'}
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: { xs: 2, md: 3 } }}>
                {editBar}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <TextField label="Email address" value={user?.email || ''} disabled fullWidth helperText="Used to sign in" sx={fieldSx} />
                  {editable('Account phone', 'accountPhone', { helperText: 'Used to sign in — not shown to couples' })}
                  {editable('Public phone', 'phone', { placeholder: 'Number couples can call' })}
                  {editable('WhatsApp', 'whatsapp', { placeholder: 'e.g. 0803 000 0000' })}
                  {editable('Instagram', 'instagram', { placeholder: 'handle without @' })}
                  {editable('Website', 'website', { placeholder: 'https://' })}
                </Box>
                <FormControlLabel
                  sx={{ mt: 2 }}
                  control={
                    <Switch
                      checked={view.showPhone}
                      disabled={!editMode}
                      onChange={(e) => set('showPhone', e.target.checked)}
                      sx={{ '& .Mui-checked': { color: '#0F766E' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#0F766E' } }}
                    />
                  }
                  label={<Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>Show my public phone number on my profile</Typography>}
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 480 }}>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, color: '#0B2D31' }}>Change password</Typography>
                {reset.step === 'idle' || reset.step === 'sending' ? (
                  <>
                    <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: '#64748B' }}>
                      We’ll email a one-time code to {user?.email || 'your email address'} so you can set a new password.
                    </Typography>
                    <Button
                      variant="contained"
                      disabled={reset.step === 'sending' || !user?.email}
                      onClick={() => void sendResetCode()}
                      sx={{ alignSelf: 'flex-start', backgroundColor: '#0F766E', fontFamily: 'var(--font-ui)', textTransform: 'none', '&:hover': { backgroundColor: '#0D9488' } }}
                    >
                      {reset.step === 'sending' ? 'Sending…' : 'Email me a reset code'}
                    </Button>
                  </>
                ) : (
                  <>
                    <TextField label="Code from your email" value={reset.code} onChange={(e) => setReset((r) => ({ ...r, code: e.target.value }))} fullWidth sx={fieldSx} />
                    <TextField label="New password" type="password" value={reset.password} onChange={(e) => setReset((r) => ({ ...r, password: e.target.value }))} fullWidth sx={fieldSx} />
                    <TextField label="Confirm new password" type="password" value={reset.confirm} onChange={(e) => setReset((r) => ({ ...r, confirm: e.target.value }))} fullWidth sx={fieldSx} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        disabled={reset.step === 'saving' || !reset.code.trim()}
                        onClick={() => void submitReset()}
                        sx={{ backgroundColor: '#0F766E', fontFamily: 'var(--font-ui)', textTransform: 'none', '&:hover': { backgroundColor: '#0D9488' } }}
                      >
                        {reset.step === 'saving' ? 'Updating…' : 'Update password'}
                      </Button>
                      <Button onClick={() => setReset({ step: 'idle', code: '', password: '', confirm: '' })} sx={{ textTransform: 'none', color: '#666' }}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box sx={{ px: { xs: 2, md: 3 } }}>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, color: '#0B2D31', mb: 2 }}>Account settings</Typography>
                <Box sx={{ mb: 3 }}>
                  <ReferralInviteCard audience="vendor" />
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/vendor/subscription')}
                  sx={{ borderColor: '#0F766E', color: '#0F766E', fontFamily: 'var(--font-ui)', textTransform: 'none', fontWeight: 700, mb: 3 }}
                >
                  Plan &amp; billing
                </Button>

                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: '#0B2D31', mb: 0.5 }}>Profile visibility</Typography>
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: '#64748B', mb: 1.5 }}>
                  {archived
                    ? 'Archived — hidden from couple search. Unarchive to be discoverable again.'
                    : 'Taking a break? Archiving hides you from couple search while keeping your leads, chats and bookings.'}
                </Typography>
                {archived ? (
                  <Button variant="contained" onClick={() => void setArchived(false)} sx={{ backgroundColor: '#0F766E', textTransform: 'none', fontFamily: 'var(--font-ui)', mb: 3 }}>
                    Unarchive profile
                  </Button>
                ) : (
                  <Button variant="outlined" onClick={() => setArchiveDialog(true)} sx={{ borderColor: '#0F766E', color: '#0F766E', textTransform: 'none', fontFamily: 'var(--font-ui)', mb: 3 }}>
                    Archive profile
                  </Button>
                )}

                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, color: '#EB1948', mb: 1 }}>Danger zone</Typography>
                <Button startIcon={<DeleteIcon />} onClick={() => setDeleteDialog(true)} sx={{ fontFamily: 'var(--font-ui)', textTransform: 'none', color: '#EB1948' }}>
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
          <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>You&apos;ll need to sign in again to manage leads and bookings.</Typography>
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

      <Dialog open={archiveDialog} onClose={() => setArchiveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-ui)' }}>Archive your profile?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>
            Couples will no longer find you in search or see your profile. Your leads, chats and bookings stay intact, and you can unarchive at any time.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialog(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={() => void setArchived(true)} variant="contained" sx={{ textTransform: 'none', backgroundColor: '#0F766E' }}>
            Archive profile
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => !deleting && setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-ui)' }}>Delete your account?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 14, mb: 2 }}>
            This removes your public listing and signs you out. You won’t be able to sign in with this account again.
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#64748b' }}>
            Just need a break? <strong>Archive</strong> hides you from couples and keeps everything for when you return.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1, px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog(false)} disabled={deleting} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          {!archived ? (
            <Button
              onClick={() => {
                setDeleteDialog(false)
                void setArchived(true)
              }}
              disabled={deleting}
              variant="outlined"
              sx={{ textTransform: 'none', borderColor: '#0F766E', color: '#0F766E' }}
            >
              Archive instead
            </Button>
          ) : null}
          <Button onClick={() => void handleDelete()} disabled={deleting} color="error" variant="contained" sx={{ textTransform: 'none' }}>
            {deleting ? 'Deleting…' : 'Delete permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}>
        <Alert severity={toast?.severity || 'success'} onClose={() => setToast(null)} sx={{ fontFamily: 'var(--font-ui)' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </VendorPageShell>
  )
}
