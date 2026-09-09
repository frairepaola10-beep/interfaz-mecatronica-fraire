# Actividad 2 — Completar `applyCommand()`

## Objetivo

Hacer que el ESP32 interprete correctamente las cuatro acciones del protocolo.

## Requisitos previos

Actividad 1 completada.

## Contexto

`applyCommand()` en `protocol.h` es el equivalente, en el firmware, de lo que `device.service.js` hace en el
backend: traducir una acción (`START`, `STOP`, `SET_SPEED`, `GET_STATUS`) en un cambio de estado real.

## Código de partida

`firmware/esp32/esp32_interface/protocol.h`, función `bool applyCommand(const String &action, int value)`.

## Pasos

Sigue el `TODO` del archivo:

```cpp
bool applyCommand(const String &action, int value) {
  if (action == "START") {
    motorState.running = true;
    startMotor();
    return true;
  }
  if (action == "STOP") {
    motorState.running = false;
    stopMotor();
    return true;
  }
  if (action == "SET_SPEED") {
    motorState.speed = value;
    return true;
  }
  if (action == "GET_STATUS") {
    return true;
  }
  return false;
}
```

## Cómo probarlo

Carga el firmware actualizado y prueba:

```bash
curl -X POST http://<IP_DEL_ESP32>/command \
  -H "Content-Type: application/json" -d '{"device":"motor1","action":"START","value":null}'
```

## Criterios de aceptación

- [ ] Al enviar `START`, el LED verde (o el que hayas conectado a `PIN_LED_GREEN`) se enciende físicamente.
- [ ] Al enviar `STOP`, se apaga.
- [ ] Un `action` que no sea ninguna de las cuatro (por ejemplo `"VOLAR"`) hace que `applyCommand()` devuelva
      `false` (verifícalo con el Monitor Serial o un `Serial.println` temporal).

## Preguntas de reflexión

1. `applyCommand()` en el ESP32 y `validateCommand()` en el backend (Práctica 4) hacen comprobaciones
   parecidas. ¿Por qué el ESP32 vuelve a comprobar la acción si el backend ya la validó antes de reenviarla?
2. ¿Qué pasaría si `startMotor()` (en `actuators.h`) tardara varios segundos en ejecutarse? ¿Dónde se notaría
   ese retraso, del lado del backend o del frontend?

## Entregable

`protocol.h` con `applyCommand()` completa, más un video corto o GIF del LED encendiéndose/apagándose.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Las cuatro acciones implementadas correctamente | 7 |
| Preguntas de reflexión | 3 |
| **Total** | **10** |
