# Actividad 5 — Dejar pasar un comando válido y confirmar el formato de error uniforme

## Objetivo

Terminar `validateCommand()`: dejar pasar los comandos válidos hacia el controller, y confirmar que todos
los rechazos (de las 4 actividades anteriores) comparten exactamente el mismo formato de error.

## Requisitos previos

Actividades 1 a 4 completadas.

## Contexto

Hasta ahora, `validateCommand()` termina siempre en un `reject(...)` — incluso los comandos válidos son
rechazados, porque la función nunca llega a `next()`. Esta actividad cierra el ciclo.

## Código de partida

El final de `validateCommand()`, donde están las líneas comentadas:

```js
// req.command = { device, action, value: value ?? null };
// next();
```

## Pasos

1. Elimina por completo la línea `return reject(res, 'TODO: ...')` que había al inicio de la función (ya no
   hace falta: ahora cada caso de error tiene su propio `reject(...)` específico de las actividades
   anteriores).
2. Descomenta las dos líneas finales, para que un comando que pasó las cuatro comprobaciones anteriores
   quede normalizado en `req.command` y continúe hacia el controller con `next()`.

## Cómo probarlo

```bash
cd backend
npm test
```

## Criterios de aceptación

- [ ] `npm test` — `validation.test.js` pasa completo (los 6 casos).
- [ ] Un comando totalmente válido (`{"device":"motor1","action":"START","value":null}`) responde `200`
      con `success: true`.
- [ ] Los 5 casos de rechazo de las actividades anteriores siguen respondiendo `400` con la misma forma:
      `{"success": false, "error": "INVALID_COMMAND", "details": "..."}`.
- [ ] Desde la interfaz (Práctica 3), enviar un comando inválido a propósito (por ejemplo, editando
      momentáneamente `app.js`) muestra el rechazo también en el panel "JSON RECIBIDO".

## Preguntas de reflexión

1. ¿Por qué es valioso que **todos** los rechazos usen la misma forma de respuesta (`success`, `error`,
   `details`), en vez de que cada comprobación devuelva un formato distinto?
2. `validateCommand.js` es un *middleware* de Express. ¿Qué significa exactamente que reciba `next` como
   tercer parámetro, y qué pasaría si nunca lo llamaras (en el caso de un comando válido)?

## Entregable

`validateCommand.js` completo y funcional, con captura de pantalla de `npm test` en verde.

## Rúbrica

| Criterio | Puntos |
|---|---|
| `npm test` pasa completo (`validation.test.js`) | 6 |
| Formato de error uniforme confirmado en los 5 casos | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
