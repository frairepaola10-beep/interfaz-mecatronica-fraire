# Arquitectura del proyecto

## El flujo completo

```text
USUARIO
   ↓
FRONTEND               (HTML + CSS + JavaScript vanilla)
   ↓
JSON / HTTP
   ↓
BACKEND / API           (Node.js + Express)
   ↓
JSON / HTTP
   ↓
ESP32                   (firmware Arduino, o motor virtual en Modo Simulación)
   ↓
SENSORES Y ACTUADORES
   ↓
ESP32
   ↓
JSON DE RESPUESTA
   ↓
BACKEND
   ↓
FRONTEND
   ↓
ACTUALIZACIÓN DE LA INTERFAZ
```

Cada flecha de este diagrama es, literalmente, una llamada de función o una solicitud HTTP en el código —
ver `docs/explicacion-del-codigo.md` para el mapa archivo por archivo.

## Las tres capas

### 1. Frontend (`frontend/`)

No tiene lógica de negocio: solo sabe (a) qué botón se presionó, (b) construir el JSON correspondiente,
(c) enviarlo y (d) pintar en pantalla lo que el backend confirme. Nunca decide por sí mismo si un comando
"funcionó" — eso lo dice siempre el backend.

### 2. Backend (`backend/`)

Es el único punto de decisión del sistema:

- **Valida** cada comando antes de ejecutarlo (`middleware/validateCommand.js`).
- **Decide** cómo comunicarse con el dispositivo — motor virtual o ESP32 real — sin que el resto del código
  note la diferencia (`services/communication.service.js`).
- **Evalúa** si el estado reportado amerita una alarma (`services/alarm.service.js`).
- **Arma** la respuesta con una forma consistente, sea éxito, alarma o error (`schemas/response.schema.js`).

### 3. Firmware (`firmware/`)

Es el único que toca hardware de verdad: LEDs, relevador, buzzer, potenciómetro, sensor de temperatura,
pulsadores. Habla el mismo protocolo JSON que el resto del sistema, así que desde el punto de vista del
backend, es intercambiable con el motor virtual.

## Modos de trabajo

```text
MODO 1 — SIMULACIÓN (por defecto)          MODO 2 — HARDWARE

Frontend                                   Frontend
   ↓                                          ↓
Backend                                    Backend
   ↓                                          ↓
simulator.service.js (motor virtual)       ESP32 real, por HTTP
```

El cambio entre ambos modos es **una variable de entorno** (`MODE=SIMULATION` o `MODE=HARDWARE`, ver
`backend/src/config/index.js`) y una sola línea de código en
`backend/src/services/communication.service.js#sendCommand()`. Ni el frontend ni las rutas del backend
cambian entre un modo y otro — esa es la razón de ser de tener una capa `communication.service.js` separada
de `device.service.js`.

## Por qué está dividido así (y no de otra forma)

| Decisión de diseño | Por qué |
|---|---|
| `routes` → `controllers` → `services` | Cada capa tiene una sola responsabilidad: rutas dicen "qué URL", controllers dicen "qué hacer con la solicitud HTTP", services tienen la lógica real. Facilita probar `services` sin necesidad de un servidor HTTP corriendo. |
| `communication.service.js` separado de `device.service.js` | Es el punto exacto donde se decide Simulación vs. Hardware. Si esa decisión estuviera mezclada en `device.service.js`, cambiar de modo implicaría tocar lógica de negocio. |
| `ui.js` es la única capa que toca el DOM | Si mañana cambia el diseño visual completo, solo se toca ese archivo — `app.js` y `api.js` no saben (ni deberían saber) qué aspecto tiene la pantalla. |
| El backend sirve el frontend como estático | Evita problemas de CORS durante el desarrollo normal; el proyecto sigue funcionando si el frontend se abre desde otro origen (hay un CORS mínimo en `app.js` para ese caso). |
| Dos proyectos independientes (`solucion/` y `plantilla-alumno/`) | Permiten comparar una implementación de referencia contra el trabajo del alumno sin que uno dependa del otro para funcionar. |

## Regla fundamental de la interfaz

La interfaz **nunca** debe asumir que un comando se ejecutó correctamente solo porque el usuario lo pidió.

```text
INCORRECTO                              CORRECTO

Usuario presiona ARRANCAR               Usuario presiona ARRANCAR
       ↓                                       ↓
Frontend muestra de inmediato:          Frontend envía el comando
"MOTOR ENCENDIDO"                              ↓
                                         Backend → ESP32 → confirmación
                                                ↓
                                         Backend responde
                                                ↓
                                         Frontend muestra:
                                         "MOTOR ENCENDIDO"
```

En el código, esto se traduce en una regla muy concreta: **el único lugar del frontend que actualiza el
estado visible del motor es `applyConfirmedState()` en `app.js`, y esa función solo se llama después de
recibir `response.success === true` del backend.** Ver el comentario extenso al inicio de `app.js` y la
sección "Fase 3" dentro de `runCommand()`.
