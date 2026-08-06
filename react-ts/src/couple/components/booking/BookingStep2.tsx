import { Box, Typography, FormControlLabel, Checkbox, Card, Stack, Divider, Button } from '@mui/material'
import PaymentIcon from '@mui/icons-material/Payment'

interface BookingStep2Props {
  totalPrice: number
  depositAmount: number
  formData: any
  onFormChange: (field: string, value: any) => void
  onNext: () => void
  isNextDisabled?: boolean
}

export default function BookingStep2({ totalPrice, depositAmount, formData, onFormChange, onNext, isNextDisabled }: BookingStep2Props) {
  return (
    <Box>
      <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18, color: '#002528', mb: 3 }}>
        Payment Details
      </Typography>

      <Card sx={{ p: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: '#666' }}>Total Vendor Cost</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#002528' }}>₦{totalPrice.toLocaleString()}</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: '#666' }}>Deposit Required (30%)</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#00838F' }}>₦{depositAmount.toLocaleString()}</Typography>
          </Box>
        </Stack>
      </Card>

      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#002528', mb: 2 }}>Payment Method</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {['paystack', 'bank', 'transfer'].map((method) => (
            <Button
              key={method}
              variant={formData.paymentMethod === method ? 'contained' : 'outlined'}
              onClick={() => onFormChange('paymentMethod', method)}
              startIcon={<PaymentIcon />}
              sx={{
                flex: 1,
                textTransform: 'capitalize',
                bgcolor: formData.paymentMethod === method ? '#00838F' : 'transparent',
                color: formData.paymentMethod === method ? 'white' : '#00838F',
                borderColor: '#00838F',
              }}
            >
              {method === 'paystack' ? 'Paystack' : method === 'bank' ? 'Bank Transfer' : 'Card'}
            </Button>
          ))}
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.agreeTerms}
            onChange={(e) => onFormChange('agreeTerms', e.target.checked)}
            sx={{ color: '#00838F', '&.Mui-checked': { color: '#00838F' } }}
          />
        }
        label="I agree to the terms and conditions"
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={onNext}
        disabled={isNextDisabled}
        sx={{ bgcolor: '#00838F', '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 700, py: 1.2 }}
      >
        Complete Booking
      </Button>
    </Box>
  )
}
