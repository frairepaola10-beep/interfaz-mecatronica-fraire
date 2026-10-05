#pragma once

#include <Arduino.h>
#include <ArduinoJson.h>
#include "config.h"
#include "sensors.h"
#include "actuators.h"

struct MotorState {
  bool running = false;
  int speed = 0;
};

static MotorState motorState;

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

String buildStatusResponse() {
  float temperature = readTemperature(motorState.speed, motorState.running);
  bool tempFault = isnan(temperature);

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
  readSpeedReferencePercent(&rawAdc);

  JsonDocument doc;

  JsonObject state = doc["state"].to<JsonObject>();

  state["running"] = motorState.running;
  state["speed"] = motorState.speed;

  if (tempFault) {
    state["temperature"] = nullptr;
  } else {
    state["temperature"] = round(temperature * 10) / 10.0;
  }

  state["potentiometerAdc"] = rawAdc;
  state["relay"] = motorState.running;
  state["startButton"] = readStartButton() ? "PRESIONADO" : "LIBRE";
  state["stopButton"] = readStopButton() ? "PRESIONADO" : "LIBRE";

  String output;
  serializeJson(doc, output);

  return output;
}