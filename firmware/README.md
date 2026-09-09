# Firmware ESP32 — Interfaz Mecatrónica (plantilla-alumno)

Práctica 5 del proyecto. Este firmware convierte al ESP32 en el "hardware real" que el backend controla
cuando `MODE=HARDWARE` (ver `backend/src/config/index.js`). Con `MODE=SIMULATION` (valor por defecto) este
firmware no es necesario: el backend simula el motor internamente.

> **Nota de esta plantilla:** `esp32_interface/protocol.h` tiene dos `TODO` pendientes —
> `applyCommand()` (interpretar el comando) y la construcción del JSON de respuesta dentro de
> `buildStatusResponse()`. El resto del firmware (pines, sensores, actuadores, servidor HTTP) ya está
> completo. Lee los comentarios `TODO` dentro de `protocol.h` para los detalles exactos.

## Archivos

| Archivo | Contenido |
|---|---|
| `esp32_interface/esp32_interface.ino` | Programa principal: Wi-Fi, servidor HTTP, `setup()`/`loop()`. |
| `esp32_interface/config.h` | Pines, credenciales Wi-Fi, ID del dispositivo, umbrales de alarma. |
| `esp32_interface/sensors.h` | Todo lo que el ESP32 **lee**: temperatura, potenciómetro, pulsadores. |
| `esp32_interface/actuators.h` | Todo lo que el ESP32 **escribe**: LEDs, relevador, buzzer. |
| `esp32_interface/protocol.h` | Traduce el JSON del protocolo hacia/desde el estado físico. |

## Requisitos

- **Arduino IDE** 2.x (o `arduino-cli`).
- Paquete de placas **esp32** de Espressif instalado desde el gestor de placas.
- Librería **ArduinoJson** (Benoit Blanchon), versión **7.x**, desde el gestor de librerías.
- Opcional: librería **DHT sensor library** (Adafruit) — solo si van a usar un sensor DHT11/DHT22 real
  (ver `USE_DHT` en `config.h`).

## Conexiones (ver tabla completa y el porqué de cada pin en `docs/hardware.md`)

| Señal | GPIO | Notas |
|---|---|---|
| LED verde (motor en operación) | 2 | LED integrado en muchas placas ESP32 DevKit |
| LED rojo (alarma) | 4 | |
| Relevador | 5 | **Nunca** conectar un motor directamente aquí — usar siempre un módulo de relevador |
| Buzzer | 18 | |
| Potenciómetro | 34 | ADC1 — pin de solo entrada, obligatorio con Wi-Fi activo |
| Sensor DHT | 15 | Solo si `USE_DHT` = 1 |
| Pulsador START | 32 | `INPUT_PULLUP`: conectar entre el pin y GND |
| Pulsador STOP | 33 | `INPUT_PULLUP`: conectar entre el pin y GND |

⚠️ **Advertencia de seguridad**: no conecten motores, cargas inductivas ni nada que consuma más corriente de
la que un GPIO puede entregar directamente a un pin del ESP32. Usen siempre un relevador, MOSFET, transistor
o driver adecuado a la corriente del motor.

## Pasos para cargar el firmware

1. Abrir `esp32_interface/esp32_interface.ino` en el Arduino IDE (abrirá también los `.h` de la misma carpeta
   como pestañas).
2. Editar `config.h`: poner el SSID y la contraseña de la red Wi-Fi del laboratorio.
3. Instalar la librería ArduinoJson 7.x si aún no está instalada.
4. Seleccionar la placa ESP32 correcta y el puerto serial correspondiente.
5. Cargar el programa.
6. Abrir el Monitor Serial a 115200 baudios: el ESP32 imprime su dirección IP al conectarse a Wi-Fi.
7. Copiar esa IP y ponerla como `ESP32_URL` en la configuración del backend (variable de entorno o
   `backend/src/config/index.js`), y cambiar `MODE` a `HARDWARE`.
8. Reiniciar el backend. A partir de ahí, cada comando que llegue del frontend se reenvía por HTTP a esta IP.

## Cómo probarlo sin el frontend

Con el ESP32 ya conectado a Wi-Fi, se le puede enviar un comando directamente con `curl` para confirmar que
el firmware responde antes de involucrar al backend:

```bash
curl -X POST http://<IP_DEL_ESP32>/command \
  -H "Content-Type: application/json" \
  -d '{"device":"motor1","action":"START","value":null}'
```

Debe responder con un JSON como:

```json
{
  "state": {
    "running": true,
    "speed": 0,
    "temperature": 25.3,
    "potentiometerAdc": 120,
    "relay": true,
    "startButton": "LIBRE",
    "stopButton": "LIBRE"
  }
}
```

Esta es exactamente la forma que `communication.service.js` espera de un ESP32 real (ver la función
`sendToHardware`).
