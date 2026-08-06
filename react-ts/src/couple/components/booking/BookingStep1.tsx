import { Box, Typography, TextField, Button, Stack } from '@mui/material'

interface BookingStep1Props {
  formData: {
    serviceDate: string
    serviceTime: string
    weddingDate: string
    ceremonyTime: string
    receptionTime: string
    guestCount: string
    venue: string
    specialRequests: string
  }
  onFormChange: (field: string, value: string) => void
  onNext: () => void
  isNextDisabled: boolean
}

export default function BookingStep1({ formData, onFormChange, onNext, isNextDisabled }: BookingStep1Props) {
  return (
    <Box>
      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18, color: '#002528', mb: 3 }}>
        Event Details
      </Typography>

      <Stack spacing={2.5}>
        <TextField
          label="Service Date"
          type="date"
          value={formData.serviceDate}
          onChange={(e) => onFormChange('serviceDate', e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Service Time"
          type="time"
          value={formData.serviceTime}
          onChange={(e) => onFormChange('serviceTime', e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Wedding Date"
          type="date"
          value={formData.weddingDate}
          onChange={(e) => onFormChange('weddingDate', e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Ceremony Time"
          type="time"
          value={formData.ceremonyTime}
          onChange={(e) => onFormChange('ceremonyTime', e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Reception Time"
          type="time"
          value={formData.receptionTime}
          onChange={(e) => onFormChange('receptionTime', e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField label="Guest Count" type="number" value={formData.guestCount} onChange={(e) => onFormChange('guestCount', e.target.value)} fullWidth />
        <TextField label="Venue" type="text" value={formData.venue} onChange={(e) => onFormChange('venue', e.target.value)} fullWidth />
        <TextField
          label="Special Requests"
          multiline
          rows={3}
          value={formData.specialRequests}
          onChange={(e) => onFormChange('specialRequests', e.target.value)}
          fullWidth
        />
      </Stack>

      <Button
        fullWidth
        variant="contained"
        onClick={onNext}
        disabled={isNextDisabled}
        sx={{ mt: 3, bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 700, py: 1.2 }}
      >
        Continue to Payment
      </Button>
    </Box>
  )
}
