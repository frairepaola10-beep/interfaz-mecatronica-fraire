# Actividad 1 — Modificar un comando

## Objetivo

Entender la relación entre `action` y `value` en un comando, modificando uno para que pida una velocidad
específica.

## Requisitos previos

Ninguno.

## Contexto

Todo comando que viaja del frontend al backend (y de ahí al ESP32) tiene la misma forma: `device`, `action`
y `value` (ver `shared/json/protocolo.md`, sección 1). La acción `SET_SPEED` es la única que realmente usa
`value` — para las demás acciones debe ir en `null`.

## JSON de partida

`entregables/actividad-1-inicio.json`:

```json
{
  "device": "motor1",
  "action": "START",
  "value": null
}
```

## Pasos

1. Copia el archivo de partida con un nuevo nombre, por ejemplo `actividad-1-solucion.json`.
2. Modifícalo para que, en lugar de arrancar el motor, establezca una velocidad de referencia de **50 %**.
3. Verifica que el JSON siga siendo válido (sin comas de más, comillas correctas, etc.) — puedes pegarlo en
   cualquier validador de JSON en línea o simplemente intentar abrirlo con `JSON.parse()` en la consola del
   navegador.

## Criterios de aceptación

- [ ] `action` es exactamente `"SET_SPEED"`.
- [ ] `value` es el número `50` (no el texto `"50"`).
- [ ] `device` sigue siendo `"motor1"`.
- [ ] El archivo es JSON válido.

## Preguntas de reflexión

1. ¿Qué pasaría si dejaras `value` en `null` con `action: "SET_SPEED"`? (Pista: revisa la tabla de
   `VALID_ACTIONS` en `backend/src/schemas/command.schema.js` de cualquiera de los dos proyectos.)
2. ¿Por qué crees que `START` y `STOP` no necesitan un `value`?

## Entregable

El archivo JSON modificado, más las respuestas a las preguntas de reflexión (puede ser en el mismo mensaje
de entrega, no hace falta otro archivo).

## Rúbrica

| Criterio | Puntos |
|---|---|
| `action`/`value` correctos | 6 |
| JSON válido | 2 |
| Preguntas de reflexión respondidas correctamente | 2 |
| **Total** | **10** |
