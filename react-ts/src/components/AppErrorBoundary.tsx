import { Component, type ReactNode } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error('Route render error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center', p: 2 }}>
          <Paper sx={{ maxWidth: 520, p: 4, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#0F172A', mb: 1 }}>
              Something went wrong on this page
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#475569', mb: 3 }}>
              Try reloading this view. If the issue persists, return to dashboard and retry.
            </Typography>
            <Button
              variant="contained"
              onClick={this.handleReload}
              sx={{ bgcolor: '#00838F', textTransform: 'none', '&:hover': { bgcolor: '#006670' } }}
            >
              Reload page
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}
