# Actividad 4 — Completar la Fase 3: actualizar solo tras la confirmación

## Objetivo

Completar la parte de `runCommand()` en `app.js` que decide qué hacer con la respuesta del backend —el
corazón de la "Regla fundamental de la interfaz".

## Requisitos previos

Actividades 1, 2 y 3 completadas.

## Contexto

Vuelve a leer el README del proyecto, sección 23. `runCommand()` ya tiene resueltas las Fases 1 y 2
(la animación de "Enviando..." / "Esperando confirmación...") y ya recibió la `response` real del backend.
Lo que falta es la Fase 3: decidir, según `response.success`, si la pantalla debe mostrar el nuevo estado
confirmado o una falla — y hacerlo de forma que **nunca** se muestre un estado que el backend no confirmó.

## Código de partida

`app.js`, dentro de `runCommand()`, el bloque marcado con el `TODO` extenso (justo después de
`ui.showReceivedJson(response)`). Ya existen las funciones `applyConfirmedState(response)` y
`handleDisconnected(response)` — tu trabajo es **llamarlas en el momento correcto**, no reescribirlas.

## Pasos

Sigue exactamente la guía del comentario `TODO` del archivo:

1. Si `response.success` es `true`: marca en verde (`is-done`) el resto del camino de ida y todo el camino
   de vuelta, actualiza el texto de fase con `describeConfirmation(...)`, llama a
   `applyConfirmedState(response)` y reactiva los controles.
2. Si es `false`: marca en verde el tramo que sí llegó, marca `'esp32'` en rojo (`is-failed`), llama a
   `handleDisconnected(response)` y actualiza el texto de fase.

## Cómo probarlo

Con todo lo anterior completo, presiona ARRANCAR con el backend funcionando normalmente: la pantalla debe
terminar mostrando "ENCENDIDO". Luego fuerza una falla y vuelve a intentarlo:

```bash
curl -X POST http://localhost:3000/api/simulation/scenario \
  -H "Content-Type: application/json" -d '{"scenario":"COMM_LOST"}'
```

## Criterios de aceptación

- [ ] Con comunicación normal, ARRANCAR termina en "Comando confirmado — Motor encendido" y el motor se ve
      ENCENDIDO en pantalla.
- [ ] Con `COMM_LOST` forzado, ARRANCAR termina en "Comando NO confirmado..." y el paso "ESP32" de la franja
      de flujo se ve en rojo.
- [ ] En ningún momento la pantalla muestra "ENCENDIDO" antes de que llegue la respuesta del backend.

## Preguntas de reflexión

1. ¿En qué línea exacta de tu código se actualiza, por primera vez, lo que el usuario ve como estado del
   motor? ¿Cuántos pasos (fetch, validaciones, etc.) ocurrieron antes de esa línea?
2. Si quitaras la comprobación de `response.success` y siempre llamaras a `applyConfirmedState(response)`,
   ¿qué pasaría cuando `response.state` sea `null` (por una desconexión)?

## Entregable

`app.js` completo, más una captura de pantalla del flujo confirmado (todo en verde) y otra del flujo fallido
(con el paso ESP32 en rojo).

## Rúbrica

| Criterio | Puntos |
|---|---|
| Camino exitoso implementado correctamente | 5 |
| Camino de falla implementado correctamente | 3 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
