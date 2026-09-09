import { POLL_INTERVAL_MS } from './config.js';
import * as api from './api.js';
import * as state from './state.js';
import * as ui from './ui.js';

/**
 * app.js — coordinador principal del frontend.
 *
 * Detecta cuándo el usuario presiona un botón o mueve el slider, construye
 * el comando JSON correspondiente, llama a la API y decide cuándo (y con
 * qué) actualizar la interfaz.
 *
 * REGLA FUNDAMENTAL (ver README del proyecto, sección 23): este archivo
 * NUNCA debe llamar a state.setState({ running: true, ... }) justo
 * después de que el usuario presiona ARRANCAR. El estado del motor solo
 * se actualiza dentro de applyConfirmedState(), y esa función solo se
 * llama después de recibir una respuesta del backend con success: true.
 * Todo lo que ocurre ANTES de esa respuesta es únicamente visual (las
 * fases "Enviando..." / "Esperando confirmación...").
 */

const els = {
  slider: document.querySelector('[data-bind="speedSlider"]'),
  startBtn: document.querySelector('[data-action="start"]'),
  stopBtn: document.querySelector('[data-action="stop"]'),
  sendSpeedBtn: document.querySelector('[data-action="send-speed"]'),
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ---------- Controles ---------- */

els.slider.addEventListener('input', () => {
  ui.setSliderValue(els.slider.value);
});

// ============================================================
// TODO (Práctica 3 — exercises/practica-3-api-rest/):
// ============================================================
// Completa los tres manejadores de clic para que cada uno construya el
// comando JSON correcto (ver shared/json/protocolo.md) y se lo pase a
// runCommand(). El dispositivo siempre es "motor1".
//
//   ARRANCAR      -> { device: 'motor1', action: 'START', value: null }
//   PARAR         -> { device: 'motor1', action: 'STOP', value: null }
//   ENVIAR VELOCIDAD -> { device: 'motor1', action: 'SET_SPEED', value: <lo que diga el slider> }
//
// Pista: el valor actual del slider está en Number(els.slider.value).
// ============================================================

els.startBtn.addEventListener('click', () => {
  // TODO (Práctica 3): llama a runCommand(...) con el comando START.
});

els.stopBtn.addEventListener('click', () => {
  // TODO (Práctica 3): llama a runCommand(...) con el comando STOP.
});

els.sendSpeedBtn.addEventListener('click', () => {
  // TODO (Práctica 3): llama a runCommand(...) con el comando SET_SPEED,
  // usando el valor actual del slider.
});

function setControlsDisabled(disabled) {
  els.startBtn.disabled = disabled;
  els.stopBtn.disabled = disabled;
  els.sendSpeedBtn.disabled = disabled;
}

/* ==========================================================================
   Ejecución de un comando: las tres fases visuales
   ========================================================================== */

async function runCommand(command) {
  setControlsDisabled(true);
  ui.resetFlow();
  ui.showSentJson(command, 'POST /api/device/command');

  // ---- Fase 1: "Enviando comando..." ----
  // Puramente visual: el comando todavía no ha salido de verdad, solo
  // estamos mostrando el recorrido que está a punto de hacer.
  ui.setCommandPhase('Enviando comando...');
  ui.activateFlowStep('usuario', 'is-done');
  await sleep(120);
  ui.activateFlowStep('frontend', 'is-done');
  await sleep(120);
  ui.activateFlowStep('api');
  await sleep(120);
  ui.activateFlowStep('backend');

  // ---- Fase 2: "Esperando confirmación del ESP32..." ----
  // Aquí sí sale la solicitud real. Todo lo anterior fue para que el
  // recorrido se vea; esto es lo que realmente tarda.
  ui.setCommandPhase('Esperando confirmación del ESP32...');
  ui.activateFlowStep('esp32');
  const { body: response } = await api.sendCommand(command);
  ui.activateFlowStep('planta', 'is-done');

  if (!response) {
    // Ni siquiera hubo una respuesta interpretable (backend caído, red
    // cortada, timeout). Se trata igual que una pérdida de comunicación:
    // NUNCA se asume que el comando funcionó solo porque se envió.
    ['usuario', 'frontend', 'api'].forEach((step) => ui.activateFlowStep(step, 'is-done'));
    ui.activateFlowStep('backend', 'is-failed');
    handleDisconnected(null);
    ui.setCommandPhase('Sin respuesta del backend — no se pudo confirmar el comando.');
    setTimeout(ui.clearCommandPhase, 4000);
    return;
  }

  ui.showReceivedJson(response);

  // ---- Fase 3: "Comando confirmado" (o su equivalente de falla) ----
  // SOLO a partir de aquí se actualiza lo que la pantalla muestra como
  // estado real del motor.
  //
  // ============================================================
  // TODO (Práctica 3 — exercises/practica-3-api-rest/):
  // ============================================================
  // Esta es la REGLA FUNDAMENTAL de todo el proyecto (ver README del
  // proyecto, sección 23, y el comentario al inicio de este archivo):
  // la interfaz NUNCA debe mostrar que el motor cambió de estado solo
  // porque el usuario presionó un botón. Solo debe mostrarlo cuando el
  // backend lo CONFIRMA.
  //
  // Completa este bloque así:
  //
  //   if (response.success) {
  //     // El comando se ejecutó y el backend confirma el nuevo estado.
  //     // 1. Marca como "is-done" (verde) el resto del camino de ida:
  //     //    ['usuario', 'frontend', 'api', 'backend', 'esp32']
  //     //    (usuario/frontend ya estaban en 'is-done' desde la Fase 1)
  //     // 2. Marca como "is-done" todo el camino de vuelta:
  //     //    ['r-esp32', 'r-backend', 'r-json', 'r-frontend', 'r-ui']
  //     // 3. ui.setCommandPhase(`Comando confirmado — ${describeConfirmation(command, response)}`)
  //     // 4. applyConfirmedState(response)  <- AQUÍ, y solo aquí, se
  //     //    actualiza lo que ve el usuario como estado real del motor.
  //     // 5. setControlsDisabled(false)
  //   } else {
  //     // El backend no pudo confirmar el comando (sin conexión, timeout,
  //     // falla del dispositivo). NUNCA asumas que sí funcionó.
  //     // 1. Marca como "is-done" el tramo que sí se completó:
  //     //    ['usuario', 'frontend', 'api', 'backend']
  //     // 2. Marca 'esp32' como "is-failed" (rojo) — ahí se rompió.
  //     // 3. handleDisconnected(response)
  //     // 4. ui.setCommandPhase('Comando NO confirmado — ver alarma en el panel de Alarmas y eventos.')
  //   }
  //
  // Pista: usa ui.activateFlowStep(nombre, 'is-done' | 'is-failed') para
  // cada paso — mira cómo ya se usa un poco más arriba, en la Fase 1/2.
  // ============================================================

  // TODO (Práctica 3): reemplaza este bloque por la lógica descrita arriba.
  console.error('TODO: falta completar la Fase 3 de runCommand() en frontend/js/app.js (Práctica 3)');

  await refreshAlarmHistory();
  setTimeout(ui.clearCommandPhase, 4000);
}

function describeConfirmation(command, response) {
  switch (command.action) {
    case 'START':
      return 'Motor encendido';
    case 'STOP':
      return 'Motor detenido';
    case 'SET_SPEED':
      return `Velocidad ajustada a ${response.state.speed}%`;
    default:
      return 'Estado actualizado';
  }
}

/** Aplica al estado del frontend justo lo que el backend confirmó — nada más. */
function applyConfirmedState(response) {
  state.setState({
    connected: true,
    running: response.state.running,
    speed: response.state.speed,
    temperature: response.state.temperature,
    potentiometerAdc: response.state.potentiometerAdc,
    relay: response.state.relay,
    startButton: response.state.startButton,
    stopButton: response.state.stopButton,
    latencyMs: response.communication.latencyMs,
    alarms: response.alarms,
  });
}

/** Sin conexión confirmada: el estado del motor pasa a "desconocido", nunca se conserva el último valor. */
function handleDisconnected(response) {
  const alarms = response && response.alarms && response.alarms.length
    ? response.alarms
    : [{ code: 'COMM_LOST', severity: 'CRITICAL', message: 'No fue posible comunicarse con el dispositivo' }];

  state.setState({
    connected: false,
    running: null,
    speed: null,
    temperature: null,
    potentiometerAdc: null,
    relay: null,
    startButton: null,
    stopButton: null,
    latencyMs: null,
    alarms,
  });
  setControlsDisabled(true);
}

/* ==========================================================================
   Sondeo periódico (polling)
   ========================================================================== */

/**
 * Sin que el usuario haga nada, se refresca el estado cada
 * POLL_INTERVAL_MS. Esto es lo que hace que la temperatura del motor
 * virtual siga evolucionando en pantalla mientras el motor sigue
 * encendido entre una acción del usuario y la siguiente. No usa las fases
 * visuales de runCommand() — esas se reservan para acciones explícitas.
 */
async function poll() {
  const { body: response } = await api.getStatus();

  if (!response || !response.success) {
    handleDisconnected(response);
  } else {
    applyConfirmedState(response);
    setControlsDisabled(false);
  }

  ui.showReceivedJson(response ?? { success: false });
  await refreshAlarmHistory();
}

async function refreshAlarmHistory() {
  const { body } = await api.getAlarms();
  if (body && Array.isArray(body.history)) {
    state.setState({ history: body.history });
  }
}

async function refreshHealth() {
  const { body } = await api.getHealth();
  if (body) {
    state.setState({ backendReachable: true, esp32Connected: body.esp32Connected, mode: body.mode });
  } else {
    state.setState({ backendReachable: false, esp32Connected: false });
  }
}

/* ==========================================================================
   Arranque
   ========================================================================== */

// ui.applyState se suscribe una sola vez: a partir de aquí, cualquier
// setState() en cualquier parte de este archivo redibuja la pantalla.
state.subscribe(ui.applyState);

async function init() {
  ui.setSliderValue(els.slider.value);
  ui.clearCommandPhase();

  await refreshHealth();
  await poll();

  setInterval(refreshHealth, POLL_INTERVAL_MS);
  setInterval(poll, POLL_INTERVAL_MS);
}

init();
