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
 * (Hardware real) sin tocar ni el frontend ni las rutas del backend.
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
  // config.MODE decide en tiempo de ejecución a quién le hablamos.
  return config.MODE === 'HARDWARE'
    ? sendToHardware(command)
    : sendToSimulation(command);
}

/**
 * Camino usado en Modo SIMULACIÓN.
 *
 * En vez de hablar con un ESP32 real, hablamos directamente con
 * simulator.service.js, pero mantenemos la misma forma de respuesta
 * que tendría un ESP32 real.
 */
async function sendToSimulation(command) {
  const scenario = simulator.getScenario();

  // ============================================================
  // COMM_LOST
  // ============================================================
  // Se perdió la comunicación con el dispositivo.
  // No podemos conocer su estado actual, por lo tanto devolvemos
  // connected:false y state:null.
  if (scenario === 'COMM_LOST') {
    return {
      connected: false,
      latencyMs: null,
      state: null,
      deviceFault: null,
    };
  }

  // ============================================================
  // TIMEOUT
  // ============================================================
  // Simulamos que el ESP32 tarda más de lo permitido en responder.
  if (scenario === 'TIMEOUT') {
    await delay(config.COMMAND_TIMEOUT_MS + 500);

    return {
      connected: false,
      latencyMs: null,
      state: null,
      deviceFault: null,
    };
  }

  // ============================================================
  // FUNCIONAMIENTO NORMAL
  // ============================================================
  // Aplicamos el comando al motor virtual y avanzamos un paso
  // de la simulación para que la respuesta refleje el efecto
  // del comando recibido.
  applyCommand(command);
  simulator.tick();

  const state = simulator.getState();

  return {
    connected: true,

    // Latencia simulada entre 15 y 35 ms.
    latencyMs:
      Math.round(
        15 + Math.random() * 20
      ),

    state: {
      running: state.running,
      speed: state.speed,
      temperature: state.temperature,
      potentiometerAdc: state.potentiometerAdc,
      relay: state.relay,
      startButton: state.startButton,
      stopButton: state.stopButton,
    },

    deviceFault:
      scenario === 'DEVICE_FAULT'
        ? 'Falla simulada del dispositivo'
        : null,
  };
}

/**
 * Traduce un comando JSON en una llamada al motor virtual.
 */
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
      // validateCommand.js ya debería haber rechazado esto antes
      // de llegar aquí; este default es solo una red de seguridad.
      break;
  }
}

/**
 * Camino usado en Modo HARDWARE.
 *
 * El backend deja de simular y le hace POST de verdad al ESP32.
 * AbortController + setTimeout impone un timeout al fetch.
 */
async function sendToHardware(command) {
  const controller = new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    config.COMMAND_TIMEOUT_MS
  );

  const startedAt = Date.now();

  try {
    const res = await fetch(
      `${config.ESP32_URL}/command`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      return {
        connected: false,
        latencyMs: null,
        state: null,
        deviceFault:
          'Respuesta HTTP inválida del ESP32',
      };
    }

    const data = await res.json();

    return {
      connected: true,
      latencyMs:
        Date.now() - startedAt,
      state: data.state,
      deviceFault: null,
    };

  } catch (err) {
    // Cubre tanto el abort por timeout como cualquier error
    // de red. Desde el punto de vista del backend, todas esas
    // fallas se reportan como sin conexión.
    return {
      connected: false,
      latencyMs: null,
      state: null,
      deviceFault: null,
    };

  } finally {
    clearTimeout(timer);
  }
}

/**
 * Espera una cantidad de milisegundos.
 */
function delay(ms) {
  return new Promise(
    (resolve) => setTimeout(resolve, ms)
  );
}

module.exports = {
  sendCommand,
};