# Actividad 4 — `severity: WARNING` → advertencia visible

## Objetivo

Completar `evaluateTemperature()` en el backend (para que la alarma exista) y `renderAlarms()` en el
frontend (para que se muestre), enfocándose en el caso `WARNING`.

## Requisitos previos

Actividades 1 y 2 completadas.

## Contexto

Aquí se cruzan backend y frontend: aunque `ui.js` esté perfecta, no hay ninguna alarma que mostrar si
`backend/src/services/alarm.service.js#evaluateTemperature()` sigue devolviendo `[]` siempre (así viene en
la plantilla). Vas a completar esa función primero — es corta, pero es la Práctica 6 empezando a asomarse:
decide, según los umbrales de `backend/src/config/index.js`, si la temperatura amerita una alarma.

## Código de partida

- `backend/src/services/alarm.service.js`, función `evaluateTemperature(temperature)`.
- `frontend/js/ui.js`, función `renderAlarms(state)`.

## Pasos

1. En `alarm.service.js`, completa `evaluateTemperature()` siguiendo el `TODO` del archivo: debe devolver
   `[]` si la temperatura es normal, un objeto `TEMP_HIGH`/`WARNING` si supera `TEMP_WARNING_THRESHOLD`, y
   `TEMP_CRITICAL`/`CRITICAL` si supera `TEMP_CRITICAL_THRESHOLD` (evalúa el umbral crítico primero).
2. En `renderAlarms()`, completa la lógica que decide qué mostrar en el banner (`els.alarmBanner`,
   `els.alarmBannerText`): sin alarmas → "Sin alarmas activas" con la clase `alarm-banner--ok`; con una
   alarma `WARNING` → clase `alarm-banner--warning` y el texto de la alarma.

## Cómo probarlo

```bash
curl -X POST http://localhost:3000/api/simulation/scenario \
  -H "Content-Type: application/json" -d '{"scenario":"TEMP_HIGH"}'
```

## Criterios de aceptación

- [ ] `cd backend && npm test` — `alarms.test.js` ya no falla en el caso `TEMP_HIGH`.
- [ ] Con el escenario forzado, el banner de alarmas se pone amarillo y muestra el código `TEMP_HIGH`.
- [ ] El historial de eventos (debajo del banner) registra el evento.

## Preguntas de reflexión

1. ¿Por qué `evaluateTemperature()` debe evaluar el umbral CRÍTICO antes que el de WARNING? ¿Qué pasaría si
   lo hicieras al revés con una temperatura de 75 °C?
2. `evaluateTemperature()` vive en el backend, no en el frontend. ¿Por qué es importante que la decisión de
   "esto es una alarma" se tome ahí y no en `ui.js`?

## Entregable

`alarm.service.js` y `ui.js` actualizados, más una captura de pantalla del banner en amarillo.

## Rúbrica

| Criterio | Puntos |
|---|---|
| `evaluateTemperature()` correcta (pasa `npm test`) | 5 |
| Banner WARNING se muestra correctamente | 3 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
