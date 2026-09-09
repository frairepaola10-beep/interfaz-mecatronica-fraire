'use strict';

const path = require('path');
const express = require('express');
const routes = require('./routes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

/**
 * app.js
 *
 * Construye (pero no arranca) la aplicación Express: registra middleware
 * global, sirve el frontend como archivos estáticos y monta la API bajo
 * /api. Separarlo de server.js permite importarlo directamente en los
 * tests sin necesidad de levantar un puerto real de antemano.
 */
function createApp() {
  const app = express();

  // CORS mínimo hecho a mano: por defecto el frontend se sirve desde este
  // mismo backend (mismo origen, no hace falta CORS), pero si alguien lo
  // abre con Live Server u otro puerto durante el desarrollo, esto evita
  // que el navegador bloquee las peticiones fetch().
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // Habilita que Express parsee automáticamente cuerpos JSON en req.body.
  app.use(express.json());

  app.use(logger);

  // Sirve frontend/index.html, css/ y js/ como archivos estáticos, para
  // que abrir http://localhost:3000 muestre la interfaz directamente.
  app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

  app.use('/api', routes);

  // Debe registrarse al final: Express reconoce un middleware de error
  // por su firma de 4 parámetros (err, req, res, next).
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
