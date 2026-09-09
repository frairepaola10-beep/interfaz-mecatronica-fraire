# Actividad 1 — Mostrar el JSON enviado y recibido

## Objetivo

Completar `showSentJson()` y `showReceivedJson()` en `frontend/js/ui.js` para que los paneles "JSON
ENVIADO" y "JSON RECIBIDO" de la pantalla muestren de verdad lo que viaja entre el frontend y el backend.

## Requisitos previos

Práctica 1 completada.

## Contexto

Ahora mismo el backend ya funciona perfectamente — cada 2 segundos responde con el estado real del motor —
pero la pantalla no lo muestra en ningún lado todavía: ni interpretado (eso es el resto de esta práctica) ni
en crudo. Esta actividad va primero porque, una vez resuelta, el panel "JSON RECIBIDO" se convierte en tu
propia herramienta de depuración para las actividades 2 a 5: vas a poder comparar, en la misma pantalla, lo
que el backend dice contra lo que tu código pinta.

`ui.js` ya trae escrita `highlightJson(valor)`, una función que convierte cualquier objeto a HTML con
colores por tipo de dato (llaves, cadenas, números, booleanos, `null`) — no tienes que tocarla ni entender
su regex por dentro, solo llamarla.

## Código de partida

`frontend/js/ui.js`, funciones `showSentJson(command, endpoint)` y `showReceivedJson(response)` (vacías,
con un comentario `TODO` arriba que detalla exactamente qué asignar a cada elemento).

## Pasos

1. Abre `ui.js` y localiza `showSentJson()`. Complétala para que:
   - ponga `endpoint` en `els.sentEndpoint`;
   - ponga el texto `"Solicitud pendiente…"` en `els.sentRequestId` (todavía no se sabe el ID: lo asigna el
     backend en la respuesta, no el frontend);
   - ponga `highlightJson(command)` como `innerHTML` de `els.sentJson`.
2. Completa `showReceivedJson()` para que:
   - arme el texto `Solicitud #<id>` (o `Solicitud #—` si no viene `transactionId`) y lo ponga en **ambos**
     `els.sentRequestId` y `els.receivedRequestId`;
   - ponga `highlightJson(response ?? {})` como `innerHTML` de `els.receivedJson`.

## Cómo probarlo

No necesitas tener terminado el resto de `ui.js` para esta actividad. Con el backend corriendo
(`cd backend && npm start`) y la página abierta:

1. Abre las herramientas de desarrollador del navegador (F12) → pestaña **Red/Network**.
2. Recarga la página. El sondeo automático del frontend ya está haciendo `GET /api/device/status` cada 2
   segundos, aunque `ui.js` todavía no lo pinte en ningún lado — vas a verlo pasar por la pestaña Red.
3. Compara la respuesta que ves ahí contra lo que debería aparecer, una vez completes esto, en el panel
   "JSON RECIBIDO" de la pantalla.

## Criterios de aceptación

- [ ] El panel "JSON RECIBIDO" muestra, con colores por tipo de dato, la última respuesta real del backend
      (se actualiza solo cada 2 segundos, gracias al sondeo automático).
- [ ] Al presionar cualquiera de los botones de control (aunque todavía no hagan nada, eso es la Práctica 3),
      el panel "JSON ENVIADO" no es el objetivo de esta actividad — concéntrate primero en que "JSON
      RECIBIDO" funcione con el sondeo automático.
- [ ] "Solicitud #..." se actualiza con el `transactionId` real, no se queda en "Solicitud #—" cuando el
      backend sí lo manda.
- [ ] El JSON se ve resaltado por colores (llaves en un color, cadenas en otro, números en otro) — si se ve
      todo del mismo color, revisa que estés usando `innerHTML` y no `textContent`.

## Preguntas de reflexión

1. ¿Por qué `showReceivedJson()` actualiza el `sentRequestId` además del `receivedRequestId`? ¿Qué pasaría
   si solo actualizaras el segundo?
2. Ahora que ves el JSON crudo en pantalla, compáralo con `shared/json/response-ok.json`. ¿Qué campos trae
   la respuesta real que no estaban en ese ejemplo? (Pista: revisa `docs/protocolo-json.md`, sección
   "Campos adicionales de `state`".)

## Entregable

`ui.js` con `showSentJson()` y `showReceivedJson()` completas, más una captura de pantalla del panel "JSON
RECIBIDO" mostrando datos reales y resaltado por colores.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Panel "JSON RECIBIDO" muestra datos reales, actualizados por el sondeo | 5 |
| "Solicitud #" se actualiza con el ID real | 3 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
