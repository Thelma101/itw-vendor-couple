import { Box, Typography, Grid, Card, CardContent, Checkbox, FormControlLabel, List, ListItem, Chip, Button, CardMedia, IconButton } from '@mui/material'
import { useState } from 'react'
import { VendorBlankIcon } from '@/components/icons/VendorBlankIcon'
import { VendorBlank2Icon } from '@/components/icons/VendorBlank2Icon'
import { mockVendors, getVendorsByCategory, type Vendor } from '@/data/mockVendors'


const vendorCategories = [
  'Venue',
  'Florist',
  'Cake & Desserts',
  'Photography',
  'Dress & Apparel',
  'Catering',
  'Decor',
  'Videography',
  'MC/DJ/Live Band',
  'Jewelry',
  'Make-up/Hair',
  'Bar Services',
  'Car Rentals'
]

export default function VendorSelection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [favourites, setFavorites] = useState<Record<string, boolean>>({});
  const filteredVendors = getVendorsByCategory(
    (activeCategory ? [activeCategory] : selectedCategories.length ? [selectedCategories[0]] : [])
  )

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }
  const toggleFav = (id: string) => setFavorites(p => ({ ...p, [id]: !p[id] }))

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }} gap={2} p={4} bgcolor={'bgThemeColor.main'}>
      {/* Left Sidebar - Vendor Categories */}
      <Box
        sx={{
          width: 300,
          bgcolor: 'white',
          border: '1px solid',
          borderColor: 'segmentColor.main',
          p: 4
        }}
      >
        <Typography variant="h6" className="font-bold text-gray-800 mb-4">
          Select Vendors
        </Typography>

        <List sx={{ p: 0 }}>
          {vendorCategories.map((category) => (
            <ListItem key={category} sx={{ px: 1.5, py: .3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    sx={{
                      '&.Mui-checked': { color: 'primary.main', borderRadius: '50%', border: '1px solid', borderColor: 'primary.main' }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" className="text-gray-700">
                    {category}
                  </Typography>
                }
                sx={{ width: '100%' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content Area */}
      <Box sx={{
        flexGrow: 1, p: 4, bgcolor: 'white', border: '1px solid', borderColor: 'segmentColor.main'
      }}>
        {selectedCategories.length === 0 ? (
          // No vendors selected state
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}
          >
            {/* Icon */}
            <Box sx={{ mb: 3, position: 'relative', width: 80, height: 80 }}>
              {/* First card (behind) - rotated -15deg */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 0,
                  transform: 'rotate(-5deg)',
                  opacity: 1,
                  zIndex: 2
                }}
              >
                <VendorBlankIcon width={60} height={60} />
              </Box>

              {/* Second card (front) - rotated 15deg */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 20,
                  transform: 'rotate(5deg)',
                  opacity: 1,
                  zIndex: 1
                }}
              >
                <VendorBlank2Icon width={60} height={60} />
              </Box>
            </Box>

            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
              No Vendor Selected
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Kindly Select the vendors you want
            </Typography>
          </Box>
        ) : (
          // Selected vendors display
          <Box>
            <Box sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgColor: 'white',
              borderBottom: '1px solid',
              width: '100%',
              borderColor: 'segmentColor.main',
            }}>
              {/* Category tabs */}
              <Box sx={{
                flexGrow: 1, gap: 3, mt: 2, mb: 3,
              }}>
                {selectedCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setActiveCategory(category)}
                    variant={activeCategory === category ? 'filled' : 'outlined'}
                    // color={activeCategory === category ? 'callToAction.main' : 'default'}
                    sx={{
                      bgcolor: activeCategory === category ? 'callToAction.main' : 'primary.50',
                      color: activeCategory === category ? 'white' : 'primary.main',
                      borderRadius: '30px',
                      margin: '5px',
                      border: '1px solid',
                      borderColor: 'segmentColor.main',
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button variant="text"
                  sx={{
                    borderRadius: '30px',
                    // padding: '10px 18px',
                    fontWeight: 600,
                    textTransform: 'none',
                    bgcolor: "primary.main",
                    color: 'white',
                    '&:hover': {
                      filter: 'brightness(0.95)',
                    },
                  }}
                >View in Cart
                </Button>
              </Box>
            </Box>

            {/* Header with title and actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h4" className="font-bold">
                  {filteredVendors.length} {selectedCategories[0]}s
                </Typography>
                <Typography variant="body1" className="text-gray-600">Lagos, Nigeria</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" className="text-primary-600 cursor-pointer">Filter</Typography>
              </Box>
            </Box>
            {/* </Box> */}

            {/* Vendor grid */}
            <Grid container spacing={3}>
              {filteredVendors.map((venue) => (
                <Grid key={venue.id} item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={venue.image}
                      alt={venue.name}
                    />
                    <CardContent>
                      <Typography variant="h6" className="font-bold">{venue.name}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" className="text-primary-600 font-semibold">
                          {venue.price}
                        </Typography>
                        <IconButton>
                          <span className={favourites[venue.id] ? 'text-red-500' : 'text-gray-400'}>♥</span>
                        </IconButton>
                      </Box>
                    </CardContent>
                    {/* <Card>
                      <IconButton>
                        <span className={favourites[venue.id] ? 'text-red-500' : 'text-gray-400'}>♥</span>
                      </IconButton>
                    </Card> */}
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" className="text-primary-600 cursor-pointer">View All</Typography>
            </Box>
          </Box>

        )}
      </Box>
    </Box>
  )
}
