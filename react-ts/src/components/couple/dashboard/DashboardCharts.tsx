import { Box, Paper, Typography } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface BudgetData {
  name: string
  value: number
}

interface TimelineData {
  week: string
  progress: number
}

interface DashboardChartsProps {
  budgetData: BudgetData[]
  timelineData: TimelineData[]
}

const COLORS = ['#0F766E', '#1E6091', '#B88900', '#2D5A27']

export default function DashboardCharts({ budgetData, timelineData }: DashboardChartsProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5, mb: 3 }}>
      {/* Budget Breakdown Pie Chart */}
      <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A', mb: 2 }}>Budget Breakdown</Typography>
        {budgetData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={budgetData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {budgetData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `N${Number(value).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ height: 250, display: 'grid', placeItems: 'center' }}>
            <Typography sx={{ color: '#94A3B8' }}>No expense data available</Typography>
          </Box>
        )}
      </Paper>

      {/* Timeline Progress Chart */}
      <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0F172A', mb: 2 }}>Planning Timeline</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="week" stroke="#94A3B8" style={{ fontSize: 12 }} />
            <YAxis stroke="#94A3B8" style={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }} cursor={{ stroke: '#0F766E', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="progress" stroke="#0F766E" strokeWidth={3} dot={{ fill: '#0F766E', r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  )
}
