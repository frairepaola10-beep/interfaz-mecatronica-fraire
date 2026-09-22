import { POLL_INTERVAL_MS } from './config.js';
import * as api from './api.js';
import * as state from './state.js';
import * as ui from './ui.js';

/**
 * app.js
 *
 * Coordinador principal del frontend.
 *
 * Este archivo:
 * - recibe acciones del usuario
 * - construye los comandos JSON
 * - llama a la API
 * - procesa las respuestas
 * - actualiza el estado global
 *
 * No modifica directamente el DOM.
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

/* ==========================================================================
   CONTROLES
   ========================================================================== */

els.slider.addEventListener('input', () => {
  ui.setSliderValue(els.slider.value);
});

/* ==========================================================================
   COMANDOS
   ========================================================================== */

els.startBtn.addEventListener('click', () => {
  runCommand({
    device: 'motor1',
    action: 'START',
    value: null,
  });
});

els.stopBtn.addEventListener('click', () => {
  runCommand({
    device: 'motor1',
    action: 'STOP',
    value: null,
  });
});

els.sendSpeedBtn.addEventListener('click', () => {
  runCommand({
    device: 'motor1',
    action: 'SET_SPEED',
    value: Number(els.slider.value),
  });
});

function setControlsDisabled(disabled) {
  els.startBtn.disabled = disabled;
  els.stopBtn.disabled = disabled;
  els.sendSpeedBtn.disabled = disabled;
}

/* ==========================================================================
   EJECUTAR COMANDO
   ========================================================================== */

async function runCommand(command) {
  setControlsDisabled(true);

  ui.resetFlow();

  ui.showSentJson(
    command,
    'POST /api/device/command'
  );

  /* ------------------------------------------------------------------------
     FASE 1 — Enviando comando
     ------------------------------------------------------------------------ */

  ui.setCommandPhase('Enviando comando...');

  ui.activateFlowStep('usuario', 'is-done');

  await sleep(120);

  ui.activateFlowStep('frontend', 'is-done');

  await sleep(120);

  ui.activateFlowStep('api');

  await sleep(120);

  ui.activateFlowStep('backend');

  /* ------------------------------------------------------------------------
     FASE 2 — Esperando confirmación
     ------------------------------------------------------------------------ */

  ui.setCommandPhase(
    'Esperando confirmación del ESP32...'
  );

  ui.activateFlowStep('esp32');

  const { body: response } =
    await api.sendCommand(command);

  ui.activateFlowStep(
    'planta',
    'is-done'
  );

  /* ------------------------------------------------------------------------
     Sin respuesta
     ------------------------------------------------------------------------ */

  if (!response) {
    ['usuario', 'frontend', 'api'].forEach((step) => {
      ui.activateFlowStep(
        step,
        'is-done'
      );
    });

    ui.activateFlowStep(
      'backend',
      'is-failed'
    );

    handleDisconnected(null);

    ui.setCommandPhase(
      'Sin respuesta del backend — no se pudo confirmar el comando.'
    );

    setTimeout(
      ui.clearCommandPhase,
      4000
    );

    return;
  }

  /* Mostrar JSON recibido */

  ui.showReceivedJson(response);

  /* ------------------------------------------------------------------------
     FASE 3 — Confirmación
     ------------------------------------------------------------------------ */

  if (
    response.success === true &&
    response.communication &&
    response.communication.connected === true
  ) {
    [
      'usuario',
      'frontend',
      'api',
      'backend',
      'esp32',
    ].forEach((step) => {
      ui.activateFlowStep(
        step,
        'is-done'
      );
    });

    [
      'r-esp32',
      'r-backend',
      'r-json',
      'r-frontend',
      'r-ui',
    ].forEach((step) => {
      ui.activateFlowStep(
        step,
        'is-done'
      );
    });

    applyConfirmedState(response);

    ui.setCommandPhase(
      `Comando confirmado — ${describeConfirmation(
        command,
        response
      )}`
    );

    setControlsDisabled(false);

  } else {
    /*
     * El backend respondió, pero el comando no quedó confirmado
     * o el dispositivo aparece desconectado.
     */

    [
      'usuario',
      'frontend',
      'api',
      'backend',
    ].forEach((step) => {
      ui.activateFlowStep(
        step,
        'is-done'
      );
    });

    ui.activateFlowStep(
      'esp32',
      'is-failed'
    );

    handleDisconnected(response);

    ui.setCommandPhase(
      'Comando NO confirmado — ver alarma en el panel de Alarmas y eventos.'
    );
  }

  await refreshAlarmHistory();

  setTimeout(
    ui.clearCommandPhase,
    4000
  );
}

/* ==========================================================================
   DESCRIPCIÓN DEL COMANDO
   ========================================================================== */

function describeConfirmation(
  command,
  response
) {
  switch (command.action) {

    case 'START':
      return 'Motor encendido';

    case 'STOP':
      return 'Motor detenido';

    case 'SET_SPEED':
      return `Velocidad ajustada a ${
        response.state.speed
      }%`;

    default:
      return 'Estado actualizado';
  }
}

/* ==========================================================================
   ESTADO CONFIRMADO
   ========================================================================== */

/**
 * Solo copia al estado del frontend información que realmente
 * vino confirmada por el backend.
 *
 * success:true NO significa automáticamente que el ESP32 esté conectado.
 * Para eso revisamos communication.connected.
 */

function applyConfirmedState(response) {
  const communication =
    response.communication || {};

  const deviceState =
    response.state || {};

  /*
   * Si el dispositivo no está conectado,
   * no conservamos los valores anteriores.
   */

  if (
    communication.connected !== true
  ) {
    handleDisconnected(response);
    return;
  }

  state.setState({
    connected: true,

    running:
      deviceState.running ?? null,

    speed:
      deviceState.speed ?? null,

    temperature:
      deviceState.temperature ?? null,

    potentiometerAdc:
      deviceState.potentiometerAdc ?? null,

    relay:
      deviceState.relay ?? null,

    startButton:
      deviceState.startButton ?? null,

    stopButton:
      deviceState.stopButton ?? null,

    latencyMs:
      communication.latencyMs ?? null,

    alarms:
      Array.isArray(response.alarms)
        ? response.alarms
        : [],
  });
}

/* ==========================================================================
   DESCONEXIÓN
   ========================================================================== */

/**
 * Cuando no existe comunicación confirmada:
 *
 * connected = false
 *
 * y todos los valores actuales pasan a null.
 *
 * De esta forma ui.js los representa como "—".
 */

function handleDisconnected(response) {
  const alarms =
    response &&
    Array.isArray(response.alarms) &&
    response.alarms.length > 0
      ? response.alarms
      : [
          {
            code: 'COMM_LOST',
            severity: 'CRITICAL',
            message:
              'No fue posible comunicarse con el dispositivo',
          },
        ];

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
   POLLING
   ========================================================================== */

/**
 * Consulta periódicamente el estado del dispositivo.
 */

async function poll() {
  const { body: response } =
    await api.getStatus();

  /*
   * Backend no respondió correctamente.
   */

  if (
    !response ||
    response.success !== true
  ) {
    handleDisconnected(response);
  }

  /*
   * Backend respondió, pero el dispositivo
   * aparece desconectado.
   */

  else if (
    !response.communication ||
    response.communication.connected !== true
  ) {
    handleDisconnected(response);
  }

  /*
   * Comunicación correcta.
   */

  else {
    applyConfirmedState(response);

    setControlsDisabled(false);
  }

  ui.showReceivedJson(
    response ?? {
      success: false,
    }
  );

  await refreshAlarmHistory();
}

/* ==========================================================================
   HISTORIAL DE ALARMAS
   ========================================================================== */

async function refreshAlarmHistory() {
  const { body } =
    await api.getAlarms();

  if (
    body &&
    Array.isArray(body.history)
  ) {
    state.setState({
      history: body.history,
    });
  }
}

/* ==========================================================================
   HEALTH
   ========================================================================== */

async function refreshHealth() {
  const { body } =
    await api.getHealth();

  if (body) {
    state.setState({
      backendReachable: true,
      esp32Connected:
        body.esp32Connected,
      mode:
        body.mode,
    });
  } else {
    state.setState({
      backendReachable: false,
      esp32Connected: false,
    });
  }
}

/* ==========================================================================
   ARRANQUE
   ========================================================================== */

state.subscribe(
  ui.applyState
);

async function init() {
  ui.setSliderValue(
    els.slider.value
  );

  ui.clearCommandPhase();

  await refreshHealth();

  await poll();

  setInterval(
    refreshHealth,
    POLL_INTERVAL_MS
  );

  setInterval(
    poll,
    POLL_INTERVAL_MS
  );
}

init();