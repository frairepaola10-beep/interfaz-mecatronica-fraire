# Actividad 1 — Rechazar un comando con un campo faltante

## Objetivo

Implementar las dos primeras comprobaciones de `validateCommand()`: que `device` y `action` existan y sean
texto.

## Requisitos previos

Práctica 3 completada.

## Contexto

El README del proyecto (sección 9) da el ejemplo exacto de un JSON inválido: `{"device": "motor1", "action":
"VOLAR"}` (sin `value`, aunque eso no es lo que lo hace inválido — lo veremos en la Actividad 3). Esta
actividad se enfoca en el caso más simple: que falte `device` o `action` por completo, o que no sean texto.

## Código de partida

`backend/src/middleware/validateCommand.js`, función `validateCommand(req, res, next)`.

## Pasos

1. Reemplaza la línea `return reject(res, 'TODO: ...')` por las dos primeras comprobaciones:
   ```js
   if (typeof device !== 'string' || device.length === 0) {
     return reject(res, 'Falta el campo "device" o no es un texto válido.');
   }
   if (typeof action !== 'string' || action.length === 0) {
     return reject(res, 'Falta el campo "action" o no es un texto válido.');
   }
   ```
2. Todavía no descomentes las líneas finales (`req.command = ...; next();`) — hazlo hasta la Actividad 5,
   cuando la validación esté completa.

## Cómo probarlo

```bash
curl -i -X POST http://localhost:3000/api/device/command \
  -H "Content-Type: application/json" -d '{"action":"START"}'
```

## Criterios de aceptación

- [ ] La solicitud anterior responde `400` con `{"success": false, "error": "INVALID_COMMAND", "details": "..."}`.
- [ ] Un comando sin `action` (pero con `device`) también se rechaza con un mensaje distinto y específico.
- [ ] Un comando con `device: 123` (número, no texto) también se rechaza.

## Preguntas de reflexión

1. ¿Por qué se valida `device`/`action` con `typeof ... !== 'string'` en vez de solo `!device`? Piensa en
   qué pasaría con `device: ""` (cadena vacía) o `device: 0`.
2. ¿Qué le pasaría al historial de alarmas (`alarm.service.js`) cada vez que se rechaza un comando? Revisa
   la función `reject()` al final del archivo.

## Entregable

`validateCommand.js` con las dos primeras comprobaciones implementadas.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Comprobación de `device` correcta | 4 |
| Comprobación de `action` correcta | 4 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
