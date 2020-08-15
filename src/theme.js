import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#68d170',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    subtitle1: {
      fontVariant: 'small-caps',
      letterSpacing: '0.1rem',
    },
  }
});