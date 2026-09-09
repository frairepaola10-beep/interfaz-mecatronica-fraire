'use strict';

const createApp = require('./src/app');
const config = require('./src/config');
const simulator = require('./src/services/simulator.service');

/**
 * server.js — punto de entrada del backend.
 *
 *   1. Construye la app (app.js).
 *   2. En Modo SIMULACIÓN, arranca el "latido" del motor virtual: así la
 *      temperatura sigue evolucionando aunque nadie esté enviando
 *      comandos en ese instante exacto (por ejemplo, mientras el motor
 *      sigue encendido entre una solicitud y la siguiente).
 *   3. Levanta el servidor HTTP.
 */
const app = createApp();

if (config.MODE === 'SIMULATION') {
  setInterval(() => simulator.tick(), config.SIMULATION_TICK_MS);
}

app.listen(config.PORT, () => {
  console.log('==============================================');
  console.log(' Interfaz Mecatrónica — Backend');
  console.log(`  http://localhost:${config.PORT}`);
  console.log(`  Modo: ${config.MODE}`);
  console.log('==============================================');
});

module.exports = app;
