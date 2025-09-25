/**
 * Utilidades para interacción con API y manejo de datos del jugador
 * 
 * Este módulo proporciona funciones para:
 * - Gestión de datos de jugadores en localStorage
 * - Interacción con la API de Spatial Banking
 * - Manejo de estados de conexión y aceptación
 * - Operaciones CRUD sobre jugadores y ofertas
 * 
 * @author Sistema de Spatial Banking
 * @version 1.0.0
 */

// Configuración de la API
const API_BASE_URL = 'https://p50iej58p2.execute-api.us-east-2.amazonaws.com/prod';

// Constantes de configuración
const STORAGE_KEY = 'ultimatumGamePlayer';
const DATA_EXPIRY_DAYS = 7; // Los datos locales expiran después de 7 días

/**
 * Guarda los datos del jugador en localStorage
 * @param {number} playerNumber - Número del jugador (2-7)
 */
export const savePlayerData = (playerNumber) => {
  const playerData = {
    playerNumber,
    timestamp: Date.now(),
    lastConnection: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playerData));
};

/**
 * Obtiene los datos del jugador desde localStorage
 * Verifica la validez temporal de los datos antes de retornarlos
 * @returns {Object|null} Datos del jugador o null si no existen/están expirados
 */
export const getPlayerData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      
      // Verificar que los datos no estén expirados
      const expiryTime = DATA_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (data.timestamp && (Date.now() - data.timestamp) < expiryTime) {
        return data;
      }
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
    }
  }
  return null;
};

/**
 * Limpia los datos del jugador del localStorage
 */
export const clearPlayerData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Obtiene todos los jugadores desde la API
 * @returns {Promise<Array>} Array de jugadores o array vacío en caso de error
 */
export const getAllPlayers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-jugadores`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verificar la estructura de respuesta de la API
    if (data?.data?.GetPlayers?.data && Array.isArray(data.data.GetPlayers.data)) {
      return data.data.GetPlayers.data;
    } else {
      console.warn('API devolvió datos en formato inesperado:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
};

/**
 * Obtiene los datos de un jugador específico por nombre
 * @param {string} playerName - Nombre del jugador (ej: "Jugador2")
 * @returns {Promise<Array|null>} Datos del jugador o null en caso de error
 */
export const getPlayerByName = async (playerName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-jugador?nombre=${encodeURIComponent(playerName)}`);
    const data = await response.json();
    
    // Verificar la estructura de respuesta para un jugador individual
    if (data?.data?.GetPlayer?.data) {
      return data.data.GetPlayer.data;
    } else {
      console.warn('API devolvió estructura inesperada para jugador individual:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching player:', error);
    return null;
  }
};

/**
 * Establece el estado de conexión de un jugador
 * @param {string} playerName - Nombre del jugador
 * @param {string} status - Estado de conexión ("Conectado" | "No conectado")
 * @returns {Promise<Object|null>} Respuesta de la API o null en caso de error
 */
export const setPlayerConnectionStatus = async (playerName, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/set-estado-conexion?nombre=${encodeURIComponent(playerName)}&estatus=${encodeURIComponent(status)}`, {
      method: 'POST'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error setting connection status:', error);
    return null;
  }
};

/**
 * Establece el estado de aceptación de un jugador
 * @param {string} playerName - Nombre del jugador
 * @param {string} status - Estado de aceptación ("aceptado" | "rechazado" | "esperando")
 * @returns {Promise<Object|null>} Respuesta de la API o null en caso de error
 */
export const setPlayerAcceptanceStatus = async (playerName, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/set-estado-aceptacion?nombre=${encodeURIComponent(playerName)}&estatus=${encodeURIComponent(status)}`, {
      method: 'POST'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error setting acceptance status:', error);
    return null;
  }
};

/**
 * Obtiene la lista de jugadores disponibles para conectarse
 * Filtra los jugadores que no están conectados actualmente
 * @returns {Promise<Array<number>>} Array con números de jugadores disponibles (2-7)
 */
export const getAvailablePlayers = async () => {
  try {
    const allPlayers = await getAllPlayers();
    const allPlayerNumbers = [2, 3, 4, 5, 6, 7]; // Jugadores válidos del sistema
    
    if (!Array.isArray(allPlayers)) {
      return allPlayerNumbers; // Fallback si la API falla
    }
    
    // Filtrar jugadores que no están conectados
    const availablePlayers = allPlayerNumbers.filter(playerNumber => {
      const playerName = `Jugador${playerNumber}`;
      const player = allPlayers.find(p => p.nombre === playerName);
      return !player || player.estatusConexion !== 'Conectado';
    });
    
    return availablePlayers;
  } catch (error) {
    console.error('Error getting available players:', error);
    return [2, 3, 4, 5, 6, 7]; // Fallback completo
  }
};

/**
 * Conecta un jugador actualizando tanto el estado local como el servidor
 * @param {number} playerNumber - Número del jugador a conectar
 * @returns {Promise<Object>} Resultado de la operación con indicador de fuente
 */
export const connectPlayer = async (playerNumber) => {
  try {
    const playerName = `Jugador${playerNumber}`;
    
    // Guardar en localStorage primero para garantizar persistencia
    savePlayerData(playerNumber);
    
    // Intentar actualizar en la API
    const result = await setPlayerConnectionStatus(playerName, 'Conectado');
    
    return {
      success: true,
      source: result ? 'api' : 'local'
    };
  } catch (error) {
    console.error('Error connecting player:', error);
    // Mantener estado local aunque falle la API
    savePlayerData(playerNumber);
    return { success: true, source: 'local' };
  }
};

/**
 * Desconecta un jugador limpiando tanto el estado local como el servidor
 * @param {number} playerNumber - Número del jugador a desconectar
 * @returns {Promise<Object>} Resultado de la operación con indicador de fuente
 */
export const disconnectPlayer = async (playerNumber) => {
  try {
    const playerName = `Jugador${playerNumber}`;
    
    // Limpiar localStorage primero
    clearPlayerData();
    
    // Intentar actualizar en la API
    const result = await setPlayerConnectionStatus(playerName, 'No conectado');
    
    return {
      success: true,
      source: result ? 'api' : 'local'
    };
  } catch (error) {
    console.error('Error disconnecting player:', error);
    // El estado local ya está limpio
    return { success: true, source: 'local' };
  }
};

/**
 * Verifica si un jugador específico está conectado
 * @param {number} playerNumber - Número del jugador a verificar
 * @returns {Promise<boolean>} true si el jugador está conectado, false en caso contrario
 */
export const isPlayerConnected = async (playerNumber) => {
  try {
    const playerName = `Jugador${playerNumber}`;
    const player = await getPlayerByName(playerName);
    return player && player.estatusConexion === 'Conectado';
  } catch (error) {
    console.error('Error checking player connection:', error);
    // En caso de error de red, usar estado local como fallback
    const localData = getPlayerData();
    return localData && localData.playerNumber === playerNumber;
  }
};

/**
 * Verifica el estado de un jugador con fallback a datos locales
 * Útil para verificaciones críticas de estado
 * @param {number} playerNumber - Número del jugador a verificar
 * @returns {Promise<Object>} Objeto con estado de conexión y fuente de datos
 */
export const verifyPlayerStatus = async (playerNumber) => {
  const localData = getPlayerData();
  const isLocallyConnected = localData && localData.playerNumber === playerNumber;
  
  try {
    const isConnected = await isPlayerConnected(playerNumber);
    return {
      isConnected,
      source: 'api',
      localState: isLocallyConnected
    };
  } catch (error) {
    // Si falla la API, usar datos locales como fuente de verdad
    return {
      isConnected: isLocallyConnected,
      source: 'local',
      localState: isLocallyConnected
    };
  }
};

/**
 * Resetea todos los jugadores (útil para testing)
 * @returns {Promise<Object|null>} Respuesta de la API o null en caso de error
 */
export const resetAllPlayers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-jugadores`, {
      method: 'POST'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error resetting players:', error);
    return null;
  }
};

/**
 * Actualiza las cuentas del jugador con nuevos valores
 * @param {string} playerName - Nombre del jugador
 * @param {number} ahorros - Valor para cuenta de ahorros
 * @param {number} wenia - Valor para cuenta Wenia EURC
 * @param {number} acciones - Valor para cuenta de acciones
 * @returns {Promise<Object|null>} Respuesta de la API o null en caso de error
 */
export const updatePlayerAccounts = async (playerName, ahorros, wenia, acciones) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-cuentas?nombre=${encodeURIComponent(playerName)}&ahorros=${ahorros}&wenia=${wenia}&acciones=${acciones}`, {
      method: 'POST'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating player accounts:', error);
    return null;
  }
};

// === FUNCIONES DE COMPATIBILIDAD ===
// Mantenidas para compatibilidad con código existente pero no utilizadas

/**
 * Función placeholder para conexión de wallet (no implementada)
 * @deprecated Esta función no se utiliza en el juego actual
 * @returns {Promise<Object>} Objeto con mensaje de función no disponible
 */
export const connectWallet = async () => {
  return {
    address: "",
    severity: "warning", 
    status: "Función de billetera no disponible en este juego"
  };
};

/**
 * Función placeholder para obtener wallet conectado (no implementada)
 * @deprecated Esta función no se utiliza en el juego actual
 * @returns {Promise<Object>} Objeto con mensaje de función no disponible
 */
export const getCurrentWalletConnected = async () => {
  return {
    address: "",
    status: "Función de billetera no disponible en este juego"
  };
};
