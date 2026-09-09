# Glosario

**API (Application Programming Interface).** El conjunto de endpoints que el backend expone para que otros
programas (el frontend, en este caso) le pidan cosas. Aquí es una API REST sobre HTTP.

**API REST.** Un estilo de API donde cada solicitud usa un verbo HTTP (`GET`, `POST`, ...) y una URL para
indicar qué se quiere hacer, y el cuerpo de la solicitud/respuesta suele ser JSON.

**Backend.** El programa que corre en un servidor (en este proyecto, con Node.js/Express) y hace de
intermediario entre el frontend y el dispositivo físico. Valida, decide y responde.

**Endpoint.** Una URL específica de la API a la que se le puede hacer una solicitud, por ejemplo
`POST /api/device/command`.

**ESP32.** Microcontrolador con Wi-Fi integrado, usado en este proyecto como el "cerebro" físico que lee
sensores y controla actuadores.

**Firmware.** El programa que corre directamente en el microcontrolador (el ESP32), escrito en C++ con el
framework de Arduino.

**Frontend.** La interfaz visual que ve y usa el usuario, hecha con HTML, CSS y JavaScript, ejecutándose en
el navegador.

**HMI (Human-Machine Interface).** Una interfaz diseñada para que una persona supervise y controle un
sistema físico o industrial — el concepto en el que se inspira visualmente el frontend de este proyecto.

**HTTP.** El protocolo de comunicación sobre el que viajan las solicitudes y respuestas de este proyecto
(comandos, telemetría, archivos estáticos del frontend).

**Latencia.** El tiempo que tarda una solicitud en ir y volver. En este proyecto se mide en milisegundos y
se muestra en el header de la interfaz.

**Middleware.** Una función que se ejecuta ANTES de que una solicitud HTTP llegue a su destino final
(el controller), usada aquí para validar comandos (`validateCommand.js`), asignar un ID (`requestId.js`) y
registrar actividad (`logger.js`).

**Payload.** El contenido de una solicitud o respuesta — en este proyecto, siempre un objeto JSON.

**Polling (sondeo periódico).** La técnica de preguntar "¿algo cambió?" repetidamente cada cierto tiempo,
en vez de esperar a que el otro lado avise. El frontend usa esto (`POLL_INTERVAL_MS`) para mantenerse
actualizado sin necesitar WebSockets.

**Protocolo.** El conjunto de reglas que define qué forma deben tener los mensajes que dos sistemas
intercambian. Aquí, el protocolo JSON descrito en `shared/json/protocolo.md`.

**SCADA (Supervisory Control and Data Acquisition).** Sistemas de supervisión y control industrial a gran
escala, de los que este proyecto toma prestado el estilo visual (de forma simplificada y didáctica).

**Servicio (service).** En la arquitectura de este backend, un módulo que contiene la lógica de negocio real
(por ejemplo, `alarm.service.js` decide qué es una alarma), separado de las rutas y controllers que solo
manejan el tráfico HTTP.

**Timeout.** El tiempo máximo que un programa espera una respuesta antes de darla por perdida. Este proyecto
usa timeouts tanto en el frontend (`REQUEST_TIMEOUT_MS`) como en el backend (`COMMAND_TIMEOUT_MS`).

**Transacción / `transactionId`.** Un identificador único (`CMD-001`, `CMD-002`, ...) que conecta un comando
enviado con la respuesta que le corresponde.

**Validación.** El proceso de comprobar que un dato cumple ciertas reglas antes de usarlo — en este
proyecto, comprobar que un comando tenga la forma correcta antes de ejecutarlo (Práctica 4).
