# Actividad 5 — Verificación de extremo a extremo

## Objetivo

Confirmar que todo el ciclo funciona junto: construcción del comando, envío, validación, ejecución,
confirmación y actualización visual — usando los dos paneles JSON como evidencia.

## Requisitos previos

Actividades 1 a 4 completadas.

## Contexto

Esta actividad no agrega código nuevo: es la comprobación de que las cuatro anteriores realmente quedaron
integradas, siguiendo el flujo completo del README del proyecto, sección 22.

## Pasos

1. Con el backend corriendo, recarga la página desde cero.
2. Presiona ARRANCAR. Verifica el panel "JSON ENVIADO" (`POST /api/device/command`, comando `START`) y el
   panel "JSON RECIBIDO" (`success: true`, `state.running: true`).
3. Mueve el slider a 80 % y presiona ENVIAR VELOCIDAD. Verifica ambos paneles de nuevo.
4. Presiona PARAR. Verifica ambos paneles una última vez.
5. Anota el número de "Solicitud #CMD-XXX" de cada paso — deben ser consecutivos.

## Criterios de aceptación

- [ ] Los tres comandos (`START`, `SET_SPEED`, `STOP`) se completan sin recargar la página y sin errores en
      la consola del navegador.
- [ ] El número de "Solicitud #CMD-XXX" avanza de forma consecutiva entre comandos.
- [ ] El estado mostrado en pantalla en todo momento coincide exactamente con `state` del último "JSON
      RECIBIDO".
- [ ] `cd backend && npm test` sigue en verde para `contract.test.js` y `validation.test.js`
      (los que no dependen de la Práctica 4/6, que vienen después).

## Preguntas de reflexión

1. Describe, con tus propias palabras y usando los nombres reales de archivos/funciones del proyecto, el
   camino completo que recorre un clic en ARRANCAR desde que el dedo toca el botón hasta que el anillo del
   motor gira en pantalla.
2. ¿Qué parte de ese camino NO cambiaría si mañana reemplazas el motor virtual por un ESP32 real
   (Práctica 5)?

## Entregable

Una captura de pantalla por cada uno de los tres comandos (START, SET_SPEED, STOP) mostrando ambos paneles
JSON, más la respuesta escrita a las preguntas de reflexión.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Los tres comandos funcionan de extremo a extremo | 6 |
| Numeración de solicitudes consistente | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
