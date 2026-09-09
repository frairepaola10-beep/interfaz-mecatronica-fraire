# Actividad 2 — Modificar un estado

## Objetivo

Traducir una descripción en texto de la situación del motor a los campos exactos de un objeto `state`.

## Requisitos previos

Actividad 1 completada.

## Contexto

El objeto `state` de una respuesta (`shared/json/protocolo.md`, sección 2) representa el estado **confirmado**
del motor: `running`, `speed` y `temperature`. Aquí se trabaja ese objeto de forma aislada, sin el resto de
la respuesta, para enfocarse solo en el mapeo de valores.

## JSON de partida

`entregables/actividad-2-inicio.json`:

```json
{
  "running": false,
  "speed": 0,
  "temperature": 25
}
```

## Pasos

1. Copia el archivo de partida.
2. Modifícalo para que represente esta situación:

   ```text
   Motor encendido
   Velocidad: 50 %
   Temperatura: 40 °C
   ```

## Criterios de aceptación

- [ ] `running` es `true` (no el texto `"true"`).
- [ ] `speed` es `50`.
- [ ] `temperature` es `40`.
- [ ] Los tipos de dato son correctos: `running` booleano, `speed`/`temperature` números.

## Preguntas de reflexión

1. ¿Por qué `running` es un booleano y no un texto como `"ENCENDIDO"`? ¿Quién en el sistema decide cómo se
   muestra ese booleano al usuario?
2. Si el motor estuviera físicamente encendido pero el backend no pudiera comunicarse con el ESP32, ¿debería
   `running` seguir siendo `true`? Justifica tu respuesta con la regla fundamental de la interfaz (README del
   proyecto, sección 23).

## Entregable

El archivo JSON modificado, más las respuestas a las preguntas de reflexión.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Los tres campos son correctos | 6 |
| Tipos de dato correctos | 2 |
| Preguntas de reflexión respondidas correctamente | 2 |
| **Total** | **10** |
