import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Avatar, Box, Badge, IconButton } from '@mui/material';
import { Bookmark as BookmarkIcon } from '@mui/icons-material';
import { useShortlist } from '../contexts/ShortlistContext';
import NotificationPanel from './NotificationPanel';

const logoUrl = "https://www.figma.com/api/mcp/asset/4b2b3f7a-02c6-4f2a-9c46-1085c4bc411e";
const avatarUrl = "https://www.figma.com/api/mcp/asset/bcffd6cc-e39b-4753-8297-cc196391845c";

export default function Nav() {
    const { totalItems } = useShortlist();
    const navigate = useNavigate();
    
    return (
        <AppBar 
            position="static" 
            sx={{ 
                backgroundColor: 'white',
                borderBottom: '0.25px solid',
                borderColor: 'primary.main',
                boxShadow: 'none',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '66px !important', px: 3 }}>
                {/* Logo */}
                <Box 
                    component={Link} 
                    to="/"
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        width: '114px',
                        textDecoration: 'none'
                    }}
                >
                    <img 
                        src={logoUrl} 
                        alt="itheewed logo" 
                        style={{ 
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain'
                        }} 
                    />
                </Box>

                {/* Navigation Links — sequential wedding planning flow */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'center' }}>
                    <Button 
                        component={Link}
                        to="/couple/dashboard"
                        sx={{ 
                            color: 'primary.main',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 131, 143, 0.04)'
                            }
                        }}
                    >
                        Dashboard
                    </Button>

                    <Button 
                        component={Link}
                        to="/couple/search-results"
                        sx={{ 
                            color: 'primary.main',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 131, 143, 0.04)'
                            }
                        }}
                    >
                        Hire Vendors
                    </Button>

                    <Button 
                        component={Link}
                        to="/couple/checklist"
                        sx={{ 
                            color: 'primary.main',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 131, 143, 0.04)'
                            }
                        }}
                    >
                        Checklist
                    </Button>

                    <Button 
                        component={Link}
                        to="/couple/budget"
                        sx={{ 
                            color: 'primary.main',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 131, 143, 0.04)'
                            }
                        }}
                    >
                        Budget
                    </Button>

                    <Button 
                        component={Link}
                        to="/couple/guests"
                        sx={{ 
                            color: 'primary.main',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 131, 143, 0.04)'
                            }
                        }}
                    >
                        Guests
                    </Button>

                    {/* TODO: Feature flag - Wedding website feature */}
                    {true && (
                    <Button 
                        component={Link}
                        to="/couple/wedding-website"
                        sx={{ 
                            color: 'primary.main',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 131, 143, 0.04)'
                            }
                        }}
                    >
                        Website
                    </Button>
                    )}

                    {/* TODO: Feature flag - Day-of timeline feature */}
                    {true && (
                    <Button 
                        component={Link}
                        to="/couple/timeline"
                        sx={{ 
                            color: 'primary.main',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 131, 143, 0.04)'
                            }
                        }}
                    >
                        Timeline
                    </Button>
                    )}

                    {/* TODO: Feature flag - AskWed AI assistant feature */}
                    {true && (
                    <Button 
                        component={Link}
                        to="/couple/askwed"
                        sx={{ 
                            color: 'primary.main',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 131, 143, 0.04)'
                            }
                        }}
                    >
                        AskWed
                    </Button>
                    )}
                </Box>

                {/* Right Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Notification Panel */}
                    <NotificationPanel />

                    {/* Shortlist Icon */}
                    <IconButton
                        component={Link}
                        to="/couple/shortlist"
                        sx={{
                            color: '#00838F',
                            '&:hover': {
                                bgcolor: 'rgba(0, 131, 143, 0.04)'
                            }
                        }}
                    >
                        <Badge badgeContent={totalItems} color="error">
                            <BookmarkIcon />
                        </Badge>
                    </IconButton>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#00838F',
                            color: 'white',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            borderRadius: '4px',
                            display: { xs: 'none', md: 'block' },
                            '&:hover': {
                                backgroundColor: '#006b75'
                            }
                        }}
                    >
                        Show work
                    </Button>

                    <Avatar 
                        src={avatarUrl}
                        onClick={() => navigate('/couple/profile')}
                        sx={{ 
                            width: 43, 
                            height: 43,
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
};
