import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#68d170',
    },
    error: {
      main: red[500],
    },
    background: {
      default: '#fff',
    },
  },

  typography: {
    h2: {
      fontVariant: 'small-caps',
      letterSpacing: '0.15rem',
      fontSize: '1.5rem',
      fontWeight: 300,

    },
    subtitle1: {
      fontVariant: 'small-caps',
      letterSpacing: '0.1rem',
    },
  }
});