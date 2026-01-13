import { useState } from 'react';
import { Box, Paper, Typography, Checkbox, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';

const imgGroup1 = "https://www.figma.com/api/mcp/asset/cc700c9a-234b-4559-99e9-25bc07b02bb3";
const imgGroup3 = "https://www.figma.com/api/mcp/asset/9cb7768a-d8b1-4c9d-85e9-4cf8decc7c12";

// Sample vendor data
const imgRectangle1601 = "https://www.figma.com/api/mcp/asset/43f4c906-b9de-47f0-b16f-9a19480b78d8";
const imgRectangle1602 = "https://www.figma.com/api/mcp/asset/85f6d73f-f1ff-4c63-a979-a23699dbbb19";
const imgRectangle1603 = "https://www.figma.com/api/mcp/asset/7fb56ed2-ce5c-418a-88b3-11ebbaf22767";
const imgRectangle1605 = "https://www.figma.com/api/mcp/asset/b9221359-c8e6-441c-98f4-d77cbdf2b023";
const imgRectangle1606 = "https://www.figma.com/api/mcp/asset/3591e2fa-7be7-4c74-b87a-97653880ddb0";

const floristImg1 = "https://www.figma.com/api/mcp/asset/d18c9f00-17b4-4e4d-b7d4-f1cfc8c788f1";
const floristImg2 = "https://www.figma.com/api/mcp/asset/0a56412b-387b-41ed-bfda-49f497f3b52e";
const floristImg3 = "https://www.figma.com/api/mcp/asset/aa09c2b2-ac5e-47c2-8a62-a05a0254a7e0";

interface Vendor {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const SAMPLE_VENDORS: Record<string, Vendor[]> = {
  'Venue': [
    { id: 'v1', name: 'Rosevet Event Center', price: 187000, image: imgRectangle1601, category: 'Venue' },
    { id: 'v2', name: 'Charlly Inn', price: 387000, image: imgRectangle1602, category: 'Venue' },
    { id: 'v3', name: 'Esther Suit', price: 132000, image: imgRectangle1603, category: 'Venue' },
    { id: 'v4', name: 'OkeIran Even Homes', price: 812000, image: imgRectangle1605, category: 'Venue' },
    { id: 'v5', name: 'Master Event Place', price: 1212000, image: imgRectangle1606, category: 'Venue' },
  ],
  'Florist': [
    { id: 'f1', name: 'Jacinta Flowers', price: 187000, image: floristImg1, category: 'Florist' },
    { id: 'f2', name: 'Flower Goddess', price: 387000, image: floristImg2, category: 'Florist' },
    { id: 'f3', name: 'Rosevine', price: 132000, image: floristImg3, category: 'Florist' },
    { id: 'f4', name: 'Curly maker', price: 812000, image: floristImg1, category: 'Florist' },
  ],
  'Cake & Desserts': [
    { id: 'c1', name: 'Sweet Treats', price: 85000, image: imgRectangle1602, category: 'Cake & Desserts' },
    { id: 'c2', name: 'Cake Boss NG', price: 120000, image: imgRectangle1603, category: 'Cake & Desserts' },
    { id: 'c3', name: 'Divine Pastries', price: 95000, image: imgRectangle1605, category: 'Cake & Desserts' },
  ],
  'Photography': [
    { id: 'p1', name: 'Lens Masters', price: 250000, image: imgRectangle1606, category: 'Photography' },
    { id: 'p2', name: 'Perfect Shots', price: 180000, image: imgRectangle1601, category: 'Photography' },
    { id: 'p3', name: 'Eternal Memories', price: 320000, image: imgRectangle1602, category: 'Photography' },
  ],
};

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

export default function SelectVendors() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleViewVendor = (vendor: Vendor) => {
    navigate(`/couple/search-results?category=${vendor.category.toLowerCase()}`);
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
          <Typography 
            sx={{ 
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700, 
              fontSize: { xs: 20, md: 24 }, 
              p: '20px',
              pb: '24px',
              lineHeight: '50px'
            }}
          >
            Select Vendors
          </Typography>

          <Box
            sx={{
              px: '20px',
              maxHeight: { xs: '400px', md: 653 },
              overflowY: 'auto',
              overflowX: 'hidden',
              pb: 2
            }}
          >
            {VENDOR_CATEGORIES.map((category) => (
              <Box
                key={category}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '17px',
                  mb: '31px',
                  cursor: 'pointer',
                }}
                onClick={() => handleCategoryChange(category)}
              >
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={() => {}}
                  sx={{
                    p: 0,
                    width: 19,
                    height: 19,
                    color: '#8a8a8a',
                    borderRadius: '5px',
                    '& .MuiSvgIcon-root': { fontSize: 19 },
                    '&.Mui-checked': {
                      color: '#00838F',
                    }
                  }}
                />
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
        <Paper
          sx={{
            flex: 1,
            ml: { xs: 0, md: '54px' },
            p: { xs: 2, md: 3 },
            borderRadius: 0,
            border: '1px solid #ccfdf2',
            boxShadow: 'none',
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: '400px', md: 939 },
          }}
        >
          {selectedCategories.length === 0 ? (
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
              {/* Document Icons - icon-park-solid_doc-add */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  mb: 4,
                  mx: 'auto',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* icon-park-solid_doc-add - Teal document - rotated right */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: 73.485,
                    height: 73.485,
                    transform: 'rotate(15deg)',
                    left: '30px',
                    top: '-3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <img 
                      src={imgGroup1} 
                      alt="icon-park-solid_doc-add" 
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        display: 'block'
                      }} 
                    />
                  </Box>
                </Box>
                
                {/* icon-park-solid_doc-add-1 - Gray document - rotated left */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: 73.485,
                    height: 73.485,
                    transform: 'rotate(-15deg)',
                    left: '-3px',
                    top: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <img 
                      src={imgGroup3} 
                      alt="icon-park-solid_doc-add-1" 
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        display: 'block'
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
              
              <Typography
                sx={{ 
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700, 
                  fontSize: 24,
                  color: '#002528', 
                  mb: 1.5,
                  lineHeight: 'normal'
                }}
              >
                No Vendor Selected
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#002528', 
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 'normal'
                }}
              >
                Kindly Select the vendors you want
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
              {selectedCategories.map(category => {
                const vendors = SAMPLE_VENDORS[category] || [];
                if (vendors.length === 0) return null;

                return (
                  <Box key={category} sx={{ mb: 5 }}>
                    {/* Category Header */}
                    <Typography
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 20,
                        color: '#002528',
                        mb: 2,
                        pb: 1,
                        borderBottom: '2px solid #ccfdf2',
                      }}
                    >
                      {category} ({vendors.length})
                    </Typography>

                    {/* Vendor Grid */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: 'repeat(2, 1fr)',
                          sm: 'repeat(3, 1fr)',
                          md: 'repeat(4, 1fr)',
                          lg: 'repeat(5, 1fr)',
                        },
                        gap: 2,
                      }}
                    >
                      {vendors.map(vendor => (
                        <Box
                          key={vendor.id}
                          onClick={() => handleViewVendor(vendor)}
                          sx={{
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                            }
                          }}
                        >
                          {/* Vendor Image */}
                          <Box
                            sx={{
                              width: '100%',
                              paddingTop: '100%',
                              position: 'relative',
                              bgcolor: '#d9d9d9',
                              overflow: 'hidden',
                              mb: 1,
                            }}
                          >
                            <Box
                              component="img"
                              src={vendor.image}
                              alt={vendor.name}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </Box>

                          {/* Vendor Name */}
                          <Typography
                            sx={{
                              fontFamily: "'Open Sans', sans-serif",
                              fontWeight: 700,
                              fontSize: 14,
                              color: '#00838F',
                              mb: 0.5,
                              textAlign: 'center',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {vendor.name}
                          </Typography>

                          {/* Price */}
                          <Box sx={{ textAlign: 'center' }}>
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
                                fontSize: 14,
                                color: '#002528',
                              }}
                            >
                              {formatPrice(vendor.price)}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    {/* View All Button */}
                    {vendors.length > 5 && (
                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                          onClick={() => handleViewVendor(vendors[0])}
                          sx={{
                            bgcolor: 'white',
                            color: '#00838F',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            textTransform: 'none',
                            borderRadius: '100px',
                            border: '1px solid #00838F',
                            px: 3,
                            py: 1,
                            '&:hover': {
                              bgcolor: '#f5f5f5',
                            }
                          }}
                        >
                          View All {category}
                        </Button>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
