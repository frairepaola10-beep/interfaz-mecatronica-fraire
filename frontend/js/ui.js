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
  const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const TOKEN = /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g;

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
 * ============================================================
 * TODO (Práctica 2, Actividad 1 — exercises/practica-2-frontend-estados/):
 * ============================================================
 * Completa showSentJson() y showReceivedJson() para que los paneles
 * "JSON ENVIADO" y "JSON RECIBIDO" de la pantalla realmente muestren el
 * comando que se envía y la respuesta que llega — ahora mismo se quedan
 * vacíos, aunque el backend ya está respondiendo correctamente.
 *
 * Ya tienes armado highlightJson(valor) (arriba), que convierte
 * cualquier objeto a una cadena HTML con colores por tipo de dato —
 * no necesitas tocarla, solo llamarla y poner el resultado en el
 * elemento correcto.
 *
 * showSentJson(command, endpoint):
 *   - els.sentEndpoint.textContent = endpoint
 *   - els.sentRequestId.textContent = 'Solicitud pendiente…' (todavía no
 *     se sabe el ID: lo asigna el backend en la respuesta, no el
 *     frontend — mostrar "pendiente" es más honesto que inventar un número)
 *   - els.sentJson.innerHTML = highlightJson(command)
 *
 * showReceivedJson(response):
 *   - arma `const id = response && response.transactionId ?
 *     `Solicitud #${response.transactionId}` : 'Solicitud #—';`
 *   - ponlo en AMBOS els.sentRequestId y els.receivedRequestId (así el
 *     panel "enviado" también se actualiza con el ID real una vez que
 *     llega la respuesta)
 *   - els.receivedJson.innerHTML = highlightJson(response ?? {})
 *
 * Cómo probarlo SIN el resto del frontend terminado: abre la pestaña
 * Red/Network del navegador (F12), recarga la página — el sondeo
 * automático ya está haciendo GET /api/device/status cada 2 segundos —
 * y compara la respuesta real que ves ahí contra lo que debería
 * aparecer en el panel "JSON RECIBIDO" una vez completes esto.
 * ============================================================
 */
/** Pinta el comando recién construido en el panel "JSON ENVIADO". */
export function showSentJson(command, endpoint) {
  // TODO (Práctica 2, Actividad 1): implementa según la guía de arriba.
}

/** Pinta la respuesta en el panel "JSON RECIBIDO" y completa el ID de solicitud en ambos paneles. */
export function showReceivedJson(response) {
  // TODO (Práctica 2, Actividad 1): implementa según la guía de arriba.
}

/* ==========================================================================
   Franja de flujo
   ========================================================================== */

/** Quita el resaltado de todos los pasos, antes de iniciar un nuevo comando. */
export function resetFlow() {
  Object.values(flowEls).forEach((el) => el.classList.remove('is-active', 'is-done', 'is-failed'));
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
  els.backendStatusText.textContent = state.backendReachable ? 'Conectado' : 'Desconectado';

  const esp32Ok = state.connected !== false && state.esp32Connected;
  els.esp32StatusText.textContent = esp32Ok ? 'Conectado' : 'Desconectado';
  els.esp32Dot.className = `dot ${esp32Ok ? 'dot--green' : 'dot--red'}`;

  els.latencyText.textContent = state.latencyMs != null ? `${state.latencyMs} ms` : '— ms';
  els.modeBadge.textContent = `Modo: ${state.mode === 'HARDWARE' ? 'HARDWARE' : 'SIMULACIÓN'}`;
}

function renderCommBanner(state) {
  const lost = state.connected === false;
  els.commBanner.classList.toggle('comm-banner--hidden', !lost);
}

/**
 * ============================================================
 * TODO (Práctica 2 — exercises/practica-2-frontend-estados/):
 * ============================================================
 * Completa renderMotor(), renderProcess() y renderAlarms() para que la
 * pantalla refleje estos casos (son, literalmente, los criterios de
 * aceptación de la Práctica 2):
 *
 *   state.running === true            -> mostrar "ENCENDIDO"
 *   state.running === false           -> mostrar "DETENIDO"
 *   state.connected === false         -> mostrar "SIN COMUNICACIÓN" y
 *                                         todos los valores como "—"
 *                                         (nunca el último valor conocido)
 *   alarms[].severity === 'WARNING'   -> banner de advertencia (amarillo)
 *   alarms[].severity === 'CRITICAL'  -> banner de alarma crítica (rojo)
 *   sin alarmas                       -> "Sin alarmas activas" (verde)
 *
 * Tienes disponibles estos elementos (ya cacheados en `els`, arriba):
 *   motorStatusBadge, motorRing, motorSpeedBig, motorStateText,
 *   motorSpeedText, motorTempText, motorCommText,
 *   processSpeed, processTemp, processAdc, processRelay,
 *   processBtnStart, processBtnStop, tempGaugeMarker,
 *   alarmBanner, alarmBannerText, eventHistory
 *
 * Y estas clases CSS ya definidas en css/styles.css:
 *   badge--running / badge--stopped / badge--unknown
 *   is-running / is-unknown  (para motorRing)
 *   alarm-banner--ok / alarm-banner--warning / alarm-banner--critical
 *
 * Pista: fíjate en cómo renderHeader() y renderCommBanner() (arriba)
 * usan state.connected para decidir qué mostrar — el mismo patrón
 * aplica aquí.
 *
 * Cómo probarlo SIN tener el resto del frontend terminado: abre la
 * consola del navegador con la página cargada y ejecuta, por ejemplo:
 *   document.querySelector('[data-bind="motorStateText"]').textContent
 * después de llamar manualmente a applyState() con distintos objetos de
 * estado (basados en shared/json/response-ok.json,
 * response-alarm.json y response-error.json).
 * ============================================================
 */
function renderMotor(state) {
  // TODO (Práctica 2): pinta el badge/anillo/textos del motor según
  // state.running y state.connected (ver los casos descritos arriba).
}

function renderProcess(state) {
  // TODO (Práctica 2): pinta velocidad, temperatura (+ marcador de la
  // barra 0-100°C), ADC, relevador y pulsadores según el estado.
}

function renderAlarms(state) {
  // TODO (Práctica 2): decide qué alarma mostrar en el banner (la más
  // grave si hay varias) y actualiza el historial de eventos.
  //
  // No borres el código de abajo: ya arma el HTML del historial a
  // partir de state.history una vez que "history" esté definido.
  const alarms = state.alarms || [];

  const history = state.history || [];
  if (history.length === 0) {
    els.eventHistory.innerHTML = '<li class="event-history__item"><span class="event-history__time">—</span><span class="event-history__text">Sin eventos todavía.</span></li>';
    return;
  }

  els.eventHistory.innerHTML = history
    .slice(0, 20)
    .map((event) => {
      const time = new Date(event.timestamp).toLocaleTimeString('es-MX', { hour12: false });
      return `<li class="event-history__item"><span class="event-history__time">${time}</span><span class="event-history__text">${escapeHtml(event.message)}</span></li>`;
    })
    .join('');
}

function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
