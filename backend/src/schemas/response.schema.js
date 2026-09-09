'use strict';

/**
 * Constructores de las tres formas de respuesta descritas en
 * shared/json/protocolo.md: OK, alarma y error.
 *
 * Centralizar la forma de la respuesta en un solo lugar evita que cada
 * service arme el JSON "a mano" y se le olvide un campo — el frontend
 * (y los tests de contrato) dependen de que esta forma sea siempre igual.
 */

/**
 * @param {object} params
 * @param {string} params.transactionId  Ej. "CMD-001"
 * @param {string} params.device
 * @param {{connected: boolean, latencyMs: number|null}} params.communication
 * @param {{running: boolean|null, speed: number|null, temperature: number|null}} params.state
 * @param {Array<{code: string, severity: string, message: string}>} [params.alarms]
 * @param {string} [params.message]
 */
function buildSuccessResponse({ transactionId, device, communication, state, alarms = [], message = 'Comando ejecutado correctamente' }) {
  return {
    success: true,
    transactionId,
    device,
    communication,
    state,
    alarms,
    message,
  };
}

/**
 * @param {object} params
 * @param {string} [params.transactionId]
 * @param {string} params.device
 * @param {Array<{code: string, severity: string, message: string}>} params.alarms
 */
function buildErrorResponse({ transactionId, device, alarms }) {
  return {
    success: false,
    transactionId,
    device,
    communication: { connected: false, latencyMs: null },
    state: { running: null, speed: null, temperature: null },
    alarms,
  };
}

/**
 * Respuesta breve para comandos rechazados por el middleware de validación
 * (Práctica 4). Deliberadamente más simple: el comando nunca llegó a
 * ejecutarse, así que no tiene sentido reportar un "state".
 */
function buildValidationErrorResponse({ error, details }) {
  return {
    success: false,
    error,
    ...(details ? { details } : {}),
  };
}

module.exports = {
  buildSuccessResponse,
  buildErrorResponse,
  buildValidationErrorResponse,
};
