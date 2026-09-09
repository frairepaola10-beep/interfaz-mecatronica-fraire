# Práctica 3 — API REST

## Objetivo

Completar `frontend/js/api.js` y `frontend/js/app.js` para que la interfaz
realmente **envíe** comandos al backend — construyendo el JSON, haciendo la solicitud HTTP, y actualizando
la pantalla solo cuando el backend confirma.

## Requisitos previos

Práctica 2 completada (necesitas que `ui.js` ya pinte los estados correctamente para poder ver el resultado
de esta práctica).

## Contexto

Hasta ahora podías forzar comandos con `curl` para probar `ui.js`. En esta práctica, los botones ARRANCAR,
PARAR y ENVIAR VELOCIDAD de la propia interfaz cobran vida. El flujo que vas a completar es exactamente el
del README del proyecto, sección 22:

```text
Usuario presiona ARRANCAR → Frontend construye el JSON → POST al backend →
Backend valida y ejecuta → Backend responde → Frontend actualiza SOLO con la respuesta
```

## Comandos mínimos de esta práctica

`START`, `STOP`, `SET_SPEED` y `GET_STATUS` (este último ya funciona: es el que usa el sondeo periódico).

## Actividades

| Actividad | Qué se practica |
|---|---|
| [Actividad 1](actividad-1.md) | Completar `sendCommand()` en `api.js` |
| [Actividad 2](actividad-2.md) | Construir el JSON de ARRANCAR y PARAR |
| [Actividad 3](actividad-3.md) | Construir el JSON de ENVIAR VELOCIDAD (con el valor del slider) |
| [Actividad 4](actividad-4.md) | Completar la Fase 3: actualizar la pantalla solo tras la confirmación |
| [Actividad 5](actividad-5.md) | Verificación de extremo a extremo: los dos paneles JSON |
