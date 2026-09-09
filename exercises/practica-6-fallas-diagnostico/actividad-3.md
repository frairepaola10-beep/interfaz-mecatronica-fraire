# Actividad 3 — Sensor fuera de rango (`SENSOR_FAULT`)

## Objetivo

Confirmar que el trabajo ya hecho en prácticas anteriores (sin escribir código nuevo) también resuelve
correctamente el caso de un sensor que reporta un valor imposible de interpretar.

## Requisitos previos

Práctica 2 (Actividad 2) completada.

## Contexto

Esta actividad es distinta a las dos anteriores: **no hay ningún TODO que completar aquí**. Cuando el
escenario forzado es `SENSOR_FAULT`, `simulator.service.js` ya reporta `temperature: null` (revisa
`getState()` en ese archivo — no es un TODO, ya viene resuelto), y tu `renderMotor()`/`renderProcess()` de
la Práctica 2 ya deberían mostrar `"—"` para cualquier valor `null`, sin importar la causa. El objetivo de
esta actividad es precisamente **comprobar** eso.

## Cómo probarlo

```bash
curl -X POST http://localhost:3000/api/simulation/scenario \
  -H "Content-Type: application/json" -d '{"scenario":"SENSOR_FAULT"}'
```

## Criterios de aceptación

- [ ] La temperatura se muestra como `"— °C"` en pantalla, aunque `state.connected` siga siendo `true` (a
      diferencia de `COMM_LOST`, aquí SÍ hay comunicación — solo que el sensor específico falló).
- [ ] El motor puede seguir mostrándose "ENCENDIDO" si estaba corriendo — `SENSOR_FAULT` no afecta
      `running` ni `speed`, solo `temperature`.
- [ ] `GET /api/device/status` responde `success: true` (la comunicación funciona), con
      `state.temperature: null`.

## Preguntas de reflexión

1. Si tu código de la Práctica 2 pasó esta actividad sin ningún cambio, ¿qué decisión de diseño de
   `renderMotor()`/`renderProcess()` fue la que lo permitió? (Pista: piensa en qué condición usaste para
   decidir mostrar `"—"`.)
2. ¿En qué se diferencia, en el JSON de respuesta, `SENSOR_FAULT` de `COMM_LOST`? Compara los dos objetos
   `communication` y `state` de ambos casos.

## Entregable

Captura de pantalla mostrando temperatura `"—"` con el motor encendido y comunicación en OK.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Temperatura se muestra correctamente como `"—"` sin afectar el resto del estado | 6 |
| Preguntas de reflexión | 4 |
| **Total** | **10** |
