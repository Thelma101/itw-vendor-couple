import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import PaymentIcon from '@mui/icons-material/Payment';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { useNotifications, type Notification } from '@/shared/contexts/NotificationContext';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'booking':
      return <EventIcon sx={{ color: '#00838F' }} />;
    case 'message':
      return <ChatIcon sx={{ color: '#2196F3' }} />;
    case 'payment':
      return <PaymentIcon sx={{ color: '#4CAF50' }} />;
    case 'review':
      return <StarIcon sx={{ color: '#FF9800' }} />;
    case 'system':
      return <InfoIcon sx={{ color: '#9C27B0' }} />;
    default:
      return <InfoIcon />;
  }
};

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const NotificationPanel: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      handleClose();
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label="Notifications"
        sx={{
          color: '#0F766E',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(15, 118, 110, 0.08)',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 480,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: '#FFFFFF',
            borderBottom: '1px solid #CCFDF2',
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: '#002528',
            }}
          >
            Notifications
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: '#EB1948',
                  color: 'white',
                  height: 22,
                  fontSize: 12,
                }}
              />
            )}
          </Typography>
          <Box>
            <IconButton
              size="small"
              onClick={markAllAsRead}
              title="Mark all as read"
              sx={{ color: '#00838F' }}
            >
              <MarkEmailReadIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={clearAll}
              title="Clear all"
              sx={{ color: '#666' }}
            >
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Notification List */}
        <List
          sx={{
            maxHeight: 350,
            overflow: 'auto',
            p: 0,
          }}
        >
          {notifications.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                color: '#666',
              }}
            >
              <NotificationsIcon sx={{ fontSize: 48, color: '#ddd', mb: 1 }} />
              <Typography>No notifications yet</Typography>
            </Box>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: notification.read ? 'transparent' : 'rgba(0, 131, 143, 0.04)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 131, 143, 0.08)',
                    },
                    pr: 6,
                    position: 'relative',
                  }}
                >
                  <ListItemAvatar>
                    {notification.avatar ? (
                      <Avatar src={notification.avatar} sx={{ width: 44, height: 44 }} />
                    ) : (
                      <Avatar sx={{ bgcolor: '#FFFFFF', width: 44, height: 44 }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: notification.read ? 400 : 600,
                          fontSize: 14,
                          color: '#002528',
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontSize: 13,
                            color: '#666',
                            display: 'block',
                            lineHeight: 1.4,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontSize: 12,
                            color: '#00838F',
                            mt: 0.5,
                            display: 'block',
                          }}
                        >
                          {formatTimeAgo(notification.timestamp)}
                        </Typography>
                      </>
                    }
                  />
                  {/* Unread indicator */}
                  {!notification.read && (
                    <Box
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#EB1948',
                      }}
                    />
                  )}
                  {/* Remove button */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    sx={{
                      position: 'absolute',
                      right: 28,
                      top: 8,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '.MuiListItem-root:hover &': {
                        opacity: 1,
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </ListItem>
                {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))
          )}
        </List>

        {/* Footer */}
        {notifications.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              borderTop: '1px solid #eee',
              textAlign: 'center',
            }}
          >
            <Button
              onClick={() => {
                navigate('/notifications');
                handleClose();
              }}
              sx={{
                color: '#00838F',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              View All Notifications
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default NotificationPanel;
