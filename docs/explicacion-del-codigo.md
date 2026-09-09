# Explicación del código — guion para clase

Este documento recorre, archivo por archivo, las tres capas del proyecto (`shared/json`, `frontend`,
`backend`, `firmware`). Para cada uno: qué hace, por qué existe, sus funciones/piezas clave, y en qué
práctica se toca. Está pensado para proyectarse y explicarse en voz alta, no como referencia de API — para
eso están `docs/api-rest.md` y `shared/json/protocolo.md`.

Todo lo descrito aquí existe igual en `solucion/` y en `plantilla-alumno/` (misma estructura, mismos
nombres de archivo); la única diferencia son los `TODO` de la plantilla, señalados donde corresponde.

---

## Tabla resumen (para proyectar)

| Archivo | Responsabilidad en una frase | Práctica relacionada |
|---|---|---|
| `shared/json/*.json` | Ejemplos concretos del protocolo | Práctica 1 |
| `frontend/index.html` | Estructura visual de la pantalla | — (dado) |
| `frontend/css/styles.css` | Apariencia: colores por estado, layout | — (dado) |
| `frontend/js/config.js` | Constantes de configuración del frontend | — (dado) |
| `frontend/js/state.js` | Único lugar donde vive "lo que el frontend sabe" | — (dado) |
| `frontend/js/api.js` | Única capa que hace `fetch()` | Práctica 3 |
| `frontend/js/ui.js` | Única capa que toca el DOM | Práctica 2 |
| `frontend/js/app.js` | Orquestador: botones → comandos → fases → estado | Práctica 3 |
| `backend/server.js` | Punto de arranque del backend | — (dado) |
| `backend/src/app.js` | Construye la app Express (middleware, estáticos, rutas) | — (dado) |
| `backend/src/config/index.js` | Configuración centralizada (puerto, modo, umbrales) | — (dado) |
| `backend/src/routes/*.js` | Qué URL va a qué controller | — (dado) |
| `backend/src/middleware/requestId.js` | Genera `CMD-001`, `CMD-002`, ... | — (dado) |
| `backend/src/middleware/validateCommand.js` | Rechaza comandos inválidos antes de ejecutarlos | Práctica 4 |
| `backend/src/middleware/logger.js` | Traza en consola de cada solicitud | — (dado) |
| `backend/src/middleware/errorHandler.js` | Red de seguridad ante errores inesperados | — (dado) |
| `backend/src/controllers/device.controller.js` | Traduce HTTP ↔ llamadas a services | — (dado) |
| `backend/src/services/device.service.js` | Orquesta ejecución de un comando ya validado | — (dado) |
| `backend/src/services/communication.service.js` | Decide y ejecuta CÓMO hablar con el dispositivo | Práctica 6 |
| `backend/src/services/alarm.service.js` | Decide qué es una alarma y guarda el historial | Práctica 2 / 6 |
| `backend/src/services/simulator.service.js` | El "motor virtual" (Modo Simulación) | — (dado) |
| `backend/src/schemas/*.js` | Definición estática del contrato (qué es válido) | — (dado) |
| `firmware/.../esp32_interface.ino` | Programa principal del ESP32: Wi-Fi + servidor HTTP | — (dado) |
| `firmware/.../config.h` | Pines, Wi-Fi, umbrales | — (dado) |
| `firmware/.../sensors.h` | Todo lo que el ESP32 lee | — (dado) |
| `firmware/.../actuators.h` | Todo lo que el ESP32 escribe | — (dado) |
| `firmware/.../protocol.h` | Traduce JSON ↔ estado físico del ESP32 | Práctica 5 |

---

## 1. `shared/json/` — el protocolo, en ejemplos

No es código: son los documentos que definen "de qué hablamos" antes de escribir una sola línea de
frontend o backend. `protocolo.md` describe cada campo; los `.json` son ejemplos concretos de cada tipo de
mensaje (comando, respuesta OK, respuesta con alarma, respuesta de error, telemetría). Practica 1 trabaja
exclusivamente aquí.

---

## 2. Frontend

### `index.html`

La estructura fija de la pantalla: header, menú lateral, franja de flujo, las tres tarjetas principales
(Motor, Variables del proceso, Alarmas) y los dos paneles JSON. Usa atributos `data-bind="..."` en cada
elemento que el JavaScript necesita actualizar — así `ui.js` encuentra los elementos por nombre lógico
("motorStateText") en vez de por selectores CSS frágiles.

### `css/styles.css`

Define el tema oscuro tipo HMI y, sobre todo, los **tokens de color por estado**: verde (normal/conectado),
amarillo (advertencia), rojo (crítico/error), gris (detenido/desconocido), azul (información/selección).
`ui.js` nunca decide un color a mano — solo agrega o quita clases CSS (`badge--running`, `is-failed`, etc.)
y es esta hoja de estilos la que decide cómo se ven.

### `js/config.js`

Tres constantes: dónde está el backend (`API_BASE`), cada cuánto se sondea el estado (`POLL_INTERVAL_MS`) y
cuánto espera el frontend una respuesta antes de darla por perdida (`REQUEST_TIMEOUT_MS`). Cambiar estos
valores no requiere tocar ningún otro archivo.

### `js/state.js`

Un patrón de publicación/suscripción muy simple: un objeto `state` en memoria, una función `setState(patch)`
que lo actualiza y notifica a quien esté suscrito, y `getState()` para leerlo. `app.js` es el único que
llama a `setState()`; `ui.js` se suscribe una sola vez, al arrancar, para redibujar la pantalla completa
cada vez que algo cambia.

### `js/api.js`

La única capa que sabe hacer `fetch()`. La función interna `request()` centraliza el timeout (con
`AbortController`) y el manejo de errores de red, para que las funciones públicas (`sendCommand`,
`getStatus`, `getAlarms`, `getHealth`, `setScenario`) sean solo una línea cada una. **Práctica 3:**
completar `sendCommand()`, que es literalmente "armar y enviar el JSON" del comando.

### `js/ui.js`

La única capa que toca `document.*`. Cachea los elementos marcados con `data-bind`/`data-flow` una sola vez
al cargar, y expone funciones puras como `applyState(state)` (redibuja toda la pantalla),
`activateFlowStep(nombre, clase)` (resalta un paso de la franja de flujo) y `highlightJson(valor)` (el
resaltador de sintaxis JSON escrito a mano, sin librerías — esta sí viene ya resuelta). **Práctica 2:**
completar `showSentJson()`/`showReceivedJson()` (Actividad 1 — pintar los paneles JSON enviado/recibido) y
`renderMotor()`, `renderProcess()`, `renderAlarms()` (Actividades 2-5 — la traducción de ese JSON a
texto/color en pantalla).

### `js/app.js`

El coordinador: detecta clics, arma comandos, llama a `api.js`, y decide cuándo llamar a `ui.js`. Contiene
la función más importante del proyecto para entender la "regla fundamental de la interfaz":
`runCommand()`, que recorre las tres fases visuales (Enviando → Esperando confirmación → Confirmado/Fallido)
y solo actualiza el estado real del motor (`applyConfirmedState()`) después de recibir
`response.success === true`. También tiene el lazo de sondeo periódico (`poll()`), que mantiene la pantalla
actualizada sin que el usuario haga nada. **Práctica 3:** completar los manejadores de botones y la lógica
de la Fase 3.

---

## 3. Backend

### `server.js`

El punto de entrada: construye la app (`src/app.js`), arranca el "latido" del motor virtual si
`MODE=SIMULATION`, y levanta el servidor HTTP. Diez líneas, ninguna lógica de negocio.

### `src/app.js`

Arma la aplicación Express: CORS mínimo, `express.json()` (para poder leer `req.body`), el logger, los
archivos estáticos del frontend, las rutas bajo `/api`, y al final el manejador de errores. El orden de
`app.use(...)` importa: por ejemplo, `errorHandler` debe ir al final para capturar errores de todo lo
anterior.

### `src/config/index.js`

Todo lo que puede cambiar entre laboratorios (puerto, modo, URL del ESP32, umbrales de alarma, tiempo de
timeout) leído de variables de entorno con valores por defecto. Un solo lugar para buscar cualquier
"número mágico" del backend.

### `src/routes/index.js` y `device.routes.js`

Definen qué URL le corresponde a qué controller. `device.routes.js` además aplica `requestId` (para todas
las rutas de dispositivo) y `validateCommand` (solo para `POST /command`).

### `src/middleware/requestId.js`

Un contador que genera `CMD-001`, `CMD-002`, etc., y lo deja en `req.transactionId`. Es lo que la interfaz
muestra como "Solicitud #".

### `src/middleware/validateCommand.js`

El filtro de entrada: comprueba que `device`, `action` y `value` cumplan el contrato antes de dejar pasar
la solicitud. Si algo falla, responde `400` de inmediato — el comando nunca llega a ejecutarse.
**Práctica 4**, completa.

### `src/middleware/logger.js`

Imprime en la terminal del backend cada solicitud que entra y con qué código/tiempo se respondió. Es la
forma más simple de "ver" el protocolo funcionando sin abrir las herramientas de red del navegador.

### `src/middleware/errorHandler.js`

Red de seguridad: si algo lanza una excepción no controlada en cualquier controller/service, esto evita que
el proceso se caiga y devuelve un JSON de error uniforme en vez de un stack trace.

### `src/controllers/device.controller.js`

Traduce entre `req`/`res` de Express y llamadas a los services. No tiene lógica de negocio — decide, como
mucho, qué código de estado HTTP usar (`200` vs `503`) según lo que el service devuelva.

### `src/services/device.service.js`

Orquesta la ejecución de un comando ya validado: le pide a `communication.service.js` que hable con el
dispositivo, evalúa alarmas con `alarm.service.js` sobre el resultado, registra un evento y arma la
respuesta final con `schemas/response.schema.js`.

### `src/services/communication.service.js`

La única parte del backend que sabe si está hablando con el motor virtual o con un ESP32 real — decisión
que toma en una sola línea (`config.MODE === 'HARDWARE'`). El resto del sistema no distingue entre ambos
casos. **Práctica 6:** completar la detección de `COMM_LOST` y `TIMEOUT` dentro de `sendToSimulation()`.

### `src/services/alarm.service.js`

Decide qué alarmas están activas (comparando temperatura contra umbrales) y mantiene el historial de
eventos que alimenta el panel "Alarmas y eventos". **Práctica 2/6:** completar `evaluateTemperature()`.

### `src/services/simulator.service.js`

El "motor virtual": mantiene el estado físico simulado (velocidad, temperatura con inercia, ADC del
potenciómetro, relevador, pulsadores) y avanza un paso cada vez que se llama a `tick()`. También interpreta
los escenarios forzados de la Práctica 6 (`TEMP_HIGH`, `SENSOR_FAULT`, etc.).

### `src/schemas/command.schema.js` y `response.schema.js`

Definiciones estáticas: qué dispositivos y acciones son válidos, y constructores de las tres formas de
respuesta (éxito, error, error de validación). Mantener esto separado de la lógica que los usa permite
reutilizar exactamente las mismas reglas en `validateCommand.js` y en los tests.

### `tests/*.test.js` y `tests/run-all.js`

Los `*.test.js` usan el runner de pruebas nativo de Node (`node:test`, sin dependencias extra) para
verificar el contrato de respuesta, la validación y la evaluación de alarmas, levantando la app completa en
un puerto efímero. Los mismos archivos existen en `solucion/` (donde pasan) y en `plantilla-alumno/` (donde
van pasando a medida que se completan las prácticas).

`run-all.js` es el script que `npm test` realmente ejecuta: en vez de `node --test <carpeta>`, invoca cada
archivo por separado con `node archivo.test.js` y junta los resultados. Existe por un bug intermitente del
orquestador de `node --test` en Node 22 (falla el canal de comunicación entre el proceso principal y los
procesos hijo); ejecutar cada archivo directamente evita ese canal y resultó, en la práctica, 100% estable.

---

## 4. Firmware

### `esp32_interface.ino`

El programa principal: conecta a Wi-Fi, levanta un servidor HTTP (`WebServer`) con una sola ruta
(`POST /command`), y en el `loop()` solo atiende esas solicitudes. Toda la lógica de negocio vive en los
`.h` — este archivo es puro "cableado" entre las piezas.

### `config.h`

Pines, credenciales Wi-Fi, identificador del dispositivo, umbrales de alarma, y el interruptor `USE_DHT`
que decide si el firmware usa un sensor real o simula la temperatura (para poder compilar y probar sin
tener el sensor conectado).

### `sensors.h`

Todo lo que el ESP32 **lee**: temperatura (real o simulada, según `USE_DHT`), potenciómetro y los dos
pulsadores locales.

### `actuators.h`

Todo lo que el ESP32 **escribe**: LEDs, relevador y buzzer. `startMotor()`/`stopMotor()` encapsulan qué
pines se activan para representar cada estado.

### `protocol.h`

El puente entre el JSON del protocolo y el estado físico: `applyCommand()` interpreta la acción recibida,
y `buildStatusResponse()` lee los sensores y arma el JSON de respuesta con la misma forma que espera
`communication.service.js#sendToHardware`. **Práctica 5:** ambas funciones están incompletas en la
plantilla.

---

## Cómo usar este documento en clase

Una forma probada de recorrerlo: proyectar la tabla resumen, pedir a los estudiantes que ubiquen en qué fila
está la práctica que están a punto de empezar, y luego leer juntos la sección correspondiente antes de que
abran el editor de código. Para las prácticas que involucran dos archivos (2, 3, 6), vale la pena dibujar en
el pizarrón la flecha que los conecta (por ejemplo: `alarm.service.js` decide → `ui.js` pinta).
