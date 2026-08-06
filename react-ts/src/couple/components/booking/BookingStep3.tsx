import { Box, Typography, Avatar, Divider } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface BookingStep3Props {
  formData: any
  items: Array<{ id: string; name: string; category: string; price: number; image: string }>
  totalPrice: number
  depositAmount: number
}

export default function BookingStep3({ formData, items, totalPrice, depositAmount }: BookingStep3Props) {
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: '#22c55e', mb: 2 }} />
        <Typography sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: 24,
          color: '#002528',
          mb: 1
        }}>
          Review Your Booking
        </Typography>
        <Typography sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: 14,
          color: '#666'
        }}>
          Please review the details before confirming
        </Typography>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Service Delivery Details Section */}
      <Typography sx={{
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: '#00838F',
        mb: 2,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        Service Delivery Details
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
            Service Date
          </Typography>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
            {formData.serviceDate ? new Date(formData.serviceDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Not set'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
            Service Time
          </Typography>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
            {formData.serviceTime || 'Not set'}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Vendors Section */}
      <Typography sx={{
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: '#00838F',
        mb: 2,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        Vendors ({items.length})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        {items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={item.image} sx={{ width: 32, height: 32 }} />
              <Box>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
                  {item.name}
                </Typography>
                <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#666' }}>
                  {item.category}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
              {formatPrice(item.price)}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Payment Section */}
      <Typography sx={{
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: '#00838F',
        mb: 2,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        Payment Summary
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', fontSize: 14 }}>
            Total Amount
          </Typography>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
            {formatPrice(totalPrice * 1.05)}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: '#f0fdfa',
          borderRadius: 2,
          mt: 1
        }}>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 16 }}>
            Deposit Due Now
          </Typography>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18, color: '#00838F' }}>
            {formatPrice(depositAmount * 1.05)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
