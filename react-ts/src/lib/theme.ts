import { createTheme } from '@mui/material/styles'

const palette = {
  primary: {
    light: '#818cf8',
    main: '#6366f1',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  success: { main: '#22c55e', contrastText: '#ffffff' },
  warning: { main: '#f59e0b', contrastText: '#111827' },
  error: { main: '#ef4444', contrastText: '#ffffff' },
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
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 10,
        },
      },
    },
  },
})
