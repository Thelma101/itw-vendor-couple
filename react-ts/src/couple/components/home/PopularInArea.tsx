/**
 * PopularInArea — Location-based vendor recommendations.
 *
 * Shows popular vendors in the user's area (defaults to Lagos).
 * Includes a location toggle for other Nigerian cities.
 */

import React, { useState, useMemo } from 'react';
import { Box, Typography, Chip, Card, Rating, Button } from '@mui/material';
import { LocationOn, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface AreaVendor {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: string;
  location: string;
  area: string;
  trending?: boolean;
}

const AREA_VENDORS: AreaVendor[] = [
  {
    id: 'a1', name: 'Rosevet Event Center', category: 'Venue',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=250&fit=crop',
    rating: 4.8, reviewCount: 245, price: 'N500,000', location: 'Ikeja, Lagos', area: 'Lagos', trending: true,
  },
  {
    id: 'a2', name: 'Lens & Love Photography', category: 'Photography',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=250&fit=crop',
    rating: 4.7, reviewCount: 189, price: 'N200,000', location: 'Victoria Island, Lagos', area: 'Lagos', trending: true,
  },
  {
    id: 'a3', name: 'Bloom & Blossom', category: 'Florist',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be99c3?w=400&h=250&fit=crop',
    rating: 4.8, reviewCount: 112, price: 'N80,000', location: 'Ikeja, Lagos', area: 'Lagos',
  },
  {
    id: 'a4', name: 'Glamour Beauty Studio', category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop',
    rating: 4.9, reviewCount: 134, price: 'N75,000', location: 'Surulere, Lagos', area: 'Lagos',
  },
  {
    id: 'a5', name: 'Capital Venues', category: 'Venue',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=250&fit=crop',
    rating: 4.6, reviewCount: 98, price: 'N450,000', location: 'Maitama, Abuja', area: 'Abuja',
  },
  {
    id: 'a6', name: 'Abuja Clicks', category: 'Photography',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=250&fit=crop',
    rating: 4.5, reviewCount: 76, price: 'N180,000', location: 'Wuse, Abuja', area: 'Abuja',
  },
  {
    id: 'a7', name: 'Garden City Events', category: 'Venue',
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=250&fit=crop',
    rating: 4.4, reviewCount: 54, price: 'N350,000', location: 'GRA, Port Harcourt', area: 'Port Harcourt',
  },
  {
    id: 'a8', name: 'PH Lens Studios', category: 'Photography',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=250&fit=crop',
    rating: 4.3, reviewCount: 42, price: 'N150,000', location: 'Trans Amadi, PH', area: 'Port Harcourt',
  },
];

const AREAS = ['Lagos', 'Abuja', 'Port Harcourt'];

const PopularInArea: React.FC = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('Lagos');

  const filtered = useMemo(
    () => AREA_VENDORS.filter((v) => v.area === selectedArea),
    [selectedArea],
  );

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 }, bgcolor: '#f0fdfa' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <LocationOn sx={{ color: '#00838F', fontSize: 28 }} />
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: { xs: 22, md: 28 },
              fontWeight: 700,
              color: '#002528',
            }}
          >
            Popular in Your Area
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 16,
            color: '#8a8a8a',
            textAlign: 'center',
            mb: 3,
          }}
        >
          Top-rated vendors near you
        </Typography>

        {/* Area chips */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
          {AREAS.map((area) => (
            <Chip
              key={area}
              label={area}
              clickable
              onClick={() => setSelectedArea(area)}
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                px: 1,
                bgcolor: selectedArea === area ? '#00838F' : 'white',
                color: selectedArea === area ? 'white' : '#002528',
                border: '1px solid',
                borderColor: selectedArea === area ? '#00838F' : '#d1d5db',
                '&:hover': {
                  bgcolor: selectedArea === area ? '#006b75' : '#e0f7fa',
                },
              }}
            />
          ))}
        </Box>

        {/* Vendor grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {filtered.map((v) => (
            <Card
              key={v.id}
              onClick={() => navigate(`/couple/vendor/${v.id}`)}
              sx={{
                borderRadius: 2,
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,37,40,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 20px rgba(0,37,40,0.12)',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={v.image}
                  alt={v.name}
                  loading="lazy"
                  sx={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                {v.trending && (
                  <Chip
                    icon={<TrendingUp sx={{ fontSize: 14, color: 'white !important' }} />}
                    label="Trending"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: '#EB1948',
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 600,
                      height: 24,
                    }}
                  />
                )}
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#002528',
                    mb: 0.5,
                  }}
                >
                  {v.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 12,
                    color: '#8a8a8a',
                    mb: 1,
                  }}
                >
                  {v.category} · {v.price}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={v.rating} precision={0.1} size="small" readOnly />
                  <Typography sx={{ fontFamily: "'Open Sans'", fontSize: 12, color: '#8a8a8a' }}>
                    ({v.reviewCount})
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            onClick={() =>
              navigate(`/couple/search-results?location=${encodeURIComponent(selectedArea)}`)
            }
            sx={{
              color: '#00838F',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              textTransform: 'none',
              textDecoration: 'underline',
              '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' },
            }}
          >
            View all vendors in {selectedArea} →
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PopularInArea;
