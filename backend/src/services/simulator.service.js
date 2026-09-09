'use strict';

/**
 * simulator.service.js — el "motor virtual".
 *
 * En Modo SIMULACIÓN, este módulo hace las veces de ESP32 + planta física.
 * Mantiene el estado real del sistema (no lo que el usuario pidió, sino lo
 * que "sucedió"), y communication.service.js lo consulta como si fuera una
 * respuesta HTTP del microcontrolador.
 *
 * La temperatura no es aleatoria: sigue a la velocidad con inercia y algo
 * de ruido, así que el alumno puede provocar TEMP_HIGH y TEMP_CRITICAL con
 * el mismo slider de velocidad, sin necesidad de forzar nada (ver también
 * setScenario, usado por la Práctica 6 para provocar fallas puntuales).
 */

const state = {
  running: false,
  speed: 0, // 0-100 %, confirmado
  temperature: 25, // °C, evoluciona con tick()
  potentiometerAdc: 0, // 0-4095
  relay: false,
  startButton: 'LIBRE',
  stopButton: 'LIBRE',
};

// null = funcionamiento normal. Cualquier otro valor fuerza una condición
// específica para la Práctica 6 (ver mocks/scenarios.js para la lista).
let scenario = null;

// Temperaturas fijas que usan los escenarios forzados, para que las
// pruebas y la demostración en clase sean deterministas.
const FORCED_TEMPERATURES = {
  TEMP_HIGH: 55,
  TEMP_CRITICAL: 75,
};

function start() {
  state.running = true;
}

function stop() {
  state.running = false;
}

function setSpeed(value) {
  state.speed = value;
}

/**
 * Avanza un "paso" de la simulación física. Se llama tanto desde el lazo
 * periódico de server.js como inmediatamente después de cada comando, para
 * que la respuesta ya refleje el efecto del comando que se acaba de recibir.
 */
function tick() {
  const targetTemp = state.running ? 25 + state.speed * 0.45 : 25;
  const noise = (Math.random() - 0.5) * 1.5;
  let next = state.temperature + (targetTemp - state.temperature) * 0.15 + noise;
  next = Math.max(0, Math.min(100, next));
  state.temperature = Math.round(next * 10) / 10;

  state.potentiometerAdc = Math.round((state.speed / 100) * 4095);
  state.relay = state.running;
}

/**
 * Devuelve una copia del estado, aplicando los escenarios forzados
 * (SENSOR_FAULT reporta temperatura nula; TEMP_HIGH/TEMP_CRITICAL la
 * fuerzan a un valor fijo por encima de cada umbral).
 */
function getState() {
  let temperature = state.temperature;
  if (scenario === 'SENSOR_FAULT') {
    temperature = null;
  } else if (scenario in FORCED_TEMPERATURES) {
    temperature = FORCED_TEMPERATURES[scenario];
  }

  return {
    running: state.running,
    speed: state.speed,
    temperature,
    potentiometerAdc: state.potentiometerAdc,
    relay: state.relay,
    startButton: state.startButton,
    stopButton: state.stopButton,
  };
}

function setScenario(name) {
  scenario = name === 'NORMAL' ? null : name;
}

function getScenario() {
  return scenario;
}

/**
 * Usado por /api/health para reportar "Estado ESP32" en el header del
 * frontend. En Modo SIMULACIÓN solo COMM_LOST lo pone en falso.
 */
function isConnected() {
  return scenario !== 'COMM_LOST';
}

module.exports = {
  start,
  stop,
  setSpeed,
  tick,
  getState,
  setScenario,
  getScenario,
  isConnected,
};
