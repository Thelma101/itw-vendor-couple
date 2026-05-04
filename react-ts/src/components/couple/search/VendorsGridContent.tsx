import { Box, Card, Grid, Button, Rating, Chip, IconButton, Skeleton, Typography, Divider } from '@mui/material'
import { FavoriteBorder, Favorite, LocationOn } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface Vendor {
  id: string
  name: string
  category: string
  image: string
  images: string[]
  rating: number
  reviewCount: number
  price: number
  location: string
  featured: boolean
  verified: boolean
  capacity?: string
  features: string[]
  responseTime?: string
  completedBookings?: number
}

interface VendorsGridContentProps {
  loading: boolean
  vendors: Vendor[]
  isShortlisted: (id: string) => boolean
  onToggleShortlist: (vendor: Vendor) => void
  onVendorClick: (vendor: Vendor) => void
  onClearFilters: () => void
}

const formatPrice = (price: number) => `₦${price.toLocaleString()}`

export default function VendorsGridContent({
  loading,
  vendors,
  isShortlisted,
  onToggleShortlist,
  onVendorClick,
  onClearFilters,
}: VendorsGridContentProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={n}>
            <Card sx={{ p: 0 }}>
              <Skeleton variant="rectangular" height={200} />
              <Box sx={{ p: 2 }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Skeleton width="80%" />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  if (vendors.length === 0) {
    return (
      <Card sx={{ p: 6, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 18, color: '#666', mb: 2 }}>No vendors found matching your criteria</Typography>
        <Button
          variant="outlined"
          onClick={onClearFilters}
          sx={{
            textTransform: 'none',
            borderColor: '#00838F',
            color: '#00838F',
          }}
        >
          Clear All Filters
        </Button>
      </Card>
    )
  }

  return (
    <Grid container spacing={3}>
      {vendors.map((vendor) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={vendor.id}>
          <Card
            sx={{
              position: 'relative',
              border: '1px solid #CCFDF2',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,131,143,0.15)',
              },
            }}
          >
            {/* Image */}
            <Box
              sx={{
                height: 200,
                backgroundImage: `url(${vendor.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}
            >
              {vendor.verified && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    bgcolor: '#E0F7FA',
                    color: '#00838F',
                    px: 1.2,
                    py: 0.4,
                    borderRadius: 1,
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.4,
                  }}
                >
                  ✓ Verified
                </Box>
              )}

              {vendor.featured && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    bgcolor: '#FFE082',
                    color: '#F57F17',
                    px: 1.2,
                    py: 0.4,
                    borderRadius: 1,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Featured
                </Box>
              )}

              {/* Shortlist Button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleShortlist(vendor)
                }}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: 'white',
                  '&:hover': { bgcolor: '#FFFFFF' },
                }}
              >
                {isShortlisted(vendor.id) ? <Favorite sx={{ color: '#FF6B6B' }} /> : <FavoriteBorder />}
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    onClick={() => onVendorClick(vendor)}
                    sx={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: '#002528',
                      mb: 0.5,
                      cursor: 'pointer',
                      '&:hover': { color: '#00838F' },
                    }}
                  >
                    {vendor.name}
                  </Typography>
                  <Chip
                    label={vendor.category}
                    size="small"
                    sx={{
                      bgcolor: '#E0F7FA',
                      color: '#00838F',
                      fontSize: 11,
                      height: 20,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <Rating value={vendor.rating} precision={0.1} size="small" readOnly sx={{ color: '#FFC107' }} />
                <Typography sx={{ fontSize: 13, color: '#666' }}>
                  {vendor.rating} ({vendor.reviewCount})
                </Typography>
              </Box>

              <Typography sx={{ fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                <LocationOn sx={{ fontSize: 16 }} /> {vendor.location}
              </Typography>

              {vendor.responseTime && (
                <Typography sx={{ fontSize: 12, color: '#4CAF50', mb: 1 }}>
                  ⚡ Responds in {vendor.responseTime}
                </Typography>
              )}

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#00838F' }}>{formatPrice(vendor.price)}</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(`/couple/vendor/${vendor.id}`)}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#00838F',
                    color: '#00838F',
                    fontSize: 12,
                    '&:hover': {
                      borderColor: '#006064',
                      bgcolor: '#E0F7FA',
                    },
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
