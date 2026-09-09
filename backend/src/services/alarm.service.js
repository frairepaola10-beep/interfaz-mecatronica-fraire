'use strict';

const config = require('../config');

/**
 * alarm.service.js
 *
 * Evalúa el estado del sistema y decide qué alarmas están activas.
 * También mantiene un historial de eventos para el panel "Alarmas y
 * eventos" del frontend (Práctica 2 y Práctica 6).
 *
 * Tabla de alarmas (README del proyecto, sección 24):
 *   TEMP_HIGH        WARNING   Temperatura elevada
 *   TEMP_CRITICAL    CRITICAL  Temperatura crítica
 *   COMM_LOST        CRITICAL  Pérdida de comunicación
 *   INVALID_COMMAND  WARNING   Comando inválido
 *   DEVICE_FAULT     CRITICAL  Falla del dispositivo
 */

// Historial en memoria. Se reinicia si el backend se reinicia: es un
// proyecto didáctico, no hace falta persistencia en disco/BD.
const history = [];

function pushEvent(message) {
  history.unshift({ timestamp: new Date().toISOString(), message });
  if (history.length > 50) history.length = 50;
}

/**
 * Evalúa la temperatura contra los umbrales configurados.
 * @param {number|null} temperature
 * @returns {Array<{code: string, severity: string, message: string}>}
 *
 * ============================================================
 * TODO (Práctica 2 / Práctica 6 — exercises/practica-2-frontend-estados/
 * y exercises/practica-6-fallas-diagnostico/):
 * ============================================================
 * Completa esta función para que devuelva:
 *
 *   - []                                    si temperature es null/undefined
 *                                            (no se puede evaluar lo que no se conoce)
 *   - [{ code: 'TEMP_CRITICAL', severity: 'CRITICAL', ... }]
 *                                            si temperature >= config.TEMP_CRITICAL_THRESHOLD
 *   - [{ code: 'TEMP_HIGH', severity: 'WARNING', ... }]
 *                                            si temperature >= config.TEMP_WARNING_THRESHOLD
 *                                            (pero por debajo del umbral crítico)
 *   - []                                    en cualquier otro caso (temperatura normal)
 *
 * IMPORTANTE: evalúa primero el umbral CRÍTICO. Si evalúas primero el de
 * WARNING, una temperatura de 75°C (crítica) también cumpliría ">= 50°C"
 * y terminarías reportando la alarma equivocada.
 *
 * El campo "message" es libre, pero debe ser legible para mostrarse en
 * el panel de alarmas del frontend, por ejemplo:
 *   `Temperatura elevada (${temperature} °C)`
 *
 * Cómo saber si ya quedó bien: corre `npm test` — alarms.test.js fuerza
 * los escenarios TEMP_HIGH y TEMP_CRITICAL (ver
 * POST /api/simulation/scenario) y comprueba exactamente esto.
 * ============================================================
 */
function evaluateTemperature(temperature) {
  // TODO (Práctica 2/6): reemplaza esta línea por la lógica descrita arriba.
  return [];
}

function commLostAlarm() {
  return {
    code: 'COMM_LOST',
    severity: 'CRITICAL',
    message: 'Comunicación perdida con el dispositivo',
  };
}

function invalidCommandAlarm() {
  return {
    code: 'INVALID_COMMAND',
    severity: 'WARNING',
    message: 'Comando inválido recibido',
  };
}

function deviceFaultAlarm(detail) {
  return {
    code: 'DEVICE_FAULT',
    severity: 'CRITICAL',
    message: detail || 'Falla del dispositivo',
  };
}

function getHistory() {
  return history;
}

module.exports = {
  evaluateTemperature,
  commLostAlarm,
  invalidCommandAlarm,
  deviceFaultAlarm,
  pushEvent,
  getHistory,
};
