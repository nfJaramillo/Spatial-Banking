/**
 * Componente principal del Juego del Ultimátum
 * 
 * Este componente maneja la interfaz de usuario para un jugador específico en el juego del ultimátum.
 * Permite a los jugadores ver ofertas de diferentes tipos de cuentas (ahorros, wenia, acciones)
 * y decidir si aceptar o rechazar dichas ofertas.
 * 
 * Características principales:
 * - Detección automática de conexión del jugador
 * - Polling inteligente para obtener ofertas en tiempo real
 * - Interfaz responsive con diseño Bancolombia
 * - Manejo de estados de carga y errores
 * 
 * @author Sistema de Spatial Banking
 * @version 1.0.0
 */

import { Typography, Grid, Box, Card, CardContent, Button, Container } from "@mui/material";
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { 
    getPlayerData, 
    getPlayerByName, 
    setPlayerAcceptanceStatus 
} from "../utils/interact.jsx";
import { AppContext } from '../App';

// Constantes de configuración
const POLLING_INTERVALS = {
    CONNECTION_CHECK: 1000, // 1 segundo para verificar conexión
    OFFER_UPDATE: 5000,     // 5 segundos para actualizar ofertas
    POST_ACTION_DELAY: 1000 // 1 segundo después de aceptar/rechazar
};

const COLORS = {
    BANCOLOMBIA: {
        YELLOW: '#FFD204',
        GREEN: '#00C587',
        ORANGE: '#FF803A',
        PINK: '#FFB8D2',
        BLUE: '#01CDEB',
        DARK: '#2C2A29',
        LIGHT: '#F7F7F7'
    }
};

const Juego = () => {
    // Estados principales
    const [playerNumber, setPlayerNumber] = useState(null);
    const [ofertas, setOfertas] = useState({
        ahorros: 0,
        wenia: 0,
        acciones: 0
    });
    const [hasNewOffers, setHasNewOffers] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [estadoAceptacion, setEstadoAceptacion] = useState('esperando');
    const [lastLoggedState, setLastLoggedState] = useState(null);
    
    const contextData = useContext(AppContext);

    /**
     * Obtiene los datos del jugador desde la API
     * Actualiza el estado local con las ofertas y el estado de aceptación
     * 
     * @param {number} playerNum - Número del jugador (2-7)
     */
    const fetchPlayerData = useCallback(async (playerNum) => {
        if (!playerNum) return;
        
        try {
            const playerName = `Jugador${playerNum}`;
            const data = await getPlayerByName(playerName);
            
            if (data && Array.isArray(data) && data.length > 0) {
                const playerData = data[0];
                const newEstado = playerData.estatusAceptacion || 'esperando';
                setEstadoAceptacion(newEstado);
                
                // Extraer valores de las cuentas
                const cuentas = playerData.cuentas || {};
                const newOfertas = {
                    ahorros: cuentas.ahorros || 0,
                    wenia: cuentas.wenia || 0,
                    acciones: cuentas.acciones || 0
                };
                
                setOfertas(newOfertas);
                
                // Determinar si los botones deben estar habilitados
                const hasOffers = Object.values(newOfertas).some(value => value > 0);
                const shouldEnableButtons = hasOffers && (newEstado === 'esperando');
                setHasNewOffers(shouldEnableButtons);
                
                // Log solo cuando hay cambios significativos
                const currentState = `${hasOffers}-${newEstado}`;
                if (hasOffers && newEstado === 'esperando' && lastLoggedState !== currentState) {
                    console.log('💰 Nueva oferta disponible para', playerName);
                    setLastLoggedState(currentState);
                }
            }
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    }, [lastLoggedState]);

    /**
     * Maneja la acción de rechazar una oferta
     * Actualiza el estado tanto localmente como en el servidor
     */
    const handleRechazar = useCallback(async () => {
        if (isLoading || !hasNewOffers) return;
        
        setIsLoading(true);
        try {
            const playerName = `Jugador${playerNumber}`;
            const result = await setPlayerAcceptanceStatus(playerName, 'rechazado');
            
            if (result) {
                setEstadoAceptacion('rechazado');
                setHasNewOffers(false);
                contextData.severity("error");
                contextData.text("Has rechazado la oferta");
                contextData.show(true);
                
                // Actualizar datos después del rechazo
                setTimeout(() => fetchPlayerData(playerNumber), POLLING_INTERVALS.POST_ACTION_DELAY);
            } else {
                contextData.severity("error");
                contextData.text("Error al procesar el rechazo");
                contextData.show(true);
            }
        } catch (error) {
            console.error('Error rejecting offer:', error);
            contextData.severity("error");
            contextData.text("Error de conexión al rechazar");
            contextData.show(true);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasNewOffers, playerNumber, fetchPlayerData, contextData]);

    /**
     * Maneja la acción de aceptar una oferta
     * Actualiza el estado tanto localmente como en el servidor
     */
    const handleAceptar = useCallback(async () => {
        if (isLoading || !hasNewOffers) return;
        
        setIsLoading(true);
        try {
            const playerName = `Jugador${playerNumber}`;
            const result = await setPlayerAcceptanceStatus(playerName, 'aceptado');
            
            if (result) {
                setEstadoAceptacion('aceptado');
                setHasNewOffers(false);
                contextData.severity("success");
                contextData.text("Has aceptado la oferta");
                contextData.show(true);
                
                // Actualizar datos después de la aceptación
                setTimeout(() => fetchPlayerData(playerNumber), POLLING_INTERVALS.POST_ACTION_DELAY);
            } else {
                contextData.severity("error");
                contextData.text("Error al procesar la aceptación");
                contextData.show(true);
            }
        } catch (error) {
            console.error('Error accepting offer:', error);
            contextData.severity("error");
            contextData.text("Error de conexión al aceptar");
            contextData.show(true);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasNewOffers, playerNumber, fetchPlayerData, contextData]);

    /**
     * Formatea el texto del botón de oferta según el valor
     * @param {string} cuenta - Tipo de cuenta (ahorros, wenia, acciones)
     * @returns {string} Texto formateado para mostrar
     */
    const getOfertaButtonText = useCallback((cuenta) => {
        const valor = ofertas[cuenta];
        return valor > 0 ? `$${valor.toLocaleString()}` : "Esperando oferta...";
    }, [ofertas]);

    /**
     * Determina el mensaje y color del estado actual del juego
     * @returns {Object} Objeto con texto y color del estado
     */
    const getEstadoMessage = useMemo(() => {
        if (estadoAceptacion === 'aceptado') {
            return { text: "Oferta aceptada", color: "success" };
        } else if (estadoAceptacion === 'rechazado') {
            return { text: "Oferta rechazada", color: "error" };
        } else if (hasNewOffers) {
            return { text: "¡Nueva oferta disponible!", color: "warning" };
        } else {
            return { text: "Esperando oferta...", color: "info" };
        }
    }, [estadoAceptacion, hasNewOffers]);

    // Efecto para inicialización del jugador
    useEffect(() => {
        const playerData = getPlayerData();
        if (playerData?.playerNumber) {
            setPlayerNumber(playerData.playerNumber);
            fetchPlayerData(playerData.playerNumber);
        }
    }, [fetchPlayerData]);

    // Efecto para detectar cambios en el estado de conexión del jugador
    useEffect(() => {
        const checkPlayerConnection = () => {
            const playerData = getPlayerData();
            if (playerData?.playerNumber && !playerNumber) {
                // El jugador se acaba de conectar
                setPlayerNumber(playerData.playerNumber);
                fetchPlayerData(playerData.playerNumber);
            } else if (!playerData && playerNumber) {
                // El jugador se desconectó - limpiar estado
                setPlayerNumber(null);
                setOfertas({ ahorros: 0, wenia: 0, acciones: 0 });
                setHasNewOffers(false);
                setEstadoAceptacion('esperando');
            }
        };

        const connectionInterval = setInterval(checkPlayerConnection, POLLING_INTERVALS.CONNECTION_CHECK);
        return () => clearInterval(connectionInterval);
    }, [playerNumber, fetchPlayerData]);

    // Efecto para polling de ofertas (solo cuando está esperando)
    useEffect(() => {
        if (playerNumber && estadoAceptacion === 'esperando') {
            const interval = setInterval(() => {
                fetchPlayerData(playerNumber);
            }, POLLING_INTERVALS.OFFER_UPDATE);

            return () => clearInterval(interval);
        }
    }, [playerNumber, estadoAceptacion, fetchPlayerData]);

    // Renderizado condicional cuando no hay jugador conectado
    if (!playerNumber) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Card sx={{ textAlign: 'center', py: 4 }}>
                    <CardContent>
                        <Typography variant="h5" color="error" gutterBottom>
                            Acceso Denegado
                        </Typography>
                        <Typography variant="body1">
                            Debes conectarte como jugador para acceder al juego.
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Usa el botón "Conectar como Jugador" en la barra superior.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Grid container 
            direction="column" 
            justifyContent="center" 
            maxWidth="xl" 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: '#cfe8fc', 
                minHeight: { xs: '90vh', md: '85vh' }, 
                borderRadius: 1, 
                mt: 3, 
                background: 'linear-gradient(to bottom, #F8F8F8, #FFFFFF)',
                p: { xs: 1.5, md: 2 },
                overflow: 'hidden'
            }}
        >
            <Grid container spacing={{ xs: 1, md: 1.5 }} sx={{ height: '100%', maxWidth: '100%' }}>
                {/* Título Principal */}
                <Grid item xs={12}>
                    <Card sx={{ 
                        background: `linear-gradient(135deg, ${COLORS.BANCOLOMBIA.DARK} 0%, #1a1918 100%)`, 
                        color: COLORS.BANCOLOMBIA.LIGHT,
                        textAlign: 'center',
                        py: { xs: 1, md: 1.5 },
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(44, 42, 41, 0.2)'
                    }}>
                        <Typography variant="h4" component="h1" sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            mb: 0.3
                        }}>
                            Jugador {playerNumber}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                            color: COLORS.BANCOLOMBIA.YELLOW,
                            fontWeight: 500,
                            opacity: 0.9,
                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                        }}>
                            El juego del ultimátum
                        </Typography>
                    </Card>
                </Grid>

                {/* Estado del Juego */}
                <Grid item xs={12}>
                    <Card sx={{ 
                        backgroundColor: getEstadoMessage.color === 'warning' ? COLORS.BANCOLOMBIA.YELLOW : 
                                         getEstadoMessage.color === 'success' ? COLORS.BANCOLOMBIA.GREEN :
                                         getEstadoMessage.color === 'error' ? COLORS.BANCOLOMBIA.ORANGE : COLORS.BANCOLOMBIA.BLUE,
                        borderRadius: 2,
                        textAlign: 'center',
                        py: { xs: 0.8, md: 1 },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <Typography variant="body1" sx={{ 
                            fontWeight: 'bold',
                            color: getEstadoMessage.color === 'warning' ? COLORS.BANCOLOMBIA.DARK : COLORS.BANCOLOMBIA.LIGHT,
                            mb: 0.5,
                            textShadow: getEstadoMessage.color === 'warning' ? 'none' : '1px 1px 2px rgba(0,0,0,0.3)',
                            fontSize: { xs: '0.85rem', md: '1rem' }
                        }}>
                            {getEstadoMessage.text}
                        </Typography>
                        <Button 
                            variant={getEstadoMessage.color === 'warning' ? "contained" : "outlined"}
                            size="small" 
                            onClick={() => fetchPlayerData(playerNumber)}
                            sx={{ 
                                backgroundColor: getEstadoMessage.color === 'warning' ? COLORS.BANCOLOMBIA.DARK : 'transparent',
                                color: getEstadoMessage.color === 'warning' ? COLORS.BANCOLOMBIA.LIGHT : COLORS.BANCOLOMBIA.LIGHT,
                                borderColor: COLORS.BANCOLOMBIA.LIGHT,
                                fontWeight: 'bold',
                                fontSize: { xs: '0.65rem', md: '0.7rem' },
                                py: 0.4,
                                px: { xs: 1.5, md: 2 },
                                '&:hover': {
                                    backgroundColor: getEstadoMessage.color === 'warning' ? '#1a1918' : 'rgba(247,247,247,0.1)',
                                    borderColor: COLORS.BANCOLOMBIA.YELLOW
                                }
                            }}
                        >
                            🔄 Actualizar
                        </Button>
                    </Card>
                </Grid>

                {/* Cuentas - Layout responsivo mejorado */}
                <Grid item xs={12} sx={{ flexGrow: 1, display: 'flex' }}>
                    <Grid container spacing={{ xs: 1, md: 1.5 }} sx={{ height: '100%' }}>
                        {/* Cuenta de Ahorros */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ 
                                backgroundColor: COLORS.BANCOLOMBIA.LIGHT,
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: `2px solid ${ofertas.ahorros > 0 ? COLORS.BANCOLOMBIA.GREEN : '#E0E0E0'}`,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 3px 12px rgba(0,0,0,0.08)'
                                }
                            }}>
                                <CardContent sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    py: { xs: 1, md: 1.5 },
                                    px: { xs: 1, md: 1.5 },
                                    flexGrow: 1,
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: { xs: 30, md: 35 },
                                            height: { xs: 30, md: 35 },
                                            borderRadius: '50%',
                                            backgroundColor: COLORS.BANCOLOMBIA.GREEN,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: { xs: 0.5, md: 1 }
                                        }}>
                                            <Typography variant="body1" sx={{ 
                                                color: COLORS.BANCOLOMBIA.LIGHT, 
                                                fontWeight: 'bold',
                                                fontSize: { xs: '0.9rem', md: '1rem' }
                                            }}>
                                                💰
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" component="div" sx={{ 
                                            fontWeight: 'bold', 
                                            color: COLORS.BANCOLOMBIA.DARK,
                                            mb: 0.3,
                                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                                        }}>
                                            Ahorros
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: '#666',
                                            fontWeight: 500,
                                            mb: { xs: 1, md: 1.5 },
                                            fontSize: { xs: '0.65rem', md: '0.7rem' }
                                        }}>
                                            Producto tradicional
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            background: `linear-gradient(135deg, ${COLORS.BANCOLOMBIA.GREEN} 0%, ${COLORS.BANCOLOMBIA.BLUE} 100%)`,
                                            color: COLORS.BANCOLOMBIA.LIGHT,
                                            fontWeight: 'bold',
                                            px: { xs: 1.5, md: 2 },
                                            py: { xs: 0.8, md: 1 },
                                            borderRadius: 2,
                                            fontSize: { xs: '0.7rem', md: '0.8rem' },
                                            minWidth: { xs: '80px', md: '100px' },
                                            boxShadow: '0 2px 6px rgba(0,197,135,0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #00a872 0%, #00b8d4 100%)',
                                                transform: 'scale(1.02)'
                                            }
                                        }}
                                    >
                                        {getOfertaButtonText('ahorros')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Cuenta Wenia EURC */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ 
                                backgroundColor: COLORS.BANCOLOMBIA.LIGHT,
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: `2px solid ${ofertas.wenia > 0 ? COLORS.BANCOLOMBIA.ORANGE : '#E0E0E0'}`,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 3px 12px rgba(0,0,0,0.08)'
                                }
                            }}>
                                <CardContent sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    py: { xs: 1, md: 1.5 },
                                    px: { xs: 1, md: 1.5 },
                                    flexGrow: 1,
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: { xs: 30, md: 35 },
                                            height: { xs: 30, md: 35 },
                                            borderRadius: '50%',
                                            backgroundColor: COLORS.BANCOLOMBIA.ORANGE,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: { xs: 0.5, md: 1 }
                                        }}>
                                            <Typography variant="body1" sx={{ 
                                                color: COLORS.BANCOLOMBIA.LIGHT, 
                                                fontWeight: 'bold',
                                                fontSize: { xs: '0.9rem', md: '1rem' }
                                            }}>
                                                🌍
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" component="div" sx={{ 
                                            fontWeight: 'bold', 
                                            color: COLORS.BANCOLOMBIA.DARK,
                                            mb: 0.3,
                                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                                        }}>
                                            Wenia EURC
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: '#666',
                                            fontWeight: 500,
                                            mb: { xs: 1, md: 1.5 },
                                            fontSize: { xs: '0.65rem', md: '0.7rem' }
                                        }}>
                                            Moneda digital europea
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            background: `linear-gradient(135deg, ${COLORS.BANCOLOMBIA.ORANGE} 0%, ${COLORS.BANCOLOMBIA.YELLOW} 100%)`,
                                            color: COLORS.BANCOLOMBIA.LIGHT,
                                            fontWeight: 'bold',
                                            px: { xs: 1.5, md: 2 },
                                            py: { xs: 0.8, md: 1 },
                                            borderRadius: 2,
                                            fontSize: { xs: '0.7rem', md: '0.8rem' },
                                            minWidth: { xs: '80px', md: '100px' },
                                            boxShadow: '0 2px 6px rgba(255,128,58,0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #e6722f 0%, #e6bc03 100%)',
                                                transform: 'scale(1.02)'
                                            }
                                        }}
                                    >
                                        {getOfertaButtonText('wenia')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Valores Bancolombia Acciones */}
                        <Grid item xs={12} sm={12} md={4}>
                            <Card sx={{ 
                                backgroundColor: COLORS.BANCOLOMBIA.LIGHT,
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: `2px solid ${ofertas.acciones > 0 ? COLORS.BANCOLOMBIA.PINK : '#E0E0E0'}`,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 3px 12px rgba(0,0,0,0.08)'
                                }
                            }}>
                                <CardContent sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    py: { xs: 1, md: 1.5 },
                                    px: { xs: 1, md: 1.5 },
                                    flexGrow: 1,
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: { xs: 30, md: 35 },
                                            height: { xs: 30, md: 35 },
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${COLORS.BANCOLOMBIA.PINK} 0%, ${COLORS.BANCOLOMBIA.ORANGE} 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: { xs: 0.5, md: 1 }
                                        }}>
                                            <Typography variant="body1" sx={{ 
                                                color: COLORS.BANCOLOMBIA.LIGHT, 
                                                fontWeight: 'bold',
                                                fontSize: { xs: '0.9rem', md: '1rem' }
                                            }}>
                                                📈
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" component="div" sx={{ 
                                            fontWeight: 'bold', 
                                            color: COLORS.BANCOLOMBIA.DARK,
                                            mb: 0.3,
                                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                                        }}>
                                            Valores
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: '#666',
                                            fontWeight: 500,
                                            mb: { xs: 1, md: 1.5 },
                                            fontSize: { xs: '0.65rem', md: '0.7rem' }
                                        }}>
                                            Acciones e inversiones
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            background: `linear-gradient(135deg, ${COLORS.BANCOLOMBIA.PINK} 0%, ${COLORS.BANCOLOMBIA.BLUE} 100%)`,
                                            color: COLORS.BANCOLOMBIA.LIGHT,
                                            fontWeight: 'bold',
                                            px: { xs: 1.5, md: 2 },
                                            py: { xs: 0.8, md: 1 },
                                            borderRadius: 2,
                                            fontSize: { xs: '0.7rem', md: '0.8rem' },
                                            minWidth: { xs: '80px', md: '100px' },
                                            boxShadow: '0 2px 6px rgba(255,184,210,0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #ff9fc7 0%, #00b8d4 100%)',
                                                transform: 'scale(1.02)'
                                            }
                                        }}
                                    >
                                        {getOfertaButtonText('acciones')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Botones de Acción */}
                <Grid item xs={12}>
                    <Card sx={{ 
                        backgroundColor: COLORS.BANCOLOMBIA.LIGHT,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: `2px solid ${COLORS.BANCOLOMBIA.YELLOW}`,
                        py: { xs: 1, md: 1.5 },
                        px: { xs: 1, md: 2 }
                    }}>
                        <Typography variant="body1" sx={{ 
                            textAlign: 'center', 
                            mb: { xs: 1, md: 1.5 }, 
                            fontWeight: 'bold',
                            color: COLORS.BANCOLOMBIA.DARK,
                            fontSize: { xs: '0.9rem', md: '1rem' }
                        }}>
                            ¿Qué decides hacer?
                        </Typography>
                        <Grid container spacing={{ xs: 1, md: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="medium"
                                    onClick={handleRechazar}
                                    disabled={!hasNewOffers || isLoading}
                                    sx={{
                                        backgroundColor: hasNewOffers ? COLORS.BANCOLOMBIA.ORANGE : '#BDBDBD',
                                        color: COLORS.BANCOLOMBIA.LIGHT,
                                        fontWeight: 'bold',
                                        py: { xs: 1.2, md: 1.5 },
                                        fontSize: { xs: '0.85rem', md: '1rem' },
                                        borderRadius: 2,
                                        boxShadow: hasNewOffers ? '0 3px 10px rgba(255,128,58,0.3)' : 'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: hasNewOffers ? '#e6722f' : '#BDBDBD',
                                            transform: hasNewOffers ? 'translateY(-1px)' : 'none',
                                            boxShadow: hasNewOffers ? '0 4px 12px rgba(255,128,58,0.4)' : 'none'
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#BDBDBD',
                                            color: '#757575'
                                        }
                                    }}
                                >
                                    {isLoading ? '⏳ PROCESANDO...' : '❌ RECHAZAR'}
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="medium"
                                    onClick={handleAceptar}
                                    disabled={!hasNewOffers || isLoading}
                                    sx={{
                                        backgroundColor: hasNewOffers ? COLORS.BANCOLOMBIA.GREEN : '#BDBDBD',
                                        color: COLORS.BANCOLOMBIA.LIGHT,
                                        fontWeight: 'bold',
                                        py: { xs: 1.2, md: 1.5 },
                                        fontSize: { xs: '0.85rem', md: '1rem' },
                                        borderRadius: 2,
                                        boxShadow: hasNewOffers ? '0 3px 10px rgba(0,197,135,0.3)' : 'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: hasNewOffers ? '#00a872' : '#BDBDBD',
                                            transform: hasNewOffers ? 'translateY(-1px)' : 'none',
                                            boxShadow: hasNewOffers ? '0 4px 12px rgba(0,197,135,0.4)' : 'none'
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#BDBDBD',
                                            color: '#757575'
                                        }
                                    }}
                                >
                                    {isLoading ? '⏳ PROCESANDO...' : '✅ ACEPTAR'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Juego;
