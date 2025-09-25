# 🎮 El Juego del Ultimátum - Spatial Banking

Una aplicación web interactiva que implementa el famoso experimento económico del "Juego del Ultimátum" con integración a productos financieros de Bancolombia.

## 📋 Descripción

Esta aplicación permite a múltiples jugadores participar en el juego del ultimátum donde pueden recibir ofertas en diferentes tipos de cuentas financieras (Ahorros, Wenia EURC, y Valores) y decidir si aceptar o rechazar dichas ofertas.

## 🏗️ Arquitectura del Sistema

### Frontend
- **React 18** con Vite como bundler
- **Material-UI (MUI)** para componentes de interfaz
- **Diseño responsive** optimizado para móviles y desktop
- **Polling inteligente** para actualizaciones en tiempo real

### Backend
- **API REST** hospedada en AWS API Gateway
- **MongoDB Atlas** como base de datos
- **Endpoints RESTful** para manejo de jugadores y ofertas

### Características Principales
- ✅ **Conexión automática de jugadores** (Jugador 2-7)
- ✅ **Detección de estado en tiempo real**
- ✅ **Interfaz sin scroll** completamente responsive
- ✅ **Polling optimizado** que se detiene automáticamente
- ✅ **Manejo robusto de errores** con fallbacks locales
- ✅ **Diseño Bancolombia** con colores oficiales y gradientes

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- npm o yarn
- Conexión a internet para la API

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd WebApp

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### Variables de Entorno
La aplicación utiliza una API configurada en:
```
API_BASE_URL = 'https://p50iej58p2.execute-api.us-east-2.amazonaws.com/prod'
```

## 🎯 Uso de la Aplicación

### Para Jugadores
1. **Conectarse**: Usar el botón "Conectar como Jugador" en la barra superior
2. **Esperar ofertas**: La interfaz muestra automáticamente cuando hay nuevas ofertas
3. **Tomar decisiones**: Aceptar o rechazar ofertas usando los botones de acción
4. **Desconectarse**: Usar el botón "Desconectar" para salir del juego

### Tipos de Cuentas
- **💰 Ahorros**: Producto bancario tradicional
- **🌍 Wenia EURC**: Moneda digital europea 
- **📈 Valores**: Acciones e inversiones

## � Estructura del Proyecto

```
WebApp/
├── public/
│   └── index.html              # HTML base
├── src/
│   ├── components/             # Componentes reutilizables
│   │   └── PlayerSelectionDialog.jsx
│   ├── pages/                  # Páginas principales
│   │   ├── home.jsx           # Página de inicio (legacy)
│   │   └── juego.jsx          # Juego principal (optimizado)
│   ├── utils/                  # Utilidades y helpers
│   │   ├── interact.jsx       # Funciones de API (optimizado)
│   │   └── helpers.js         # Funciones auxiliares (nuevo)
│   ├── config/                 # Configuración centralizada
│   │   ├── constants.js       # Constantes principales
│   │   ├── validation.js      # Esquemas de validación
│   │   └── test-config.js     # Configuración de pruebas
│   ├── assets/                 # Recursos estáticos
│   │   └── logo.svg
│   ├── App.jsx                 # Componente raíz
│   ├── AppBar.jsx             # Barra de navegación
│   ├── AppContext.jsx         # Contexto global
│   └── main.jsx               # Punto de entrada
├── package.json               # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
└── README.md                 # Documentación
```

## 📡 API Endpoints

### Gestión de Jugadores
- `GET /get-jugadores` - Obtener todos los jugadores
- `GET /get-jugador?nombre={name}` - Obtener jugador específico
- `POST /set-estado-conexion` - Establecer estado de conexión
- `POST /set-estado-aceptacion` - Establecer estado de aceptación

### Manejo de Ofertas
- `POST /update-cuentas` - Actualizar valores de cuentas
- `POST /reset-jugadores` - Resetear todos los jugadores

## ⚙️ Configuración Técnica

### Polling Inteligente
```javascript
const POLLING_INTERVALS = {
    CONNECTION_CHECK: 1000, // Verificar conexión cada 1s
    OFFER_UPDATE: 5000,     // Actualizar ofertas cada 5s
    POST_ACTION_DELAY: 1000 // Delay después de acciones
};
```

### Gestión de Estado
- **useState** para estado local de componentes
- **useEffect** para efectos secundarios y polling
- **useCallback** y **useMemo** para optimización de rendimiento
- **localStorage** para persistencia de sesión

### Colores Bancolombia
```javascript
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
```

## 🐛 Resolución de Problemas

### Problemas Comunes

**"Acceso Denegado"**
- Verificar que se haya seleccionado un jugador
- Comprobar conectividad de red
- Revisar consola del navegador para errores

**Ofertas no aparecen**
- Verificar que el jugador esté en estado "esperando"
- Comprobar que haya ofertas configuradas en el backend
- Usar el botón "🔄 Actualizar" para forzar actualización

**Botones deshabilitados**
- Los botones solo se habilitan cuando hay ofertas nuevas
- Verificar que el estado sea "esperando" (no "aceptado" o "rechazado")

### Logs de Desarrollo
La aplicación incluye logging mínimo para debugging:
```javascript
console.log('💰 Nueva oferta disponible para', playerName);
console.error('Error fetching player data:', error);
```

## 🔒 Manejo de Errores

### Estrategias Implementadas
- **Fallback a localStorage** cuando la API no está disponible
- **Reintentos automáticos** en operaciones críticas
- **Estados de carga** para mejorar UX
- **Mensajes informativos** para el usuario

### Tolerancia a Fallos
- La aplicación continúa funcionando con datos locales si la API falla
- Polling automático se reinicia después de errores de red
- Estados inconsistentes se resuelven automáticamente

## 📈 Optimizaciones de Rendimiento

### Técnicas Aplicadas
- **Memoización** de funciones y valores calculados
- **Polling condicional** que se detiene cuando no es necesario
- **Lazy loading** de componentes no críticos
- **Debouncing** en operaciones de red

### Métricas de Rendimiento
- Tiempo de carga inicial: <2s
- Frecuencia de polling: 5s (ofertas), 1s (conexión)
- Memoria utilizada: <50MB
- Ancho de banda: ~1KB/poll

## 🤝 Contribución

### Estándares de Código
- **ESLint** para linting
- **Prettier** para formateo
- **JSDoc** para documentación
- **Conventional Commits** para mensajes de commit

### Flujo de Desarrollo
1. Fork del repositorio
2. Crear rama feature/[nombre-feature]
3. Desarrollar con tests
4. Submit Pull Request
5. Code review y merge

## 📄 Licencia

Este proyecto es propiedad de Spatial Banking y está destinado para uso interno.

---

**Desarrollado por**: Sistema de Spatial Banking  
**Versión**: 1.0.0  
**Última actualización**: Agosto 2025
