# Actividad 3 — Rechazar una acción no permitida

## Objetivo

Agregar la comprobación de que `action` sea una de las cuatro acciones que el sistema entiende.

## Requisitos previos

Actividad 2 completada.

## Contexto

Este es exactamente el ejemplo del README del proyecto, sección 9: `{"device": "motor1", "action": "VOLAR"}`
debe rechazarse. `VALID_ACTIONS` en `command.schema.js` es un objeto (no un arreglo) cuyas claves son
`START`, `STOP`, `SET_SPEED` y `GET_STATUS` — cada una con información sobre si requiere `value`.

## Código de partida

`validateCommand()`, después de la comprobación de dispositivo.

## Pasos

Agrega:

```js
const actionSpec = VALID_ACTIONS[action];
if (!actionSpec) {
  return reject(res, `Acción no permitida: "${action}". Use START, STOP, SET_SPEED o GET_STATUS.`);
}
```

Guarda `actionSpec` — lo vas a usar en la Actividad 4 para saber si esa acción requiere `value` y con qué
rango.

## Cómo probarlo

```bash
curl -i -X POST http://localhost:3000/api/device/command \
  -H "Content-Type: application/json" -d '{"device":"motor1","action":"VOLAR"}'
```

## Criterios de aceptación

- [ ] La solicitud anterior responde `400` con `error: "INVALID_COMMAND"`.
- [ ] `action: "start"` (minúsculas) también se rechaza — el protocolo es sensible a mayúsculas/minúsculas.
- [ ] Las cuatro acciones válidas (`START`, `STOP`, `SET_SPEED`, `GET_STATUS`) NO se rechazan en este punto.

## Preguntas de reflexión

1. ¿Por qué `VALID_ACTIONS` es un objeto `{ START: {...}, STOP: {...}, ... }` en vez de un arreglo simple
   como `VALID_DEVICES`? ¿Qué información extra necesita guardar por cada acción?
2. Compara esta comprobación con la de la Actividad 2. ¿Por qué el orden importa — es decir, por qué
   conviene validar el dispositivo antes que la acción?

## Entregable

`validateCommand.js` con la comprobación de acción agregada.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Comprobación de acción correcta | 6 |
| Preguntas de reflexión | 4 |
| **Total** | **10** |
