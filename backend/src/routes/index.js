'use strict';

const express = require('express');
const deviceRoutes = require('./device.routes');
const controller = require('../controllers/device.controller');

/**
 * routes/index.js — punto único de montaje de toda la API bajo /api.
 *
 *   /api/device/...           → device.routes.js
 *   GET  /api/health          → estado backend/ESP32 para el header
 *   POST /api/simulation/scenario → forzar fallas (Práctica 6)
 */
const router = express.Router();

router.use('/device', deviceRoutes);
router.get('/health', controller.getHealth);
router.post('/simulation/scenario', controller.setScenario);

module.exports = router;
