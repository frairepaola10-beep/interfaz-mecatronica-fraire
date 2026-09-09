# Actividad 2 — Construir el JSON de ARRANCAR y PARAR

## Objetivo

Completar los manejadores de clic de los botones ARRANCAR y PARAR en `app.js`.

## Requisitos previos

Actividad 1 completada.

## Contexto

`app.js` ya tiene la función `runCommand(command)` que se encarga de todo el flujo visual (fases,
franja de flujo, JSON panels) — recibe un objeto `command` ya armado y hace el resto. Tu trabajo aquí es
solamente construir ese objeto en cada manejador de clic.

## Código de partida

`frontend/js/app.js`, los tres `addEventListener('click', ...)` cerca del inicio del
archivo.

## Pasos

1. En el manejador de `els.startBtn`, llama a `runCommand({ device: 'motor1', action: 'START', value: null })`.
2. En el manejador de `els.stopBtn`, haz lo mismo con `action: 'STOP'`.
3. Deja el manejador de `els.sendSpeedBtn` para la Actividad 3.

## Cómo probarlo

Con el backend corriendo y la página abierta, presiona ARRANCAR y observa la franja de flujo (arriba de la
pantalla) iluminarse paso a paso.

## Criterios de aceptación

- [ ] Al presionar ARRANCAR, aparece la fase "Enviando comando..." y luego "Esperando confirmación del
      ESP32...".
- [ ] El panel "JSON ENVIADO" muestra exactamente `{ "device": "motor1", "action": "START", "value": null }`.
- [ ] Al presionar PARAR, ocurre lo mismo con `action: "STOP"`.

(Es normal que, después de la fase "Esperando confirmación...", la pantalla no termine de actualizarse
correctamente todavía — eso se completa en la Actividad 4.)

## Preguntas de reflexión

1. ¿Por qué `runCommand()` recibe el comando ya armado, en vez de armarlo ella misma a partir de qué botón
   se presionó?
2. START y STOP siempre mandan `value: null`. ¿Qué garantiza, del lado del backend, que un `value` distinto
   de `null` en estas acciones sería rechazado?

## Entregable

`app.js` con los manejadores de ARRANCAR y PARAR completos.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Comando START correcto | 3 |
| Comando STOP correcto | 3 |
| Panel "JSON ENVIADO" refleja el comando exacto | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
