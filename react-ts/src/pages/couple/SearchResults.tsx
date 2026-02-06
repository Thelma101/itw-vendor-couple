import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Rating,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  ArrowBack, 
  Search, 
  FilterList, 
  LocationOn, 
  FavoriteBorder, 
  Favorite,
  ArrowBackIos,
  ArrowForwardIos,
  GridView,
  ViewList,
  Map as MapIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage
} from '@mui/icons-material';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useShortlist } from '../../contexts/ShortlistContext';
import VendorPreviewModal from '../../components/VendorPreviewModal';
import type { VendorPreviewData } from '../../components/VendorPreviewModal';

// Mock vendor data with multiple images
const allVendors = [
  {
    id: '1',
    name: 'Rosevet Event Center',
    category: 'Venue',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
    ],
    rating: 4.9,
    reviewCount: 234,
    price: 500000,
    location: 'Ikeja, Lagos',
    featured: true,
    capacity: '500 guests'
  },
  {
    id: '2',
    name: 'Regina Ugwu Photography',
    category: 'Photographer',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600',
    images: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    ],
    rating: 4.8,
    reviewCount: 127,
    price: 150000,
    location: 'Ikeja, Lagos',
    featured: true,
    capacity: null
  },
  {
    id: '3',
    name: 'Adaeze Flowers & Decor',
    category: 'Florist',
    image: 'https://images.unsplash.com/photo-1522653216850-4699c7e43a3a?w=600',
    images: [
      'https://images.unsplash.com/photo-1522653216850-4699c7e43a3a?w=800',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    ],
    rating: 4.7,
    reviewCount: 89,
    price: 80000,
    location: 'Victoria Island, Lagos',
    featured: false,
    capacity: null
  },
  {
    id: '4',
    name: 'Divine Catering Services',
    category: 'Catering',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600',
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    ],
    rating: 4.6,
    reviewCount: 156,
    price: 300000,
    location: 'Lekki, Lagos',
    featured: true,
    capacity: '200+ guests'
  },
  {
    id: '5',
    name: 'Emerald Gardens Venue',
    category: 'Venue',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600',
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    ],
    rating: 4.5,
    reviewCount: 98,
    price: 400000,
    location: 'Ikoyi, Lagos',
    featured: false,
    capacity: '300 guests'
  },
  {
    id: '6',
    name: 'Sugar Rush Cakes',
    category: 'Cake',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600',
    images: [
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800',
    ],
    rating: 4.9,
    reviewCount: 201,
    price: 120000,
    location: 'Surulere, Lagos',
    featured: true,
    capacity: null
  },
  {
    id: '7',
    name: 'Denver Music Crew',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600',
    images: [
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 250000,
    location: 'Idumota, Lagos',
    featured: false,
    capacity: null
  },
  {
    id: '8',
    name: 'Dove Cars Nig Ltd',
    category: 'Car Rental',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
    ],
    rating: 4.4,
    reviewCount: 67,
    price: 180000,
    location: 'Yaba, Lagos',
    featured: false,
    capacity: null
  },
  {
    id: '9',
    name: 'Glam by Tola',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
      'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800',
    ],
    rating: 4.8,
    reviewCount: 312,
    price: 100000,
    location: 'Lekki, Lagos',
    featured: true,
    capacity: null
  }
];

const categories = ['All', 'Venue', 'Photographer', 'Florist', 'Catering', 'Cake', 'Music', 'Car Rental', 'Makeup'];
const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Highest Rated', 'Most Reviews'];

// Image Carousel Component for vendor cards
function ImageCarousel({ 
  images, 
  onExpand 
}: { 
  images: string[]; 
  onExpand: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ position: 'relative', height: 200 }}>
      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: 'pointer'
        }}
        onClick={onExpand}
      />
      
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.85)',
              width: 28,
              height: 28,
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <ArrowBackIos sx={{ fontSize: 14, ml: 0.5 }} />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.85)',
              width: 28,
              height: 28,
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <ArrowForwardIos sx={{ fontSize: 14 }} />
          </IconButton>
        </>
      )}
      
      {/* Dots indicator */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5
          }}
        >
          {images.map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
            />
          ))}
        </Box>
      )}

      {/* Photo count badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          px: 1,
          py: 0.3,
          borderRadius: 1,
          fontSize: 10,
          fontFamily: "'Open Sans', sans-serif"
        }}
      >
        {currentIndex + 1} / {images.length}
      </Box>
    </Box>
  );
}

export default function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  
  const { addToShortlist, removeFromShortlist, isInShortlist } = useShortlist();
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('Recommended');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // View type state: 'grid' | 'list' | 'map'
  const [viewType, setViewType] = useState<'grid' | 'list' | 'map'>('grid');
  
  // Grid columns state (for grid view)
  const [gridColumns, setGridColumns] = useState(4);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorPreviewData | null>(null);

  // Handle reopening modal when returning from vendor profile
  useEffect(() => {
    if (location.state?.reopenPreview && location.state?.vendorId) {
      const vendorId = location.state.vendorId;
      const vendor = allVendors.find(v => v.id === vendorId);
      if (vendor) {
        setSelectedVendor({
          id: vendor.id,
          name: vendor.name,
          category: vendor.category,
          images: vendor.images,
          rating: vendor.rating,
          reviewCount: vendor.reviewCount,
          price: vendor.price,
          location: vendor.location,
          capacity: vendor.capacity || undefined,
        });
        setPreviewOpen(true);
        // Clear the state to prevent reopening on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  // Filter and sort vendors
  const filteredVendors = allVendors
    .filter(vendor => {
      const matchesCategory = selectedCategory === 'All' || vendor.category === selectedCategory;
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vendor.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Highest Rated':
          return b.rating - a.rating;
        case 'Most Reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return b.featured ? 1 : -1;
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExpandCarousel = (vendor: typeof allVendors[0]) => {
    setSelectedVendor({
      id: vendor.id,
      name: vendor.name,
      category: vendor.category,
      images: vendor.images,
      rating: vendor.rating,
      reviewCount: vendor.reviewCount,
      price: vendor.price,
      location: vendor.location,
      capacity: vendor.capacity || undefined,
    });
    setPreviewOpen(true);
  };

  const handleViewProfile = (vendorId: string, fromPreview?: boolean) => {
    navigate(`/couple/vendor/${vendorId}`, {
      state: fromPreview ? { fromPreview: true, source: 'search', vendorId } : undefined
    });
  };

  const handleMessage = (vendorId: string) => {
    navigate('/couple/messages', { state: { vendorId } });
  };

  const handleBookNow = (vendorId: string) => {
    const vendor = allVendors.find(v => v.id === vendorId);
    if (!vendor) return;
    
    // Add to shortlist if not already there
    if (!isInShortlist(vendorId)) {
      addToShortlist({
        id: vendor.id,
        name: vendor.name,
        price: vendor.price,
        category: vendor.category,
        image: vendor.image
      });
    }
    // Navigate to booking page
    navigate('/couple/booking');
  };

  const handleFavorite = (vendorId: string) => {
    const vendor = allVendors.find(v => v.id === vendorId);
    if (!vendor) return;

    if (isInShortlist(vendorId)) {
      removeFromShortlist(vendorId);
      setSnackbarMessage(`${vendor.name} removed from shortlist`);
    } else {
      addToShortlist({
        id: vendor.id,
        name: vendor.name,
        price: vendor.price,
        category: vendor.category,
        image: vendor.image
      });
      setSnackbarMessage(`${vendor.name} added to shortlist`);
    }
    setSnackbarOpen(true);
  };

  const handleCardFavorite = (e: React.MouseEvent, vendor: typeof allVendors[0]) => {
    e.stopPropagation();
    handleFavorite(vendor.id);
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FFF6F9' }}>
      <Nav />

      {/* Header Section */}
      <Box sx={{ px: 4, pt: 3, pb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            color: '#002528',
            mb: 2,
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 16,
            textTransform: 'none'
          }}
        >
          Back
        </Button>

        <Typography sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: '#002528',
          mb: 1
        }}>
          Find Your Perfect {selectedCategory === 'All' ? 'Vendors' : selectedCategory}
        </Typography>

        <Typography sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: 14,
          color: '#666',
          mb: 3
        }}>
          {filteredVendors.length} vendors found in Lagos • Click images to preview gallery
        </Typography>

        {/* Search and Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <TextField
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#999' }} />
                </InputAdornment>
              ),
              sx: {
                fontFamily: "'Open Sans', sans-serif",
                backgroundColor: 'white',
                borderRadius: 2,
                '& fieldset': { borderColor: '#e0e0e0' }
              }
            }}
            sx={{ flex: 1, minWidth: 250 }}
            size="small"
          />
          
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              startAdornment={<FilterList sx={{ mr: 1, color: '#00838F' }} />}
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                backgroundColor: 'white',
                borderRadius: 2,
                '& fieldset': { borderColor: '#e0e0e0' }
              }}
            >
              {sortOptions.map(option => (
                <MenuItem key={option} value={option} sx={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Category Chips and Grid Selector Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {/* Category Chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map(category => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 500,
                  backgroundColor: selectedCategory === category ? '#00838F' : 'white',
                  color: selectedCategory === category ? 'white' : '#002528',
                  border: '1px solid',
                  borderColor: selectedCategory === category ? '#00838F' : '#e0e0e0',
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? '#006d75' : '#f5f5f5'
                  }
                }}
              />
            ))}
          </Box>

          {/* View Type & Grid Column Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* View Type Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'white', borderRadius: 2, p: 0.5, border: '1px solid #e0e0e0' }}>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', px: 1 }}>
                View:
              </Typography>
              <IconButton
                onClick={() => setViewType('grid')}
                size="small"
                sx={{
                  backgroundColor: viewType === 'grid' ? '#00838F' : 'transparent',
                  color: viewType === 'grid' ? 'white' : '#666',
                  borderRadius: 1,
                  '&:hover': { backgroundColor: viewType === 'grid' ? '#006d75' : '#f5f5f5' }
                }}
                title="Grid View"
              >
                <GridView sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                onClick={() => setViewType('list')}
                size="small"
                sx={{
                  backgroundColor: viewType === 'list' ? '#00838F' : 'transparent',
                  color: viewType === 'list' ? 'white' : '#666',
                  borderRadius: 1,
                  '&:hover': { backgroundColor: viewType === 'list' ? '#006d75' : '#f5f5f5' }
                }}
                title="List View"
              >
                <ViewList sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                onClick={() => setViewType('map')}
                size="small"
                sx={{
                  backgroundColor: viewType === 'map' ? '#00838F' : 'transparent',
                  color: viewType === 'map' ? 'white' : '#666',
                  borderRadius: 1,
                  '&:hover': { backgroundColor: viewType === 'map' ? '#006d75' : '#f5f5f5' }
                }}
                title="Map View"
              >
                <MapIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Grid Columns Selector (only visible in grid view) */}
            {viewType === 'grid' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'white', borderRadius: 2, p: 0.5, border: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666', px: 1 }}>
                  Columns:
                </Typography>
                {[3, 4, 6].map(cols => (
                  <IconButton
                    key={cols}
                    onClick={() => setGridColumns(cols)}
                    size="small"
                    sx={{
                      backgroundColor: gridColumns === cols ? '#00838F' : 'transparent',
                      color: gridColumns === cols ? 'white' : '#666',
                      borderRadius: 1,
                      minWidth: 28,
                      '&:hover': { backgroundColor: gridColumns === cols ? '#006d75' : '#f5f5f5' }
                    }}
                    title={`${cols} columns`}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{cols}</Typography>
                  </IconButton>
                ))}
              </Box>
            )}

            {/* Items Per Page Selector */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 12,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#e0e0e0' }
                }}
              >
                <MenuItem value={6}>6 / page</MenuItem>
                <MenuItem value={12}>12 / page</MenuItem>
                <MenuItem value={24}>24 / page</MenuItem>
                <MenuItem value={48}>48 / page</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Vendor Results */}
      {viewType === 'grid' && (
        <Box sx={{
          px: 4,
          pb: 4,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: `repeat(${Math.min(gridColumns, 4)}, 1fr)`,
            lg: `repeat(${gridColumns}, 1fr)`
          },
          gap: gridColumns >= 6 ? 2 : 3,
          alignContent: 'start'
        }}>
          {paginatedVendors.map((vendor) => (
          <Card
            key={vendor.id}
            sx={{
              border: '0.25px solid #00838F',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
              }
            }}
          >
            {/* Image Carousel */}
            <Box sx={{ position: 'relative' }}>
              <ImageCarousel 
                images={vendor.images} 
                onExpand={() => handleExpandCarousel(vendor)}
              />
              
              {/* Featured Badge */}
              {vendor.featured && (
                <Chip
                  label="Featured"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    backgroundColor: '#EB1948',
                    color: 'white',
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 10,
                    fontWeight: 600
                  }}
                />
              )}
              
              {/* Favorite Button */}
              <IconButton
                onClick={(e) => handleCardFavorite(e, vendor)}
                sx={{
                  position: 'absolute',
                  top: 40,
                  right: 8,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: 'white' }
                }}
              >
                {isInShortlist(vendor.id) ? (
                  <Favorite sx={{ color: '#EB1948' }} />
                ) : (
                  <FavoriteBorder sx={{ color: '#666' }} />
                )}
              </IconButton>
              
              {/* Category Badge */}
              <Chip
                label={vendor.category}
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  backgroundColor: 'rgba(0,131,143,0.9)',
                  color: 'white',
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 10
                }}
              />
            </Box>
            
            {/* Content */}
            <Box sx={{ p: 2 }}>
              <Typography 
                onClick={() => handleViewProfile(vendor.id)}
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#002528',
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  '&:hover': { color: '#00838F' }
                }}
              >
                {vendor.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <LocationOn sx={{ fontSize: 14, color: '#00838F' }} />
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 12,
                  color: '#666'
                }}>
                  {vendor.location}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Rating value={vendor.rating} readOnly size="small" precision={0.1} />
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#002528'
                }}>
                  {vendor.rating}
                </Typography>
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 11,
                  color: '#666'
                }}>
                  ({vendor.reviewCount} reviews)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 10,
                    color: '#666'
                  }}>
                    Starting at
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#00838F'
                  }}>
                    {formatPrice(vendor.price)}
                  </Typography>
                </Box>
                
                {vendor.capacity && (
                  <Chip
                    label={vendor.capacity}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 10,
                      borderColor: '#e0e0e0',
                      color: '#666'
                    }}
                  />
                )}
              </Box>
            </Box>
          </Card>
        ))}
        </Box>
      )}

      {/* List View */}
      {viewType === 'list' && (
        <Box sx={{ px: 4, pb: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {paginatedVendors.map((vendor) => (
            <Card
              key={vendor.id}
              sx={{
                display: 'flex',
                border: '0.25px solid #00838F',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              {/* Image Section */}
              <Box sx={{ position: 'relative', width: 280, minWidth: 280, height: 200 }}>
                <ImageCarousel 
                  images={vendor.images} 
                  onExpand={() => handleExpandCarousel(vendor)}
                />
                {vendor.featured && (
                  <Chip
                    label="Featured"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: '#EB1948',
                      color: 'white',
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 10,
                      fontWeight: 600
                    }}
                  />
                )}
                <Chip
                  label={vendor.category}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    backgroundColor: 'rgba(0,131,143,0.9)',
                    color: 'white',
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 10
                  }}
                />
              </Box>
              
              {/* Content Section */}
              <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography 
                      onClick={() => handleViewProfile(vendor.id)}
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 20,
                        color: '#002528',
                        cursor: 'pointer',
                        '&:hover': { color: '#00838F' }
                      }}
                    >
                      {vendor.name}
                    </Typography>
                    <IconButton
                      onClick={(e) => handleCardFavorite(e, vendor)}
                      sx={{ color: isInShortlist(vendor.id) ? '#EB1948' : '#666' }}
                    >
                      {isInShortlist(vendor.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn sx={{ fontSize: 16, color: '#00838F' }} />
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#666' }}>
                        {vendor.location}
                      </Typography>
                    </Box>
                    {vendor.capacity && (
                      <Chip
                        label={vendor.capacity}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, borderColor: '#e0e0e0', color: '#666' }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={vendor.rating} readOnly size="small" precision={0.1} />
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#002528' }}>
                      {vendor.rating}
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#666' }}>
                      ({vendor.reviewCount} reviews)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Box>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                      Starting at
                    </Typography>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#00838F' }}>
                      {formatPrice(vendor.price)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleViewProfile(vendor.id)}
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        textTransform: 'none',
                        borderColor: '#00838F',
                        color: '#00838F',
                        '&:hover': { backgroundColor: 'rgba(0,131,143,0.05)', borderColor: '#006d75' }
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleMessage(vendor.id)}
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        textTransform: 'none',
                        backgroundColor: '#00838F',
                        '&:hover': { backgroundColor: '#006d75' }
                      }}
                    >
                      Contact
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Map View */}
      {viewType === 'map' && (
        <Box sx={{ px: 4, pb: 4, flex: 1, display: 'flex', gap: 3 }}>
          {/* Vendor List Sidebar */}
          <Box sx={{ width: 380, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {paginatedVendors.map((vendor) => (
              <Card
                key={vendor.id}
                onClick={() => handleExpandCarousel(vendor)}
                sx={{
                  display: 'flex',
                  border: '0.25px solid #00838F',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                }}
              >
                <Box
                  component="img"
                  src={vendor.image}
                  alt={vendor.name}
                  sx={{ width: 100, height: 100, objectFit: 'cover' }}
                />
                <Box sx={{ p: 1.5, flex: 1 }}>
                  <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14, color: '#002528', mb: 0.5 }}>
                    {vendor.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <LocationOn sx={{ fontSize: 12, color: '#00838F' }} />
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                      {vendor.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={vendor.rating} readOnly size="small" precision={0.1} sx={{ fontSize: 12 }} />
                      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                        ({vendor.reviewCount})
                      </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#00838F' }}>
                      {formatPrice(vendor.price)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
          
          {/* Map Placeholder */}
          <Box sx={{ 
            flex: 1, 
            backgroundColor: '#e8f4f5', 
            borderRadius: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '2px dashed #00838F',
            minHeight: 500
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <MapIcon sx={{ fontSize: 64, color: '#00838F', mb: 2 }} />
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 600, color: '#002528', mb: 1 }}>
                Map View Coming Soon
              </Typography>
              <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666' }}>
                Interactive map with vendor locations will be available here
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* No Results */}
      {filteredVendors.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 18,
            color: '#666',
            mb: 2
          }}>
            No vendors found matching your criteria
          </Typography>
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              textTransform: 'none',
              color: '#00838F'
            }}
          >
            Clear filters
          </Button>
        </Box>
      )}

      {/* Pagination */}
      {filteredVendors.length > 0 && totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 2, 
          py: 4,
          px: 4,
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0'
        }}>
          {/* Results Info */}
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#666', mr: 2 }}>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredVendors.length)} of {filteredVendors.length} vendors
          </Typography>

          {/* First Page */}
          <IconButton
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            sx={{ 
              color: currentPage === 1 ? '#ccc' : '#00838F',
              '&:hover': { backgroundColor: 'rgba(0,131,143,0.1)' }
            }}
            size="small"
          >
            <FirstPage />
          </IconButton>

          {/* Previous */}
          <IconButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            sx={{ 
              color: currentPage === 1 ? '#ccc' : '#00838F',
              '&:hover': { backgroundColor: 'rgba(0,131,143,0.1)' }
            }}
            size="small"
          >
            <KeyboardArrowLeft />
          </IconButton>

          {/* Page Numbers */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, current page, and pages around current
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsisBefore && (
                      <Typography sx={{ px: 1, color: '#666', alignSelf: 'center' }}>...</Typography>
                    )}
                    <Button
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? 'contained' : 'text'}
                      sx={{
                        minWidth: 36,
                        height: 36,
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: currentPage === page ? 600 : 400,
                        backgroundColor: currentPage === page ? '#00838F' : 'transparent',
                        color: currentPage === page ? 'white' : '#002528',
                        '&:hover': { 
                          backgroundColor: currentPage === page ? '#006d75' : 'rgba(0,131,143,0.1)' 
                        }
                      }}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              })}
          </Box>

          {/* Next */}
          <IconButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            sx={{ 
              color: currentPage === totalPages ? '#ccc' : '#00838F',
              '&:hover': { backgroundColor: 'rgba(0,131,143,0.1)' }
            }}
            size="small"
          >
            <KeyboardArrowRight />
          </IconButton>

          {/* Last Page */}
          <IconButton
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            sx={{ 
              color: currentPage === totalPages ? '#ccc' : '#00838F',
              '&:hover': { backgroundColor: 'rgba(0,131,143,0.1)' }
            }}
            size="small"
          >
            <LastPage />
          </IconButton>
        </Box>
      )}

      {/* Vendor Preview Modal */}
      <VendorPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        vendor={selectedVendor}
        onViewProfile={handleViewProfile}
        onMessage={handleMessage}
        onFavorite={handleFavorite}
        onBookNow={handleBookNow}
        isFavorite={selectedVendor ? isInShortlist(selectedVendor.id) : false}
        source="search"
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ fontFamily: "'Open Sans', sans-serif" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}
