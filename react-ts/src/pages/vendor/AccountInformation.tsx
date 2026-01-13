import { Box, Typography, TextField, Button, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const AccountInformation = () => {
  const [formData, setFormData] = useState({
    firstName: 'Taiwo',
    lastName: 'Ogundare',
    businessName: 'Sito Graphix and Interior Decor',
    location: 'Okota, Lagos',
    email: 'ogundare.taiwo.israel@gmail.com',
    countryCode: '+234',
    phone: '8066045863',
    categories: 'Graphics, Photography',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ maxWidth: '900px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            fontSize: '20px',
            color: '#181818',
          }}
        >
          User Profile
        </Typography>
        <Button
          sx={{
            color: 'transparent',
            background: 'linear-gradient(232deg, #EB1948 65%, #B52344 232%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            fontSize: '16px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'transparent',
            },
          }}
        >
          Edit Info
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: 'white',
          border: '1px solid #CCFDF2',
          p: 4,
        }}
      >
        {/* Personal Information */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
          <TextField
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                bgcolor: 'white',
                '& fieldset': {
                  borderColor: '#CCFDF2',
                },
              },
            }}
          />
          <TextField
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                bgcolor: 'white',
                '& fieldset': {
                  borderColor: '#CCFDF2',
                },
              },
            }}
          />
        </Box>

        <TextField
          fullWidth
          value={formData.businessName}
          onChange={(e) => handleChange('businessName', e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '100px',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '14px',
              bgcolor: 'white',
              '& fieldset': {
                borderColor: '#CCFDF2',
              },
            },
          }}
        />

        <TextField
          fullWidth
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '100px',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '14px',
              bgcolor: 'white',
              '& fieldset': {
                borderColor: '#CCFDF2',
              },
            },
          }}
        />

        <TextField
          fullWidth
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '100px',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '14px',
              bgcolor: 'white',
              '& fieldset': {
                borderColor: '#CCFDF2',
              },
            },
          }}
        />

        {/* Phone Number */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Select
            value={formData.countryCode}
            onChange={(e) => handleChange('countryCode', e.target.value)}
            IconComponent={ArrowDropDownIcon}
            sx={{
              width: '120px',
              borderRadius: '100px',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '14px',
              bgcolor: 'white',
              '& fieldset': {
                borderColor: '#CCFDF2',
              },
            }}
          >
            <MenuItem value="+234">+234</MenuItem>
            <MenuItem value="+1">+1</MenuItem>
            <MenuItem value="+44">+44</MenuItem>
          </Select>
          <Box sx={{ width: '1px', bgcolor: '#CCFDF2' }} />
          <TextField
            fullWidth
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                bgcolor: 'white',
                '& fieldset': {
                  borderColor: '#CCFDF2',
                },
              },
            }}
          />
        </Box>

        {/* Categories */}
        <TextField
          fullWidth
          multiline
          rows={2}
          value={formData.categories}
          onChange={(e) => handleChange('categories', e.target.value)}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '14px',
              bgcolor: 'white',
              '& fieldset': {
                borderColor: '#CCFDF2',
              },
            },
          }}
        />

        {/* Social Media Section */}
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            fontSize: '20px',
            color: '#002528',
            mb: 3,
          }}
        >
          Social Media
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Facebook"
            value={formData.facebook}
            onChange={(e) => handleChange('facebook', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                bgcolor: 'white',
                '& fieldset': {
                  borderColor: '#CCFDF2',
                },
              },
            }}
          />
          <TextField
            fullWidth
            placeholder="Twitter"
            value={formData.twitter}
            onChange={(e) => handleChange('twitter', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                bgcolor: 'white',
                '& fieldset': {
                  borderColor: '#CCFDF2',
                },
              },
            }}
          />
          <TextField
            fullWidth
            placeholder="Instagram"
            value={formData.instagram}
            onChange={(e) => handleChange('instagram', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                bgcolor: 'white',
                '& fieldset': {
                  borderColor: '#CCFDF2',
                },
              },
            }}
          />
          <TextField
            fullWidth
            placeholder="Youtube"
            value={formData.youtube}
            onChange={(e) => handleChange('youtube', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                bgcolor: 'white',
                '& fieldset': {
                  borderColor: '#CCFDF2',
                },
              },
            }}
          />
        </Box>

        {/* Save Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: '#00838F',
            color: 'white',
            borderRadius: '100px',
            py: 1.5,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            '&:hover': {
              bgcolor: '#006B76',
            },
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AccountInformation;
