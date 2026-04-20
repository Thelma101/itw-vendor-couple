/* eslint-disable react-refresh/only-export-components */
/**
 * RecentlyViewed — Shows vendors the user has recently viewed.
 *
 * Reads from localStorage to persist across sessions.
 * Renders nothing if the user hasn't viewed any vendors yet.
 *
 * To track a vendor view, call `addRecentlyViewed(vendor)` from any page.
 */

import React, { useMemo } from 'react';
import { Box, Typography, Card, Rating } from '@mui/material';
import { LocationOn, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  Types & Storage                                                    */
/* ------------------------------------------------------------------ */

export interface RecentVendor {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: string;
  location: string;
}

const STORAGE_KEY = 'itw_recently_viewed';
const MAX_RECENT = 10;

/** Call this when a user views a vendor profile to track it. */
export function addRecentlyViewed(vendor: RecentVendor): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: RecentVendor[] = raw ? JSON.parse(raw) : [];
    // Remove duplicate
    const filtered = list.filter((v) => v.id !== vendor.id);
    // Prepend
    filtered.unshift(vendor);
    // Trim
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_RECENT)));
  } catch {
    // ignore
  }
}

/** Read the recently viewed list. */
export function getRecentlyViewed(): RecentVendor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const RecentlyViewed: React.FC = () => {
  const navigate = useNavigate();
  const vendors = useMemo(() => getRecentlyViewed(), []);

  // Don't render if no history
  if (vendors.length === 0) return null;

  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 4 }, bgcolor: 'white' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <History sx={{ color: '#00838F', fontSize: 24 }} />
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: '#002528',
            }}
          >
            Recently Viewed
          </Typography>
        </Box>

        {/* Horizontal scroll */}
        <Box
          sx={{
            display: 'flex',
            gap: 2.5,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-track': { bgcolor: '#f1f1f1', borderRadius: 3 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#00838F', borderRadius: 3 },
          }}
        >
          {vendors.map((v) => (
            <Card
              key={v.id}
              onClick={() => navigate(`/couple/vendor/${v.id}`)}
              sx={{
                minWidth: 220,
                maxWidth: 220,
                borderRadius: 2,
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,37,40,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 16px rgba(0,37,40,0.12)',
                },
              }}
            >
              <Box
                component="img"
                src={v.image}
                alt={v.name}
                loading="lazy"
                sx={{ width: '100%', height: 130, objectFit: 'cover' }}
              />
              <Box sx={{ p: 1.5 }}>
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#002528',
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {v.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 11,
                    color: '#8a8a8a',
                    mb: 0.5,
                  }}
                >
                  {v.category}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={v.rating} precision={0.1} size="small" readOnly />
                  <Typography sx={{ fontSize: 11, color: '#8a8a8a' }}>
                    ({v.reviewCount})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14, color: '#8a8a8a' }} />
                  <Typography sx={{ fontSize: 11, color: '#8a8a8a' }}>{v.location}</Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default RecentlyViewed;
