/**
 * config.js
 *
 * Configuración del frontend. Al mantenerla separada, cambiar de dónde
 * vive el backend (por ejemplo, para apuntar a otra IP en el laboratorio)
 * no requiere tocar ningún otro archivo.
 */

// Cadena vacía = mismo origen que sirvió este HTML (así funciona server.js
// del backend). Si se abre este frontend con Live Server u otro puerto,
// cambiar esto por 'http://localhost:3000'.
export const API_BASE = '';

// Cada cuántos milisegundos el frontend pregunta el estado sin que el
// usuario haga nada, para que la temperatura/velocidad sigan
// actualizándose en pantalla mientras el motor está encendido.
export const POLL_INTERVAL_MS = 2000;

// Tiempo máximo que el frontend espera una respuesta antes de darla por
// perdida. Debe ser mayor al COMMAND_TIMEOUT_MS del backend para que sea
// el backend (no el navegador) quien decida primero que hubo timeout.
export const REQUEST_TIMEOUT_MS = 4000;
