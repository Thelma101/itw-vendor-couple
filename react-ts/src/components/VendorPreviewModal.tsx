import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Rating,
  Chip
} from '@mui/material';
import {
  Close,
  ArrowBackIos,
  ArrowForwardIos,
  FavoriteBorder,
  Favorite,
  MessageOutlined,
  Visibility,
  LocationOn,
  CalendarMonth,
  ShoppingCartCheckout
} from '@mui/icons-material';

export interface VendorPreviewData {
  id: string;
  name: string;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number;
  price: string | number;
  location: string;
  capacity?: string | number;
  negotiable?: boolean;
}

interface VendorPreviewModalProps {
  open: boolean;
  onClose: () => void;
  vendor: VendorPreviewData | null;
  onViewProfile: (vendorId: string, fromPreview?: boolean) => void;
  onMessage: (vendorId: string) => void;
  onFavorite: (vendorId: string) => void;
  onBookNow?: (vendorId: string) => void;
  isFavorite: boolean;
  source?: 'home' | 'search'; // Where the modal was opened from
}

export default function VendorPreviewModal({
  open,
  onClose,
  vendor,
  onViewProfile,
  onMessage,
  onFavorite,
  onBookNow,
  isFavorite,
}: VendorPreviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!vendor) return null;

  const images = vendor.images.length > 0 ? vendor.images : [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'
  ];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return `₦${price.toLocaleString()}`;
    }
    return price;
  };

  const handleViewProfile = () => {
    onClose();
    onViewProfile(vendor.id, true);
  };

  const handleMessage = () => {
    onClose();
    onMessage(vendor.id);
  };

  const handleBookNow = () => {
    // First add to shortlist if not already there
    if (!isFavorite) {
      onFavorite(vendor.id);
    }
    onClose();
    if (onBookNow) {
      onBookNow(vendor.id);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isExpanded ? 'xl' : 'md'}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          maxHeight: isExpanded ? '95vh' : '85vh'
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
          }}
        >
          <Close />
        </IconButton>

        {/* Favorite Button */}
        <IconButton
          onClick={() => onFavorite(vendor.id)}
          sx={{
            position: 'absolute',
            top: 12,
            right: 60,
            zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': { backgroundColor: 'white' }
          }}
        >
          {isFavorite ? (
            <Favorite sx={{ color: '#EB1948' }} />
          ) : (
            <FavoriteBorder sx={{ color: '#666' }} />
          )}
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Image Gallery Section */}
          <Box sx={{ 
            flex: isExpanded ? 2 : 1.2, 
            position: 'relative',
            backgroundColor: '#111'
          }}>
            {/* Main Image */}
            <Box
              sx={{
                height: isExpanded ? '80vh' : 400,
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <img
                src={images[currentImageIndex]}
                alt={`${vendor.name} - Image ${currentImageIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: isExpanded ? 'contain' : 'cover'
                }}
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': { backgroundColor: 'white' }
                    }}
                  >
                    <ArrowBackIos sx={{ fontSize: 20, ml: 1 }} />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': { backgroundColor: 'white' }
                    }}
                  >
                    <ArrowForwardIos sx={{ fontSize: 20 }} />
                  </IconButton>
                </>
              )}

              {/* Image Counter */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 4,
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 13
                }}
              >
                {currentImageIndex + 1} / {images.length}
              </Box>

              {/* Expand Hint */}
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 4,
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 11,
                  cursor: 'pointer'
                }}
              >
                {isExpanded ? 'Click to shrink' : 'Click to expand'}
              </Typography>
            </Box>

            {/* Thumbnail Strip */}
            {images.length > 1 && !isExpanded && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  p: 1.5,
                  backgroundColor: '#f5f5f5',
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': { height: 4 },
                  '&::-webkit-scrollbar-thumb': { 
                    backgroundColor: '#00838F',
                    borderRadius: 2
                  }
                }}
              >
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    sx={{
                      width: 60,
                      height: 60,
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: idx === currentImageIndex ? '2px solid #00838F' : '2px solid transparent',
                      borderRadius: 1,
                      overflow: 'hidden',
                      opacity: idx === currentImageIndex ? 1 : 0.6,
                      transition: 'all 0.2s',
                      '&:hover': { opacity: 1 }
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Vendor Info Section */}
          {!isExpanded && (
            <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
              {/* Category Badge */}
              <Chip
                label={vendor.category}
                size="small"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 2,
                  backgroundColor: '#00838F',
                  color: 'white',
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600
                }}
              />

              {/* Vendor Name */}
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#002528',
                  mb: 1
                }}
              >
                {vendor.name}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={vendor.rating} readOnly precision={0.1} size="small" />
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
                  {vendor.rating}
                </Typography>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                  ({vendor.reviewCount} reviews)
                </Typography>
              </Box>

              {/* Location */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <LocationOn sx={{ fontSize: 18, color: '#00838F' }} />
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>
                  {vendor.location}
                </Typography>
              </Box>

              {/* Divider */}
              <Box sx={{ borderTop: '1px solid #e0e0e0', my: 2 }} />

              {/* Price */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                  Starting Price
                </Typography>
                <Typography sx={{ 
                  fontFamily: "'Open Sans', sans-serif", 
                  fontSize: 28, 
                  fontWeight: 700, 
                  color: '#00838F' 
                }}>
                  {formatPrice(vendor.price)}
                </Typography>
              </Box>

              {/* Capacity */}
              {vendor.capacity && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                  <CalendarMonth sx={{ fontSize: 18, color: '#666' }} />
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>
                    Capacity: {vendor.capacity}
                  </Typography>
                </Box>
              )}

              {/* Negotiable Badge */}
              {vendor.negotiable && (
                <Chip
                  label="Price Negotiable"
                  size="small"
                  variant="outlined"
                  sx={{
                    alignSelf: 'flex-start',
                    mb: 3,
                    borderColor: '#22c55e',
                    color: '#22c55e',
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 11
                  }}
                />
              )}

              {/* Spacer */}
              <Box sx={{ flex: 1 }} />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                {/* Book Now Button - Primary CTA */}
                <Button
                  fullWidth
                  startIcon={<ShoppingCartCheckout />}
                  onClick={handleBookNow}
                  sx={{
                    background: 'linear-gradient(229.87deg, #EB1948 65.18%, #B52344 232.03%)',
                    color: 'white',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  Book Now
                </Button>

                <Button
                  fullWidth
                  startIcon={<Visibility />}
                  onClick={handleViewProfile}
                  sx={{
                    backgroundColor: '#00838F',
                    color: 'white',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#006d75' }
                  }}
                >
                  View Full Profile
                </Button>

                <Button
                  fullWidth
                  startIcon={<MessageOutlined />}
                  onClick={handleMessage}
                  sx={{
                    border: '1.5px solid #00838F',
                    color: '#00838F',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#f0fdfa' }
                  }}
                >
                  Message Vendor
                </Button>

                <Button
                  fullWidth
                  startIcon={isFavorite ? <Favorite sx={{ color: '#EB1948' }} /> : <FavoriteBorder />}
                  onClick={() => onFavorite(vendor.id)}
                  sx={{
                    border: '1.5px solid',
                    borderColor: isFavorite ? '#EB1948' : '#e0e0e0',
                    color: isFavorite ? '#EB1948' : '#666',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#fff5f7' }
                  }}
                >
                  {isFavorite ? 'Remove from Shortlist' : 'Add to Shortlist'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
