/**
 * BrowseByCategory — Visual category cards section for the homepage.
 *
 * Displays vendor categories as clickable cards with icons and vendor counts,
 * helping users quickly jump to the category they need.
 */

import React from 'react';
import { Box, Typography, Card, CardActionArea } from '@mui/material';
import {
  LocationCity,
  CameraAlt,
  LocalFlorist,
  Cake,
  Restaurant,
  Checkroom,
  MusicNote,
  Face,
  Palette,
  DirectionsCar,
  EventNote,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface CategoryCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  vendorCount: number;
  image: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    label: 'Venues',
    value: 'Venue',
    icon: <LocationCity />,
    color: '#00838F',
    vendorCount: 5,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=250&fit=crop',
  },
  {
    label: 'Photographers',
    value: 'Photographer',
    icon: <CameraAlt />,
    color: '#7B1FA2',
    vendorCount: 3,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=250&fit=crop',
  },
  {
    label: 'Florists',
    value: 'Florist',
    icon: <LocalFlorist />,
    color: '#E91E63',
    vendorCount: 2,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be99c3?w=400&h=250&fit=crop',
  },
  {
    label: 'Cakes & Desserts',
    value: 'Cake',
    icon: <Cake />,
    color: '#FF6F00',
    vendorCount: 2,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=250&fit=crop',
  },
  {
    label: 'Catering',
    value: 'Catering',
    icon: <Restaurant />,
    color: '#2E7D32',
    vendorCount: 2,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop',
  },
  {
    label: 'Bridal Wear',
    value: 'Dress & Apparel',
    icon: <Checkroom />,
    color: '#AD1457',
    vendorCount: 2,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=250&fit=crop',
  },
  {
    label: 'Music & DJ',
    value: 'Music',
    icon: <MusicNote />,
    color: '#4527A0',
    vendorCount: 1,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=250&fit=crop',
  },
  {
    label: 'Makeup Artists',
    value: 'Makeup Artist',
    icon: <Face />,
    color: '#C62828',
    vendorCount: 1,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop',
  },
  {
    label: 'Decor & Rentals',
    value: 'Decor & Rentals',
    icon: <Palette />,
    color: '#00695C',
    vendorCount: 1,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop',
  },
  {
    label: 'Transportation',
    value: 'Transportation',
    icon: <DirectionsCar />,
    color: '#37474F',
    vendorCount: 1,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=250&fit=crop',
  },
  {
    label: 'Planners',
    value: 'Wedding Planner',
    icon: <EventNote />,
    color: '#1565C0',
    vendorCount: 1,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
  },
];

const BrowseByCategory: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (value: string) => {
    navigate(`/couple/search-results?category=${encodeURIComponent(value)}`);
  };

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 }, bgcolor: '#f9fafb' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: { xs: 22, md: 28 },
            fontWeight: 700,
            color: '#002528',
            textAlign: 'center',
            mb: 1,
          }}
        >
          Browse by Category
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 16,
            color: '#8a8a8a',
            textAlign: 'center',
            mb: 5,
          }}
        >
          Find the perfect vendor for every part of your big day
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {CATEGORIES.map((cat) => (
            <Card
              key={cat.value}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,37,40,0.08)',
                transition: 'transform 0.25s, box-shadow 0.25s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,37,40,0.15)',
                },
              }}
            >
              <CardActionArea onClick={() => handleCategoryClick(cat.value)}>
                {/* Image with gradient overlay */}
                <Box sx={{ position: 'relative', height: 120 }}>
                  <Box
                    component="img"
                    src={cat.image}
                    alt={cat.label}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to top, ${cat.color}CC 0%, ${cat.color}33 100%)`,
                    }}
                  />
                  {/* Icon & Label */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ color: 'white', display: 'flex' }}>
                      <cat.icon sx={{ fontSize: 22, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'white',
                          lineHeight: 1.2,
                        }}
                      >
                        {cat.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: 11,
                          color: 'rgba(255,255,255,0.85)',
                        }}
                      >
                        {cat.vendorCount} vendor{cat.vendorCount !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BrowseByCategory;
