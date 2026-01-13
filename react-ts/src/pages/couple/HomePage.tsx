import { useState, useEffect } from 'react';
import { Box, Typography, Button, MenuItem, Select, TextField, Card, Rating, Snackbar, Alert } from '@mui/material';
import { KeyboardArrowDown, LocationOn } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import PhotoCollage from '../../components/PhotoCollage';
import VendorPreviewModal from '../../components/VendorPreviewModal';
import type { VendorPreviewData } from '../../components/VendorPreviewModal';
import { useShortlist } from '../../contexts/ShortlistContext';


const heroImage = "https://www.figma.com/api/mcp/asset/4840190a-4450-4abc-9898-613647818f37";

// Mock vendor data for Hot vendors section with multiple images
const hotVendors = [
  {
    id: 'v1',
    name: 'Denver Music Crew',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 'N500,000',
    capacity: '500',
    location: 'Idumota, Lagos',
    negotiable: true,
  },
  {
    id: 'v2',
    name: 'Dove Cars Nig Ltd',
    category: 'Car Rentals',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 'N500,000',
    capacity: '500',
    location: 'Idumota, Lagos',
    negotiable: true,
  },
  {
    id: 'v3',
    name: 'Rings of Fire',
    category: 'Wedding Ring',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 'N500,000',
    capacity: '500',
    location: 'Idumota, Lagos',
    negotiable: true,
  },
];

// Top vendors for horizontal scroll with multiple images
const topVendors = [
  {
    id: 't1',
    name: 'Sito Videography',
    category: 'Videographer',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 'N350,000',
    location: 'Lekki, Lagos',
  },
  {
    id: 't2',
    name: 'Anne Consultancy',
    category: 'Wedding Consultant',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 'N200,000',
    location: 'Victoria Island, Lagos',
  },
  {
    id: 't3',
    name: 'Mildas Touch',
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 'N150,000',
    location: 'Surulere, Lagos',
  },
  {
    id: 't4',
    name: 'Joan Mochet',
    category: 'Makeup Artist',
    image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 'N100,000',
    location: 'Ikeja, Lagos',
  },
  {
    id: 't5',
    name: 'M88 Drinks',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800',
      'https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 'N80,000',
    location: 'Yaba, Lagos',
  },
  {
    id: 't6',
    name: 'Adaeze Cakes',
    category: 'Cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800',
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800',
    ],
    rating: 4.6,
    reviewCount: 580,
    price: 'N120,000',
    location: 'Ikoyi, Lagos',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToShortlist, removeFromShortlist, isInShortlist } = useShortlist();
  
  const [category, setCategory] = useState('Reception Venue');
  const [location_, setLocation_] = useState('Ikeja, Lagos');
  const [searchType, setSearchType] = useState<'category' | 'name'>('category');
  const [vendorName, setVendorName] = useState('');
  
  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorPreviewData | null>(null);
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Handle reopening modal when returning from vendor profile
  useEffect(() => {
    if (location.state?.reopenPreview && location.state?.vendorId) {
      const vendorId = location.state.vendorId;
      // Check hotVendors first (they have capacity/negotiable)
      const hotVendor = hotVendors.find(v => v.id === vendorId);
      if (hotVendor) {
        setSelectedVendor({
          id: hotVendor.id,
          name: hotVendor.name,
          category: hotVendor.category,
          images: hotVendor.images || [hotVendor.image],
          rating: hotVendor.rating,
          reviewCount: hotVendor.reviewCount,
          price: hotVendor.price || 'N/A',
          location: hotVendor.location || 'Lagos, Nigeria',
          capacity: hotVendor.capacity,
          negotiable: hotVendor.negotiable,
        });
        setPreviewOpen(true);
        window.history.replaceState({}, document.title);
        return;
      }
      // Check topVendors (they don't have capacity/negotiable)
      const topVendor = topVendors.find(v => v.id === vendorId);
      if (topVendor) {
        setSelectedVendor({
          id: topVendor.id,
          name: topVendor.name,
          category: topVendor.category,
          images: topVendor.images || [topVendor.image],
          rating: topVendor.rating,
          reviewCount: topVendor.reviewCount,
          price: topVendor.price || 'N/A',
          location: topVendor.location || 'Lagos, Nigeria',
        });
        setPreviewOpen(true);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  const handleSearch = () => {
    if (searchType === 'category') {
      // Map category names to match SearchResults categories
      const categoryMap: Record<string, string> = {
        'Reception Venue': 'Venue',
        'Florist': 'Florist',
        'Photographer': 'Photographer',
        'Cake & Desserts': 'Cake',
        'Music': 'Music',
      };
      const mappedCategory = categoryMap[category] || category;
      navigate(`/couple/search-results?category=${encodeURIComponent(mappedCategory)}`);
    } else {
      // Search by vendor name
      navigate(`/couple/search-results?search=${encodeURIComponent(vendorName)}`);
    }
  };

  const handleVendorClick = (vendor: typeof hotVendors[0] | typeof topVendors[0]) => {
    setSelectedVendor({
      id: vendor.id,
      name: vendor.name,
      category: vendor.category,
      images: vendor.images || [vendor.image],
      rating: vendor.rating,
      reviewCount: vendor.reviewCount,
      price: vendor.price || 'N/A',
      location: vendor.location || 'Lagos, Nigeria',
      capacity: 'capacity' in vendor ? vendor.capacity : undefined,
      negotiable: 'negotiable' in vendor ? vendor.negotiable : false,
    });
    setPreviewOpen(true);
  };

  const handleViewProfile = (vendorId: string, fromPreview?: boolean) => {
    navigate(`/couple/vendor/${vendorId}`, { 
      state: fromPreview ? { fromPreview: true, source: 'home', vendorId } : undefined 
    });
  };

  const handleMessage = (vendorId: string) => {
    navigate('/couple/messages', { state: { vendorId } });
  };

  const handleFavorite = (vendorId: string) => {
    const vendor = [...hotVendors, ...topVendors].find(v => v.id === vendorId);
    if (!vendor) return;

    if (isInShortlist(vendorId)) {
      removeFromShortlist(vendorId);
      setSnackbarMessage(`${vendor.name} removed from shortlist`);
    } else {
      const priceNum = typeof vendor.price === 'string' 
        ? parseInt(vendor.price.replace(/[^0-9]/g, '')) || 0 
        : vendor.price || 0;
      addToShortlist({
        id: vendor.id,
        name: vendor.name,
        price: priceNum,
        category: vendor.category,
        image: vendor.image
      });
      setSnackbarMessage(`${vendor.name} added to shortlist`);
    }
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      <Nav />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '500px', md: '610px' },
          bgcolor: '#0e292b',
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <Box
          component="img"
          src={heroImage}
          alt="Wedding venue"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.5,
          }}
        />

        {/* Dark Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: '#0e292b',
            opacity: 0.8,
          }}
        />

        {/* Hero Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            px: { xs: 3, sm: 4, md: 6, lg: 8 },
            pt: { xs: 4, md: 6, lg: 8 },
            maxWidth: { xs: '100%', md: '650px', lg: '700px' },
            ml: { xs: 0, lg: 4, xl: 8 },
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: { xs: 32, md: 45 },
              fontWeight: 700,
              color: 'white',
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Get a wedding Vendor with just few Clicks.
          </Typography>

          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: { xs: 16, md: 18 },
              fontWeight: 400,
              color: '#eceba2',
              mb: 4,
            }}
          >
            Plan your wedding with the best vendors in and out of town.
          </Typography>

          {/* Search by toggle */}
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 16,
              fontWeight: 400,
              color: 'white',
              mb: 2,
            }}
          >
            Search by
          </Typography>

          {/* Search Type Tabs */}
          <Box sx={{ display: 'flex', gap: 0, mb: 2 }}>
            <Button
              onClick={() => setSearchType('category')}
              sx={{
                background: searchType === 'category' 
                  ? 'linear-gradient(218.55deg, #EB1948 65.18%, #B52344 232.03%)'
                  : 'white',
                color: searchType === 'category' ? 'white' : '#002528',
                px: 4,
                py: 1.5,
                borderRadius: 0,
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                textTransform: 'none',
                minWidth: 120,
                height: 51,
                '&:hover': {
                  background: searchType === 'category' 
                    ? 'linear-gradient(218.55deg, #EB1948 65.18%, #B52344 232.03%)' 
                    : '#f5f5f5',
                },
              }}
            >
              Category
            </Button>
            <Button
              onClick={() => setSearchType('name')}
              sx={{
                background: searchType === 'name' 
                  ? 'linear-gradient(218.55deg, #EB1948 65.18%, #B52344 232.03%)' 
                  : 'white',
                color: searchType === 'name' ? 'white' : '#002528',
                px: 4,
                py: 1.5,
                borderRadius: 0,
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                textTransform: 'none',
                minWidth: 180,
                height: 51,
                '&:hover': {
                  background: searchType === 'name' 
                    ? 'linear-gradient(218.55deg, #EB1948 65.18%, #B52344 232.03%)' 
                    : '#f5f5f5',
                },
              }}
            >
              Name of Vendor
            </Button>
          </Box>

          {/* Search Fields */}
          {searchType === 'category' ? (
            <Box sx={{ display: 'flex', gap: 0, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              {/* Category Dropdown */}
              <Box sx={{ flex: 1 }}>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  IconComponent={KeyboardArrowDown}
                  displayEmpty
                  sx={{
                    bgcolor: 'white',
                    width: '100%',
                    height: 51,
                    border: '0.25px solid #00838F',
                    borderRadius: 0,
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#002528',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                >
                  <MenuItem value="Reception Venue">Reception Venue</MenuItem>
                  <MenuItem value="Florist">Florist</MenuItem>
                  <MenuItem value="Photographer">Photographer</MenuItem>
                  <MenuItem value="Cake & Desserts">Cake & Desserts</MenuItem>
                  <MenuItem value="Music">Music</MenuItem>
                </Select>
              </Box>

              {/* Location Input */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  value={location_}
                  onChange={(e) => setLocation_(e.target.value)}
                  placeholder="Ikeja, Lagos"
                  fullWidth
                  sx={{
                    bgcolor: 'white',
                    height: 51,
                    border: '0.25px solid #00838F',
                    '& .MuiOutlinedInput-root': {
                      height: 51,
                      borderRadius: 0,
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#002528',
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ mb: 2 }}>
              <TextField
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Name of Vendor"
                fullWidth
                sx={{
                  bgcolor: 'white',
                  height: 51,
                  border: '0.25px solid #00838F',
                  '& .MuiOutlinedInput-root': {
                    height: 51,
                    borderRadius: 0,
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#8a8a8a',
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            sx={{
              bgcolor: '#00838F',
              color: 'white',
              width: '100%',
              height: 51,
              borderRadius: 0,
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#006b75',
              },
            }}
          >
            Search
          </Button>
        </Box>

        {/* Photo Collage */}
        <Box
          sx={{
            position: 'absolute',
            right: { lg: 40, xl: 80 },
            top: { lg: 80, xl: 100 },
            display: { xs: 'none', lg: 'block' },
            zIndex: 1,
          }}
        >
          <PhotoCollage />
        </Box>
      </Box>

      {/* Hot Vendors Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, bgcolor: 'white' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {/* Section Header */}
          <Box sx={{ display: 'flex', gap: 4, mb: 4, alignItems: 'center' }}>
            <Typography
              sx={{
                fontFamily: 'Open Sans',
                fontSize: 20,
                fontWeight: 600,
                color: '#002528',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  right: 0,
                  height: 5,
                  bgcolor: '#00838F',
                },
              }}
            >
              Hot
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Open Sans',
                fontSize: 20,
                fontWeight: 600,
                color: '#8a8a8a',
                cursor: 'pointer',
                '&:hover': {
                  color: '#00838F',
                },
              }}
              onClick={() => navigate('/couple/select-vendors')}
            >
              Vendors You Worked With
            </Typography>
          </Box>

          {/* Hot vendors section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {hotVendors.map((vendor) => (
              <Card
                key={vendor.id}
                sx={{
                  border: '0.25px solid #00838F',
                  borderRadius: 0,
                  boxShadow: '0px 5px 5px -1px rgba(0,37,40,0.1)',
                  overflow: 'hidden',
                  maxWidth: 887,
                  mx: 'auto',
                  width: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 8px 12px -1px rgba(0,37,40,0.15)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', p: 3, gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  {/* Vendor Image - Clickable to open preview */}
                  <Box
                    onClick={() => handleVendorClick(vendor)}
                    sx={{
                      width: { xs: '100%', md: 375 },
                      height: { xs: 200, md: 283 },
                      position: 'relative',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      component="img"
                      src={vendor.image}
                      alt={vendor.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        boxShadow: 'inset 0px -70px 50px -37px rgba(0,37,40,0.55)',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        }
                      }}
                    />
                    {/* Click hint overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          opacity: 1,
                        }
                      }}
                    >
                      <Typography sx={{
                        color: 'white',
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: 13,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        px: 2,
                        py: 0.5,
                        borderRadius: 4,
                      }}>
                        Click to view gallery ({vendor.images.length} photos)
                      </Typography>
                    </Box>
                    {/* Rating Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Rating
                        value={vendor.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: '#FFB800',
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: 'Open Sans',
                          fontSize: 14,
                          color: 'white',
                          ml: 0.5,
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          {vendor.rating}
                        </Box>{' '}
                        ({vendor.reviewCount})
                      </Typography>
                    </Box>
                  </Box>

                  {/* Vendor Details */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Vendor Name */}
                    <Typography
                      sx={{
                        fontFamily: 'Open Sans',
                        fontSize: 20,
                        fontWeight: 600,
                        color: '#002528',
                      }}
                    >
                      {vendor.name}
                    </Typography>

                    {/* Category */}
                    <Typography
                      sx={{
                        fontFamily: 'Open Sans',
                        fontSize: 12,
                        color: '#8a8a8a',
                      }}
                    >
                      Category | {vendor.category}
                    </Typography>

                    <Box sx={{ height: 0, borderTop: '0.3px solid #8a8a8a', my: 1 }} />

                    {/* Price */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: 'Open Sans',
                          fontSize: 14,
                          color: '#00838F',
                        }}
                      >
                        Starting Price
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Open Sans',
                          fontSize: 20,
                          fontWeight: 400,
                          color: '#002528',
                        }}
                      >
                        {vendor.price}
                      </Typography>
                    </Box>

                    {/* Capacity */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: 'Open Sans',
                          fontSize: 14,
                          color: '#8a8a8a',
                        }}
                      >
                        Capacity
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Open Sans',
                          fontSize: 14,
                          color: '#8a8a8a',
                        }}
                      >
                        {vendor.capacity}
                      </Typography>
                    </Box>

                    {/* Location */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: 'Open Sans',
                          fontSize: 14,
                          color: '#8a8a8a',
                        }}
                      >
                        Location
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 18, color: '#8a8a8a' }} />
                        <Typography
                          sx={{
                            fontFamily: 'Open Sans',
                            fontSize: 14,
                            color: '#8a8a8a',
                          }}
                        >
                          {vendor.location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Negotiable */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: 'Open Sans',
                          fontSize: 14,
                          color: '#002528',
                        }}
                      >
                        Negotiable?
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Open Sans',
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#002528',
                        }}
                      >
                        {vendor.negotiable ? 'Yes' : 'No'}
                      </Typography>
                    </Box>

                    {/* Get in Touch Button - Opens preview modal */}
                    <Button
                      onClick={() => handleVendorClick(vendor)}
                      sx={{
                        border: '1px solid #EB1948',
                        bgcolor: 'white',
                        color: 'transparent',
                        backgroundImage: 'linear-gradient(223.19deg, #EB1948 65.18%, #B52344 232.03%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: 'Open Sans',
                        fontSize: 16,
                        fontWeight: 400,
                        textTransform: 'none',
                        height: 50,
                        mt: 1,
                        '&:hover': {
                          bgcolor: '#fff5f7',
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          mr: 1,
                          fontSize: 20,
                          background: 'linear-gradient(223.19deg, #EB1948 65.18%, #B52344 232.03%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        ♥
                      </Box>
                      Get in touch
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Top Vendors Section */}
          <Box sx={{ mt: 8 }}>
            <Typography
              sx={{
                fontFamily: 'Open Sans',
                fontSize: 24,
                fontWeight: 600,
                color: '#002528',
                textAlign: 'center',
                mb: 4,
              }}
            >
              Top Vendors for the week
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: '#00838F',
                  borderRadius: 4,
                },
              }}
            >
              {topVendors.map((vendor) => (
                <Card
                  key={vendor.id}
                  sx={{
                    minWidth: 251,
                    maxWidth: 251,
                    border: 'none',
                    boxShadow: 'none',
                    borderRadius: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  {/* Image - Clickable to open preview modal */}
                  <Box sx={{ position: 'relative' }} onClick={() => handleVendorClick(vendor)}>
                    <Box
                      component="img"
                      src={vendor.image}
                      alt={vendor.name}
                      sx={{
                        width: '100%',
                        height: 189,
                        objectFit: 'cover',
                        boxShadow: 'inset 0px -70px 50px -37px rgba(0,37,40,0.55)',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        }
                      }}
                    />
                    {/* Hover overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          opacity: 1,
                        }
                      }}
                    >
                      <Typography sx={{
                        color: 'white',
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: 11,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 4,
                      }}>
                        View gallery
                      </Typography>
                    </Box>
                    {/* Rating Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Rating
                        value={vendor.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: '#FFB800',
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: 'Open Sans',
                          fontSize: 14,
                          color: 'white',
                          ml: 0.5,
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          {vendor.rating}
                        </Box>{' '}
                        ({vendor.reviewCount})
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Open Sans',
                        fontSize: 20,
                        fontWeight: 600,
                        color: '#002528',
                        mb: 1,
                      }}
                    >
                      {vendor.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Open Sans',
                        fontSize: 12,
                        color: '#8a8a8a',
                      }}
                    >
                      Category | {vendor.category}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Browse by Category Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              onClick={() => navigate('/couple/select-vendors')}
              sx={{
                bgcolor: '#00838F',
                color: 'white',
                px: 6,
                py: 1.5,
                borderRadius: 1,
                fontFamily: 'Open Sans',
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#006b75',
                },
              }}
            >
              Browse All Vendors
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Vendor Preview Modal */}
      <VendorPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        vendor={selectedVendor}
        onViewProfile={handleViewProfile}
        onMessage={handleMessage}
        onFavorite={handleFavorite}
        isFavorite={selectedVendor ? isInShortlist(selectedVendor.id) : false}
        source="home"
      />

      {/* Snackbar for shortlist notifications */}
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