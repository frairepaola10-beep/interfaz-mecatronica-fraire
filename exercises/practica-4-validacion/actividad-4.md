# Actividad 4 — Rechazar un `value` de tipo o rango incorrecto

## Objetivo

Completar la comprobación más detallada de las cinco: que `value` tenga el tipo y rango correctos según la
acción.

## Requisitos previos

Actividad 3 completada (usa el `actionSpec` que obtuviste ahí).

## Contexto

`SET_SPEED` es la única acción con `requiresValue: true` (y trae `valueMin`/`valueMax` en su definición
dentro de `command.schema.js`). Las demás acciones (`START`, `STOP`, `GET_STATUS`) tienen
`requiresValue: false`, así que **no deberían** traer un `value` distinto de `null`/`undefined`.

## Código de partida

`validateCommand()`, después de la comprobación de acción (Actividad 3), usando `actionSpec`.

## Pasos

Agrega:

```js
if (actionSpec.requiresValue) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return reject(res, `La acción "${action}" requiere un "value" numérico.`);
  }
  if (value < actionSpec.valueMin || value > actionSpec.valueMax) {
    return reject(res, `"value" debe estar entre ${actionSpec.valueMin} y ${actionSpec.valueMax}.`);
  }
} else if (value !== null && value !== undefined) {
  return reject(res, `La acción "${action}" no admite el campo "value".`);
}
```

## Cómo probarlo

```bash
# Fuera de rango
curl -i -X POST http://localhost:3000/api/device/command \
  -H "Content-Type: application/json" -d '{"device":"motor1","action":"SET_SPEED","value":150}'

# Tipo incorrecto
curl -i -X POST http://localhost:3000/api/device/command \
  -H "Content-Type: application/json" -d '{"device":"motor1","action":"SET_SPEED","value":"rapido"}'
```

## Criterios de aceptación

- [ ] Ambas solicitudes de arriba responden `400` con `error: "INVALID_COMMAND"`.
- [ ] `SET_SPEED` con `value: 50` (válido) NO se rechaza en este punto.
- [ ] `START` con un `value` distinto de `null` (por ejemplo `value: 10`) se rechaza.

## Preguntas de reflexión

1. `Number.isNaN(value)` es distinto de `isNaN(value)` en JavaScript. Investiga la diferencia — ¿por qué se
   usó la versión de `Number` aquí?
2. ¿Qué pasaría si un comando llegara con `value: 50.5` para `SET_SPEED`? ¿El protocolo actual lo permite?
   ¿Debería?

## Entregable

`validateCommand.js` con la comprobación de `value` agregada.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Caso `requiresValue: true` (tipo y rango) correcto | 5 |
| Caso `requiresValue: false` (no debe traer value) correcto | 3 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
