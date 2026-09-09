# Actividad 6 — Diagnóstico integral (capstone)

## Objetivo

Cerrar el proyecto completo: provocar, en una sola sesión y en orden, cada condición que el sistema es
capaz de reconocer, documentando cómo la interfaz respondió a cada una.

## Requisitos previos

Todas las prácticas y actividades anteriores completadas. `cd backend && npm test` pasa
completo (los 13 tests).

## Contexto

Esta es la actividad de cierre de la materia. No introduce código nuevo: es la demostración de que tu
proyecto, ya completo, se comporta igual que la versión de referencia del profesor en todos los casos que
el proyecto contempla, y de que tú entiendes **por qué** en cada caso.

## Pasos

1. Arranca el backend y abre la interfaz.
2. Recorre, EN ORDEN, cada escenario, dejando pasar al menos 3 segundos entre uno y otro para que el
   sondeo periódico alcance a reflejarlo:

   | Paso | Escenario | Qué debes observar |
   |---|---|---|
   | 1 | `NORMAL` (estado inicial) | Motor detenido, sin alarmas |
   | 2 | `START` (comando, no escenario) | Motor encendido, franja de flujo completa en verde |
   | 3 | `TEMP_HIGH` | Banner amarillo, `TEMP_HIGH`/`WARNING` |
   | 4 | `TEMP_CRITICAL` | Banner rojo, `TEMP_CRITICAL`/`CRITICAL` |
   | 5 | `SENSOR_FAULT` | Temperatura en `"—"`, resto del estado normal |
   | 6 | `DEVICE_FAULT` | Alarma `DEVICE_FAULT`/`CRITICAL` |
   | 7 | `COMM_LOST` | Banner rojo superior, ESP32 desconectado, botones deshabilitados |
   | 8 | `TIMEOUT` (probar un comando mientras está forzado) | Espera notable antes de reportar el fallo |
   | 9 | Comando inválido (`curl` con `action` incorrecta) | Rechazo `400`, sin afectar el estado |
   | 10 | `NORMAL` (recuperación) | Todo vuelve a la normalidad sin recargar la página |

3. Para cada paso, toma una captura de pantalla y anota, en una tabla propia, qué observaste.

## Criterios de aceptación

- [ ] Los 10 pasos se completaron en orden, sin recargar la página entre uno y otro (salvo que algo
      realmente lo requiera — anótalo si pasó).
- [ ] Cada paso coincide con lo descrito en la tabla.
- [ ] `npm test` pasa completo, como evidencia de que el backend está funcionalmente igual a `solucion/`.
- [ ] Tu tabla de observaciones está completa, con una captura de pantalla por paso.

## Preguntas de reflexión (de cierre de la materia)

1. De las 6 prácticas, ¿cuál te costó más entender y por qué? ¿Qué parte del flujo (JSON → frontend → API →
   backend → validación → ESP32 → estado → respuesta → interfaz) era la que menos tenías clara al empezar?
2. Explica, con tus propias palabras, la diferencia entre "lo que el usuario solicita" y "lo que el sistema
   realmente hizo" (README del proyecto, sección 34), y da un ejemplo concreto de este proyecto donde esa
   distinción evitó que la interfaz mintiera.
3. Si tuvieras que agregar un segundo motor (`motor2`) a este sistema, enumera — a alto nivel — qué
   archivos de `frontend/`, `backend/` y `firmware/` tendrías que tocar.

## Entregable

La tabla de observaciones completa (10 filas, con capturas), las respuestas a las tres preguntas de cierre,
y la captura de `npm test` en verde.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Los 10 pasos documentados correctamente | 12 |
| `npm test` en verde | 3 |
| Preguntas de reflexión de cierre | 5 |
| **Total** | **20** |
