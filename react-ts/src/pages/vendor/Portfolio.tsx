import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  category: string;
  likes: number;
  views: number;
}

const initialPortfolio: PortfolioItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', title: 'Sarah & Michael Wedding', category: 'Wedding', likes: 245, views: 1820 },
  { id: '2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', title: 'Beach Ceremony', category: 'Wedding', likes: 189, views: 1450 },
  { id: '3', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600', title: 'Pre-Wedding Shoot', category: 'Pre-Wedding', likes: 312, views: 2100 },
  { id: '4', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600', title: 'Garden Wedding', category: 'Wedding', likes: 178, views: 980 },
  { id: '5', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600', title: 'Couple Portrait', category: 'Portrait', likes: 156, views: 890 },
  { id: '6', url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600', title: 'Traditional Wedding', category: 'Traditional', likes: 289, views: 1670 },
  { id: '7', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600', title: 'Reception Moments', category: 'Reception', likes: 134, views: 720 },
  { id: '8', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600', title: 'Bridal Portrait', category: 'Portrait', likes: 267, views: 1540 },
];

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const categories = ['All', 'Wedding', 'Pre-Wedding', 'Portrait', 'Traditional', 'Reception'];

  const filteredPortfolio = tabValue === 0 
    ? portfolio 
    : portfolio.filter(p => p.category === categories[tabValue]);

  const handleDelete = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  const totalViews = portfolio.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = portfolio.reduce((sum, p) => sum + p.likes, 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 24, color: '#002528' }}>
            Portfolio
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#666', mt: 0.5 }}>
            Showcase your best work to attract more clients
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => setUploadOpen(true)}
          sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 600, borderRadius: 2, '&:hover': { bgcolor: '#006b75' } }}
        >
          Upload Photos
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid #CCFDF2', boxShadow: 'none', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 28, color: '#002528' }}>{portfolio.length}</Typography>
            <Typography sx={{ fontSize: 13, color: '#666' }}>Total Photos</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid #CCFDF2', boxShadow: 'none', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 28, color: '#002528' }}>{totalViews.toLocaleString()}</Typography>
            <Typography sx={{ fontSize: 13, color: '#666' }}>Total Views</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid #CCFDF2', boxShadow: 'none', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 28, color: '#002528' }}>{totalLikes.toLocaleString()}</Typography>
            <Typography sx={{ fontSize: 13, color: '#666' }}>Total Likes</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Category Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        sx={{
          mb: 3,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
          '& .Mui-selected': { color: '#00838F' },
          '& .MuiTabs-indicator': { bgcolor: '#00838F' },
        }}
      >
        {categories.map((cat) => (
          <Tab key={cat} label={cat} />
        ))}
      </Tabs>

      {/* Portfolio Grid */}
      <ImageList cols={4} gap={16}>
        {filteredPortfolio.map((item) => (
          <ImageListItem
            key={item.id}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              '&:hover .overlay': { opacity: 1 },
            }}
            onClick={() => setSelectedImage(item)}
          >
            <img
              src={item.url}
              alt={item.title}
              loading="lazy"
              style={{ height: 250, objectFit: 'cover' }}
            />
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.5)',
                opacity: 0,
                transition: 'opacity 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
              }}
            >
              <Typography sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <VisibilityIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: 14 }}>{item.views}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FavoriteIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: 14 }}>{item.likes}</Typography>
                </Box>
              </Box>
            </Box>
            <ImageListItemBar
              sx={{ bgcolor: 'transparent' }}
              actionIcon={
                <IconButton
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', mr: 1, '&:hover': { bgcolor: '#f44336' } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Photos</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '2px dashed #CCFDF2',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: '#00838F', bgcolor: '#00838F08' },
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: '#00838F', mb: 2 }} />
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Drag and drop photos here</Typography>
            <Typography sx={{ fontSize: 14, color: '#666', mb: 2 }}>or click to browse</Typography>
            <Button variant="outlined" sx={{ borderColor: '#00838F', color: '#00838F' }}>
              Browse Files
            </Button>
          </Box>
          <TextField label="Photo Title" fullWidth sx={{ mt: 2 }} />
          <TextField label="Category" fullWidth sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#00838F' }}>Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="lg">
        {selectedImage && (
          <Box>
            <img src={selectedImage.url} alt={selectedImage.title} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{selectedImage.title}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Chip icon={<VisibilityIcon />} label={`${selectedImage.views} views`} size="small" />
                <Chip icon={<FavoriteIcon />} label={`${selectedImage.likes} likes`} size="small" />
                <Chip label={selectedImage.category} size="small" sx={{ bgcolor: '#00838F', color: 'white' }} />
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
