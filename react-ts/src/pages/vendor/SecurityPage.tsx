import { Box, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';

const Security = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // TODO: Implement password change API call
  };

  return (
    <Box sx={{ maxWidth: '500px' }}>
      <Typography
        sx={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          fontSize: '20px',
          color: '#181818',
          mb: 3,
        }}
      >
        Security
      </Typography>

      <Box
        sx={{
          bgcolor: 'white',
          border: '1px solid #CCFDF2',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <TextField
          type="password"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={(e) => handleChange('oldPassword', e.target.value)}
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
          type="password"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) => handleChange('newPassword', e.target.value)}
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
          type="password"
          placeholder="Confirm Password"
          value={passwords.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
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

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: '#00838F',
            color: 'white',
            borderRadius: '100px',
            py: 1.5,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            mt: 2,
            '&:hover': {
              bgcolor: '#006B76',
            },
          }}
        >
          Update Password
        </Button>
      </Box>
    </Box>
  );
};

export default Security;
