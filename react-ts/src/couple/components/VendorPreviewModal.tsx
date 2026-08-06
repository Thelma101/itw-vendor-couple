import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Chip, Dialog, IconButton, Rating, Stack, Typography } from '@mui/material'
import {
  Close,
  Favorite,
  FavoriteBorder,
  LocationOn,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from '@mui/icons-material'

interface VendorModalProps {
  open: boolean
  onClose: () => void
  vendor: {
    id: string
    name: string
    category: string
    image: string
    images?: string[]
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
  const navigate = useNavigate()
  const [imageIndex, setImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const images =
    vendor?.images && vendor.images.length > 0
      ? vendor.images
      : [vendor?.image || '', vendor?.image || '', vendor?.image || ''].filter(Boolean)

  useEffect(() => {
    setImageIndex(0)
  }, [vendor?.id])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (e.shiftKey) onPrevVendor()
        else setImageIndex((prev) => (prev === 0 ? Math.max(images.length - 1, 0) : prev - 1))
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (e.shiftKey) onNextVendor()
        else setImageIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1))
      }
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, images.length, onClose, onNextVendor, onPrevVendor])

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
      PaperProps={{ sx: { borderRadius: 4, zIndex: 1301 } }}
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
      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          minHeight: { xs: 'auto', md: '600px' },
          bgcolor: '#F8FAFC',
        }}
      >
        {canGoPrev && (
          <IconButton
            onClick={onPrevVendor}
            aria-label="Previous vendor"
            sx={{
              position: 'absolute',
              left: { xs: 8, md: -60 },
              bottom: { xs: 80, md: 'auto' },
              top: { xs: 'auto', md: '50%' },
              transform: { xs: 'none', md: 'translateY(-50%)' },
              bgcolor: '#0F766E',
              color: '#fff',
              zIndex: 1302,
              '&:hover': { bgcolor: '#0D9488' },
            }}
          >
            <ChevronLeft sx={{ fontSize: { xs: 24, md: 32 } }} />
          </IconButton>
        )}

        <Box sx={{ position: 'relative', height: { xs: 300, md: '100%' }, bgcolor: '#E2E8F0', overflow: 'hidden' }}>
          <Box
            component="img"
            src={images[imageIndex] || vendor.image}
            alt={vendor.name}
            onClick={() => setLightboxOpen(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
          />

          <IconButton
            onClick={() => setLightboxOpen(true)}
            aria-label="Enlarge photo"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'rgba(255,255,255,0.92)',
              '&:hover': { bgcolor: '#fff' },
            }}
          >
            <ZoomIn />
          </IconButton>

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
            {imageIndex + 1} / {Math.max(images.length, 1)}
          </Box>

          <IconButton
            onClick={handlePrevImage}
            aria-label="Previous photo"
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
            aria-label="Next photo"
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

          <Stack
            direction="row"
            spacing={0.8}
            sx={{ position: 'absolute', bottom: 12, left: 12, display: { xs: 'none', md: 'flex' } }}
          >
            {images.map((src, idx) => (
              <Box
                key={`${src}-${idx}`}
                onClick={() => setImageIndex(idx)}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: idx === imageIndex ? '3px solid #0F766E' : '1px solid #E2E8F0',
                  opacity: idx === imageIndex ? 1 : 0.6,
                }}
              >
                <Box component="img" src={src} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'auto',
            maxHeight: { xs: 'auto', md: '600px' },
            bgcolor: '#fff',
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Chip
                label={vendor.category}
                sx={{ borderRadius: 1.5, bgcolor: '#0F766E', color: '#fff', fontWeight: 700, fontSize: 12 }}
              />
              <IconButton onClick={onClose} sx={{ width: 36, height: 36 }}>
                <Close sx={{ fontSize: 20, color: '#334155' }} />
              </IconButton>
            </Box>

            <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 800, color: '#0F172A', mb: 1 }}>
              {vendor.name}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <Rating value={vendor.rating} readOnly precision={0.1} />
              <Typography sx={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                {vendor.rating} ({vendor.reviewCount} reviews)
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <LocationOn sx={{ fontSize: 18, color: '#0F766E' }} />
              <Typography sx={{ fontSize: 13, color: '#0F172A' }}>{vendor.location}</Typography>
            </Stack>

            <Box sx={{ mb: 1.2, pb: 1.2, borderBottom: '1px solid #EDF2F7' }}>
              <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, mb: 0.5 }}>Starting Price</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#0F766E' }}>{vendor.price}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
              Tip: ← → photos · Shift+← → vendors
            </Typography>
          </Box>

          <Stack spacing={1.2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onClose()
                navigate(
                  `/couple/booking?vendorId=${vendor.id}&vendorName=${encodeURIComponent(vendor.name)}`,
                )
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2.5,
                bgcolor: '#EB1948',
                py: 1.2,
                '&:hover': { bgcolor: '#D41438' },
              }}
            >
              Book Now
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onClose()
                navigate(`/couple/vendor/${vendor.id}`)
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2.5,
                bgcolor: '#0F766E',
                py: 1.2,
                '&:hover': { bgcolor: '#0D9488' },
              }}
            >
              View Full Profile
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                onClose()
                navigate(`/couple/messages?vendor=${encodeURIComponent(vendor.name)}`)
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2.5,
                borderColor: '#0F766E',
                color: '#0F766E',
                py: 1.2,
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

        {canGoNext && (
          <IconButton
            onClick={onNextVendor}
            aria-label="Next vendor"
            sx={{
              position: 'absolute',
              right: { xs: 8, md: -60 },
              bottom: { xs: 80, md: 'auto' },
              top: { xs: 'auto', md: '50%' },
              transform: { xs: 'none', md: 'translateY(-50%)' },
              bgcolor: '#0F766E',
              color: '#fff',
              zIndex: 1302,
              '&:hover': { bgcolor: '#0D9488' },
            }}
          >
            <ChevronRight sx={{ fontSize: { xs: 24, md: 32 } }} />
          </IconButton>
        )}
      </Box>

      {/* Fullscreen lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth={false}
        fullScreen
        PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.94)' } }}
      >
        <IconButton
          onClick={() => setLightboxOpen(false)}
          sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', zIndex: 2 }}
          aria-label="Close enlarged photo"
        >
          <Close />
        </IconButton>
        <IconButton
          onClick={handlePrevImage}
          sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff', bgcolor: 'rgba(255,255,255,0.12)' }}
        >
          <ChevronLeft fontSize="large" />
        </IconButton>
        <IconButton
          onClick={handleNextImage}
          sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff', bgcolor: 'rgba(255,255,255,0.12)' }}
        >
          <ChevronRight fontSize="large" />
        </IconButton>
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            p: { xs: 2, md: 6 },
          }}
        >
          <Box
            component="img"
            src={images[imageIndex] || vendor.image}
            alt={vendor.name}
            sx={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 1 }}
          />
        </Box>
        <Typography
          sx={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          {imageIndex + 1} / {Math.max(images.length, 1)} · {vendor.name}
        </Typography>
      </Dialog>
    </Dialog>
  )
}
