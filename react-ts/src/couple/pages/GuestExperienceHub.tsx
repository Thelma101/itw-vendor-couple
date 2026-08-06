import { useState, useCallback, useMemo, useRef } from 'react'
import {
  Box, Typography, Button, TextField, Chip, Card, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, Alert, Slide, Fade, Tabs, Tab, Avatar,
} from '@mui/material'
import {
  Favorite, FavoriteBorder, Videocam, TextFields, Add, PlayArrow,
  AccessTime, AutoAwesome, Lock, CameraAlt, Send, Celebration,
  LiveTv, CardGiftcard,
} from '@mui/icons-material'
import Nav from '@/couple/components/Nav'
import Footer from '@/marketing/components/Footer'

/* ═══════ TOKENS ═══════ */
const T = {
  bg: '#FFFFFF', primary: '#00838F', primaryBlack: '#002528',
  accentGrad: 'linear-gradient(255.71deg, #EB1948 65.18%, #B52344 232.03%)',
  accent: '#EB1948', success: '#008F53',
  text: '#2d2d2d', textSub: '#aaaaaa', font: "'Open Sans', sans-serif",
  border: '0.25px solid #00838F',
}

/* ═══════ TYPES ═══════ */
interface Wish {
  id: string
  type: 'text' | 'video'
  guestName: string
  content: string           // text message or video URL
  videoThumbnail?: string
  timestamp: Date
  liked: boolean
  likeCount: number
}

interface FeedItem {
  id: string
  type: 'moment' | 'milestone' | 'announcement'
  title: string
  description: string
  image?: string
  timestamp: Date
  icon?: string
}

/* ═══════ MOCK DATA ═══════ */
const MOCK_WISHES: Wish[] = [
  { id: 'w1', type: 'text', guestName: 'Aunty Funke', content: 'Wishing you both a lifetime of love, laughter, and happiness! God bless your union. 🙏💕', timestamp: new Date('2026-02-10T14:30:00'), liked: false, likeCount: 12 },
  { id: 'w2', type: 'video', guestName: 'David & Sarah', content: 'https://example.com/video1.mp4', videoThumbnail: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=400&h=300&fit=crop', timestamp: new Date('2026-02-11T09:15:00'), liked: true, likeCount: 24 },
  { id: 'w3', type: 'text', guestName: 'Uncle Chidi', content: 'From the moment I saw you two together, I knew it was meant to be. May your marriage be filled with joy and abundance!', timestamp: new Date('2026-02-11T16:45:00'), liked: false, likeCount: 8 },
  { id: 'w4', type: 'text', guestName: 'Ibukun & Tayo', content: 'We are so honoured to witness your love story. Congratulations to the most beautiful couple! 🎉💍', timestamp: new Date('2026-02-12T10:00:00'), liked: false, likeCount: 15 },
  { id: 'w5', type: 'video', guestName: 'Bestie Squad', content: 'https://example.com/video2.mp4', videoThumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop', timestamp: new Date('2026-02-12T11:30:00'), liked: true, likeCount: 31 },
]

const MOCK_FEED: FeedItem[] = [
  { id: 'f1', type: 'milestone', title: 'Ceremony Begins', description: 'The couple is walking down the aisle!', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=300&fit=crop', timestamp: new Date('2026-06-15T11:00:00'), icon: '💒' },
  { id: 'f2', type: 'moment', title: 'Exchange of Vows', description: 'A beautiful and emotional moment as the couple exchange their vows.', timestamp: new Date('2026-06-15T11:30:00'), icon: '💍' },
  { id: 'f3', type: 'announcement', title: 'Cocktail Hour', description: 'Please join us in the garden for cocktails and canapés!', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=300&fit=crop', timestamp: new Date('2026-06-15T13:00:00'), icon: '🥂' },
  { id: 'f4', type: 'milestone', title: 'First Dance', description: 'The newlyweds take the floor for their first dance together.', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=300&fit=crop', timestamp: new Date('2026-06-15T14:30:00'), icon: '💃' },
  { id: 'f5', type: 'moment', title: 'Cake Cutting', description: 'Time for the sweetest moment — the couple cuts their wedding cake!', image: 'https://images.unsplash.com/photo-1578985545062-69928b1c9587?w=600&h=300&fit=crop', timestamp: new Date('2026-06-15T15:00:00'), icon: '🎂' },
  { id: 'f6', type: 'announcement', title: 'Bouquet Toss', description: 'Single ladies, get ready! The bouquet toss is about to begin.', timestamp: new Date('2026-06-15T16:00:00'), icon: '💐' },
]

const STORAGE_KEY = 'itw_guest_hub'

/* ═══════ HELPERS ═══════ */
const timeAgo = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

const AVATARS = ['#00838F', '#EB1948', '#7b68ae', '#f59e0b', '#008F53', '#c49b5c', '#1e6091', '#6b4423']
const getAvatarColor = (name: string) => AVATARS[name.length % AVATARS.length]

/* ═══════ MAIN COMPONENT ═══════ */
export default function GuestExperienceHub() {
  const [tabValue, setTabValue] = useState(0)
  const [wishes, setWishes] = useState<Wish[]>(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : MOCK_WISHES }
    catch { return MOCK_WISHES }
  })
  const [feed] = useState<FeedItem[]>(MOCK_FEED)
  const [addOpen, setAddOpen] = useState(false)
  const [addType, setAddType] = useState<'text' | 'video'>('text')
  const [newWish, setNewWish] = useState({ guestName: '', content: '' })
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'info' | 'error' }>({ open: false, msg: '', sev: 'success' })
  const videoInputRef = useRef<HTMLInputElement>(null)

  const notify = useCallback((msg: string, sev: 'success' | 'info' | 'error' = 'success') => setSnack({ open: true, msg, sev }), [])

  const saveWishes = useCallback((w: Wish[]) => {
    setWishes(w)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(w)) } catch {/**/}
  }, [])

  const toggleLike = useCallback((id: string) => {
    saveWishes(wishes.map(w => w.id === id ? { ...w, liked: !w.liked, likeCount: w.liked ? w.likeCount - 1 : w.likeCount + 1 } : w))
  }, [wishes, saveWishes])

  const submitWish = useCallback(() => {
    if (!newWish.guestName.trim() || !newWish.content.trim()) return
    const wish: Wish = {
      id: `w-${Date.now()}`,
      type: addType,
      guestName: newWish.guestName.trim(),
      content: newWish.content.trim(),
      videoThumbnail: addType === 'video' ? 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop' : undefined,
      timestamp: new Date(),
      liked: false,
      likeCount: 0,
    }
    saveWishes([wish, ...wishes])
    setNewWish({ guestName: '', content: '' })
    setAddOpen(false)
    notify(addType === 'text' ? 'Your wish has been sent! 💕' : 'Video wish uploaded! 🎬')
  }, [newWish, addType, wishes, saveWishes, notify])

  const sortedWishes = useMemo(() => [...wishes].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [wishes])
  const textWishes = useMemo(() => sortedWishes.filter(w => w.type === 'text'), [sortedWishes])
  const videoWishes = useMemo(() => sortedWishes.filter(w => w.type === 'video'), [sortedWishes])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: T.bg, display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <Box sx={{ width: '100%', height: 3, bgcolor: T.primary }} />

      {/* HEADER */}
      <Box sx={{ px: { xs: 3, md: '120px' }, pt: { xs: 3, md: '32px' }, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 4, height: 48, background: T.accentGrad, borderRadius: 2, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: { xs: 24, md: 28 }, color: T.primaryBlack }}>Guest Experience Hub</Typography>
              <Chip icon={<Celebration sx={{ fontSize: '16px !important' }} />} label="Live" size="small" sx={{ bgcolor: 'rgba(0,143,83,0.1)', color: T.success, fontFamily: T.font, fontWeight: 700, fontSize: 11 }} />
            </Box>
            <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 15, color: T.textSub, mt: 0.3 }}>Wishes from loved ones & live wedding day feed</Typography>
          </Box>
          <Button onClick={() => { setAddType('text'); setAddOpen(true) }} startIcon={<Add />}
            sx={{ bgcolor: T.primary, color: '#fff', fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', borderRadius: 0, px: 2, '&:hover': { bgcolor: '#006670' } }}>
            Send a Wish
          </Button>
        </Box>
      </Box>

      {/* TABS */}
      <Box sx={{ px: { xs: 2, md: '120px' }, mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ '& .MuiTab-root': { fontFamily: T.font, fontWeight: 600, fontSize: 15, textTransform: 'none', color: T.primaryBlack }, '& .Mui-selected': { color: `${T.primary} !important` }, '& .MuiTabs-indicator': { bgcolor: T.primary } }}>
          <Tab icon={<CardGiftcard sx={{ fontSize: 20 }} />} iconPosition="start" label={`Wishes (${wishes.length})`} />
          <Tab icon={<LiveTv sx={{ fontSize: 20 }} />} iconPosition="start" label={`Live Feed (${feed.length})`} />
        </Tabs>
      </Box>

      {/* CONTENT */}
      <Box sx={{ flex: 1, px: { xs: 2, md: '120px' }, pb: 8 }}>

        {/* ═══════ WISHES TAB ═══════ */}
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Wish Wall */}
            <Box sx={{ flex: 1 }}>
              {/* Quick upload buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                <Button onClick={() => { setAddType('text'); setAddOpen(true) }} startIcon={<TextFields />}
                  sx={{ flex: 1, bgcolor: '#fff', color: T.primary, fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', border: T.border, borderRadius: 0, py: 1.5, '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' } }}>
                  Write a Wish
                </Button>
                <Button onClick={() => { setAddType('video'); setAddOpen(true) }} startIcon={<Videocam />}
                  sx={{ flex: 1, bgcolor: '#fff', color: T.accent, fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', border: '0.25px solid #EB1948', borderRadius: 0, py: 1.5, '&:hover': { bgcolor: 'rgba(235,25,72,0.04)' } }}>
                  Video Wish
                </Button>
              </Box>

              {/* Wishes grid */}
              {sortedWishes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fff', border: T.border }}>
                  <CardGiftcard sx={{ fontSize: 48, color: T.textSub, mb: 2 }} />
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 1 }}>No Wishes Yet</Typography>
                  <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>Be the first to send a wish to the couple!</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                  {sortedWishes.map((wish, idx) => (
                    <Fade in key={wish.id} timeout={200 + idx * 50}>
                      <Card sx={{ overflow: 'hidden', border: '1px solid rgba(0,131,143,0.1)', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(0,37,40,0.06)' } }}>
                        {/* Video thumbnail */}
                        {wish.type === 'video' && wish.videoThumbnail && (
                          <Box sx={{ height: 160, position: 'relative', cursor: 'pointer' }}>
                            <img src={wish.videoThumbnail} alt="Video wish" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PlayArrow sx={{ fontSize: 32, color: T.primary }} />
                              </Box>
                            </Box>
                            <Chip icon={<Videocam sx={{ fontSize: '14px !important', color: '#fff !important' }} />} label="Video" size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(235,25,72,0.85)', color: '#fff', fontFamily: T.font, fontWeight: 700, fontSize: 10 }} />
                          </Box>
                        )}

                        <Box sx={{ p: 2.5 }}>
                          {/* Guest header */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: getAvatarColor(wish.guestName), fontFamily: T.font, fontWeight: 700, fontSize: 13 }}>
                              {getInitials(wish.guestName)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.primaryBlack }}>{wish.guestName}</Typography>
                              <Typography sx={{ fontFamily: T.font, fontSize: 11, color: T.textSub, display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                <AccessTime sx={{ fontSize: 12 }} /> {timeAgo(new Date(wish.timestamp))}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Message */}
                          {wish.type === 'text' && (
                            <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.text, lineHeight: 1.7, mb: 2 }}>{wish.content}</Typography>
                          )}
                          {wish.type === 'video' && (
                            <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub, fontStyle: 'italic', mb: 2 }}>🎬 Video wish from {wish.guestName}</Typography>
                          )}

                          {/* Like */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Button onClick={() => toggleLike(wish.id)} startIcon={wish.liked ? <Favorite sx={{ color: T.accent }} /> : <FavoriteBorder />} size="small"
                              sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, fontSize: 12, color: wish.liked ? T.accent : T.textSub }}>
                              {wish.likeCount} {wish.likeCount === 1 ? 'love' : 'loves'}
                            </Button>
                            {wish.type === 'text' && <Chip icon={<TextFields sx={{ fontSize: '14px !important' }} />} label="Text" size="small" sx={{ height: 22, fontSize: 10, fontFamily: T.font, bgcolor: 'rgba(0,131,143,0.08)', color: T.primary }} />}
                          </Box>
                        </Box>
                      </Card>
                    </Fade>
                  ))}
                </Box>
              )}
            </Box>

            {/* Sidebar stats */}
            <Box sx={{ width: { xs: '100%', md: 260 }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Stats */}
              <Box sx={{ bgcolor: '#fff', border: T.border, p: 2.5 }}>
                <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 2 }}>Wish Wall Stats</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>Total Wishes</Typography>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.primaryBlack }}>{wishes.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>Text Messages</Typography>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.primary }}>{textWishes.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>Video Wishes</Typography>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.accent }}>{videoWishes.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>Total Loves</Typography>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#f59e0b' }}>{wishes.reduce((s, w) => s + w.likeCount, 0)}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Premium */}
              <Box sx={{ bgcolor: '#fff', border: '1px solid rgba(235,25,72,0.2)', p: 2.5, background: 'linear-gradient(135deg, #fff5f7 0%, #fff 100%)' }}>
                <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.primaryBlack, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesome sx={{ color: T.accent, fontSize: 18 }} /> Premium Hub
                </Typography>
                <Typography sx={{ fontFamily: T.font, fontSize: 12, color: T.textSub, mb: 1 }}>Unlock live photo stream, guest selfie wall, QR code sharing, and auto-highlight reels.</Typography>
                <Button fullWidth variant="contained" startIcon={<Lock sx={{ fontSize: '14px !important' }} />}
                  sx={{ bgcolor: T.accent, '&:hover': { bgcolor: '#c01438' }, textTransform: 'none', fontFamily: T.font, fontWeight: 700, fontSize: 13, borderRadius: 0, mt: 1 }}>
                  Upgrade to Premium
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* ═══════ LIVE FEED TAB ═══════ */}
        {tabValue === 1 && (
          <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            {/* Feed header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, p: 2, bgcolor: '#fff', border: T.border }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: T.success, animation: 'pulse 2s infinite', '@keyframes pulse': { '0%': { opacity: 1 }, '50%': { opacity: 0.5 }, '100%': { opacity: 1 } } }} />
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack }}>Live Event Feed</Typography>
              <Chip label="Wedding Day" size="small" sx={{ bgcolor: 'rgba(0,143,83,0.1)', color: T.success, fontFamily: T.font, fontWeight: 700, fontSize: 11 }} />
            </Box>

            {/* Timeline */}
            <Box sx={{ position: 'relative', pl: 4 }}>
              {/* Timeline line */}
              <Box sx={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, bgcolor: 'rgba(0,131,143,0.15)' }} />

              {feed.map((item, idx) => (
                <Fade in key={item.id} timeout={200 + idx * 100}>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    {/* Timeline dot */}
                    <Box sx={{ position: 'absolute', left: -25, top: 16, width: 22, height: 22, borderRadius: '50%', bgcolor: item.type === 'milestone' ? T.primary : item.type === 'announcement' ? T.accent : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <Typography sx={{ fontSize: 10 }}>{item.icon}</Typography>
                    </Box>

                    <Card sx={{ overflow: 'hidden', border: '1px solid rgba(0,131,143,0.1)', ml: 1 }}>
                      {item.image && (
                        <Box sx={{ height: 180 }}>
                          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      )}
                      <Box sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip label={item.type.charAt(0).toUpperCase() + item.type.slice(1)} size="small"
                            sx={{ height: 22, fontSize: 10, fontWeight: 700, fontFamily: T.font, bgcolor: item.type === 'milestone' ? 'rgba(0,131,143,0.1)' : item.type === 'announcement' ? 'rgba(235,25,72,0.1)' : 'rgba(245,158,11,0.1)', color: item.type === 'milestone' ? T.primary : item.type === 'announcement' ? T.accent : '#f59e0b' }} />
                          <Typography sx={{ fontFamily: T.font, fontSize: 12, color: T.textSub, display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <AccessTime sx={{ fontSize: 12 }} />
                            {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: T.primaryBlack, mb: 0.5 }}>{item.title}</Typography>
                        <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.text, lineHeight: 1.7 }}>{item.description}</Typography>
                      </Box>
                    </Card>
                  </Box>
                </Fade>
              ))}
            </Box>

            {/* Premium Live Features */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid rgba(235,25,72,0.2)', p: 3, mt: 3, background: 'linear-gradient(135deg, #fff5f7 0%, #fff 100%)', textAlign: 'center' }}>
              <AutoAwesome sx={{ color: T.accent, fontSize: 32, mb: 1 }} />
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: T.primaryBlack, mb: 1 }}>Premium Live Features</Typography>
              <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub, mb: 2 }}>Real-time photo stream, live guest reactions, DJ request queue, and auto event detection.</Typography>
              <Button variant="contained" startIcon={<Lock sx={{ fontSize: '16px !important' }} />}
                sx={{ bgcolor: T.accent, '&:hover': { bgcolor: '#c01438' }, textTransform: 'none', fontFamily: T.font, fontWeight: 700, fontSize: 14, borderRadius: 0, px: 4 }}>
                Upgrade to Premium
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* ═══════ ADD WISH DIALOG ═══════ */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, border: '1px solid rgba(0,131,143,0.15)' } }}>
        <DialogTitle sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: T.primaryBlack, pb: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
          {addType === 'text' ? <><TextFields sx={{ color: T.primary }} /> Send a Wish</> : <><Videocam sx={{ color: T.accent }} /> Video Wish</>}
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          {/* Type toggle */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip icon={<TextFields sx={{ fontSize: '16px !important' }} />} label="Text" onClick={() => setAddType('text')}
              sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, bgcolor: addType === 'text' ? T.primary : '#fff', color: addType === 'text' ? '#fff' : T.primaryBlack, border: `1px solid ${addType === 'text' ? T.primary : 'rgba(0,131,143,0.2)'}`, cursor: 'pointer' }} />
            <Chip icon={<Videocam sx={{ fontSize: '16px !important' }} />} label="Video" onClick={() => setAddType('video')}
              sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, bgcolor: addType === 'video' ? T.accent : '#fff', color: addType === 'video' ? '#fff' : T.primaryBlack, border: `1px solid ${addType === 'video' ? T.accent : 'rgba(0,131,143,0.2)'}`, cursor: 'pointer' }} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField label="Your Name" fullWidth autoFocus placeholder="e.g. Aunty Funke" value={newWish.guestName}
              onChange={e => setNewWish(p => ({ ...p, guestName: e.target.value }))}
              sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />

            {addType === 'text' ? (
              <TextField label="Your Wish" fullWidth multiline rows={4} placeholder="Write a heartfelt message for the couple..."
                value={newWish.content} onChange={e => setNewWish(p => ({ ...p, content: e.target.value }))}
                sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            ) : (
              <Box>
                <input ref={videoInputRef} type="file" accept="video/*" hidden
                  onChange={e => { if (e.target.files?.[0]) setNewWish(p => ({ ...p, content: e.target.files![0].name })) }} />
                <Box onClick={() => videoInputRef.current?.click()}
                  sx={{ height: 120, border: `2px dashed ${T.accent}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(235,25,72,0.04)' } }}>
                  {newWish.content ? (
                    <><Videocam sx={{ fontSize: 28, color: T.accent, mb: 0.5 }} /><Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.accent }}>{newWish.content}</Typography></>
                  ) : (
                    <><CameraAlt sx={{ fontSize: 28, color: T.textSub, mb: 0.5 }} /><Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>Tap to record or upload a video</Typography></>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, color: '#666' }}>Cancel</Button>
          <Button variant="contained" startIcon={<Send />} onClick={submitWish}
            disabled={!newWish.guestName.trim() || !newWish.content.trim()}
            sx={{ bgcolor: addType === 'text' ? T.primary : T.accent, '&:hover': { bgcolor: addType === 'text' ? '#006670' : '#c01438' }, textTransform: 'none', fontWeight: 700, fontFamily: T.font, px: 3, borderRadius: 0 }}>
            Send Wish
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} TransitionComponent={Slide}>
        <Alert onClose={() => setSnack(p => ({ ...p, open: false }))} severity={snack.sev} variant="filled" sx={{ fontFamily: T.font, fontWeight: 600, borderRadius: 1 }}>{snack.msg}</Alert>
      </Snackbar>

      <Footer />
    </Box>
  )
}
