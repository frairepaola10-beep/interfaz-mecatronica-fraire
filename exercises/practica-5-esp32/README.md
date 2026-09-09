# Práctica 5 — Integración con ESP32

## Objetivo

Reemplazar el motor virtual por un ESP32 real, completando `firmware/esp32/esp32_interface/protocol.h` y
cambiando el backend a `MODE=HARDWARE`.

## Requisitos previos

Prácticas 1 a 4 completadas. Esta es la primera práctica que requiere hardware: un ESP32, LEDs, un
relevador, un buzzer, un potenciómetro y dos pulsadores (ver `docs/hardware.md` para la lista completa y las
conexiones).

⚠️ No conecten motores ni cargas reales directamente a un GPIO — usen siempre un módulo de relevador (ver
README del proyecto, sección 3.8, y `firmware/README.md`).

## Contexto

El backend nunca "sabe" si está hablando con el motor virtual o con un ESP32 real — esa decisión vive en una
sola línea de `communication.service.js` (`config.MODE === 'HARDWARE'`). Tu trabajo en esta práctica es del
lado del **firmware**, no del backend: completar `protocol.h` para que el ESP32 hable exactamente el mismo
protocolo JSON que ya conoces de las prácticas anteriores.

## Actividades

| Actividad | Qué se practica |
|---|---|
| [Actividad 1](actividad-1.md) | Conectar el ESP32 a Wi-Fi y confirmar que su servidor HTTP responde |
| [Actividad 2](actividad-2.md) | Completar `applyCommand()`: interpretar el comando |
| [Actividad 3](actividad-3.md) | Completar la construcción del JSON de respuesta |
| [Actividad 4](actividad-4.md) | Confirmar lectura de sensores y control de actuadores reales |
| [Actividad 5](actividad-5.md) | Cambiar el backend a `MODE=HARDWARE` y probar desde la interfaz |
