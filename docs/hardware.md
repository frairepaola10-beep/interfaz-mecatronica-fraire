# Hardware — conexiones y advertencias

## Tabla de pines (ESP32 DevKit, valores de `firmware/esp32/esp32_interface/config.h`)

| Constante | GPIO | Señal | Por qué ese pin |
|---|---|---|---|
| `PIN_LED_GREEN` | 2 | LED verde — motor en operación | Muchas placas ESP32 DevKit traen un LED integrado en el GPIO 2, útil para probar sin cablear nada. |
| `PIN_LED_RED` | 4 | LED rojo — alarma activa | GPIO de uso general, sin restricciones especiales. |
| `PIN_RELAY` | 5 | Relevador — salida de potencia | GPIO de uso general. **Nunca** conectar un motor directamente aquí. |
| `PIN_BUZZER` | 18 | Buzzer — alarma audible | GPIO de uso general. |
| `PIN_POTENTIOMETER` | 34 | Potenciómetro — referencia de velocidad | GPIO 34 pertenece al ADC1, el único banco de ADC que sigue funcionando con Wi-Fi activo (el ADC2 se ve afectado por el radio). Además, 34-39 son pines de **solo entrada** en el ESP32 — no se pueden usar como salida, así que son ideales para un sensor analógico. |
| `PIN_DHT` | 15 | Sensor de temperatura (DHT11/DHT22) | GPIO de uso general, sin restricciones especiales. |
| `PIN_BTN_START` | 32 | Pulsador de arranque local | `INPUT_PULLUP`: el pulsador conecta a GND, el pin lee `LOW` al presionarlo. |
| `PIN_BTN_STOP` | 33 | Pulsador de paro local | Igual que el anterior. |

## Diagrama de conexión (texto)

```text
                         ESP32
                    ┌──────────────┐
   LED verde ───────┤ GPIO 2        │
   LED rojo  ───────┤ GPIO 4        │
   Relevador ───────┤ GPIO 5        │──── módulo relevador ──── (carga real, aparte)
   Buzzer    ───────┤ GPIO 18       │
   Potenc.   ───────┤ GPIO 34 (ADC) │
   DHT       ───────┤ GPIO 15       │
   Pulsador START ──┤ GPIO 32       ├──── GND (con INPUT_PULLUP)
   Pulsador STOP  ──┤ GPIO 33       ├──── GND (con INPUT_PULLUP)
                    └──────────────┘
```

## ⚠️ Advertencias de seguridad

1. **Nunca conecten un motor (ni ninguna carga inductiva) directamente a un GPIO del ESP32.** Un GPIO
   entrega, como máximo, unos cuantos miliamperios — un motor real lo destruiría de inmediato, y una carga
   inductiva puede generar picos de voltaje que dañan el microcontrolador.
2. **Usen siempre un relevador, MOSFET, transistor o driver adecuado** a la corriente y voltaje del motor
   real que vayan a controlar. El `PIN_RELAY` de este proyecto controla la señal de control de ese módulo,
   no la carga en sí.
3. **Verifiquen la polaridad y el voltaje de cualquier sensor** antes de conectarlo — un DHT11/DHT22 mal
   conectado puede dañarse permanentemente.
4. **No alimenten el ESP32 con más voltaje del que su regulador soporta** (normalmente 5V por USB o VIN,
   3.3V en los pines de señal). Un sensor o actuador de 5V en un pin de señal de 3.3V puede dañar el pin.
5. Si tienen dudas sobre una conexión, pregunten antes de energizar el circuito — es mucho más barato
   preguntar que reemplazar un ESP32 o un sensor.

## Sensor de temperatura: real o simulado

`config.h` trae `#define USE_DHT 0` por defecto: el firmware deriva una temperatura simulada a partir de la
velocidad (ver `sensors.h#readTemperature`), así que **compila y funciona sin ningún sensor físico
conectado**. Esto permite probar todo el protocolo HTTP/JSON (Práctica 5) antes de tener el DHT en la mano.
Cuando lo conecten, cambien `USE_DHT` a `1` e instalen la librería "DHT sensor library" (Adafruit).
