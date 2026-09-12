import { createTheme } from '@mui/material/styles'

// Design tokens matching brand
const palette = {
  primary: {
    light: '#26bdce',
    main: '#00838F',
    dark: '#00626b',
    contrastText: '#ffffff',
  },

  segmentColor: {
    main: '#CCFDF2',
  },

  callToAction: {
    main: '#EB1948',
    dark: '#B52344',
  },

  bgThemeColor: {
    main: '#FFFFFF',
  },

  success: { main: '#10b981', contrastText: '#ffffff' },
  warning: { main: '#f59e0b', contrastText: '#111827' },
  error: { main: '#ef4444', contrastText: '#ffffff' },
  info: { main: '#26bdce', contrastText: '#ffffff' },
  grey: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
}

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    ...palette,
  },
  shape: {
    /** Cards/chips base — buttons use full pill radius below */
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"DM Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    h1: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2.25rem', fontWeight: 700, lineHeight: '2.5rem' },
    h2: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.875rem', fontWeight: 600, lineHeight: '2.25rem' },
    h3: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem', fontWeight: 600, lineHeight: '2rem' },
    h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem' },
    h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: '1.75rem' },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: '1.5rem' },
    body1: { fontSize: '1rem', lineHeight: '1.5rem' },
    body2: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    caption: { fontSize: '0.75rem', lineHeight: '1rem' },
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#00838F',
            '& + .MuiSwitch-track': {
              backgroundColor: '#00838F',
              opacity: 0.55,
            },
            '&.Mui-disabled': {
              color: '#99c5c9',
            },
          },
          '&.Mui-checked.Mui-disabled + .MuiSwitch-track': {
            backgroundColor: '#00838F',
          },
        },
        track: {
          backgroundColor: '#cbd5e1',
          opacity: 1,
        },
        thumb: {
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          /** Exact same pill radius on every Button */
          borderRadius: '9999px !important',
          fontWeight: 700,
          padding: '10px 20px',
          letterSpacing: 0.1,
          boxShadow: 'none',
          minHeight: 42,
        },
        sizeSmall: {
          padding: '6px 14px',
          minHeight: 34,
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '12px 28px',
          minHeight: 48,
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(90deg, #EB1948 0%, #B52344 100%)',
          '&:hover': {
            filter: 'brightness(0.95)',
            boxShadow: 'none',
          },
        },
        containedSecondary: {
          backgroundImage: 'linear-gradient(90deg, #00838F 0%, #00626b 100%)',
          '&:hover': {
            filter: 'brightness(0.95)',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
})
