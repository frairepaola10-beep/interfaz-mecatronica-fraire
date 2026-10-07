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
#define WIFI_SSID "Totalplay-67B8"
#define WIFI_PASSWORD "67B84BD4zwFgzg2w"

// Puerto HTTP que el ESP32 expone para recibir comandos del backend.
// Debe coincidir con el puerto usado en ESP32_URL (backend/src/config).
#define HTTP_PORT 80

// Identificador de este dispositivo. Debe ser exactamente igual al
// "device" que manda el backend y a config.DEVICE_ID en
// backend/src/config/index.js.
#define DEVICE_ID "motor1"

// ===== Pines =====
#define PIN_LED_GREEN     2
#define PIN_LED_RED       4
#define PIN_RELAY         5
#define PIN_BUZZER        18
#define PIN_POTENTIOMETER 34
#define PIN_DHT           15
#define PIN_BTN_START     32
#define PIN_BTN_STOP      33

// ===== Sensor de temperatura =====
#define USE_DHT 0
#define DHT_TYPE DHT11

// ===== Umbrales de alarma (°C) =====
#define TEMP_WARNING_THRESHOLD 50.0
#define TEMP_CRITICAL_THRESHOLD 70.0