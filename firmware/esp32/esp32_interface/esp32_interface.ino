/**
 * esp32_interface.ino — Práctica 5: Integración con ESP32.
 *
 * Levanta un servidor HTTP en el ESP32 que expone POST /command: recibe
 * el mismo JSON que describe shared/json/protocolo.md, lo ejecuta sobre
 * el hardware real (LEDs, relevador, buzzer, potenciómetro, sensor de
 * temperatura, pulsadores) y responde con el estado confirmado.
 *
 * El backend, cuando MODE=HARDWARE, es quien le hace este POST — ver
 * backend/src/services/communication.service.js (función sendToHardware).
 * Mientras MODE=SIMULATION (valor por defecto), este archivo no se usa:
 * el backend simula el motor internamente con simulator.service.js.
 *
 * Librerías requeridas (gestor de librerías del IDE):
 *   - "ArduinoJson" de Benoit Blanchon, versión 7.x
 *   - Paquete de placas "esp32" de Espressif (para WiFi.h y WebServer.h)
 *   - Opcional: "DHT sensor library" (Adafruit), solo si USE_DHT = 1 en config.h
 */

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

#include "config.h"
#include "sensors.h"
#include "actuators.h"
#include "protocol.h"

WebServer server(HTTP_PORT);

/** Responde con un error de formato uniforme, igual al que usa el backend. */
void sendInvalidCommand() {
  server.send(400, "application/json", "{\"success\":false,\"error\":\"INVALID_COMMAND\"}");
}

/**
 * Manejador de POST /command.
 * 1. Parsea el JSON del cuerpo de la solicitud.
 * 2. Verifica que el "device" sea el de este ESP32.
 * 3. Aplica el comando (protocol.h).
 * 4. Responde con el estado confirmado, ya leído de los sensores reales.
 */
void handleCommand() {
  if (!server.hasArg("plain")) {
    sendInvalidCommand();
    return;
  }

  JsonDocument request;
  DeserializationError error = deserializeJson(request, server.arg("plain"));
  if (error) {
    sendInvalidCommand();
    return;
  }

  String device = request["device"] | "";
  String action = request["action"] | "";
  int value = request["value"] | 0;

  if (device != DEVICE_ID) {
    sendInvalidCommand();
    return;
  }

  if (!applyCommand(action, value)) {
    sendInvalidCommand();
    return;
  }

  server.send(200, "application/json", buildStatusResponse());
}

void handleNotFound() {
  server.send(404, "application/json", "{\"success\":false,\"error\":\"NOT_FOUND\"}");
}

void setup() {
  Serial.begin(115200);

  pinMode(PIN_BTN_START, INPUT_PULLUP);
  pinMode(PIN_BTN_STOP, INPUT_PULLUP);
  initActuators();

  Serial.printf("Conectando a Wi-Fi \"%s\"...\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Conectado. IP del ESP32: ");
  Serial.println(WiFi.localIP());
  Serial.println("Configura esta IP como ESP32_URL en el backend (Modo HARDWARE).");

  server.on("/command", HTTP_POST, handleCommand);
  server.onNotFound(handleNotFound);
  server.begin();
  Serial.printf("Servidor HTTP escuchando en el puerto %d\n", HTTP_PORT);
}

void loop() {
  // Atiende las solicitudes HTTP entrantes. No se usa delay() aquí para
  // no perder solicitudes del backend mientras se espera.
  server.handleClient();
}
