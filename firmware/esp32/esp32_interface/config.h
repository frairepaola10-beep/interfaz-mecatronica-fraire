#pragma once

/**
 * config.h
 *
 * Todo lo que depende del hardware o de la red vive aquí: pines, Wi-Fi,
 * identificador del dispositivo y umbrales de alarma. Es el único archivo
 * que hay que tocar para adaptar el firmware a un cableado distinto o a
 * otra red — el resto del firmware no debería necesitar cambios.
 */

// ===== Red Wi-Fi =====
// Reemplazar con las credenciales del laboratorio antes de cargar el firmware.
#define WIFI_SSID "NOMBRE_DE_TU_RED"
#define WIFI_PASSWORD "CONTRASENA_DE_TU_RED"

// Puerto HTTP que el ESP32 expone para recibir comandos del backend.
// Debe coincidir con el puerto usado en ESP32_URL (backend/src/config).
#define HTTP_PORT 80

// Identificador de este dispositivo. Debe ser exactamente igual al
// "device" que manda el backend y a config.DEVICE_ID en
// backend/src/config/index.js.
#define DEVICE_ID "motor1"

// ===== Pines (ver docs/hardware.md para la tabla completa y el porqué de cada uno) =====
#define PIN_LED_GREEN     2   // Motor en operación
#define PIN_LED_RED       4   // Alarma activa
#define PIN_RELAY         5   // Salida de potencia (NUNCA conectar un motor directo aquí)
#define PIN_BUZZER        18  // Alarma audible
#define PIN_POTENTIOMETER 34  // ADC1 - pin de solo entrada, obligatorio con Wi-Fi activo
#define PIN_DHT           15  // Sensor de temperatura
#define PIN_BTN_START     32  // Pulsador de arranque local (INPUT_PULLUP)
#define PIN_BTN_STOP      33  // Pulsador de paro local (INPUT_PULLUP)

// ===== Sensor de temperatura =====
// Con USE_DHT en 0 (valor de fábrica), el firmware NO requiere la
// librería DHT ni el sensor físico conectado: sensors.h deriva una
// temperatura simulada a partir de la velocidad, igual que hace el
// backend en Modo SIMULACIÓN. Esto permite compilar, cargar y probar
// todo el protocolo HTTP/JSON antes de tener el sensor en la mano.
// Cuando conecten un DHT11/DHT22 de verdad a PIN_DHT, cambien esto a 1
// e instalen la librería "DHT sensor library" (Adafruit) desde el
// gestor de librerías del IDE.
#define USE_DHT 0
#define DHT_TYPE DHT11

// ===== Umbrales de alarma (°C) =====
// Deben coincidir con TEMP_WARNING_THRESHOLD / TEMP_CRITICAL_THRESHOLD de
// backend/src/config/index.js. El ESP32 los usa para encender su propio
// LED/buzzer de inmediato; el backend, al recibir la temperatura, vuelve
// a evaluarla y genera la alarma TEMP_HIGH/TEMP_CRITICAL correspondiente.
#define TEMP_WARNING_THRESHOLD 50.0
#define TEMP_CRITICAL_THRESHOLD 70.0
