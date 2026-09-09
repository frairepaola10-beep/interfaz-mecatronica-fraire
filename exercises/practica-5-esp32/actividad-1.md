# Actividad 1 — Conectar el ESP32 a Wi-Fi

## Objetivo

Cargar el firmware base (sin completar los TODOs todavía) y confirmar que el ESP32 se conecta a la red y
levanta su servidor HTTP.

## Requisitos previos

Un ESP32, cable USB, Arduino IDE configurado (ver `firmware/README.md` para librerías y pasos).

## Contexto

Aunque `protocol.h` todavía tiene TODOs, el resto del firmware (Wi-Fi, servidor HTTP, manejo de rutas) ya
está completo — así que el ESP32 debe encender, conectarse y responder algo (aunque sea un error) desde el
primer momento.

## Pasos

1. Abre `firmware/esp32/esp32_interface/esp32_interface.ino` en el Arduino IDE.
2. Edita `config.h`: pon el SSID y contraseña de tu red Wi-Fi.
3. Carga el programa al ESP32.
4. Abre el Monitor Serial a 115200 baudios.

## Criterios de aceptación

- [ ] El Monitor Serial muestra "Conectado. IP del ESP32: ..." con una dirección IP válida de tu red.
- [ ] `curl -X POST http://<IP_DEL_ESP32>/command -H "Content-Type: application/json" -d '{"device":"motor1","action":"START","value":null}'`
      responde algo (aunque sea `{"state":{}}`, porque `protocol.h` no está completo todavía — eso es
      normal en este punto).

## Preguntas de reflexión

1. ¿Qué pasaría si el Wi-Fi de tu red usara un portal cautivo (como muchas redes públicas)? ¿Este firmware
   podría conectarse?
2. ¿Por qué el ESP32 imprime su IP por Serial en vez de tener una IP fija conocida de antemano?

## Entregable

Captura de pantalla del Monitor Serial mostrando la IP asignada.

## Rúbrica

| Criterio | Puntos |
|---|---|
| ESP32 conectado a Wi-Fi | 5 |
| Servidor HTTP responde (aunque sea con `{}`) | 3 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
