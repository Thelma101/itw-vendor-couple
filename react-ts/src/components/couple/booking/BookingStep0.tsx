import { Box, Typography, Button, Card } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface BookingStep0Props {
  items: Array<{ id: string; name: string; category: string; price: number; image: string }>
  onNext: () => void
}

export default function BookingStep0({ items, onNext }: BookingStep0Props) {
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", color: '#666', mb: 2 }}>
          No vendors selected. Please go back and add vendors to your booking.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/couple/shortlist')}
          sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 700 }}
        >
          Go to Shortlist
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18, color: '#002528', mb: 3 }}>
        Selected Vendors ({items.length})
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((vendor) => (
          <Card
            key={vendor.id}
            sx={{
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: '0.25px solid #E2E8F0',
              '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 2,
                backgroundImage: `url(${vendor.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#002528', mb: 0.5 }}>{vendor.name}</Typography>
              <Typography sx={{ fontSize: 13, color: '#666' }}>{vendor.category}</Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#00838F' }}>₦{vendor.price.toLocaleString()}</Typography>
          </Card>
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={onNext}
        sx={{ mt: 3, bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 700, py: 1.2 }}
      >
        Continue to Event Details
      </Button>
    </Box>
  )
}
