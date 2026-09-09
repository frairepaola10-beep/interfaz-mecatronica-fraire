'use strict';

/**
 * Lista de escenarios que POST /api/simulation/scenario puede forzar.
 *
 * Existen para la Práctica 6 (Fallas y diagnóstico): permiten provocar a
 * voluntad cada condición anormal sin desconectar cables ni hardware real.
 * simulator.service.js es quien realmente interpreta cada nombre.
 */
module.exports = [
  'NORMAL',
  'TEMP_HIGH',
  'TEMP_CRITICAL',
  'COMM_LOST',
  'DEVICE_FAULT',
  'SENSOR_FAULT',
  'TIMEOUT',
];
