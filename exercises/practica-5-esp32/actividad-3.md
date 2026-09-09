# Actividad 3 — Completar la construcción del JSON de respuesta

## Objetivo

Completar `buildStatusResponse()` para que el ESP32 responda con la misma forma de `state` que ya conoces
del backend (`shared/json/protocolo.md`).

## Requisitos previos

Actividad 2 completada.

## Contexto

`communication.service.js#sendToHardware` (en el backend) espera que la respuesta del ESP32 tenga la forma
`{ "state": { running, speed, temperature, potentiometerAdc, relay, startButton, stopButton } }`. Si el
ESP32 responde con otra forma, el backend no va a poder interpretarla — por eso esta actividad es tan
puntual sobre los nombres exactos de los campos.

## Código de partida

`protocol.h`, dentro de `buildStatusResponse()`, justo donde dice
`return "{\"state\":{}}";` (el marcador temporal).

## Pasos

Sigue el `TODO` del archivo para armar el `JsonDocument` con ArduinoJson v7:

```cpp
JsonDocument doc;
JsonObject state = doc["state"].to<JsonObject>();
state["running"] = motorState.running;
state["speed"] = motorState.speed;
state["temperature"] = tempFault ? (float)NAN : round(temperature * 10) / 10.0;
state["potentiometerAdc"] = rawAdc;
state["relay"] = motorState.running;
state["startButton"] = readStartButton() ? "PRESIONADO" : "LIBRE";
state["stopButton"] = readStopButton() ? "PRESIONADO" : "LIBRE";

String output;
serializeJson(doc, output);
return output;
```

(Revisa la nota del `TODO` sobre cómo reportar `temperature` como `null` cuando `tempFault` es verdadero.)

## Cómo probarlo

```bash
curl -X POST http://<IP_DEL_ESP32>/command \
  -H "Content-Type: application/json" -d '{"device":"motor1","action":"GET_STATUS","value":null}'
```

## Criterios de aceptación

- [ ] La respuesta es un JSON válido con una sola clave de primer nivel: `"state"`.
- [ ] `state` tiene los siete campos exactos listados arriba, con los nombres exactos (sensible a
      mayúsculas/minúsculas).
- [ ] `state.temperature` cambia de valor entre una lectura y otra si mueves el potenciómetro o esperas a
      que el motor "caliente" (según cómo hayas conectado tu sensor).

## Preguntas de reflexión

1. ¿Por qué la respuesta del ESP32 NO incluye campos como `success` o `communication.latencyMs`, que sí
   tienen las respuestas del backend? ¿Quién los agrega, entonces?
2. Compara esta función con `communication.service.js#sendToSimulation()` en el backend (que arma un objeto
   `state` casi idéntico, en JavaScript en vez de C++). ¿Qué tan parecidas son las dos implementaciones?

## Entregable

`protocol.h` completo, más una captura de la respuesta de `curl` mostrando el JSON completo.

## Rúbrica

| Criterio | Puntos |
|---|---|
| JSON con la forma y nombres de campo exactos | 7 |
| Preguntas de reflexión | 3 |
| **Total** | **10** |
