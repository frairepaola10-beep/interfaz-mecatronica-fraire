# Práctica 4 — Validación

## Objetivo

Completar `backend/src/middleware/validateCommand.js` para que el backend rechace
cualquier comando que no cumpla el contrato de `shared/json/protocolo.md`, **antes** de que llegue a
ejecutarse sobre el dispositivo (real o simulado).

## Requisitos previos

Práctica 3 completada (para poder ver los rechazos también desde la interfaz, no solo con `curl`).

## Contexto

Ahora mismo, la plantilla tiene `validateCommand()` rechazando **todo** con un mensaje de "TODO" — ni
siquiera los comandos válidos pasan. Vas a construir la validación completa, en el orden que indica el
comentario del archivo: campo faltante → dispositivo desconocido → acción no permitida → tipo/rango de
`value` incorrecto.

## Cómo se prueba esta práctica

Cada actividad se puede probar con `curl` directamente contra el backend, y todas en conjunto se verifican
con:

```bash
cd backend
npm test
```

`validation.test.js` es la prueba de referencia — cuando los 6 casos de esa suite pasen, la práctica está
completa.

## Actividades

| Actividad | Qué se practica |
|---|---|
| [Actividad 1](actividad-1.md) | Rechazar un comando con un campo faltante |
| [Actividad 2](actividad-2.md) | Rechazar un dispositivo desconocido |
| [Actividad 3](actividad-3.md) | Rechazar una acción no permitida |
| [Actividad 4](actividad-4.md) | Rechazar un `value` de tipo o rango incorrecto |
| [Actividad 5](actividad-5.md) | Dejar pasar un comando válido y confirmar el formato de error uniforme |
