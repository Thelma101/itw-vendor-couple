import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Button, Avatar, Box, Badge, IconButton } from '@mui/material'
import { Bookmark as BookmarkIcon } from '@mui/icons-material'
import { useShortlist } from '@/shared/contexts/ShortlistContext'
import NotificationPanel from './NotificationPanel'
import Logo from '@/marketing/components/Logo'

const avatarUrl = 'https://www.figma.com/api/mcp/asset/bcffd6cc-e39b-4753-8297-cc196391845c'

const links = [
  { label: 'Dashboard', path: '/couple/dashboard' },
  { label: 'Hire Vendors', path: '/couple/search-results' },
  { label: 'Checklist', path: '/couple/checklist' },
  { label: 'Budget', path: '/couple/budget' },
  { label: 'Guests', path: '/couple/guests' },
  { label: 'Registry', path: '/couple/registry' },
  { label: 'Website', path: '/couple/wedding-website' },
]

export default function Nav() {
  const { totalItems } = useShortlist()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E2E8F0',
        color: '#0B2D31',
        top: 0,
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important', px: { xs: 2, md: 3 }, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Logo linkToHome height={36} />
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.5,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {links.map((link) => {
            const active = pathname === link.path || pathname.startsWith(`${link.path}/`)
            return (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  color: active ? '#0F766E' : '#475569',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: active ? 700 : 600,
                  fontSize: 13.5,
                  textTransform: 'none',
                  px: 1.75,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: active ? 'rgba(15, 118, 110, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(15, 118, 110, 0.06)',
                    color: '#0F766E',
                  },
                }}
              >
                {link.label}
              </Button>
            )
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
          <NotificationPanel />

          <IconButton
            component={Link}
            to="/couple/shortlist"
            sx={{
              color: '#0F766E',
              bgcolor: 'rgba(15, 118, 110, 0.06)',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.12)' },
            }}
          >
            <Badge badgeContent={totalItems} color="error">
              <BookmarkIcon />
            </Badge>
          </IconButton>

          <Avatar
            src={avatarUrl}
            onClick={() => navigate('/couple/profile')}
            sx={{
              width: 40,
              height: 40,
              cursor: 'pointer',
              border: '2px solid #CCFBF1',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
