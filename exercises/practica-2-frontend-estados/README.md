# Práctica 2 — Frontend leyendo estados

## Objetivo

Completar `frontend/js/ui.js` para que la interfaz muestre el JSON crudo que llega del
backend y, sobre todo, para que lo traduzca correctamente a texto y colores en pantalla — sin construir
todavía ningún comando (eso es la Práctica 3).

## Requisitos previos

Práctica 1 completada. Haber leído `shared/json/protocolo.md`.

## Contexto

Con la plantilla del alumno, el backend **ya funciona completo** — pero, a propósito, `ui.js` no muestra
nada todavía: ni el JSON en crudo, ni el estado interpretado. Vas a resolver eso en dos pasos:

1. **Actividad 1** completa `showSentJson()`/`showReceivedJson()`, para que el panel "JSON RECIBIDO"
   muestre lo que realmente llega del backend. Esa es la única ayuda "de fábrica" que vas a tener — a partir
   de ahí, para todo lo demás, tú decides cómo averiguar qué trae cada respuesta (la pestaña Red del
   navegador también sirve, incluso antes de la Actividad 1).
2. **Actividades 2 a 5** completan `renderMotor()`, `renderProcess()` y `renderAlarms()` — la traducción de
   ese JSON a texto/color en pantalla. El propio archivo trae un comentario `TODO` extenso justo antes de
   esas funciones con todos los detalles.

## Cómo probar cada actividad

1. Levanta el backend: `cd backend && npm install && npm start`.
2. Abre `http://localhost:3000`.
3. Fuerza el escenario que corresponda con `curl` (ver cada actividad).
4. Espera 2 segundos (el sondeo periódico refresca la pantalla solo) y verifica los criterios de aceptación.

No necesitas completar `app.js` ni `api.js` (Práctica 3) para esta práctica: los botones no van a funcionar
todavía, pero el sondeo automático de estado sí, y es suficiente para probar todo lo de aquí.

## Actividades

| Actividad | Qué se practica |
|---|---|
| [Actividad 1](actividad-1.md) | Mostrar el JSON enviado y recibido (tu herramienta de depuración para el resto de la práctica) |
| [Actividad 2](actividad-2.md) | `running` → ENCENDIDO / DETENIDO |
| [Actividad 3](actividad-3.md) | `connected: false` → SIN COMUNICACIÓN |
| [Actividad 4](actividad-4.md) | `severity: WARNING` → advertencia visible |
| [Actividad 5](actividad-5.md) | `severity: CRITICAL` → alarma crítica visible |
