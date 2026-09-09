# Actividad 2 — `running` → ENCENDIDO / DETENIDO

## Objetivo

Completar `renderMotor()` en `frontend/js/ui.js` para que el estado del motor se muestre en texto legible.

## Requisitos previos

Práctica 1 completada. Actividad 1 de esta práctica completada — vas a usar el panel "JSON RECIBIDO" que
armaste ahí para confirmar visualmente que esta actividad quedó bien.

## Contexto

`state.running` llega como `true`, `false` o `null` (cuando no se sabe). El HTML ya trae los elementos
`data-bind="motorStatusBadge"`, `data-bind="motorStateText"` y `data-bind="motorRing"` listos para recibir
esos valores — solo falta la lógica en `ui.js` que decide qué texto y qué clase CSS poner en cada uno.

## Código de partida

`frontend/js/ui.js`, función `renderMotor(state)` (vacía, con un comentario `TODO` arriba
que detalla los elementos y clases disponibles).

## Pasos

1. Abre `frontend/js/ui.js` y localiza `renderMotor()`.
2. Complétala para que, cuando `state.connected` no sea `false`:
   - `state.running === true` → badge "ENCENDIDO", clase `badge--running`, anillo con clase `is-running`.
   - `state.running === false` → badge "DETENIDO", clase `badge--stopped`, sin `is-running`.
3. Actualiza también `motorStateText`, `motorSpeedText` y `motorTempText` con los valores de `state.speed` y
   `state.temperature`.

## Cómo probarlo

```bash
cd backend && npm start
```

En otra terminal:

```bash
curl -X POST http://localhost:3000/api/device/command \
  -H "Content-Type: application/json" \
  -d '{"device":"motor1","action":"START","value":null}'
```

(Esto usa `curl` directamente porque los botones de la interfaz — Práctica 3 — todavía no envían nada.)

## Criterios de aceptación

- [ ] Después del comando anterior, la pantalla muestra "ENCENDIDO" en menos de 2 segundos (sin recargar la
      página).
- [ ] El anillo del motor cambia de color/gira (según tu CSS) cuando está encendido.
- [ ] Enviar el mismo comando con `"action":"STOP"` hace que la pantalla vuelva a mostrar "DETENIDO".

## Preguntas de reflexión

1. ¿Por qué `renderMotor()` recibe el objeto `state` completo en vez de recibir directamente
   `state.running` como parámetro?
2. ¿Qué otro archivo del frontend decide **cuándo** se llama a `renderMotor()`? (Pista: busca dónde se
   suscribe `ui.applyState`.)

## Entregable

El archivo `ui.js` con `renderMotor()` completada (al menos la parte de `running`), más una captura de
pantalla mostrando ENCENDIDO y otra mostrando DETENIDO.

## Rúbrica

| Criterio | Puntos |
|---|---|
| ENCENDIDO/DETENIDO correctos con clases CSS correctas | 6 |
| Velocidad y temperatura se muestran correctamente | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
