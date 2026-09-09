# Protocolo JSON — referencia rápida

El contrato de datos completo, campo por campo, vive en
[`solucion/shared/json/protocolo.md`](../solucion/shared/json/protocolo.md) (idéntico en
`shared/json/protocolo.md`) junto con los archivos de ejemplo. Este documento es un
complemento: agrupa la información que hace falta para entender el protocolo como un todo, más que campo
por campo.

## Los tres tipos de mensaje

| Mensaje | Dirección | Archivo de ejemplo |
|---|---|---|
| Comando | Frontend/Backend → ESP32 | `command-example.json`, `command-set-speed.json` |
| Respuesta | ESP32/Backend → Frontend | `response-ok.json`, `response-alarm.json`, `response-error.json` |
| Telemetría | ESP32 → Backend (lectura instantánea) | `telemetry.json` |

## Tabla completa de alarmas

| Código | Severidad | Descripción | ¿Dónde se genera? |
|---|---|---|---|
| `TEMP_HIGH` | WARNING | Temperatura elevada | `backend/src/services/alarm.service.js#evaluateTemperature` |
| `TEMP_CRITICAL` | CRITICAL | Temperatura crítica | `backend/src/services/alarm.service.js#evaluateTemperature` |
| `COMM_LOST` | CRITICAL | Pérdida de comunicación | `backend/src/services/communication.service.js` (detecta la desconexión) + `alarm.service.js#commLostAlarm` (arma el objeto) |
| `INVALID_COMMAND` | WARNING | Comando inválido | `backend/src/middleware/validateCommand.js` |
| `DEVICE_FAULT` | CRITICAL | Falla del dispositivo | `backend/src/services/alarm.service.js#deviceFaultAlarm`, disparada por el escenario `DEVICE_FAULT` |

Los umbrales de temperatura (`TEMP_WARNING_THRESHOLD`, `TEMP_CRITICAL_THRESHOLD`) son didácticos y se
configuran en `backend/src/config/index.js` — se pueden modificar libremente durante las prácticas.

## Reglas que todo el protocolo respeta

1. **Un comando nunca "sabe" si es simulado o real.** El mismo `{"device":"motor1","action":"START"}` sirve
   sin cambios en Modo Simulación y en Modo Hardware.
2. **`success: false` implica `state` en `null`.** Si el backend no puede confirmar el estado real, no debe
   reportar un valor inventado — ver `shared/json/response-error.json`.
3. **Una alarma no es lo mismo que un error.** `success: true` con `alarms` no vacío es perfectamente válido:
   el comando se ejecutó, pero el sistema detectó algo anormal mientras lo hacía.
4. **`transactionId` conecta un comando con su respuesta.** Lo genera `backend/src/middleware/requestId.js`,
   no el frontend — por eso el panel "JSON ENVIADO" muestra "Solicitud pendiente…" hasta que llega la
   respuesta.

## Cómo se prueba el protocolo sin escribir código

Con `curl`, contra cualquiera de los dos backends (`solucion/` o `plantilla-alumno/`, ya con
`npm start` corriendo):

```bash
curl -X POST http://localhost:3000/api/device/command \
  -H "Content-Type: application/json" \
  -d '{"device":"motor1","action":"SET_SPEED","value":75}'
```

Ver `docs/api-rest.md` para la lista completa de endpoints y más ejemplos.
