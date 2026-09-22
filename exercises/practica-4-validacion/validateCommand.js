'use strict';

const { VALID_DEVICES, VALID_ACTIONS } = require('../schemas/command.schema');
const { buildValidationErrorResponse } = require('../schemas/response.schema');
const alarmService = require('../services/alarm.service');

function validateCommand(req, res, next) {
  const body = req.body || {};
  const { device, action, value } = body;

  // 1. Validar que device exista y sea texto
  if (typeof device !== 'string' || device.length === 0) {
    return reject(
      res,
      'Falta el campo "device" o no es un texto válido.'
    );
  }

  // 2. Validar que action exista y sea texto
  if (typeof action !== 'string' || action.length === 0) {
    return reject(
      res,
      'Falta el campo "action" o no es un texto válido.'
    );
  }

  // 3. Validar que el dispositivo sea conocido
  if (!VALID_DEVICES.includes(device)) {
    return reject(
      res,
      `Dispositivo desconocido: "${device}".`
    );
  }

  // 4. Validar que la acción sea permitida
  const actionSpec = VALID_ACTIONS[action];

  if (!actionSpec) {
    return reject(
      res,
      `Acción no permitida: "${action}". Use START, STOP, SET_SPEED o GET_STATUS.`
    );
  }

  // 5. Validar value según la acción
  if (actionSpec.requiresValue) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return reject(
        res,
        `La acción "${action}" requiere un "value" numérico.`
      );
    }

    // 6. Validar rango
    if (value < actionSpec.valueMin || value > actionSpec.valueMax) {
      return reject(
        res,
        `"value" debe estar entre ${actionSpec.valueMin} y ${actionSpec.valueMax}.`
      );
    }
  } else if (value !== null && value !== undefined) {
    return reject(
      res,
      `La acción "${action}" no admite el campo "value".`
    );
  }

  // Comando válido: normalizar y continuar al controller
  req.command = {
    device,
    action,
    value: value ?? null
  };

  next();
}

function reject(res, details) {
  alarmService.pushEvent(`Comando inválido rechazado: ${details}`);

  return res.status(400).json(
    buildValidationErrorResponse({
      error: 'INVALID_COMMAND',
      details
    })
  );
}

module.exports = validateCommand;