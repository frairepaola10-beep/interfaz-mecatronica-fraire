'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const createApp = require('../src/app');

/**
 * validation.test.js — Práctica 4.
 *
 * Comprueba que el backend RECHACE los comandos incorrectos con
 * { success: false, error: "INVALID_COMMAND" } y código HTTP 400, y que
 * jamás intente ejecutar un comando inválido.
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

async function postCommand(payload) {
  const res = await fetch(`${baseUrl}/api/device/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return { status: res.status, body: await res.json() };
}

test('un comando válido (START) es aceptado', async () => {
  const { status, body } = await postCommand({ device: 'motor1', action: 'START', value: null });
  assert.equal(status, 200);
  assert.equal(body.success, true);
});

test('rechaza un comando sin "device"', async () => {
  const { status, body } = await postCommand({ action: 'START', value: null });
  assert.equal(status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error, 'INVALID_COMMAND');
});

test('rechaza una acción no permitida', async () => {
  const { status, body } = await postCommand({ device: 'motor1', action: 'VOLAR' });
  assert.equal(status, 400);
  assert.equal(body.error, 'INVALID_COMMAND');
});

test('rechaza SET_SPEED con "value" fuera de rango', async () => {
  const { status, body } = await postCommand({ device: 'motor1', action: 'SET_SPEED', value: 150 });
  assert.equal(status, 400);
  assert.equal(body.error, 'INVALID_COMMAND');
});

test('rechaza SET_SPEED sin "value" numérico', async () => {
  const { status, body } = await postCommand({ device: 'motor1', action: 'SET_SPEED', value: 'rapido' });
  assert.equal(status, 400);
  assert.equal(body.error, 'INVALID_COMMAND');
});

test('rechaza un dispositivo desconocido', async () => {
  const { status, body } = await postCommand({ device: 'motor2', action: 'START', value: null });
  assert.equal(status, 400);
  assert.equal(body.error, 'INVALID_COMMAND');
});
