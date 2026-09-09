# Actividad 3 — Agregar una alarma

## Objetivo

Construir un objeto de alarma completo y agregarlo a una respuesta que hasta ahora no tenía ninguna.

## Requisitos previos

Actividades 1 y 2 completadas.

## Contexto

El arreglo `alarms` de una respuesta puede tener cero o más objetos con la forma `{code, severity, message}`
(`shared/json/protocolo.md`, sección 3). Una respuesta puede tener `success: true` y aun así traer alarmas:
una alarma no significa que el comando falló, significa que el sistema detectó algo anormal mientras lo
ejecutaba.

## JSON de partida

`entregables/actividad-3-inicio.json` — una respuesta completa con `alarms: []`.

## Pasos

1. Copia el archivo de partida.
2. Agrega al arreglo `alarms` esta alarma exacta:

   ```text
   TEMP_HIGH
   WARNING
   Temperatura elevada
   ```

3. No modifiques ningún otro campo de la respuesta.

## Criterios de aceptación

- [ ] `alarms` tiene exactamente un elemento.
- [ ] `code` es `"TEMP_HIGH"`.
- [ ] `severity` es `"WARNING"` (en mayúsculas, tal como lo usa el resto del proyecto).
- [ ] `message` es `"Temperatura elevada"`.
- [ ] `success` sigue siendo `true` — no lo cambies.

## Preguntas de reflexión

1. Compara esta alarma con `TEMP_CRITICAL` en la tabla de alarmas (README del proyecto, sección 24). ¿Qué
   cambia entre una y otra, y qué debería cambiar en la interfaz visual cuando pasa de una a otra?
2. ¿En qué archivo del backend se decide, en tiempo real, si hay que agregar esta alarma o no? (Pista: es un
   `service`, no un `controller`.)

## Entregable

El archivo JSON modificado, más las respuestas a las preguntas de reflexión.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Objeto de alarma completo y correcto | 6 |
| El resto de la respuesta queda intacto | 2 |
| Preguntas de reflexión respondidas correctamente | 2 |
| **Total** | **10** |
