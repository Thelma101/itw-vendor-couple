import { Box, Pagination } from '@mui/material'

interface ResultsPaginationProps {
  page: number
  totalPages: number
  onChange: (newPage: number) => void
}

export default function ResultsPagination({ page, totalPages, onChange }: ResultsPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_e, value) => onChange(value)}
        color="primary"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#00838F',
          },
          '& .Mui-selected': {
            bgcolor: '#00838F !important',
            color: 'white',
          },
        }}
      />
    </Box>
  )
}
