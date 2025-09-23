import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material'

const rows = [
  { id: 'BKG-101', couple: 'Jane & John', date: '2025-11-12', status: 'Confirmed' },
  { id: 'BKG-102', couple: 'Amara & Uche', date: '2025-10-03', status: 'Pending' },
  { id: 'BKG-103', couple: 'Lara & Kunle', date: '2025-09-28', status: 'Cancelled' },
]

export default function Bookings() {
  return (
    <div>
      <Typography variant="h5" className="font-semibold mb-6">Bookings</Typography>
      <TableContainer component={Paper} className="rounded-xl">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Couple</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id} hover>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.couple}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>
                  <Chip label={r.status} color={r.status === 'Confirmed' ? 'success' : r.status === 'Pending' ? 'warning' : 'default'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
