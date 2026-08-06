/**
 * WhyChooseUs — Trust indicators / value propositions section.
 *
 * Displays key platform benefits in a clean grid layout.
 */

import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import {
  Verified,
  Speed,
  CompareArrows,
  Security,
  SupportAgent,
  Savings,
} from '@mui/icons-material';

interface ValueProp {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const VALUE_PROPS: ValueProp[] = [
  {
    icon: <Verified sx={{ fontSize: 36, color: '#00838F' }} />,
    title: 'Verified Vendors',
    description:
      'Every vendor on iTheWed is vetted and reviewed by real couples to ensure quality.',
  },
  {
    icon: <Speed sx={{ fontSize: 36, color: '#EB1948' }} />,
    title: 'Book in Minutes',
    description:
      'Browse, compare, and book your dream vendors — all from one place, in just a few clicks.',
  },
  {
    icon: <CompareArrows sx={{ fontSize: 36, color: '#7B1FA2' }} />,
    title: 'Side-by-Side Compare',
    description:
      'Compare up to 4 vendors at once on pricing, reviews, and availability to make the best choice.',
  },
  {
    icon: <Security sx={{ fontSize: 36, color: '#2E7D32' }} />,
    title: 'Secure Payments',
    description:
      'Your payments are protected with escrow-style security until the service is delivered.',
  },
  {
    icon: <SupportAgent sx={{ fontSize: 36, color: '#FF6F00' }} />,
    title: 'AskWed AI Assistant',
    description:
      'Get instant answers to wedding planning questions with our AI-powered assistant.',
  },
  {
    icon: <Savings sx={{ fontSize: 36, color: '#1565C0' }} />,
    title: 'Budget Tracking',
    description:
      'Stay on top of your wedding budget with real-time tracking and smart spending insights.',
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 }, bgcolor: 'white' }}>
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
          Why Couples Choose iTheWed
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
          Everything you need to plan your perfect wedding
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {VALUE_PROPS.map((prop) => (
            <Card
              key={prop.title}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                boxShadow: 'none',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(0,37,40,0.08)',
                  borderColor: '#00838F',
                },
              }}
            >
              <Box sx={{ mb: 2 }}>{prop.icon}</Box>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#002528',
                  mb: 1,
                }}
              >
                {prop.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 14,
                  color: '#6b7280',
                  lineHeight: 1.6,
                }}
              >
                {prop.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WhyChooseUs;
