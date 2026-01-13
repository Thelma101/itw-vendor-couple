import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan = 'STANDARD', price = '₦50,000' } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState('');

  const handlePayment = () => {
    // Redirect to success page
    navigate('/vendor/subscription/success', { state: { plan, price } });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        maxWidth: '600px',
        mx: 'auto',
      }}
    >
      {/* Plan Info */}
      <Typography
        sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: '24px',
          color: '#222',
          mb: 0.5,
          textAlign: 'center',
        }}
      >
        {plan}
      </Typography>
      <Typography
        sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: '12px',
          color: '#FA144A',
          mb: 3,
          textAlign: 'center',
        }}
      >
        PACKAGE
      </Typography>

      <Typography
        sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: '16px',
          color: '#444',
          mb: 4,
          textAlign: 'center',
          maxWidth: '505px',
        }}
      >
        You're are about to subscribe to the Standard plan which cost{' '}
        <Box component="span" sx={{ fontWeight: 700 }}>
          N50,000 per annum.
        </Box>
      </Typography>

      {/* Payment Method Selection */}
      <Typography
        sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: '15px',
          color: '#00838F',
          mb: 3,
        }}
      >
        Select Payment Method
      </Typography>

      <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          <FormControlLabel
            value="paystack"
            control={<Radio />}
            label={
              <Box
                sx={{
                  width: '210px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ml: 2,
                }}
              >
                <img
                  src="https://paystack.com/assets/img/logo/paystack.svg"
                  alt="Paystack"
                  style={{ height: '30px' }}
                />
              </Box>
            }
            sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', p: 1, m: 0 }}
          />
          <FormControlLabel
            value="flutterwave"
            control={<Radio />}
            label={
              <Box
                sx={{
                  width: '167px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ml: 2,
                }}
              >
                <img
                  src="https://flutterwave.com/images/logo-colored.svg"
                  alt="Flutterwave"
                  style={{ height: '25px' }}
                />
              </Box>
            }
            sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', p: 1, m: 0 }}
          />
        </Box>
      </RadioGroup>

      <Button
        variant="contained"
        disabled={!selectedMethod}
        onClick={handlePayment}
        sx={{
          bgcolor: '#00838F',
          color: 'white',
          borderRadius: '100px',
          px: 6,
          py: 1.5,
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: '16px',
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#006B76',
          },
          '&:disabled': {
            bgcolor: '#CCC',
          },
        }}
      >
        Continue to Payment
      </Button>
    </Box>
  );
};

export default PaymentMethod;
