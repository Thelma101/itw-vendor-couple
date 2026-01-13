import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Avatar,
  Rating,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Review {
  id: string;
  coupleName: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  weddingDate: string;
  service: string;
  verified: boolean;
  helpful: number;
  response?: {
    content: string;
    date: string;
  };
  photos?: string[];
  recommended: boolean;
}

const mockReviews: Review[] = [
  {
    id: 'R001',
    coupleName: 'Chioma & David Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    title: 'Absolutely phenomenal! Best decision we made',
    content: 'Where do I even begin? From our first consultation to the final delivery of our photos, every interaction was professional, warm, and exceeded our expectations. The team captured moments we didn\'t even know happened - the look on my father\'s face during the first dance, my husband wiping a tear during the vows. These are treasures we\'ll keep forever. The attention to detail, the creative angles, and the quick turnaround time made everything perfect. Worth every kobo!',
    date: '2026-01-10',
    weddingDate: '2025-12-15',
    service: 'Premium Photography Package',
    verified: true,
    helpful: 47,
    response: {
      content: 'Thank you so much, Chioma and David! It was an absolute honor to be part of your beautiful celebration. Your love story is truly inspiring, and we\'re thrilled that we could capture those precious moments for you. Wishing you a lifetime of happiness together! 💕',
      date: '2026-01-11',
    },
    photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=300',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300',
    ],
    recommended: true,
  },
  {
    id: 'R002',
    coupleName: 'Amaka & Tunde Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    title: 'Professional, creative, and so easy to work with',
    content: 'We were nervous about photography but this team made us feel so comfortable. They knew exactly how to pose us, what lighting worked best, and captured our personalities perfectly. The pre-wedding shoot was so much fun! Highly recommend for any couple looking for quality and professionalism.',
    date: '2026-01-05',
    weddingDate: '2025-11-28',
    service: 'Luxury Full-Day Package',
    verified: true,
    helpful: 32,
    photos: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300',
    ],
    recommended: true,
  },
  {
    id: 'R003',
    coupleName: 'Sarah & Michael Adeyemi',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    rating: 4,
    title: 'Great photos, minor communication delays',
    content: 'The final photos were stunning and we\'re very happy with the quality. The only reason for 4 stars instead of 5 is that there were some delays in communication during the editing process. However, when we received the final product, it was worth the wait. Would still recommend!',
    date: '2025-12-20',
    weddingDate: '2025-10-18',
    service: 'Essential Package',
    verified: true,
    helpful: 18,
    response: {
      content: 'Thank you for your honest feedback, Sarah and Michael! We apologize for the communication delays - we were handling an unusually high volume during that period. We\'ve since hired additional team members to ensure this doesn\'t happen again. We\'re so glad you love your photos! ❤️',
      date: '2025-12-21',
    },
    recommended: true,
  },
  {
    id: 'R004',
    coupleName: 'Blessing & Emeka Nwosu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    rating: 5,
    title: 'Made our destination wedding stress-free',
    content: 'Having a destination wedding in Dubai was stressful enough, but this team made the photography aspect completely seamless. They arrived early, scouted locations, and worked tirelessly throughout both days of our celebration. The photos look like they belong in a magazine. Simply incredible!',
    date: '2025-12-15',
    weddingDate: '2025-11-01',
    service: 'Destination Wedding Package',
    verified: true,
    helpful: 56,
    photos: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=300',
    ],
    recommended: true,
  },
  {
    id: 'R005',
    coupleName: 'Fatima & Ibrahim Hassan',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    rating: 5,
    title: 'Culturally sensitive and beautifully captured',
    content: 'We needed a photographer who understood the importance of cultural sensitivity for our Nikkai ceremony. This team not only understood but embraced our traditions, capturing every meaningful moment with respect and artistry. The way they photographed my henna and the traditional attire was breathtaking.',
    date: '2025-12-01',
    weddingDate: '2025-09-20',
    service: 'Traditional Ceremony Package',
    verified: true,
    helpful: 41,
    recommended: true,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 142, percentage: 78 },
  { stars: 4, count: 28, percentage: 15 },
  { stars: 3, count: 8, percentage: 4 },
  { stars: 2, count: 3, percentage: 2 },
  { stars: 1, count: 2, percentage: 1 },
];

export default function Reviews() {
  const [activeTab, setActiveTab] = useState(0);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const overallRating = 4.8;
  const totalReviews = 183;
  const responseRate = 94;
  const avgResponseTime = '< 24 hours';

  const handleReplyOpen = (review: Review) => {
    setSelectedReview(review);
    setReplyDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            fontSize: 28,
            color: '#002528',
            mb: 0.5,
          }}
        >
          Reviews & Testimonials
        </Typography>
        <Typography sx={{ color: '#666', fontSize: 14 }}>
          Manage reviews and build your reputation
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 3, mb: 4 }}>
        {/* Overall Rating Card */}
        <Card sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 56, fontWeight: 700, color: '#002528', lineHeight: 1 }}>
            {overallRating}
          </Typography>
          <Rating value={overallRating} readOnly precision={0.1} size="large" sx={{ my: 1 }} />
          <Typography sx={{ color: '#666', mb: 3 }}>
            Based on {totalReviews} reviews
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#00838F' }}>
                {responseRate}%
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#666' }}>Response Rate</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#00838F' }}>
                {avgResponseTime}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#666' }}>Avg Response</Typography>
            </Box>
          </Box>
        </Card>

        {/* Rating Breakdown */}
        <Card sx={{ p: 4, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 3, color: '#002528' }}>Rating Breakdown</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ratingBreakdown.map((rating) => (
              <Box key={rating.stars} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: 60 }}>
                  <Typography sx={{ mr: 0.5 }}>{rating.stars}</Typography>
                  <StarIcon sx={{ color: '#FFB400', fontSize: 18 }} />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={rating.percentage}
                  sx={{
                    flex: 1,
                    height: 12,
                    borderRadius: 6,
                    bgcolor: '#eee',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: rating.stars >= 4 ? '#4CAF50' : rating.stars === 3 ? '#FF9800' : '#f44336',
                      borderRadius: 6,
                    },
                  }}
                />
                <Typography sx={{ width: 60, textAlign: 'right', color: '#666' }}>
                  {rating.count} ({rating.percentage}%)
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Chip
              icon={<TrendingUpIcon />}
              label="Trending Up"
              sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}
            />
            <Chip
              icon={<VerifiedIcon />}
              label="95% Would Recommend"
              sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
            />
          </Box>
        </Card>
      </Box>

      {/* Featured Testimonial */}
      <Card
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #00838F 0%, #006064 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <FormatQuoteIcon sx={{ fontSize: 48, opacity: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 18, fontStyle: 'italic', mb: 2, lineHeight: 1.6 }}>
              "From our first consultation to the final delivery of our photos, every interaction was professional, warm, and exceeded our expectations. Worth every kobo!"
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={mockReviews[0].avatar}
                sx={{ width: 40, height: 40, border: '2px solid white' }}
              />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{mockReviews[0].coupleName}</Typography>
                <Typography sx={{ fontSize: 12, opacity: 0.8 }}>
                  {mockReviews[0].service}
                </Typography>
              </Box>
              <Rating value={5} readOnly size="small" sx={{ ml: 'auto' }} />
            </Box>
          </Box>
          <IconButton sx={{ color: 'white' }}>
            <ShareIcon />
          </IconButton>
        </Box>
      </Card>

      {/* Tabs */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            borderBottom: '1px solid #eee',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
            '& .Mui-selected': { color: '#00838F' },
            '& .MuiTabs-indicator': { bgcolor: '#00838F' },
          }}
        >
          <Tab label={`All Reviews (${totalReviews})`} />
          <Tab label="Pending Response (3)" />
          <Tab label="5 Star Reviews" />
          <Tab label="With Photos" />
        </Tabs>
      </Card>

      {/* Reviews List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {mockReviews.map((review) => (
          <Card key={review.id} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar src={review.avatar} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: '#002528' }}>
                      {review.coupleName}
                    </Typography>
                    {review.verified && (
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                        label="Verified"
                        size="small"
                        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', height: 24 }}
                      />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#666' }}>
                    {review.service} • Wedding: {formatDate(review.weddingDate)}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: 12, color: '#999' }}>{formatDate(review.date)}</Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>

            <Typography sx={{ fontWeight: 600, color: '#002528', mb: 1 }}>
              {review.title}
            </Typography>
            <Typography sx={{ color: '#444', lineHeight: 1.7, mb: 2 }}>
              {review.content}
            </Typography>

            {/* Photos */}
            {review.photos && review.photos.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {review.photos.map((photo, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Button
                size="small"
                startIcon={<ThumbUpIcon />}
                sx={{ textTransform: 'none', color: '#666' }}
              >
                Helpful ({review.helpful})
              </Button>
              {review.recommended && (
                <Chip
                  label="Would Recommend"
                  size="small"
                  sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                />
              )}
            </Box>

            {/* Vendor Response */}
            {review.response ? (
              <Box
                sx={{
                  bgcolor: '#f5f5f5',
                  p: 2,
                  borderRadius: 2,
                  borderLeft: '4px solid #00838F',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#00838F' }}>
                    Your Response
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#999' }}>
                    {formatDate(review.response.date)}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: '#444' }}>
                  {review.response.content}
                </Typography>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<ReplyIcon />}
                onClick={() => handleReplyOpen(review)}
                sx={{
                  textTransform: 'none',
                  borderColor: '#00838F',
                  color: '#00838F',
                }}
              >
                Reply to Review
              </Button>
            )}
          </Card>
        ))}
      </Box>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Reply to {selectedReview?.coupleName}'s Review
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 600, mb: 1, color: '#002528' }}>
              Their review:
            </Typography>
            <Typography sx={{ color: '#666', mb: 3, fontStyle: 'italic' }}>
              "{selectedReview?.content.substring(0, 200)}..."
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Write a professional and thoughtful response..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Typography sx={{ fontSize: 12, color: '#999', mt: 1 }}>
              Tip: Thank them for their feedback and address any specific points they mentioned.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReplyDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ textTransform: 'none', bgcolor: '#00838F', '&:hover': { bgcolor: '#006064' } }}
          >
            Post Response
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
