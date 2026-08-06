import { Box } from '@mui/material';

export default function BorderRectangle() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        border: '1px solid #ccfdf2',
        borderStyle: 'solid'
      }}
    />
  );
}
