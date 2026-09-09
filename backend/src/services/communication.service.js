'use strict';

const config = require('../config');
const simulator = require('./simulator.service');

/**
 * communication.service.js
 *
 * Es la ÚNICA parte del backend que sabe cómo "hablar" con el dispositivo.
 * El resto del sistema (controllers, device.service) no sabe ni le importa
 * si el motor es virtual o si hay un ESP32 real conectado por Wi-Fi: solo
 * llama a sendCommand(command) y recibe siempre la misma forma de resultado.
 *
 * Esto es justo lo que permite cambiar de Modo 1 (Simulación) a Modo 2
 * (Hardware real) sin tocar ni el frontend ni las rutas del backend — ver
 * README del proyecto, sección 25.
 */

/**
 * @param {{device: string, action: string, value: number|null}} command
 * @returns {Promise<{
 *   connected: boolean,
 *   latencyMs: number|null,
 *   state: {running: boolean, speed: number, temperature: number|null}|null,
 *   deviceFault: string|null
 * }>}
 */
async function sendCommand(command) {
  // config.MODE decide en tiempo de ejecución a quién le hablamos. Nótese
  // que esta es la única línea de todo el backend que distingue los dos
  // modos de trabajo.
  return config.MODE === 'HARDWARE'
    ? sendToHardware(command)
    : sendToSimulation(command);
}

/**
 * Camino usado en Modo SIMULACIÓN: en vez de HTTP, "hablamos" directamente
 * con simulator.service.js, pero respetando exactamente la misma forma de
 * respuesta (incluyendo latencia y posibles fallas) que tendríamos con un
 * ESP32 real, para que el resto del backend no note la diferencia.
 */
async function sendToSimulation(command) {
  const scenario = simulator.getScenario();

  // ============================================================
  // TODO (Práctica 6 — exercises/practica-6-fallas-diagnostico/):
  // ============================================================
  // Completa aquí la detección de dos fallas, ANTES de que el comando
  // llegue a ejecutarse sobre el motor virtual:
  //
  //   1. Si scenario === 'COMM_LOST': el "cable se cortó". No hay forma
  //      de saber el estado real del dispositivo. Debes devolver:
  //        { connected: false, latencyMs: null, state: null, deviceFault: null }
  //
  //   2. Si scenario === 'TIMEOUT': el ESP32 "se queda pensando" más
  //      tiempo del que el backend está dispuesto a esperar. Simula esa
  //      espera real con `await delay(config.COMMAND_TIMEOUT_MS + 500)`
  //      (ya existe la función delay() al final de este archivo) y
  //      DESPUÉS devuelve el mismo resultado que en el caso anterior.
  //
  // ¿Por qué esperar de verdad en vez de fallar inmediato? Para que se
  // sienta como un timeout real: si el backend estuviera hablando con un
  // ESP32 de verdad, tardaría en darse cuenta de que no hay respuesta.
  //
  // Cómo saber si ya quedó bien: fuerza el escenario con
  //   curl -X POST http://localhost:3000/api/simulation/scenario \
  //        -H "Content-Type: application/json" -d '{"scenario":"COMM_LOST"}'
  // y confirma que GET /api/device/status responde con
  // { "success": false, "alarms": [{ "code": "COMM_LOST", ... }] }.
  // alarms.test.js también cubre el caso COMM_LOST.
  // ============================================================

  // Camino normal: aplicamos el comando al motor virtual y le pedimos que
  // avance un paso para que la respuesta ya refleje el efecto del comando.
  applyCommand(command);
  simulator.tick();

  const state = simulator.getState();

  return {
    connected: true,
    // Latencia simulada realista (15-35 ms), solo para que el panel de
    // comunicación del frontend tenga un número que mostrar.
    latencyMs: Math.round(15 + Math.random() * 20),
    state: {
      running: state.running,
      speed: state.speed,
      temperature: state.temperature, // puede venir null si scenario = SENSOR_FAULT
      // Campos adicionales (no forman parte del mínimo documentado en
      // protocolo.md, pero sí de telemetry.json): alimentan el panel
      // "Variables del proceso" del frontend con lecturas crudas.
      potentiometerAdc: state.potentiometerAdc,
      relay: state.relay,
      startButton: state.startButton,
      stopButton: state.stopButton,
    },
    deviceFault: scenario === 'DEVICE_FAULT' ? 'Falla simulada del dispositivo' : null,
  };
}

/** Traduce un comando JSON en una llamada al motor virtual. */
function applyCommand(command) {
  switch (command.action) {
    case 'START':
      simulator.start();
      break;
    case 'STOP':
      simulator.stop();
      break;
    case 'SET_SPEED':
      simulator.setSpeed(command.value);
      break;
    case 'GET_STATUS':
      // No modifica nada: solo se quiere leer el estado actual.
      break;
    default:
      // validateCommand.js ya debería haber rechazado esto antes de llegar
      // aquí; este default es solo una red de seguridad.
      break;
  }
}

/**
 * Camino usado en Modo HARDWARE (Práctica 5): el backend deja de simular y
 * le hace POST de verdad al ESP32. AbortController + setTimeout es la forma
 * estándar de imponer un timeout a un fetch en Node.
 */
async function sendToHardware(command) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.COMMAND_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const res = await fetch(`${config.ESP32_URL}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        connected: false,
        latencyMs: null,
        state: null,
        deviceFault: 'Respuesta HTTP inválida del ESP32',
      };
    }

    const data = await res.json();
    return {
      connected: true,
      latencyMs: Date.now() - startedAt,
      state: data.state,
      deviceFault: null,
    };
  } catch (err) {
    // Cubre tanto el abort por timeout como cualquier error de red
    // (ESP32 apagado, IP incorrecta, Wi-Fi caído, etc.). Desde el punto de
    // vista del backend, todas esas fallas se reportan igual: sin conexión.
    return { connected: false, latencyMs: null, state: null, deviceFault: null };
  } finally {
    clearTimeout(timer);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { sendCommand };
