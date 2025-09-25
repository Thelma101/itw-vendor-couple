import { Box, Typography, Grid, Card, CardContent, Checkbox, FormControlLabel, List, ListItem } from '@mui/material'
import { useState } from 'react'
import { VendorBlankIcon } from '../../../components/icons/VendorBlankIcon'
import { VendorBlank2Icon } from '../../../components/icons/VendorBlank2Icon'

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

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
            <Typography variant="h5" className="font-bold text-gray-800 mb-4">
              Selected Vendors ({selectedCategories.length})
            </Typography>

            <Grid container spacing={2}>
              {selectedCategories.map((category) => (
                <Grid key={category} item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" className="font-semibold mb-2">
                        {category}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Browse {category.toLowerCase()} vendors
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  )
}
