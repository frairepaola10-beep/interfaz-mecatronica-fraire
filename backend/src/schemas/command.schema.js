'use strict';

const config = require('../config');

/**
 * Definición estática de qué comandos acepta el sistema.
 *
 * validateCommand.js (middleware) usa esta definición para decidir si un
 * JSON entrante es válido o no. Mantenerla separada del middleware permite
 * reutilizarla también en los tests (Práctica 4).
 */

// Único dispositivo soportado en este proyecto didáctico.
const VALID_DEVICES = [config.DEVICE_ID];

// Acciones permitidas y si requieren (o no) el campo "value".
const VALID_ACTIONS = {
  START: { requiresValue: false },
  STOP: { requiresValue: false },
  SET_SPEED: { requiresValue: true, valueMin: 0, valueMax: 100 },
  GET_STATUS: { requiresValue: false },
};

module.exports = {
  VALID_DEVICES,
  VALID_ACTIONS,
};
