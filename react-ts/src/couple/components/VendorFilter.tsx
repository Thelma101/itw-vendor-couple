import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';

interface FilterFormProps {
  onApplyFilter?: (filters: FilterState) => void;
  hasCapacity?: boolean;
}

interface FilterState {
  state: string;
  city: string;
  price: string;
  capacity?: string;
}

export default function VendorFilter({ onApplyFilter, hasCapacity = false }: FilterFormProps) {
  const [filters, setFilters] = useState<FilterState>({
    state: 'Lagos',
    city: 'Victoria Island',
    price: '1,000,000',
    capacity: '2,000',
  });

  const handleInputChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilter = () => {
    if (onApplyFilter) {
      onApplyFilter(filters);
    }
  };

  return (
    <Box
      sx={{
        p: '34px 46px',
        bgcolor: 'white',
        width: 352,
        position: 'relative',
      }}
    >
      {/* State Field */}
      <Box sx={{ mb: '23px', position: 'relative' }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            mb: '13.5px',
            color: '#002528',
            lineHeight: 'normal',
          }}
        >
          State
        </Typography>
        <TextField
          fullWidth
          value={filters.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
          placeholder="Lagos"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 35,
              borderRadius: '10px',
              bgcolor: 'white',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              color: '#8a8a8a',
              '& fieldset': {
                borderColor: '#8a8a8a',
                borderWidth: '0.5px',
              },
              '&:hover fieldset': {
                borderColor: '#8a8a8a',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#8a8a8a',
                borderWidth: '0.5px',
              },
              '& input': {
                padding: '8px 16px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 14,
              }
            },
          }}
        />
      </Box>

      {/* City Field */}
      <Box sx={{ mb: '23px', position: 'relative' }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            mb: '13.5px',
            color: '#002528',
            lineHeight: 'normal',
          }}
        >
          City
        </Typography>
        <TextField
          fullWidth
          value={filters.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          placeholder="Victoria Island"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 34,
              borderRadius: '10px',
              bgcolor: 'white',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              color: '#8a8a8a',
              '& fieldset': {
                borderColor: '#8a8a8a',
                borderWidth: '0.5px',
              },
              '&:hover fieldset': {
                borderColor: '#8a8a8a',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#8a8a8a',
                borderWidth: '0.5px',
              },
              '& input': {
                padding: '8px 16px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 14,
              }
            },
          }}
        />
      </Box>

      {/* Price Field */}
      <Box sx={{ mb: hasCapacity ? '23px' : '22px', position: 'relative' }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            mb: '13.5px',
            color: '#002528',
            lineHeight: 'normal',
          }}
        >
          Price
        </Typography>
        <TextField
          fullWidth
          value={filters.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          placeholder="1,000,000"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 35,
              borderRadius: '10px',
              bgcolor: 'white',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              color: '#8a8a8a',
              '& fieldset': {
                borderColor: '#8a8a8a',
                borderWidth: '0.5px',
              },
              '&:hover fieldset': {
                borderColor: '#8a8a8a',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#8a8a8a',
                borderWidth: '0.5px',
              },
              '& input': {
                padding: '8px 16px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 14,
              }
            },
          }}
        />
      </Box>

      {/* Capacity Field - Conditional */}
      {hasCapacity && (
        <Box sx={{ mb: '22px', position: 'relative' }}>
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              mb: '13.5px',
              color: '#002528',
              lineHeight: 'normal',
            }}
          >
            Capacity
          </Typography>
          <TextField
            fullWidth
            value={filters.capacity}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            placeholder="2,000"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 35,
                borderRadius: '10px',
                bgcolor: 'white',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 14,
                color: '#8a8a8a',
                '& fieldset': {
                  borderColor: '#8a8a8a',
                  borderWidth: '0.5px',
                },
                '&:hover fieldset': {
                  borderColor: '#8a8a8a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8a8a8a',
                  borderWidth: '0.5px',
                },
                '& input': {
                  padding: '8px 16px',
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 14,
                }
              },
            }}
          />
        </Box>
      )}

      {/* Save Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleApplyFilter}
        sx={{
          background: 'linear-gradient(210.5deg, #EB1948 65.18%, #B52344 232.03%)',
          color: 'white',
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          py: '10px',
          borderRadius: '10px',
          textTransform: 'none',
          lineHeight: 'normal',
          height: 'auto',
          '&:hover': {
            background: 'linear-gradient(210.5deg, #d41840 65.18%, #9e1e3a 232.03%)',
          },
        }}
      >
        Save
      </Button>
    </Box>
  );
}
