import { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  IconButton,
  Divider,
  Rating,
  Chip,
  Autocomplete,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

interface AdvancedSearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
  onClear: () => void;
}

export interface SearchFilters {
  priceRange: [number, number];
  location: {
    state: string;
    city: string;
    area: string;
  };
  rating: number;
  availability: {
    date: string;
    time: string;
  };
  features: string[];
  capacity?: number;
  verified: boolean;
  promoted: boolean;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'rating' | 'reviews';
}

const NIGERIAN_STATES = [
  'Lagos', 'Abuja', 'Kano', 'Kaduna', 'Ibadan', 'Port Harcourt', 'Benin City',
  'Enugu', 'Abeokuta', 'Ilorin', 'Owerri', 'Jos', 'Calabar', 'Uyo'
];

const LAGOS_AREAS = [
  'Ikeja', 'Victoria Island', 'Lekki', 'Ikoyi', 'Surulere', 'Yaba', 
  'Ajah', 'Maryland', 'Festac', 'Apapa', 'Epe', 'Badagry'
];

const COMMON_FEATURES = [
  'Air Conditioning', 'Parking Space', 'Generator', 'Outdoor Space',
  'Indoor Option', 'Bridal Suite', 'Kitchen Facilities', 'Bar Service',
  'Sound System', 'Lighting Equipment', 'Stage/Platform', 'Wheelchair Accessible'
];

export default function AdvancedSearchFilters({ onFilterChange, onClear }: AdvancedSearchFiltersProps) {
  const [expanded, setExpanded] = useState({
    price: true,
    location: true,
    rating: false,
    availability: false,
    features: false,
    other: false,
  });

  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 2000000],
    location: {
      state: 'Lagos',
      city: '',
      area: '',
    },
    rating: 0,
    availability: {
      date: '',
      time: '',
    },
    features: [],
    capacity: undefined,
    verified: false,
    promoted: false,
    sortBy: 'recommended',
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    const newFilters = { ...filters, priceRange: newValue as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (field: keyof typeof filters.location, value: string) => {
    const newFilters = {
      ...filters,
      location: { ...filters.location, [field]: value },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (newRating: number | null) => {
    const newFilters = { ...filters, rating: newRating || 0 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    const newFilters = { ...filters, features: newFeatures };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAvailabilityChange = (field: keyof typeof filters.availability, value: string) => {
    const newFilters = {
      ...filters,
      availability: { ...filters.availability, [field]: value },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const defaultFilters: SearchFilters = {
      priceRange: [0, 2000000],
      location: { state: 'Lagos', city: '', area: '' },
      rating: 0,
      availability: { date: '', time: '' },
      features: [],
      verified: false,
      promoted: false,
      sortBy: 'recommended',
    };
    setFilters(defaultFilters);
    onClear();
  };

  const formatPrice = (value: number) => {
    return `₦${(value / 1000).toFixed(0)}k`;
  };

  const activeFiltersCount = [
    filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000,
    filters.location.city,
    filters.location.area,
    filters.rating > 0,
    filters.availability.date,
    filters.features.length > 0,
    filters.verified,
    filters.promoted,
  ].filter(Boolean).length;

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        border: '1px solid #CCFDF2',
        p: 3,
        position: 'sticky',
        top: 20,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: '#00838F' }} />
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#002528' }}>
            Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              sx={{ bgcolor: '#00838F', color: 'white', height: 20, fontSize: 11 }}
            />
          )}
        </Box>
        <Button
          size="small"
          startIcon={<ClearIcon />}
          onClick={handleClear}
          sx={{ textTransform: 'none', color: '#666' }}
        >
          Clear All
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Price Range */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('price')}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 2 }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#002528' }}>
            Price Range
          </Typography>
          <IconButton size="small">
            {expanded.price ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expanded.price}>
          <Box sx={{ px: 1 }}>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              valueLabelFormat={formatPrice}
              min={0}
              max={2000000}
              step={50000}
              sx={{
                color: '#00838F',
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography sx={{ fontSize: 12, color: '#666' }}>
                {formatPrice(filters.priceRange[0])}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#666' }}>
                {formatPrice(filters.priceRange[1])}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Location */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('location')}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 2 }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#002528' }}>
            Location
          </Typography>
          <IconButton size="small">
            {expanded.location ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expanded.location}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Autocomplete
              value={filters.location.state}
              onChange={(_e, newValue) => handleLocationChange('state', newValue || '')}
              options={NIGERIAN_STATES}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="State" variant="outlined" />
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 14,
                },
              }}
            />
            <TextField
              label="City"
              size="small"
              value={filters.location.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 14,
                },
              }}
            />
            <Autocomplete
              value={filters.location.area}
              onChange={(_e, newValue) => handleLocationChange('area', newValue || '')}
              options={LAGOS_AREAS}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Area" variant="outlined" />
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 14,
                },
              }}
            />
          </Box>
        </Collapse>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Rating */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('rating')}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 2 }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#002528' }}>
            Minimum Rating
          </Typography>
          <IconButton size="small">
            {expanded.rating ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expanded.rating}>
          <Box sx={{ px: 1 }}>
            <Rating
              value={filters.rating}
              onChange={(_e, newValue) => handleRatingChange(newValue)}
              precision={0.5}
              size="large"
              sx={{ color: '#00838F' }}
            />
            <Typography sx={{ fontSize: 12, color: '#666', mt: 1 }}>
              {filters.rating > 0 ? `${filters.rating}+ stars` : 'Any rating'}
            </Typography>
          </Box>
        </Collapse>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Availability */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('availability')}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 2 }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#002528' }}>
            Availability
          </Typography>
          <IconButton size="small">
            {expanded.availability ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expanded.availability}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              type="date"
              label="Event Date"
              size="small"
              value={filters.availability.date}
              onChange={(e) => handleAvailabilityChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 14,
                },
              }}
            />
            <TextField
              type="time"
              label="Preferred Time"
              size="small"
              value={filters.availability.time}
              onChange={(e) => handleAvailabilityChange('time', e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 14,
                },
              }}
            />
          </Box>
        </Collapse>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Features */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('features')}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 2 }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#002528' }}>
            Features & Amenities
          </Typography>
          <IconButton size="small">
            {expanded.features ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expanded.features}>
          <FormGroup sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {COMMON_FEATURES.map((feature) => (
              <FormControlLabel
                key={feature}
                control={
                  <Checkbox
                    checked={filters.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    sx={{ color: '#00838F', '&.Mui-checked': { color: '#00838F' } }}
                  />
                }
                label={<Typography sx={{ fontSize: 13 }}>{feature}</Typography>}
              />
            ))}
          </FormGroup>
        </Collapse>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Other Filters */}
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection('other')}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 2 }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#002528' }}>
            Other Filters
          </Typography>
          <IconButton size="small">
            {expanded.other ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expanded.other}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.verified}
                  onChange={(e) => {
                    const newFilters = { ...filters, verified: e.target.checked };
                    setFilters(newFilters);
                    onFilterChange(newFilters);
                  }}
                  sx={{ color: '#00838F', '&.Mui-checked': { color: '#00838F' } }}
                />
              }
              label={<Typography sx={{ fontSize: 13 }}>Verified Vendors Only</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.promoted}
                  onChange={(e) => {
                    const newFilters = { ...filters, promoted: e.target.checked };
                    setFilters(newFilters);
                    onFilterChange(newFilters);
                  }}
                  sx={{ color: '#00838F', '&.Mui-checked': { color: '#00838F' } }}
                />
              }
              label={<Typography sx={{ fontSize: 13 }}>Featured Vendors</Typography>}
            />
          </FormGroup>
        </Collapse>
      </Box>
    </Box>
  );
}
