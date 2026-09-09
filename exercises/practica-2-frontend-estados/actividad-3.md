# Actividad 3 — `connected: false` → SIN COMUNICACIÓN

## Objetivo

Completar la rama de "desconectado" en `renderMotor()` y `renderProcess()`, para que ningún valor se
muestre como si siguiera vigente cuando se perdió la comunicación.

## Requisitos previos

Actividad 2 completada.

## Contexto

Esta es la parte más importante de toda la práctica: la "Regla fundamental de la interfaz" (README del
proyecto, sección 23) dice que la interfaz debe representar el estado **confirmado**, nunca inventar uno.
Cuando `state.connected === false`, el backend ya reporta `running`, `speed` y `temperature` como `null`
(ver `shared/json/response-error.json`) — el trabajo de `ui.js` es mostrar eso como `"—"`, no como el último
valor que sí conocía.

## Código de partida

`renderMotor()` y `renderProcess()` en `ui.js` (misma función que empezaste en la Actividad 2).

## Pasos

1. En `renderMotor()`, agrega el caso `disconnected = state.connected === false`:
   - badge "DESCONOCIDO", clase `badge--unknown`.
   - `motorStateText` = "ESTADO DESCONOCIDO".
   - `motorSpeedText`/`motorTempText` = `"—"` / `"— °C"`.
   - `motorCommText` = "SIN COMUNICACIÓN" (si está conectado, "OK").
2. En `renderProcess()`, aplica el mismo criterio a velocidad, temperatura, ADC, relevador y pulsadores.

## Cómo probarlo

```bash
curl -X POST http://localhost:3000/api/simulation/scenario \
  -H "Content-Type: application/json" -d '{"scenario":"COMM_LOST"}'
```

## Criterios de aceptación

- [ ] Con el escenario `COMM_LOST` forzado, la pantalla muestra "SIN COMUNICACIÓN" y "DESCONOCIDO" en menos
      de 2 segundos.
- [ ] Ningún campo numérico (velocidad, temperatura, ADC) muestra el último valor que tenía antes de perder
      la comunicación: todos pasan a `"—"`.
- [ ] Al volver a `{"scenario":"NORMAL"}`, la pantalla se recupera sola.

## Preguntas de reflexión

1. ¿Por qué sería incorrecto que, al perder la comunicación, `ui.js` simplemente dejara de actualizar la
   pantalla (en vez de mostrar "—")? ¿Qué información falsa le estaría dando al operador?
2. `state.connected` puede ser `null` (aún no se sabe) o `false` (se sabe que está desconectado). ¿Debería
   tu código tratarlos igual? Revisa cómo lo hace `renderHeader()`, que ya está resuelta.

## Entregable

`ui.js` actualizado, más una captura de pantalla del estado "SIN COMUNICACIÓN".

## Rúbrica

| Criterio | Puntos |
|---|---|
| Ningún valor "fantasma" se muestra al desconectar | 6 |
| Se recupera correctamente al reconectar | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
