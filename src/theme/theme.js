import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00488d',
      light: '#005fb8',
      dark: '#001b3d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#53606e',
      light: '#d6e4f5',
      dark: '#3b4855',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ba1a1a',
      light: '#ffdad6',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#191c1d',
      secondary: '#424752',
      disabled: '#727783',
    },
    divider: 'rgba(194, 198, 212, 0.15)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, color: '#424752' },
    subtitle2: { fontWeight: 500, color: '#424752' },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400, color: '#424752' },
    caption: {
      fontWeight: 500,
      letterSpacing: '0.05rem',
      textTransform: 'uppercase',
      color: '#424752',
    },
    overline: {
      letterSpacing: '0.08rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(25,28,29,0.04)',
    '0 4px 16px rgba(25,28,29,0.06)',
    '0 8px 24px rgba(25,28,29,0.08)',
    '0 12px 32px rgba(25,28,29,0.10)',
    ...Array(20).fill('0 16px 40px rgba(25,28,29,0.12)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #00488d, #005fb8)',
          '&:hover': { background: 'linear-gradient(135deg, #003d7a, #004da0)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(25,28,29,0.04)',
          border: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.05rem',
            textTransform: 'uppercase',
            color: '#424752',
            backgroundColor: '#f2f4f5',
            borderBottom: 'none',
            paddingTop: 14,
            paddingBottom: 14,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          padding: '14px 16px',
          color: '#191c1d',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#e6e8e9',
            borderRadius: 6,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.72rem',
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#f2f4f5',
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 16px rgba(25,28,29,0.04)',
            },
            '&.Mui-focused fieldset': { border: 'none' },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 24px 48px rgba(25,28,29,0.16)',
        },
      },
    },
  },
});

export default theme;
