/**
 * Esquemas de validación para el Juego del Ultimátum
 * 
 * Este módulo define esquemas de validación para datos de entrada,
 * respuestas de API y estados de la aplicación usando una aproximación
 * funcional sin dependencias externas.
 * 
 * @author Sistema de Spatial Banking
 * @version 1.0.0
 */

import { GAME_STATES, ACCOUNT_TYPES, PLAYER_CONFIG } from './constants.js';

// === VALIDADORES BASE ===

/**
 * Validador para tipos primitivos
 */
const validators = {
  string: (value) => typeof value === 'string',
  number: (value) => typeof value === 'number' && !isNaN(value),
  boolean: (value) => typeof value === 'boolean',
  object: (value) => typeof value === 'object' && value !== null,
  array: (value) => Array.isArray(value),
  positiveNumber: (value) => typeof value === 'number' && value >= 0,
  nonEmptyString: (value) => typeof value === 'string' && value.trim().length > 0,
  timestamp: (value) => typeof value === 'number' && value > 0
};

/**
 * Crea un validador opcional
 */
const optional = (validator) => (value) => value === undefined || validator(value);

/**
 * Crea un validador que acepta uno de varios valores
 */
const oneOf = (values) => (value) => values.includes(value);

// === ESQUEMAS DE VALIDACIÓN ===

/**
 * Esquema para validar ofertas de cuentas
 */
export const OFFER_SCHEMA = {
  ahorros: validators.positiveNumber,
  wenia: validators.positiveNumber,
  acciones: validators.positiveNumber
};

/**
 * Esquema para validar datos de jugador
 */
export const PLAYER_SCHEMA = {
  _id: validators.nonEmptyString,
  player: oneOf(PLAYER_CONFIG.AVAILABLE_PLAYERS.map(String)),
  timestamp: optional(validators.timestamp),
  offers: (value) => validateObject(value, OFFER_SCHEMA),
  estado: optional(oneOf(Object.values(GAME_STATES)))
};

/**
 * Esquema para validar respuesta de la API
 */
export const API_RESPONSE_SCHEMA = {
  status: optional(validators.number),
  data: validators.array,
  message: optional(validators.string),
  error: optional(validators.string)
};

/**
 * Esquema para validar configuración de cuenta
 */
export const ACCOUNT_CONFIG_SCHEMA = {
  key: validators.nonEmptyString,
  name: validators.nonEmptyString,
  gradient: validators.nonEmptyString,
  icon: validators.nonEmptyString,
  description: validators.nonEmptyString
};

// === FUNCIONES DE VALIDACIÓN ===

/**
 * Valida un objeto contra un esquema
 * @param {Object} obj - Objeto a validar
 * @param {Object} schema - Esquema de validación
 * @returns {Object} Resultado de validación con isValid y errores
 */
export const validateObject = (obj, schema) => {
  const errors = [];
  
  if (!validators.object(obj)) {
    return {
      isValid: false,
      errors: ['El valor debe ser un objeto']
    };
  }

  // Validar cada campo del esquema
  Object.keys(schema).forEach(key => {
    const validator = schema[key];
    const value = obj[key];
    
    if (!validator(value)) {
      errors.push(`Campo '${key}' es inválido`);
    }
  });

  // Verificar campos extra no permitidos
  const extraFields = Object.keys(obj).filter(key => !schema.hasOwnProperty(key));
  if (extraFields.length > 0) {
    errors.push(`Campos no permitidos: ${extraFields.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida una lista de objetos contra un esquema
 * @param {Array} list - Lista a validar
 * @param {Object} schema - Esquema de validación
 * @returns {Object} Resultado de validación
 */
export const validateList = (list, schema) => {
  if (!validators.array(list)) {
    return {
      isValid: false,
      errors: ['El valor debe ser un array']
    };
  }

  const errors = [];
  
  list.forEach((item, index) => {
    const validation = validateObject(item, schema);
    if (!validation.isValid) {
      errors.push(`Elemento ${index}: ${validation.errors.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// === VALIDADORES ESPECÍFICOS ===

/**
 * Valida ofertas de juego
 * @param {Object} offers - Ofertas a validar
 * @returns {Object} Resultado de validación
 */
export const validateOffers = (offers) => {
  const validation = validateObject(offers, OFFER_SCHEMA);
  
  if (!validation.isValid) {
    return validation;
  }

  // Validaciones adicionales específicas
  const errors = [];
  
  // Verificar que al menos una oferta sea mayor que 0
  const hasOffers = Object.values(offers).some(value => value > 0);
  if (!hasOffers) {
    errors.push('Al menos una oferta debe ser mayor que 0');
  }

  // Verificar límites máximos razonables
  const MAX_OFFER = 10000000; // 10 millones
  Object.entries(offers).forEach(([key, value]) => {
    if (value > MAX_OFFER) {
      errors.push(`Oferta de ${key} excede el límite máximo`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: [...validation.errors, ...errors]
  };
};

/**
 * Valida datos de jugador
 * @param {Object} player - Datos del jugador
 * @returns {Object} Resultado de validación
 */
export const validatePlayer = (player) => {
  const validation = validateObject(player, PLAYER_SCHEMA);
  
  if (!validation.isValid) {
    return validation;
  }

  // Validaciones adicionales
  const errors = [];
  
  // Validar ofertas si existen
  if (player.offers) {
    const offerValidation = validateOffers(player.offers);
    if (!offerValidation.isValid) {
      errors.push(`Ofertas inválidas: ${offerValidation.errors.join(', ')}`);
    }
  }

  // Validar timestamp si existe
  if (player.timestamp) {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (player.timestamp > now) {
      errors.push('Timestamp no puede ser futuro');
    } else if (now - player.timestamp > 7 * dayInMs) {
      errors.push('Datos demasiado antiguos');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: [...validation.errors, ...errors]
  };
};

/**
 * Valida respuesta de API
 * @param {Object} response - Respuesta de la API
 * @returns {Object} Resultado de validación
 */
export const validateApiResponse = (response) => {
  const validation = validateObject(response, API_RESPONSE_SCHEMA);
  
  if (!validation.isValid) {
    return validation;
  }

  // Validar que la data contenga jugadores válidos
  if (response.data && response.data.length > 0) {
    const playersValidation = validateList(response.data, PLAYER_SCHEMA);
    if (!playersValidation.isValid) {
      return {
        isValid: false,
        errors: [`Datos de jugadores inválidos: ${playersValidation.errors.join(', ')}`]
      };
    }
  }

  return {
    isValid: true,
    errors: []
  };
};

// === VALIDADORES DE ENTRADA ===

/**
 * Valida parámetros de entrada para funciones
 */
export const validateInput = {
  playerNumber: (value) => {
    if (!validators.number(value)) {
      return { isValid: false, error: 'Número de jugador debe ser un número' };
    }
    if (!PLAYER_CONFIG.AVAILABLE_PLAYERS.includes(value)) {
      return { isValid: false, error: 'Número de jugador no válido' };
    }
    return { isValid: true };
  },

  gameState: (value) => {
    if (!validators.string(value)) {
      return { isValid: false, error: 'Estado debe ser una cadena' };
    }
    if (!Object.values(GAME_STATES).includes(value)) {
      return { isValid: false, error: 'Estado de juego no válido' };
    }
    return { isValid: true };
  },

  accountType: (value) => {
    if (!validators.string(value)) {
      return { isValid: false, error: 'Tipo de cuenta debe ser una cadena' };
    }
    const validKeys = Object.values(ACCOUNT_TYPES).map(account => account.key);
    if (!validKeys.includes(value)) {
      return { isValid: false, error: 'Tipo de cuenta no válido' };
    }
    return { isValid: true };
  }
};

// === UTILIDADES DE SANITIZACIÓN ===

/**
 * Sanitiza datos de entrada
 */
export const sanitize = {
  offers: (offers) => {
    if (!validators.object(offers)) return {};
    
    const sanitized = {};
    Object.keys(OFFER_SCHEMA).forEach(key => {
      const value = offers[key];
      if (validators.number(value) && value >= 0) {
        sanitized[key] = Math.floor(value); // Remover decimales
      } else {
        sanitized[key] = 0;
      }
    });
    
    return sanitized;
  },

  player: (player) => {
    if (!validators.object(player)) return null;
    
    return {
      _id: validators.string(player._id) ? player._id.trim() : '',
      player: validators.string(player.player) ? player.player.trim() : '',
      timestamp: validators.number(player.timestamp) ? player.timestamp : Date.now(),
      offers: sanitize.offers(player.offers || {}),
      estado: validators.string(player.estado) ? player.estado : GAME_STATES.ESPERANDO
    };
  }
};

export default {
  validateObject,
  validateList,
  validateOffers,
  validatePlayer,
  validateApiResponse,
  validateInput,
  sanitize,
  OFFER_SCHEMA,
  PLAYER_SCHEMA,
  API_RESPONSE_SCHEMA,
  ACCOUNT_CONFIG_SCHEMA
};
