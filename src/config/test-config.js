/**
 * Configuración de pruebas para el Juego del Ultimátum
 * 
 * Este archivo contiene datos de prueba, mocks y configuraciones
 * específicas para testing y desarrollo.
 * 
 * @author Sistema de Spatial Banking
 * @version 1.0.0
 */

import { ACCOUNT_TYPES, GAME_STATES } from './constants.js';

// === DATOS DE PRUEBA ===

/**
 * Datos mock de jugadores para testing
 */
export const MOCK_PLAYERS = {
  PLAYER_1: {
    _id: 'mock_player_1',
    player: '1',
    timestamp: Date.now(),
    offers: {
      ahorros: 500000,
      wenia: 300000,
      acciones: 200000
    },
    estado: GAME_STATES.ESPERANDO
  },
  PLAYER_2: {
    _id: 'mock_player_2',
    player: '2', 
    timestamp: Date.now(),
    offers: {
      ahorros: 0,
      wenia: 0,
      acciones: 0
    },
    estado: GAME_STATES.ESPERANDO
  }
};

/**
 * Respuestas mock de la API
 */
export const MOCK_API_RESPONSES = {
  SUCCESS: {
    status: 200,
    data: [MOCK_PLAYERS.PLAYER_1]
  },
  NO_DATA: {
    status: 200,
    data: []
  },
  ERROR: {
    status: 500,
    message: 'Internal Server Error'
  },
  TIMEOUT: {
    status: 408,
    message: 'Request Timeout'
  }
};

/**
 * Configuración para tests de carga
 */
export const LOAD_TEST_CONFIG = {
  CONCURRENT_USERS: 10,
  REQUESTS_PER_SECOND: 5,
  TEST_DURATION: 60000, // 1 minuto
  RAMP_UP_TIME: 10000   // 10 segundos
};

// === CONFIGURACIÓN DE DESARROLLO ===

/**
 * Configuración específica para desarrollo
 */
export const DEV_SETTINGS = {
  ENABLE_MOCK_API: false,
  FORCE_PLAYER_SELECTION: null,
  SIMULATE_SLOW_NETWORK: false,
  NETWORK_DELAY: 2000,
  ENABLE_DEBUG_LOGS: true,
  SHOW_DEV_TOOLS: true
};

/**
 * Configuración de logs para desarrollo
 */
export const DEBUG_CONFIG = {
  LOG_LEVELS: {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  },
  CURRENT_LEVEL: 3, // DEBUG en desarrollo
  ENABLE_API_LOGS: true,
  ENABLE_STATE_LOGS: true,
  ENABLE_PERFORMANCE_LOGS: true
};

// === VALIDACIONES DE TESTING ===

/**
 * Casos de prueba para validaciones
 */
export const TEST_CASES = {
  VALID_OFFERS: {
    ahorros: 1000000,
    wenia: 500000,
    acciones: 250000
  },
  INVALID_OFFERS: {
    negative: { ahorros: -100000, wenia: 0, acciones: 0 },
    missing: { ahorros: 100000 }, // falta wenia y acciones
    wrong_type: { ahorros: "invalid", wenia: 0, acciones: 0 },
    null_values: { ahorros: null, wenia: undefined, acciones: 0 }
  },
  EDGE_CASES: {
    zero_offers: { ahorros: 0, wenia: 0, acciones: 0 },
    max_value: { ahorros: Number.MAX_SAFE_INTEGER, wenia: 0, acciones: 0 },
    float_values: { ahorros: 1000000.50, wenia: 500000.25, acciones: 250000.75 }
  }
};

// === MÉTRICAS Y PERFORMANCE ===

/**
 * Umbrales de performance
 */
export const PERFORMANCE_THRESHOLDS = {
  API_RESPONSE_TIME: 3000,     // 3 segundos máximo
  UI_RENDER_TIME: 100,         // 100ms máximo
  POLLING_ACCURACY: 500,       // ±500ms de precisión
  MEMORY_USAGE: 50 * 1024 * 1024, // 50MB máximo
  BUNDLE_SIZE: 1024 * 1024     // 1MB máximo
};

/**
 * Configuración de monitoreo
 */
export const MONITORING_CONFIG = {
  TRACK_USER_INTERACTIONS: true,
  TRACK_API_CALLS: true,
  TRACK_ERRORS: true,
  TRACK_PERFORMANCE: true,
  SAMPLE_RATE: 1.0, // 100% en desarrollo
  FLUSH_INTERVAL: 30000 // 30 segundos
};

// === CONFIGURACIÓN DE FEATURES FLAGS ===

/**
 * Feature flags para habilitar/deshabilitar funcionalidades
 */
export const FEATURE_FLAGS = {
  ENABLE_SOUND_EFFECTS: false,
  ENABLE_ANIMATIONS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_ACCESSIBILITY: true,
  ENABLE_ANALYTICS: false,
  ENABLE_A_B_TESTING: false
};

// === HELPERS PARA TESTING ===

/**
 * Genera datos aleatorios para testing
 */
export const generateRandomOffer = () => ({
  ahorros: Math.floor(Math.random() * 1000000),
  wenia: Math.floor(Math.random() * 500000),
  acciones: Math.floor(Math.random() * 250000)
});

/**
 * Genera un jugador mock con datos aleatorios
 */
export const generateMockPlayer = (playerNumber) => ({
  _id: `mock_player_${playerNumber}_${Date.now()}`,
  player: playerNumber.toString(),
  timestamp: Date.now(),
  offers: generateRandomOffer(),
  estado: GAME_STATES.ESPERANDO
});

/**
 * Simula una respuesta de API con delay
 */
export const simulateApiResponse = async (response, delay = 1000) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return response;
};

export default {
  MOCK_PLAYERS,
  MOCK_API_RESPONSES,
  LOAD_TEST_CONFIG,
  DEV_SETTINGS,
  DEBUG_CONFIG,
  TEST_CASES,
  PERFORMANCE_THRESHOLDS,
  MONITORING_CONFIG,
  FEATURE_FLAGS,
  generateRandomOffer,
  generateMockPlayer,
  simulateApiResponse
};
