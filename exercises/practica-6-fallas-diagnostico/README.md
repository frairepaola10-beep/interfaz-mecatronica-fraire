# Práctica 6 — Fallas y diagnóstico

## Objetivo

Completar el último TODO pendiente del proyecto (`communication.service.js`, detección de `COMM_LOST` y
`TIMEOUT`) y, con eso, cerrar el ciclo: provocar deliberadamente cada condición anormal del sistema y
confirmar que la interfaz la muestra con claridad.

## Requisitos previos

Prácticas 1 a 5 completadas. Esta práctica funciona tanto en Modo Simulación como en Modo Hardware.

## Contexto

Con las prácticas anteriores, tu proyecto ya debería comportarse igual que la versión de referencia del
profesor en casi todo.
Esta práctica primero cierra la única pieza que falta (`communication.service.js`) y luego usa
`POST /api/simulation/scenario` para poner a prueba **todo el proyecto junto**: frontend, backend y (si
tienes hardware) firmware.

## Endpoint de simulación de fallas

```bash
curl -X POST http://localhost:3000/api/simulation/scenario \
  -H "Content-Type: application/json" -d '{"scenario":"<NOMBRE>"}'
```

Escenarios disponibles: `NORMAL`, `TEMP_HIGH`, `TEMP_CRITICAL`, `COMM_LOST`, `DEVICE_FAULT`, `SENSOR_FAULT`,
`TIMEOUT` (ver `backend/src/mocks/scenarios.js`).

## Actividades

| Actividad | Falla a simular |
|---|---|
| [Actividad 1](actividad-1.md) | Desconexión del ESP32 (`COMM_LOST`) |
| [Actividad 2](actividad-2.md) | Pérdida de respuesta / timeout (`TIMEOUT`) |
| [Actividad 3](actividad-3.md) | Sensor fuera de rango (`SENSOR_FAULT`) |
| [Actividad 4](actividad-4.md) | Temperatura elevada y alarma crítica (`TEMP_HIGH` / `TEMP_CRITICAL`) |
| [Actividad 5](actividad-5.md) | Comando incorrecto |
| [Actividad 6](actividad-6.md) | Diagnóstico integral (capstone) |
