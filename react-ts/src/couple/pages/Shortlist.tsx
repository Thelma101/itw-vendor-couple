import { Box, Typography, Button, IconButton, Paper } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useShortlist } from '@/shared/contexts/ShortlistContext';
import { useNavigate } from 'react-router-dom';
import Nav from '@/couple/components/Nav';
import { useAccount } from '@/shared/contexts/AccountContext';
import { VendorImage, priceLabel } from '@/couple/live/liveVendor';

const actionBtnSx = {
  textTransform: 'none',
  fontFamily: "'Open Sans', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 2,
} as const;

export default function Shortlist() {
  const { items, removeFromShortlist, clearShortlist } = useShortlist();
  const { isDemo } = useAccount();
  const navigate = useNavigate();

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const compareIds = items.slice(0, 3).map((i) => i.id).join(',');

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff6f9' }}>
      <Nav />
      <Box 
        sx={{ 
          px: { xs: 2, sm: 4, md: '70px' },
          pt: { xs: 3, md: '40px' },
          pb: 4,
        }}
      >
        {/* Breadcrumb */}
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            color: '#8a8a8a',
            mb: 3,
            cursor: 'pointer',
            '& span': {
              color: '#00838F',
              fontWeight: 600,
            }
          }}
          onClick={() => navigate(isDemo ? '/couple/select-vendors' : '/couple/dashboard')}
        >
          Home &gt; <span>Shortlist</span>
        </Typography>

        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 0,
            border: '1px solid #ccfdf2',
            boxShadow: 'none',
            bgcolor: 'white',
            minHeight: '500px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                fontSize: { xs: 20, md: 24 },
                color: '#002528',
              }}
            >
              Your Shortlist ({items.length} {items.length === 1 ? 'vendor' : 'vendors'})
            </Typography>
            {items.length > 0 && (
              <Button
                onClick={clearShortlist}
                sx={{
                  color: '#EB1948',
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Clear All
              </Button>
            )}
          </Box>

          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 18,
                  color: '#8a8a8a',
                  mb: 3,
                }}
              >
                Your shortlist is empty
              </Typography>
              <Button
                onClick={() => navigate('/couple/search-results')}
                sx={{
                  bgcolor: '#0F766E',
                  color: 'white',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: 'none',
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#0D9488',
                    boxShadow: 'none',
                  }
                }}
              >
                Browse vendors
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                {items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid #f0f0f0',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}
                  >
                    {isDemo ? (
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: { xs: '100%', sm: 100 },
                          height: { xs: 200, sm: 100 },
                          objectFit: 'cover',
                          bgcolor: '#d9d9d9',
                        }}
                      />
                    ) : (
                      <VendorImage
                        src={item.image}
                        name={item.name}
                        onClick={() => navigate(`/couple/vendor/${item.id}`)}
                        sx={{ width: { xs: '100%', sm: 100 }, height: { xs: 200, sm: 100 }, flexShrink: 0 }}
                      />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        onClick={isDemo ? undefined : () => navigate(`/couple/vendor/${item.id}`)}
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: 16,
                          color: '#00838F',
                          mb: 0.5,
                          cursor: isDemo ? undefined : 'pointer',
                          '&:hover': isDemo ? undefined : { textDecoration: 'underline' },
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: 14,
                          color: '#8a8a8a',
                          mb: 1,
                        }}
                      >
                        {item.category}
                        {!isDemo && item.location ? ` · ${item.location}` : ''}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: "'Open Sans', sans-serif",
                              fontSize: 12,
                              color: '#8a8a8a',
                            }}
                          >
                            Price
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "'Open Sans', sans-serif",
                              fontWeight: 700,
                              fontSize: 16,
                              color: '#002528',
                            }}
                          >
                            {isDemo ? formatPrice(item.price) : priceLabel(item.price, 'From ')}
                          </Typography>
                        </Box>
                        {item.capacity && (
                          <Box>
                            <Typography
                              sx={{
                                fontFamily: "'Open Sans', sans-serif",
                                fontSize: 12,
                                color: '#8a8a8a',
                              }}
                            >
                              Capacity
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "'Open Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: 16,
                                color: '#002528',
                              }}
                            >
                              {item.capacity}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      {!isDemo && item.notes ? (
                        <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#475569', mt: 1, fontStyle: 'italic' }}>
                          “{item.notes}”
                        </Typography>
                      ) : null}
                      {!isDemo ? (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/couple/vendor/${item.id}`)}
                            sx={{ ...actionBtnSx, borderColor: '#00838F', color: '#00838F' }}
                          >
                            View profile
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/couple/messages?vendor=${encodeURIComponent(item.id)}`)}
                            sx={{ ...actionBtnSx, borderColor: '#CBD5E1', color: '#334155' }}
                          >
                            Message
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => navigate(`/couple/booking?vendor=${encodeURIComponent(item.id)}`)}
                            sx={{ ...actionBtnSx, bgcolor: '#0F766E', boxShadow: 'none', '&:hover': { bgcolor: '#0D9488', boxShadow: 'none' } }}
                          >
                            Request booking
                          </Button>
                        </Box>
                      ) : null}
                    </Box>
                    <IconButton
                      aria-label={`Remove ${item.name} from shortlist`}
                      onClick={() => removeFromShortlist(item.id)}
                      sx={{
                        color: '#EB1948',
                        alignSelf: { xs: 'flex-end', sm: 'flex-start' }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  borderTop: '2px solid #ccfdf2',
                  pt: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 14,
                      color: '#8a8a8a',
                    }}
                  >
                    {isDemo ? 'Estimated Total' : 'Estimated total (starting prices)'}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 24,
                      color: '#002528',
                    }}
                  >
                    {isDemo || totalPrice > 0 ? formatPrice(totalPrice) : 'To be quoted'}
                  </Typography>
                </Box>
                {!isDemo ? (
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                    <Button
                      onClick={() => navigate('/couple/search-results')}
                      variant="outlined"
                      sx={{ ...actionBtnSx, fontSize: 14, px: 3, py: 1.25, borderRadius: '100px', borderColor: '#00838F', color: '#00838F', flex: { xs: 1, sm: 'none' } }}
                    >
                      Find more vendors
                    </Button>
                    {items.length >= 2 ? (
                      <Button
                        onClick={() => navigate(`/couple/compare?ids=${encodeURIComponent(compareIds)}`)}
                        sx={{
                          ...actionBtnSx,
                          fontSize: 14,
                          px: 4,
                          py: 1.25,
                          borderRadius: '100px',
                          color: 'white',
                          background: 'linear-gradient(233.66deg, #EB1948 65.18%, #B52344 232.03%)',
                          flex: { xs: 1, sm: 'none' },
                          '&:hover': { background: 'linear-gradient(233.66deg, #EB1948 65.18%, #B52344 232.03%)', opacity: 0.9 },
                        }}
                      >
                        Compare {Math.min(items.length, 3)} vendors
                      </Button>
                    ) : null}
                  </Box>
                ) : (
                <Button
                  onClick={() => navigate('/couple/booking')}
                  sx={{
                    background: 'linear-gradient(233.66deg, #EB1948 65.18%, #B52344 232.03%)',
                    color: 'white',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    borderRadius: '100px',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      background: 'linear-gradient(233.66deg, #EB1948 65.18%, #B52344 232.03%)',
                      opacity: 0.9,
                    }
                  }}
                >
                  Proceed to Checkout
                </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
