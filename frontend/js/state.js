/**
 * state.js
 *
 * Mantiene el estado que el frontend "conoce" en este momento — es decir,
 * el último estado CONFIRMADO por el backend, nunca una suposición. Usa un
 * patrón de publicación/suscripción muy simple: ui.js se suscribe una vez
 * y se vuelve a dibujar cada vez que algo cambia; app.js es el único que
 * llama a setState().
 */

const state = {
  // Conectividad
  backendReachable: false, // ¿respondió algo /api/health?
  esp32Connected: false, // lo que reporta /api/health
  connected: null, // null = aún no se sabe; true/false tras el primer comando/status
  mode: 'SIMULATION',
  latencyMs: null,

  // Estado confirmado del motor
  running: null,
  speed: null,
  temperature: null,
  potentiometerAdc: null,
  relay: null,
  startButton: null,
  stopButton: null,

  // Alarmas
  alarms: [],
  history: [],
};

const subscribers = [];

/** Devuelve una referencia de solo lectura por convención — no mutar directamente. */
export function getState() {
  return state;
}

/** ui.js llama a esto una sola vez, al arrancar. */
export function subscribe(fn) {
  subscribers.push(fn);
}

/** Único punto de entrada para modificar el estado. Notifica a quien esté suscrito. */
export function setState(patch) {
  Object.assign(state, patch);
  subscribers.forEach((fn) => fn(state));
}
