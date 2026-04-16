import { Box, Typography, Button, Badge } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import WorkIcon from '@mui/icons-material/Work';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupsIcon from '@mui/icons-material/Groups';
import InsightsIcon from '@mui/icons-material/Insights';

const VendorDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname === `/vendor${path}`;

  const mainNavItems = [
    { label: 'Overview', path: '/vendor', icon: <DashboardIcon /> },
    { label: 'Leads', path: '/vendor/leads', icon: <LeaderboardIcon />, badge: 5 },
    { label: 'Bookings', path: '/vendor/bookings', icon: <EventIcon />, badge: 2 },
    { label: 'Messages', path: '/vendor/messages', icon: <ChatIcon />, badge: 3 },
    { label: 'Reviews', path: '/vendor/reviews', icon: <StarIcon /> },
    { label: 'Analytics', path: '/vendor/analytics', icon: <AnalyticsIcon /> },
    { label: 'Business Insights', path: '/vendor/insights', icon: <InsightsIcon /> },
    { label: 'Services', path: '/vendor/services', icon: <WorkIcon /> },
    { label: 'Promotions', path: '/vendor/promotions', icon: <LocalOfferIcon /> },
    { label: 'Availability', path: '/vendor/availability', icon: <CalendarMonthIcon /> },
    { label: 'Portfolio', path: '/vendor/portfolio', icon: <PhotoLibraryIcon /> },
    { label: 'Team', path: '/vendor/team', icon: <GroupsIcon /> },
  ];

  const settingsNavItems = [
    { label: 'Gallery', path: '/vendor/gallery', icon: <PhotoLibraryIcon /> },
    { label: 'Account Information', path: '/vendor/account', icon: <PersonIcon /> },
    { label: 'Subscription', path: '/vendor/subscription', icon: <CardMembershipIcon /> },
    { label: 'Payment Method', path: '/vendor/payment', icon: <PaymentIcon /> },
    { label: 'Security', path: '/vendor/security', icon: <SecurityIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FFFFFF' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: '390px',
          bgcolor: 'white',
          border: '1px solid #CCFDF2',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Profile Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              bgcolor: '#D9D9D9',
              mx: 'auto',
              mb: 2,
              position: 'relative',
              backgroundImage:
                'url(https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Edit indicator */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '17px',
                height: '17px',
                bgcolor: '#00838F',
                borderRadius: '50%',
                border: '2px solid white',
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: '20px',
              color: '#002528',
              mb: 3,
            }}
          >
            Thelma Akpata
          </Typography>

          {/* Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '30px',
                  color: '#002528',
                }}
              >
                1079
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  color: '#AAA',
                }}
              >
                Projects Completed
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '30px',
                  color: '#002528',
                }}
              >
                100K
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  color: '#AAA',
                }}
              >
                Projects Views
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '30px',
                  color: '#002528',
                }}
              >
                800
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  color: '#AAA',
                }}
              >
                Reviews
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', bgcolor: '#CCFDF2', mb: 2 }} />

        {/* Main Navigation */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '12px',
              color: '#AAA',
              textTransform: 'uppercase',
              letterSpacing: 1,
              px: 2,
              mb: 1,
            }}
          >
            Main Menu
          </Typography>
          {mainNavItems.map((item) => (
            <Box key={item.path}>
              <Button
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  py: 1.5,
                  px: 2,
                  color: isActive(item.path) ? '#00838F' : '#002528',
                  bgcolor: isActive(item.path) ? '#00838F10' : 'transparent',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  textTransform: 'none',
                  borderRadius: 0,
                  '&:hover': {
                    bgcolor: '#00838F10',
                    color: '#00838F',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  {item.label}
                  {item.badge && (
                    <Badge
                      badgeContent={item.badge}
                      sx={{
                        '& .MuiBadge-badge': {
                          bgcolor: '#EB1948',
                          color: 'white',
                        },
                      }}
                    />
                  )}
                </Box>
              </Button>
            </Box>
          ))}

          <Box sx={{ height: '1px', bgcolor: '#CCFDF2', my: 2 }} />

          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '12px',
              color: '#AAA',
              textTransform: 'uppercase',
              letterSpacing: 1,
              px: 2,
              mb: 1,
            }}
          >
            Settings
          </Typography>
          {settingsNavItems.map((item) => (
            <Box key={item.path}>
              <Button
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  py: 1.5,
                  px: 2,
                  color: isActive(item.path) ? '#00838F' : '#002528',
                  bgcolor: isActive(item.path) ? '#00838F10' : 'transparent',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  textTransform: 'none',
                  borderRadius: 0,
                  '&:hover': {
                    bgcolor: '#00838F10',
                    color: '#00838F',
                  },
                }}
              >
                {item.label}
              </Button>
            </Box>
          ))}
        </Box>

        {/* Logout */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Box sx={{ height: '1px', bgcolor: '#CCFDF2', mb: 2 }} />
          <Button
            startIcon={<LogoutIcon />}
            sx={{
              color: '#FA144A',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: '18px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'transparent',
              },
            }}
          >
            Log out
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          ml: '390px',
          p: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default VendorDashboardLayout;
