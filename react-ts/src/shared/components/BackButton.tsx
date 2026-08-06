/**
 * BackButton — A dynamic back button with navigation history awareness.
 *
 * Features:
 *  • Shows the name of the previous page (e.g. "Search Results")
 *  • Preserves query parameters & hash on back-navigation
 *  • Gracefully falls back to browser history or a default route
 *  • Tooltip with full previous URL for transparency
 *  • Configurable variant (icon-only, text, or full)
 *
 * Usage:
 *   import BackButton from '@/shared/components/BackButton';
 *   <BackButton />                           // default — icon + label
 *   <BackButton variant="icon" />            // icon only
 *   <BackButton fallbackPath="/couple/dashboard" />
 */

import React from 'react';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { ArrowBack, ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNavigationHistory } from '@/shared/hooks/useNavigationHistory';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface BackButtonProps {
  /** Rendering style */
  variant?: 'full' | 'icon' | 'text';
  /** Route to use when there is no history (defaults to `/`) */
  fallbackPath?: string;
  /** Override the auto-detected label */
  label?: string;
  /** Extra MUI sx overrides */
  sx?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const BackButton: React.FC<BackButtonProps> = ({
  variant = 'full',
  fallbackPath = '/',
  label,
  sx = {},
}) => {
  const navigate = useNavigate();
  const { canGoBack, goBack, previousLocation, previousPageLabel } =
    useNavigationHistory();

  const displayLabel = label || (canGoBack ? previousPageLabel : 'Back');

  const tooltipText = canGoBack && previousLocation
    ? `Go back to ${previousLocation.pathname}${previousLocation.search}`
    : 'Go back';

  const handleClick = () => {
    if (canGoBack) {
      goBack();
    } else {
      navigate(fallbackPath);
    }
  };

  /* ---- icon-only variant ---- */
  if (variant === 'icon') {
    return (
      <Tooltip title={tooltipText} arrow placement="bottom">
        <IconButton
          onClick={handleClick}
          aria-label={tooltipText}
          sx={{
            color: '#00838F',
            '&:hover': { bgcolor: 'rgba(0,131,143,0.08)' },
            ...sx,
          }}
        >
          <ArrowBack />
        </IconButton>
      </Tooltip>
    );
  }

  /* ---- text-only variant ---- */
  if (variant === 'text') {
    return (
      <Tooltip title={tooltipText} arrow placement="bottom">
        <Button
          onClick={handleClick}
          startIcon={<ChevronLeft />}
          sx={{
            color: '#00838F',
            textTransform: 'none',
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            px: 1,
            '&:hover': { bgcolor: 'rgba(0,131,143,0.08)' },
            ...sx,
          }}
        >
          {displayLabel}
        </Button>
      </Tooltip>
    );
  }

  /* ---- full variant (default) ---- */
  return (
    <Tooltip title={tooltipText} arrow placement="bottom">
      <Box
        onClick={handleClick}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          py: 0.75,
          px: 1.5,
          borderRadius: 2,
          transition: 'background-color 0.2s',
          '&:hover': {
            bgcolor: 'rgba(0,131,143,0.08)',
          },
          ...sx,
        }}
      >
        <ArrowBack sx={{ fontSize: 20, color: '#00838F' }} />
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: '#00838F',
          }}
        >
          {displayLabel}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default BackButton;
