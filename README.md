# Interfaz Mecatrónica — Plantilla del Alumno

Proyecto para la materia **Diseño de Interfaces Mecatrónicas**. Simula (y opcionalmente controla) un motor
eléctrico supervisado a través de una interfaz web, un backend en Node.js y un ESP32.

```text
USUARIO → FRONTEND → JSON/HTTP → BACKEND → JSON/HTTP → ESP32 → SENSORES/ACTUADORES
                                                                        ↓
FRONTEND ← ACTUALIZACIÓN ← BACKEND ← JSON DE RESPUESTA ← ESP32 ←───────┘
```

Este repositorio ya trae **la mayor parte resuelta** — pero varias piezas clave están incompletas, marcadas
con `// TODO (Práctica N):` y una pista. El objetivo del semestre es que tú las completes, en el orden en
que van apareciendo las prácticas.

## Estructura

```text
.
├── frontend/     HTML + CSS + JavaScript vanilla (tema HMI oscuro)
├── backend/      Node.js + Express — API REST, validación, simulación, alarmas
├── firmware/     Firmware ESP32 (Arduino) — Práctica 5
├── shared/json/  Ejemplos del protocolo JSON + protocolo.md
├── exercises/    Las 6 prácticas de la materia, cada una con su README y un .md por actividad
└── docs/         Documentación: arquitectura, protocolo JSON, API REST, hardware, instalación, glosario,
                  rúbrica y explicacion-del-codigo.md (qué hace cada archivo)
```

## Qué está completo y qué falta

| Archivo | Qué falta | Práctica |
|---|---|---|
| `frontend/js/ui.js` | Pintar los paneles JSON, el estado del motor, las variables del proceso y las alarmas en pantalla | Práctica 2 |
| `frontend/js/app.js` | Construir los comandos JSON de los botones y completar la Fase 3 (confirmación) | Práctica 3 |
| `frontend/js/api.js` | Armar y enviar la solicitud `POST /api/device/command` | Práctica 3 |
| `backend/src/middleware/validateCommand.js` | Toda la validación de comandos | Práctica 4 |
| `backend/src/services/alarm.service.js` | Evaluación de umbrales de temperatura | Práctica 2 / Práctica 6 |
| `backend/src/services/communication.service.js` | Detección de `COMM_LOST` y `TIMEOUT` | Práctica 6 |
| `firmware/esp32/esp32_interface/protocol.h` | Interpretar el comando y armar el JSON de respuesta | Práctica 5 |

Todo lo demás (HTML, CSS, rutas, schemas, mocks, `server.js`, pines del firmware, etc.) ya está resuelto:
no deberías necesitar tocarlo para completar las prácticas.

## Por dónde empezar

1. Lee `docs/arquitectura.md` para entender el flujo completo.
2. Lee `docs/explicacion-del-codigo.md` para entender qué hace cada archivo.
3. Empieza las prácticas en `exercises/practica-1-json/README.md`.

## Cómo correrlo

```bash
cd backend
npm install
npm start
```

Abrir `http://localhost:3000` — el backend sirve el frontend como archivos estáticos, así que no hace falta
levantar un servidor aparte. Corre en **Modo SIMULACIÓN** por defecto: no requiere ningún ESP32 conectado.

Con los TODOs sin completar, la página carga sin errores fatales, pero:

- el panel **"Motor Principal"** y **"Variables del proceso"** se quedan en sus valores de arranque (porque
  `ui.js` todavía no sabe pintarlos) aunque el panel **"JSON RECIBIDO"** sí muestre los datos reales que
  llegan del backend — es la prueba de que el backend funciona y de que el trabajo pendiente es de
  *presentación*, no de datos;
- los botones **ARRANCAR / PARAR / ENVIAR VELOCIDAD** no hacen nada todavía (`app.js`/`api.js` pendientes);
- la consola del navegador (F12) muestra mensajes `TODO: falta implementar...` señalando exactamente qué
  archivo y qué función completar.

Si tu profesor publicó una demo pública de este proyecto (por ejemplo en Railway), esa URL muestra
exactamente este mismo comportamiento — sirve para comparar en vivo contra la versión de referencia sin que
tengas que instalar nada todavía. Ese despliegue es una demo **compartida** con el resto del grupo, no tu
entorno de trabajo: para resolver las prácticas, sigue trabajando en tu propia copia con `npm start`
(arriba). Ver [`docs/guia-instalacion.md`](docs/guia-instalacion.md) para más detalle, incluyendo despliegue
opcional con Docker.

## Cómo saber si ya terminaste

```bash
cd backend
npm test
```

Al principio varios de los 13 tests fallan — eso es normal y esperado. Cada vez que completes un TODO,
vuelve a correr `npm test`: cuando todos pasen en verde, tu backend está funcionalmente igual que la
solución de referencia.

Para el frontend no hay tests automáticos: cada `.md` de actividad en `exercises/` trae una lista de
**criterios de aceptación** (qué debe verse en pantalla) para revisar a simple vista.

## Cómo entregas tus avances

Cada `git push` a tu copia de este repositorio dispara automáticamente tres checks (pestaña **Actions**, y
como ✓/✗ junto a cada commit): **Contrato de respuesta**, **Validación (Práctica 4)** y **Alarmas y fallas
(Práctica 2/6)**. No necesitas correr nada a mano para que se vean — corren solos en GitHub. Haz commits
frecuentes conforme avances en cada práctica, con mensajes breves que digan qué completaste (por ejemplo:
`Practica 2: completar renderMotor`), y comparte el link de tu repositorio con tu profesor cuando te lo
pida.

## Si te atoras

1. Relee el comentario `TODO` completo del archivo — trae la lista exacta de pasos y, casi siempre, un
   ejemplo de cómo probarlo.
2. Consulta `docs/explicacion-del-codigo.md` para entender qué hace ese archivo y cómo se conecta con el
   resto.
3. Pregúntale a tu profesor si hay una versión de referencia (`solucion/`) accesible para comparar — pero
   intenta resolverlo primero por tu cuenta.

## Regla fundamental

La interfaz nunca asume que un comando se ejecutó. Siempre muestra el **estado confirmado** que regresa el
backend (y este, a su vez, el que confirma el ESP32) — nunca lo que el usuario simplemente solicitó.
