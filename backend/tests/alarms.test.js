'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const createApp = require('../src/app');

/**
 * alarms.test.js
 *
 * Comprueba la evaluación de alarmas: temperatura normal (sin alarma),
 * TEMP_HIGH/WARNING, TEMP_CRITICAL/CRITICAL, y pérdida de comunicación
 * (COMM_LOST/CRITICAL). Usa POST /api/simulation/scenario para forzar
 * cada condición de forma determinista (Práctica 6).
 */

let server;
let baseUrl;

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://localhost:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

async function forceScenario(scenario) {
  await fetch(`${baseUrl}/api/simulation/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario }),
  });
}

async function getStatus() {
  const res = await fetch(`${baseUrl}/api/device/status`);
  return { status: res.status, body: await res.json() };
}

test('temperatura normal no genera alarmas', async () => {
  await forceScenario('NORMAL');
  const { body } = await getStatus();
  assert.deepEqual(body.alarms, []);
});

test('escenario TEMP_HIGH genera alarma WARNING/TEMP_HIGH', async () => {
  await forceScenario('TEMP_HIGH');
  const { body } = await getStatus();
  assert.equal(body.alarms.length, 1);
  assert.equal(body.alarms[0].code, 'TEMP_HIGH');
  assert.equal(body.alarms[0].severity, 'WARNING');
});

test('escenario TEMP_CRITICAL genera alarma CRITICAL/TEMP_CRITICAL', async () => {
  await forceScenario('TEMP_CRITICAL');
  const { body } = await getStatus();
  assert.equal(body.alarms.length, 1);
  assert.equal(body.alarms[0].code, 'TEMP_CRITICAL');
  assert.equal(body.alarms[0].severity, 'CRITICAL');
});

test('escenario COMM_LOST responde success:false con alarma COMM_LOST y estado nulo', async () => {
  await forceScenario('COMM_LOST');
  const { status, body } = await getStatus();
  assert.equal(status, 503);
  assert.equal(body.success, false);
  assert.equal(body.alarms[0].code, 'COMM_LOST');
  assert.equal(body.alarms[0].severity, 'CRITICAL');
  assert.equal(body.state.running, null);
  assert.equal(body.state.temperature, null);

  await forceScenario('NORMAL'); // limpiar para no afectar otros tests
});
