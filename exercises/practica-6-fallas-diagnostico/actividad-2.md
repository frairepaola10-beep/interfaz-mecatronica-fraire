# Actividad 2 — Pérdida de respuesta / timeout (`TIMEOUT`)

## Objetivo

Completar la segunda mitad del TODO de `communication.service.js`: simular que el dispositivo "se queda
pensando" más tiempo del que el backend está dispuesto a esperar.

## Requisitos previos

Actividad 1 completada (mismo bloque de código, mismo archivo).

## Contexto

`TIMEOUT` es distinto de `COMM_LOST`: aquí el backend sí "espera" — solo que espera más de lo razonable, y
entonces decide que no va a llegar respuesta. Por eso esta rama usa `await delay(...)` antes de devolver el
mismo resultado que `COMM_LOST`.

## Código de partida

El mismo bloque de `sendToSimulation()` que empezaste en la Actividad 1. La función `delay(ms)` ya existe al
final del archivo.

## Pasos

Agrega, justo después del caso `COMM_LOST`:

```js
if (scenario === 'TIMEOUT') {
  await delay(config.COMMAND_TIMEOUT_MS + 500);
  return { connected: false, latencyMs: null, state: null, deviceFault: null };
}
```

## Cómo probarlo

```bash
curl -X POST http://localhost:3000/api/simulation/scenario \
  -H "Content-Type: application/json" -d '{"scenario":"TIMEOUT"}'

# Mide cuánto tarda en responder:
time curl http://localhost:3000/api/device/status
```

## Criterios de aceptación

- [ ] La solicitud `GET /api/device/status` tarda notablemente más (revisa `COMMAND_TIMEOUT_MS` en
      `backend/src/config/index.js`) antes de responder, en vez de fallar de inmediato.
- [ ] La respuesta final es igual a la de `COMM_LOST`: `success: false`, alarma `COMM_LOST`.
- [ ] Desde la interfaz, presionar ARRANCAR con este escenario forzado muestra la fase "Esperando
      confirmación del ESP32..." durante ese tiempo extra, antes de mostrar el fallo.

## Preguntas de reflexión

1. ¿Por qué el proyecto decidió simular la espera real (`await delay(...)`) en vez de simplemente devolver
   el error de inmediato, como hace `COMM_LOST`? ¿Qué estarías perdiendo pedagógicamente si no esperaras?
2. `REQUEST_TIMEOUT_MS` (frontend, en `config.js`) es mayor que `COMMAND_TIMEOUT_MS` (backend). ¿Qué pasaría
   si fuera al revés — si el frontend se rindiera ANTES que el backend?

## Entregable

`communication.service.js` completo (los dos casos, `COMM_LOST` y `TIMEOUT`), más la salida de `time curl`
mostrando la espera.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Caso `TIMEOUT` correcto, con la espera real | 6 |
| Verificación con `time curl` | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
