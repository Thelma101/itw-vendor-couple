import { Box, Typography, Grid, Card, CardContent, Button, CardMedia, IconButton, Chip, Divider, Rating, Avatar } from '@mui/material'
import { ArrowBack, Favorite, FavoriteBorder, Share, Phone, Message, LocationOn, Star, NavigateBefore, NavigateNext } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { mockVendors, getVendorsByCategory, type Vendor } from '@/data/mockVendors'

export default function VendorDetail() {
  const navigate = useNavigate()
  const { vendorId } = useParams()
  const location = useLocation()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [currentVendorIndex, setCurrentVendorIndex] = useState(0)
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])

  // Mock vendor data with more details and complete addresses
  const vendorDetails = vendor ? {
    ...vendor,
    description: "A premier wedding venue offering elegant spaces for your special day. With over 10 years of experience, we specialize in creating unforgettable moments.",
    services: ["Wedding Ceremony", "Reception", "Cocktail Hour", "Bridal Suite", "Catering"],
    amenities: ["Parking", "Air Conditioning", "Sound System", "Lighting", "Restrooms", "Bridal Room"],
    capacity: "Up to 300 guests",
    fullAddress: getFullAddress(vendor.location, vendor.category),
    images: [
      vendor.image,
      'https://images.unsplash.com/photo-1519167758481-83f2946fead6?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop'
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        comment: "Absolutely beautiful venue! The staff was amazing and everything went perfectly.",
        date: "2 weeks ago",
        avatar: "SJ"
      },
      {
        id: 2,
        name: "Michael Chen",
        rating: 4,
        comment: "Great location and excellent service. Highly recommended!",
        date: "1 month ago",
        avatar: "MC"
      }
    ]
  } : null

  // Helper function to get full address
  function getFullAddress(location: string, category: string): string {
    const addressMap: Record<string, string> = {
      'Ikeja, Lagos': '123 Allen Avenue, Ikeja, Lagos State, Nigeria',
      'Victoria Island, Lagos': '456 Ahmadu Bello Way, Victoria Island, Lagos State, Nigeria',
      'Lekki, Lagos': '789 Admiralty Way, Lekki Phase 1, Lagos State, Nigeria',
      'Ikoyi, Lagos': '321 Bourdillon Road, Ikoyi, Lagos State, Nigeria',
      'Banana Island, Lagos': '654 Banana Island Road, Banana Island, Lagos State, Nigeria',
      'Lagos': '987 Marina Road, Lagos Island, Lagos State, Nigeria'
    }
    return addressMap[location] || `${location}, Lagos State, Nigeria`
  }

  useEffect(() => {
    // Find vendor by ID
    const foundVendor = mockVendors.find(v => v.id === vendorId)
    if (foundVendor) {
      setVendor(foundVendor)
      
      // Get filtered vendors for navigation
      if (location.state?.activeCategory) {
        const filtered = getVendorsByCategory([location.state.activeCategory])
        setFilteredVendors(filtered)
        const index = filtered.findIndex(v => v.id === vendorId)
        setCurrentVendorIndex(index >= 0 ? index : 0)
      }
    }
  }, [vendorId, location.state?.activeCategory])

  // Sync favorites from location state
  useEffect(() => {
    if (location.state?.favourites && vendor) {
      setIsFavorite(location.state.favourites[vendor.id] || false)
    }
  }, [location.state?.favourites, vendor])

  const handleBack = () => {
    // Navigate back to previous page with state
    if (location.state?.returnTo) {
      navigate(location.state.returnTo, { 
        state: {
          selectedCategories: location.state.selectedCategories,
          activeCategory: location.state.activeCategory,
          favourites: location.state.favourites
        }
      })
    } else {
      navigate('/couple/vendor-selection')
    }
  }

  const toggleFavorite = () => {
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    
    // Update favorites in location state
    if (vendor && location.state?.favourites) {
      const updatedFavourites = {
        ...location.state.favourites,
        [vendor.id]: newFavoriteState
      }
      
      // Update the location state
      window.history.replaceState({
        ...location.state,
        favourites: updatedFavourites
      }, '', location.pathname)
    }
  }

  const handleNext = () => {
    if (filteredVendors.length > 0 && currentVendorIndex < filteredVendors.length - 1) {
      const nextVendor = filteredVendors[currentVendorIndex + 1]
      navigate(`/couple/vendor/${nextVendor.id}`, {
        state: {
          ...location.state,
          returnTo: location.state?.returnTo || '/couple/vendor-selection'
        }
      })
    }
  }

  const handlePrevious = () => {
    if (filteredVendors.length > 0 && currentVendorIndex > 0) {
      const prevVendor = filteredVendors[currentVendorIndex - 1]
      navigate(`/couple/vendor/${prevVendor.id}`, {
        state: {
          ...location.state,
          returnTo: location.state?.returnTo || '/couple/vendor-selection'
        }
      })
    }
  }

  if (!vendor || !vendorDetails) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Vendor not found</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          <ArrowBack sx={{ mr: 1 }} />
          Go Back
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'bgThemeColor.main', p: 4 }}>
      {/* Header with back button and navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" className="font-bold">
            {vendor.name}
          </Typography>
        </Box>
        
        {/* Next/Previous Navigation */}
        {filteredVendors.length > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={handlePrevious}
              disabled={currentVendorIndex === 0}
              sx={{ 
                bgcolor: currentVendorIndex === 0 ? 'grey.200' : 'white',
                '&:hover': { bgcolor: currentVendorIndex === 0 ? 'grey.200' : 'grey.100' }
              }}
            >
              <NavigateBefore />
            </IconButton>
            <Typography variant="body2" sx={{ mx: 1 }}>
              {currentVendorIndex + 1} of {filteredVendors.length}
            </Typography>
            <IconButton 
              onClick={handleNext}
              disabled={currentVendorIndex === filteredVendors.length - 1}
              sx={{ 
                bgcolor: currentVendorIndex === filteredVendors.length - 1 ? 'grey.200' : 'white',
                '&:hover': { bgcolor: currentVendorIndex === filteredVendors.length - 1 ? 'grey.200' : 'grey.100' }
              }}
            >
              <NavigateNext />
            </IconButton>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Images and Details */}
        <Grid item xs={12} md={8}>
          {/* Main Image */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardMedia
              component="img"
              height="400"
              image={vendorDetails.images[selectedImage]}
              alt={vendor.name}
              sx={{ borderRadius: 2 }}
            />
          </Card>

          {/* Image Thumbnails */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto' }}>
            {vendorDetails.images.map((image, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 80,
                  height: 60,
                  cursor: 'pointer',
                  border: selectedImage === index ? '2px solid' : '1px solid',
                  borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                  borderRadius: 1
                }}
                onClick={() => setSelectedImage(index)}
              >
                <CardMedia
                  component="img"
                  height="60"
                  image={image}
                  alt={`${vendor.name} ${index + 1}`}
                  sx={{ borderRadius: 1 }}
                />
              </Card>
            ))}
          </Box>

          {/* Description */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" className="font-bold" sx={{ mb: 2 }}>
              About {vendor.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {vendorDetails.description}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Capacity: {vendorDetails.capacity}
            </Typography>
          </Card>

          {/* Services */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" className="font-bold" sx={{ mb: 2 }}>
              Services Offered
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {vendorDetails.services.map((service, index) => (
                <Chip key={index} label={service} color="primary" variant="outlined" />
              ))}
            </Box>
          </Card>

          {/* Amenities */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" className="font-bold" sx={{ mb: 2 }}>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {vendorDetails.amenities.map((amenity, index) => (
                <Chip key={index} label={amenity} variant="outlined" />
              ))}
            </Box>
          </Card>

          {/* Reviews */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" className="font-bold" sx={{ mb: 2 }}>
              Reviews ({vendor.reviewCount})
            </Typography>
            {vendorDetails.reviews.map((review) => (
              <Box key={review.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {review.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" className="font-bold">
                      {review.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={review.rating} size="small" readOnly />
                      <Typography variant="caption" sx={{ ml: 1, color: 'grey.600' }}>
                        {review.date}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ ml: 7 }}>
                  {review.comment}
                </Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Right Column - Booking Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" className="font-bold text-primary-600">
                {vendor.price}
              </Typography>
              <IconButton onClick={toggleFavorite}>
                {isFavorite ? (
                  <Favorite sx={{ color: '#ef4444' }} />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={vendor.rating} readOnly size="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {vendor.rating} ({vendor.reviewCount} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <LocationOn sx={{ fontSize: 16, color: 'grey.600', mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" className="font-semibold">
                  {vendor.location}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  {vendorDetails.fullAddress}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              Request Quote
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 2, py: 1.5, textTransform: 'none' }}
              startIcon={<Message />}
            >
              Send Message
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ py: 1.5, textTransform: 'none' }}
              startIcon={<Phone />}
            >
              Call Vendor
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <IconButton>
                <Share />
              </IconButton>
              <Typography variant="caption" className="text-gray-600">
                Share this vendor
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}