import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Card,
  Chip,
  Rating,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Add,
  Close,
  Check,
  Star,
  LocationOn,
  Favorite,
  FavoriteBorder,
  Message,
  ShoppingCart,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BackButton from '@/components/BackButton'
import { mockVendors, type Vendor } from '@/data/mockVendors'

interface CompareVendor extends Vendor {
  responseTime?: string
  yearsExperience?: number
  bookingsCompleted?: number
  cancellationPolicy?: string
  depositRequired?: string
  features?: string[]
}

const enhancedVendors: CompareVendor[] = mockVendors.slice(0, 10).map((v, i) => ({
  ...v,
  responseTime: ['< 1 hour', '1-2 hours', '2-4 hours', 'Same day'][i % 4],
  yearsExperience: 3 + (i % 12),
  bookingsCompleted: 50 + (i * 23) % 200,
  cancellationPolicy: ['Full refund 30 days', '50% refund 14 days', 'Non-refundable', 'Full refund 7 days'][i % 4],
  depositRequired: ['25%', '30%', '50%', '20%'][i % 4],
  features: [
    ['Free consultation', 'Custom packages', 'Insurance included'],
    ['24/7 support', 'Rush delivery', 'Premium materials'],
    ['Free revisions', 'Digital gallery', 'Print options'],
    ['Backup equipment', 'Assistant included', 'Travel covered'],
  ][i % 4],
}))

export default function VendorCompare() {
  const theme = useTheme()
  useMediaQuery(theme.breakpoints.down('md')) // For responsive awareness
  const [selectedVendors, setSelectedVendors] = useState<CompareVendor[]>([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  const categories = [...new Set(mockVendors.map(v => v.category))]
  const filteredVendors = categoryFilter 
    ? enhancedVendors.filter(v => v.category === categoryFilter)
    : enhancedVendors

  const addToCompare = (vendor: CompareVendor) => {
    if (selectedVendors.length < 4 && !selectedVendors.find(v => v.id === vendor.id)) {
      setSelectedVendors([...selectedVendors, vendor])
    }
  }

  const removeFromCompare = (vendorId: string) => {
    setSelectedVendors(selectedVendors.filter(v => v.id !== vendorId))
  }

  const toggleFavorite = (vendorId: string) => {
    setFavorites(prev => ({ ...prev, [vendorId]: !prev[vendorId] }))
  }

  const getHighestValue = (key: keyof CompareVendor, isLower = false) => {
    if (selectedVendors.length < 2) return null
    const values = selectedVendors.map(v => v[key] as number).filter(Boolean)
    return isLower ? Math.min(...values) : Math.max(...values)
  }

  const CompareCard = ({ vendor }: { vendor: CompareVendor }) => (
    <Card 
      sx={{ 
        p: 2, 
        position: 'relative',
        minWidth: { xs: 280, md: 'auto' },
        flex: { xs: '0 0 280px', md: 1 },
      }}
    >
      <IconButton
        size="small"
        onClick={() => removeFromCompare(vendor.id)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <Close fontSize="small" />
      </IconButton>
      
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Avatar
          src={vendor.image}
          sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
        />
        <Typography variant="h6" fontWeight={600} noWrap>
          {vendor.name}
        </Typography>
        <Chip label={vendor.category} size="small" sx={{ mt: 0.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
          <Rating value={vendor.rating} readOnly size="small" precision={0.1} />
          <Typography variant="body2" sx={{ ml: 0.5 }}>({vendor.reviewCount})</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <IconButton 
          size="small" 
          onClick={() => toggleFavorite(vendor.id)}
          sx={{ color: favorites[vendor.id] ? '#EB1948' : 'inherit' }}
        >
          {favorites[vendor.id] ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton size="small"><Message /></IconButton>
        <Button
          size="small"
          variant="contained"
          startIcon={<ShoppingCart />}
          sx={{ 
            bgcolor: '#EB1948', 
            '&:hover': { bgcolor: '#c41438' },
            textTransform: 'none',
            fontSize: 12,
          }}
        >
          Book
        </Button>
      </Box>
    </Card>
  )

  const CompareRow = ({ label, getValue, highlight = false, isLower = false }: { 
    label: string; 
    getValue: (v: CompareVendor) => React.ReactNode;
    highlight?: boolean;
    isLower?: boolean;
  }) => {
    const bestValue = highlight ? getHighestValue(label.toLowerCase().replace(/\s/g, '') as keyof CompareVendor, isLower) : null
    
    return (
      <TableRow>
        <TableCell 
          sx={{ 
            fontWeight: 600, 
            bgcolor: '#f5f5f5',
            position: { xs: 'sticky', md: 'static' },
            left: 0,
            zIndex: 1,
            minWidth: { xs: 120, md: 150 },
          }}
        >
          {label}
        </TableCell>
        {selectedVendors.map(vendor => (
          <TableCell 
            key={vendor.id} 
            align="center"
            sx={{ 
              minWidth: { xs: 150, md: 'auto' },
              bgcolor: highlight && getValue(vendor) === bestValue ? '#e8f5e9' : 'inherit',
            }}
          >
            {getValue(vendor)}
          </TableCell>
        ))}
      </TableRow>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9' }}>
      <Nav />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <BackButton fallbackPath="/couple/search-results" sx={{ mb: 2 }} />
          <Typography variant="h4" fontWeight={700} color="#1a1a1a" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            Compare Vendors
          </Typography>
          <Typography color="text.secondary">
            Select up to 4 vendors to compare side-by-side
          </Typography>
        </Box>

        {/* Vendor Selection */}
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' }, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Filter by Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {selectedVendors.length}/4 vendors selected
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              maxHeight: { xs: 200, md: 'none' },
              overflowY: { xs: 'auto', md: 'visible' },
            }}
          >
            {filteredVendors.map(vendor => {
              const isSelected = selectedVendors.find(v => v.id === vendor.id)
              return (
                <Chip
                  key={vendor.id}
                  avatar={<Avatar src={vendor.image} />}
                  label={vendor.name}
                  onClick={() => isSelected ? removeFromCompare(vendor.id) : addToCompare(vendor)}
                  onDelete={isSelected ? () => removeFromCompare(vendor.id) : undefined}
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  sx={{ 
                    height: 40,
                    '& .MuiChip-label': { fontWeight: isSelected ? 600 : 400 },
                  }}
                />
              )
            })}
          </Box>
        </Paper>

        {/* Comparison Section */}
        {selectedVendors.length === 0 ? (
          <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderRadius: 3 }}>
            <Add sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Select vendors to compare</Typography>
            <Typography color="text.secondary">Click on vendor chips above to add them to comparison</Typography>
          </Paper>
        ) : (
          <>
            {/* Vendor Cards */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 3,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 3 },
              }}
            >
              {selectedVendors.map((vendor) => (
                <CompareCard key={vendor.id} vendor={vendor} />
              ))}
            </Box>

            {/* Comparison Table */}
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 3,
                overflowX: 'auto',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#00838F' }}>
                    <TableCell 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 700,
                        position: { xs: 'sticky', md: 'static' },
                        left: 0,
                        bgcolor: '#00838F',
                        zIndex: 2,
                      }}
                    >
                      Feature
                    </TableCell>
                    {selectedVendors.map(vendor => (
                      <TableCell key={vendor.id} align="center" sx={{ color: 'white', fontWeight: 600 }}>
                        {vendor.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <CompareRow 
                    label="Price" 
                    getValue={(v) => (
                      <Typography fontWeight={700} color="#00838F">{v.price}</Typography>
                    )}
                  />
                  <CompareRow 
                    label="Rating" 
                    getValue={(v) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Star sx={{ color: '#F5A623', fontSize: 18 }} />
                        <Typography fontWeight={600}>{v.rating}</Typography>
                      </Box>
                    )}
                    highlight
                  />
                  <CompareRow 
                    label="Reviews" 
                    getValue={(v) => v.reviewCount}
                    highlight
                  />
                  <CompareRow 
                    label="Location" 
                    getValue={(v) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{v.location}</Typography>
                      </Box>
                    )}
                  />
                  <CompareRow 
                    label="Response Time" 
                    getValue={(v) => (
                      <Chip 
                        label={v.responseTime} 
                        size="small" 
                        sx={{ 
                          bgcolor: v.responseTime?.includes('1 hour') ? '#e8f5e9' : '#fff3e0',
                          color: v.responseTime?.includes('1 hour') ? '#2e7d32' : '#ef6c00',
                        }}
                      />
                    )}
                  />
                  <CompareRow 
                    label="Experience" 
                    getValue={(v) => `${v.yearsExperience} years`}
                    highlight
                  />
                  <CompareRow 
                    label="Bookings Completed" 
                    getValue={(v) => v.bookingsCompleted}
                    highlight
                  />
                  <CompareRow 
                    label="Deposit Required" 
                    getValue={(v) => v.depositRequired}
                  />
                  <CompareRow 
                    label="Cancellation Policy" 
                    getValue={(v) => (
                      <Typography variant="body2" sx={{ fontSize: { xs: 11, md: 14 } }}>
                        {v.cancellationPolicy}
                      </Typography>
                    )}
                  />
                  <CompareRow 
                    label="Features" 
                    getValue={(v) => (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {v.features?.map((f, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Check sx={{ fontSize: 14, color: '#4caf50' }} />
                            <Typography variant="caption">{f}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      <Footer />
    </Box>
  )
}
