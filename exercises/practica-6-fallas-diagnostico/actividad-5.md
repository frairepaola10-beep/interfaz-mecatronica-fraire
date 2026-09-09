# Actividad 5 — Comando incorrecto

## Objetivo

Verificar que un comando inválido, enviado en pleno funcionamiento normal, se rechaza sin afectar el estado
del motor ni dejar el sistema en una condición inconsistente.

## Requisitos previos

Práctica 4 completada.

## Contexto

A diferencia de las fallas anteriores (que son condiciones del *dispositivo*), esta es una falla del
*mensaje*: el comando ni siquiera debería llegar a ejecutarse. Es la validación de la Práctica 4, puesta a
prueba en medio de una sesión de uso normal.

## Pasos

1. Arranca el motor normalmente (`START`).
2. Sin detenerlo, envía un comando inválido:
   ```bash
   curl -i -X POST http://localhost:3000/api/device/command \
     -H "Content-Type: application/json" -d '{"device":"motor1","action":"ON"}'
   ```
3. Verifica el estado del motor inmediatamente después.

## Criterios de aceptación

- [ ] La solicitud del paso 2 responde `400` con `{"success": false, "error": "INVALID_COMMAND"}` —
      exactamente como pide el README del proyecto, sección 4.
- [ ] El motor **sigue encendido** después del comando inválido — el rechazo no tuvo ningún efecto sobre el
      estado real.
- [ ] El historial de eventos (`GET /api/device/alarms`) registra el intento de comando inválido.
- [ ] Repite la prueba con otros comandos incorrectos de las actividades de la Práctica 4 (dispositivo
      desconocido, `value` fuera de rango) y confirma el mismo comportamiento: se rechazan sin tocar el
      estado.

## Preguntas de reflexión

1. ¿En qué punto exacto del recorrido (middleware, controller, service) se detiene un comando inválido?
   ¿Llega a tocar `simulator.service.js` en algún momento?
2. ¿Por qué es importante que un comando rechazado NO aparezca como una alarma "activa" en el banner
   principal, sino solo en el historial de eventos?

## Entregable

Capturas de las respuestas `curl` (antes y después del comando inválido) mostrando que el estado no cambió.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Comando inválido rechazado sin afectar el estado | 6 |
| Historial de eventos registra el intento | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
