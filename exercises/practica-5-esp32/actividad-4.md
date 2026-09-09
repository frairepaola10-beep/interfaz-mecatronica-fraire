# Actividad 4 — Lectura de sensores y control de actuadores reales

## Objetivo

Confirmar, con hardware físico, que el ESP32 lee el potenciómetro y los pulsadores, y controla el relevador
y el buzzer correctamente.

## Requisitos previos

Actividades 2 y 3 completadas. Potenciómetro, dos pulsadores, relevador y buzzer conectados según
`docs/hardware.md`.

## Contexto

`sensors.h` y `actuators.h` ya vienen completos en la plantilla (no son un TODO de esta práctica) — esta
actividad es de **verificación física**, no de código: confirmar que tu cableado coincide con lo que el
firmware espera.

## Pasos

1. Gira el potenciómetro y observa `state.potentiometerAdc` en la respuesta de `GET_STATUS` — debe cambiar
   entre 0 y 4095.
2. Presiona el pulsador de arranque local y confirma que `state.startButton` cambia a `"PRESIONADO"`.
3. Envía `SET_SPEED` con un valor alto (por ejemplo 90) y luego `START`: si tu `config.h` tiene
   `USE_DHT = 1` con un sensor real conectado, la temperatura debería subir con el tiempo; si sigue en
   `USE_DHT = 0`, debería subir igual pero de forma simulada (ver `sensors.h`).
4. Verifica que el relevador (`state.relay`) se active cuando el motor está encendido.

## Criterios de aceptación

- [ ] `potentiometerAdc` cambia al girar el potenciómetro físico.
- [ ] `startButton`/`stopButton` cambian a `"PRESIONADO"` al presionar cada pulsador y vuelven a `"LIBRE"`
      al soltarlos.
- [ ] El relevador físico hace "clic" (o su LED indicador se enciende) cuando `state.running` es `true`.
- [ ] Si `temperature` supera `TEMP_CRITICAL_THRESHOLD` (config.h), el LED rojo y el buzzer se activan
      físicamente, sin depender de ninguna respuesta del backend (revisa `buildStatusResponse()`: esto ya
      viene resuelto).

## Preguntas de reflexión

1. El LED rojo/buzzer de alarma se activan directamente en `buildStatusResponse()`, sin esperar a que el
   backend confirme nada. ¿Por qué el proyecto decidió hacerlo así en vez de esperar la orden del backend?
2. ¿Qué pasaría si el pulsador físico de arranque se presiona al mismo tiempo que llega un comando `STOP`
   desde el backend? (No hace falta resolverlo — solo describe el conflicto.)

## Entregable

Un video corto (o serie de fotos) mostrando cada uno de los cuatro criterios de aceptación.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Potenciómetro y pulsadores verificados | 4 |
| Relevador verificado | 3 |
| LED/buzzer de alarma verificados | 2 |
| Preguntas de reflexión | 1 |
| **Total** | **10** |
