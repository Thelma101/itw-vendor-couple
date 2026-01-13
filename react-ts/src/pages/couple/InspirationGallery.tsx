import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grid,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Search,
  Favorite,
  Share,
  Close,
  ArrowBack,
  Bookmark,
  BookmarkBorder,
  CheckCircle,
  Palette,
  Celebration,
  Park,
  BeachAccess,
  Castle,
  Nightlife,
  Spa,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface InspirationImage {
  id: string
  url: string
  title: string
  category: string
  tags: string[]
  likes: number
  saved: boolean
}

interface MoodBoard {
  id: string
  name: string
  images: InspirationImage[]
  createdAt: string
}

interface QuizQuestion {
  id: number
  question: string
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>
}

const inspirationImages: InspirationImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop', title: 'Elegant Ballroom', category: 'Venues', tags: ['elegant', 'indoor', 'classic'], likes: 245, saved: false },
  { id: '2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop', title: 'Garden Ceremony', category: 'Venues', tags: ['outdoor', 'garden', 'romantic'], likes: 189, saved: true },
  { id: '3', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop', title: 'Romantic Florals', category: 'Flowers', tags: ['roses', 'pink', 'romantic'], likes: 312, saved: false },
  { id: '4', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=800&fit=crop', title: 'Beach Wedding', category: 'Venues', tags: ['beach', 'outdoor', 'tropical'], likes: 421, saved: false },
  { id: '5', url: 'https://images.unsplash.com/photo-1519167758481-83f2946fead6?w=600&h=500&fit=crop', title: 'Rustic Barn', category: 'Venues', tags: ['rustic', 'barn', 'country'], likes: 156, saved: true },
  { id: '6', url: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600&h=700&fit=crop', title: 'Wedding Dress', category: 'Attire', tags: ['dress', 'elegant', 'white'], likes: 534, saved: false },
  { id: '7', url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600&h=400&fit=crop', title: 'Table Setting', category: 'Decor', tags: ['tablescape', 'elegant', 'gold'], likes: 278, saved: false },
  { id: '8', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop', title: 'Wedding Cake', category: 'Food', tags: ['cake', 'white', 'floral'], likes: 367, saved: true },
  { id: '9', url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=500&fit=crop', title: 'Outdoor Reception', category: 'Venues', tags: ['outdoor', 'tent', 'romantic'], likes: 198, saved: false },
  { id: '10', url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=800&fit=crop', title: 'Bridal Bouquet', category: 'Flowers', tags: ['bouquet', 'white', 'elegant'], likes: 445, saved: false },
  { id: '11', url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&h=400&fit=crop', title: 'Ring Shot', category: 'Details', tags: ['rings', 'jewelry', 'close-up'], likes: 289, saved: false },
  { id: '12', url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=600&fit=crop', title: 'Bridesmaids', category: 'Attire', tags: ['bridesmaids', 'pink', 'group'], likes: 176, saved: false },
]

const categories = ['All', 'Venues', 'Flowers', 'Attire', 'Decor', 'Food', 'Details']

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What atmosphere do you envision for your wedding?',
    options: [
      { value: 'elegant', label: 'Elegant & Formal', icon: <Castle /> },
      { value: 'romantic', label: 'Romantic & Intimate', icon: <Favorite /> },
      { value: 'rustic', label: 'Rustic & Natural', icon: <Park /> },
      { value: 'modern', label: 'Modern & Chic', icon: <Palette /> },
      { value: 'bohemian', label: 'Bohemian & Free-spirited', icon: <Spa /> },
      { value: 'tropical', label: 'Tropical & Beach', icon: <BeachAccess /> },
    ],
  },
  {
    id: 2,
    question: 'Where would you prefer to celebrate?',
    options: [
      { value: 'indoor', label: 'Indoor Venue (Ballroom, Hotel)', icon: <Castle /> },
      { value: 'outdoor', label: 'Outdoor (Garden, Beach)', icon: <Park /> },
      { value: 'mixed', label: 'Both Indoor & Outdoor', icon: <Celebration /> },
      { value: 'destination', label: 'Destination Wedding', icon: <BeachAccess /> },
    ],
  },
  {
    id: 3,
    question: 'What color palette speaks to you?',
    options: [
      { value: 'neutral', label: 'Neutrals (White, Ivory, Beige)' },
      { value: 'blush', label: 'Blush & Rose Gold' },
      { value: 'jewel', label: 'Jewel Tones (Emerald, Burgundy)' },
      { value: 'pastels', label: 'Soft Pastels' },
      { value: 'bold', label: 'Bold & Vibrant' },
      { value: 'earth', label: 'Earth Tones' },
    ],
  },
  {
    id: 4,
    question: 'How many guests are you expecting?',
    options: [
      { value: 'micro', label: 'Micro (Under 30)' },
      { value: 'small', label: 'Intimate (30-75)' },
      { value: 'medium', label: 'Medium (75-150)' },
      { value: 'large', label: 'Large (150-300)' },
      { value: 'grand', label: 'Grand (300+)' },
    ],
  },
  {
    id: 5,
    question: 'What time of day do you prefer?',
    options: [
      { value: 'morning', label: 'Morning Ceremony' },
      { value: 'afternoon', label: 'Afternoon Celebration' },
      { value: 'sunset', label: 'Golden Hour / Sunset' },
      { value: 'evening', label: 'Evening Affair', icon: <Nightlife /> },
    ],
  },
]

const styleResults: Record<string, { title: string; description: string; image: string }> = {
  elegant: {
    title: 'Classic Elegance',
    description: 'Your style is timeless and sophisticated. Think crystal chandeliers, fine china, and a stunning ballroom venue. Your wedding will be the epitome of refined luxury.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop',
  },
  romantic: {
    title: 'Romantic Dream',
    description: 'You\'re drawn to soft, romantic aesthetics. Flowing fabrics, abundant florals, and candlelit moments will create the intimate atmosphere you desire.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=500&fit=crop',
  },
  rustic: {
    title: 'Rustic Charm',
    description: 'Natural beauty speaks to your soul. Barn venues, wildflowers, and organic textures will bring your countryside dreams to life.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f2946fead6?w=800&h=500&fit=crop',
  },
  modern: {
    title: 'Modern Minimalist',
    description: 'Clean lines and contemporary design define your aesthetic. A sleek venue with architectural details and a curated color palette will showcase your style.',
    image: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&h=500&fit=crop',
  },
  bohemian: {
    title: 'Boho Beautiful',
    description: 'Free-spirited and artistic, your wedding will feature eclectic details, flowing fabrics, and a relaxed atmosphere that celebrates love and individuality.',
    image: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=500&fit=crop',
  },
  tropical: {
    title: 'Tropical Paradise',
    description: 'Sun, sand, and sea call to you! Your wedding will feature lush greenery, ocean views, and a relaxed island vibe.',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=500&fit=crop',
  },
}

export default function InspirationGallery() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeTab, setActiveTab] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState(inspirationImages)
  const [selectedImage, setSelectedImage] = useState<InspirationImage | null>(null)
  const [moodBoards] = useState<MoodBoard[]>([
    { id: '1', name: 'My Dream Wedding', images: inspirationImages.filter(i => i.saved), createdAt: '2026-01-10' },
  ])
  
  // Quiz state
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizResult, setQuizResult] = useState<string | null>(null)

  const filteredImages = images.filter(img => {
    const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory
    const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleSave = (imageId: string) => {
    setImages(images.map(img => 
      img.id === imageId ? { ...img, saved: !img.saved } : img
    ))
  }

  const toggleLike = (imageId: string) => {
    setImages(images.map(img => 
      img.id === imageId ? { ...img, likes: img.likes + 1 } : img
    ))
  }

  const handleQuizAnswer = (value: string) => {
    setQuizAnswers({ ...quizAnswers, [quizQuestions[quizStep].id]: value })
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1)
    } else {
      // Calculate result based on first answer (simplified)
      setQuizResult(quizAnswers[1] || value)
    }
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setQuizAnswers({})
    setQuizResult(null)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF6F9' }}>
      <Nav />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} color="#1a1a1a" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            Inspiration Gallery
          </Typography>
          <Typography color="text.secondary">
            Discover ideas, create mood boards, and find your wedding style
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            mb: 3,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
            '& .Mui-selected': { color: '#00838F' },
            '& .MuiTabs-indicator': { bgcolor: '#00838F' },
          }}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label="Browse" />
          <Tab label="My Boards" />
          <Tab label="Style Quiz" />
        </Tabs>

        {/* Browse Tab */}
        {activeTab === 0 && (
          <>
            {/* Search and Filter */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
              <TextField
                placeholder="Search inspiration..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1, maxWidth: { sm: 300 } }}
                slotProps={{
                  input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <Chip
                    key={cat}
                    label={cat}
                    onClick={() => setSelectedCategory(cat)}
                    color={selectedCategory === cat ? 'primary' : 'default'}
                    variant={selectedCategory === cat ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            {/* Masonry Grid */}
            <Box
              sx={{
                columnCount: { xs: 2, sm: 3, md: 4 },
                columnGap: 2,
              }}
            >
              {filteredImages.map(image => (
                <Card
                  key={image.id}
                  sx={{
                    mb: 2,
                    breakInside: 'avoid',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' },
                  }}
                  onClick={() => setSelectedImage(image)}
                >
                  <CardMedia
                    component="img"
                    image={image.url}
                    alt={image.title}
                    sx={{ width: '100%' }}
                  />
                  <Box sx={{ p: 1.5 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {image.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Favorite sx={{ fontSize: 14, color: '#EB1948' }} />
                        <Typography variant="caption">{image.likes}</Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); toggleSave(image.id) }}
                        sx={{ color: image.saved ? '#00838F' : 'inherit' }}
                      >
                        {image.saved ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </>
        )}

        {/* My Boards Tab */}
        {activeTab === 1 && (
          <Box>
            <Button
              variant="contained"
              sx={{ mb: 3, bgcolor: '#EB1948', '&:hover': { bgcolor: '#c41438' }, textTransform: 'none' }}
            >
              Create New Board
            </Button>

            <Grid container spacing={3}>
              {moodBoards.map(board => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={board.id}>
                  <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '100px 100px', gap: 0.5 }}>
                      {board.images.slice(0, 4).map((img) => (
                        <CardMedia
                          key={img.id}
                          component="img"
                          image={img.url}
                          alt={img.title}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography fontWeight={600}>{board.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {board.images.length} images • {board.createdAt}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {moodBoards.length === 0 && (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <Bookmark sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No mood boards yet</Typography>
                <Typography color="text.secondary">Save images to create your first mood board</Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Style Quiz Tab */}
        {activeTab === 2 && (
          <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, maxWidth: 700, mx: 'auto' }}>
            {!quizResult ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(quizStep / quizQuestions.length) * 100}
                    sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#00838F' } }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Question {quizStep + 1} of {quizQuestions.length}
                  </Typography>
                </Box>

                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  {quizQuestions[quizStep].question}
                </Typography>

                <RadioGroup sx={{ mt: 3 }}>
                  {quizQuestions[quizStep].options.map(option => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {option.icon}
                          <Typography>{option.label}</Typography>
                        </Box>
                      }
                      onClick={() => handleQuizAnswer(option.value)}
                      sx={{
                        border: '1px solid #eee',
                        borderRadius: 2,
                        mb: 1,
                        mx: 0,
                        p: 1,
                        '&:hover': { bgcolor: '#f5f5f5' },
                      }}
                    />
                  ))}
                </RadioGroup>

                {quizStep > 0 && (
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => setQuizStep(quizStep - 1)}
                    sx={{ mt: 2, textTransform: 'none' }}
                  >
                    Back
                  </Button>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {styleResults[quizResult]?.title || 'Your Style'}
                </Typography>
                
                <CardMedia
                  component="img"
                  image={styleResults[quizResult]?.image}
                  alt="Style result"
                  sx={{ borderRadius: 3, mb: 3, maxHeight: 300, objectFit: 'cover' }}
                />

                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {styleResults[quizResult]?.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none' }}
                  >
                    View Matching Inspiration
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetQuiz}
                    sx={{ textTransform: 'none' }}
                  >
                    Retake Quiz
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        )}
      </Box>

      {/* Image Detail Modal */}
      <Dialog 
        open={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        {selectedImage && (
          <DialogContent sx={{ p: 0 }}>
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', zIndex: 1 }}
            >
              <Close />
            </IconButton>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              <CardMedia
                component="img"
                image={selectedImage.url}
                alt={selectedImage.title}
                sx={{ width: { xs: '100%', md: '60%' }, maxHeight: { xs: 300, md: 500 }, objectFit: 'cover' }}
              />
              <Box sx={{ p: 3, flex: 1 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {selectedImage.title}
                </Typography>
                <Chip label={selectedImage.category} sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {selectedImage.tags.map(tag => (
                    <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant={selectedImage.saved ? 'contained' : 'outlined'}
                    startIcon={selectedImage.saved ? <Bookmark /> : <BookmarkBorder />}
                    onClick={() => toggleSave(selectedImage.id)}
                    sx={{ 
                      textTransform: 'none',
                      ...(selectedImage.saved && { bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' } })
                    }}
                  >
                    {selectedImage.saved ? 'Saved' : 'Save'}
                  </Button>
                  <IconButton onClick={() => toggleLike(selectedImage.id)}>
                    <Favorite sx={{ color: '#EB1948' }} />
                  </IconButton>
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    {selectedImage.likes} likes
                  </Typography>
                  <IconButton><Share /></IconButton>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ bgcolor: '#EB1948', '&:hover': { bgcolor: '#c41438' }, textTransform: 'none' }}
                >
                  Find Similar Vendors
                </Button>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      <Footer />
    </Box>
  )
}
