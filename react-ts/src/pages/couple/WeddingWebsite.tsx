import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  Box, Typography, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, Slide, Fade, Switch, FormControlLabel, Chip, InputAdornment, Select, MenuItem,
} from '@mui/material'
import {
  Edit, Delete, Close, ArrowBack, Public, VisibilityOff, ContentCopy, Check, PhotoCamera,
  Visibility, Share, Link as LinkIcon, LocationOn, Schedule, Palette, CheckCircle,
  QuestionAnswer, Hotel, Lock, LockOpen, Style, FormatSize, Add, ExpandMore, ExpandLess,
  Flight, DirectionsCar, Phone, Language, Favorite, PhotoLibrary,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

/* ═══════ TOKENS ═══════ */
const T = {
  bg: '#FFF6F9', primary: '#00838F', primaryBlack: '#002528',
  accentGrad: 'linear-gradient(255.71deg, #EB1948 65.18%, #B52344 232.03%)',
  accent: '#EB1948', menuSelector: '#ECEBA2', success: '#008F53',
  text: '#2d2d2d', textSub: '#aaaaaa', font: "'Open Sans', sans-serif",
  border: '0.25px solid #00838F', borderBlack: '0.25px solid #002528',
}

/* ═══════ FONT OPTIONS ═══════ */
interface FontOption { id: string; name: string; family: string; category: 'serif' | 'sans-serif' | 'display' | 'script' }
const FONT_OPTIONS: FontOption[] = [
  /* ── Sans-Serif ── */
  { id: 'open-sans',       name: 'Open Sans',         family: "'Open Sans', sans-serif",         category: 'sans-serif' },
  { id: 'montserrat',      name: 'Montserrat',        family: "'Montserrat', sans-serif",        category: 'sans-serif' },
  { id: 'lato',            name: 'Lato',              family: "'Lato', sans-serif",              category: 'sans-serif' },
  { id: 'raleway',         name: 'Raleway',           family: "'Raleway', sans-serif",           category: 'sans-serif' },
  { id: 'josefin',         name: 'Josefin Sans',      family: "'Josefin Sans', sans-serif",      category: 'sans-serif' },
  { id: 'poppins',         name: 'Poppins',           family: "'Poppins', sans-serif",           category: 'sans-serif' },
  { id: 'inter',           name: 'Inter',             family: "'Inter', sans-serif",             category: 'sans-serif' },
  { id: 'dm-sans',         name: 'DM Sans',           family: "'DM Sans', sans-serif",           category: 'sans-serif' },
  { id: 'nunito',          name: 'Nunito',            family: "'Nunito', sans-serif",            category: 'sans-serif' },
  /* ── Serif ── */
  { id: 'playfair',        name: 'Playfair Display',  family: "'Playfair Display', serif",       category: 'serif' },
  { id: 'georgia',         name: 'Georgia',           family: "'Georgia', serif",                category: 'serif' },
  { id: 'times',           name: 'Times New Roman',   family: "'Times New Roman', serif",        category: 'serif' },
  { id: 'cormorant',       name: 'Cormorant Garamond',family: "'Cormorant Garamond', serif",    category: 'serif' },
  { id: 'eb-garamond',     name: 'EB Garamond',       family: "'EB Garamond', serif",            category: 'serif' },
  { id: 'libre-baskerville', name: 'Libre Baskerville', family: "'Libre Baskerville', serif",   category: 'serif' },
  { id: 'merriweather',    name: 'Merriweather',      family: "'Merriweather', serif",           category: 'serif' },
  { id: 'lora',            name: 'Lora',              family: "'Lora', serif",                   category: 'serif' },
  { id: 'dm-serif',        name: 'DM Serif Display',  family: "'DM Serif Display', serif",      category: 'serif' },
  /* ── Display ── */
  { id: 'cinzel',          name: 'Cinzel',            family: "'Cinzel', serif",                 category: 'display' },
  { id: 'abril',           name: 'Abril Fatface',     family: "'Abril Fatface', serif",          category: 'display' },
  { id: 'bodoni',          name: 'Bodoni Moda',       family: "'Bodoni Moda', serif",            category: 'display' },
  /* ── Script ── */
  { id: 'great-vibes',     name: 'Great Vibes',       family: "'Great Vibes', cursive",          category: 'script' },
  { id: 'dancing-script',  name: 'Dancing Script',    family: "'Dancing Script', cursive",       category: 'script' },
  { id: 'parisienne',      name: 'Parisienne',        family: "'Parisienne', cursive",           category: 'script' },
]

/* ═══════ 18 TEMPLATES ═══════ */
interface TemplateCard {
  id: string; name: string; category: string; previewImage: string; palette: string[]
  titleFont: string; titleColor: string; subtitleColor: string; cardBg: string
  overlayPosition: 'top' | 'center' | 'bottom'; decorative?: 'border-top' | 'frame' | 'none'
}
const TEMPLATES: TemplateCard[] = [
  { id: 'eternal-love',       name: 'Eternal Love',       category: 'Romantic',     previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=300&fit=crop', palette: ['#002528','#EB1948','#00838F','#5C56D4','#ECEBA2'], titleFont: "'Georgia', serif",         titleColor: '#e6a631', subtitleColor: '#e6a631', cardBg: '#ffffff', overlayPosition: 'top',    decorative: 'border-top' },
  { id: 'modern-minimalist',   name: 'Modern Minimalist',  category: 'Modern',       previewImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=300&fit=crop', palette: ['#002528','#EB1948','#00838F','#5C56D4','#ECEBA2'], titleFont: "'Playfair Display', serif", titleColor: '#ffffff', subtitleColor: '#ffaeae', cardBg: '#8b4557', overlayPosition: 'center', decorative: 'none' },
  { id: 'timeless-classic',    name: 'Timeless Classic',   category: 'Classic',      previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=300&fit=crop', palette: ['#002528','#EB1948','#00838F','#5C56D4','#ECEBA2'], titleFont: "'Times New Roman', serif", titleColor: '#fffcf8', subtitleColor: '#e6a631', cardBg: '#2d2d2d', overlayPosition: 'bottom', decorative: 'none' },
  { id: 'enchanted-garden',    name: 'Enchanted Garden',   category: 'Romantic',     previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=300&fit=crop', palette: ['#002528','#EB1948','#00838F','#5C56D4','#ECEBA2'], titleFont: "'Georgia', serif",         titleColor: '#ffffff', subtitleColor: '#ddd9ff', cardBg: '#5C56D4', overlayPosition: 'center', decorative: 'frame' },
  { id: 'coastal-breeze',      name: 'Coastal Breeze',     category: 'Beach',        previewImage: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=300&fit=crop', palette: ['#002528','#EB1948','#00838F','#5C56D4','#ECEBA2'], titleFont: "'Playfair Display', serif", titleColor: '#ffffff', subtitleColor: '#bfe2ff', cardBg: '#00838F', overlayPosition: 'top',    decorative: 'none' },
  { id: 'golden-hour',         name: 'Golden Hour',        category: 'Warm',         previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=300&fit=crop', palette: ['#002528','#EB1948','#00838F','#5C56D4','#ECEBA2'], titleFont: "'Times New Roman', serif", titleColor: '#2979ba', subtitleColor: '#2979ba', cardBg: '#ffffff', overlayPosition: 'bottom', decorative: 'none' },
  /* ── NEW 12 ── */
  { id: 'midnight-bloom',      name: 'Midnight Bloom',     category: 'Dramatic',     previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop', palette: ['#1a0a2e','#e91e63','#9c27b0','#f8bbd0','#fce4ec'], titleFont: "'Cinzel', serif",          titleColor: '#f8bbd0', subtitleColor: '#f8bbd0', cardBg: '#1a0a2e', overlayPosition: 'center', decorative: 'frame' },
  { id: 'tuscan-vineyard',     name: 'Tuscan Vineyard',    category: 'Rustic',       previewImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=300&fit=crop', palette: ['#4a2c2a','#8d6e63','#d4a574','#f5e6c8','#fff8e1'], titleFont: "'Cormorant Garamond', serif", titleColor: '#d4a574', subtitleColor: '#d4a574', cardBg: '#4a2c2a', overlayPosition: 'bottom', decorative: 'none' },
  { id: 'cherry-blossom',      name: 'Cherry Blossom',     category: 'Romantic',     previewImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=300&fit=crop', palette: ['#880e4f','#f48fb1','#fce4ec','#ffffff','#e91e63'], titleFont: "'Dancing Script', cursive", titleColor: '#880e4f', subtitleColor: '#880e4f', cardBg: '#fce4ec', overlayPosition: 'top',    decorative: 'border-top' },
  { id: 'art-deco',            name: 'Art Deco',           category: 'Glamour',      previewImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=300&fit=crop', palette: ['#1a1a2e','#d4af37','#c0a53e','#f5e6c8','#16213e'], titleFont: "'Cinzel', serif",          titleColor: '#d4af37', subtitleColor: '#d4af37', cardBg: '#1a1a2e', overlayPosition: 'center', decorative: 'frame' },
  { id: 'nordic-winter',       name: 'Nordic Winter',      category: 'Minimalist',   previewImage: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&h=300&fit=crop', palette: ['#1e3a5f','#b0c4de','#e3f2fd','#ffffff','#90a4ae'], titleFont: "'Josefin Sans', sans-serif", titleColor: '#1e3a5f', subtitleColor: '#1e3a5f', cardBg: '#e3f2fd', overlayPosition: 'top',    decorative: 'none' },
  { id: 'bohemian-sunset',     name: 'Bohemian Sunset',    category: 'Boho',         previewImage: 'https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?w=600&h=300&fit=crop', palette: ['#bf360c','#ff8a65','#ffe0b2','#795548','#4e342e'], titleFont: "'Raleway', sans-serif",    titleColor: '#ffe0b2', subtitleColor: '#ffe0b2', cardBg: '#bf360c', overlayPosition: 'center', decorative: 'none' },
  { id: 'paris-romance',       name: 'Paris Romance',      category: 'Classic',      previewImage: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600&h=300&fit=crop', palette: ['#2d2d2d','#c49b5c','#f5e6c8','#ffffff','#8d6e63'], titleFont: "'EB Garamond', serif",     titleColor: '#c49b5c', subtitleColor: '#c49b5c', cardBg: '#2d2d2d', overlayPosition: 'bottom', decorative: 'none' },
  { id: 'tropical-paradise',   name: 'Tropical Paradise',  category: 'Beach',        previewImage: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&h=300&fit=crop', palette: ['#00695c','#80cbc4','#e0f2f1','#ffffff','#ff8a65'], titleFont: "'Montserrat', sans-serif", titleColor: '#ffffff', subtitleColor: '#e0f2f1', cardBg: '#00695c', overlayPosition: 'center', decorative: 'none' },
  { id: 'lavender-fields',     name: 'Lavender Fields',    category: 'Romantic',     previewImage: 'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=600&h=300&fit=crop', palette: ['#4a148c','#ce93d8','#f3e5f5','#ffffff','#7b1fa2'], titleFont: "'Libre Baskerville', serif", titleColor: '#ffffff', subtitleColor: '#e1bee7', cardBg: '#4a148c', overlayPosition: 'top',    decorative: 'frame' },
  { id: 'scandinavian',        name: 'Scandinavian',       category: 'Minimalist',   previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop', palette: ['#37474f','#90a4ae','#eceff1','#ffffff','#607d8b'], titleFont: "'Lato', sans-serif",       titleColor: '#37474f', subtitleColor: '#607d8b', cardBg: '#eceff1', overlayPosition: 'bottom', decorative: 'none' },
  { id: 'regal-burgundy',      name: 'Regal Burgundy',     category: 'Glamour',      previewImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=300&fit=crop', palette: ['#4a0e0e','#c62828','#d4af37','#f5e6c8','#ffffff'], titleFont: "'Cinzel', serif",          titleColor: '#d4af37', subtitleColor: '#f5e6c8', cardBg: '#4a0e0e', overlayPosition: 'center', decorative: 'frame' },
  { id: 'fresh-greenery',      name: 'Fresh Greenery',     category: 'Botanical',    previewImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=300&fit=crop', palette: ['#1b5e20','#66bb6a','#c8e6c9','#ffffff','#a5d6a7'], titleFont: "'Cormorant Garamond', serif", titleColor: '#ffffff', subtitleColor: '#c8e6c9', cardBg: '#1b5e20', overlayPosition: 'top',    decorative: 'none' },
]

/* ═══════ COLOUR PALETTES ═══════ */
interface ColorPaletteOption { id: string; name: string; colors: CustomColors }
const COLOR_PALETTES: ColorPaletteOption[] = [
  { id: 'teal-gold',       name: 'Teal & Gold',        colors: { primary: '#00838F', secondary: '#d4af37', accent: '#EB1948', text: '#002528', bg: '#ffffff' } },
  { id: 'blush-rose',      name: 'Blush & Rose',       colors: { primary: '#8b4557', secondary: '#e8b4b8', accent: '#d4af37', text: '#3d2020', bg: '#fff5f5' } },
  { id: 'navy-cream',      name: 'Navy & Cream',       colors: { primary: '#1e3a5f', secondary: '#f5e6c8', accent: '#c49b5c', text: '#1a1a1a', bg: '#faf8f5' } },
  { id: 'sage-ivory',      name: 'Sage & Ivory',       colors: { primary: '#6b8f6b', secondary: '#f5f0e8', accent: '#b8860b', text: '#2d3a2d', bg: '#f8faf5' } },
  { id: 'lavender-silver',  name: 'Lavender & Silver',  colors: { primary: '#7b68ae', secondary: '#c0c0c0', accent: '#e8b4d0', text: '#2d2535', bg: '#f8f5ff' } },
  { id: 'coral-teal',      name: 'Coral & Teal',       colors: { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#ffd93d', text: '#2d2d2d', bg: '#ffffff' } },
  { id: 'burgundy-gold',   name: 'Burgundy & Gold',    colors: { primary: '#722f37', secondary: '#c49b5c', accent: '#1a1a1a', text: '#2d1a1d', bg: '#fdf8f0' } },
  { id: 'dusty-blue',      name: 'Dusty Blue',         colors: { primary: '#6b9ac4', secondary: '#e8d5b7', accent: '#b0c4de', text: '#2c3e50', bg: '#f0f5fa' } },
  { id: 'emerald-gold',    name: 'Emerald & Gold',     colors: { primary: '#2d5a27', secondary: '#d4af37', accent: '#1a1a1a', text: '#1a2e1a', bg: '#f5faf5' } },
  { id: 'terracotta',      name: 'Terracotta',         colors: { primary: '#c2703e', secondary: '#e8d5b7', accent: '#8b6f47', text: '#3a2a1a', bg: '#fdf6ec' } },
  { id: 'ocean-blue',      name: 'Ocean Blue',         colors: { primary: '#1e6091', secondary: '#74c0fc', accent: '#ffd93d', text: '#1a2d3d', bg: '#f0f9ff' } },
  { id: 'noir-elegant',    name: 'Noir Elegant',       colors: { primary: '#1a1a1a', secondary: '#d4af37', accent: '#8b0000', text: '#1a1a1a', bg: '#faf9f6' } },
  /* ── MINIMAL PALETTES ── */
  { id: 'warm-neutral',    name: 'Warm Neutral',       colors: { primary: '#6b5b4f', secondary: '#c4b5a5', accent: '#9e8e7e', text: '#3a3330', bg: '#f9f6f3' } },
  { id: 'soft-grey',       name: 'Soft Grey',          colors: { primary: '#5a5a5a', secondary: '#b0b0b0', accent: '#8a8a8a', text: '#333333', bg: '#f5f5f5' } },
  { id: 'ivory-blush',     name: 'Ivory & Blush',      colors: { primary: '#a68a7b', secondary: '#e8d5cc', accent: '#c9a99a', text: '#4a3f3a', bg: '#faf7f5' } },
  { id: 'muted-olive',     name: 'Muted Olive',        colors: { primary: '#6b7c5e', secondary: '#b5c4a8', accent: '#8b9e7c', text: '#3a4233', bg: '#f5f7f3' } },
  { id: 'stone-sand',      name: 'Stone & Sand',       colors: { primary: '#7a7068', secondary: '#d4c9b8', accent: '#b3a593', text: '#3e3830', bg: '#f8f5f0' } },
  { id: 'mono-black',      name: 'Monochrome',         colors: { primary: '#2c2c2c', secondary: '#e0e0e0', accent: '#666666', text: '#1a1a1a', bg: '#ffffff' } },
]

/* ═══════ TYPES ═══════ */
interface ScheduleEvent { id: string; time: string; event: string; location: string }
interface FAQItem { id: string; question: string; answer: string }
interface HotelBlock { id: string; name: string; address: string; phone: string; website: string; rate: string; deadline: string; notes: string; distance: string }
interface StationeryItem { id: string; type: 'save-the-date' | 'invitation' | 'menu' | 'program' | 'thank-you'; title: string; description: string; matched: boolean }
interface CustomColors { primary: string; secondary: string; accent: string; text: string; bg: string }

interface WebsiteData {
  url: string; published: boolean; theme: string; templateId: string; customColors: CustomColors
  coverImage: string; coupleNames: { partner1: string; partner2: string }
  weddingDate: string; weddingTime: string; venue: { name: string; address: string }
  story: string; rsvpEnabled: boolean; schedule: ScheduleEvent[]; photos: string[]
  /* NEW */
  headingFont: string; bodyFont: string
  faq: FAQItem[]; hotels: HotelBlock[]; stationery: StationeryItem[]
  privacyEnabled: boolean; privacyPassword: string
  travelNotes: string; transportation: string
}

type FilterTab = 'details' | 'schedule' | 'faq' | 'travel' | 'stationery' | 'photos' | 'settings'
type InnerView = null | 'detail' | 'preview'
type PageView = 'gallery' | 'editor'

/* ═══════ DEFAULTS / STORAGE ═══════ */
const defaultData: WebsiteData = {
  url: 'sarah-and-james', published: false, theme: '', templateId: '',
  customColors: { primary: '#00838F', secondary: '#d4af37', accent: '#EB1948', text: '#002528', bg: '#ffffff' },
  coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop',
  coupleNames: { partner1: '', partner2: '' }, weddingDate: '', weddingTime: '',
  venue: { name: '', address: '' }, story: '', rsvpEnabled: true, schedule: [], photos: [],
  headingFont: 'playfair', bodyFont: 'open-sans',
  faq: [], hotels: [], stationery: [
    { id: '1', type: 'save-the-date', title: 'Save the Date', description: 'Announce your wedding date with a matching card', matched: false },
    { id: '2', type: 'invitation',    title: 'Wedding Invitation', description: 'Formal invitation matching your website theme', matched: false },
    { id: '3', type: 'menu',          title: 'Menu Card', description: 'Reception menu in your chosen style', matched: false },
    { id: '4', type: 'program',       title: 'Ceremony Program', description: 'Guide guests through the ceremony', matched: false },
    { id: '5', type: 'thank-you',     title: 'Thank You Card', description: 'Express gratitude with style', matched: false },
  ],
  privacyEnabled: false, privacyPassword: '', travelNotes: '', transportation: '',
}

const STORAGE = 'itw_website'
const load = (): WebsiteData => {
  try {
    const r = localStorage.getItem(STORAGE)
    if (r) { const p = JSON.parse(r); return { ...defaultData, ...p, customColors: p.customColors || defaultData.customColors, templateId: p.templateId || '', faq: p.faq || [], hotels: p.hotels || [], stationery: p.stationery || defaultData.stationery, headingFont: p.headingFont || 'playfair', bodyFont: p.bodyFont || 'open-sans', privacyEnabled: p.privacyEnabled || false, privacyPassword: p.privacyPassword || '', travelNotes: p.travelNotes || '', transportation: p.transportation || '' } }
    return defaultData
  } catch { return defaultData }
}
const save = (w: WebsiteData) => { try { localStorage.setItem(STORAGE, JSON.stringify(w)) } catch {/**/} }

const formatTime = (time: string) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours); const ampm = hour >= 12 ? 'PM' : 'AM'; const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}
const getFont = (id: string) => FONT_OPTIONS.find(f => f.id === id)?.family || T.font

/* ═══════ SUB-COMPONENTS ═══════ */

/* ── TEMPLATE PREVIEW CARD ── */
function TemplatePreviewCard({ template, onSelect, selected }: { template: TemplateCard; onSelect: (id: string) => void; selected: boolean }) {
  return (
    <Box onClick={() => onSelect(template.id)} sx={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,37,40,0.12)' } }}>
      <Box sx={{ width: '100%', aspectRatio: '383/260', borderRadius: '4px', overflow: 'hidden', position: 'relative', bgcolor: template.cardBg, border: selected ? `3px solid ${T.primary}` : '1px solid rgba(0,131,143,0.1)' }}>
        {template.decorative === 'border-top' && <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 20, zIndex: 2, background: 'repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 8px, transparent 8px, transparent 16px)', opacity: 0.8 }} />}
        {template.decorative === 'frame' && <Box sx={{ position: 'absolute', inset: 8, border: '2px solid rgba(255,255,255,0.4)', borderRadius: '2px', zIndex: 2, pointerEvents: 'none' }} />}
        {template.overlayPosition === 'center' || template.overlayPosition === 'bottom' ? (
          <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src={template.previewImage} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: template.overlayPosition === 'center' ? 0.7 : 1 }} />
            {template.overlayPosition === 'center' && <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)' }} />}
          </Box>
        ) : (
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', zIndex: 0 }}>
            <img src={template.previewImage} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        )}
        <Box sx={{ position: 'absolute', zIndex: 3, ...(template.overlayPosition === 'top' ? { top: 28, left: 0, right: 0, textAlign: 'center' } : template.overlayPosition === 'center' ? { top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', textAlign: 'center' } : { bottom: 20, left: 0, right: 0, textAlign: 'center' }) }}>
          <Typography sx={{ fontFamily: template.titleFont, fontSize: { xs: 18, md: 24 }, fontWeight: 700, color: template.titleColor, lineHeight: 1.2, textShadow: template.overlayPosition !== 'top' ? '0 1px 8px rgba(0,0,0,0.3)' : 'none' }}>JANE & DOE</Typography>
          <Typography sx={{ fontFamily: T.font, fontSize: { xs: 8, md: 10 }, fontWeight: 600, color: template.subtitleColor, mt: 0.3, letterSpacing: 0.5 }}>FEB, 20, 2025 · VICTORIA ISLAND, LAGOS</Typography>
        </Box>
        {template.overlayPosition === 'top' && template.decorative !== 'frame' && (
          <Box sx={{ position: 'absolute', bottom: 0, left: '15%', right: '15%', height: '45%', zIndex: 1 }}>
            <img src={template.previewImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        )}
        {selected && <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 4, width: 28, height: 28, borderRadius: '50%', bgcolor: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check sx={{ color: '#fff', fontSize: 18 }} /></Box>}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
        <Box>
          <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: T.primaryBlack, lineHeight: 1.2 }}>{template.name}</Typography>
          <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 14, color: '#8a8a8a' }}>{template.category}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {template.palette.map((c, i) => <Box key={i} sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: c, border: c === '#ECEBA2' ? '1px solid #ccc' : 'none' }} />)}
        </Box>
      </Box>
    </Box>
  )
}

/* ── COLOUR PALETTE PICKER ── */
function ColorPalettePicker({ activePaletteId, customColors, onSelectPalette, onCustomColorChange }: { activePaletteId: string; customColors: CustomColors; onSelectPalette: (p: ColorPaletteOption) => void; onCustomColorChange: (key: keyof CustomColors, value: string) => void }) {
  const [showCustom, setShowCustom] = useState(false)
  const lightBgs = ['#ffffff','#faf9f6','#f5faf5','#faf8f5','#f8faf5','#f8f5ff','#fdf8f0','#f0f5fa','#fdf6ec','#f0f9ff','#fff5f5','#f9f6f3','#f5f5f5','#faf7f5','#f5f7f3','#f8f5f0']
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Palette sx={{ color: T.primary, fontSize: 22 }} />
        <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack }}>Colour Palette</Typography>
      </Box>
      <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub, mb: 1 }}>Sets the colours across your entire website — headings, buttons, backgrounds, text</Typography>
      <Typography sx={{ fontFamily: T.font, fontSize: 12, color: '#888', mb: 2.5, fontStyle: 'italic' }}>Tip: Templates control the visual layout. Colour palettes control the colour scheme. Mix any template with any palette!</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5, mb: 3 }}>
        {COLOR_PALETTES.map(palette => {
          const isA = activePaletteId === palette.id
          const c = palette.colors
          return (
            <Box key={palette.id} onClick={() => onSelectPalette(palette)} sx={{ cursor: 'pointer', borderRadius: '10px', border: isA ? `2.5px solid ${T.primary}` : '1px solid rgba(0,131,143,0.12)', transition: 'all 0.2s', overflow: 'hidden', bgcolor: '#fff', '&:hover': { borderColor: T.primary, boxShadow: '0 2px 12px rgba(0,131,143,0.1)' } }}>
              {/* Visual preview bar */}
              <Box sx={{ height: 48, display: 'flex', position: 'relative' }}>
                <Box sx={{ flex: 2, bgcolor: c.primary }} />
                <Box sx={{ flex: 1.5, bgcolor: c.secondary }} />
                <Box sx={{ flex: 1, bgcolor: c.accent }} />
                <Box sx={{ flex: 0.5, bgcolor: c.bg, borderRight: lightBgs.includes(c.bg) ? '1px solid #e0e0e0' : 'none' }} />
                {isA && <Box sx={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}><CheckCircle sx={{ fontSize: 18, color: T.primary }} /></Box>}
              </Box>
              <Box sx={{ px: 1.5, py: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 12.5, color: T.primaryBlack }}>{palette.name}</Typography>
                <Box sx={{ display: 'flex', gap: 0.4 }}>
                  {Object.values(c).map((col, i) => <Box key={i} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: col, border: lightBgs.includes(col) ? '1px solid #ddd' : 'none' }} />)}
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
      <Button onClick={() => setShowCustom(!showCustom)} startIcon={<Palette />} sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.primary, mb: showCustom ? 2 : 0 }}>
        {showCustom ? 'Hide Custom Colours' : 'Create Custom Colours'}
      </Button>
      {showCustom && (
        <Fade in timeout={300}>
          <Box sx={{ p: 3, borderRadius: '10px', border: '1px solid rgba(0,131,143,0.15)', bgcolor: 'rgba(0,131,143,0.02)' }}>
            <Box sx={{ display: 'flex', gap: 0, mb: 2.5, borderRadius: '6px', overflow: 'hidden', height: 40, border: '1px solid rgba(0,0,0,0.08)' }}>
              {(['primary','secondary','accent','text','bg'] as const).map(key => <Box key={key} sx={{ flex: 1, bgcolor: customColors[key] }} />)}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 2 }}>
              {(['primary','secondary','accent','text','bg'] as const).map(key => (
                <Box key={key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '10px', bgcolor: customColors[key], border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: 'pointer', transition: 'transform 0.15s', '&:hover': { transform: 'scale(1.08)' } }} />
                    <input type="color" value={customColors[key]} onChange={(e) => onCustomColorChange(key, e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: 48, height: 48, opacity: 0, cursor: 'pointer' }} />
                  </Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 11, color: T.primaryBlack }}>{key.charAt(0).toUpperCase()+key.slice(1)}</Typography>
                  <Typography sx={{ fontSize: 10, color: T.textSub, fontFamily: 'monospace' }}>{customColors[key].toUpperCase()}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  )
}

/* ── FONT PICKER ── */
function FontPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.primaryBlack, mb: 1 }}>{label}</Typography>
      <Select value={value} onChange={e => onChange(e.target.value)} fullWidth size="small"
        sx={{ fontFamily: T.font, '& .MuiSelect-select': { fontFamily: getFont(value) } }}>
        {FONT_OPTIONS.map(f => <MenuItem key={f.id} value={f.id} sx={{ fontFamily: f.family }}>{f.name} <Chip label={f.category} size="small" sx={{ ml: 1, height: 18, fontSize: 10 }} /></MenuItem>)}
      </Select>
      <Typography sx={{ fontFamily: getFont(value), fontSize: 18, color: T.text, mt: 1, p: 1.5, bgcolor: 'rgba(0,131,143,0.02)', borderRadius: 1 }}>The quick brown fox jumps over the lazy dog</Typography>
    </Box>
  )
}

/* ═══════ EMPTY STATE ═══════ */
function EmptyState({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <Fade in timeout={400}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, px: 3 }}>
        <Box sx={{ width: 80, height: 80, borderRadius: '16px', bgcolor: 'rgba(0,131,143,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Icon sx={{ fontSize: 36, color: T.primary }} />
        </Box>
        <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 0.8 }}>{title}</Typography>
        <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>{sub}</Typography>
      </Box>
    </Fade>
  )
}

/* ═══════ MAIN COMPONENT ═══════ */
export default function WeddingWebsite() {
  const [website, setWebsite] = useState<WebsiteData>(load)
  const [view, setView] = useState<PageView>(() => load().templateId ? 'editor' : 'gallery')
  const [tab, setTab] = useState<FilterTab>('details')
  const [innerView, setInnerView] = useState<InnerView>(null)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addType, setAddType] = useState<'event'|'faq'|'hotel'>('event')
  const [newEvent, setNewEvent] = useState({ time: '', event: '', location: '' })
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [newHotel, setNewHotel] = useState<Omit<HotelBlock, 'id'>>({ name: '', address: '', phone: '', website: '', rate: '', deadline: '', notes: '', distance: '' })
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'info' | 'error' }>({ open: false, msg: '', sev: 'success' })
  const [copied, setCopied] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleteContext, setDeleteContext] = useState<'event'|'faq'|'hotel'>('event')
  const [page, setPage] = useState(1)
  const [activePaletteId, setActivePaletteId] = useState<string>('teal-gold')
  const [showMoreTemplates, setShowMoreTemplates] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [galleryFilter, setGalleryFilter] = useState('All')
  const ITEMS_PER_PAGE = 10

  useEffect(() => { save(website) }, [website])

  const notify = useCallback((msg: string, sev: 'success' | 'info' | 'error' = 'success') => setSnack({ open: true, msg, sev }), [])
  const updateWebsite = useCallback((updates: Partial<WebsiteData>) => setWebsite(prev => ({ ...prev, ...updates })), [])
  const currentTemplate = useMemo(() => TEMPLATES.find(t => t.id === website.templateId), [website.templateId])
  const websiteUrl = `https://itheewed.com/w/${website.url}`
  const copyUrl = () => { navigator.clipboard.writeText(websiteUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const selectTemplate = useCallback((id: string) => { updateWebsite({ templateId: id }); setView('editor'); notify('Template selected! Customise your website.') }, [notify, updateWebsite])
  const selectPalette = useCallback((p: ColorPaletteOption) => { setActivePaletteId(p.id); updateWebsite({ customColors: { ...p.colors } }); notify(`"${p.name}" palette applied`) }, [notify, updateWebsite])
  const updateCustomColor = useCallback((key: keyof CustomColors, value: string) => { setActivePaletteId('custom'); updateWebsite({ customColors: { ...website.customColors, [key]: value } }) }, [website.customColors, updateWebsite])

  const counts = useMemo(() => ({
    details: 1, schedule: website.schedule.length, faq: website.faq.length,
    travel: website.hotels.length, stationery: website.stationery.filter(s => s.matched).length,
    photos: website.photos.length, settings: 1,
  }), [website])

  /* ── CRUD helpers ── */
  const addEvent = useCallback(() => {
    if (!newEvent.event.trim()) return
    updateWebsite({ schedule: [...website.schedule, { id: `${Date.now()}`, ...newEvent, event: newEvent.event.trim() }] })
    setNewEvent({ time: '', event: '', location: '' }); setAddOpen(false); notify('Event added')
  }, [newEvent, website.schedule, notify, updateWebsite])

  const addFaqItem = useCallback(() => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return
    updateWebsite({ faq: [...website.faq, { id: `${Date.now()}`, question: newFaq.question.trim(), answer: newFaq.answer.trim() }] })
    setNewFaq({ question: '', answer: '' }); setAddOpen(false); notify('FAQ added')
  }, [newFaq, website.faq, notify, updateWebsite])

  const addHotelItem = useCallback(() => {
    if (!newHotel.name.trim()) return
    updateWebsite({ hotels: [...website.hotels, { id: `${Date.now()}`, ...newHotel, name: newHotel.name.trim() }] })
    setNewHotel({ name: '', address: '', phone: '', website: '', rate: '', deadline: '', notes: '', distance: '' }); setAddOpen(false); notify('Hotel block added')
  }, [newHotel, website.hotels, notify, updateWebsite])

  const deleteItem = useCallback((id: string, ctx: 'event'|'faq'|'hotel') => {
    if (ctx === 'event') { updateWebsite({ schedule: website.schedule.filter(e => e.id !== id) }); if (selectedEvent?.id === id) { setSelectedEvent(null); setInnerView(null) } }
    else if (ctx === 'faq') updateWebsite({ faq: website.faq.filter(f => f.id !== id) })
    else updateWebsite({ hotels: website.hotels.filter(h => h.id !== id) })
  }, [website, selectedEvent, updateWebsite])

  const confirmDelete = useCallback((id: string, ctx: 'event'|'faq'|'hotel') => { setDeleteTarget(id); setDeleteContext(ctx) }, [])
  const handleDeleteConfirmed = useCallback(() => { if (deleteTarget) deleteItem(deleteTarget, deleteContext); setDeleteTarget(null) }, [deleteTarget, deleteContext, deleteItem])

  const updateEvent = useCallback((u: ScheduleEvent) => {
    updateWebsite({ schedule: website.schedule.map(e => e.id === u.id ? u : e) })
    setEditingEvent(null); setSelectedEvent(u); notify('Event updated')
  }, [website.schedule, notify, updateWebsite])

  const toggleStationeryMatch = useCallback((id: string) => {
    updateWebsite({ stationery: website.stationery.map(s => s.id === id ? { ...s, matched: !s.matched } : s) })
  }, [website.stationery, updateWebsite])

  const openEventDetail = (e: ScheduleEvent) => { setSelectedEvent(e); setEditingEvent(null); setInnerView('detail') }
  const closePanel = () => { setInnerView(null); setSelectedEvent(null); setEditingEvent(null) }

  /* ── tab meta ── */
  const tabMeta: Record<FilterTab, { label: string; badgeBg: string; badgeColor: string; count: number }> = {
    details:    { label: 'Details',    badgeBg: T.menuSelector, badgeColor: T.primaryBlack, count: counts.details },
    schedule:   { label: 'Schedule',   badgeBg: T.success,      badgeColor: '#fff',          count: counts.schedule },
    faq:        { label: 'Q&A',        badgeBg: '#7b68ae',      badgeColor: '#fff',          count: counts.faq },
    travel:     { label: 'Travel',     badgeBg: '#1e6091',      badgeColor: '#fff',          count: counts.travel },
    stationery: { label: 'Stationery', badgeBg: '#c49b5c',      badgeColor: '#fff',          count: counts.stationery },
    photos:     { label: 'Photos',     badgeBg: T.primaryBlack, badgeColor: '#fff',          count: counts.photos },
    settings:   { label: 'Settings',   badgeBg: 'none',         badgeColor: '#fff',          count: counts.settings },
  }

  /* ── completion tracker ── */
  const completionItems = useMemo(() => [
    { label: 'Cover Image', done: !!website.coverImage && website.coverImage !== defaultData.coverImage },
    { label: 'Couple Names', done: !!website.coupleNames.partner1 && !!website.coupleNames.partner2 },
    { label: 'Wedding Date', done: !!website.weddingDate },
    { label: 'Venue', done: !!website.venue.name },
    { label: 'Our Story', done: !!website.story.trim() },
    { label: 'Schedule', done: website.schedule.length > 0 },
    { label: 'Q&A', done: website.faq.length > 0 },
    { label: 'Photos', done: website.photos.length > 0 },
  ], [website])
  const completionPct = useMemo(() => Math.round((completionItems.filter(c => c.done).length / completionItems.length) * 100), [completionItems])

  /* gallery filter */
  const categories = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))]
  const filteredTemplates = galleryFilter === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === galleryFilter)
  const visibleTemplates = showMoreTemplates ? filteredTemplates : filteredTemplates.slice(0, 6)

  /* ═══════════════════════════════
     GALLERY VIEW
     ═══════════════════════════════ */
  if (view === 'gallery') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <Box sx={{ width: '100%', height: 3, bgcolor: T.primary }} />
        <Box sx={{ flex: 1, px: { xs: 3, md: '132px' }, pt: { xs: 4, md: '50px' }, pb: { xs: 4, md: '40px' } }}>
          {/* Category filter */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <Chip key={cat} label={cat} onClick={() => { setGalleryFilter(cat); setShowMoreTemplates(false) }}
                sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, bgcolor: galleryFilter === cat ? T.primary : '#fff', color: galleryFilter === cat ? '#fff' : T.primaryBlack, border: `1px solid ${galleryFilter === cat ? T.primary : 'rgba(0,131,143,0.2)'}`, cursor: 'pointer', '&:hover': { bgcolor: galleryFilter === cat ? '#006670' : 'rgba(0,131,143,0.04)' } }} />
            ))}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 3, md: '40px' }, rowGap: { xs: 4, md: '50px' } }}>
            {visibleTemplates.map(tmpl => <TemplatePreviewCard key={tmpl.id} template={tmpl} onSelect={selectTemplate} selected={website.templateId === tmpl.id} />)}
          </Box>
          {filteredTemplates.length > 6 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: '50px' } }}>
              <Button onClick={() => setShowMoreTemplates(!showMoreTemplates)} sx={{ bgcolor: T.primary, color: '#fff', fontFamily: T.font, fontWeight: 700, fontSize: 20, textTransform: 'none', width: 200, height: 50, borderRadius: 0, '&:hover': { bgcolor: '#006670' } }}>
                {showMoreTemplates ? 'Show Less' : 'Check More'}
              </Button>
            </Box>
          )}
        </Box>
        <Footer />
      </Box>
    )
  }

  /* ═══════════════════════════════
     EDITOR VIEW
     ═══════════════════════════════ */
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: T.bg, display: 'flex', flexDirection: 'column' }}>
      <Nav />

      {/* PAGE HEADER */}
      <Box sx={{ px: { xs: 3, md: '120px' }, pt: { xs: 4, md: '40px' }, pb: { xs: 3, md: '28px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 4, height: 48, background: T.accentGrad, borderRadius: 2, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: { xs: 24, md: 28 }, color: T.primaryBlack, lineHeight: 1.2 }}>Wedding Website</Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 15, color: T.textSub, mt: 0.3 }}>Create a beautiful website to share with your guests</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button onClick={() => setView('gallery')} startIcon={<Palette />} sx={{ bgcolor: '#fff', color: T.primary, fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', border: T.border, borderRadius: 0, px: 2, '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' } }}>Templates</Button>
            <Button onClick={() => setPreviewOpen(true)} startIcon={<Visibility />} sx={{ bgcolor: '#fff', color: T.primary, fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', border: T.border, borderRadius: 0, px: 2, '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' } }}>Preview</Button>
            <Button onClick={copyUrl} startIcon={copied ? <Check /> : <Share />} sx={{ bgcolor: T.primary, color: '#fff', fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', borderRadius: 0, px: 2, '&:hover': { bgcolor: '#006670' } }}>{copied ? 'Copied!' : 'Share'}</Button>
          </Box>
        </Box>
      </Box>

      {/* URL BAR */}
      <Box sx={{ px: { xs: 2, md: '120px' }, pb: 2 }}>
        <Box sx={{ bgcolor: T.primaryBlack, borderRadius: '6px', px: { xs: 2, md: 4 }, py: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
          <Box sx={{ p: 1.2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}><LinkIcon sx={{ color: '#fff', fontSize: 20 }} /></Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: T.font, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Your website</Typography>
            <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 15, color: '#fff' }}>{websiteUrl}</Typography>
          </Box>
          <Button startIcon={copied ? <Check /> : <ContentCopy />} onClick={copyUrl} sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: '#fff', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>{copied ? 'Copied' : 'Copy'}</Button>
          <Chip icon={website.published ? <Public sx={{ color: '#4caf50 !important', fontSize: 16 }} /> : <VisibilityOff sx={{ color: '#F5A623 !important', fontSize: 16 }} />} label={website.published ? 'Live' : 'Draft'} size="small"
            sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, bgcolor: website.published ? 'rgba(76,175,80,0.15)' : 'rgba(245,166,35,0.15)', color: website.published ? '#4caf50' : '#F5A623', border: 'none' }} />
          {website.privacyEnabled && <Chip icon={<Lock sx={{ color: '#ff9800 !important', fontSize: 16 }} />} label="Protected" size="small" sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, bgcolor: 'rgba(255,152,0,0.15)', color: '#ff9800', border: 'none' }} />}
        </Box>
      </Box>

      {/* MAIN LAYOUT */}
      <Box sx={{ flex: 1, display: 'flex', px: { xs: 2, md: '120px' }, pb: 8, gap: { xs: 0, md: '24px' }, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* COMPLETION SIDEBAR */}
        <Box sx={{ width: { xs: '100%', md: 260 }, flexShrink: 0, bgcolor: '#fff', border: T.border, display: 'flex', flexDirection: 'column', mb: { xs: 2, md: 0 }, height: 'fit-content' }}>
          <Box sx={{ p: 2.5, borderBottom: T.border }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: T.primaryBlack }}>Website Progress</Typography>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: completionPct === 100 ? T.success : T.primary }}>{completionPct}%</Typography>
            </Box>
            <Box sx={{ width: '100%', height: 6, borderRadius: 3, bgcolor: 'rgba(0,131,143,0.1)' }}>
              <Box sx={{ width: `${completionPct}%`, height: '100%', borderRadius: 3, bgcolor: completionPct === 100 ? T.success : T.primary, transition: 'width 0.4s ease' }} />
            </Box>
          </Box>
          {completionItems.map((item, i) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, borderBottom: i < completionItems.length - 1 ? T.border : 'none' }}>
              <CheckCircle sx={{ fontSize: 18, color: item.done ? T.success : 'rgba(0,0,0,0.12)' }} />
              <Typography sx={{ fontFamily: T.font, fontWeight: 500, fontSize: 14, color: item.done ? T.text : T.textSub }}>{item.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* CONTENT */}
        <Box sx={{ flex: 1, bgcolor: '#fff', border: T.border, display: 'flex', flexDirection: 'column', minHeight: 599 }}>
          {/* Tab Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', pl: { xs: 1, md: 3 }, pr: { xs: 1, md: 3 }, height: 61, borderBottom: T.border, overflowX: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: '24px' }, flex: 1 }}>
              {(['details','schedule','faq','travel','stationery','photos','settings'] as FilterTab[]).map(key => {
                const m = tabMeta[key]; const isActive = tab === key
                return (
                  <Box key={key} onClick={() => { setTab(key); setPage(1) }} sx={{ display: 'flex', alignItems: 'center', gap: 0.6, cursor: 'pointer', position: 'relative', py: 1, whiteSpace: 'nowrap' }}>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: { xs: 13, md: 15 }, color: isActive ? T.primary : T.primaryBlack }}>{m.label}</Typography>
                    <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: key === 'settings' ? T.accentGrad : m.badgeBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 9, color: m.badgeColor, lineHeight: 1 }}>{m.count}</Typography>
                    </Box>
                    {isActive && <Box sx={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 2.5, bgcolor: T.primary, borderRadius: 2 }} />}
                  </Box>
                )
              })}
            </Box>
            {tab === 'schedule' && <Button onClick={() => { setAddType('event'); setAddOpen(true) }} sx={{ bgcolor: T.primary, color: '#fff', fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', px: 2, borderRadius: 0, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#006670' } }}>Add Event</Button>}
            {tab === 'faq' && <Button onClick={() => { setAddType('faq'); setAddOpen(true) }} startIcon={<Add />} sx={{ bgcolor: T.primary, color: '#fff', fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', px: 2, borderRadius: 0, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#006670' } }}>Add Q&A</Button>}
            {tab === 'travel' && <Button onClick={() => { setAddType('hotel'); setAddOpen(true) }} startIcon={<Add />} sx={{ bgcolor: T.primary, color: '#fff', fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', px: 2, borderRadius: 0, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#006670' } }}>Add Hotel</Button>}
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {/* ── DETAILS TAB ── */}
            {tab === 'details' && (
              <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5 }}>Cover Image</Typography>
                  <Box sx={{ width: '100%', height: 200, borderRadius: '6px', overflow: 'hidden', position: 'relative', backgroundImage: `url(${website.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center', bgcolor: '#e0e0e0' }}>
                    <Button startIcon={<PhotoCamera />} sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, fontSize: 13, borderRadius: '6px' }}>Change Cover</Button>
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5 }}>Couple Names</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField label="Partner 1" fullWidth value={website.coupleNames.partner1} onChange={e => updateWebsite({ coupleNames: { ...website.coupleNames, partner1: e.target.value } })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Partner 2" fullWidth value={website.coupleNames.partner2} onChange={e => updateWebsite({ coupleNames: { ...website.coupleNames, partner2: e.target.value } })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5 }}>Date & Time</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField label="Wedding Date" type="date" fullWidth value={website.weddingDate} onChange={e => updateWebsite({ weddingDate: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Wedding Time" type="time" fullWidth value={website.weddingTime} onChange={e => updateWebsite({ weddingTime: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5 }}>Venue</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Venue Name" fullWidth value={website.venue.name} onChange={e => updateWebsite({ venue: { ...website.venue, name: e.target.value } })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                    <TextField label="Venue Address" fullWidth value={website.venue.address} onChange={e => updateWebsite({ venue: { ...website.venue, address: e.target.value } })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 0.5 }}>Our Story</Typography>
                  <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub, mb: 1.5 }}>Write a short narrative about how you met and your journey together</Typography>
                  <TextField fullWidth multiline rows={4} placeholder="We met at a friend's birthday party in 2020 and instantly hit it off..." value={website.story} onChange={e => updateWebsite({ story: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5 }}>Custom URL</Typography>
                  <TextField fullWidth value={website.url} onChange={e => updateWebsite({ url: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: '#666', fontFamily: T.font, fontSize: 14 }}>itheewed.com/w/</Typography></InputAdornment>, sx: { fontFamily: T.font } }} />
                </Box>
              </Box>
            )}

            {/* ── SCHEDULE TAB ── */}
            {tab === 'schedule' && (() => {
              const totalPages = Math.ceil(website.schedule.length / ITEMS_PER_PAGE)
              const paged = website.schedule.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
              return website.schedule.length === 0 ? <EmptyState icon={Schedule} title="No Events Yet" sub="Add your first schedule event" /> : <>
                {paged.map(evt => (
                  <Box key={evt.id} onClick={() => openEventDetail(evt)} sx={{ display: 'flex', alignItems: 'center', px: { xs: 2, md: '27px' }, borderBottom: T.border, cursor: 'pointer', minHeight: 72, '&:hover': { bgcolor: 'rgba(0,131,143,0.02)' } }}>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.primary, width: 80, flexShrink: 0 }}>{evt.time ? formatTime(evt.time) : '—'}</Typography>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 16, color: T.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.event}</Typography>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 14, color: T.textSub, width: 140, flexShrink: 0, display: { xs: 'none', md: 'block' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.location || '—'}</Typography>
                    <IconButton size="small" onClick={e => { e.stopPropagation(); setEditingEvent({ ...evt }); setSelectedEvent(evt); setInnerView('detail') }} sx={{ color: T.primary, mx: 0.5 }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                    <IconButton size="small" onClick={e => { e.stopPropagation(); confirmDelete(evt.id, 'event') }} sx={{ color: T.accent }}><Delete sx={{ fontSize: 16 }} /></IconButton>
                  </Box>
                ))}
                {totalPages > 1 && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 2, borderTop: T.border }}>
                  <Box component="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: page === 1 ? T.textSub : T.primary, border: 'none', background: 'none', cursor: page === 1 ? 'default' : 'pointer' }}>Prev</Box>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => <Box key={n} component="button" onClick={() => setPage(n)} sx={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.font, fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer', bgcolor: n === page ? T.primary : 'transparent', color: n === page ? '#fff' : T.primaryBlack }}>{n}</Box>)}
                  <Box component="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: page === totalPages ? T.textSub : T.primary, border: 'none', background: 'none', cursor: page === totalPages ? 'default' : 'pointer' }}>Next</Box>
                </Box>}
              </>
            })()}

            {/* ── FAQ / Q&A TAB ── */}
            {tab === 'faq' && (
              website.faq.length === 0 ? <EmptyState icon={QuestionAnswer} title="No Q&A Yet" sub="Help guests with frequently asked questions" /> : (
                <Box sx={{ p: 0 }}>
                  {website.faq.map(faq => {
                    const isOpen = expandedFaq === faq.id
                    return (
                      <Box key={faq.id} sx={{ borderBottom: T.border }}>
                        <Box onClick={() => setExpandedFaq(isOpen ? null : faq.id)} sx={{ display: 'flex', alignItems: 'center', px: { xs: 2, md: '27px' }, py: 2.5, cursor: 'pointer', transition: 'background 0.2s', '&:hover': { bgcolor: 'rgba(0,131,143,0.02)' } }}>
                          <QuestionAnswer sx={{ fontSize: 18, color: '#7b68ae', mr: 2, flexShrink: 0 }} />
                          <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 16, color: T.primaryBlack, flex: 1 }}>{faq.question}</Typography>
                          {isOpen ? <ExpandLess sx={{ color: T.primary }} /> : <ExpandMore sx={{ color: T.textSub }} />}
                          <IconButton size="small" onClick={e => { e.stopPropagation(); confirmDelete(faq.id, 'faq') }} sx={{ color: T.accent, ml: 1 }}><Delete sx={{ fontSize: 16 }} /></IconButton>
                        </Box>
                        {isOpen && (
                          <Fade in timeout={200}>
                            <Box sx={{ px: { xs: 2, md: '60px' }, pb: 2.5 }}>
                              <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.text, lineHeight: 1.7, bgcolor: 'rgba(0,131,143,0.02)', p: 2, borderRadius: '6px', borderLeft: `3px solid #7b68ae` }}>{faq.answer}</Typography>
                            </Box>
                          </Fade>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              )
            )}

            {/* ── TRAVEL / HOTEL BLOCKS TAB ── */}
            {tab === 'travel' && (
              <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Travel notes */}
                <Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}><Flight sx={{ fontSize: 20, color: T.primary }} />Travel Information</Typography>
                  <TextField fullWidth multiline rows={3} placeholder="Share helpful travel tips for your guests — nearby airports, directions, parking info..." value={website.travelNotes} onChange={e => updateWebsite({ travelNotes: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font }, mb: 2 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}><DirectionsCar sx={{ fontSize: 20, color: T.primary }} />Transportation</Typography>
                  <TextField fullWidth multiline rows={2} placeholder="Shuttle details, ride-share codes, parking options..." value={website.transportation} onChange={e => updateWebsite({ transportation: e.target.value })} sx={{ '& .MuiInputBase-root': { fontFamily: T.font }, mb: 3 }} />
                </Box>
                <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, display: 'flex', alignItems: 'center', gap: 1 }}><Hotel sx={{ fontSize: 20, color: T.primary }} />Hotel Blocks ({website.hotels.length})</Typography>
                {website.hotels.length === 0 ? (
                  <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub, textAlign: 'center', py: 4 }}>No hotel blocks yet. Add recommended hotels for your guests.</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {website.hotels.map(hotel => (
                      <Box key={hotel.id} sx={{ p: 3, borderRadius: '8px', border: '1px solid rgba(0,131,143,0.15)', position: 'relative', '&:hover': { borderColor: T.primary } }}>
                        <IconButton size="small" onClick={() => confirmDelete(hotel.id, 'hotel')} sx={{ position: 'absolute', top: 8, right: 8, color: T.accent }}><Delete sx={{ fontSize: 16 }} /></IconButton>
                        <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: T.primaryBlack, mb: 1 }}>{hotel.name}</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                          {hotel.address && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LocationOn sx={{ fontSize: 16, color: T.primary }} /><Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.text }}>{hotel.address}</Typography></Box>}
                          {hotel.phone && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Phone sx={{ fontSize: 16, color: T.primary }} /><Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.text }}>{hotel.phone}</Typography></Box>}
                          {hotel.website && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Language sx={{ fontSize: 16, color: T.primary }} /><Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.primary, cursor: 'pointer' }}>{hotel.website}</Typography></Box>}
                          {hotel.rate && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.text }}>Rate: <b>{hotel.rate}</b></Typography></Box>}
                          {hotel.distance && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><DirectionsCar sx={{ fontSize: 16, color: T.primary }} /><Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.text }}>{hotel.distance} from venue</Typography></Box>}
                          {hotel.deadline && <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.accent }}>Book by: {hotel.deadline}</Typography>}
                        </Box>
                        {hotel.notes && <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub, mt: 1.5, fontStyle: 'italic' }}>{hotel.notes}</Typography>}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* ── STATIONERY TAB ── */}
            {tab === 'stationery' && (
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Style sx={{ color: '#c49b5c', fontSize: 22 }} />
                  <Box>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack }}>Matching Stationery</Typography>
                    <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub }}>Toggle items to match your website theme colours and fonts</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {website.stationery.map(item => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 2.5, borderRadius: '8px', border: item.matched ? `2px solid ${T.primary}` : '1px solid rgba(0,131,143,0.15)', bgcolor: item.matched ? 'rgba(0,131,143,0.03)' : '#fff', transition: 'all 0.2s' }}>
                      <Box sx={{ width: 56, height: 56, borderRadius: '10px', bgcolor: item.matched ? T.primary : 'rgba(196,155,92,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Style sx={{ color: item.matched ? '#fff' : '#c49b5c', fontSize: 26 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack }}>{item.title}</Typography>
                        <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub }}>{item.description}</Typography>
                        {item.matched && <Chip label="Theme Matched" size="small" sx={{ mt: 0.5, height: 20, fontSize: 10, fontWeight: 700, bgcolor: 'rgba(0,131,143,0.1)', color: T.primary }} />}
                      </Box>
                      <Switch checked={item.matched} onChange={() => toggleStationeryMatch(item.id)} sx={{ '& .Mui-checked': { color: T.primary }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: T.primary } }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* ── PHOTOS TAB ── */}
            {tab === 'photos' && (
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                {website.photos.length === 0 ? <EmptyState icon={PhotoCamera} title="No Photos Yet" sub="Add photos to your gallery" /> : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
                    {website.photos.map((photo, i) => (
                      <Box key={i} sx={{ position: 'relative', paddingTop: '100%', borderRadius: '6px', overflow: 'hidden', '&:hover .overlay': { opacity: 1 } }}>
                        <img src={photo} alt={`Photo ${i + 1}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <Box className="overlay" sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                          <IconButton size="small" onClick={() => updateWebsite({ photos: website.photos.filter((_, j) => j !== i) })} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)' }}><Delete fontSize="small" /></IconButton>
                        </Box>
                      </Box>
                    ))}
                    <Box sx={{ paddingTop: '100%', position: 'relative', border: `2px dashed ${T.primary}`, borderRadius: '6px', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' } }}>
                      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <PhotoCamera sx={{ fontSize: 28, color: T.textSub, mb: 0.5 }} />
                        <Typography sx={{ fontFamily: T.font, fontSize: 12, color: T.textSub }}>Add Photo</Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* ── SETTINGS TAB ── */}
            {tab === 'settings' && (
              <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Publish */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, borderBottom: '1px solid rgba(0,131,143,0.1)' }}>
                  <Box><Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 16, color: T.primaryBlack }}>Publish Website</Typography><Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub }}>Make your website visible to guests</Typography></Box>
                  <FormControlLabel control={<Switch checked={website.published} onChange={e => updateWebsite({ published: e.target.checked })} sx={{ '& .Mui-checked': { color: T.success }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: T.success } }} />} label="" />
                </Box>
                {/* RSVP */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, borderBottom: '1px solid rgba(0,131,143,0.1)' }}>
                  <Box><Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 16, color: T.primaryBlack }}>Enable RSVP</Typography><Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub }}>Allow guests to RSVP through the website</Typography></Box>
                  <FormControlLabel control={<Switch checked={website.rsvpEnabled} onChange={e => updateWebsite({ rsvpEnabled: e.target.checked })} sx={{ '& .Mui-checked': { color: T.primary }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: T.primary } }} />} label="" />
                </Box>

                {/* PRIVACY CONTROLS */}
                <Box sx={{ borderBottom: '1px solid rgba(0,131,143,0.1)', pb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    {website.privacyEnabled ? <Lock sx={{ color: '#ff9800', fontSize: 22 }} /> : <LockOpen sx={{ color: T.primary, fontSize: 22 }} />}
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack }}>Privacy Controls</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: website.privacyEnabled ? 2 : 0 }}>
                    <Box>
                      <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.primaryBlack }}>Password Protection</Typography>
                      <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub }}>Require a password to view your wedding website</Typography>
                    </Box>
                    <Switch checked={website.privacyEnabled} onChange={e => updateWebsite({ privacyEnabled: e.target.checked })} sx={{ '& .Mui-checked': { color: '#ff9800' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#ff9800' } }} />
                  </Box>
                  {website.privacyEnabled && (
                    <Fade in timeout={300}>
                      <Box>
                        <TextField label="Website Password" type="text" fullWidth value={website.privacyPassword} onChange={e => updateWebsite({ privacyPassword: e.target.value })}
                          placeholder="e.g. Sarah&James2025" helperText="Share this password with your invited guests"
                          sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
                      </Box>
                    </Fade>
                  )}
                </Box>

                {/* FONT CUSTOMISATION */}
                <Box sx={{ borderBottom: '1px solid rgba(0,131,143,0.1)', pb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <FormatSize sx={{ color: T.primary, fontSize: 22 }} />
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack }}>Font Options</Typography>
                  </Box>
                  <FontPicker label="Heading Font" value={website.headingFont} onChange={v => updateWebsite({ headingFont: v })} />
                  <FontPicker label="Body Font" value={website.bodyFont} onChange={v => updateWebsite({ bodyFont: v })} />
                </Box>

                {/* COLOUR PALETTE */}
                <ColorPalettePicker activePaletteId={activePaletteId} customColors={website.customColors} onSelectPalette={selectPalette} onCustomColorChange={updateCustomColor} />

                {/* Change template link */}
                <Box sx={{ borderTop: '1px solid rgba(0,131,143,0.1)', pt: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.primaryBlack }}>Current Template</Typography>
                    <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub }}>{currentTemplate?.name || 'None selected'} {currentTemplate?.category ? `· ${currentTemplate.category}` : ''}</Typography>
                  </Box>
                  <Button onClick={() => setView('gallery')} startIcon={<Palette />} sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.primary, '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' } }}>Change Template</Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* ═══════ MODALS & DIALOGS ═══════ */}

      {/* DELETE */}
      <DeleteConfirmModal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirmed} successMessage={`${deleteContext === 'event' ? 'Event' : deleteContext === 'faq' ? 'Q&A' : 'Hotel'} Deleted`} />

      {/* SLIDE-OVER (schedule detail) */}
      <Slide direction="left" in={innerView !== null} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: { xs: '100%', sm: 420 }, bgcolor: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 1300, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2, borderBottom: '1px solid rgba(0,131,143,0.15)' }}>
            <IconButton size="small" onClick={closePanel}><ArrowBack sx={{ fontSize: 20, color: '#666' }} /></IconButton>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: T.primaryBlack, flex: 1 }}>{editingEvent ? 'Edit Event' : 'Event Details'}</Typography>
            <IconButton size="small" onClick={closePanel}><Close sx={{ fontSize: 20, color: '#666' }} /></IconButton>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {innerView === 'detail' && selectedEvent && (editingEvent ? (
              <Fade in timeout={250}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField label="Time" type="time" fullWidth value={editingEvent.time} onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
                <TextField label="Event Name" fullWidth value={editingEvent.event} onChange={e => setEditingEvent({ ...editingEvent, event: e.target.value })} />
                <TextField label="Location" fullWidth value={editingEvent.location} onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })} />
                <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                  <Button fullWidth variant="contained" onClick={() => updateEvent(editingEvent)} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font }}>Save</Button>
                  <Button fullWidth variant="outlined" onClick={() => setEditingEvent(null)} sx={{ color: '#666', textTransform: 'none', fontWeight: 600, fontFamily: T.font }}>Cancel</Button>
                </Box>
              </Box></Fade>
            ) : (
              <Fade in timeout={250}><Box>
                <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack, mb: 3 }}>{selectedEvent.event}</Typography>
                {[{ label: 'Time', value: selectedEvent.time ? formatTime(selectedEvent.time) : '—' }, { label: 'Location', value: selectedEvent.location || '—' }].map(r => (
                  <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid rgba(0,131,143,0.1)' }}>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.textSub }}>{r.label}</Typography>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.text }}>{r.value}</Typography>
                  </Box>
                ))}
                <Button fullWidth variant="contained" startIcon={<Edit />} onClick={() => setEditingEvent({ ...selectedEvent })} sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, mt: 4 }}>Edit</Button>
                <Button fullWidth startIcon={<Delete />} onClick={() => { confirmDelete(selectedEvent.id, 'event'); closePanel() }} sx={{ mt: 1.5, color: T.accent, textTransform: 'none', fontWeight: 600, fontFamily: T.font }}>Delete Event</Button>
              </Box></Fade>
            ))}
          </Box>
        </Box>
      </Slide>
      {innerView !== null && <Box onClick={closePanel} sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,37,40,0.25)', backdropFilter: 'blur(2px)', zIndex: 1299 }} />}

      {/* ADD DIALOG (event / faq / hotel) */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, border: '1px solid rgba(0,131,143,0.15)' } }}>
        <DialogTitle sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: T.primaryBlack, pb: 0 }}>
          {addType === 'event' ? 'Add Schedule Event' : addType === 'faq' ? 'Add Q&A' : 'Add Hotel Block'}
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          {addType === 'event' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField label="Event Name" fullWidth autoFocus placeholder="e.g. Wedding Ceremony" value={newEvent.event} onChange={e => setNewEvent(p => ({ ...p, event: e.target.value }))} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Time" type="time" fullWidth value={newEvent.time} onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
                <TextField label="Location" fullWidth placeholder="e.g. Main Chapel" value={newEvent.location} onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} />
              </Box>
            </Box>
          )}
          {addType === 'faq' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField label="Question" fullWidth autoFocus placeholder="e.g. What is the dress code?" value={newFaq.question} onChange={e => setNewFaq(p => ({ ...p, question: e.target.value }))} />
              <TextField label="Answer" fullWidth multiline rows={3} placeholder="e.g. Semi-formal / cocktail attire" value={newFaq.answer} onChange={e => setNewFaq(p => ({ ...p, answer: e.target.value }))} />
            </Box>
          )}
          {addType === 'hotel' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Hotel Name" fullWidth autoFocus value={newHotel.name} onChange={e => setNewHotel(p => ({ ...p, name: e.target.value }))} />
              <TextField label="Address" fullWidth value={newHotel.address} onChange={e => setNewHotel(p => ({ ...p, address: e.target.value }))} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Phone" fullWidth value={newHotel.phone} onChange={e => setNewHotel(p => ({ ...p, phone: e.target.value }))} />
                <TextField label="Website URL" fullWidth value={newHotel.website} onChange={e => setNewHotel(p => ({ ...p, website: e.target.value }))} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Group Rate" fullWidth placeholder="e.g. ₦150,000/night" value={newHotel.rate} onChange={e => setNewHotel(p => ({ ...p, rate: e.target.value }))} />
                <TextField label="Distance from Venue" fullWidth placeholder="e.g. 5 min drive" value={newHotel.distance} onChange={e => setNewHotel(p => ({ ...p, distance: e.target.value }))} />
              </Box>
              <TextField label="Booking Deadline" type="date" fullWidth value={newHotel.deadline} onChange={e => setNewHotel(p => ({ ...p, deadline: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
              <TextField label="Notes" fullWidth multiline rows={2} placeholder="Mention group code, amenities, etc." value={newHotel.notes} onChange={e => setNewHotel(p => ({ ...p, notes: e.target.value }))} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={addType === 'event' ? addEvent : addType === 'faq' ? addFaqItem : addHotelItem}
            disabled={addType === 'event' ? !newEvent.event.trim() : addType === 'faq' ? (!newFaq.question.trim() || !newFaq.answer.trim()) : !newHotel.name.trim()}
            sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 600, fontFamily: T.font, px: 3 }}>
            {addType === 'event' ? 'Add Event' : addType === 'faq' ? 'Add Q&A' : 'Add Hotel'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PREVIEW DIALOG */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '14px', overflow: 'hidden', maxHeight: '92vh', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' } }}>
        {/* Browser chrome */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 1.5, bgcolor: '#fafafa', borderBottom: '1px solid #e8e8e8', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 0.7 }}>
            <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#ff5f57', transition: 'opacity 0.15s', '&:hover': { opacity: 0.8 } }} />
            <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#febc2e' }} />
            <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#28c840' }} />
          </Box>
          <Box sx={{ flex: 1, px: 2, py: 0.7, bgcolor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8 }}>
            <Lock sx={{ fontSize: 11, color: '#28c840' }} />
            <Typography sx={{ fontFamily: "'SF Mono', 'Monaco', monospace", fontSize: 11.5, color: '#666', letterSpacing: 0.2 }}>{websiteUrl}</Typography>
          </Box>
          <IconButton onClick={() => setPreviewOpen(false)} size="small" sx={{ color: '#aaa', '&:hover': { color: '#666', bgcolor: 'rgba(0,0,0,0.04)' } }}><Close sx={{ fontSize: 17 }} /></IconButton>
        </Box>

        <DialogContent sx={{ p: 0, bgcolor: website.customColors.bg || '#faf9f6' }}>
          {/* ════════════ HERO ════════════ */}
          <Box sx={{
            height: { xs: 380, md: 480 },
            backgroundImage: `linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%), url(${website.coverImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative top border */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${website.customColors.primary}, ${website.customColors.secondary}, ${website.customColors.accent})` }} />
            {/* Decorative frame */}
            <Box sx={{ position: 'absolute', inset: { xs: 16, md: 28 }, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '2px', pointerEvents: 'none' }} />
            {/* Top ornament */}
            <Typography sx={{ fontSize: { xs: 22, md: 28 }, opacity: 0.5, mb: 1, letterSpacing: 3 }}>&#10047; &#10047; &#10047;</Typography>
            <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: { xs: 11, md: 13 }, letterSpacing: { xs: 4, md: 8 }, mb: 1.5, opacity: 0.8, textTransform: 'uppercase', fontWeight: 300 }}>We&apos;re Getting Married</Typography>
            <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 38, md: 56 }, fontWeight: 700, lineHeight: 1.05, textShadow: '0 3px 20px rgba(0,0,0,0.3)', px: 2 }}>
              {website.coupleNames.partner1 || 'Partner 1'}<Box component="span" sx={{ display: { xs: 'block', md: 'inline' }, mx: { md: 1.5 }, fontSize: { xs: 24, md: 32 }, fontWeight: 300, opacity: 0.7 }}>&</Box>{website.coupleNames.partner2 || 'Partner 2'}
            </Typography>
            {/* Decorative line under names */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2.5, mb: 1 }}>
              <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(255,255,255,0.4)' }} />
              <Favorite sx={{ fontSize: 14, opacity: 0.6 }} />
              <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(255,255,255,0.4)' }} />
            </Box>
            {website.weddingDate && (
              <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: { xs: 15, md: 19 }, opacity: 0.9, letterSpacing: 1 }}>
                {new Date(website.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
            )}
            {website.venue.name && (
              <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: { xs: 12, md: 14 }, mt: 0.8, opacity: 0.65, letterSpacing: 0.5 }}>
                <LocationOn sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.3 }} />
                {website.venue.name}{website.venue.address ? ` \u00b7 ${website.venue.address}` : ''}
              </Typography>
            )}
            {/* Countdown */}
            {website.weddingDate && (() => {
              const diff = new Date(website.weddingDate).getTime() - Date.now()
              if (diff <= 0) return null
              const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
              const months = Math.floor(totalDays / 30)
              const days = totalDays % 30
              const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
              return (
                <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2.5 }, mt: 3.5 }}>
                  {[
                    { val: months, label: 'Months' },
                    { val: days, label: 'Days' },
                    { val: hours, label: 'Hours' },
                  ].map(c => (
                    <Box key={c.label} sx={{ textAlign: 'center', minWidth: { xs: 56, md: 72 }, py: { xs: 1.2, md: 1.5 }, px: { xs: 1, md: 1.5 }, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 24, md: 32 }, fontWeight: 700, lineHeight: 1 }}>{c.val}</Typography>
                      <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: { xs: 9, md: 10 }, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.7, mt: 0.3 }}>{c.label}</Typography>
                    </Box>
                  ))}
                </Box>
              )
            })()}
          </Box>

          {/* ════════════ WEBSITE NAV ════════════ */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1.5, md: 3.5 }, py: 2, bgcolor: '#fff', borderBottom: `2px solid ${website.customColors.primary}10`, flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            {['Our Story', website.schedule.length > 0 && 'Schedule', website.faq.length > 0 && 'Q&A', website.venue.name && 'Venue', website.hotels.length > 0 && 'Travel', website.photos.length > 0 && 'Gallery', website.rsvpEnabled && 'RSVP'].filter(Boolean).map(link => (
              <Typography key={link as string} sx={{ fontFamily: getFont(website.bodyFont), fontSize: 12, fontWeight: 600, color: website.customColors.primary, letterSpacing: 1.2, textTransform: 'uppercase', cursor: 'default', px: 1, py: 0.3, borderRadius: '4px', transition: 'all 0.15s', '&:hover': { bgcolor: `${website.customColors.primary}08` } }}>{link}</Typography>
            ))}
          </Box>

          {/* ════════════ CONTENT ════════════ */}
          <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2.5, md: 5 } }}>

            {/* ── Our Story ── */}
            {website.story && (
              <Box sx={{ textAlign: 'center', py: { xs: 5, md: 7 } }}>
                <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: website.customColors.secondary, mb: 1 }}>About Us</Typography>
                <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 28, md: 36 }, fontWeight: 700, color: website.customColors.primary, mb: 1 }}>Our Story</Typography>
                {/* Ornamental divider */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3.5 }}>
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                  <Favorite sx={{ fontSize: 12, color: website.customColors.secondary, opacity: 0.6 }} />
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                </Box>
                <Box sx={{ maxWidth: 580, mx: 'auto', p: { xs: 2.5, md: 4 }, borderRadius: '12px', bgcolor: '#fff', boxShadow: '0 1px 12px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)', position: 'relative' }}>
                  {/* Decorative quote mark */}
                  <Typography sx={{ position: 'absolute', top: -8, left: 24, fontSize: 48, fontFamily: 'Georgia, serif', color: website.customColors.secondary, opacity: 0.2, lineHeight: 1 }}>&ldquo;</Typography>
                  <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: { xs: 15, md: 16 }, color: website.customColors.text || '#555', lineHeight: 2, whiteSpace: 'pre-line', fontStyle: 'italic' }}>{website.story}</Typography>
                </Box>
              </Box>
            )}

            {/* Section divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${website.customColors.secondary}30)` }} />
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: website.customColors.secondary, opacity: 0.3 }} />
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${website.customColors.secondary}30, transparent)` }} />
            </Box>

            {/* ── When & Where ── */}
            {(website.weddingDate || website.venue.name) && (
              <Box sx={{ textAlign: 'center', py: { xs: 5, md: 7 } }}>
                <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: website.customColors.secondary, mb: 1 }}>The Details</Typography>
                <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 28, md: 36 }, fontWeight: 700, color: website.customColors.primary, mb: 1 }}>When & Where</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                  <Favorite sx={{ fontSize: 12, color: website.customColors.secondary, opacity: 0.6 }} />
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                  {website.weddingDate && (
                    <Box sx={{ flex: '1 1 220px', maxWidth: 320, p: 3.5, borderRadius: '14px', bgcolor: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: `1px solid ${website.customColors.primary}12`, position: 'relative', overflow: 'hidden' }}>
                      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: website.customColors.secondary }} />
                      <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: `${website.customColors.secondary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <Schedule sx={{ fontSize: 24, color: website.customColors.secondary }} />
                      </Box>
                      <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: 18, fontWeight: 700, color: website.customColors.text || '#333', mb: 1 }}>Date & Time</Typography>
                      <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 15, color: '#555' }}>{new Date(website.weddingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Typography>
                      {website.weddingTime && <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 14, color: '#888', mt: 0.5 }}>{formatTime(website.weddingTime)}</Typography>}
                    </Box>
                  )}
                  {website.venue.name && (
                    <Box sx={{ flex: '1 1 220px', maxWidth: 320, p: 3.5, borderRadius: '14px', bgcolor: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: `1px solid ${website.customColors.primary}12`, position: 'relative', overflow: 'hidden' }}>
                      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: website.customColors.secondary }} />
                      <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: `${website.customColors.secondary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <LocationOn sx={{ fontSize: 24, color: website.customColors.secondary }} />
                      </Box>
                      <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: 18, fontWeight: 700, color: website.customColors.text || '#333', mb: 1 }}>Venue</Typography>
                      <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 15, color: '#555' }}>{website.venue.name}</Typography>
                      {website.venue.address && <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 13, color: '#888', mt: 0.5 }}>{website.venue.address}</Typography>}
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* Section divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${website.customColors.secondary}30)` }} />
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: website.customColors.secondary, opacity: 0.3 }} />
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${website.customColors.secondary}30, transparent)` }} />
            </Box>

            {/* ── Schedule Timeline ── */}
            {website.schedule.length > 0 && (
              <Box sx={{ textAlign: 'center', py: { xs: 5, md: 7 } }}>
                <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: website.customColors.secondary, mb: 1 }}>The Day</Typography>
                <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 28, md: 36 }, fontWeight: 700, color: website.customColors.primary, mb: 1 }}>Schedule</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                  <Schedule sx={{ fontSize: 14, color: website.customColors.secondary, opacity: 0.6 }} />
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', px: { xs: 1, md: 0 } }}>
                  {/* Timeline Vertical line */}
                  <Box sx={{ position: 'absolute', left: '50%', top: 8, bottom: 8, width: 2, background: `linear-gradient(${website.customColors.secondary}40, ${website.customColors.primary}40)`, transform: 'translateX(-50%)', borderRadius: 1 }} />
                  {website.schedule.map((evt, i) => (
                    <Box key={evt.id} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2.5 }, py: 2, position: 'relative', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                      <Box sx={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left', px: 1.5 }}>
                        <Box sx={{ display: 'inline-block', px: 2, py: 0.8, borderRadius: '20px', bgcolor: `${website.customColors.primary}08`, border: `1px solid ${website.customColors.primary}18` }}>
                          <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 13, fontWeight: 700, color: website.customColors.primary }}>{evt.time ? formatTime(evt.time) : ''}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#fff', border: `3px solid ${website.customColors.secondary}`, boxShadow: `0 0 0 4px ${website.customColors.secondary}18`, zIndex: 1, flexShrink: 0 }} />
                      <Box sx={{ flex: 1, textAlign: i % 2 === 0 ? 'left' : 'right', px: 1.5 }}>
                        <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 15, md: 17 }, fontWeight: 700, color: website.customColors.text || '#333' }}>{evt.event}</Typography>
                        {evt.location && <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 12, color: '#888', mt: 0.3 }}><LocationOn sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.3 }} />{evt.location}</Typography>}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Section divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${website.customColors.secondary}30)` }} />
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: website.customColors.secondary, opacity: 0.3 }} />
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${website.customColors.secondary}30, transparent)` }} />
            </Box>

            {/* ── Q&A ── */}
            {website.faq.length > 0 && (
              <Box sx={{ textAlign: 'center', py: { xs: 5, md: 7 } }}>
                <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: website.customColors.secondary, mb: 1 }}>Have Questions?</Typography>
                <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 28, md: 36 }, fontWeight: 700, color: website.customColors.primary, mb: 1 }}>Questions & Answers</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                  <Favorite sx={{ fontSize: 12, color: website.customColors.secondary, opacity: 0.6 }} />
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {website.faq.map((faq, idx) => (
                    <Box key={faq.id} sx={{ textAlign: 'left', p: { xs: 2.5, md: 3.5 }, borderRadius: '14px', bgcolor: '#fff', border: `1px solid ${website.customColors.primary}10`, boxShadow: '0 2px 12px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
                      <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: website.customColors.secondary, borderRadius: '4px 0 0 4px' }} />
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', pl: 1.5 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: `${website.customColors.secondary}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.3 }}>
                          <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: 14, fontWeight: 700, color: website.customColors.secondary }}>Q{idx+1}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 15, md: 16 }, fontWeight: 700, color: website.customColors.text || '#333', mb: 0.8 }}>{faq.question}</Typography>
                          <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 14, color: '#666', lineHeight: 1.8 }}>{faq.answer}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Section divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${website.customColors.secondary}30)` }} />
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: website.customColors.secondary, opacity: 0.3 }} />
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${website.customColors.secondary}30, transparent)` }} />
            </Box>

            {/* ── Travel & Stay ── */}
            {(website.hotels.length > 0 || website.travelNotes || website.transportation) && (
              <Box sx={{ textAlign: 'center', py: { xs: 5, md: 7 } }}>
                <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: website.customColors.secondary, mb: 1 }}>Getting Here</Typography>
                <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 28, md: 36 }, fontWeight: 700, color: website.customColors.primary, mb: 1 }}>Travel & Stay</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                  <DirectionsCar sx={{ fontSize: 14, color: website.customColors.secondary, opacity: 0.6 }} />
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                </Box>
                {(website.travelNotes || website.transportation) && (
                  <Box sx={{ textAlign: 'left', mb: 4, p: 3, borderRadius: '14px', bgcolor: '#fff', border: `1px solid ${website.customColors.primary}10`, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                    {website.travelNotes && <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 15, color: '#555', lineHeight: 1.9, mb: website.transportation ? 2 : 0 }}>{website.travelNotes}</Typography>}
                    {website.transportation && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2.5, bgcolor: `${website.customColors.secondary}06`, borderRadius: '10px', border: `1px dashed ${website.customColors.secondary}30` }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: `${website.customColors.secondary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
                          <DirectionsCar sx={{ fontSize: 18, color: website.customColors.secondary }} />
                        </Box>
                        <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 14, color: '#555', lineHeight: 1.8 }}>{website.transportation}</Typography>
                      </Box>
                    )}
                  </Box>
                )}
                {website.hotels.length > 0 && (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    {website.hotels.map(hotel => (
                      <Box key={hotel.id} sx={{ textAlign: 'left', p: 3, borderRadius: '14px', bgcolor: '#fff', border: `1px solid ${website.customColors.primary}10`, boxShadow: '0 2px 12px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${website.customColors.secondary}, ${website.customColors.primary})` }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: `${website.customColors.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Hotel sx={{ fontSize: 20, color: website.customColors.primary }} />
                          </Box>
                          <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: 17, fontWeight: 700, color: website.customColors.text || '#333' }}>{hotel.name}</Typography>
                        </Box>
                        {hotel.address && <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 13, color: '#666', mb: 0.5, pl: 0.5 }}>{hotel.address}</Typography>}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                          {hotel.rate && <Chip size="small" label={hotel.rate} sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 11, bgcolor: `${website.customColors.primary}10`, color: website.customColors.primary, height: 26, borderRadius: '6px' }} />}
                          {hotel.distance && <Chip size="small" label={`${hotel.distance} from venue`} sx={{ fontFamily: T.font, fontSize: 11, bgcolor: 'rgba(0,0,0,0.04)', color: '#666', height: 26, borderRadius: '6px' }} />}
                          {hotel.deadline && <Chip size="small" label={`Book by ${hotel.deadline}`} sx={{ fontFamily: T.font, fontSize: 11, bgcolor: `${T.accent}10`, color: T.accent, fontWeight: 600, height: 26, borderRadius: '6px' }} />}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* Section divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${website.customColors.secondary}30)` }} />
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: website.customColors.secondary, opacity: 0.3 }} />
              <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${website.customColors.secondary}30, transparent)` }} />
            </Box>

            {/* ── Photo Gallery ── */}
            {website.photos.length > 0 && (
              <Box sx={{ textAlign: 'center', py: { xs: 5, md: 7 } }}>
                <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: website.customColors.secondary, mb: 1 }}>Memories</Typography>
                <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 28, md: 36 }, fontWeight: 700, color: website.customColors.primary, mb: 1 }}>Gallery</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                  <PhotoLibrary sx={{ fontSize: 14, color: website.customColors.secondary, opacity: 0.6 }} />
                  <Box sx={{ width: 50, height: 1, bgcolor: website.customColors.secondary, opacity: 0.4 }} />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                  {website.photos.map((photo, i) => (
                    <Box key={i} sx={{
                      aspectRatio: i === 0 && website.photos.length > 2 ? '2/1.2' : '1',
                      gridColumn: i === 0 && website.photos.length > 2 ? { md: 'span 2' } : 'span 1',
                      borderRadius: '12px', overflow: 'hidden', position: 'relative',
                      '&:hover img': { transform: 'scale(1.05)' },
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}>
                      <img src={photo} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* ── RSVP CTA ── */}
            {website.rsvpEnabled && (
              <Box sx={{ textAlign: 'center', py: { xs: 7, md: 9 }, position: 'relative' }}>
                {/* Decorative bg */}
                <Box sx={{ position: 'absolute', inset: 0, borderRadius: '20px', bgcolor: `${website.customColors.primary}04`, border: `1px dashed ${website.customColors.primary}15` }} />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography sx={{ fontSize: 36, mb: 1 }}>&#128141;</Typography>
                  <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 28, md: 36 }, fontWeight: 700, color: website.customColors.primary, mb: 1 }}>Will You Be There?</Typography>
                  <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 15, color: '#888', mb: 3.5, maxWidth: 380, mx: 'auto' }}>We would be honoured to have you celebrate this special day with us</Typography>
                  <Button variant="contained" size="large" sx={{
                    bgcolor: website.customColors.primary, '&:hover': { filter: 'brightness(0.88)', bgcolor: website.customColors.primary },
                    px: { xs: 5, md: 7 }, py: { xs: 1.5, md: 2 }, textTransform: 'none', fontWeight: 700, fontSize: { xs: 16, md: 18 },
                    fontFamily: getFont(website.headingFont), borderRadius: '50px', letterSpacing: 0.5,
                    boxShadow: `0 6px 24px ${website.customColors.primary}35`,
                  }}>RSVP Now</Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* ════════════ FOOTER ════════════ */}
          <Box sx={{ textAlign: 'center', py: 5, mt: 4, bgcolor: website.customColors.primary, color: '#fff', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative top border */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${website.customColors.secondary}, ${website.customColors.accent}, ${website.customColors.secondary})` }} />
            {/* Ornament */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(255,255,255,0.25)' }} />
              <Favorite sx={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }} />
              <Box sx={{ width: 40, height: 1, bgcolor: 'rgba(255,255,255,0.25)' }} />
            </Box>
            <Typography sx={{ fontFamily: getFont(website.headingFont), fontSize: { xs: 22, md: 26 }, fontWeight: 700, opacity: 0.95 }}>
              {website.coupleNames.partner1 || 'Partner 1'} & {website.coupleNames.partner2 || 'Partner 2'}
            </Typography>
            {website.weddingDate && <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 13, opacity: 0.7, mt: 0.5, letterSpacing: 1 }}>{new Date(website.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Typography>}
            {website.privacyEnabled && <Typography sx={{ fontFamily: getFont(website.bodyFont), fontSize: 11, opacity: 0.5, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}><Lock sx={{ fontSize: 12 }} /> Password protected</Typography>}
            <Typography sx={{ fontFamily: T.font, fontSize: 11, opacity: 0.35, mt: 2.5 }}>Made with iTheeWed</Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} TransitionComponent={Slide}>
        <Alert onClose={() => setSnack(p => ({ ...p, open: false }))} severity={snack.sev} variant="filled" sx={{ fontFamily: T.font, fontWeight: 600, borderRadius: 1 }}>{snack.msg}</Alert>
      </Snackbar>

      <Footer />
    </Box>
  )
}
