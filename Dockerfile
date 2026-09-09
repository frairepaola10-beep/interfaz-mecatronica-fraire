# Imagen de despliegue para la version "plantilla-alumno" de la Interfaz
# Mecatronica (con los TODOs de las practicas sin resolver, tal como esta
# en el repositorio). Sirve para publicar una demo comparativa junto con
# la imagen de solucion/: mismo backend respondiendo bien (se ve en el
# panel "JSON RECIBIDO"), pero la pantalla todavia no lo pinta ni los
# botones hacen nada hasta que se completan las practicas 2 y 3.
#
# El contexto de build es esta carpeta (plantilla-alumno/), no
# plantilla-alumno/backend/: el backend sirve el frontend como archivos
# estaticos usando una ruta relativa (ver
# backend/src/app.js -> path.join(__dirname, '..', '..', 'frontend')),
# asi que frontend/ debe quedar como hermano de backend/ dentro de la
# imagen, igual que en el repositorio.
FROM node:22-alpine
WORKDIR /app

# Instala dependencias primero: si solo cambia el codigo fuente (no
# package.json), Docker reutiliza esta capa de la cache en vez de volver
# a descargar todo.
COPY backend/package*.json backend/
RUN cd backend && npm ci --omit=dev

# Copia el resto del backend y el frontend.
COPY backend backend
COPY frontend frontend

WORKDIR /app/backend

# Modo SIMULACION por defecto: la imagen corre sin necesitar un ESP32.
# Para Modo HARDWARE, pasar MODE=HARDWARE y ESP32_URL al arrancar el
# contenedor (ver docs/guia-instalacion.md).
ENV PORT=3000
EXPOSE 3000

# Reutiliza el propio endpoint /api/health del proyecto como healthcheck,
# sin instalar curl/wget adicionales en la imagen.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD node -e \
  "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
