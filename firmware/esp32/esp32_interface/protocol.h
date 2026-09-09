#pragma once

#include <Arduino.h>
#include <ArduinoJson.h>
#include "config.h"
#include "sensors.h"
#include "actuators.h"

/**
 * protocol.h — traduce entre el JSON del protocolo (ver
 * shared/json/protocolo.md) y el estado físico del ESP32.
 *
 *   parseCommand()      interpreta el "action"/"value" que llegó del backend.
 *   buildStatusResponse() lee sensores, actualiza LED/buzzer de alarma y
 *                         arma el JSON de respuesta { "state": {...} }.
 *
 * Requiere la librería "ArduinoJson" (Benoit Blanchon), versión 7.x,
 * instalada desde el gestor de librerías del IDE.
 */

// Estado que el ESP32 recuerda mientras está encendido (se pierde si se
// reinicia — para este proyecto didáctico no hace falta persistirlo).
struct MotorState {
  bool running = false;
  int speed = 0; // 0-100 %, confirmado (lo que pidió el último SET_SPEED)
};

static MotorState motorState;

/**
 * Aplica un comando ya extraído del JSON. Devuelve false si la acción no
 * se reconoce.
 *
 * Nótese que esto es una SEGUNDA validación: el backend ya comprobó que
 * el comando fuera válido (middleware/validateCommand.js) antes de
 * reenviarlo aquí, pero el propio ESP32 nunca debe confiar ciegamente en
 * lo que le llega por red.
 *
 * ============================================================
 * TODO (Práctica 5 — exercises/practica-5-esp32/):
 * ============================================================
 * Completa esta función para que interprete las cuatro acciones del
 * protocolo (ver shared/json/protocolo.md):
 *
 *   "START"      -> motorState.running = true; startMotor(); return true;
 *   "STOP"       -> motorState.running = false; stopMotor(); return true;
 *   "SET_SPEED"  -> motorState.speed = value; return true;
 *   "GET_STATUS" -> no cambia nada, solo return true;
 *   cualquier otro valor -> return false;
 *
 * Pista: usa una cadena de "if (action == "...")" — String en Arduino sí
 * soporta el operador "==" para comparar contenido, no solo referencia.
 * ============================================================
 */
bool applyCommand(const String &action, int value) {
  // TODO (Práctica 5): reemplaza esta línea por la lógica descrita arriba.
  return false;
}

/**
 * Lee los sensores, actualiza LED/buzzer de alarma según la temperatura,
 * y arma el JSON de respuesta con la forma que
 * communication.service.js#sendToHardware espera de un ESP32 real:
 * un objeto con una sola clave "state".
 */
String buildStatusResponse() {
  float temperature = readTemperature(motorState.speed, motorState.running);
  bool tempFault = isnan(temperature);

  // El LED/buzzer de alarma responden aquí mismo, en el hardware, sin
  // esperar a que el backend confirme nada — así el operador ve la
  // alarma físicamente aunque la red esté lenta o caída.
  if (!tempFault && temperature >= TEMP_CRITICAL_THRESHOLD) {
    turnAlarmLedOn();
    activateBuzzer();
  } else if (!tempFault && temperature >= TEMP_WARNING_THRESHOLD) {
    turnAlarmLedOn();
    deactivateBuzzer();
  } else {
    turnAlarmLedOff();
    deactivateBuzzer();
  }

  int rawAdc = 0;
  readSpeedReferencePercent(&rawAdc); // lectura informativa del potenciómetro físico

  // ============================================================
  // TODO (Práctica 5 — exercises/practica-5-esp32/):
  // ============================================================
  // Arma aquí el JSON de respuesta con ArduinoJson v7. Debe quedar con
  // esta forma exacta (una sola clave de primer nivel, "state"):
  //
  //   JsonDocument doc;
  //   JsonObject state = doc["state"].to<JsonObject>();
  //   state["running"] = motorState.running;
  //   state["speed"] = motorState.speed;
  //   state["temperature"] = tempFault ? (float)NAN : ...; // ver nota abajo
  //   state["potentiometerAdc"] = rawAdc;
  //   state["relay"] = motorState.running;
  //   state["startButton"] = readStartButton() ? "PRESIONADO" : "LIBRE";
  //   state["stopButton"] = readStopButton() ? "PRESIONADO" : "LIBRE";
  //
  //   String output;
  //   serializeJson(doc, output);
  //   return output;
  //
  // Nota sobre "temperature": si tempFault es true, asigna
  // state["temperature"] = nullptr (para que salga como JSON null, igual
  // que hace SENSOR_FAULT en el backend). Si no, redondea a un decimal:
  // round(temperature * 10) / 10.0.
  //
  // Cómo saber si ya quedó bien: con el ESP32 conectado a Wi-Fi, prueba
  //   curl -X POST http://<IP_DEL_ESP32>/command \
  //        -H "Content-Type: application/json" \
  //        -d '{"device":"motor1","action":"START","value":null}'
  // y confirma que la respuesta tiene la forma de arriba (ver también
  // firmware/README.md, sección "Cómo probarlo sin el frontend").
  // ============================================================
  return "{\"state\":{}}"; // TODO (Práctica 5): reemplaza este return por el de arriba.
}
