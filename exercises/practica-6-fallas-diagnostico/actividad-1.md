# Actividad 1 — Desconexión del ESP32 (`COMM_LOST`)

## Objetivo

Completar la primera mitad del último TODO del proyecto: detectar `COMM_LOST` en
`communication.service.js`.

## Requisitos previos

Prácticas 1 a 5 completadas.

## Contexto

Esta es la única pieza de lógica de comunicación que quedaba pendiente en todo el backend. Cuando el
escenario forzado es `COMM_LOST`, `sendToSimulation()` debe devolver de inmediato una respuesta de "sin
conexión", sin ejecutar el comando sobre el motor virtual.

## Código de partida

`backend/src/services/communication.service.js`, dentro de `sendToSimulation()`, el bloque
marcado con el `TODO` extenso.

## Pasos

Agrega, antes del "camino normal":

```js
if (scenario === 'COMM_LOST') {
  return { connected: false, latencyMs: null, state: null, deviceFault: null };
}
```

(Deja el caso `TIMEOUT` para la Actividad 2 — es el mismo bloque de código, pero esta actividad se enfoca
solo en `COMM_LOST`.)

## Cómo probarlo

```bash
curl -X POST http://localhost:3000/api/simulation/scenario \
  -H "Content-Type: application/json" -d '{"scenario":"COMM_LOST"}'
```

## Criterios de aceptación

- [ ] `cd backend && npm test` — el caso `COMM_LOST` de `alarms.test.js` pasa.
- [ ] `GET /api/device/status` responde `503` con `success: false` y una alarma `COMM_LOST`/`CRITICAL`.
- [ ] Desde la interfaz, en menos de 2 segundos: banner rojo "COMM_LOST", ESP32 "Desconectado", motor
      "ESTADO DESCONOCIDO", y los botones de control deshabilitados.
- [ ] Al volver a `{"scenario":"NORMAL"}`, todo se recupera solo, sin recargar la página.

## Preguntas de reflexión

1. ¿Por qué `sendToSimulation()` devuelve inmediatamente en el caso `COMM_LOST`, sin siquiera llamar a
   `applyCommand()`? ¿Qué pasaría si el comando SÍ se aplicara antes de reportar la desconexión?
2. Si esto fuera Modo Hardware en vez de Simulación, ¿qué línea de código real jugaría este mismo papel?
   (Pista: revisa `sendToHardware()`, en el mismo archivo.)

## Entregable

`communication.service.js` con el caso `COMM_LOST` completo, más una captura de pantalla del estado de
desconexión en la interfaz.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Caso `COMM_LOST` correcto (pasa el test correspondiente) | 6 |
| Interfaz refleja la desconexión correctamente | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
