'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const createApp = require('../src/app');

/**
 * contract.test.js
 *
 * Verifica que las respuestas del backend tengan siempre la misma forma
 * descrita en shared/json/protocolo.md, sin importar si se llega por
 * POST /command o GET /status. Esta es la prueba que corre igual en
 * solucion/ (donde debe pasar) y en plantilla-alumno/ (donde debe pasar
 * una vez que el alumno complete los TODOs).
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

test('POST /api/device/command responde con el contrato completo', async () => {
  const res = await fetch(`${baseUrl}/api/device/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device: 'motor1', action: 'START', value: null }),
  });
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.match(body.transactionId, /^CMD-\d{3}$/);
  assert.equal(body.device, 'motor1');
  assert.equal(typeof body.communication.connected, 'boolean');
  assert.ok('latencyMs' in body.communication);
  assert.ok('running' in body.state);
  assert.ok('speed' in body.state);
  assert.ok('temperature' in body.state);
  assert.ok(Array.isArray(body.alarms));
  assert.equal(typeof body.message, 'string');
});

test('GET /api/device/status responde con el mismo contrato', async () => {
  const res = await fetch(`${baseUrl}/api/device/status`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.ok('state' in body);
  assert.ok(Array.isArray(body.alarms));
});

test('GET /api/health responde con backend, esp32Connected y mode', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.backend, true);
  assert.equal(typeof body.esp32Connected, 'boolean');
  assert.equal(typeof body.mode, 'string');
});
