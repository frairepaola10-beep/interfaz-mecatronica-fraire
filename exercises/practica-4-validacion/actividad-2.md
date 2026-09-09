# Actividad 2 — Rechazar un dispositivo desconocido

## Objetivo

Agregar la comprobación de que `device` sea uno de los dispositivos que el sistema realmente conoce.

## Requisitos previos

Actividad 1 completada.

## Contexto

`backend/src/schemas/command.schema.js` define `VALID_DEVICES`, un arreglo con el único dispositivo de este
proyecto: `"motor1"`. Cualquier otro valor (`"motor2"`, `"MOTOR1"` con mayúsculas, etc.) debe rechazarse,
aunque el JSON esté perfectamente bien formado.

## Código de partida

`validateCommand()`, justo después de las dos comprobaciones de la Actividad 1. `VALID_DEVICES` ya está
importado al inicio del archivo.

## Pasos

Agrega:

```js
if (!VALID_DEVICES.includes(device)) {
  return reject(res, `Dispositivo desconocido: "${device}".`);
}
```

## Cómo probarlo

```bash
curl -i -X POST http://localhost:3000/api/device/command \
  -H "Content-Type: application/json" -d '{"device":"motor2","action":"START","value":null}'
```

## Criterios de aceptación

- [ ] La solicitud anterior responde `400` con `error: "INVALID_COMMAND"`.
- [ ] Un comando con `device: "motor1"` (el válido) sigue pasando esta comprobación sin rechazarse aquí
      (puede seguir rechazándose más adelante si `action` no es válida — eso es normal en este punto).

## Preguntas de reflexión

1. Este proyecto solo tiene un dispositivo. ¿Qué cambiarías en `command.schema.js` (no en
   `validateCommand.js`) si mañana se agregara un segundo motor, `"motor2"`? ¿Por qué esa separación entre
   "qué es válido" y "cómo se valida" es útil?
2. `VALID_DEVICES.includes(device)` distingue mayúsculas de minúsculas. ¿Debería el protocolo ser
   sensible a mayúsculas/minúsculas en los identificadores de dispositivo? Justifica tu opinión.

## Entregable

`validateCommand.js` con la comprobación de dispositivo agregada.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Comprobación de dispositivo correcta | 6 |
| Preguntas de reflexión | 4 |
| **Total** | **10** |
