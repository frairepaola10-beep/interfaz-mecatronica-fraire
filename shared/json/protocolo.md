# Protocolo JSON — Interfaz Mecatrónica

Este documento describe el contrato de datos que viaja entre el **frontend**, el **backend** y el **ESP32**.
Todos los mensajes son JSON puro sobre HTTP. Ningún lado del sistema debe asumir campos que no estén aquí
descritos.

---

## 1. Comando (Frontend/Backend → ESP32)

Archivo de ejemplo: [`command-example.json`](command-example.json), [`command-set-speed.json`](command-set-speed.json).

```json
{
  "device": "motor1",
  "action": "START",
  "value": null
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `device` | string | sí | Identificador del dispositivo. Único valor válido en este proyecto: `"motor1"`. |
| `action` | string | sí | Una de: `START`, `STOP`, `SET_SPEED`, `GET_STATUS`. |
| `value` | number \| null | sí (puede ser `null`) | Solo se usa con `SET_SPEED`, rango `0`–`100`. Para las demás acciones debe ser `null`. |

---

## 2. Respuesta OK (ESP32/Backend → Frontend)

Archivo de ejemplo: [`response-ok.json`](response-ok.json).

| Campo | Tipo | Descripción |
|---|---|---|
| `success` | boolean | `true` si el comando fue recibido, validado y ejecutado. |
| `transactionId` | string | Identificador de la solicitud, formato `CMD-###`. Permite emparejar la respuesta con el comando que la originó — es el número que se muestra como "Solicitud #" en la interfaz. |
| `device` | string | Eco del dispositivo que respondió. |
| `communication.connected` | boolean | Si el backend logró comunicarse con el ESP32 en esta solicitud. |
| `communication.latencyMs` | number \| null | Tiempo de ida y vuelta medido por el backend. |
| `state.running` | boolean \| null | Estado confirmado del motor. `null` si no se pudo determinar. |
| `state.speed` | number \| null | Velocidad confirmada, 0–100 %. |
| `state.temperature` | number \| null | Temperatura confirmada, °C. |
| `alarms` | array | Lista de alarmas activas en el momento de la respuesta. Vacía si no hay ninguna. |
| `message` | string | Texto legible para mostrar en la interfaz. |

**Campos adicionales de `state`** (no forman parte del mínimo anterior, pero la implementación de
`solucion/` los incluye porque el panel "Variables del proceso" del frontend los necesita — son las mismas
lecturas crudas que aparecen en `telemetry.json.raw`):

| Campo | Tipo | Descripción |
|---|---|---|
| `state.potentiometerAdc` | number | Lectura cruda del ADC del potenciómetro, 0–4095. |
| `state.relay` | boolean | Si el relevador de salida está activado. |
| `state.startButton` | string | `"LIBRE"` o `"PRESIONADO"`, pulsador local de arranque. |
| `state.stopButton` | string | `"LIBRE"` o `"PRESIONADO"`, pulsador local de paro. |

---

## 3. Respuesta con alarma

Archivo de ejemplo: [`response-alarm.json`](response-alarm.json).

Tiene la misma forma que la respuesta OK, pero `alarms` contiene uno o más objetos:

```json
{
  "code": "TEMP_HIGH",
  "severity": "WARNING",
  "message": "Temperatura elevada"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `code` | string | Código de alarma. Ver tabla completa en [`docs/protocolo-json.md`](../../../docs/protocolo-json.md). |
| `severity` | string | `WARNING` o `CRITICAL`. |
| `message` | string | Descripción para mostrar al usuario. |

`success` puede seguir siendo `true`: una alarma **no** significa que el comando falló, significa que el
sistema detectó una condición anormal mientras lo ejecutaba.

---

## 4. Respuesta de error

Archivo de ejemplo: [`response-error.json`](response-error.json).

Cuando `success` es `false`, los campos de `state` se reportan como `null` porque el backend no puede
garantizar el estado real del dispositivo (por ejemplo, si se perdió la comunicación). La interfaz debe
mostrar `—` para esos valores, nunca el último valor conocido como si siguiera vigente.

---

## 5. Telemetría

Archivo de ejemplo: [`telemetry.json`](telemetry.json).

Mensaje que representa una lectura instantánea del sistema físico, incluyendo valores "crudos" además del
estado ya interpretado (`raw`). Útil para la Práctica 5 al depurar lecturas de sensores.

---

## 6. Regla fundamental

Ningún lado de la interfaz debe **inventar** un estado. El frontend solo puede mostrar como confirmado lo
que llegó dentro de `state` en una respuesta con `success: true`. Ver `docs/arquitectura.md` sección
"Regla fundamental de la interfaz".
