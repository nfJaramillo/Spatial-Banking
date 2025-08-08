import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BancolombiaIcon from './/assets/logo.svg'
import { 
  getPlayerData,
  getAvailablePlayers,
  connectPlayer,
  disconnectPlayer,
} from "./utils/interact.jsx";
import { useEffect, useState, useContext } from "react";
import { AppContext } from './App';
import { useNavigate } from 'react-router-dom';
import { NavLink as ReactNav } from 'react-router-dom'
import PlayerSelectionDialog from './components/PlayerSelectionDialog';

export function AppBarTop() {

    // Se ejecuta cada vez que se renderiza y verifica si hay un jugador asignado
    useEffect(() => {
        function checkPlayerData() {
            const playerData = getPlayerData();
            console.log('Datos del jugador en localStorage:', playerData); // Debug
            
            if (playerData && playerData.playerNumber) {
                setPlayerNumber(playerData.playerNumber);
                console.log('Jugador establecido desde localStorage:', playerData.playerNumber); // Debug
            } else {
                console.log('No hay datos de jugador guardados'); // Debug
                setPlayerNumber(null);
            }
        }

        checkPlayerData();
    }, []); // Solo se ejecuta al montar el componente  

    // Lo siguientes 3 ajustes se pueden editar
    // Paginas que se muestran en el menu
    const pages = ['Juego'];
    // Titulo que se muestra cuando el tamaño de pantalla es de un computador
    const titulo = 'Ultimatum'
    // Titulo que se muestra cuando el tamaño de pantalla es de un celular
    const tituloResumido = 'BASE'
    // Link base de la pagina que debe ser igual al estipulado en App.jsx
    const linkBase = 'Ultimatum/'

    const navigate = useNavigate();
    const [playerNumber, setPlayerNumber] = useState(null);
    const [showPlayerDialog, setShowPlayerDialog] = useState(false);
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const contextData = useContext(AppContext);

    const handlePlayerButtonPressed = async () => {
        if (isLoading) return; // Evitar múltiples clicks
        
        setIsLoading(true);
        
        try {
            if (playerNumber) {
                // Si ya es un jugador, desconectar
                await handleDisconnectPlayer();
            } else {
                // Si no es jugador, mostrar selección
                await showPlayerSelection();
            }
        } finally {
            setIsLoading(false);
        }
    };


    const showPlayerSelection = async () => {
        try {
            const available = await getAvailablePlayers();
            setAvailablePlayers(available);
            setShowPlayerDialog(true);
        } catch (error) {
            contextData.severity("error");
            contextData.text("Error al obtener jugadores disponibles");
            contextData.show(true);
        }
    };

    const handlePlayerSelection = async (selectedPlayer) => {
        setIsLoading(true);
        try {
            const result = await connectPlayer(selectedPlayer);
            
            if (result.success) {
                setPlayerNumber(selectedPlayer);
                setShowPlayerDialog(false);
                
                contextData.severity("success");
                const message = result.source === 'local' 
                    ? `¡Te has conectado como Jugador ${selectedPlayer}! (Modo offline)`
                    : `¡Te has conectado como Jugador ${selectedPlayer}!`;
                contextData.text(message);
                contextData.show(true);
            } else {
                contextData.severity("error");
                contextData.text("Error al conectar como jugador. Inténtalo de nuevo.");
                contextData.show(true);
            }
        } catch (error) {
            contextData.severity("error");
            contextData.text("Error de conexión. Verifica tu internet.");
            contextData.show(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnectPlayer = async () => {
        try {
            const result = await disconnectPlayer(playerNumber);
            
            if (result.success) {
                setPlayerNumber(null);
                
                contextData.severity("info");
                const message = result.source === 'local' 
                    ? "Te has desconectado como jugador (Modo offline)"
                    : "Te has desconectado como jugador";
                contextData.text(message);
                contextData.show(true);
            } else {
                contextData.severity("error");
                contextData.text("Error al desconectar. Inténtalo de nuevo.");
                contextData.show(true);
            }
        } catch (error) {
            contextData.severity("error");
            contextData.text("Error de conexión. Verifica tu internet.");
            contextData.show(true);
        }
    };

    const getButtonText = () => {
        if (isLoading) {
            return "Cargando...";
        }
        if (playerNumber) {
            return `Jugador ${playerNumber}`;
        } else {
            return "Conectar como Jugador";
        }
    };

    const getButtonTextMobile = () => {
        if (isLoading) {
            return "...";
        }
        if (playerNumber) {
            return `J${playerNumber}`;
        } else {
            return "Jugador";
        }
    };

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = (page) => {
        page = page.toLowerCase();
        navigate(linkBase + page);
        setAnchorElNav(null);
    };

    return (
        <>
            <AppBar position="static" sx={{ borderRadius: 1 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box component="img" src={BancolombiaIcon} alt="Logo de Bancolombia" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, maxWidth: 40 }} />

                        <MenuItem onClick={() => handleCloseNavMenu("")} sx={{ display: { xs: 'none', md: 'flex' }}}>
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    '&:hover': {bgcolor: 'white', color: 'black'},
                                    borderRadius: 1
                                }}
                            >
                                {titulo}
                            </Typography>
                        </MenuItem>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={() => handleCloseNavMenu("")}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={() => handleCloseNavMenu(page)} autoFocus >
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        
                      <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            onClick={() => handleCloseNavMenu("")}
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            {tituloResumido}
                        </Typography>
                        <Box sx={{ flexGrow: 1, textAlign:'center', display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                component={ReactNav}
                                to={"Ultimatum/"+page.toLowerCase()}
                                    key={page}
                                    onClick={() => handleCloseNavMenu(page)}
                                    sx={{mr: 1, my: 2, color: 'white', active:'true', display: 'block', '&:hover': {bgcolor: 'white', color: 'black'},'&.active': {bgcolor: 'white', color: 'black'}}}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0,  display: { xs: 'none', md: 'flex' }}}>
                            <Button 
                                variant="contained" 
                                id="playerButton" 
                                onClick={handlePlayerButtonPressed} 
                                disabled={isLoading}
                                color={playerNumber ? "primary" : "yellow"} 
                                sx={{ backgroundColor: playerNumber ? '#00C587' : '#FCDB25' }}
                            >
                                {getButtonText()}
                            </Button>
                        </Box>

                        <Box sx={{ flexGrow: 0,  display: { xs: 'flex', md: 'none' }}}>
                            <Button 
                                variant="contained" 
                                id="playerButton" 
                                onClick={handlePlayerButtonPressed} 
                                disabled={isLoading}
                                color={playerNumber ? "primary" : "yellow"} 
                                sx={{ backgroundColor: playerNumber ? '#00C587' : '#FCDB25' }}
                            >
                                {getButtonTextMobile()}
                            </Button>
                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>

            <PlayerSelectionDialog
                open={showPlayerDialog}
                onClose={() => setShowPlayerDialog(false)}
                onSelectPlayer={handlePlayerSelection}
                availablePlayers={availablePlayers}
            />
        </>
    )
}