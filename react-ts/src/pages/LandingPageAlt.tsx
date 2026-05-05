import { useState } from 'react';
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
} from '@mui/icons-material';

/* ─────────────────── DATA ─────────────────── */

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

/* ─────────────────── COMPONENT ─────────────────── */

export default function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCategory) params.set('category', searchCategory);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/couple/search-results?${params.toString()}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      {/* ───── NAVBAR ───── */}
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
            {/* Logo */}
            <Box component={Link} to="/landing" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1 }}>
              <Favorite sx={{ color: '#EB1948', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#002528', letterSpacing: '-0.5px' }}>
                iTheWed
              </Typography>
            </Box>

            {/* Desktop Nav Links */}
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
                      color: '#374151',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      '&:hover': { color: '#00838F', bgcolor: 'rgba(0,131,143,0.04)' },
                    }}
                  >
                    {label}
                  </Button>
                ))}
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    color: '#00838F',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' },
                  }}
                >
                  For Vendors
                </Button>
              </Box>
            )}

            {/* Auth Buttons / Hamburger */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {!isMobile && (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      color: '#00838F',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' },
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/signup"
                    sx={{
                      backgroundImage: 'linear-gradient(90deg, #EB1948 0%, #B52344 100%)',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 3,
                      '&:hover': { filter: 'brightness(0.95)' },
                    }}
                  >
                    Get Started — It's Free
                  </Button>
                </>
              )}
              {isMobile && (
                <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} sx={{ color: '#002528' }}>
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
                borderColor: 'grey.200',
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
                  sx={{ justifyContent: 'flex-start', color: '#374151', textTransform: 'none', fontWeight: 500 }}
                >
                  {label}
                </Button>
              ))}
              <Divider sx={{ my: 1 }} />
              <Button
                component={Link}
                to="/"
                variant="outlined"
                fullWidth
                sx={{ color: '#00838F', borderColor: '#00838F', textTransform: 'none', fontWeight: 600 }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/"
                variant="contained"
                fullWidth
                sx={{
                  backgroundImage: 'linear-gradient(90deg, #EB1948 0%, #B52344 100%)',
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

      {/* ───── HERO SECTION ───── */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '560px', md: '680px' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0D1B2A 0%, #00838F 40%, #00C9DB 100%)',
          backgroundAttachment: { md: 'fixed' },
        }}
      >
        {/* Decorative shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
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
            background: 'rgba(255,255,255,0.03)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 6, md: 8 } }}>
          <Box sx={{ maxWidth: 720 }}>
            <Chip
              label="🇳🇬 Nigeria's #1 Wedding Planning Platform"
              sx={{
                bgcolor: 'rgba(255,255,255,0.12)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.85rem',
                mb: 3,
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                },
              }}
            />
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 900,
                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.8rem' },
                lineHeight: 1.1,
                mb: 3,
                letterSpacing: '-1.5px',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0f7fa 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Plan Your Dream{' '}
              <Box component="span" sx={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                bgcolor: 'rgba(255,255,255,0.95)',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 25px 80px rgba(0,0,0,0.35)',
                maxWidth: 700,
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <TextField
                placeholder="Category (e.g. Photographer)"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
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
                sx={{ flex: 1 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: '#9ca3af', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundImage: 'linear-gradient(90deg, #EB1948 0%, #B52344 100%)',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 4,
                  minWidth: { md: 140 },
                  '&:hover': { filter: 'brightness(0.95)' },
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
                    sx={{ width: 28, height: 28, border: '2px solid white', ml: i > 1 ? -1 : 0 }}
                  />
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                Trusted by <strong style={{ color: '#FFD700' }}>10,000+</strong> couples across Nigeria
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ───── STATS BAR ───── */}
      <Box sx={{ bgcolor: '#f9fafb', borderBottom: '1px solid', borderColor: 'grey.200' }}>
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
                  sx={{ fontWeight: 800, color: '#00838F', fontSize: { xs: '1.5rem', md: '2rem' } }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ───── CATEGORIES GRID ───── */}
      <Box id="find-vendors" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="Browse" size="small" sx={{ bgcolor: '#e0f7fa', color: '#00838F', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#002528', mb: 1.5 }}>
              Find the Perfect Vendor
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 540, mx: 'auto' }}>
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
                      boxShadow: '0 12px 24px rgba(0,131,143,0.15)',
                      '& .cat-overlay': { bgcolor: 'rgba(0,37,40,0.55)' },
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
                  <Box
                    className="cat-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(0,37,40,0.45)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.3s',
                      p: 1.5,
                    }}
                  >
                    <Icon sx={{ color: 'white', fontSize: { xs: 28, md: 34 }, mb: 0.5 }} />
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
                      sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500, mt: 0.3 }}
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
                color: '#00838F',
                borderColor: '#00838F',
                fontWeight: 600,
                textTransform: 'none',
                px: 4,
                '&:hover': { bgcolor: 'rgba(0,131,143,0.04)', borderColor: '#00626b' },
              }}
            >
              View All Vendors
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ───── HOW IT WORKS ───── */}
      <Box id="how-it-works" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="Simple Process" size="small" sx={{ bgcolor: '#fce4ec', color: '#EB1948', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#002528', mb: 1.5 }}>
              How It Works
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 480, mx: 'auto' }}>
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
                      bgcolor: 'white',
                      borderRadius: 4,
                      height: '100%',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '2px solid',
                      borderColor: 'transparent',
                      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #00838F 0%, #26bdce 100%)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                      '&:hover': {
                        boxShadow: '0 12px 32px rgba(0,131,143,0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        bgcolor: '#e0f7fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        position: 'relative',
                      }}
                    >
                      <Icon sx={{ fontSize: 32, color: '#00838F' }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundImage: 'linear-gradient(90deg, #EB1948 0%, #B52344 100%)',
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
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#002528', mb: 1.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.7 }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ───── FEATURED VENDORS ───── */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Chip label="Top Rated" size="small" sx={{ bgcolor: '#FFF3CD', color: '#856404', fontWeight: 600, mb: 1.5 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#002528' }}>
                Featured Vendors
              </Typography>
              <Typography variant="body1" sx={{ color: '#6b7280', mt: 1 }}>
                Hand-picked professionals loved by couples across Nigeria.
              </Typography>
            </Box>
            <Button
              variant="text"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/couple/search-results')}
              sx={{ color: '#00838F', fontWeight: 600, textTransform: 'none' }}
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
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
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
                    <Chip
                      label="Featured"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: '#FFD700',
                        color: '#002528',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ color: '#00838F', fontWeight: 600, fontSize: '0.75rem', mb: 0.5 }}>
                      {vendor.category}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#002528', fontSize: '1rem', mb: 0.5 }}>
                      {vendor.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <Rating value={vendor.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {vendor.rating} ({vendor.reviewCount})
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#9ca3af' }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {vendor.location}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#002528' }}>
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

      {/* ───── TESTIMONIALS ───── */}
      <Box id="testimonials" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="Love Stories" size="small" sx={{ bgcolor: '#fce4ec', color: '#EB1948', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#002528', mb: 1.5 }}>
              What Couples Are Saying
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 480, mx: 'auto' }}>
              Real stories from couples who planned their perfect day with iTheWed.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid size={{ xs: 12, md: 4 }} key={t.id}>
                <Card
                  sx={{
                    p: 3.5,
                    borderRadius: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '2px solid',
                    borderColor: 'transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #FFE5E5 0%, #FFF5E5 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(235,25,72,0.04)',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(235,25,72,0.12)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <FormatQuote sx={{ color: '#EB1948', fontSize: 36, mb: 1, opacity: 0.6, transform: 'scaleX(-1)' }} />
                  <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.75, mb: 3, flex: 1 }}>
                    "{t.text}"
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={t.avatar} sx={{ width: 44, height: 44 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#002528' }}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {t.location} · {t.date}
                      </Typography>
                    </Box>
                    <Rating value={t.rating} size="small" readOnly />
                  </Box>
                  <Chip
                    label={`Hired: ${t.vendor}`}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 2, alignSelf: 'flex-start', color: '#00838F', borderColor: '#00838F', fontWeight: 500, fontSize: '0.7rem' }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ───── WHY CHOOSE US ───── */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="Why Us" size="small" sx={{ bgcolor: '#e0f7fa', color: '#00838F', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#002528', mb: 1.5 }}>
              Everything You Need, One Platform
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 520, mx: 'auto' }}>
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
                    border: '1px solid',
                    borderColor: 'grey.200',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#00838F',
                      boxShadow: '0 4px 16px rgba(0,131,143,0.08)',
                      '& .why-icon': { bgcolor: '#00838F', color: 'white' },
                    },
                  }}
                >
                  <Box
                    className="why-icon"
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: '#e0f7fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                      transition: 'all 0.3s',
                      color: '#00838F',
                    }}
                  >
                    <Icon sx={{ fontSize: 26 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#002528', mb: 1, fontSize: '1rem' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.7 }}>
                    {item.desc}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ───── CTA SECTION ───── */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(135deg, #0D1B2A 0%, #00838F 40%, #00C9DB 100%)',
          backgroundAttachment: { md: 'fixed' },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }} />

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
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/"
              sx={{
                backgroundImage: 'linear-gradient(90deg, #EB1948 0%, #B52344 100%)',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                px: 5,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': { filter: 'brightness(0.95)' },
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
                borderColor: 'rgba(255,255,255,0.4)',
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

      {/* ───── FOOTER ───── */}
      <Box component="footer" sx={{ bgcolor: '#002528', color: 'white', py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Brand Column */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Favorite sx={{ color: '#EB1948', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                  iTheWed
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, mb: 2, maxWidth: 300 }}>
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
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* For Couples */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
                For Couples
              </Typography>
              {['Find Vendors', 'Wedding Checklist', 'Budget Tracker', 'Guest List', 'AskWed AI', 'Inspiration'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.55)',
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            {/* For Vendors */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
                For Vendors
              </Typography>
              {['List Your Business', 'Vendor Dashboard', 'Pricing Plans', 'Success Stories', 'Vendor Resources'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.55)',
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            {/* Company */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
                Company
              </Typography>
              {['About Us', 'Blog', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.55)',
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            {/* Support */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
                Support
              </Typography>
              {['Help Centre', 'FAQs', 'Community', 'Report an Issue'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.55)',
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>
          </Grid>

          {/* Bottom bar */}
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />
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
