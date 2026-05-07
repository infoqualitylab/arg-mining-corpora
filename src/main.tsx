import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App.tsx";

const theme = createTheme({
  typography: {
    fontFamily: '"IBM Plex Sans", sans-serif',
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 900,
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.9rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    subtitle2: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.8rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    body1: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.85rem',
    },
    body2: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.75rem',
    },
    overline: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.75rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    },
    button: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.7rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: '"IBM Plex Mono", monospace',
    }
  },
  colorSchemes: {
    dark: true,
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
