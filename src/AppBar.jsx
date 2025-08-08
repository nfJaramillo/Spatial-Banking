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
    const pages = ['Experimento'];
    // Titulo que se muestra cuando el tamaño de pantalla es de un computador
    const titulo = 'Ultimatum'
    // Titulo que se muestra cuando el tamaño de pantalla es de un celular
    const tituloResumido = 'Ultimatum'
    // Link base de la pagina que debe ser igual al estipulado en App.jsx
    const linkBase = '/'

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
            return "Conectar";
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
                                    '& .MuiPaper-root': {
                                        borderRadius: 3,
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                        border: '1px solid rgba(0, 0, 0, 0.08)',
                                        minWidth: '200px',
                                        mt: 1,
                                        backdropFilter: 'blur(10px)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                                    },
                                    '& .MuiList-root': {
                                        py: 1
                                    }
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem 
                                        key={page} 
                                        onClick={() => handleCloseNavMenu(page)} 
                                        autoFocus
                                        sx={{
                                            py: 2.5,
                                            px: 3,
                                            borderRadius: 2,
                                            mx: 1.5,
                                            my: 1,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                transform: 'translateY(-2px) scale(1.02)',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(0) scale(0.98)'
                                            }
                                        }}
                                    >
                                        <Typography 
                                            textAlign="center" 
                                            sx={{ 
                                                fontWeight: 700,
                                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            {page}
                                        </Typography>
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
                                fontFamily: 'Nunito',
                                fontWeight: 700,
                                letterSpacing: { xs: '.1rem', sm: '.2rem' },
                                color: 'inherit',
                                textDecoration: 'none',
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                            }}
                        >
                            {tituloResumido}
                        </Typography>
                        <Box sx={{ flexGrow: 1, textAlign:'center', display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                component={ReactNav}
                                to={"/"+page.toLowerCase()}
                                    key={page}
                                    onClick={() => handleCloseNavMenu(page)}
                                    sx={{
                                        mr: 1, 
                                        my: 2, 
                                        color: 'white', 
                                        display: 'block',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            bgcolor: 'white', 
                                            color: 'black',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            border: '1px solid white'
                                        },
                                        '&.active': {
                                            bgcolor: 'white', 
                                            color: 'black',
                                            border: '1px solid white'
                                        }
                                    }}
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
                                sx={{ 
                                    backgroundColor: playerNumber ? '#00C587' : '#FCDB25',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    fontWeight: 600,
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                    },
                                    '&:disabled': {
                                        opacity: 0.7
                                    }
                                }}
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
                                sx={{ 
                                    backgroundColor: playerNumber ? '#00C587' : '#FCDB25',
                                    borderRadius: 3,
                                    px: { xs: 2, sm: 2.5 },
                                    py: { xs: 1.2, sm: 1.5 },
                                    minWidth: { xs: '85px', sm: '95px' },
                                    minHeight: { xs: '44px', sm: '48px' }, // Mejor área táctil
                                    fontWeight: 700,
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.25)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    textTransform: 'none',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.35)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                    },
                                    '&:disabled': {
                                        opacity: 0.7,
                                        transform: 'none'
                                    }
                                }}
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