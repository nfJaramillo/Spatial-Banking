/**
 * Configuración global de constantes para el Juego del Ultimátum
 * 
 * Este archivo centraliza todas las constantes utilizadas en la aplicación
 * para facilitar el mantenimiento y la configuración.
 * 
 * @author Sistema de Spatial Banking
 * @version 1.0.0
 */

// === CONFIGURACIÓN DE API ===
export const API_CONFIG = {
  BASE_URL: 'https://p50iej58p2.execute-api.us-east-2.amazonaws.com/prod',
  TIMEOUT: 10000, // 10 segundos timeout para requests
  RETRY_ATTEMPTS: 3
};

// === INTERVALOS DE POLLING ===
export const POLLING_INTERVALS = {
  CONNECTION_CHECK: 1000, // 1 segundo para verificar conexión
  OFFER_UPDATE: 5000,     // 5 segundos para actualizar ofertas
  POST_ACTION_DELAY: 1000 // 1 segundo después de aceptar/rechazar
};

// === CONFIGURACIÓN DE LOCALSTORAGE ===
export const STORAGE_CONFIG = {
  PLAYER_KEY: 'ultimatumGamePlayer',
  DATA_EXPIRY_DAYS: 7 // Los datos locales expiran después de 7 días
};

// === COLORES BANCOLOMBIA ===
export const BANCOLOMBIA_COLORS = {
  YELLOW: '#FFD204',
  GREEN: '#00C587',
  ORANGE: '#FF803A',
  PINK: '#FFB8D2',
  BLUE: '#01CDEB',
  DARK: '#2C2A29',
  LIGHT: '#F7F7F7',
  GRAY: '#E0E0E0'
};

// === CONFIGURACIÓN DE JUGADORES ===
export const PLAYER_CONFIG = {
  MIN_PLAYER: 2,
  MAX_PLAYER: 7,
  AVAILABLE_PLAYERS: [2, 3, 4, 5, 6, 7]
};

// === TIPOS DE CUENTA ===
export const ACCOUNT_TYPES = {
  AHORROS: {
    key: 'ahorros',
    name: 'Ahorros',
    description: 'Producto tradicional',
    icon: '💰',
    color: BANCOLOMBIA_COLORS.GREEN
  },
  WENIA: {
    key: 'wenia',
    name: 'Wenia EURC',
    description: 'Moneda digital europea',
    icon: '🌍',
    color: BANCOLOMBIA_COLORS.ORANGE
  },
  ACCIONES: {
    key: 'acciones',
    name: 'Valores',
    description: 'Acciones e inversiones',
    icon: '📈',
    color: BANCOLOMBIA_COLORS.PINK
  }
};

// === ESTADOS DEL JUEGO ===
export const GAME_STATES = {
  ESPERANDO: 'esperando',
  ACEPTADO: 'aceptado',
  RECHAZADO: 'rechazado'
};

// === ESTADOS DE CONEXIÓN ===
export const CONNECTION_STATES = {
  CONNECTED: 'Conectado',
  DISCONNECTED: 'No conectado'
};

// === MENSAJES DE ERROR ===
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: 'Error de conexión. Intenta nuevamente.',
  PLAYER_NOT_FOUND: 'Jugador no encontrado.',
  INVALID_PLAYER: 'Número de jugador inválido.',
  API_ERROR: 'Error del servidor. Contacta al administrador.',
  NETWORK_ERROR: 'Sin conexión a internet.',
  TIMEOUT_ERROR: 'La solicitud tardó demasiado tiempo.'
};

// === MENSAJES DE ÉXITO ===
export const SUCCESS_MESSAGES = {
  PLAYER_CONNECTED: 'Jugador conectado exitosamente',
  PLAYER_DISCONNECTED: 'Jugador desconectado',
  OFFER_ACCEPTED: 'Has aceptado la oferta',
  OFFER_REJECTED: 'Has rechazado la oferta',
  DATA_UPDATED: 'Datos actualizados'
};

// === CONFIGURACIÓN DE UI ===
export const UI_CONFIG = {
  ANIMATION_DURATION: 300, // ms
  BUTTON_DEBOUNCE: 500,    // ms
  LOADING_MIN_TIME: 1000,  // ms mínimo para mostrar loading
  NOTIFICATION_DURATION: 3000 // ms para auto-hide notifications
};

// === BREAKPOINTS RESPONSIVE ===
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536
};

// === CONFIGURACIÓN DE DESARROLLO ===
export const DEV_CONFIG = {
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
  MOCK_API: false,
  DEBUG_POLLING: false
};

export default {
  API_CONFIG,
  POLLING_INTERVALS,
  STORAGE_CONFIG,
  BANCOLOMBIA_COLORS,
  PLAYER_CONFIG,
  ACCOUNT_TYPES,
  GAME_STATES,
  CONNECTION_STATES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UI_CONFIG,
  BREAKPOINTS,
  DEV_CONFIG
};
