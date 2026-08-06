import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
} from '@mui/material'
import { ArrowForward, Star } from '@mui/icons-material'

export default function ImprovedLandingPage() {
  const navigate = useNavigate()

  const getCategoryImage = (category: string): string => {
    const images: Record<string, string> = {
      venue: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop&q=80',
      photographer: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=400&fit=crop&q=80',
      catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop&q=80',
      florist: 'https://images.unsplash.com/photo-1561128290-005859eaf564?w=600&h=400&fit=crop&q=80',
      makeup: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop&q=80',
      decor: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&h=400&fit=crop&q=80',
    }
    return images[category.toLowerCase()] || images.venue
  }

  const topCategories = [
    { name: 'Reception Venue', vendors: 245 },
    { name: 'Photography', vendors: 189 },
    { name: 'Catering', vendors: 156 },
    { name: 'Florist', vendors: 78 },
    { name: 'Makeup', vendors: 211 },
    { name: 'Decor', vendors: 143 },
  ]

  const testimonials = [
    {
      name: 'Chioma & Segun',
      text: 'itheewed made finding vendors so easy. We booked 8 vendors through the platform and everything was perfect!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    },
    {
      name: 'Ada & Khalid',
      text: 'The comparison feature helped us make the best decision for our budget. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    },
    {
      name: 'Zainab & Tunde',
      text: 'Best wedding planning experience ever. The shortlist feature kept everything organized.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
    },
  ]

  const stats = [
    { label: 'Active Vendors', value: '2,500+' },
    { label: 'Happy Couples', value: '5,000+' },
    { label: 'Weddings Planned', value: '8,000+' },
  ]

  const features = [
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find vendors by category, location, budget & availability with advanced filters',
    },
    {
      icon: '⭐',
      title: 'Verified Reviews',
      description: 'Read genuine reviews from real couples who used these vendors',
    },
    {
      icon: '💰',
      title: 'Price Comparison',
      description: 'Compare quotes side-by-side and find the best value for your budget',
    },
    {
      icon: '📱',
      title: 'Direct Messaging',
      description: 'Chat with vendors directly, check availability, and negotiate pricing',
    },
    {
      icon: '❤️',
      title: 'Shortlist & Save',
      description: 'Create a personalized shortlist of your favorite vendors',
    },
    {
      icon: '✅',
      title: 'Secure Booking',
      description: 'Book with confidence with our secure payment and contract system',
    },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Header/Nav */}
      <Box
        sx={{
          bgcolor: '#fff',
          borderBottom: '1px solid #E2E8F0',
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 800,
                background: 'linear-gradient(90deg, #EB1948 0%, #B52344 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              ❤️ itheewed
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/couple/onboarding')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                background: 'linear-gradient(90deg, #EB1948 0%, #B52344 100%)',
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                sx={{
                  fontSize: { xs: 32, md: 48 },
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Plan Your Perfect Wedding Day
              </Typography>
              <Typography sx={{ fontSize: { xs: 16, md: 18 }, mb: 4, opacity: 0.95 }}>
                Find verified vendors, compare prices, read real reviews, and book with confidence.
                All in one place.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/couple/onboarding')}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    fontWeight: 700,
                    py: 1.5,
                    px: 4,
                    fontSize: 16,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#f0f0f0' },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Start Planning
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/couple/search-results')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    fontWeight: 700,
                    py: 1.5,
                    px: 4,
                    fontSize: 16,
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Browse Vendors
                </Button>
              </Stack>

              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 4, mt: 6, flexWrap: 'wrap' }}>
                {stats.map((stat) => (
                  <Box key={stat.label}>
                    <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ fontSize: 12, opacity: 0.8 }}>{stat.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  bgcolor: '#f0f0f0',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop&q=80"
                  alt="Wedding planning"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: { xs: 28, md: 36 },
              fontWeight: 800,
              textAlign: 'center',
              mb: 1,
              color: '#0F172A',
            }}
          >
            Why Choose itheewed?
          </Typography>
          <Typography sx={{ textAlign: 'center', color: '#64748B', mb: 6, fontSize: 16 }}>
            Everything you need to plan an amazing wedding
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <Card
                  sx={{
                    h: '100%',
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: 40, mb: 2 }}>{feature.icon}</Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#0F172A',
                        mb: 1,
                        fontSize: 16,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: 14 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Top Categories */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: { xs: 28, md: 36 },
              fontWeight: 800,
              mb: 1,
              color: '#0F172A',
            }}
          >
            Popular Categories
          </Typography>
          <Typography sx={{ color: '#64748B', mb: 6, fontSize: 16 }}>
            Browse our most popular vendor categories
          </Typography>
          <Grid container spacing={3}>
            {topCategories.map((cat) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.name}>
                <Card
                  sx={{
                    h: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    },
                  }}
                  onClick={() => navigate(`/couple/search-results?category=${cat.name}`)}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 250,
                      bgcolor: '#f0f0f0',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={getCategoryImage(cat.name)}
                      alt={cat.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1, color: '#0F172A' }}>
                      {cat.name}
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: 14 }}>
                      {cat.vendors} vendors available
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: { xs: 28, md: 36 },
              fontWeight: 800,
              textAlign: 'center',
              mb: 1,
              color: '#0F172A',
            }}
          >
            Real Stories from Happy Couples
          </Typography>
          <Typography sx={{ textAlign: 'center', color: '#64748B', mb: 6, fontSize: 16 }}>
            See what couples are saying about their itheewed experience
          </Typography>
          <Grid container spacing={3}>
            {testimonials.map((testimonial) => (
              <Grid size={{ xs: 12, md: 4 }} key={testimonial.name}>
                <Card
                  sx={{
                    h: '100%',
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#FFA500', fontSize: 16 }} />
                      ))}
                    </Box>
                    <Typography sx={{ color: '#64748B', mb: 3, fontSize: 15, fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={testimonial.image} sx={{ width: 40, height: 40 }} />
                      <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>
                        {testimonial.name}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #EB1948 0%, #B52344 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            sx={{
              fontSize: { xs: 28, md: 40 },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Ready to Plan Your Dream Wedding?
          </Typography>
          <Typography sx={{ fontSize: 16, mb: 4, opacity: 0.95 }}>
            Let's get you started with your personalized wedding planning journey
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/couple/onboarding')}
            sx={{
              bgcolor: 'white',
              color: '#EB1948',
              fontWeight: 700,
              py: 1.5,
              px: 6,
              fontSize: 16,
              borderRadius: 2,
              '&:hover': { bgcolor: '#f0f0f0' },
            }}
            endIcon={<ArrowForward />}
          >
            Start Your Journey
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0F172A', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 2, fontSize: 18 }}>
                ❤️ itheewed
              </Typography>
              <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>
                Making wedding planning simple, affordable & joyful.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>Quick Links</Typography>
              <Stack spacing={1}>
                <Typography sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: 14 }}>
                  Browse Vendors
                </Typography>
                <Typography sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: 14 }}>
                  How It Works
                </Typography>
                <Typography sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: 14 }}>
                  About Us
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>For Vendors</Typography>
              <Stack spacing={1}>
                <Typography sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: 14 }}>
                  Join as Vendor
                </Typography>
                <Typography sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: 14 }}>
                  Vendor Dashboard
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>Support</Typography>
              <Stack spacing={1}>
                <Typography sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: 14 }}>
                  Contact Us
                </Typography>
                <Typography sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: 14 }}>
                  Privacy Policy
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: '1px solid #334155',
              pt: 4,
              textAlign: 'center',
              color: '#94A3B8',
            }}
          >
            <Typography sx={{ fontSize: 14 }}>
              © 2024 itheewed. All rights reserved. | Made with ❤️ for couples in Nigeria
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
