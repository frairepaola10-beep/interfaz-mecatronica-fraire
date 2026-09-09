'use strict';

const express = require('express');
const controller = require('../controllers/device.controller');
const validateCommand = require('../middleware/validateCommand');
const requestId = require('../middleware/requestId');

/**
 * device.routes.js
 *
 *   POST /api/device/command  → validateCommand → postCommand
 *   GET  /api/device/status   → getStatus
 *   GET  /api/device/alarms   → getAlarms
 *
 * requestId corre para todas las rutas de este router, así toda solicitud
 * relacionada con el dispositivo trae su número de "Solicitud #CMD-###".
 */
const router = express.Router();

router.use(requestId);

router.post('/command', validateCommand, controller.postCommand);
router.get('/status', controller.getStatus);
router.get('/alarms', controller.getAlarms);

module.exports = router;
