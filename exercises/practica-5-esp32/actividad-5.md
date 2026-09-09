# Actividad 5 — Cambiar el backend a `MODE=HARDWARE`

## Objetivo

Conectar todo el sistema de punta a punta: frontend → backend → ESP32 real, sin ningún cambio en el
frontend ni en las rutas del backend.

## Requisitos previos

Actividades 1 a 4 completadas. ESP32 encendido y conectado a la misma red que la computadora donde corre el
backend.

## Contexto

Esta es la actividad que demuestra la idea central del README del proyecto, sección 25: cambiar de Modo 1
(Simulación) a Modo 2 (Hardware real) es cambiar **una variable de entorno**, no reescribir código.

## Pasos

1. Anota la IP que el ESP32 imprimió por Serial (Actividad 1).
2. Arranca el backend con esa IP:
   ```bash
   cd backend
   MODE=HARDWARE ESP32_URL=http://<IP_DEL_ESP32> npm start
   ```
3. Abre `http://localhost:3000` — es la misma interfaz de siempre, sin ningún cambio visible en el código
   del frontend.
4. Presiona ARRANCAR, mueve el slider, presiona PARAR — igual que en la Práctica 3, pero ahora hablando con
   hardware real.

## Criterios de aceptación

- [ ] El header de la interfaz muestra "Modo: HARDWARE".
- [ ] Presionar ARRANCAR enciende físicamente el LED verde del ESP32 (no solo en pantalla).
- [ ] La franja de flujo y los paneles JSON funcionan exactamente igual que en Modo Simulación.
- [ ] Si desconectas el ESP32 de la red a la mitad de una prueba, la interfaz muestra `COMM_LOST`
      automáticamente (sin que hayas escrito código nuevo para esto — ya lo resolviste en la Práctica 6, si
      la hiciste antes, o lo harás justo después).

## Preguntas de reflexión

1. Enumera TODOS los archivos que tuviste que modificar para llegar hasta aquí (a lo largo de las 5
   prácticas). ¿Cuántos de ellos son del **frontend**?
2. `communication.service.js` decide entre `sendToSimulation()` y `sendToHardware()` con una sola condición
   (`config.MODE === 'HARDWARE'`). ¿Qué otras partes del backend tuvieron que ser diseñadas pensando en este
   cambio de modo desde el principio, aunque no lo notaras hasta ahora?

## Entregable

Captura de pantalla de la interfaz en "Modo: HARDWARE" con el motor encendido, más un video corto mostrando
el LED físico encendiéndose al presionar ARRANCAR desde la pantalla.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Backend corriendo en `MODE=HARDWARE` contra el ESP32 real | 5 |
| Control desde la interfaz funcionando de extremo a extremo | 3 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
