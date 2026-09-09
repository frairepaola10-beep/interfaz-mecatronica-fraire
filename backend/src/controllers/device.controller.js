'use strict';

const config = require('../config');
const deviceService = require('../services/device.service');
const alarmService = require('../services/alarm.service');
const simulator = require('../services/simulator.service');
const validScenarios = require('../mocks/scenarios');

/**
 * device.controller.js
 *
 * Capa delgada entre las rutas HTTP y los services. Su única
 * responsabilidad es traducir req/res de Express hacia/desde llamadas a
 * los services, y elegir el código de estado HTTP correcto. Toda la
 * lógica de negocio vive en services/, no aquí.
 */

/** POST /api/device/command — ya pasó por validateCommand.js. */
async function postCommand(req, res, next) {
  try {
    const response = await deviceService.executeCommand(req.command, req.transactionId);
    // 200 si el sistema confirmó el comando; 503 (Service Unavailable) si
    // no hubo forma de comunicarse con el dispositivo.
    res.status(response.success ? 200 : 503).json(response);
  } catch (err) {
    next(err);
  }
}

/** GET /api/device/status — reutiliza executeCommand con un GET_STATUS interno. */
async function getStatus(req, res, next) {
  try {
    const response = await deviceService.getStatus(req.transactionId);
    res.status(response.success ? 200 : 503).json(response);
  } catch (err) {
    next(err);
  }
}

/** GET /api/device/alarms — historial para el panel "Alarmas y eventos". */
function getAlarms(req, res) {
  res.json({ history: alarmService.getHistory() });
}

/** GET /api/health — alimenta el header del frontend (estado backend/ESP32/latencia/modo). */
function getHealth(req, res) {
  res.json({
    backend: true,
    esp32Connected: simulator.isConnected(),
    mode: config.MODE,
  });
}

/**
 * POST /api/simulation/scenario — Práctica 6.
 * Fuerza una condición de falla (o la limpia con "NORMAL") sin necesidad
 * de tocar hardware.
 */
function setScenario(req, res) {
  const { scenario } = req.body || {};

  if (!validScenarios.includes(scenario)) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_SCENARIO',
      details: `Escenario desconocido: "${scenario}".`,
      valid: validScenarios,
    });
  }

  simulator.setScenario(scenario);
  alarmService.pushEvent(`Escenario de simulación forzado: ${scenario}`);
  res.json({ success: true, scenario });
}

module.exports = { postCommand, getStatus, getAlarms, getHealth, setScenario };
