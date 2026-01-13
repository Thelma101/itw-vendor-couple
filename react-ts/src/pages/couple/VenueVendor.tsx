import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
} from '@mui/material';
import Nav from '../../components/Nav';
import VendorFilter from '../../components/VendorFilter';

const imgRectangle1605 = "https://www.figma.com/api/mcp/asset/b9221359-c8e6-441c-98f4-d77cbdf2b023";
const imgRectangle1606 = "https://www.figma.com/api/mcp/asset/3591e2fa-7be7-4c74-b87a-97653880ddb0";
const imgRectangle1601 = "https://www.figma.com/api/mcp/asset/43f4c906-b9de-47f0-b16f-9a19480b78d8";
const imgRectangle1602 = "https://www.figma.com/api/mcp/asset/85f6d73f-f1ff-4c63-a979-a23699dbbb19";
const imgRectangle1603 = "https://www.figma.com/api/mcp/asset/7fb56ed2-ce5c-418a-88b3-11ebbaf22767";
const imgCheck = "https://www.figma.com/api/mcp/asset/5737d6b4-1e2c-4b5a-9775-ca9df33b3e5a";

// Popup images from Figma design
const imgEllipse140 = "https://www.figma.com/api/mcp/asset/befcf9f7-4562-4908-a9fb-6dcded9308e1";
const popupImgRectangle1601 = "https://www.figma.com/api/mcp/asset/4be21074-50c5-4190-a603-938cdf8497a4";
const popupImgRectangle1602 = "https://www.figma.com/api/mcp/asset/0199544c-ce2c-4141-af7b-f951d81c2e0e";
const popupImgRectangle1603 = "https://www.figma.com/api/mcp/asset/2e5914b4-d940-409b-8218-e3ffc0e72757";
const popupImgRectangle1604 = "https://www.figma.com/api/mcp/asset/11ff3a86-ffac-4f35-80c1-51b47a1f9520";
const popupImgRectangle1605 = "https://www.figma.com/api/mcp/asset/9b05d58a-e85f-4c22-8956-468bd19d2b1d";
const popupImgRectangle1607 = "https://www.figma.com/api/mcp/asset/73dcfae9-ed18-4d8c-9430-b53ad58c3083";
const popupImgRectangle1608 = "https://www.figma.com/api/mcp/asset/addc158a-b5e7-45c7-8a6b-0c4af9a5c73b";

interface Venue {
  id: string;
  name: string;
  price: number;
  image: string;
  capacity?: string;
  logo?: string;
  galleryImages?: string[];
}

const VENUES: Venue[] = [
  {
    id: '1',
    name: 'Rosevet Event Center',
    price: 187000,
    image: imgRectangle1601,
    capacity: '7, 000',
    logo: imgEllipse140,
    galleryImages: [popupImgRectangle1602, popupImgRectangle1603, popupImgRectangle1604, popupImgRectangle1605, popupImgRectangle1601, popupImgRectangle1607, popupImgRectangle1608],
  },
  {
    id: '2',
    name: 'Charlly Inn',
    price: 387000,
    image: imgRectangle1602,
    capacity: '5, 000',
    logo: imgEllipse140,
    galleryImages: [popupImgRectangle1602, popupImgRectangle1603, popupImgRectangle1604, popupImgRectangle1605, popupImgRectangle1601, popupImgRectangle1607, popupImgRectangle1608],
  },
  {
    id: '3',
    name: 'Esther Suit',
    price: 132000,
    image: imgRectangle1603,
    capacity: '3, 000',
    logo: imgEllipse140,
    galleryImages: [popupImgRectangle1602, popupImgRectangle1603, popupImgRectangle1604, popupImgRectangle1605, popupImgRectangle1601, popupImgRectangle1607, popupImgRectangle1608],
  },
  {
    id: '4',
    name: 'OkeIran Even Homes',
    price: 812000,
    image: imgRectangle1605,
    capacity: '10, 000',
    logo: imgEllipse140,
    galleryImages: [popupImgRectangle1602, popupImgRectangle1603, popupImgRectangle1604, popupImgRectangle1605, popupImgRectangle1601, popupImgRectangle1607, popupImgRectangle1608],
  },
  {
    id: '5',
    name: 'Master Event Place',
    price: 1212000,
    image: imgRectangle1606,
  },
];

const VENDOR_CATEGORIES = [
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
  'Car Rentals',
  'Hotel/Short Lets',
  'Wedding Planning',
  'Travel Agency',
];

const SUBCATEGORIES = ['Venue', 'Flourist', 'Cake & Desserts', 'Photographer'];

export default function VenueVendor() {
  const [activeSubcategory, setActiveSubcategory] = useState('Venue');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Venue', 'Florist', 'Cake & Desserts', 'Photography']);
  const [, setSelectedVenue] = useState<Venue | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  const formatPrice = (price: number) => {
    return `N${price.toLocaleString()}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff6f9' }}>
      <Nav />
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 0,
          px: { xs: 2, sm: 4, md: '70px' },
          pt: { xs: 3, md: '92px' },
          pb: 3,
          position: 'relative',
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        {/* Sidebar - Categories */}
        <Paper
          sx={{
            width: { xs: '100%', md: 277 },
            p: 0,
            borderRadius: 0,
            border: '1px solid #ccfdf2',
            boxShadow: 'none',
            bgcolor: 'white',
            height: { xs: 'auto', md: 939 },
            mb: { xs: 2, md: 0 }
          }}
        >
          <Box
            sx={{
              px: '20px',
              pt: '37px',
              maxHeight: 653,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {VENDOR_CATEGORIES.map((category, index) => (
              <Box
                key={category}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '17px',
                  mb: '31px',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => handleCategoryChange(category)}
              >
                <Box sx={{ position: 'relative', width: 24, height: 24 }}>
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => {}}
                    sx={{
                      p: 0,
                      width: 19,
                      height: 19,
                      color: '#8a8a8a',
                      borderRadius: '5px',
                      position: 'absolute',
                      top: '-2.5px',
                      left: '2.5px',
                      '& .MuiSvgIcon-root': { fontSize: 19 },
                      '&.Mui-checked': {
                        color: '#00838f',
                      }
                    }}
                  />
                  {selectedCategories.includes(category) && index < 4 && (
                    <img 
                      src={imgCheck} 
                      alt="check" 
                      style={{ 
                        width: 24, 
                        height: 24,
                        position: 'absolute',
                        top: '-5px',
                        left: 0
                      }} 
                    />
                  )}
                </Box>
                <Typography 
                  sx={{ 
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14, 
                    color: '#555',
                    fontWeight: 700,
                    lineHeight: '50px',
                    mt: '-16px'
                  }}
                >
                  {category}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, ml: '54px' }}>
          {/* Top Bar - Subcategories and Buttons */}
          <Paper
            sx={{
              p: '22px 24px',
              borderRadius: 0,
              border: '1px solid #ccfdf2',
              boxShadow: 'none',
              bgcolor: 'white',
              height: 102,
              mb: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Subcategory chips */}
            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: '10px' }}>
                {SUBCATEGORIES.map(cat => (
                  <Chip
                    key={cat}
                    label={cat}
                    onClick={() => setActiveSubcategory(cat)}
                    sx={{
                      background: activeSubcategory === cat 
                        ? 'linear-gradient(240.28deg, #EB1948 65.18%, #B52344 232.03%)'
                        : '#ccfdf2',
                      color: activeSubcategory === cat ? 'white' : '#8a8a8a',
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                      borderRadius: '100px',
                      height: 29,
                      '&:hover': {
                        background: activeSubcategory === cat 
                          ? 'linear-gradient(240.28deg, #EB1948 65.18%, #B52344 232.03%)'
                          : '#ccfdf2',
                      }
                    }}
                  />
                ))}
              </Box>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#00838f',
                  color: 'white',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: 'none',
                  borderRadius: '100px',
                  border: '0.5px solid white',
                  px: 2,
                  height: 29,
                  minWidth: 116,
                  '&:hover': {
                    bgcolor: '#00626b',
                  }
                }}
              >
                View in Cart
              </Button>
            </Box>
          </Paper>

          {/* Venues Section */}
          <Paper
            sx={{
              p: 0,
              pt: '110px',
              borderRadius: 0,
              border: '1px solid #ccfdf2',
              borderTop: 'none',
              boxShadow: 'none',
              bgcolor: 'white',
              minHeight: 837,
              position: 'relative',
            }}
          >
            {/* Title and Location */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 24,
                  color: '#002528',
                  lineHeight: 'normal',
                  mb: 1,
                }}
              >
                15 Reception Venues
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  color: '#002528',
                  lineHeight: 'normal',
                }}
              >
                Ikeja, Lagos
              </Typography>
            </Box>

            {/* Venues Grid */}
            <Box
              sx={{
                display: 'flex',
                gap: '19px',
                px: '27px',
                justifyContent: 'flex-start',
                flexWrap: 'nowrap',
                mb: 4,
              }}
            >
              {VENUES.map((venue) => (
                <Box
                  key={venue.id}
                  sx={{
                    width: 170,
                    flexShrink: 0,
                  }}
                >
                  {/* Venue Image */}
                  <Box
                    onClick={() => handleVenueClick(venue)}
                    sx={{
                      width: 170,
                      height: 170,
                      bgcolor: '#d9d9d9',
                      overflow: 'hidden',
                      mb: 1.5,
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.9,
                      }
                    }}
                  >
                    <img
                      src={venue.image}
                      alt={venue.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  {/* Venue Name */}
                  <Typography
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#00838f',
                      textAlign: 'center',
                      mb: 1,
                      lineHeight: 'normal',
                    }}
                  >
                    {venue.name}
                  </Typography>

                  {/* Price */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: 12,
                        color: '#002528',
                        lineHeight: 'normal',
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
                        lineHeight: 'normal',
                      }}
                    >
                      {formatPrice(venue.price)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* View All Button */}
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Button
                sx={{
                  bgcolor: 'white',
                  color: '#00838f',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: 'none',
                  borderRadius: '100px',
                  px: 2,
                  height: 29,
                  minWidth: 86,
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                  }
                }}
              >
                View All
              </Button>
            </Box>

            {/* Filter Button - Top Right */}
            <Button
              onClick={() => setFilterOpen(true)}
              sx={{
                position: 'absolute',
                top: 113,
                right: 58,
                bgcolor: 'white',
                color: '#00838f',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textTransform: 'none',
                borderRadius: '100px',
                px: 2,
                height: 29,
                minWidth: 86,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                }
              }}
            >
              Filter
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* Filter Modal */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            borderRadius: 0,
            bgcolor: 'transparent',
            boxShadow: 'none'
          }
        }}
      >
        <DialogContent sx={{ p: 0, bgcolor: 'transparent' }}>
          <VendorFilter hasCapacity={true} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
