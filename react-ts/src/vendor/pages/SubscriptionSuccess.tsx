import { Box, Typography, Button, Card } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import { useEffect, useState } from 'react';

const SubscriptionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan = 'STANDARD', price = '₦50,000' } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const features = {
    STANDARD: [
      '10 Service Listings',
      'Unlimited Availability Calendar',
      'Featured in Search Results',
      '24/7 Customer Support',
      'Analytics Dashboard',
      'Email Notifications',
    ],
    PREMIUM: [
      'Unlimited Service Listings',
      'Unlimited Availability Calendar',
      'Featured in Top 10 Results',
      '24/7 Priority Support',
      'Advanced Analytics',
      'Email & SMS Notifications',
      'Dedicated Account Manager',
    ],
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        maxWidth: '700px',
        mx: 'auto',
        position: 'relative',
      }}
    >
      {/* Confetti Effect */}
      {showConfetti && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
            animation: 'fadeOut 1s ease-in 2s forwards',
            '@keyframes fadeOut': {
              to: { opacity: 0 },
            },
          }}
        >
          {[...Array(50)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                bgcolor: ['#00838F', '#FA144A', '#eceba2', '#FFB800'][i % 4],
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animation: `fall ${2 + Math.random() * 3}s linear ${
                  Math.random() * 2
                }s forwards`,
                '@keyframes fall': {
                  to: {
                    transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`,
                  },
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Success Icon */}
      <CheckCircleIcon
        sx={{
          fontSize: 100,
          color: '#00838F',
          mb: 3,
          animation: 'scaleIn 0.5s ease-out',
          '@keyframes scaleIn': {
            '0%': { transform: 'scale(0)', opacity: 0 },
            '50%': { transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)', opacity: 1 },
          },
        }}
      />

      {/* Success Message */}
      <Typography
        sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: '32px',
          color: '#002528',
          mb: 2,
          textAlign: 'center',
        }}
      >
        Welcome to {plan} Plan!
      </Typography>

      <Typography
        sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: '18px',
          color: '#555',
          mb: 4,
          textAlign: 'center',
        }}
      >
        Your subscription has been activated successfully
      </Typography>

      {/* Plan Details Card */}
      <Card
        sx={{
          width: '100%',
          bgcolor: 'white',
          borderRadius: '15px',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          p: 4,
          mb: 4,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: '20px',
              color: '#002528',
              mb: 1,
            }}
          >
            Subscription Details
          </Typography>
          <Box sx={{ height: '2px', width: '60px', bgcolor: '#00838F' }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                color: '#8A8A8A',
                mb: 0.5,
              }}
            >
              Plan Type
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                fontSize: '16px',
                color: '#002528',
              }}
            >
              {plan}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                color: '#8A8A8A',
                mb: 0.5,
              }}
            >
              Amount Paid
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                fontSize: '16px',
                color: '#00838F',
              }}
            >
              {price}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                color: '#8A8A8A',
                mb: 0.5,
              }}
            >
              Billing Cycle
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                fontSize: '16px',
                color: '#002528',
              }}
            >
              Annual
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                color: '#8A8A8A',
                mb: 0.5,
              }}
            >
              Next Billing Date
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                fontSize: '16px',
                color: '#002528',
              }}
            >
              {new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              ).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ bgcolor: '#F5F5F5', borderRadius: '10px', p: 3, mt: 3 }}>
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: '16px',
              color: '#002528',
              mb: 2,
            }}
          >
            Features Unlocked
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
            {(features[plan as keyof typeof features] || features.STANDARD).map(
              (feature, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#00838F' }} />
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '14px',
                      color: '#002528',
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </Box>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{
            flex: 1,
            border: '1px solid #00838F',
            color: '#00838F',
            borderRadius: '100px',
            py: 1.5,
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 600,
            fontSize: '16px',
            textTransform: 'none',
            '&:hover': {
              border: '1px solid #00838F',
              bgcolor: 'rgba(0, 131, 143, 0.04)',
            },
          }}
        >
          Download Receipt
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate('/vendor/gallery')}
          sx={{
            flex: 1,
            bgcolor: '#00838F',
            color: 'white',
            borderRadius: '100px',
            py: 1.5,
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 600,
            fontSize: '16px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#006B76',
            },
          }}
        >
          Go to Dashboard
        </Button>
      </Box>

      <Typography
        sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: '14px',
          color: '#8A8A8A',
          mt: 4,
          textAlign: 'center',
        }}
      >
        A confirmation email has been sent to your registered email address
      </Typography>
    </Box>
  );
};

export default SubscriptionSuccess;
