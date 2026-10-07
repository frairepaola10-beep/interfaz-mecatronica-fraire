```js
/**
 * ui.js
 *
 * Unica capa del frontend que toca el DOM.
 */

// Cachea los elementos data-bind
const els = {};

document.querySelectorAll('[data-bind]').forEach((el) => {
  els[el.dataset.bind] = el;
});

// Cachea los elementos data-flow
const flowEls = {};

document.querySelectorAll('[data-flow]').forEach((el) => {
  flowEls[el.dataset.flow] = el;
});


/* ==========================================================================
   Resaltado de JSON
   ========================================================================== */

function highlightJson(value) {
  const json = JSON.stringify(value ?? {}, null, 2);

  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const TOKEN =
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g;

  return escaped.replace(TOKEN, (match) => {
    let cls = 'tok-number';

    if (/^"/.test(match)) {
      cls = /:\s*$/.test(match)
        ? 'tok-key'
        : 'tok-string';
    } else if (match === 'true' || match === 'false') {
      cls = 'tok-boolean';
    } else if (match === 'null') {
      cls = 'tok-null';
    }

    // Se evita template literal para evitar el error de sintaxis
    return '<span class="' + cls + '">' + match + '</span>';
  });
}


/* ==========================================================================
   Paneles JSON
   ========================================================================== */

export function showSentJson(command, endpoint) {
  els.sentEndpoint.textContent = endpoint;
  els.sentRequestId.textContent = 'Solicitud pendiente…';
  els.sentJson.innerHTML = highlightJson(command);
}


export function showReceivedJson(response) {
  const id = response && response.transactionId
    ? 'Solicitud #' + response.transactionId
    : 'Solicitud #—';

  els.sentRequestId.textContent = id;
  els.receivedRequestId.textContent = id;
  els.receivedJson.innerHTML = highlightJson(response ?? {});
}


/* ==========================================================================
   Franja de flujo
   ========================================================================== */

export function resetFlow() {
  Object.values(flowEls).forEach((el) => {
    el.classList.remove(
      'is-active',
      'is-done',
      'is-failed'
    );
  });
}


export function activateFlowStep(
  name,
  cls = 'is-active'
) {
  const el = flowEls[name];

  if (!el) return;

  el.classList.remove(
    'is-active',
    'is-done',
    'is-failed'
  );

  el.classList.add(cls);
}


export function setFlowPhase(text) {
  els.flowPhase.textContent = text;
}


/* ==========================================================================
   Fase del comando
   ========================================================================== */

export function setCommandPhase(text) {
  els.commandPhase.hidden = false;
  els.commandPhase.textContent = text;

  setFlowPhase(text);
}


export function clearCommandPhase() {
  els.commandPhase.hidden = true;

  setFlowPhase(
    'En reposo — esperando una acción del usuario'
  );
}


/* ==========================================================================
   Slider
   ========================================================================== */

export function setSliderValue(value) {
  els.speedSliderValue.textContent = value + ' %';
}


/* ==========================================================================
   Aplicar estado
   ========================================================================== */

export function applyState(state) {
  renderHeader(state);
  renderCommBanner(state);
  renderMotor(state);
  renderProcess(state);
  renderAlarms(state);
}


/* ==========================================================================
   Header
   ========================================================================== */

function renderHeader(state) {
  els.backendStatusText.textContent =
    state.backendReachable
      ? 'Conectado'
      : 'Desconectado';

  const esp32Ok =
    state.connected !== false &&
    state.esp32Connected;

  els.esp32StatusText.textContent =
    esp32Ok
      ? 'Conectado'
      : 'Desconectado';

  els.esp32Dot.className =
    'dot ' + (
      esp32Ok
        ? 'dot--green'
        : 'dot--red'
    );

  els.latencyText.textContent =
    state.latencyMs != null
      ? state.latencyMs + ' ms'
      : '— ms';

  els.modeBadge.textContent =
    'Modo: ' + (
      state.mode === 'HARDWARE'
        ? 'HARDWARE'
        : 'SIMULACIÓN'
    );
}


/* ==========================================================================
   Comunicacion
   ========================================================================== */

function renderCommBanner(state) {
  const lost = state.connected === false;

  els.commBanner.classList.toggle(
    'comm-banner--hidden',
    !lost
  );
}


/* ==========================================================================
   MOTOR
   ========================================================================== */

function renderMotor(state) {

  // Si no hay comunicacion
  if (state.connected === false) {

    els.motorStatusBadge.textContent =
      'SIN COMUNICACIÓN';

    els.motorStatusBadge.className =
      'badge';

    els.motorStateText.textContent =
      'SIN COMUNICACIÓN';

    els.motorRing.classList.remove(
      'is-running'
    );

    els.motorSpeedText.textContent =
      '—';

    els.motorTempText.textContent =
      '—';

    return;
  }


  // MOTOR ENCENDIDO
  if (state.running === true) {

    els.motorStatusBadge.textContent =
      'ENCENDIDO';

    els.motorStatusBadge.className =
      'badge badge--running';

    els.motorStateText.textContent =
      'ENCENDIDO';

    els.motorRing.classList.add(
      'is-running'
    );
  }


  // MOTOR DETENIDO
  else if (state.running === false) {

    els.motorStatusBadge.textContent =
      'DETENIDO';

    els.motorStatusBadge.className =
      'badge badge--stopped';

    els.motorStateText.textContent =
      'DETENIDO';

    els.motorRing.classList.remove(
      'is-running'
    );
  }


  // ESTADO DESCONOCIDO
  else {

    els.motorStatusBadge.textContent =
      'DESCONOCIDO';

    els.motorStatusBadge.className =
      'badge';

    els.motorStateText.textContent =
      'DESCONOCIDO';

    els.motorRing.classList.remove(
      'is-running'
    );
  }


  // VELOCIDAD
  els.motorSpeedText.textContent =
    state.speed != null
      ? state.speed
      : '—';


  // TEMPERATURA
  els.motorTempText.textContent =
    state.temperature != null
      ? state.temperature + ' °C'
      : '— °C';
}


/* ==========================================================================
   PROCESO
   ========================================================================== */

function renderProcess(state) {
  // TODO - Practica 2: actividades siguientes
}


/* ==========================================================================
   ALARMAS
   ========================================================================== */

function renderAlarms(state) {

  const alarms = state.alarms || [];
  const history = state.history || [];

  if (history.length === 0) {

    els.eventHistory.innerHTML =
      '<li class="event-history__item">' +
      '<span class="event-history__time">—</span>' +
      '<span class="event-history__text">' +
      'Sin eventos todavía.' +
      '</span>' +
      '</li>';

    return;
  }

  els.eventHistory.innerHTML =
    history
      .slice(0, 20)
      .map((event) => {

        const time =
          new Date(
            event.timestamp
          ).toLocaleTimeString(
            'es-MX',
            {
              hour12: false
            }
          );

        return (
          '<li class="event-history__item">' +
          '<span class="event-history__time">' +
          time +
          '</span>' +
          '<span class="event-history__text">' +
          escapeHtml(event.message) +
          '</span>' +
          '</li>'
        );
      })
      .join('');
}


/* ==========================================================================
   Seguridad HTML
   ========================================================================== */

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```
