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
  history.unshift({
    timestamp: new Date().toISOString(),
    message
  });

  if (history.length > 50) {
    history.length = 50;
  }
}

/**
 * Evalúa la temperatura contra los umbrales configurados.
 *
 * @param {number|null} temperature
 * @returns {Array<{code: string, severity: string, message: string}>}
 *
 * Devuelve:
 *
 *   - [] si temperature es null/undefined
 *   - TEMP_CRITICAL / CRITICAL si supera o iguala el umbral crítico
 *   - TEMP_HIGH / WARNING si supera o iguala el umbral de warning
 *   - [] en cualquier otro caso
 *
 * IMPORTANTE:
 * Primero se evalúa el umbral CRÍTICO para evitar que una temperatura
 * crítica sea reportada incorrectamente como WARNING.
 */
function evaluateTemperature(temperature) {
  if (temperature == null) {
    return [];
  }

  if (temperature >= config.TEMP_CRITICAL_THRESHOLD) {
    return [{
      code: 'TEMP_CRITICAL',
      severity: 'CRITICAL',
      message: `Temperatura crítica (${temperature} °C)`
    }];
  }

  if (temperature >= config.TEMP_WARNING_THRESHOLD) {
    return [{
      code: 'TEMP_HIGH',
      severity: 'WARNING',
      message: `Temperatura elevada (${temperature} °C)`
    }];
  }

  return [];
}

function commLostAlarm() {
  return {
    code: 'COMM_LOST',
    severity: 'CRITICAL',
    message: 'Comunicación perdida con el dispositivo'
  };
}

function invalidCommandAlarm() {
  return {
    code: 'INVALID_COMMAND',
    severity: 'WARNING',
    message: 'Comando inválido recibido'
  };
}

function deviceFaultAlarm(detail) {
  return {
    code: 'DEVICE_FAULT',
    severity: 'CRITICAL',
    message: detail || 'Falla del dispositivo'
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
  getHistory
};