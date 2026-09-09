# Actividad 1 — Completar `sendCommand()` en `api.js`

## Objetivo

Hacer que el frontend sepa enviar un `POST /api/device/command` de verdad.

## Requisitos previos

Práctica 2 completada.

## Contexto

`api.js` ya tiene un helper `request(path, options)` completamente resuelto (con timeout incluido) y tres
funciones GET (`getStatus`, `getAlarms`, `getHealth`) que ya lo usan como ejemplo. `sendCommand()` es la
única función de este archivo que falta, y es la más importante: literalmente arma y envía el JSON del
comando (ver `shared/json/protocolo.md`).

## Código de partida

`frontend/js/api.js`, función `sendCommand(command)`.

## Pasos

1. Abre `api.js` y localiza `sendCommand()` — ahora mismo solo imprime un error en consola y devuelve una
   respuesta vacía.
2. Reemplázala por un `return request(...)` que llame a `POST /api/device/command` con:
   - `method: 'POST'`
   - `headers: { 'Content-Type': 'application/json' }`
   - `body: JSON.stringify(command)`
3. Fíjate en cómo `setScenario()`, más abajo en el mismo archivo, hace exactamente esto mismo para otro
   endpoint — es un ejemplo casi calcado.

## Cómo probarlo

Con el backend corriendo, abre la consola del navegador (F12) y ejecuta directamente:

```js
fetch('/api/device/command', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ device: 'motor1', action: 'START', value: null }),
}).then((r) => r.json()).then(console.log);
```

Esto no usa tu código todavía — es solo para confirmar que el backend responde como esperas antes de
integrar tu `sendCommand()`.

## Criterios de aceptación

- [ ] La pestaña Red/Network del navegador muestra una solicitud `POST /api/device/command` con el cuerpo
      correcto cuando algo llama a `api.sendCommand(...)`.
- [ ] La consola ya NO muestra el mensaje `TODO: falta implementar sendCommand()`.
- [ ] La función devuelve `{ ok, status, body }`, igual que las demás funciones de `api.js`.

## Preguntas de reflexión

1. ¿Por qué `sendCommand()` no necesita su propio manejo de timeout, si `request()` ya lo tiene?
2. ¿Qué pasaría si olvidaras el header `Content-Type: application/json`? (Pista: revisa qué espera
   `express.json()` en `backend/src/app.js`.)

## Entregable

`api.js` con `sendCommand()` completa.

## Rúbrica

| Criterio | Puntos |
|---|---|
| `sendCommand()` construida correctamente | 6 |
| Se confirma con la pestaña Red del navegador | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
