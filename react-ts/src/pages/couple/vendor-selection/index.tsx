import { Box, Typography, Grid, Card, CardContent, Checkbox, FormControlLabel, List, ListItem, Chip, Button, CardMedia, IconButton } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { VendorBlankIcon } from '@/components/icons/VendorBlankIcon'
import { VendorBlank2Icon } from '@/components/icons/VendorBlank2Icon'
import { getVendorsByCategory } from '@/data/mockVendors'

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

export default function VendorSelection() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [favourites, setFavorites] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  
  // Restore state from navigation if coming back
  useEffect(() => {
    if (location.state) {
      const { selectedCategories: savedCategories, activeCategory: savedActive, favourites: savedFavs } = location.state
      if (savedCategories) setSelectedCategories(savedCategories)
      if (savedActive) setActiveCategory(savedActive)
      if (savedFavs) setFavorites(savedFavs)
    }
  }, [location.state])
  
  // Get filtered vendors based on active category or first selected
  const currentCategory = activeCategory || (selectedCategories.length > 0 ? selectedCategories[0] : null)
  const allFilteredVendors = currentCategory ? getVendorsByCategory([currentCategory]) : []
  const displayedVendors = showAll ? allFilteredVendors : allFilteredVendors.slice(0, 10)

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
    // Set as active category when selected
    if (!selectedCategories.includes(category)) {
      setActiveCategory(category)
    }
  }
  
  const toggleFav = (id: string) => {
    setFavorites(p => ({ ...p, [id]: !p[id] }))
  }
  
  const handleCardClick = (vendorId: string) => {
    // Save current state to location state for back navigation
    navigate(`/couple/vendor/${vendorId}`, {
      state: {
        returnTo: location.pathname,
        selectedCategories,
        activeCategory,
        favourites
      }
    })
  }

  const handleViewAll = () => {
    setShowAll(!showAll)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }} gap={2} p={4} bgcolor={'bgThemeColor.main'}>
      {/* Left Sidebar - Vendor Categories */}
      <Box
        sx={{
          width: { xs: '100%', md: 300 },
          bgcolor: 'white',
          border: '1px solid',
          borderColor: 'segmentColor.main',
          p: 4,
          display: { xs: selectedCategories.length === 0 ? 'block' : 'none', md: 'block' }
        }}
      >
        <Typography variant="h6" className="font-bold text-gray-800 mb-4">
          Select Vendors
        </Typography>

        <List sx={{ p: 0 }}>
          {vendorCategories.map((category) => (
            <ListItem key={category} sx={{ px: 1.5, py: .3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    sx={{
                      '&.Mui-checked': { color: 'primary.main', borderRadius: '50%', border: '1px solid', borderColor: 'primary.main' }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" className="text-gray-700">
                    {category}
                  </Typography>
                }
                sx={{ width: '100%' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content Area */}
      <Box sx={{
        flexGrow: 1, height: '100%', p: 4, bgcolor: 'white', border: '1px solid', borderColor: 'segmentColor.main'
      }}>
        {selectedCategories.length === 0 ? (
          // No vendors selected state
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}
          >
            {/* Icon */}
            <Box sx={{ mb: 3, position: 'relative', width: 80, height: 80 }}>
              {/* First card (behind) - rotated -15deg */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 0,
                  transform: 'rotate(-5deg)',
                  opacity: 1,
                  zIndex: 2
                }}
              >
                <VendorBlankIcon width={60} height={60} />
              </Box>

              {/* Second card (front) - rotated 15deg */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 20,
                  transform: 'rotate(5deg)',
                  opacity: 1,
                  zIndex: 1
                }}
              >
                <VendorBlank2Icon width={60} height={60} />
              </Box>
            </Box>

            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
              No Vendor Selected
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Kindly Select the vendors you want
            </Typography>
          </Box>
        ) : (
          // Selected vendors display
          <Box>
            {/* Fixed Header with View in Cart - doesn't move */}
            <Box sx={{
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              bgColor: 'white',
              borderBottom: '1px solid',
              width: '100%',
              borderColor: 'segmentColor.main',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              p: 2
            }}>
              {/* Category tabs */}
              <Box sx={{
                flexGrow: 1, 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                alignItems: 'center'
              }}>
                {selectedCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setActiveCategory(category)}
                    variant={activeCategory === category ? 'filled' : 'outlined'}
                    sx={{
                      bgcolor: activeCategory === category ? 'callToAction.main' : 'primary.50',
                      color: activeCategory === category ? 'white' : 'primary.main',
                      borderRadius: '30px',
                      border: '1px solid',
                      borderColor: 'segmentColor.main',
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 2 }}>
                <Button 
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 8,
                    fontWeight: 600,
                    textTransform: 'none',
                    minWidth: 120,
                    '&:hover': {
                      filter: 'brightness(0.95)',
                    },
                  }}
                >
                  View in Cart
                </Button>
              </Box>
            </Box>

            {/* Header with title and actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
              <Box>
                <Typography variant="h4" className="font-bold">
                  {allFilteredVendors.length} {currentCategory || 'Vendor'}s
                </Typography>
                <Typography variant="body1" className="text-gray-600">Lagos, Nigeria</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" className="text-primary-600 cursor-pointer">Filter</Typography>
              </Box>
            </Box>

            {/* Vendor grid - 5 per row on desktop, responsive */}
            <Grid container spacing={2}>
              {displayedVendors.map((vendor) => (
                <Grid key={vendor.id} item xs={6} sm={4} md={2.4} component="div">
                  <Card 
                    sx={{ 
                      height: '100%', 
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'segmentColor.main',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                    onClick={() => handleCardClick(vendor.id)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="170"
                        width="170"
                        image={vendor.image}
                        alt={vendor.name}
                        sx={{ 
                          borderRadius: 0,
                          width: '100%',
                          height: 170,
                          objectFit: 'cover'
                        }}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFav(vendor.id)
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
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="body2" className="font-bold" sx={{ fontSize: '0.875rem' }}>
                        {vendor.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="body2" className="text-primary-600 font-semibold" sx={{ fontSize: '0.75rem' }}>
                          {vendor.price}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500" sx={{ fontSize: '0.625rem' }}>
                          {vendor.location}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* View All / Show Less button */}
            {allFilteredVendors.length > 10 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleViewAll}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      color: 'primary.dark',
                    }
                  }}
                >
                  {showAll ? 'Show Less' : `View All ${allFilteredVendors.length} Vendors`}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}