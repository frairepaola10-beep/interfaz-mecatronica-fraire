'use strict';

const { VALID_DEVICES, VALID_ACTIONS } = require('../schemas/command.schema');
const { buildValidationErrorResponse } = require('../schemas/response.schema');
const alarmService = require('../services/alarm.service');

/**
 * validateCommand.js — el corazón de la Práctica 4.
 *
 * Ningún comando debe llegar a device.service.js sin pasar antes por
 * aquí. Si algo no cumple el contrato descrito en shared/json/protocolo.md,
 * la solicitud debe rechazarse con 400 y NUNCA intentar comunicarse con
 * el dispositivo (ni real ni simulado).
 *
 * ============================================================
 * TODO (Práctica 4 — exercises/practica-4-validacion/):
 * ============================================================
 * Completa la función validateCommand(req, res, next) para que valide,
 * EN ESTE ORDEN, el comando que llega en req.body:
 *
 *   1. Que "device" exista y sea un string no vacío.
 *   2. Que "action" exista y sea un string no vacío.
 *   3. Que "device" sea uno de los dispositivos conocidos (VALID_DEVICES).
 *   4. Que "action" sea una de las acciones permitidas (VALID_ACTIONS).
 *   5. Que "value" tenga el tipo y rango que esa acción espera:
 *        - Si VALID_ACTIONS[action].requiresValue es true (SET_SPEED),
 *          "value" debe ser un número dentro de [valueMin, valueMax].
 *        - Si es false (START, STOP, GET_STATUS), "value" debe venir
 *          null o undefined (no debe traer un valor).
 *
 * Si CUALQUIERA de esas comprobaciones falla, usa el helper reject(res,
 * details) que ya está escrito abajo — arma la respuesta de error con la
 * forma correcta y registra el evento en el historial de alarmas.
 *
 * Si TODAS las comprobaciones pasan, deja el comando ya normalizado en
 * req.command = { device, action, value } (con value en null si no
 * aplicaba) y llama a next() para que la solicitud siga su camino hacia
 * el controller.
 *
 * Pista: mira src/schemas/command.schema.js para ver la forma exacta de
 * VALID_DEVICES y VALID_ACTIONS.
 *
 * Cómo saber si ya quedó bien: corre `npm test` — validation.test.js
 * tiene los casos exactos que tu validación debe cubrir.
 * ============================================================
 */
function validateCommand(req, res, next) {
  const body = req.body || {};
  const { device, action, value } = body;

  // TODO (Práctica 4): reemplaza esta línea por las cinco comprobaciones
  // descritas arriba, usando reject(res, "mensaje explicando el problema")
  // en cada caso que falle.
  return reject(res, 'TODO: falta implementar validateCommand() en middleware/validateCommand.js (Práctica 4)');

  // TODO (Práctica 4): cuando termines las comprobaciones, descomenta
  // estas dos líneas (y borra el "return reject(...)" de arriba):
  //
  // req.command = { device, action, value: value ?? null };
  // next();
}

function reject(res, details) {
  alarmService.pushEvent(`Comando inválido rechazado: ${details}`);
  return res.status(400).json(buildValidationErrorResponse({ error: 'INVALID_COMMAND', details }));
}

module.exports = validateCommand;
