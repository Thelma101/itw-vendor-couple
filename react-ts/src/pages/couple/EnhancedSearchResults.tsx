import { useState, useEffect } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { useShortlist } from '../../contexts/ShortlistContext'
import type { SearchFilters } from '../../components/AdvancedSearchFilters'
import VendorSearchBar from '../../components/VendorSearchBar'
import VendorPreviewModal from '../../components/VendorPreviewModal'
import SearchFiltersPanel from '@/components/couple/search/SearchFiltersPanel'
import VendorsGridContent from '@/components/couple/search/VendorsGridContent'
import ResultsPagination from '@/components/couple/search/ResultsPagination'

interface Vendor {
  id: string;
  name: string;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  price: number;
  location: string;
  featured: boolean;
  verified: boolean;
  capacity?: string;
  features: string[];
  responseTime?: string;
  completedBookings?: number;
}

// Extended mock data
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Rosevet Event Center',
    category: 'Venue',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
    ],
    rating: 4.9,
    reviewCount: 234,
    price: 500000,
    location: 'Ikeja, Lagos',
    featured: true,
    verified: true,
    capacity: '500 guests',
    features: ['Air Conditioning', 'Parking Space', 'Generator', 'Outdoor Space'],
    responseTime: '< 2 hours',
    completedBookings: 180,
  },
  {
    id: '2',
    name: 'Regina Ugwu Photography',
    category: 'Photographer',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600',
    images: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
    ],
    rating: 4.8,
    reviewCount: 127,
    price: 150000,
    location: 'Lekki, Lagos',
    featured: true,
    verified: true,
    features: ['Drone Photography', 'Albums Included', 'Online Gallery'],
    responseTime: '< 1 hour',
    completedBookings: 250,
  },
  {
    id: '3',
    name: 'Divine Catering Services',
    category: 'Catering',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600',
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    ],
    rating: 4.6,
    reviewCount: 156,
    price: 300000,
    location: 'Victoria Island, Lagos',
    featured: false,
    verified: true,
    capacity: '200+ guests',
    features: ['Live Cooking Station', 'International Cuisine', 'Bar Service'],
    responseTime: '< 3 hours',
    completedBookings: 145,
  },
  {
    id: '4',
    name: 'Sugar Rush Cakes',
    category: 'Cake',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600',
    images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800'],
    rating: 4.9,
    reviewCount: 201,
    price: 120000,
    location: 'Surulere, Lagos',
    featured: true,
    verified: true,
    features: ['Custom Designs', 'Tasting Session', 'Delivery Included'],
    responseTime: '< 4 hours',
    completedBookings: 320,
  },
  {
    id: '5',
    name: 'Glam by Tola',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600',
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'],
    rating: 4.8,
    reviewCount: 312,
    price: 100000,
    location: 'Lekki, Lagos',
    featured: true,
    verified: true,
    features: ['Bridal Makeup', 'Trials Included', 'Touch-up Service'],
    responseTime: '< 2 hours',
    completedBookings: 280,
  },
];

export default function EnhancedSearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, addToShortlist, removeFromShortlist } = useShortlist();
  
  const [loading, setLoading] = useState(false);
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [page, setPage] = useState(1);
  const vendorsPerPage = 9;

  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 2000000],
    location: { state: 'Lagos', city: '', area: '' },
    rating: 0,
    availability: { date: '', time: '' },
    features: [],
    verified: false,
    promoted: false,
    sortBy: 'recommended',
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = [...vendors];

      // Search query
      if (searchQuery) {
        filtered = filtered.filter(v =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Category from URL
      const category = searchParams.get('category');
      if (category) {
        filtered = filtered.filter(v => v.category.toLowerCase() === category.toLowerCase());
      }

      // Price range
      filtered = filtered.filter(v =>
        v.price >= filters.priceRange[0] && v.price <= filters.priceRange[1]
      );

      // Location
      if (filters.location.city) {
        filtered = filtered.filter(v =>
          v.location.toLowerCase().includes(filters.location.city.toLowerCase())
        );
      }
      if (filters.location.area) {
        filtered = filtered.filter(v =>
          v.location.toLowerCase().includes(filters.location.area.toLowerCase())
        );
      }

      // Rating
      if (filters.rating > 0) {
        filtered = filtered.filter(v => v.rating >= filters.rating);
      }

      // Features
      if (filters.features.length > 0) {
        filtered = filtered.filter(v =>
          filters.features.every(f => v.features.includes(f))
        );
      }

      // Verified
      if (filters.verified) {
        filtered = filtered.filter(v => v.verified);
      }

      // Featured/Promoted
      if (filters.promoted) {
        filtered = filtered.filter(v => v.featured);
      }

      // Sorting
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'reviews':
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        default:
          // Recommended: featured first, then by rating
          filtered.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.rating - a.rating;
          });
      }

      setFilteredVendors(filtered);
      setLoading(false);
      setPage(1); // Reset to first page
    }, 500);
  }, [filters, searchQuery, vendors, searchParams]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, 2000000],
      location: { state: 'Lagos', city: '', area: '' },
      rating: 0,
      availability: { date: '', time: '' },
      features: [],
      verified: false,
      promoted: false,
      sortBy: 'recommended',
    });
    setSearchQuery('');
  };

  const isShortlisted = (vendorId: string) => {
    return items.some(item => item.id === vendorId);
  };

  const toggleShortlist = (vendor: Vendor) => {
    if (isShortlisted(vendor.id)) {
      removeFromShortlist(vendor.id);
    } else {
      addToShortlist({
        id: vendor.id,
        name: vendor.name,
        price: vendor.price,
        image: vendor.image,
        category: vendor.category,
      });
    }
  };

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setPreviewOpen(true);
  };

  // Pagination
  const indexOfLastVendor = page * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Nav />

      <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        {/* Header */}
        <Typography sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: 28,
          color: '#002528',
          mb: 1,
        }}>
          Find Your Perfect Vendors
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#666', mb: 3 }}>
          Browse through verified vendors for your special day
        </Typography>

        {/* Search Bar */}
        <VendorSearchBar
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
          totalResults={filteredVendors.length}
        />

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <SearchFiltersPanel onFilterChange={handleFilterChange} onClear={handleClearFilters} />

          {/* Vendors Grid */}
          <Grid size={{ xs: 12, md: 9 }}>
            <VendorsGridContent
              loading={loading}
              vendors={currentVendors}
              isShortlisted={isShortlisted}
              onToggleShortlist={toggleShortlist}
              onVendorClick={handleVendorClick}
              onClearFilters={handleClearFilters}
            />

            {/* Pagination */}
            <ResultsPagination page={page} totalPages={totalPages} onChange={setPage} />
          </Grid>
        </Grid>
      </Box>

      <Footer />

      {/* Vendor Preview Modal */}
      {selectedVendor && (
        <VendorPreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          onViewProfile={() => navigate(`/couple/vendor/${selectedVendor.id}`)}
          onMessage={() => navigate('/couple/messages')}
          onFavorite={() => toggleShortlist(selectedVendor)}
          isFavorite={isShortlisted(selectedVendor.id)}
          vendor={{
            id: selectedVendor.id,
            name: selectedVendor.name,
            category: selectedVendor.category,
            images: selectedVendor.images,
            rating: selectedVendor.rating,
            reviewCount: selectedVendor.reviewCount,
            price: selectedVendor.price,
            location: selectedVendor.location,
            capacity: selectedVendor.capacity,
          }}
        />
      )}
    </Box>
  );
}
