import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Cambia a 'dark' para modo nocturno
    primary: {
      main: '#388e3c', // Verde ecológico
    },
    secondary: {
      main: '#fbc02d', // Amarillo
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
    contrastThreshold: 4.5,
  },
  typography: {
    fontFamily: 'Open Sans, Arial, sans-serif',
    fontSize: 16,
  },
});

export default theme;
