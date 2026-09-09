'use strict';

/**
 * errorHandler.js
 *
 * Middleware de error de Express (se reconoce por tener 4 parámetros).
 * Es la última red de seguridad: si algo revienta de forma inesperada en
 * cualquier controller o service, esto evita que el proceso se caiga y
 * devuelve un JSON con la misma forma que el resto de la API, en vez de
 * un stack trace de HTML.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('Error no controlado en el backend:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_ERROR',
    details: 'Ocurrió un error inesperado en el backend. Revisa la consola del servidor.',
  });
}

module.exports = errorHandler;
