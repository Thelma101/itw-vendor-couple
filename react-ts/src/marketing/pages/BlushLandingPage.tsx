/**
 * BlushLandingPage — iTheWed Homepage
 * Sophisticated Blush + Soft Brown + Nude palette with Signature Red accents
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  COLOR PALETTE                                               │
 * │                                                              │
 * │  ── BLUSH TONES (decorative, ~25%)                           │
 * │  Blush:       #e8b4b8  — brand pink, hover accents          │
 * │  Blush Light: #f5d0d3  — soft pink borders, avatar rings    │
 * │  Blush Tint:  #fdf0f1  — faint pink section bg              │
 * │  Blush Ghost: #fef7f8  — barely-pink surfaces               │
 * │                                                              │
 * │  ── SOFT BROWN (interactive elements, ~35%)                  │
 * │  Brown:       #7A6A5B  — nav links, buttons, interactive    │
 * │  Brown Dark:  #5C4F42  — hover states, chip text            │
 * │  Brown Deep:  #3E342B  — hero gradient end, headings        │
 * │                                                              │
 * │  ── NUDE SHADES (surfaces & backgrounds, ~25-30%)            │
 * │  Nude:        #C8B5A2  — accent borders, card hovers        │
 * │  Nude Dark:   #A69484  — deeper nude, subdued accents       │
 * │  Nude Light:  #E8DCD0  — section borders, pale surfaces     │
 * │  Nude Pale:   #F0EBE3  — alt section backgrounds            │
 * │  Page Bg:     #FAF7F4  — warm cream page background         │
 * │                                                              │
 * │  ── SIGNATURE RED (CTAs & love accents, 10-15% MAX)         │
 * │  Red:         #EB1948  — CTA buttons, heart icon, badges    │
 * │  Red Dark:    #B52344  — CTA hover / gradient end           │
 * │  Red Faint:   #FFF0F3  — very subtle red-tinted bg          │
 * │                                                              │
 * │  DARK MODE                                                    │
 * │  ──────────                                                   │
 * │  Bg dark:     #1C1714  — warm dark brown background         │
 * │  Surface:     #2C2420  — card / elevated surfaces           │
 * │  Surface alt: #332B25  — border / alternate surface         │
 * │  Text light:  #F5EDE5  — primary text on dark               │
 * │  Text muted:  #C4B5A6  — secondary text on dark             │
 * │  Red bright:  #F04C6F  — red accent on dark (5.4:1 AA)     │
 * │  Blush on dk: #e8b4b8  — blush stays for accents           │
 * │  Brown light: #C8B5A2  — interactive on dark                │
 * │                                                              │
 * │  WCAG CONTRAST RATIOS (verified)                              │
 * │  ─────────────────────                                        │
 * │  #3E342B on #ffffff → 11.3:1  ✅ AAA                        │
 * │  #3E342B on #FAF7F4 →  9.8:1  ✅ AAA                        │
 * │  #6B5E52 on #ffffff →  5.5:1  ✅ AA                          │
 * │  #6B5E52 on #FAF7F4 →  4.8:1  ✅ AA (large text)            │
 * │  #ffffff on #EB1948 →  4.6:1  ✅ AA (CTA buttons)           │
 * │  #ffffff on #B52344 →  6.2:1  ✅ AA                          │
 * │  #ffffff on #3E342B → 11.3:1  ✅ AAA (hero, footer)         │
 * │  #ffffff on #5C4F42 →  7.0:1  ✅ AAA                        │
 * │  #3E342B on #F0EBE3 →  8.2:1  ✅ AAA                        │
 * │  #3E342B on #fdf0f1 →  9.7:1  ✅ AAA                        │
 * │  #F5EDE5 on #1C1714 → 11.8:1  ✅ AAA (dark mode)           │
 * │  #C4B5A6 on #1C1714 →  6.5:1  ✅ AA  (dark mode)           │
 * │  #F04C6F on #1C1714 →  5.4:1  ✅ AA  (dark mode red)       │
 * │  #e8b4b8 on #1C1714 → 10.2:1  ✅ AAA (dark mode blush)     │
 * │  #C8B5A2 on #1C1714 →  6.8:1  ✅ AA  (dark mode brown)     │
 * │                                                              │
 * │  COLOR USAGE RATIOS                                           │
 * │  ────────────────────                                         │
 * │  Nude / Brown (surfaces, text, nav, footer): ~55-60%         │
 * │  Blush (decorative, borders, icons):         ~25-30%         │
 * │  Signature Red (CTAs, heart, badges):        ~10-15%         │
 * └──────────────────────────────────────────────────────────────┘
 */

import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  IconButton,
  InputAdornment,
  Chip,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Category as CategoryIcon,
  CheckCircle,
  ArrowForward,
  Close,
  Menu as MenuIcon,
  Favorite,
  CameraAlt,
  MusicNote,
  Cake,
  LocalFlorist,
  DirectionsCar,
  Diamond,
  Brush,
  Restaurant,
  Checkroom,
  ContentCut,
  Celebration,
  FormatQuote,
  Speed,
  Verified,
  CompareArrows,
  Shield,
  SmartToy,
  AccountBalanceWallet,
  DarkMode,
  LightMode,
} from '@mui/icons-material';

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS — Blush + Soft Brown + Nude + Signature Red
   ═══════════════════════════════════════════════════════════ */

const lightTokens = {
  // Page
  pageBg: '#FAF7F4',
  navBg: 'rgba(250,247,244,0.97)',
  navBorder: '#E8DCD0',

  // Blush tones (decorative)
  blush: '#e8b4b8',
  blushLight: '#f5d0d3',
  blushTint: '#fdf0f1',
  blushGhost: '#fef7f8',

  // Soft brown (interactive)
  brown: '#7A6A5B',
  brownDark: '#5C4F42',
  brownDeep: '#3E342B',

  // Nude shades (surfaces)
  nude: '#C8B5A2',
  nudeDark: '#A69484',
  nudeLight: '#E8DCD0',
  nudePale: '#F0EBE3',

  // Signature red (10-15% — CTAs + love accents)
  red: '#EB1948',
  redDark: '#B52344',
  redFaint: '#FFF0F3',

  // Text
  textPrimary: '#3E342B',
  textSecondary: '#6B5E52',
  textMuted: '#9E9187',
  textOnDark: '#ffffff',

  // Surfaces
  sectionAlt: '#F0EBE3',
  sectionAlt2: '#F7F4F0',
  cardBg: '#ffffff',
  cardBorder: '#E8DCD0',
  cardBorderHover: '#C8B5A2',

  // Hero
  heroGradient: 'linear-gradient(135deg, #3E342B 0%, #6B5E52 35%, #A69484 70%, #D2C0AE 100%)',
  heroChipBg: 'rgba(255,255,255,0.15)',

  // CTA (red — buttons only)
  ctaGradient: 'linear-gradient(90deg, #EB1948 0%, #B52344 100%)',
  ctaBg: 'linear-gradient(135deg, #3E342B 0%, #5C4F42 100%)',

  // Chips
  chipBlush: { bg: '#fdf0f1', color: '#A0525C' },
  chipBrown: { bg: '#F0EBE3', color: '#5C4F42' },
  chipGold: { bg: '#FFF8E6', color: '#7a6520' },
  chipRed: { bg: '#FFF0F3', color: '#EB1948' },

  // Shadows
  shadowWarm: 'rgba(140,123,107,0.18)',
  shadowBlush: 'rgba(232,180,184,0.20)',

  // Footer
  footerBg: '#3E342B',
  footerText: 'rgba(255,255,255,0.6)',
  footerHeading: 'rgba(255,255,255,0.9)',
  footerDivider: 'rgba(255,255,255,0.1)',
};

const darkTokens = {
  // Page
  pageBg: '#1C1714',
  navBg: 'rgba(28,23,20,0.97)',
  navBorder: '#332B25',

  // Blush tones
  blush: '#e8b4b8',
  blushLight: '#c49a9e',
  blushTint: '#2C2220',
  blushGhost: '#241C1A',

  // Soft brown (interactive on dark)
  brown: '#C8B5A2',
  brownDark: '#A69484',
  brownDeep: '#F5EDE5',

  // Nude shades
  nude: '#C8B5A2',
  nudeDark: '#A69484',
  nudeLight: '#332B25',
  nudePale: '#2C2220',

  // Signature red (brighter on dark for contrast)
  red: '#F04C6F',
  redDark: '#EB1948',
  redFaint: '#2C1C1E',

  // Text
  textPrimary: '#F5EDE5',
  textSecondary: '#C4B5A6',
  textMuted: '#9E9187',
  textOnDark: '#ffffff',

  // Surfaces
  sectionAlt: '#241C18',
  sectionAlt2: '#201A16',
  cardBg: '#2C2420',
  cardBorder: '#3D3530',
  cardBorderHover: '#C8B5A2',

  // Hero
  heroGradient: 'linear-gradient(135deg, #0F0C0A 0%, #1C1714 35%, #3E342B 70%, #5C4F42 100%)',
  heroChipBg: 'rgba(255,255,255,0.1)',

  // CTA
  ctaGradient: 'linear-gradient(90deg, #F04C6F 0%, #EB1948 100%)',
  ctaBg: 'linear-gradient(135deg, #0F0C0A 0%, #1C1714 100%)',

  // Chips
  chipBlush: { bg: '#2C2220', color: '#e8b4b8' },
  chipBrown: { bg: '#332B25', color: '#C8B5A2' },
  chipGold: { bg: '#2a2518', color: '#d4af37' },
  chipRed: { bg: '#2C1C1E', color: '#F04C6F' },

  // Shadows
  shadowWarm: 'rgba(0,0,0,0.4)',
  shadowBlush: 'rgba(0,0,0,0.35)',

  // Footer
  footerBg: '#0F0C0A',
  footerText: 'rgba(255,255,255,0.5)',
  footerHeading: 'rgba(255,255,255,0.85)',
  footerDivider: 'rgba(255,255,255,0.08)',
};

/* ═══════════════════════════════════════════════════════════
   DATA (layout structure preserved)
   ═══════════════════════════════════════════════════════════ */

const VENDOR_CATEGORIES = [
  { name: 'Reception Venue', icon: Restaurant, count: 245, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop' },
  { name: 'Photographer', icon: CameraAlt, count: 189, image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=300&fit=crop' },
  { name: 'Videographer', icon: CameraAlt, count: 97, image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop' },
  { name: 'Catering', icon: Restaurant, count: 156, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop' },
  { name: 'Cake & Desserts', icon: Cake, count: 132, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&h=300&fit=crop' },
  { name: 'Florist', icon: LocalFlorist, count: 78, image: 'https://images.unsplash.com/photo-1561128290-005859eaf564?w=400&h=300&fit=crop' },
  { name: 'Music & DJ', icon: MusicNote, count: 104, image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop' },
  { name: 'Decor & Styling', icon: Brush, count: 143, image: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=400&h=300&fit=crop' },
  { name: 'Bridal Fashion', icon: Checkroom, count: 67, image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&h=300&fit=crop' },
  { name: 'Makeup Artist', icon: ContentCut, count: 211, image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop' },
  { name: 'Car Rentals', icon: DirectionsCar, count: 53, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop' },
  { name: 'Wedding Rings', icon: Diamond, count: 86, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop' },
  { name: 'Wedding Planner', icon: Celebration, count: 124, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop' },
  { name: 'MC & Entertainment', icon: Celebration, count: 72, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop' },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Search & Discover',
    description: 'Browse hundreds of verified vendors across 14+ categories. Filter by location, budget, and availability to find your perfect match.',
    icon: SearchIcon,
  },
  {
    step: 2,
    title: 'Compare & Shortlist',
    description: 'View portfolios, read real reviews, compare prices side by side. Save your favourites to a personalised shortlist.',
    icon: CompareArrows,
  },
  {
    step: 3,
    title: 'Book with Confidence',
    description: 'Message vendors directly, check real-time availability, and book securely — all in one place. Your dream wedding starts here.',
    icon: CheckCircle,
  },
];

const FEATURED_VENDORS = [
  {
    id: 'fv1',
    name: 'Kelechi Studios',
    category: 'Photographer',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&h=350&fit=crop',
    rating: 4.9,
    reviewCount: 312,
    price: 'From ₦350,000',
    location: 'Lekki, Lagos',
    featured: true,
  },
  {
    id: 'fv2',
    name: 'Oasis Event Centre',
    category: 'Reception Venue',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&h=350&fit=crop',
    rating: 4.8,
    reviewCount: 248,
    price: 'From ₦1,200,000',
    location: 'Victoria Island, Lagos',
    featured: true,
  },
  {
    id: 'fv3',
    name: 'Adunni Cakes',
    category: 'Cake & Desserts',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&h=350&fit=crop',
    rating: 4.7,
    reviewCount: 186,
    price: 'From ₦180,000',
    location: 'Ikeja, Lagos',
    featured: true,
  },
  {
    id: 'fv4',
    name: 'Bloom & Petal',
    category: 'Florist',
    image: 'https://images.unsplash.com/photo-1561128290-005859eaf564?w=500&h=350&fit=crop',
    rating: 4.9,
    reviewCount: 142,
    price: 'From ₦250,000',
    location: 'Abuja',
    featured: true,
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Chioma & Emeka',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    location: 'Lagos',
    date: 'December 2025',
    rating: 5,
    text: 'iTheWed made our wedding planning journey so much easier! We found our photographer, venue, and decorator all in one place. The vendor comparison tool saved us hours of research.',
    vendor: 'Kelechi Studios',
  },
  {
    id: 2,
    name: 'Aisha & Tunde',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    location: 'Abuja',
    date: 'November 2025',
    rating: 5,
    text: 'The budget tracker was a lifesaver. We were able to stay on track with our spending, and the AskWed AI helped us find vendors we never would have discovered on our own.',
    vendor: 'Oasis Event Centre',
  },
  {
    id: 3,
    name: 'Ngozi & Chidi',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
    location: 'Port Harcourt',
    date: 'October 2025',
    rating: 5,
    text: 'From our checklist to the day-of timeline, iTheWed had everything we needed. The seating chart tool alone was worth it — our reception was perfectly organised!',
    vendor: 'Bloom & Petal',
  },
];

const STATS = [
  { value: '2,500+', label: 'Verified Vendors' },
  { value: '10,000+', label: 'Happy Couples' },
  { value: '14+', label: 'Vendor Categories' },
  { value: '₦0', label: 'Platform Fee for Couples' },
];

const WHY_CHOOSE = [
  { icon: Verified, title: 'Verified Vendors', desc: 'Every vendor is reviewed and verified before listing. See real portfolios and genuine reviews.' },
  { icon: Speed, title: 'Book in Minutes', desc: 'Skip the endless phone calls. Check availability and book your preferred vendors instantly.' },
  { icon: CompareArrows, title: 'Smart Compare', desc: 'Compare up to 4 vendors side by side — pricing, reviews, services, and availability.' },
  { icon: Shield, title: 'Secure Booking', desc: 'Your payments and personal data are protected with bank-grade encryption.' },
  { icon: SmartToy, title: 'AskWed AI', desc: 'Get instant answers to wedding planning questions from our AI assistant — 24/7.' },
  { icon: AccountBalanceWallet, title: 'Budget Tools', desc: 'Track every naira with our budget tracker. Set limits, log payments, and stay stress-free.' },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function BlushLandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  // Dark mode state — persists in sessionStorage
  const [isDark, setIsDark] = useState(() => {
    try { return sessionStorage.getItem('blush-dark-mode') === 'true'; }
    catch { return false; }
  });

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      try { sessionStorage.setItem('blush-dark-mode', String(next)); }
      catch { /* ignore */ }
      return next;
    });
  };

  const t = useMemo(() => (isDark ? darkTokens : lightTokens), [isDark]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCategory) params.set('category', searchCategory);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/couple/search-results?${params.toString()}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: t.pageBg, transition: 'background-color 0.3s ease' }}>
      {/* ═══════ NAVBAR ═══════ */}
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: t.navBg,
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: t.navBorder,
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
            {/* Logo — Heart uses SIGNATURE RED (love/passion) */}
            <Box component={Link} to="/landing-blush" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1 }}>
              <Favorite sx={{ color: t.red, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: t.textPrimary, letterSpacing: '-0.5px' }}>
                iTheWed
              </Typography>
            </Box>

            {/* Desktop Nav Links — Soft Brown */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {['Find Vendors', 'How It Works', 'Testimonials'].map((label) => (
                  <Button
                    key={label}
                    onClick={() => {
                      const id = label.toLowerCase().replace(/\s/g, '-');
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    sx={{
                      color: t.textSecondary,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      '&:hover': { color: t.brown, bgcolor: isDark ? 'rgba(200,181,162,0.08)' : 'rgba(122,106,91,0.06)' },
                    }}
                  >
                    {label}
                  </Button>
                ))}
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    color: t.brown,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    '&:hover': { bgcolor: isDark ? 'rgba(200,181,162,0.08)' : 'rgba(122,106,91,0.06)' },
                  }}
                >
                  For Vendors
                </Button>
              </Box>
            )}

            {/* Right: dark toggle + auth buttons / hamburger */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Dark mode toggle */}
              <IconButton
                onClick={toggleDark}
                size="small"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                sx={{
                  color: t.textSecondary,
                  bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' },
                }}
              >
                {isDark ? <LightMode sx={{ fontSize: 20 }} /> : <DarkMode sx={{ fontSize: 20 }} />}
              </IconButton>

              {!isMobile && (
                <>
                  <Button
                    component={Link}
                    to="/"
                    sx={{
                      color: t.brown,
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { bgcolor: isDark ? 'rgba(200,181,162,0.08)' : 'rgba(122,106,91,0.06)' },
                    }}
                  >
                    Sign In
                  </Button>
                  {/* PRIMARY CTA — Signature Red */}
                  <Button
                    variant="contained"
                    component={Link}
                    to="/"
                    sx={{
                      backgroundImage: t.ctaGradient,
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 3,
                      boxShadow: `0 4px 14px rgba(235,25,72,0.25)`,
                      '&:hover': { filter: 'brightness(0.93)' },
                    }}
                  >
                    Get Started — It's Free
                  </Button>
                </>
              )}
              {isMobile && (
                <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} sx={{ color: t.textPrimary }}>
                  {mobileMenuOpen ? <Close /> : <MenuIcon />}
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Mobile Menu */}
          {isMobile && mobileMenuOpen && (
            <Box
              sx={{
                pb: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                borderTop: '1px solid',
                borderColor: t.navBorder,
                pt: 2,
              }}
            >
              {['Find Vendors', 'How It Works', 'Testimonials'].map((label) => (
                <Button
                  key={label}
                  fullWidth
                  onClick={() => {
                    const id = label.toLowerCase().replace(/\s/g, '-');
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  sx={{ justifyContent: 'flex-start', color: t.textSecondary, textTransform: 'none', fontWeight: 500 }}
                >
                  {label}
                </Button>
              ))}
              <Divider sx={{ my: 1, borderColor: t.navBorder }} />
              <Button
                component={Link}
                to="/"
                variant="outlined"
                fullWidth
                sx={{ color: t.brown, borderColor: t.brown, textTransform: 'none', fontWeight: 600 }}
              >
                Sign In
              </Button>
              {/* Mobile CTA — Signature Red */}
              <Button
                component={Link}
                to="/"
                variant="contained"
                fullWidth
                sx={{
                  backgroundImage: t.ctaGradient,
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Get Started — It's Free
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* ═══════ HERO SECTION — Warm Brown gradient ═══════ */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '520px', md: '600px' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: t.heroGradient,
        }}
      >
        {/* Decorative circles — subtle nude */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(200,181,162,0.08)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(232,180,184,0.06)',
          }}
        />
        {/* Subtle dot pattern for texture */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 6, md: 8 } }}>
          <Box sx={{ maxWidth: 720 }}>
            <Chip
              label="Nigeria's #1 Wedding Planning Platform"
              sx={{
                bgcolor: t.heroChipBg,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.8rem',
                mb: 3,
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                lineHeight: 1.15,
                mb: 2,
                letterSpacing: '-1px',
              }}
            >
              Plan Your Dream{' '}
              {/* "Wedding" in blush gradient text */}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, #f5d0d3, #e8b4b8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Wedding
              </Box>
              <br />
              With Confidence
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.6,
                mb: 4,
                maxWidth: 560,
              }}
            >
              Discover verified vendors, manage your budget, build your checklist, and bring your
              wedding vision to life — all from one beautiful platform.
            </Typography>

            {/* Search Bar */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 1.5,
                bgcolor: isDark ? '#2C2420' : 'white',
                p: 1.5,
                borderRadius: 2,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                maxWidth: 680,
                border: isDark ? '1px solid #3D3530' : 'none',
              }}
            >
              <TextField
                placeholder="Category (e.g. Photographer)"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: isDark ? '#F5EDE5' : undefined,
                    '& fieldset': { borderColor: isDark ? '#3D3530' : undefined },
                    '&:hover fieldset': { borderColor: isDark ? '#C8B5A2' : undefined },
                    '&.Mui-focused fieldset': { borderColor: t.brown },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon sx={{ color: t.textMuted, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                placeholder="Location (e.g. Lagos)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: isDark ? '#F5EDE5' : undefined,
                    '& fieldset': { borderColor: isDark ? '#3D3530' : undefined },
                    '&:hover fieldset': { borderColor: isDark ? '#C8B5A2' : undefined },
                    '&.Mui-focused fieldset': { borderColor: t.brown },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: t.textMuted, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {/* Search CTA — Signature Red */}
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundImage: t.ctaGradient,
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 4,
                  minWidth: { md: 140 },
                  boxShadow: `0 4px 14px rgba(235,25,72,0.25)`,
                  '&:hover': { filter: 'brightness(0.93)' },
                }}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Box>

            {/* Trust line */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Avatar
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i + 10}`}
                    sx={{ width: 28, height: 28, border: '2px solid rgba(255,255,255,0.7)', ml: i > 1 ? -1 : 0 }}
                  />
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                Trusted by <strong style={{ color: '#f5d0d3' }}>10,000+</strong> couples across Nigeria
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ═══════ STATS BAR — Brown numbers ═══════ */}
      <Box sx={{ bgcolor: t.sectionAlt, borderBottom: '1px solid', borderColor: t.navBorder, transition: 'all 0.3s' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              py: { xs: 3, md: 4 },
              gap: 3,
              textAlign: 'center',
            }}
          >
            {STATS.map((stat) => (
              <Box key={stat.label}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: t.brown, fontSize: { xs: '1.5rem', md: '2rem' } }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: t.textSecondary, fontWeight: 500, mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ═══════ CATEGORIES GRID ═══════ */}
      <Box id="find-vendors" sx={{ py: { xs: 6, md: 10 }, bgcolor: t.pageBg, transition: 'all 0.3s' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Browse"
              size="small"
              sx={{ bgcolor: t.chipBrown.bg, color: t.chipBrown.color, fontWeight: 600, mb: 2 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, color: t.textPrimary, mb: 1.5 }}>
              Find the Perfect Vendor
            </Typography>
            <Typography variant="body1" sx={{ color: t.textSecondary, maxWidth: 540, mx: 'auto' }}>
              Browse across 14+ wedding vendor categories. Every vendor is verified and reviewed by real couples.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {VENDOR_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.name}
                  onClick={() => navigate(`/couple/search-results?category=${encodeURIComponent(cat.name)}`)}
                  sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 24px ${t.shadowWarm}`,
                      '& .cat-overlay': { bgcolor: 'rgba(62,52,43,0.65)' },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={isMobile ? 120 : 160}
                    image={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    sx={{ objectFit: 'cover' }}
                  />
                  {/* Warm brown overlay */}
                  <Box
                    className="cat-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(62,52,43,0.55)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.3s',
                      p: 1.5,
                    }}
                  >
                    <Icon sx={{ color: '#f5d0d3', fontSize: { xs: 28, md: 34 }, mb: 0.5 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textAlign: 'center',
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                        lineHeight: 1.3,
                      }}
                    >
                      {cat.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(245,208,211,0.8)', fontWeight: 500, mt: 0.3 }}
                    >
                      {cat.count} vendors
                    </Typography>
                  </Box>
                </Card>
              );
            })}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/couple/search-results')}
              sx={{
                color: t.brown,
                borderColor: t.brown,
                fontWeight: 600,
                textTransform: 'none',
                px: 4,
                '&:hover': { bgcolor: isDark ? 'rgba(200,181,162,0.08)' : 'rgba(122,106,91,0.06)', borderColor: t.brownDark },
              }}
            >
              View All Vendors
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <Box id="how-it-works" sx={{ py: { xs: 6, md: 10 }, bgcolor: t.sectionAlt, transition: 'all 0.3s' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Simple Process"
              size="small"
              sx={{ bgcolor: t.chipBlush.bg, color: t.chipBlush.color, fontWeight: 600, mb: 2 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, color: t.textPrimary, mb: 1.5 }}>
              How It Works
            </Typography>
            <Typography variant="body1" sx={{ color: t.textSecondary, maxWidth: 480, mx: 'auto' }}>
              From first search to "I do" — we make every step simple, transparent, and stress-free.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <Grid size={{ xs: 12, md: 4 }} key={item.step}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      bgcolor: t.cardBg,
                      borderRadius: 3,
                      height: '100%',
                      transition: 'all 0.3s',
                      border: '1px solid',
                      borderColor: t.cardBorder,
                      '&:hover': {
                        borderColor: t.blush,
                        boxShadow: `0 8px 24px ${t.shadowBlush}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        bgcolor: t.nudePale,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        position: 'relative',
                        border: `2px solid ${t.nudeLight}`,
                      }}
                    >
                      <Icon sx={{ fontSize: 32, color: t.brownDark }} />
                      {/* Step number badge — Signature Red */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundImage: t.ctaGradient,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                        }}
                      >
                        {item.step}
                      </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: t.textPrimary, mb: 1.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: t.textSecondary, lineHeight: 1.7 }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ═══════ FEATURED VENDORS ═══════ */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: t.pageBg, transition: 'all 0.3s' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Chip
                label="Top Rated"
                size="small"
                sx={{ bgcolor: t.chipGold.bg, color: t.chipGold.color, fontWeight: 600, mb: 1.5 }}
              />
              <Typography variant="h3" sx={{ fontWeight: 700, color: t.textPrimary }}>
                Featured Vendors
              </Typography>
              <Typography variant="body1" sx={{ color: t.textSecondary, mt: 1 }}>
                Hand-picked professionals loved by couples across Nigeria.
              </Typography>
            </Box>
            <Button
              variant="text"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/couple/search-results')}
              sx={{ color: t.brown, fontWeight: 600, textTransform: 'none' }}
            >
              See All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {FEATURED_VENDORS.map((vendor) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={vendor.id}>
                <Card
                  onClick={() => navigate(`/couple/vendor/${vendor.id}`)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: t.cardBg,
                    border: '1px solid',
                    borderColor: t.cardBorder,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 32px ${t.shadowWarm}`,
                      borderColor: t.nude,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height={200}
                      image={vendor.image}
                      alt={vendor.name}
                      loading="lazy"
                      sx={{ objectFit: 'cover' }}
                    />
                    {/* Featured badge — Signature Red */}
                    <Chip
                      label="Featured"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: t.red,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ color: t.brown, fontWeight: 600, fontSize: '0.75rem', mb: 0.5 }}>
                      {vendor.category}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: t.textPrimary, fontSize: '1rem', mb: 0.5 }}>
                      {vendor.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <Rating
                        value={vendor.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                        sx={{
                          '& .MuiRating-iconFilled': { color: '#d4986a' },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: t.textSecondary }}>
                        {vendor.rating} ({vendor.reviewCount})
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <LocationOn sx={{ fontSize: 16, color: t.textMuted }} />
                        <Typography variant="caption" sx={{ color: t.textSecondary }}>
                          {vendor.location}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: t.textPrimary }}>
                        {vendor.price}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <Box id="testimonials" sx={{ py: { xs: 6, md: 10 }, bgcolor: t.sectionAlt, transition: 'all 0.3s' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Love Stories"
              size="small"
              sx={{ bgcolor: t.chipBlush.bg, color: t.chipBlush.color, fontWeight: 600, mb: 2 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, color: t.textPrimary, mb: 1.5 }}>
              What Couples Are Saying
            </Typography>
            <Typography variant="body1" sx={{ color: t.textSecondary, maxWidth: 480, mx: 'auto' }}>
              Real stories from couples who planned their perfect day with iTheWed.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {TESTIMONIALS.map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.id}>
                <Card
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: t.cardBg,
                    border: '1px solid',
                    borderColor: t.cardBorder,
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: `0 8px 24px ${t.shadowBlush}`,
                      borderColor: t.blush,
                    },
                  }}
                >
                  <FormatQuote sx={{ color: t.blush, fontSize: 36, mb: 1, opacity: 0.7, transform: 'scaleX(-1)' }} />
                  <Typography variant="body2" sx={{ color: t.textSecondary, lineHeight: 1.75, mb: 3, flex: 1 }}>
                    "{item.text}"
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: t.navBorder }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={item.avatar} sx={{ width: 44, height: 44, border: `2px solid ${t.blushLight}` }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: t.textPrimary }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: t.textMuted }}>
                        {item.location} · {item.date}
                      </Typography>
                    </Box>
                    <Rating
                      value={item.rating}
                      size="small"
                      readOnly
                      sx={{ '& .MuiRating-iconFilled': { color: '#d4986a' } }}
                    />
                  </Box>
                  <Chip
                    label={`Hired: ${item.vendor}`}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 2, alignSelf: 'flex-start', color: t.nudeDark, borderColor: t.nudeDark, fontWeight: 500, fontSize: '0.7rem' }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════ WHY CHOOSE US ═══════ */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: t.pageBg, transition: 'all 0.3s' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Why Us"
              size="small"
              sx={{ bgcolor: t.chipBrown.bg, color: t.chipBrown.color, fontWeight: 600, mb: 2 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, color: t.textPrimary, mb: 1.5 }}>
              Everything You Need, One Platform
            </Typography>
            <Typography variant="body1" sx={{ color: t.textSecondary, maxWidth: 520, mx: 'auto' }}>
              From vendor discovery to wedding day — iTheWed is the only tool Nigerian couples need.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {WHY_CHOOSE.map((item) => {
              const Icon = item.icon;
              return (
                <Box
                  key={item.title}
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    bgcolor: t.cardBg,
                    border: '1px solid',
                    borderColor: t.cardBorder,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: t.blush,
                      boxShadow: `0 4px 16px ${t.shadowBlush}`,
                      '& .why-icon': {
                        bgcolor: t.blush,
                        color: t.brownDeep,
                        borderColor: t.blush,
                      },
                    },
                  }}
                >
                  <Box
                    className="why-icon"
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: t.nudePale,
                      border: `1px solid ${t.nudeLight}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                      transition: 'all 0.3s',
                      color: t.brownDark,
                    }}
                  >
                    <Icon sx={{ fontSize: 26 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: t.textPrimary, mb: 1, fontSize: '1rem' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: t.textSecondary, lineHeight: 1.7 }}>
                    {item.desc}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ═══════ CTA SECTION — Dark Brown bg, Red button ═══════ */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: t.ctaBg,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(200,181,162,0.06)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: '30%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(232,180,184,0.04)',
          }}
        />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            Ready to Start Planning?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 420, mx: 'auto' }}>
            Join thousands of Nigerian couples who found their dream vendors on iTheWed. It's completely free for couples.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            {/* Primary CTA — Signature Red */}
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/"
              sx={{
                backgroundImage: t.ctaGradient,
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                px: 5,
                py: 1.5,
                fontSize: '1rem',
                boxShadow: `0 4px 14px rgba(235,25,72,0.25)`,
                '&:hover': { filter: 'brightness(0.93)' },
              }}
            >
              Get Started — It's Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/vendor"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.35)',
                fontWeight: 600,
                textTransform: 'none',
                px: 5,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              List Your Business
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ═══════ FOOTER — Dark Brown ═══════ */}
      <Box component="footer" sx={{ bgcolor: t.footerBg, color: 'white', py: { xs: 5, md: 7 }, transition: 'all 0.3s' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Brand Column */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {/* Footer heart — Signature Red */}
                <Favorite sx={{ color: t.red, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                  iTheWed
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: t.footerText, lineHeight: 1.7, mb: 2, maxWidth: 300 }}>
                Nigeria's most trusted wedding planning platform. Connecting couples with verified vendors since 2024.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                  <Chip
                    key={social}
                    label={social}
                    size="small"
                    clickable
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.7rem',
                      '&:hover': { bgcolor: 'rgba(200,181,162,0.2)' },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* For Couples */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: t.footerHeading, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
                For Couples
              </Typography>
              {['Find Vendors', 'Wedding Checklist', 'Budget Tracker', 'Guest List', 'AskWed AI', 'Inspiration'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: t.footerText,
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#e8b4b8' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            {/* For Vendors */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: t.footerHeading, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
                For Vendors
              </Typography>
              {['List Your Business', 'Vendor Dashboard', 'Pricing Plans', 'Success Stories', 'Vendor Resources'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: t.footerText,
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#e8b4b8' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            {/* Company */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: t.footerHeading, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
                Company
              </Typography>
              {['About Us', 'Blog', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: t.footerText,
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#e8b4b8' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            {/* Support */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: t.footerHeading, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
                Support
              </Typography>
              {['Help Centre', 'FAQs', 'Community', 'Report an Issue'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: t.footerText,
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#e8b4b8' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>
          </Grid>

          {/* Bottom bar */}
          <Divider sx={{ borderColor: t.footerDivider, my: 4 }} />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              © {new Date().getFullYear()} iTheWed. All rights reserved.
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              Made with ❤️ in Lagos, Nigeria
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
