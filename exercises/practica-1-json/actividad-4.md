# Actividad 4 — Simular pérdida de comunicación

## Objetivo

Entender cómo cambia una respuesta completa cuando el sistema pierde la comunicación con el dispositivo.

## Requisitos previos

Actividades 1, 2 y 3 completadas.

## Contexto

Cuando `communication.connected` es `false`, la interfaz **no puede** seguir mostrando el último valor
conocido de `state` como si siguiera vigente — por eso `response-error.json` reporta todo `state` en `null`
(`shared/json/protocolo.md`, sección 4).

## JSON de partida

`entregables/actividad-4-inicio.json` — una respuesta normal, con comunicación activa y sin alarmas.

## Pasos

1. Copia el archivo de partida.
2. Cambia `communication.connected` de `true` a `false`.
3. Ajusta `communication.latencyMs` a `null` (ya no hay una medición de latencia válida).
4. Cambia todos los campos de `state` (`running`, `speed`, `temperature`) a `null`.
5. Agrega esta alarma al arreglo `alarms`:

   ```json
   {
     "code": "COMM_LOST",
     "severity": "CRITICAL",
     "message": "Comunicación perdida con el dispositivo"
   }
   ```

6. Cambia `success` a `false`.

## Criterios de aceptación

- [ ] `success` es `false`.
- [ ] `communication.connected` es `false` y `communication.latencyMs` es `null`.
- [ ] Los tres campos de `state` son `null`.
- [ ] `alarms` contiene la alarma `COMM_LOST` con severidad `CRITICAL`.
- [ ] El resultado es idéntico en estructura a `shared/json/response-error.json` (puedes compararlos).

## Preguntas de reflexión

1. ¿Por qué la respuesta de error NO conserva el último `speed`/`temperature` conocido en vez de ponerlo en
   `null`? Conecta tu respuesta con la "Regla fundamental de la interfaz" (README del proyecto, sección 23).
2. Cuando pruebes esto en el sistema real (Práctica 6), ¿qué endpoint del backend te permite forzar esta
   misma condición sin desconectar cables?

## Entregable

El archivo JSON modificado, más las respuestas a las preguntas de reflexión.

## Rúbrica

| Criterio | Puntos |
|---|---|
| `success`/`communication` correctos | 4 |
| `state` completamente en `null` | 3 |
| Alarma `COMM_LOST` correcta | 2 |
| Preguntas de reflexión respondidas correctamente | 1 |
| **Total** | **10** |
