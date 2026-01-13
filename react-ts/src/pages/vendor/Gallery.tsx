import { Box, Typography, Button, Rating } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Mock vendor services data
const vendorServices = [
  {
    id: 1,
    name: 'Denver Music Crew',
    category: 'Music',
    price: '500,000',
    capacity: 500,
    location: 'Idumota, Lagos',
    negotiable: true,
    rating: 4.6,
    reviews: 580,
    image:
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Dove Cars Nig Ltd',
    category: 'Car Rentals',
    price: '500,000',
    capacity: 500,
    location: 'Idumota, Lagos',
    negotiable: true,
    rating: 4.6,
    reviews: 580,
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=150&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=150&fit=crop',
      'https://images.unsplash.com/photo-1542362567-b07e54a88ca5?w=200&h=150&fit=crop',
    ],
  },
  {
    id: 3,
    name: 'Rings of Fire',
    category: 'Wedding Ring',
    price: '500,000',
    capacity: 500,
    location: 'Idumota, Lagos',
    negotiable: true,
    rating: 4.6,
    reviews: 580,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=150&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=150&fit=crop',
    ],
  },
];

const Gallery = () => {
  return (
    <Box>
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

      {/* Service Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {vendorServices.map((service) => (
          <Box
            key={service.id}
            sx={{
              bgcolor: 'white',
              border: '0.25px solid #00838F',
              borderRadius: '0px',
              p: 3,
              display: 'flex',
              gap: 3,
            }}
          >
            {/* Image Gallery */}
            <Box sx={{ flex: '0 0 375px' }}>
              {service.images ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1,
                    height: '283px',
                  }}
                >
                  {service.images.map((img, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '0px',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, rgba(0,37,40,0) 0%, rgba(0,37,40,0.55) 100%)',
                          pointerEvents: 'none',
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    height: '283px',
                    backgroundImage: `url(${service.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,37,40,0) 0%, rgba(0,37,40,0.55) 100%)',
                      pointerEvents: 'none',
                    },
                  }}
                />
              )}
            </Box>

            {/* Service Details */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '20px',
                  color: '#002528',
                  mb: 1,
                }}
              >
                {service.name}
              </Typography>

              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '12px',
                  color: '#8A8A8A',
                  mb: 2,
                }}
              >
                Category | {service.category}
              </Typography>

              <Box sx={{ height: '1px', bgcolor: '#8A8A8A', mb: 2 }} />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '14px',
                      color: '#00838F',
                      mb: 0.5,
                    }}
                  >
                    Starting Price
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '20px',
                      color: '#002528',
                    }}
                  >
                    N{service.price}
                  </Typography>
                </Box>
                <Box />
              </Box>

              <Box sx={{ display: 'flex', gap: 6, mb: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '14px',
                      color: '#8A8A8A',
                      mb: 0.5,
                    }}
                  >
                    Capacity
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '14px',
                      color: '#8A8A8A',
                    }}
                  >
                    {service.capacity}
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
                    Location
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: '#8A8A8A' }} />
                    <Typography
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '14px',
                        color: '#8A8A8A',
                      }}
                    >
                      {service.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '14px',
                    color: '#002528',
                  }}
                >
                  Negotiable?
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#002528',
                  }}
                >
                  {service.negotiable ? 'Yes' : 'No'}
                </Typography>
              </Box>

              {/* Rating & Button */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={service.rating} precision={0.1} readOnly size="small" />
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '14px',
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.6)',
                      px: 1,
                      py: 0.5,
                      borderRadius: '4px',
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      {service.rating}
                    </Box>{' '}
                    ({service.reviews})
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  sx={{
                    border: '1px solid #EB1948',
                    color: 'transparent',
                    background: 'linear-gradient(223deg, #EB1948 65%, #B52344 232%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      border: '1px solid #EB1948',
                      bgcolor: 'rgba(235, 25, 72, 0.04)',
                    },
                  }}
                >
                  Get in touch
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Gallery;
