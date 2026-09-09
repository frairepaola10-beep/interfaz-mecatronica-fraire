'use strict';

const config = require('../config');
const communication = require('./communication.service');
const alarmService = require('./alarm.service');
const { buildSuccessResponse, buildErrorResponse } = require('../schemas/response.schema');

/**
 * device.service.js
 *
 * Orquesta la ejecución de un comando ya validado:
 *
 *   1. Le pide a communication.service.js que hable con el dispositivo.
 *   2. Si no hubo conexión, arma la respuesta de error con la alarma COMM_LOST.
 *   3. Si sí hubo conexión, evalúa alarmas (temperatura, falla de
 *      dispositivo) sobre el estado que reportó el dispositivo.
 *   4. Registra un evento legible en el historial de alarmas.
 *   5. Arma y devuelve la respuesta final, siempre con la misma forma
 *      (ver shared/json/protocolo.md).
 */

/**
 * @param {{device: string, action: string, value: number|null}} command
 * @param {string} transactionId  Generado por middleware/requestId.js
 */
async function executeCommand(command, transactionId) {
  const result = await communication.sendCommand(command);

  // Sin conexión: no podemos afirmar nada sobre el estado real del motor,
  // así que la respuesta reporta state = null en todos sus campos (ver
  // regla fundamental de la interfaz, README sección 23).
  if (!result.connected) {
    alarmService.pushEvent(`Comunicación perdida al ejecutar ${command.action}`);
    return buildErrorResponse({
      transactionId,
      device: command.device,
      alarms: [alarmService.commLostAlarm()],
    });
  }

  // Con conexión: recopilamos todas las alarmas que apliquen a este estado.
  const alarms = [];
  if (result.deviceFault) {
    alarms.push(alarmService.deviceFaultAlarm(result.deviceFault));
  }
  alarms.push(...alarmService.evaluateTemperature(result.state.temperature));

  // Un solo evento por comando en el historial: o bien la alarma más
  // relevante, o bien una descripción de lo que se ejecutó sin problemas.
  if (alarms.length > 0) {
    alarms.forEach((alarm) => {
      alarmService.pushEvent(`${alarm.severity} ${alarm.code}: ${alarm.message}`);
    });
  } else if (command.action !== 'GET_STATUS') {
    alarmService.pushEvent(describeCommand(command));
  }

  return buildSuccessResponse({
    transactionId,
    device: command.device,
    communication: { connected: true, latencyMs: result.latencyMs },
    state: result.state,
    alarms,
  });
}

/** Traduce un comando ejecutado con éxito a un mensaje humano para el historial. */
function describeCommand(command) {
  switch (command.action) {
    case 'START':
      return 'Motor arrancado correctamente';
    case 'STOP':
      return 'Motor detenido correctamente';
    case 'SET_SPEED':
      return `Velocidad ajustada a ${command.value}%`;
    default:
      return `Comando ${command.action} ejecutado`;
  }
}

/**
 * GET /api/device/status se implementa como un GET_STATUS interno: así no
 * duplicamos la lógica de comunicación/alarmas para "leer" vs "actuar".
 */
async function getStatus(transactionId) {
  return executeCommand({ device: config.DEVICE_ID, action: 'GET_STATUS', value: null }, transactionId);
}

module.exports = { executeCommand, getStatus };
