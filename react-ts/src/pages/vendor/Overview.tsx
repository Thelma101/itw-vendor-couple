import { Card, CardContent, Typography, Grid } from '@mui/material'

const kpis = [
  { label: 'New Inquiries', value: 8 },
  { label: 'Active Bookings', value: 12 },
  { label: 'Revenue (Mtd)', value: '$4,820' },
  { label: 'Unread Messages', value: 3 },
]

export default function Overview() {
  return (
    <div>
      <Typography variant="h5" className="font-semibold mb-6">Overview</Typography>
      <Grid container spacing={2}>
        {kpis.map(k => (
          <Grid key={k.label} item xs={12} sm={6} md={3}>
            <Card className="rounded-xl">
              <CardContent>
                <Typography className="text-gray-500" variant="body2">{k.label}</Typography>
                <Typography className="text-2xl font-semibold mt-2">{k.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
