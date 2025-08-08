import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState } from "react";
import { AppBarTop } from './AppBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home'
import Juego from './pages/juego'



export const AppContext = React.createContext(null)

const App = () => {

  //State variables
  const [alertText, setAlertText] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [open, setOpen] = useState(false);
  var [alert] = useState({
    text: setAlertText,
    severity: setAlertSeverity,
    show: setOpen,
  })

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <AppContext.Provider value={alert}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '16px' }}>
          <AppBarTop />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/experimento" element={<Juego />} />
            <Route exact path="*" element={<Navigate to='/' />} />
          </Routes>
          <Snackbar 
            open={open} 
            autoHideDuration={6000} 
            onClose={handleClose}
            anchorOrigin={{ 
              vertical: 'bottom', 
              horizontal: 'center' 
            }}
          >
            <Alert 
              onClose={handleClose} 
              severity={alertSeverity} 
              sx={{ width: '100%' }}
            >
              {alertText}
            </Alert>
          </Snackbar>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  typography: {
    fontFamily: 'Nunito',
    // Escalado responsive solo para las tipografías del contenido
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    },
    h2: {
      fontSize: 'clamp(1.75rem, 4vw, 3rem)',
    },
    h3: {
      fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
    },
    h4: {
      fontSize: 'clamp(1.25rem, 3vw, 2rem)',
    },
    h5: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
    },
    body1: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },
  palette: {
    yellow: createColor('#FCDB25'),
    primary: {
      main: '#2A2625',
      darker: '#FFDB00',
    },
    neutral: {
      main: 'FFFFFF',
      contrastText: '#FF8120',
    },
  },
  // Componentes optimizados para móvil pero sin afectar AppBar
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 44, // Mejor área táctil en móvil
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
  },
});


export default App;