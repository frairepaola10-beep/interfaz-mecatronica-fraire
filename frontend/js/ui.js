
/**
 * ui.js
 *
 * Única capa del frontend que toca el DOM. app.js decide QUÉ mostrar y
 * CUÁNDO; este módulo solo sabe CÓMO pintarlo. Ningún otro archivo debe
 * hacer document.querySelector ni modificar textContent/className
 * directamente — así, si mañana cambia el diseño visual, solo hay que
 * tocar este archivo.
 */

// Cachea todos los elementos marcados con data-bind="..." en index.html,
// indexados por ese nombre. Evita repetir querySelector por todos lados.
const els = {};
document.querySelectorAll('[data-bind]').forEach((el) => {
  els[el.dataset.bind] = el;
});

// Igual, pero para los pasos de la franja de flujo (data-flow="...").
const flowEls = {};
document.querySelectorAll('[data-flow]').forEach((el) => {
  flowEls[el.dataset.flow] = el;
});


/* ==========================================================================
   Resaltado de sintaxis JSON, escrito a mano (sin librerías externas)
   ========================================================================== */

/**
 * Convierte un valor a JSON indentado y le agrega <span> de color por tipo
 * de token: llaves (tok-key), cadenas (tok-string), números (tok-number),
 * booleanos (tok-boolean) y null (tok-null). El regex encuentra cada
 * cadena/booleano/null/número; si una cadena está seguida de ":" se pinta
 * como llave, si no, como valor de texto.
 */
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
      cls = /:\s*$/.test(match) ? 'tok-key' : 'tok-string';
    } else if (match === 'true' || match === 'false') {
      cls = 'tok-boolean';
    } else if (match === 'null') {
      cls = 'tok-null';
    }

    return `<span class="${cls}">${match}</span>`;
  });
}


/* ==========================================================================
   Paneles JSON
   ========================================================================== */

/**
 * Pinta el comando recién construido en el panel "JSON ENVIADO".
 */
export function showSentJson(command, endpoint) {
  els.sentEndpoint.textContent = endpoint;
  els.sentRequestId.textContent = 'Solicitud pendiente…';
  els.sentJson.innerHTML = highlightJson(command);
}


/**
 * Pinta la respuesta en el panel "JSON RECIBIDO" y completa el ID
 * de solicitud en ambos paneles.
 */
export function showReceivedJson(response) {
  const id = response && response.transactionId
    ? `Solicitud #${response.transactionId}`
    : 'Solicitud #—';

  els.sentRequestId.textContent = id;
  els.receivedRequestId.textContent = id;
  els.receivedJson.innerHTML = highlightJson(response ?? {});
}


/* ==========================================================================
   Franja de flujo
   ========================================================================== */

/** Quita el resaltado de todos los pasos, antes de iniciar un nuevo comando. */
export function resetFlow() {
  Object.values(flowEls).forEach((el) => {
    el.classList.remove('is-active', 'is-done', 'is-failed');
  });
}


/** Resalta un paso del flujo. cls por defecto es "is-active" (azul); usar "is-done" para el verde final. */
export function activateFlowStep(name, cls = 'is-active') {
  const el = flowEls[name];
  if (!el) return;

  el.classList.remove('is-active', 'is-done', 'is-failed');
  el.classList.add(cls);
}


export function setFlowPhase(text) {
  els.flowPhase.textContent = text;
}


/* ==========================================================================
   Fase del comando (Enviando… / Esperando confirmación… / Confirmado)
   ========================================================================== */

export function setCommandPhase(text) {
  els.commandPhase.hidden = false;
  els.commandPhase.textContent = text;
  setFlowPhase(text);
}


export function clearCommandPhase() {
  els.commandPhase.hidden = true;
  setFlowPhase('En reposo — esperando una acción del usuario');
}


/* ==========================================================================
   Slider de velocidad
   ========================================================================== */

export function setSliderValue(value) {
  els.speedSliderValue.textContent = `${value} %`;
}


/* ==========================================================================
   Aplicar el estado confirmado a toda la pantalla
   ========================================================================== */

/**
 * Redibuja TODA la pantalla a partir del estado actual. Se llama cada vez
 * que state.js notifica un cambio (ver state.subscribe(ui.applyState) en
 * app.js). Nunca se llama "a medias": o se pinta con datos reales, o se
 * pinta el estado de desconexión — nunca una mezcla de ambos.
 */
export function applyState(state) {
  renderHeader(state);
  renderCommBanner(state);
  renderMotor(state);
  renderProcess(state);
  renderAlarms(state);
}


function renderHeader(state) {
  els.backendStatusText.textContent =
    state.backendReachable ? 'Conectado' : 'Desconectado';

  const esp32Ok = state.connected !== false && state.esp32Connected;

  els.esp32StatusText.textContent =
    esp32Ok ? 'Conectado' : 'Desconectado';

  els.esp32Dot.className =
    `dot ${esp32Ok ? 'dot--green' : 'dot--red'}`;

  els.latencyText.textContent =
    state.latencyMs != null ? `${state.latencyMs} ms` : '— ms';

  els.modeBadge.textContent =
    `Modo: ${state.mode === 'HARDWARE' ? 'HARDWARE' : 'SIMULACIÓN'}`;
}


function renderCommBanner(state) {
  const lost = state.connected === false;
  els.commBanner.classList.toggle('comm-banner--hidden', !lost);
}


/* ==========================================================================
   Render del motor
   ========================================================================== */

/**
 * TODO (Práctica 2):
 *
 * Completar renderMotor(), renderProcess() y renderAlarms()
 * para las actividades 2 a 5.
 */


function renderMotor(state) {
  // TODO (Práctica 2): Actividad 2
}


function renderProcess(state) {
  // TODO (Práctica 2): Actividades siguientes
}


function renderAlarms(state) {
  // TODO (Práctica 2): Actividades 4 y 5

  const alarms = state.alarms || [];

  const history = state.history || [];

  if (history.length === 0) {
    els.eventHistory.innerHTML =
      '<li class="event-history__item">' +
      '<span class="event-history__time">—</span>' +
      '<span class="event-history__text">Sin eventos todavía.</span>' +
      '</li>';

    return;
  }

  els.eventHistory.innerHTML = history
    .slice(0, 20)
    .map((event) => {
      const time = new Date(event.timestamp).toLocaleTimeString(
        'es-MX',
        { hour12: false }
      );

      return (
        `<li class="event-history__item">` +
        `<span class="event-history__time">${time}</span>` +
        `<span class="event-history__text">${escapeHtml(event.message)}</span>` +
        `</li>`
      );
    })
    .join('');
}


function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
