/**
 * ui.js
 *
 * Unica capa del frontend que toca el DOM.
 */

const els = {};

document.querySelectorAll("[data-bind]").forEach(function (el) {
  els[el.dataset.bind] = el;
});

const flowEls = {};

document.querySelectorAll("[data-flow]").forEach(function (el) {
  flowEls[el.dataset.flow] = el;
});


/* =========================================================
   JSON
   ========================================================= */

function highlightJson(value) {
  return JSON.stringify(value || {}, null, 2);
}


/* =========================================================
   PANELES JSON
   ========================================================= */

export function showSentJson(command, endpoint) {
  els.sentEndpoint.textContent = endpoint;
  els.sentRequestId.textContent = "Solicitud pendiente...";
  els.sentJson.textContent = highlightJson(command);
}


export function showReceivedJson(response) {
  var id = "Solicitud #—";

  if (response && response.transactionId) {
    id = "Solicitud #" + response.transactionId;
  }

  els.sentRequestId.textContent = id;
  els.receivedRequestId.textContent = id;
  els.receivedJson.textContent = highlightJson(response);
}


/* =========================================================
   FLUJO
   ========================================================= */

export function resetFlow() {
  Object.values(flowEls).forEach(function (el) {
    el.classList.remove(
      "is-active",
      "is-done",
      "is-failed"
    );
  });
}


export function activateFlowStep(name, cls) {
  var el = flowEls[name];

  if (!el) {
    return;
  }

  el.classList.remove(
    "is-active",
    "is-done",
    "is-failed"
  );

  el.classList.add(cls || "is-active");
}


export function setFlowPhase(text) {
  els.flowPhase.textContent = text;
}


/* =========================================================
   FASE DE COMANDO
   ========================================================= */

export function setCommandPhase(text) {
  els.commandPhase.hidden = false;
  els.commandPhase.textContent = text;
  setFlowPhase(text);
}


export function clearCommandPhase() {
  els.commandPhase.hidden = true;

  setFlowPhase(
    "En reposo — esperando una acción del usuario"
  );
}


/* =========================================================
   SLIDER
   ========================================================= */

export function setSliderValue(value) {
  els.speedSliderValue.textContent = value + " %";
}


/* =========================================================
   APLICAR ESTADO
   ========================================================= */

export function applyState(state) {
  renderHeader(state);
  renderCommBanner(state);
  renderMotor(state);
  renderProcess(state);
  renderAlarms(state);
}


/* =========================================================
   HEADER
   ========================================================= */

function renderHeader(state) {

  els.backendStatusText.textContent =
    state.backendReachable
      ? "Conectado"
      : "Desconectado";

  var esp32Ok =
    state.connected !== false &&
    state.esp32Connected;

  els.esp32StatusText.textContent =
    esp32Ok
      ? "Conectado"
      : "Desconectado";

  els.esp32Dot.className =
    "dot " +
    (esp32Ok
      ? "dot--green"
      : "dot--red");

  els.latencyText.textContent =
    state.latencyMs != null
      ? state.latencyMs + " ms"
      : "— ms";

  els.modeBadge.textContent =
    "Modo: " +
    (
      state.mode === "HARDWARE"
        ? "HARDWARE"
        : "SIMULACIÓN"
    );
}


/* =========================================================
   COMUNICACIÓN
   ========================================================= */

function renderCommBanner(state) {

  var lost =
    state.connected === false;

  els.commBanner.classList.toggle(
    "comm-banner--hidden",
    !lost
  );
}


/* =========================================================
   MOTOR - ACTIVIDAD 2
   ========================================================= */

function renderMotor(state) {

  /* Sin comunicación */

  if (state.connected === false) {

    els.motorStatusBadge.textContent =
      "SIN COMUNICACIÓN";

    els.motorStatusBadge.className =
      "badge";

    els.motorStateText.textContent =
      "SIN COMUNICACIÓN";

    els.motorRing.classList.remove(
      "is-running"
    );

    els.motorSpeedText.textContent = "—";
    els.motorTempText.textContent = "— °C";

    return;
  }


  /* Encendido */

  if (state.running === true) {

    els.motorStatusBadge.textContent =
      "ENCENDIDO";

    els.motorStatusBadge.className =
      "badge badge--running";

    els.motorStateText.textContent =
      "ENCENDIDO";

    els.motorRing.classList.add(
      "is-running"
    );
  }


  /* Detenido */

  else if (state.running === false) {

    els.motorStatusBadge.textContent =
      "DETENIDO";

    els.motorStatusBadge.className =
      "badge badge--stopped";

    els.motorStateText.textContent =
      "DETENIDO";

    els.motorRing.classList.remove(
      "is-running"
    );
  }


  /* Desconocido */

  else {

    els.motorStatusBadge.textContent =
      "DESCONOCIDO";

    els.motorStatusBadge.className =
      "badge";

    els.motorStateText.textContent =
      "DESCONOCIDO";

    els.motorRing.classList.remove(
      "is-running"
    );
  }


  /* Velocidad */

  els.motorSpeedText.textContent =
    state.speed != null
      ? state.speed
      : "—";


  /* Temperatura */

  els.motorTempText.textContent =
    state.temperature != null
      ? state.temperature + " °C"
      : "— °C";
}


/* =========================================================
   PROCESO
   ========================================================= */

function renderProcess(state) {
  // Actividades siguientes
}


/* =========================================================
   ALARMAS
   ========================================================= */

function renderAlarms(state) {

  var history = state.history || [];

  if (history.length === 0) {

    els.eventHistory.innerHTML =
      '<li class="event-history__item">' +
      '<span class="event-history__time">—</span>' +
      '<span class="event-history__text">' +
      "Sin eventos todavía." +
      "</span>" +
      "</li>";

    return;
  }


  els.eventHistory.innerHTML =
    history
      .slice(0, 20)
      .map(function (event) {

        var time =
          new Date(
            event.timestamp
          ).toLocaleTimeString(
            "es-MX",
            {
              hour12: false
            }
          );

        return (
          '<li class="event-history__item">' +
          '<span class="event-history__time">' +
          time +
          "</span>" +
          '<span class="event-history__text">' +
          escapeHtml(event.message) +
          "</span>" +
          "</li>"
        );
      })
      .join("");
}


/* =========================================================
   SEGURIDAD
   ========================================================= */

function escapeHtml(text) {

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}