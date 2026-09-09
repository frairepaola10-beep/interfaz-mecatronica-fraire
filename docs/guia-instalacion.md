# Guía de instalación

## Requisitos

- **Node.js** 18 o superior (probado con Node 22). Trae `npm` incluido.
- Un navegador moderno (Chrome, Firefox, Edge).
- Para las Prácticas 5-6 con hardware real: Arduino IDE 2.x, un ESP32 y el hardware descrito en
  `docs/hardware.md`.

No se necesita instalar nada más: el backend usa una sola dependencia (Express) y el frontend es JavaScript
vanilla, sin build ni bundler.

## Poner en marcha el proyecto

```bash
cd backend
npm install
npm start
```

Abrir `http://localhost:3000` — el backend sirve el frontend como archivos estáticos, así que no hace falta
levantar un servidor aparte para la interfaz. Corre en Modo Simulación por defecto — no requiere ESP32.

## Cómo saber si ya terminaste

```bash
cd backend
npm test
```

Al principio, varios tests fallan — es normal (ver el `README.md` de la raíz para la lista de TODOs
pendientes). Van pasando a medida que completas cada práctica; cuando los 13 pasen en verde, tu backend está
funcionalmente igual que la versión de referencia del profesor.

## Variables de entorno disponibles

Todas opcionales, con valores por defecto razonables (`backend/src/config/index.js`):

| Variable | Por defecto | Para qué |
|---|---|---|
| `PORT` | `3000` | Puerto HTTP del backend. |
| `MODE` | `SIMULATION` | `SIMULATION` o `HARDWARE`. |
| `ESP32_URL` | `http://192.168.1.50` | Dirección del ESP32, solo se usa en Modo Hardware. |
| `COMMAND_TIMEOUT_MS` | `3000` | Tiempo máximo de espera de una respuesta antes de reportar desconexión. |
| `SIMULATION_TICK_MS` | `1000` | Cada cuánto "late" el motor virtual. |
| `TEMP_WARNING_THRESHOLD` | `50` | Umbral de `TEMP_HIGH`, en °C. |
| `TEMP_CRITICAL_THRESHOLD` | `70` | Umbral de `TEMP_CRITICAL`, en °C. |

Ejemplo, para correr en Modo Hardware contra un ESP32 en `192.168.1.80`:

```bash
MODE=HARDWARE ESP32_URL=http://192.168.1.80 npm start
```

## Despliegue con Docker (opcional)

`npm install && npm start` sigue siendo la forma recomendada de trabajar mientras haces las prácticas. Este
repositorio también trae un `Dockerfile`/`.dockerignore`/`railway.json` opcionales, por si quieres desplegar
tu propio avance en algún momento (por ejemplo, para mostrarlo sin depender de tu propia máquina).

```bash
docker build -t interfaz-mecatronica-alumno .
docker run --rm -p 3000:3000 interfaz-mecatronica-alumno
```

Variables de entorno con `docker run -e`, igual que en la tabla de arriba:

```bash
docker run --rm -p 3000:3000 \
  -e MODE=HARDWARE -e ESP32_URL=http://192.168.1.80 \
  interfaz-mecatronica-alumno
```

## Cargar el firmware al ESP32

Ver `firmware/README.md` para las librerías necesarias, la tabla de pines y los pasos completos de carga.

## Problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `EADDRINUSE` al hacer `npm start` | Ya hay otro proceso usando el puerto 3000 | Cierra el otro proceso, o corre con `PORT=3001 npm start`. |
| La interfaz no se actualiza sola | El backend no está corriendo, o `POLL_INTERVAL_MS` (frontend/js/config.js) es muy alto | Revisa la consola del navegador y la terminal del backend. |
| `npm test` falla con "Unable to deserialize cloned data..." | Bug intermitente del orquestador de `node --test` en Node 22, en el canal de comunicación con los procesos hijo | Ya está resuelto en este proyecto: `npm test` corre `tests/run-all.js`, que invoca cada archivo con `node archivo.test.js` directamente (sin `--test`), evitando ese canal por completo — si ves este error, revisa que no se haya modificado el script `test` de `package.json` para volver a usar `node --test`. |
| El ESP32 no conecta a Wi-Fi | SSID/contraseña incorrectos en `config.h`, o la red usa un portal cautivo | Verifica las credenciales; el ESP32 no soporta redes con portal cautivo sin código adicional. |
