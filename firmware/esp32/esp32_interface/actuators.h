#pragma once

#include <Arduino.h>
#include "config.h"

/**
 * actuators.h — todo lo que el ESP32 ESCRIBE hacia el mundo físico.
 *
 * IMPORTANTE (ver README del proyecto, sección 3.8): PIN_RELAY controla
 * un MÓDULO de relevador, nunca un motor conectado directamente al GPIO.
 * Para cargas reales usar siempre un relevador, MOSFET, transistor o
 * driver adecuado a la corriente del motor.
 */

/** Configura los pines de salida y los deja en un estado seguro (todo apagado). */
void initActuators() {
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_RELAY, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  digitalWrite(PIN_LED_GREEN, LOW);
  digitalWrite(PIN_LED_RED, LOW);
  digitalWrite(PIN_RELAY, LOW);
  digitalWrite(PIN_BUZZER, LOW);
}

/** LED verde encendido + relevador activado: "motor en operación". */
void startMotor() {
  digitalWrite(PIN_LED_GREEN, HIGH);
  digitalWrite(PIN_RELAY, HIGH);
}

/** LED verde apagado + relevador desactivado: "motor detenido". */
void stopMotor() {
  digitalWrite(PIN_LED_GREEN, LOW);
  digitalWrite(PIN_RELAY, LOW);
}

void turnAlarmLedOn() {
  digitalWrite(PIN_LED_RED, HIGH);
}

void turnAlarmLedOff() {
  digitalWrite(PIN_LED_RED, LOW);
}

void activateBuzzer() {
  digitalWrite(PIN_BUZZER, HIGH);
}

void deactivateBuzzer() {
  digitalWrite(PIN_BUZZER, LOW);
}
