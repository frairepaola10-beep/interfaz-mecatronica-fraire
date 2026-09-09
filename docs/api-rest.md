# API REST — referencia de endpoints

Base URL en desarrollo: `http://localhost:3000` (mismo backend que sirve el frontend).

## `POST /api/device/command`

Envía un comando al dispositivo (real o simulado, según `MODE`).

```bash
curl -X POST http://localhost:3000/api/device/command \
  -H "Content-Type: application/json" \
  -d '{"device":"motor1","action":"START","value":null}'
```

| Código | Cuándo |
|---|---|
| `200` | El comando se ejecutó y hubo comunicación con el dispositivo (puede traer alarmas igual). |
| `400` | El comando no pasó la validación (`middleware/validateCommand.js`) — nunca llegó a ejecutarse. |
| `503` | El comando pasó la validación, pero no hubo forma de comunicarse con el dispositivo. |

Acciones válidas: `START`, `STOP`, `SET_SPEED` (requiere `value` numérico 0-100), `GET_STATUS`.

## `GET /api/device/status`

Equivale a enviar un `GET_STATUS` — usado por el sondeo periódico del frontend.

```bash
curl http://localhost:3000/api/device/status
```

## `GET /api/device/alarms`

Historial de eventos y alarmas recientes (más nuevo primero).

```bash
curl http://localhost:3000/api/device/alarms
```

```json
{ "history": [ { "timestamp": "2026-09-08T10:32:15.000Z", "message": "Motor arrancado correctamente" } ] }
```

## `GET /api/health`

Estado de conectividad, usado por el header de la interfaz.

```bash
curl http://localhost:3000/api/health
```

```json
{ "backend": true, "esp32Connected": true, "mode": "SIMULATION" }
```

## `POST /api/simulation/scenario`

Solo tiene efecto en Modo Simulación. Fuerza una condición del motor virtual, para la Práctica 6.

```bash
curl -X POST http://localhost:3000/api/simulation/scenario \
  -H "Content-Type: application/json" -d '{"scenario":"TEMP_CRITICAL"}'
```

Escenarios válidos: `NORMAL`, `TEMP_HIGH`, `TEMP_CRITICAL`, `COMM_LOST`, `DEVICE_FAULT`, `SENSOR_FAULT`,
`TIMEOUT` (ver `backend/src/mocks/scenarios.js`).

## Endpoint que expone el ESP32 (no del backend)

`POST /command`, en el propio ESP32 (puerto configurado en `firmware/.../config.h`, por defecto 80). Es lo
que `communication.service.js#sendToHardware` invoca cuando `MODE=HARDWARE`. Ver
`firmware/README.md` para probarlo directamente.
