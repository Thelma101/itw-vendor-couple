import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { CheckCircle, ArrowForward, ArrowBack } from '@mui/icons-material'

interface OnboardingData {
  coupleNames: string
  weddingDate: string
  weddingLocation: string
  guestCount: string
  budget: string
  vendorCategories: string[]
  weddingStyle: string
}

const VENDOR_CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Videography',
  'Florist',
  'DJ/Music',
  'Makeup',
  'Decor',
  'Wedding Planner',
  'Transport',
  'Cake',
  'Invitations',
]

const WEDDING_STYLES = [
  'Traditional',
  'White Wedding',
  'Intimate',
  'Luxury',
  'Beach',
  'Garden',
  'Destination',
  'Themed',
]

const STEPS = ['Couple Info', 'Wedding Details', 'Vendor Preferences', 'Review']

export default function OnboardingFlow() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeStep, setActiveStep] = useState(0)
  const [openConfirm, setOpenConfirm] = useState(false)

  const [formData, setFormData] = useState<OnboardingData>({
    coupleNames: '',
    weddingDate: '',
    weddingLocation: '',
    guestCount: '',
    budget: '',
    vendorCategories: [],
    weddingStyle: '',
  })

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      vendorCategories: prev.vendorCategories.includes(category)
        ? prev.vendorCategories.filter((c) => c !== category)
        : [...prev.vendorCategories, category],
    }))
  }

  const handleComplete = () => {
    setOpenConfirm(true)
  }

  const handleConfirmComplete = () => {
    localStorage.setItem('coupleOnboardingData', JSON.stringify(formData))
    navigate('/couple/dashboard')
  }

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.coupleNames.trim() !== ''
      case 1:
        return (
          formData.weddingDate !== '' &&
          formData.weddingLocation.trim() !== '' &&
          formData.guestCount !== '' &&
          formData.budget !== ''
        )
      case 2:
        return formData.vendorCategories.length > 0 && formData.weddingStyle !== ''
      default:
        return true
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pt: { xs: 2, md: 4 }, pb: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#0F172A',
              mb: 1,
              fontSize: { xs: 28, md: 36 },
            }}
          >
            Let's Plan Your Wedding 💕
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: { xs: 14, md: 16 } }}>
            Tell us about your special day, and we'll help you find the perfect vendors
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Stepper
            activeStep={activeStep}
            sx={{
              '& .MuiStepLabel-label': {
                fontSize: { xs: 12, md: 14 },
              },
              '& .MuiStep-root': {
                py: { xs: 1, md: 2 },
              },
            }}
          >
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Card sx={{ borderRadius: 3, mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0F172A' }}>
                  What are your names?
                </Typography>
                <TextField
                  fullWidth
                  label="Both Names (e.g., John & Jane Doe)"
                  value={formData.coupleNames}
                  onChange={(e) => handleInputChange('coupleNames', e.target.value)}
                  placeholder="Bride's name & Groom's name"
                  sx={{ mb: 2 }}
                />
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0F172A' }}>
                  Wedding Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Wedding Date"
                      value={formData.weddingDate}
                      onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Wedding Location"
                      value={formData.weddingLocation}
                      onChange={(e) => handleInputChange('weddingLocation', e.target.value)}
                      placeholder="e.g., Lekki, Lagos"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Expected Guests"
                      value={formData.guestCount}
                      onChange={(e) => handleInputChange('guestCount', e.target.value)}
                      placeholder="100"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      select
                      label="Budget Range"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Select budget</option>
                      <option value="under-1m">Under ₦1M</option>
                      <option value="1m-5m">₦1M - ₦5M</option>
                      <option value="5m-10m">₦5M - ₦10M</option>
                      <option value="10m-20m">₦10M - ₦20M</option>
                      <option value="above-20m">Above ₦20M</option>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0F172A' }}>
                  Which vendor categories do you need?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
                  {VENDOR_CATEGORIES.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => handleCategoryToggle(category)}
                      color={
                        formData.vendorCategories.includes(category) ? 'primary' : 'default'
                      }
                      variant={
                        formData.vendorCategories.includes(category) ? 'filled' : 'outlined'
                      }
                      sx={{ borderRadius: 2 }}
                    />
                  ))}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0F172A' }}>
                  Wedding Style
                </Typography>
                <RadioGroup
                  value={formData.weddingStyle}
                  onChange={(e) => handleInputChange('weddingStyle', e.target.value)}
                >
                  <Grid container spacing={2}>
                    {WEDDING_STYLES.map((style) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={style}>
                        <FormControlLabel
                          value={style}
                          control={<Radio />}
                          label={style}
                          sx={{
                            p: 2,
                            border: '1px solid #E2E8F0',
                            borderRadius: 2,
                            mb: 0,
                            '&:hover': { bgcolor: '#f8fafc' },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </Box>
            )}

            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0F172A' }}>
                  Review Your Information
                </Typography>
                <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: 2, mb: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 0.5 }}>
                      Couple Names
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {formData.coupleNames}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 0.5 }}>
                      Wedding Date & Location
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {formData.weddingDate} • {formData.weddingLocation}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 0.5 }}>
                      Guests & Budget
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {formData.guestCount} guests • {formData.budget}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 0.5 }}>
                      Wedding Style
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {formData.weddingStyle}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1 }}>
                      Vendor Categories
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {formData.vendorCategories.map((cat) => (
                        <Chip key={cat} label={cat} size="small" />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBack />}
            sx={{ borderRadius: 2 }}
          >
            {isMobile ? 'Back' : 'Previous'}
          </Button>

          {activeStep === STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleComplete}
              endIcon={<CheckCircle />}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(90deg, #00838F 0%, #00626b 100%)',
                px: 4,
              }}
            >
              Complete Setup
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid()}
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(90deg, #00838F 0%, #00626b 100%)',
                px: 4,
              }}
            >
              {isMobile ? 'Next' : 'Continue'}
            </Button>
          )}
        </Box>
      </Container>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>🎉 Let's Get Started!</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Your preferences are saved. You can now explore vendors that match your wedding
            vision. Let's make your special day unforgettable!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirmComplete} variant="contained">
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
