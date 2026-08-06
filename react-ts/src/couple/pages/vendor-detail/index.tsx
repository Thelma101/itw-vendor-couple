import { Box, Typography, Grid, Card, Button, CardMedia, IconButton, Chip, Rating, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, LinearProgress } from '@mui/material'
import { ArrowBack, Favorite, FavoriteBorder, Share, Phone, Message, LocationOn, Star, NavigateBefore, NavigateNext, RateReview, ThumbUp, VerifiedUser } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { mockVendors, getVendorsByCategory, type Vendor } from '@/shared/data/mockVendors'

export default function VendorDetail() {
  const navigate = useNavigate()
  const { vendorId } = useParams()
  const location = useLocation()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [currentVendorIndex, setCurrentVendorIndex] = useState(0)
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', title: '' })
  const [reviews, setReviews] = useState<Array<{ id: number; name: string; rating: number; comment: string; date: string; avatar: string; title?: string; helpful?: number; verified?: boolean }>>([
    { id: 1, name: "Sarah Johnson", rating: 5, title: "Absolutely stunning venue!", comment: "The staff was amazing and everything went perfectly. Would highly recommend for any wedding.", date: "2 weeks ago", avatar: "SJ", helpful: 12, verified: true },
    { id: 2, name: "Michael Chen", rating: 4, title: "Great experience overall", comment: "Great location and excellent service. A few minor hiccups but overall highly recommended!", date: "1 month ago", avatar: "MC", helpful: 8, verified: true },
    { id: 3, name: "Amara Okafor", rating: 5, title: "Made our dream wedding a reality", comment: "From the first meeting to the big day, everything was perfect. The attention to detail was incredible.", date: "2 months ago", avatar: "AO", helpful: 15, verified: true },
  ])

  // Mock vendor data with more details and complete addresses
  const vendorDetails = vendor ? {
    ...vendor,
    description: "A premier wedding venue offering elegant spaces for your special day. With over 10 years of experience, we specialize in creating unforgettable moments.",
    services: ["Wedding Ceremony", "Reception", "Cocktail Hour", "Bridal Suite", "Catering"],
    amenities: ["Parking", "Air Conditioning", "Sound System", "Lighting", "Restrooms", "Bridal Room"],
    capacity: "Up to 300 guests",
    fullAddress: getFullAddress(vendor.location),
    images: [
      vendor.image,
      'https://images.unsplash.com/photo-1519167758481-83f2946fead6?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop'
    ],
  } : null

  // Calculate rating breakdown
  const ratingBreakdown = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }
  const avgRating = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0

  const handleSubmitReview = () => {
    const review = {
      id: Date.now(),
      name: "You",
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: "Just now",
      avatar: "ME",
      helpful: 0,
      verified: false,
    }
    setReviews([review, ...reviews])
    setNewReview({ rating: 5, comment: '', title: '' })
    setReviewDialogOpen(false)
  }

  const handleHelpful = (reviewId: number) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r))
  }

  // Helper function to get full address
  function getFullAddress(location: string): string {
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
        <Grid size={{ xs: 12, md: 8 }}>
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

          {/* Reviews Section - Enhanced */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" className="font-bold">
                Reviews ({reviews.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<RateReview />}
                onClick={() => setReviewDialogOpen(true)}
                sx={{ bgcolor: '#EB1948', '&:hover': { bgcolor: '#c41438' }, textTransform: 'none' }}
              >
                Write a Review
              </Button>
            </Box>

            {/* Rating Summary */}
            <Box sx={{ display: 'flex', gap: 4, mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} color="#00838F">{avgRating.toFixed(1)}</Typography>
                <Rating value={avgRating} readOnly precision={0.1} />
                <Typography variant="body2" color="text.secondary">{reviews.length} reviews</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map(star => (
                  <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ width: 20 }}>{star}</Typography>
                    <Star sx={{ fontSize: 16, color: '#F5A623' }} />
                    <LinearProgress
                      variant="determinate"
                      value={reviews.length > 0 ? (ratingBreakdown[star as keyof typeof ratingBreakdown] / reviews.length) * 100 : 0}
                      sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#F5A623' } }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ width: 20 }}>
                      {ratingBreakdown[star as keyof typeof ratingBreakdown]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Individual Reviews */}
            {reviews.map((review) => (
              <Box key={review.id} sx={{ mb: 3, pb: 3, borderBottom: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 2, bgcolor: review.name === 'You' ? '#EB1948' : '#00838F' }}>
                    {review.avatar}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {review.name}
                      </Typography>
                      {review.verified && (
                        <Chip icon={<VerifiedUser sx={{ fontSize: 14 }} />} label="Verified Booking" size="small" sx={{ height: 20, fontSize: 10, bgcolor: '#e8f5e9', color: '#2e7d32' }} />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={review.rating} size="small" readOnly />
                      <Typography variant="caption" sx={{ ml: 1, color: 'grey.600' }}>
                        {review.date}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {review.title && (
                  <Typography variant="subtitle2" fontWeight={600} sx={{ ml: 7, mb: 0.5 }}>
                    {review.title}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ ml: 7, color: 'text.secondary' }}>
                  {review.comment}
                </Typography>
                <Box sx={{ ml: 7, mt: 1 }}>
                  <Button
                    size="small"
                    startIcon={<ThumbUp sx={{ fontSize: 14 }} />}
                    onClick={() => handleHelpful(review.id)}
                    sx={{ textTransform: 'none', color: 'text.secondary' }}
                  >
                    Helpful ({review.helpful || 0})
                  </Button>
                </Box>
              </Box>
            ))}
          </Card>

          {/* Write Review Dialog */}
          <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Box>
                  <Typography gutterBottom>Your Rating</Typography>
                  <Rating
                    value={newReview.rating}
                    onChange={(_, value) => setNewReview(prev => ({ ...prev, rating: value || 5 }))}
                    size="large"
                  />
                </Box>
                <TextField
                  label="Review Title"
                  fullWidth
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summarize your experience"
                />
                <TextField
                  label="Your Review"
                  fullWidth
                  multiline
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Tell others about your experience with this vendor..."
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSubmitReview}
                disabled={!newReview.comment}
                sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' } }}
              >
                Submit Review
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>

        {/* Right Column - Booking Card */}
        <Grid size={{ xs: 12, md: 4 }}>
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