/**
 * Funciones de utilidad helper para el Juego del Ultimátum
 * 
 * Este módulo contiene funciones auxiliares reutilizables que mejoran
 * la legibilidad y mantenibilidad del código.
 * 
 * @author Sistema de Spatial Banking
 * @version 1.0.0
 */

import { PLAYER_CONFIG, GAME_STATES, ACCOUNT_TYPES } from '../config/constants.js';

// === VALIDACIONES ===

/**
 * Valida si un número de jugador es válido
 * @param {number} playerNumber - Número del jugador a validar
 * @returns {boolean} true si es válido, false en caso contrario
 */
export const isValidPlayerNumber = (playerNumber) => {
  return PLAYER_CONFIG.AVAILABLE_PLAYERS.includes(playerNumber);
};

/**
 * Valida si un estado de juego es válido
 * @param {string} state - Estado a validar
 * @returns {boolean} true si es válido, false en caso contrario
 */
export const isValidGameState = (state) => {
  return Object.values(GAME_STATES).includes(state);
};

/**
 * Valida si los datos de oferta son válidos
 * @param {Object} ofertas - Objeto con ofertas de cuentas
 * @returns {boolean} true si son válidas, false en caso contrario
 */
export const areValidOffers = (ofertas) => {
  if (!ofertas || typeof ofertas !== 'object') return false;
  
  return Object.keys(ACCOUNT_TYPES).every(accountType => {
    const key = ACCOUNT_TYPES[accountType].key;
    return ofertas.hasOwnProperty(key) && 
           typeof ofertas[key] === 'number' && 
           ofertas[key] >= 0;
  });
};

// === FORMATEO ===

/**
 * Formatea un valor monetario con separadores de miles
 * @param {number} value - Valor a formatear
 * @returns {string} Valor formateado (ej: "1,000,000")
 */
export const formatCurrency = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return value.toLocaleString('es-CO');
};

/**
 * Formatea un timestamp a fecha legible
 * @param {number} timestamp - Timestamp en milisegundos
 * @returns {string} Fecha formateada
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Sin fecha';
  return new Date(timestamp).toLocaleString('es-CO');
};

/**
 * Genera el nombre del jugador basado en el número
 * @param {number} playerNumber - Número del jugador
 * @returns {string} Nombre del jugador (ej: "Jugador2")
 */
export const generatePlayerName = (playerNumber) => {
  return `Jugador${playerNumber}`;
};

// === LÓGICA DE NEGOCIO ===

/**
 * Determina si hay ofertas disponibles en cualquier cuenta
 * @param {Object} ofertas - Objeto con valores de ofertas
 * @returns {boolean} true si hay ofertas, false en caso contrario
 */
export const hasAnyOffers = (ofertas) => {
  if (!areValidOffers(ofertas)) return false;
  return Object.values(ofertas).some(value => value > 0);
};

/**
 * Calcula el total de todas las ofertas
 * @param {Object} ofertas - Objeto con valores de ofertas
 * @returns {number} Suma total de todas las ofertas
 */
export const calculateTotalOffers = (ofertas) => {
  if (!areValidOffers(ofertas)) return 0;
  return Object.values(ofertas).reduce((total, value) => total + value, 0);
};

/**
 * Determina si los botones de acción deben estar habilitados
 * @param {Object} ofertas - Objeto con valores de ofertas
 * @param {string} estadoAceptacion - Estado actual del juego
 * @returns {boolean} true si deben estar habilitados, false en caso contrario
 */
export const shouldEnableActionButtons = (ofertas, estadoAceptacion) => {
  return hasAnyOffers(ofertas) && estadoAceptacion === GAME_STATES.ESPERANDO;
};

/**
 * Obtiene la configuración de una cuenta específica
 * @param {string} accountKey - Clave de la cuenta (ahorros, wenia, acciones)
 * @returns {Object|null} Configuración de la cuenta o null si no existe
 */
export const getAccountConfig = (accountKey) => {
  return Object.values(ACCOUNT_TYPES).find(account => account.key === accountKey) || null;
};

// === UTILIDADES DE UI ===

/**
 * Determina el color de estado basado en el tipo de mensaje
 * @param {string} messageType - Tipo de mensaje (success, error, warning, info)
 * @returns {string} Color hexadecimal correspondiente
 */
export const getStatusColor = (messageType) => {
  const colorMap = {
    success: '#00C587',
    error: '#FF803A', 
    warning: '#FFD204',
    info: '#01CDEB'
  };
  return colorMap[messageType] || colorMap.info;
};

/**
 * Genera el texto para botones de oferta
 * @param {string} accountKey - Clave de la cuenta
 * @param {Object} ofertas - Objeto con valores de ofertas
 * @returns {string} Texto formateado para el botón
 */
export const getOfferButtonText = (accountKey, ofertas) => {
  if (!areValidOffers(ofertas)) return "Esperando oferta...";
  
  const value = ofertas[accountKey];
  return value > 0 ? `$${formatCurrency(value)}` : "Esperando oferta...";
};

/**
 * Determina el mensaje de estado del juego
 * @param {string} estadoAceptacion - Estado actual
 * @param {boolean} hasOffers - Si hay ofertas disponibles
 * @returns {Object} Objeto con texto y color del estado
 */
export const getGameStatusMessage = (estadoAceptacion, hasOffers) => {
  switch (estadoAceptacion) {
    case GAME_STATES.ACEPTADO:
      return { text: "Oferta aceptada", color: "success" };
    case GAME_STATES.RECHAZADO:
      return { text: "Oferta rechazada", color: "error" };
    default:
      return hasOffers 
        ? { text: "¡Nueva oferta disponible!", color: "warning" }
        : { text: "Esperando oferta...", color: "info" };
  }
};

// === UTILIDADES DE TIEMPO ===

/**
 * Crea un delay (promesa que se resuelve después de X milisegundos)
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promesa que se resuelve después del delay
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Verifica si los datos han expirado
 * @param {number} timestamp - Timestamp de los datos
 * @param {number} expiryDays - Días hasta expiración
 * @returns {boolean} true si han expirado, false en caso contrario
 */
export const isDataExpired = (timestamp, expiryDays = 7) => {
  if (!timestamp) return true;
  const expiryTime = expiryDays * 24 * 60 * 60 * 1000;
  return (Date.now() - timestamp) >= expiryTime;
};

// === UTILIDADES DE DEPURACIÓN ===

/**
 * Logger condicional que solo imprime en desarrollo
 * @param {string} message - Mensaje a imprimir
 * @param {any} data - Datos adicionales a imprimir
 */
export const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    if (data) {
      console.log(`🐛 ${message}`, data);
    } else {
      console.log(`🐛 ${message}`);
    }
  }
};

/**
 * Genera un ID único para logging
 * @returns {string} ID único
 */
export const generateLogId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export default {
  // Validaciones
  isValidPlayerNumber,
  isValidGameState,
  areValidOffers,
  
  // Formateo
  formatCurrency,
  formatTimestamp,
  generatePlayerName,
  
  // Lógica de negocio
  hasAnyOffers,
  calculateTotalOffers,
  shouldEnableActionButtons,
  getAccountConfig,
  
  // Utilidades de UI
  getStatusColor,
  getOfferButtonText,
  getGameStatusMessage,
  
  // Utilidades de tiempo
  delay,
  isDataExpired,
  
  // Depuración
  debugLog,
  generateLogId
};
