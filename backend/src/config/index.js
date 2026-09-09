'use strict';

/**
 * Configuración central del backend.
 *
 * Todo lo que pueda cambiar entre un laboratorio y otro (puerto, modo de
 * trabajo, dirección del ESP32, umbrales de alarma) vive aquí, leído de
 * variables de entorno con valores por defecto razonables para que el
 * proyecto corra "de fábrica" sin configurar nada.
 */

const config = {
  // Puerto HTTP del propio backend.
  PORT: Number(process.env.PORT) || 3000,

  // 'SIMULATION' -> el backend simula el motor y el ESP32 (por defecto).
  // 'HARDWARE'   -> el backend habla por HTTP con un ESP32 real.
  // Ver Práctica 5 (exercises/practica-5-esp32).
  MODE: process.env.MODE || 'SIMULATION',

  // Dirección base del ESP32 cuando MODE = 'HARDWARE'.
  ESP32_URL: process.env.ESP32_URL || 'http://192.168.1.50',

  // Tiempo máximo (ms) que el backend espera una respuesta del ESP32
  // antes de reportar COMM_LOST. Ver alarm.service.js.
  COMMAND_TIMEOUT_MS: Number(process.env.COMMAND_TIMEOUT_MS) || 3000,

  // Cada cuántos milisegundos "late" el motor virtual en modo simulación.
  SIMULATION_TICK_MS: Number(process.env.SIMULATION_TICK_MS) || 1000,

  // Umbrales de temperatura (°C) que disparan las alarmas TEMP_HIGH y
  // TEMP_CRITICAL. Son didácticos: se pueden modificar durante la práctica.
  TEMP_WARNING_THRESHOLD: Number(process.env.TEMP_WARNING_THRESHOLD) || 50,
  TEMP_CRITICAL_THRESHOLD: Number(process.env.TEMP_CRITICAL_THRESHOLD) || 70,

  // Único dispositivo soportado por este proyecto didáctico.
  DEVICE_ID: 'motor1',
};

module.exports = config;
