import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
        <div className="App">
          <AppBarTop></AppBarTop>
          <Routes>
            <Route exact path="Ultimatum/" element={<Home />} />
            <Route exact path="Ultimatum/juego" element={<Juego />} />
            <Route exact path="*" element={<Navigate to='Ultimatum/' />} />
          </Routes>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
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
  
});


export default App;