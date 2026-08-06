import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import {
  Search,
  Tune,
} from '@mui/icons-material';
import type { SearchFilters } from './AdvancedSearchFilters';

interface VendorSearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
  totalResults: number;
}

export default function VendorSearchBar({
  onSearch,
  onFilterChange,
  currentFilters,
  totalResults,
}: VendorSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilters, setQuickFilters] = useState({
    verified: false,
    available: false,
    featured: false,
  });

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };

  const handleQuickFilter = (filterName: keyof typeof quickFilters) => {
    const newQuickFilters = {
      ...quickFilters,
      [filterName]: !quickFilters[filterName],
    };
    setQuickFilters(newQuickFilters);
    
    // Update main filters
    onFilterChange({
      ...currentFilters,
      verified: newQuickFilters.verified,
      promoted: newQuickFilters.featured,
    });
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    onFilterChange({ ...currentFilters, sortBy });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 2000000) count++;
    if (currentFilters.location.city) count++;
    if (currentFilters.location.area) count++;
    if (currentFilters.rating > 0) count++;
    if (currentFilters.availability.date) count++;
    if (currentFilters.features.length > 0) count++;
    if (currentFilters.verified) count++;
    if (currentFilters.promoted) count++;
    return count;
  };

  return (
    <Box>
      {/* Main Search Bar */}
      <Card sx={{ p: 2, mb: 3, border: '1px solid #CCFDF2', boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search vendors by name, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: '#666' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 14,
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearchSubmit}
            sx={{
              bgcolor: '#00838F',
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: '#006064' },
              whiteSpace: 'nowrap',
            }}
          >
            Search
          </Button>
          <IconButton
            sx={{
              bgcolor: '#FFFFFF',
              border: '1px solid #CCFDF2',
              '&:hover': { bgcolor: '#FFE0EC' },
            }}
          >
            <Badge badgeContent={getActiveFilterCount()} color="error">
              <Tune />
            </Badge>
          </IconButton>
        </Box>

        {/* Quick Filters */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Verified Only"
            onClick={() => handleQuickFilter('verified')}
            color={quickFilters.verified ? 'primary' : 'default'}
            variant={quickFilters.verified ? 'filled' : 'outlined'}
            sx={{
              bgcolor: quickFilters.verified ? '#00838F' : 'transparent',
              color: quickFilters.verified ? 'white' : '#666',
              borderColor: '#00838F',
            }}
          />
          <Chip
            label="Available This Week"
            onClick={() => handleQuickFilter('available')}
            color={quickFilters.available ? 'primary' : 'default'}
            variant={quickFilters.available ? 'filled' : 'outlined'}
            sx={{
              bgcolor: quickFilters.available ? '#00838F' : 'transparent',
              color: quickFilters.available ? 'white' : '#666',
              borderColor: '#00838F',
            }}
          />
          <Chip
            label="Featured"
            onClick={() => handleQuickFilter('featured')}
            color={quickFilters.featured ? 'primary' : 'default'}
            variant={quickFilters.featured ? 'filled' : 'outlined'}
            sx={{
              bgcolor: quickFilters.featured ? '#00838F' : 'transparent',
              color: quickFilters.featured ? 'white' : '#666',
              borderColor: '#00838F',
            }}
          />
        </Box>
      </Card>

      {/* Results Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontSize: 14, color: '#666' }}>
          {totalResults} vendors found
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={currentFilters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
              label="Sort By"
              sx={{ fontSize: 14 }}
            >
              <MenuItem value="recommended">Recommended</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="reviews">Most Reviews</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 13, color: '#666', mb: 1 }}>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {currentFilters.location.city && (
              <Chip
                label={`City: ${currentFilters.location.city}`}
                size="small"
                onDelete={() => onFilterChange({ ...currentFilters, location: { ...currentFilters.location, city: '' } })}
              />
            )}
            {currentFilters.location.area && (
              <Chip
                label={`Area: ${currentFilters.location.area}`}
                size="small"
                onDelete={() => onFilterChange({ ...currentFilters, location: { ...currentFilters.location, area: '' } })}
              />
            )}
            {currentFilters.rating > 0 && (
              <Chip
                label={`Rating: ${currentFilters.rating}+ stars`}
                size="small"
                onDelete={() => onFilterChange({ ...currentFilters, rating: 0 })}
              />
            )}
            {currentFilters.availability.date && (
              <Chip
                label={`Date: ${new Date(currentFilters.availability.date).toLocaleDateString()}`}
                size="small"
                onDelete={() => onFilterChange({ ...currentFilters, availability: { ...currentFilters.availability, date: '' } })}
              />
            )}
            {currentFilters.features.map((feature) => (
              <Chip
                key={feature}
                label={feature}
                size="small"
                onDelete={() => onFilterChange({
                  ...currentFilters,
                  features: currentFilters.features.filter(f => f !== feature),
                })}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

// Badge component (simple implementation if not available)
interface BadgeProps {
  badgeContent: number;
  color: 'error' | 'primary';
  children: React.ReactNode;
}

function Badge({ badgeContent, color, children }: BadgeProps) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      {badgeContent > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            bgcolor: color === 'error' ? '#f44336' : '#00838F',
            color: 'white',
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {badgeContent}
        </Box>
      )}
    </Box>
  );
}
