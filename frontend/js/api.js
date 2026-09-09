import { API_BASE, REQUEST_TIMEOUT_MS } from './config.js';

/**
 * api.js
 *
 * Única capa del frontend que sabe hacer fetch(). Todas las llamadas
 * pasan por request(), que aplica un timeout con AbortController: si el
 * backend no contesta a tiempo, esto se trata igual que cualquier otra
 * pérdida de comunicación en vez de dejar la interfaz esperando para
 * siempre.
 */
async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, signal: controller.signal });
    // Incluso las respuestas de error (400, 503) traen JSON útil: no
    // lanzamos excepción solo porque res.ok sea falso.
    const body = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    // Cubre tanto el timeout (AbortError) como cualquier falla de red
    // real (backend apagado, sin Wi-Fi, CORS, etc.).
    return { ok: false, status: 0, body: null };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * POST /api/device/command — construye y envía el comando JSON.
 *
 * ============================================================
 * TODO (Práctica 3 — exercises/practica-3-api-rest/):
 * ============================================================
 * Esta es la función más importante del proyecto: es literalmente donde
 * el frontend "arma y envía" el JSON que viaja hacia el backend (ver
 * shared/json/protocolo.md).
 *
 * Complétala llamando a request(path, options), igual que ya hacen
 * getStatus()/getAlarms()/getHealth() más abajo, pero esta vez con:
 *
 *   - method: 'POST'
 *   - headers: { 'Content-Type': 'application/json' }
 *   - body: el "command" convertido a texto JSON (JSON.stringify)
 *
 * @param {{device: string, action: string, value: number|null}} command
 * @returns {Promise<{ok: boolean, status: number, body: object|null}>}
 *
 * Cómo saber si ya quedó bien: abre las herramientas de desarrollador del
 * navegador (pestaña Red/Network), presiona ARRANCAR en la interfaz, y
 * confirma que sale una solicitud POST a /api/device/command con el
 * cuerpo correcto — y que el panel "JSON ENVIADO" de la pantalla lo
 * refleja.
 * ============================================================
 */
export function sendCommand(command) {
  // TODO (Práctica 3): reemplaza esta línea por el "return request(...)"
  // descrito arriba.
  console.error('TODO: falta implementar sendCommand() en frontend/js/api.js (Práctica 3)');
  return Promise.resolve({ ok: false, status: 0, body: null });
}

/** GET /api/device/status — usado por el sondeo periódico. */
export function getStatus() {
  return request('/api/device/status');
}

/** GET /api/device/alarms — historial para el panel de eventos. */
export function getAlarms() {
  return request('/api/device/alarms');
}

/** GET /api/health — alimenta el header (backend/ESP32/latencia/modo). */
export function getHealth() {
  return request('/api/health');
}

/** POST /api/simulation/scenario — Práctica 6, forzar una falla concreta. */
export function setScenario(scenario) {
  return request('/api/simulation/scenario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario }),
  });
}
