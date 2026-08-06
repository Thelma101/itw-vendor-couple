/**
 * Testimonials — Real couple stories / social proof section.
 *
 * Displays a horizontally scrollable set of testimonial cards
 * from couples who planned their wedding with iTheWed vendors.
 */

import React, { useState } from 'react';
import { Box, Typography, Card, Avatar, IconButton, Rating } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, FormatQuote } from '@mui/icons-material';

interface Testimonial {
  id: string;
  couple: string;
  avatarUrl: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  vendorShoutout: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    couple: 'Chidinma & Emeka',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=faces',
    location: 'Lagos',
    date: 'March 2025',
    rating: 5,
    text: 'iTheWed made our vendor search so easy! We found our dream venue in just two days and the booking process was seamless.',
    vendorShoutout: 'Booked Rosevet Event Center',
  },
  {
    id: 't2',
    couple: 'Amaka & Obinna',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    location: 'Abuja',
    date: 'February 2025',
    rating: 5,
    text: 'The photographer we found through iTheWed captured every moment perfectly. The preview gallery feature saved us hours of searching.',
    vendorShoutout: 'Hired Lens & Love Photography',
  },
  {
    id: 't3',
    couple: 'Funke & Adebayo',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    location: 'Port Harcourt',
    date: 'January 2025',
    rating: 4.5,
    text: 'Being able to compare vendors side-by-side and see real reviews from other couples gave us the confidence to make the right choices.',
    vendorShoutout: 'Used Budget Tracker & Checklist',
  },
  {
    id: 't4',
    couple: 'Ngozi & Chinedu',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    location: 'Enugu',
    date: 'December 2024',
    rating: 5,
    text: 'From our caterer to our decorator, every vendor we hired through iTheWed exceeded our expectations. This platform is a game-changer!',
    vendorShoutout: 'Booked 5 vendors on iTheWed',
  },
];

const Testimonials: React.FC = () => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const maxIndex = Math.max(0, TESTIMONIALS.length - 2);

  const handlePrev = () => setScrollIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setScrollIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 }, bgcolor: '#ffffff' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
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
          Love Stories from Real Couples
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
          See how couples made their perfect day happen
        </Typography>

        {/* Carousel controls */}
        <Box sx={{ position: 'relative' }}>
          {scrollIndex > 0 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
            >
              <ArrowBackIos sx={{ fontSize: 18, ml: 0.5 }} />
            </IconButton>
          )}
          {scrollIndex < maxIndex && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
            >
              <ArrowForwardIos sx={{ fontSize: 18 }} />
            </IconButton>
          )}

          {/* Cards */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              overflow: 'hidden',
              transition: 'transform 0.4s ease',
            }}
          >
            {TESTIMONIALS.map((t) => (
              <Card
                key={t.id}
                sx={{
                  minWidth: { xs: '90%', sm: '45%', md: '30%' },
                  flex: '0 0 auto',
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid rgba(0,131,143,0.1)',
                  boxShadow: '0 2px 12px rgba(0,37,40,0.06)',
                  transform: `translateX(-${scrollIndex * 105}%)`,
                  transition: 'transform 0.4s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <FormatQuote sx={{ fontSize: 32, color: '#EB1948', opacity: 0.3 }} />
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    color: '#374151',
                    lineHeight: 1.7,
                    flex: 1,
                  }}
                >
                  "{t.text}"
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <Avatar
                    src={t.avatarUrl}
                    alt={t.couple}
                    sx={{ width: 44, height: 44 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#002528',
                      }}
                    >
                      {t.couple}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: 12,
                        color: '#8a8a8a',
                      }}
                    >
                      {t.location} · {t.date}
                    </Typography>
                  </Box>
                  <Rating value={t.rating} precision={0.5} size="small" readOnly />
                </Box>

                <Box
                  sx={{
                    bgcolor: '#e0f7fa',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#00838F',
                    }}
                  >
                    {t.vendorShoutout}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Testimonials;
