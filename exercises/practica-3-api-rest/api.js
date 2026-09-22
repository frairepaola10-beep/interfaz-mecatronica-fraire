
import { API_BASE, REQUEST_TIMEOUT_MS } from './config.js';

async function request(path, options = {}) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
    });

    const body = await res.json().catch(() => null);

    return {
      ok: res.ok,
      status: res.status,
      body,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: null,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function sendCommand(command) {
  return request('/api/device/command', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
}

export function getStatus() {
  return request('/api/device/status');
}

export function getAlarms() {
  return request('/api/device/alarms');
}

export function getHealth() {
  return request('/api/health');
}

export function setScenario(scenario) {
  return request('/api/simulation/scenario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scenario,
    }),
  });
}
