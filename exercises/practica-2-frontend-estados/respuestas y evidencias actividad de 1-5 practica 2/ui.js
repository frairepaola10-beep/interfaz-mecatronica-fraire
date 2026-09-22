/**
 * ui.js
 *
 * Única capa del frontend que toca el DOM.
 *
 * app.js decide QUÉ mostrar y CUÁNDO.
 * ui.js solamente decide CÓMO pintarlo.
 */

/* ==========================================================================
   CACHE DEL DOM
   ========================================================================== */

const els = {};

document
  .querySelectorAll('[data-bind]')
  .forEach((el) => {
    els[el.dataset.bind] = el;
  });

const flowEls = {};

document
  .querySelectorAll('[data-flow]')
  .forEach((el) => {
    flowEls[el.dataset.flow] = el;
  });

/* ==========================================================================
   JSON
   ========================================================================== */

function highlightJson(value) {
  const json = JSON.stringify(
    value ?? {},
    null,
    2
  );

  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const TOKEN =
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"\s*:|"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"|\b(true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

  return escaped.replace(
    TOKEN,
    (match) => {
      let cls = 'tok-number';

      if (/^"/.test(match)) {
        cls =
          /:\s*$/.test(match)
            ? 'tok-key'
            : 'tok-string';

      } else if (
        match === 'true' ||
        match === 'false'
      ) {
        cls = 'tok-boolean';

      } else if (
        match === 'null'
      ) {
        cls = 'tok-null';
      }

      return `<span class="${cls}">${match}</span>`;
    }
  );
}

/* ==========================================================================
   JSON ENVIADO
   ========================================================================== */

export function showSentJson(
  command,
  endpoint
) {
  els.sentEndpoint.textContent =
    endpoint;

  els.sentRequestId.textContent =
    'Solicitud pendiente…';

  els.sentJson.innerHTML =
    highlightJson(command);
}

/* ==========================================================================
   JSON RECIBIDO
   ========================================================================== */

export function showReceivedJson(
  response
) {
  const id =
    response &&
    response.transactionId
      ? `Solicitud #${response.transactionId}`
      : 'Solicitud #—';

  els.sentRequestId.textContent =
    id;

  els.receivedRequestId.textContent =
    id;

  els.receivedJson.innerHTML =
    highlightJson(
      response ?? {}
    );
}

/* ==========================================================================
   FLUJO
   ========================================================================== */

export function resetFlow() {
  Object.values(flowEls)
    .forEach((el) => {
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
  const el =
    flowEls[name];

  if (!el) return;

  el.classList.remove(
    'is-active',
    'is-done',
    'is-failed'
  );

  el.classList.add(cls);
}

export function setFlowPhase(text) {
  els.flowPhase.textContent =
    text;
}

/* ==========================================================================
   FASE DEL COMANDO
   ========================================================================== */

export function setCommandPhase(text) {
  els.commandPhase.hidden =
    false;

  els.commandPhase.textContent =
    text;

  setFlowPhase(text);
}

export function clearCommandPhase() {
  els.commandPhase.hidden =
    true;

  setFlowPhase(
    'En reposo — esperando una acción del usuario'
  );
}

/* ==========================================================================
   SLIDER
   ========================================================================== */

export function setSliderValue(
  value
) {
  els.speedSliderValue.textContent =
    `${value} %`;
}

/* ==========================================================================
   APLICAR ESTADO
   ========================================================================== */

export function applyState(state) {
  renderHeader(state);

  renderCommBanner(state);

  renderMotor(state);

  renderProcess(state);

  renderAlarms(state);
}

/* ==========================================================================
   HEADER
   ========================================================================== */

function renderHeader(state) {
  els.backendStatusText.textContent =
    state.backendReachable
      ? 'Conectado'
      : 'Desconectado';

  /*
   * El ESP32 solo se considera conectado
   * si:
   *
   * 1. health dice que está conectado
   * 2. no tenemos una pérdida de comunicación confirmada
   */

  const esp32Ok =
    state.connected !== false &&
    state.esp32Connected === true;

  els.esp32StatusText.textContent =
    esp32Ok
      ? 'Conectado'
      : 'Desconectado';

  els.esp32Dot.className =
    `dot ${
      esp32Ok
        ? 'dot--green'
        : 'dot--red'
    }`;

  els.latencyText.textContent =
    state.latencyMs != null
      ? `${state.latencyMs} ms`
      : '— ms';

  els.modeBadge.textContent =
    `Modo: ${
      state.mode === 'HARDWARE'
        ? 'HARDWARE'
        : 'SIMULACIÓN'
    }`;
}

/* ==========================================================================
   BANNER DE COMUNICACIÓN
   ========================================================================== */

function renderCommBanner(state) {
  const lost =
    state.connected === false;

  els.commBanner.classList.toggle(
    'comm-banner--hidden',
    !lost
  );
}

/* ==========================================================================
   MOTOR
   ========================================================================== */

function renderMotor(state) {

  /*
   * SIN COMUNICACIÓN
   */

  if (state.connected === false) {

    els.motorStatusBadge.textContent =
      'DESCONOCIDO';

    els.motorStatusBadge.classList.remove(
      'badge--running',
      'badge--stopped'
    );

    els.motorStatusBadge.classList.add(
      'badge--unknown'
    );

    els.motorRing.classList.remove(
      'is-running'
    );

    els.motorRing.classList.add(
      'is-unknown'
    );

    els.motorSpeedBig.textContent =
      '—';

    els.motorStateText.textContent =
      'ESTADO DESCONOCIDO';

    els.motorSpeedText.textContent =
      '—';

    els.motorTempText.textContent =
      '— °C';

    els.motorCommText.textContent =
      'SIN COMUNICACIÓN';

    return;
  }

  /*
   * ESTADO NORMAL
   */

  els.motorStatusBadge.classList.remove(
    'badge--unknown'
  );

  els.motorRing.classList.remove(
    'is-unknown'
  );

  /*
   * ENCENDIDO
   */

  if (state.running === true) {

    els.motorStatusBadge.textContent =
      'ENCENDIDO';

    els.motorStatusBadge.classList.remove(
      'badge--stopped'
    );

    els.motorStatusBadge.classList.add(
      'badge--running'
    );

    els.motorRing.classList.add(
      'is-running'
    );

    els.motorStateText.textContent =
      'ENCENDIDO';

  /*
   * DETENIDO
   */

  } else if (
    state.running === false
  ) {

    els.motorStatusBadge.textContent =
      'DETENIDO';

    els.motorStatusBadge.classList.remove(
      'badge--running'
    );

    els.motorStatusBadge.classList.add(
      'badge--stopped'
    );

    els.motorRing.classList.remove(
      'is-running'
    );

    els.motorStateText.textContent =
      'DETENIDO';

  /*
   * ESTADO DESCONOCIDO
   */

  } else {

    els.motorStatusBadge.textContent =
      'DESCONOCIDO';

    els.motorStatusBadge.classList.remove(
      'badge--running',
      'badge--stopped'
    );

    els.motorStatusBadge.classList.add(
      'badge--unknown'
    );

    els.motorRing.classList.remove(
      'is-running'
    );

    els.motorRing.classList.add(
      'is-unknown'
    );

    els.motorStateText.textContent =
      'ESTADO DESCONOCIDO';
  }

  /*
   * VELOCIDAD
   */

  if (state.speed != null) {

    els.motorSpeedBig.textContent =
      `${state.speed}%`;

    els.motorSpeedText.textContent =
      `${state.speed} %`;

  } else {

    els.motorSpeedBig.textContent =
      '—';

    els.motorSpeedText.textContent =
      '—';
  }

  /*
   * TEMPERATURA
   */

  els.motorTempText.textContent =
    state.temperature != null
      ? `${state.temperature} °C`
      : '— °C';

  /*
   * COMUNICACIÓN
   */

  els.motorCommText.textContent =
    'OK';
}

/* ==========================================================================
   VARIABLES DEL PROCESO
   ========================================================================== */

function renderProcess(state) {

  /*
   * SIN COMUNICACIÓN
   */

  if (state.connected === false) {

    els.processSpeed.textContent =
      '—';

    els.processTemp.textContent =
      '— °C';

    els.processAdc.textContent =
      '—';

    els.processRelay.textContent =
      '—';

    els.processBtnStart.textContent =
      '—';

    els.processBtnStop.textContent =
      '—';

    els.tempGaugeMarker.style.left =
      '0%';

    return;
  }

  /*
   * VELOCIDAD
   */

  els.processSpeed.textContent =
    state.speed != null
      ? `${state.speed} %`
      : '—';

  /*
   * TEMPERATURA
   */

  els.processTemp.textContent =
    state.temperature != null
      ? `${state.temperature} °C`
      : '— °C';

  /*
   * POTENCIÓMETRO ADC
   */

  els.processAdc.textContent =
    state.potentiometerAdc != null
      ? `${state.potentiometerAdc}`
      : '—';

  /*
   * RELEVADOR
   */

  if (state.relay != null) {

    els.processRelay.textContent =
      state.relay
        ? 'ACTIVADO'
        : 'DESACTIVADO';

  } else {

    els.processRelay.textContent =
      '—';
  }

  /*
   * PULSADOR START
   */

  els.processBtnStart.textContent =
    state.startButton != null
      ? `${state.startButton}`
      : '—';

  /*
   * PULSADOR STOP
   */

  els.processBtnStop.textContent =
    state.stopButton != null
      ? `${state.stopButton}`
      : '—';

  /*
   * MARCADOR DE TEMPERATURA
   */

  if (
    state.temperature != null &&
    Number.isFinite(
      Number(state.temperature)
    )
  ) {

    const temperature =
      Math.max(
        0,
        Math.min(
          100,
          Number(state.temperature)
        )
      );

    els.tempGaugeMarker.style.left =
      `${temperature}%`;

  } else {

    els.tempGaugeMarker.style.left =
      '0%';
  }
}

/* ==========================================================================
   ALARMAS
   ========================================================================== */

function renderAlarms(state) {
  const alarms =
    Array.isArray(state.alarms)
      ? state.alarms
      : [];

  const history =
    Array.isArray(state.history)
      ? state.history
      : [];

  /*
   * SIN ALARMAS
   */

  if (alarms.length === 0) {

    els.alarmBanner.classList.remove(
      'alarm-banner--warning',
      'alarm-banner--critical'
    );

    els.alarmBanner.classList.add(
      'alarm-banner--ok'
    );

    els.alarmBannerText.textContent =
      'Sin alarmas activas';

  } else {

    /*
     * Buscar CRITICAL
     */

    const critical =
      alarms.find(
        (alarm) =>
          alarm.severity ===
          'CRITICAL'
      );

    /*
     * Buscar WARNING
     */

    const warning =
      alarms.find(
        (alarm) =>
          alarm.severity ===
          'WARNING'
      );

    if (critical) {

      els.alarmBanner.classList.remove(
        'alarm-banner--ok',
        'alarm-banner--warning'
      );

      els.alarmBanner.classList.add(
        'alarm-banner--critical'
      );

      els.alarmBannerText.textContent =
        critical.message ||
        'Alarma crítica';

    } else if (warning) {

      els.alarmBanner.classList.remove(
        'alarm-banner--ok',
        'alarm-banner--critical'
      );

      els.alarmBanner.classList.add(
        'alarm-banner--warning'
      );

      els.alarmBannerText.textContent =
        warning.message ||
        'Advertencia';

    } else {

      els.alarmBanner.classList.remove(
        'alarm-banner--warning',
        'alarm-banner--critical'
      );

      els.alarmBanner.classList.add(
        'alarm-banner--ok'
      );

      els.alarmBannerText.textContent =
        'Sin alarmas activas';
    }
  }

  /*
   * HISTORIAL
   */

  if (history.length === 0) {

    els.eventHistory.innerHTML =
      `
      <li class="event-history__item">
        <span class="event-history__time">—</span>
        <span class="event-history__text">
          Sin eventos todavía.
        </span>
      </li>
      `;

    return;
  }

  els.eventHistory.innerHTML =
    history
      .slice(0, 20)
      .map((event) => {

        const time =
          event.timestamp
            ? new Date(
                event.timestamp
              ).toLocaleTimeString(
                'es-MX',
                {
                  hour12: false,
                }
              )
            : '—';

        return `
          <li class="event-history__item">
            <span class="event-history__time">
              ${escapeHtml(time)}
            </span>

            <span class="event-history__text">
              ${escapeHtml(
                event.message || ''
              )}
            </span>
          </li>
        `;
      })
      .join('');
}

/* ==========================================================================
   SEGURIDAD HTML
   ========================================================================== */

function escapeHtml(text) {
  return String(text)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    );
}