# Actividad 5 — `severity: CRITICAL` → alarma crítica visible

## Objetivo

Completar el caso `CRITICAL` de `renderAlarms()` y verificar que la temperatura crítica se distingue
claramente de una simple advertencia.

## Requisitos previos

Actividad 4 completada (usa la misma `evaluateTemperature()` que ya escribiste).

## Contexto

Con `evaluateTemperature()` ya completa desde la Actividad 4, el backend ya es capaz de reportar
`TEMP_CRITICAL`. Lo que falta es que `renderAlarms()` distinga visualmente ese caso del `WARNING` — una
alarma crítica debe destacar mucho más que una advertencia.

## Código de partida

`renderAlarms()` en `frontend/js/ui.js` (donde ya trabajaste en la Actividad 4).

## Pasos

1. Completa el caso restante de `renderAlarms()`: si la alarma más grave tiene `severity === 'CRITICAL'`,
   usa la clase `alarm-banner--critical` en vez de `alarm-banner--warning`.
2. Si llegaran a existir alarmas de ambas severidades al mismo tiempo, el banner debe mostrar la más grave
   (`CRITICAL` antes que `WARNING`) — revisa que tu lógica ya lo haga (compara con la ayuda de
   `alarms.find(...)` sugerida en el `TODO`).

## Cómo probarlo

```bash
curl -X POST http://localhost:3000/api/simulation/scenario \
  -H "Content-Type: application/json" -d '{"scenario":"TEMP_CRITICAL"}'
```

## Criterios de aceptación

- [ ] `npm test` — `alarms.test.js` pasa completo (los 4 casos de esa suite).
- [ ] El banner se pone rojo y muestra `TEMP_CRITICAL` cuando se fuerza ese escenario.
- [ ] El color/estilo del banner es visiblemente distinto entre `WARNING` (Actividad 4) y `CRITICAL` (esta
      actividad).

## Preguntas de reflexión

1. En un sistema real, ¿qué otras acciones (más allá de mostrar un color distinto) debería disparar una
   alarma `CRITICAL` que una `WARNING` no dispara? Revisa la sección "Buzzer" del README del proyecto.
2. ¿Cómo decidiste, en tu código, cuál alarma mostrar cuando hay más de una activa al mismo tiempo?

## Entregable

`ui.js` con `renderAlarms()` completa, más una captura de pantalla del banner en rojo.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Banner CRITICAL correcto y distinguible del WARNING | 6 |
| `npm test` pasa completo | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
