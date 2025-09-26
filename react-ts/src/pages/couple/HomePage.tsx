import { Box, Typography, Grid, Card, CardContent, Button, CardMedia, IconButton, Chip, TextField, ToggleButton, ToggleButtonGroup, InputAdornment, Rating, Avatar } from '@mui/material'
import { Search, Favorite, FavoriteBorder, Star, NavigateBefore, NavigateNext, LocationOn, Phone, Message } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockVendors, getVendorsByCategory, type Vendor } from '@/data/mockVendors'
import Footer from '@/components/Footer'

const vendorCategories = [
  'Venue',
  'Florist',
  'Cake & Desserts',
  'Photography',
  'Dress & Apparel',
  'Catering',
  'Decor',
  'Videography',
  'MC/DJ/Live Band',
  'Jewelry',
  'Make-up/Hair',
  'Bar Services',
  'Car Rentals'
]

export default function HomePage() {
  const navigate = useNavigate()
  const [searchType, setSearchType] = useState<'category' | 'name'>('category')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [favourites, setFavorites] = useState<Record<string, boolean>>({})
  const [hotVendors, setHotVendors] = useState<Vendor[]>([])
  const [topVendors, setTopVendors] = useState<Vendor[]>([])

  // Initialize hot and top vendors
  useEffect(() => {
    // Get hot vendors (high rated, recent)
    const hot = mockVendors
      .filter(v => v.rating >= 4.7)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
    setHotVendors(hot)

    // Get top vendors for the week (most reviews)
    const top = mockVendors
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 8)
    setTopVendors(top)
  }, [])

  const handleSearch = () => {
    if (searchType === 'category' && selectedCategory) {
      navigate('/couple/vendor-selection', {
        state: {
          selectedCategories: [selectedCategory],
          activeCategory: selectedCategory
        }
      })
    } else if (searchType === 'name' && searchQuery) {
      // For name search, we'll filter and show results
      const filtered = mockVendors.filter(v => 
        v.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (filtered.length > 0) {
        navigate('/couple/vendor-selection', {
          state: {
            searchResults: filtered,
            searchQuery
          }
        })
      }
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleVendorClick = (vendorId: string) => {
    navigate(`/couple/vendor/${vendorId}`)
  }

  const handleCategoryClick = (category: string) => {
    navigate('/couple/vendor-selection', {
      state: {
        selectedCategories: [category],
        activeCategory: category
      }
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'bgThemeColor.main' }}>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 8, 
        px: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          zIndex: 1
        }} />
        
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 1200, mx: 'auto' }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={6}>
              <Typography variant="h2" className="font-bold" sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
                Need Satisfaction? Get Satisfaction!
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Plan your wedding with the best vendors in and out of town.
              </Typography>

              {/* Search Section */}
              <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, color: 'black' }}>
                {/* Search Type Toggle */}
                <ToggleButtonGroup
                  value={searchType}
                  exclusive
                  onChange={(_, value) => value && setSearchType(value)}
                  sx={{ mb: 2, width: '100%' }}
                >
                  <ToggleButton 
                    value="category" 
                    sx={{ 
                      flex: 1,
                      bgcolor: searchType === 'category' ? 'primary.main' : 'transparent',
                      color: searchType === 'category' ? 'white' : 'primary.main',
                      '&:hover': {
                        bgcolor: searchType === 'category' ? 'primary.dark' : 'primary.50'
                      }
                    }}
                  >
                    Category
                  </ToggleButton>
                  <ToggleButton 
                    value="name" 
                    sx={{ 
                      flex: 1,
                      bgcolor: searchType === 'name' ? 'primary.main' : 'transparent',
                      color: searchType === 'name' ? 'white' : 'primary.main',
                      '&:hover': {
                        bgcolor: searchType === 'name' ? 'primary.dark' : 'primary.50'
                      }
                    }}
                  >
                    Name of Vendor
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Search Input */}
                {searchType === 'category' ? (
                  <TextField
                    select
                    fullWidth
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    placeholder="Select a category"
                    SelectProps={{
                      native: true,
                    }}
                    sx={{ mb: 2 }}
                  >
                    <option value="">Select a category</option>
                    {vendorCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter vendor name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                )}

                {/* Search Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSearch}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  Search
                </Button>
              </Box>
            </Grid>

            {/* Right Content - Image Collage */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: 300 }}>
                {/* Main Image */}
                <Card sx={{ 
                  position: 'absolute', 
                  top: 20, 
                  right: 20, 
                  width: 200, 
                  height: 150,
                  zIndex: 3
                }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image="https://images.unsplash.com/photo-1519167758481-83f2946fead6?w=400&h=300&fit=crop"
                    alt="Wedding Venue"
                    sx={{ borderRadius: 1 }}
                  />
                </Card>

                {/* Second Image */}
                <Card sx={{ 
                  position: 'absolute', 
                  top: 60, 
                  left: 40, 
                  width: 180, 
                  height: 120,
                  zIndex: 2
                }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                    alt="Wedding Ceremony"
                    sx={{ borderRadius: 1 }}
                  />
                </Card>

                {/* Third Image */}
                <Card sx={{ 
                  position: 'absolute', 
                  bottom: 20, 
                  right: 60, 
                  width: 160, 
                  height: 100,
                  zIndex: 1
                }}>
                  <CardMedia
                    component="img"
                    height="100"
                    image="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
                    alt="Wedding Band"
                    sx={{ borderRadius: 1 }}
                  />
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        {/* Hot Vendors Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" className="font-bold">
              Hot Vendors
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small">
                <NavigateBefore />
              </IconButton>
              <IconButton size="small">
                <NavigateNext />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {hotVendors.map((vendor) => (
              <Grid key={vendor.id} item xs={12} sm={6} md={4}>
                <Card sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'segmentColor.main',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }
                }}
                onClick={() => handleVendorClick(vendor.id)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={vendor.image}
                      alt={vendor.name}
                      sx={{ borderRadius: 0 }}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(vendor.id)
                      }}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'segmentColor.main',
                        '&:hover': { bgcolor: 'white' }
                      }}
                    >
                      {favourites[vendor.id] ? (
                        <Favorite sx={{ color: '#ef4444', fontSize: 20 }} />
                      ) : (
                        <FavoriteBorder sx={{ color: '#9ca3af', fontSize: 20 }} />
                      )}
                    </IconButton>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" className="font-bold">{vendor.name}</Typography>
                    <Typography variant="body2" className="text-primary-600 mb-2">{vendor.category}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" className="text-primary-600 font-semibold">
                        Starting Price: {vendor.price}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'grey.600', mr: 0.5 }} />
                      <Typography variant="body2" className="text-gray-600">
                        {vendor.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={vendor.rating} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {vendor.rating} ({vendor.reviewCount})
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVendorClick(vendor.id)
                        }}
                      >
                        Get in touch
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Top Vendors for the Week */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" className="font-bold" sx={{ mb: 3 }}>
            Top Vendors for the week
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {topVendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                sx={{ 
                  minWidth: 200, 
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'segmentColor.main',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }
                }}
                onClick={() => handleVendorClick(vendor.id)}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={vendor.image}
                  alt={vendor.name}
                  sx={{ borderRadius: 0 }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" className="font-bold" sx={{ fontSize: '0.9rem' }}>
                    {vendor.name}
                  </Typography>
                  <Typography variant="body2" className="text-primary-600 mb-1" sx={{ fontSize: '0.8rem' }}>
                    {vendor.category}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={vendor.rating} size="small" readOnly />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {vendor.rating}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Category Quick Access */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" className="font-bold" sx={{ mb: 3 }}>
            Browse by Category
          </Typography>
          <Grid container spacing={2}>
            {vendorCategories.map((category) => (
              <Grid key={category} item xs={6} sm={4} md={3} lg={2}>
                <Card 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'segmentColor.main',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      borderColor: 'primary.main'
                    }
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  <Typography variant="body2" className="font-semibold">
                    {category}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  )
}
