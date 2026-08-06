import { Box, Typography, Button, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';

const SubscriptionPage = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: 'BASIC',
      price: 'FREE',
      active: true,
      features: [
        'One Listing',
        '30 Days Availability',
        'Standard Listing',
        'Limited Support',
      ],
      buttonText: 'GET 1 MONTH FREE',
      buttonColor: '#FA144A',
    },
    {
      name: 'STANDARD',
      price: '₦20K',
      active: false,
      featured: true,
      features: [
        '10 Listing',
        'Unlimited Availability',
        'Featured In the Results',
        '24/7 Support',
      ],
      buttonText: 'SELECT PLAN',
      buttonColor: 'white',
    },
    {
      name: 'PREMIUM',
      price: '₦50K',
      active: false,
      features: [
        'Unlimited Listings',
        'Unlimited Availability',
        'Featured In Top 10 Results',
        '24/7 Priority Support',
      ],
      buttonText: 'SELECT PLAN',
      buttonColor: '#FA144A',
    },
  ];

  return (
    <Box sx={{ maxWidth: '900px' }}>
      <Typography
        sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: '20px',
          color: '#181818',
          mb: 3,
        }}
      >
        User Profile
      </Typography>

      {/* My Earnings Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            color: '#2D2D2D',
            mb: 2,
          }}
        >
          My Earnings
        </Typography>

        <Card
          sx={{
            bgcolor: 'white',
            borderRadius: '15px',
            boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2)',
            p: 3,
            display: 'flex',
            gap: 4,
          }}
        >
          {/* Donut Chart Placeholder */}
          <Box
            sx={{
              width: '112px',
              height: '112px',
              borderRadius: '50%',
              background: 'conic-gradient(#eceba2 0deg 288deg, #FA144A 288deg 360deg)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                bgcolor: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '24px',
                  color: '#002528',
                }}
              >
                ₦1.1M
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  color: '#555',
                }}
              >
                Total
              </Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', bgcolor: '#eceba2' }} />
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '12px',
                    color: '#002528',
                  }}
                >
                  Earning from Couples
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#002528',
                  ml: 2,
                }}
              >
                ₦1,020,000
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', bgcolor: '#FA144A' }} />
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '12px',
                    color: '#002528',
                  }}
                >
                  Earning from vendors
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#002528',
                  ml: 2,
                }}
              >
                ₦80,000
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Pricing Plan Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            color: '#2D2D2D',
            mb: 2,
          }}
        >
          Pricing Plan
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '14px',
              color: '#002528',
            }}
          >
            <Box component="span" sx={{ fontWeight: 700, color: '#555' }}>
              Plan Type:{' '}
            </Box>
            Free - Basic
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '12px',
              color: '#002528',
            }}
          >
            <Box component="span" sx={{ fontWeight: 700, color: '#555' }}>
              Time Duration:{' '}
            </Box>
            Started: Aug 18, 2018 -{' '}
            <Box component="span" sx={{ color: '#FA144A' }}>
              Expired: Aug 18, 2019
            </Box>
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              sx={{
                bgcolor: plan.featured ? '#00838F' : 'white',
                borderRadius: '15px',
                boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2)',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {plan.active && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bgcolor: '#FA144A',
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '12px',
                      color: 'white',
                    }}
                  >
                    Current Active
                  </Typography>
                </Box>
              )}

              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  color: plan.featured ? 'white' : '#002528',
                  textAlign: 'center',
                  mt: plan.active ? 3 : 0,
                  mb: 2,
                }}
              >
                {plan.name}
              </Typography>

              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '36px',
                  color: plan.featured ? 'white' : '#002528',
                  textAlign: 'center',
                  mb: 3,
                }}
              >
                {plan.price}
              </Typography>

              <Box sx={{ flex: 1, mb: 3 }}>
                {plan.features.map((feature, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <CheckIcon
                      sx={{
                        fontSize: 14,
                        color: plan.featured ? 'white' : '#00838F',
                        mt: 0.5,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '16px',
                        color: plan.featured ? 'white' : '#555',
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  if (!plan.active) {
                    navigate('/vendor/payment', {
                      state: { plan: plan.name, price: plan.price },
                    });
                  }
                }}
                sx={{
                  bgcolor: plan.featured ? 'white' : plan.buttonColor,
                  color: plan.featured ? '#00838F' : 'white',
                  borderRadius: '100px',
                  py: 0.75,
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  '&:hover': {
                    bgcolor: plan.featured ? '#F5F5F5' : plan.buttonColor,
                    opacity: 0.9,
                  },
                }}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SubscriptionPage;
