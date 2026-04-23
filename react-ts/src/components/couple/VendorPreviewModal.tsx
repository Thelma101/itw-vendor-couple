import { Box, Button, Chip, Dialog, IconButton, Rating, Stack, Typography } from '@mui/material'
import { Close, Favorite, FavoriteBorder, LocationOn, ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'

interface VendorModalProps {
  open: boolean
  onClose: () => void
  vendor: {
    id: string
    name: string
    category: string
    image: string
    rating: number
    reviewCount: number
    location: string
    price: string
  } | null
  isInShortlist: boolean
  onAddToShortlist: () => void
  onRemoveFromShortlist: () => void
  onPrevVendor: () => void
  onNextVendor: () => void
  canGoPrev: boolean
  canGoNext: boolean
}

export default function VendorPreviewModal({
  open,
  onClose,
  vendor,
  isInShortlist,
  onAddToShortlist,
  onRemoveFromShortlist,
  onPrevVendor,
  onNextVendor,
  canGoPrev,
  canGoNext,
}: VendorModalProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const images = [vendor?.image || '', vendor?.image || '', vendor?.image || ''] // Demo: use same image 3 times

  if (!vendor) return null

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          zIndex: 1301,
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1300,
          },
        },
      }}
    >
      <Box sx={{ position: 'relative', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, minHeight: { xs: 'auto', md: '600px' }, bgcolor: '#F8FAFC' }}>
        {/* Left Arrow - Outer */}
        {canGoPrev && (
          <IconButton
            onClick={onPrevVendor}
            sx={{
              position: 'absolute',
              left: { xs: 8, md: -60 },
              bottom: { xs: 80, md: 'auto' },
              top: { xs: 'auto', md: '50%' },
              transform: { xs: 'none', md: 'translateY(-50%)' },
              bgcolor: '#00838F',
              color: '#fff',
              zIndex: 1302,
              '&:hover': { bgcolor: '#006670' },
            }}
            title="Previous vendor"
          >
            <ChevronLeft sx={{ fontSize: { xs: 24, md: 32 } }} />
          </IconButton>
        )}

        {/* Image Section - Left */}
        <Box sx={{ position: 'relative', height: { xs: 300, md: '100%' }, bgcolor: '#E2E8F0', overflow: 'hidden' }}>
          <Box component="img" src={images[imageIndex]} alt={vendor.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />

          {/* Image Counter */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              px: 1.2,
              py: 0.5,
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {imageIndex + 1} / {images.length}
          </Box>

          {/* Navigation Arrows */}
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: '#fff',
              '&:hover': { bgcolor: '#f0f0f0' },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: '#fff',
              '&:hover': { bgcolor: '#f0f0f0' },
            }}
          >
            <ChevronRight />
          </IconButton>

          {/* Thumbnail Navigation */}
          <Stack
            direction="row"
            spacing={0.8}
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {images.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setImageIndex(idx)}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: idx === imageIndex ? '3px solid #00838F' : '1px solid #E2E8F0',
                  opacity: idx === imageIndex ? 1 : 0.6,
                  transition: 'all 0.2s',
                }}
              >
                <Box component="img" src={images[idx]} alt={`Thumbnail ${idx + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Content Section - Right */}
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'auto', maxHeight: { xs: 'auto', md: '600px' }, bgcolor: '#fff' }}>
          {/* Header */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Chip
                label={vendor.category}
                sx={{
                  borderRadius: 1.5,
                  bgcolor: '#00838F',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
              <IconButton onClick={onClose} sx={{ width: 36, height: 36 }}>
                <Close sx={{ fontSize: 20, color: '#334155' }} />
              </IconButton>
            </Box>

            {/* Name */}
            <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 800, color: '#0F172A', mb: 1 }}>{vendor.name}</Typography>

            {/* Rating */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <Rating value={vendor.rating} readOnly precision={0.1} />
              <Typography sx={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                {vendor.rating} ({vendor.reviewCount} reviews)
              </Typography>
            </Stack>

            {/* Location */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <LocationOn sx={{ fontSize: 18, color: '#0F766E' }} />
              <Typography sx={{ fontSize: 13, color: '#0F172A' }}>{vendor.location}</Typography>
            </Stack>

            {/* Price */}
            <Box sx={{ mb: 1.2, pb: 1.2, borderBottom: '1px solid #EDF2F7' }}>
              <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, mb: 0.5 }}>Starting Price</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#0F766E' }}>{vendor.price}</Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack spacing={1.2}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2.5,
                bgcolor: '#EB1948',
                py: 1.2,
                fontSize: 14,
                '&:hover': { bgcolor: '#D41438' },
              }}
            >
              Book Now
            </Button>

            <Button
              variant="contained"
              fullWidth
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2.5,
                bgcolor: '#00838F',
                py: 1.2,
                fontSize: 14,
                '&:hover': { bgcolor: '#006670' },
              }}
            >
              View Full Profile
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2.5,
                borderColor: '#00838F',
                color: '#00838F',
                py: 1.2,
                fontSize: 14,
              }}
            >
              Message Vendor
            </Button>

            <Button
              variant="text"
              fullWidth
              startIcon={isInShortlist ? <Favorite sx={{ color: '#EB1948' }} /> : <FavoriteBorder />}
              onClick={() => {
                if (isInShortlist) onRemoveFromShortlist()
                else onAddToShortlist()
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                color: isInShortlist ? '#EB1948' : '#0F172A',
                py: 1,
              }}
            >
              {isInShortlist ? 'Remove from Shortlist' : 'Add to Shortlist'}
            </Button>
          </Stack>
        </Box>

        {/* Right Arrow - Outer */}
        {canGoNext && (
          <IconButton
            onClick={onNextVendor}
            sx={{
              position: 'absolute',
              right: { xs: 8, md: -60 },
              bottom: { xs: 80, md: 'auto' },
              top: { xs: 'auto', md: '50%' },
              transform: { xs: 'none', md: 'translateY(-50%)' },
              bgcolor: '#00838F',
              color: '#fff',
              zIndex: 1302,
              '&:hover': { bgcolor: '#006670' },
            }}
            title="Next vendor"
          >
            <ChevronRight sx={{ fontSize: { xs: 24, md: 32 } }} />
          </IconButton>
        )}
      </Box>
    </Dialog>
  )
}
