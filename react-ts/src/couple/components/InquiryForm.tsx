import { useState } from 'react';
import { Dialog, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface InquiryFormProps {
  open: boolean;
  onClose: () => void;
  vendorName: string;
}

export default function InquiryForm({
  open,
  onClose,
  vendorName,
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement API call to send inquiry to backend
    // API endpoint: POST /api/inquiries

    setSubmitted(true);

    // Reset form after 2 seconds and close
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        message: ''
      });
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          p: 0
        }
      }}
    >
      <Box sx={{ position: 'relative', p: 4 }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#8a8a8a'
          }}
        >
          <Close />
        </IconButton>

        {/* Header */}
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: '#002528',
            mb: 1
          }}
        >
          Get in Touch
        </Typography>
        
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            color: '#8a8a8a',
            mb: 3
          }}
        >
          Send an inquiry to <strong>{vendorName}</strong>
        </Typography>

        {submitted ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 18,
                color: '#00838F',
                fontWeight: 600
              }}
            >
              ✓ Inquiry Sent!
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 14,
                color: '#8a8a8a',
                mt: 1
              }}
            >
              The vendor will get back to you soon
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Name Field */}
              <TextField
                label="Your Name"
                value={formData.name}
                onChange={handleChange('name')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#00838F'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00838F'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    '&.Mui-focused': {
                      color: '#00838F'
                    }
                  }
                }}
              />

              {/* Email Field */}
              <TextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#00838F'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00838F'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    '&.Mui-focused': {
                      color: '#00838F'
                    }
                  }
                }}
              />

              {/* Phone Field */}
              <TextField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#00838F'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00838F'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    '&.Mui-focused': {
                      color: '#00838F'
                    }
                  }
                }}
              />

              {/* Event Date Field */}
              <TextField
                label="Event Date"
                type="date"
                value={formData.eventDate}
                onChange={handleChange('eventDate')}
                required
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#00838F'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00838F'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    '&.Mui-focused': {
                      color: '#00838F'
                    }
                  }
                }}
              />

              {/* Message Field */}
              <TextField
                label="Your Message"
                value={formData.message}
                onChange={handleChange('message')}
                required
                fullWidth
                multiline
                rows={4}
                placeholder="Tell the vendor about your event and what you're looking for..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#00838F'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00838F'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 14,
                    '&.Mui-focused': {
                      color: '#00838F'
                    }
                  }
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                sx={{
                  bgcolor: '#00838F',
                  color: 'white',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: 'none',
                  py: 1.5,
                  borderRadius: '100px',
                  mt: 1,
                  '&:hover': {
                    bgcolor: '#006b75'
                  }
                }}
              >
                Send Inquiry
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </Dialog>
  );
}
