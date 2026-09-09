#pragma once

#include <Arduino.h>
#include "config.h"

#if USE_DHT
  #include <DHT.h>
  static DHT dht(PIN_DHT, DHT_TYPE);
#endif

/**
 * sensors.h — todo lo que el ESP32 LEE del mundo físico.
 *
 * Con USE_DHT en 0, readTemperature() no lee ningún sensor real: deriva
 * una temperatura a partir de la velocidad actual, con la misma fórmula
 * que usa el motor virtual del backend (ver
 * backend/src/services/simulator.service.js). Así el firmware compila y
 * se puede probar de punta a punta sin tener el sensor conectado.
 */

/**
 * Lee (o simula) la temperatura del motor en °C.
 * Devuelve NAN si la lectura del sensor real falló (para que protocol.h
 * pueda reportarla como null, igual que hace SENSOR_FAULT en el backend).
 */
float readTemperature(int currentSpeedPercent, bool motorRunning) {
#if USE_DHT
  return dht.readTemperature(); // NAN si el DHT no respondió a tiempo
#else
  // "static" para que el valor persista entre llamadas y suba/baje con
  // inercia en vez de saltar de golpe cada vez que se consulta.
  static float simulatedTemp = 25.0;
  float target = motorRunning ? 25.0 + currentSpeedPercent * 0.45 : 25.0;
  simulatedTemp += (target - simulatedTemp) * 0.15;
  return simulatedTemp;
#endif
}

/**
 * Lee el potenciómetro (referencia local de velocidad).
 * @param rawAdcOut  si no es NULL, ahí se guarda la lectura cruda 0-4095.
 * @returns velocidad equivalente, 0-100 %.
 */
int readSpeedReferencePercent(int *rawAdcOut) {
  int raw = analogRead(PIN_POTENTIOMETER); // 0-4095 en el ADC del ESP32
  if (rawAdcOut != NULL) {
    *rawAdcOut = raw;
  }
  return map(raw, 0, 4095, 0, 100);
}

/** true si el pulsador de ARRANQUE local está presionado (activo en bajo con INPUT_PULLUP). */
bool readStartButton() {
  return digitalRead(PIN_BTN_START) == LOW;
}

/** true si el pulsador de PARO local está presionado. */
bool readStopButton() {
  return digitalRead(PIN_BTN_STOP) == LOW;
}
