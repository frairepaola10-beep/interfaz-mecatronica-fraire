'use strict';

/**
 * logger.js
 *
 * Deja en consola una traza legible de cada solicitud: qué llegó y, cuando
 * termina de procesarse, con qué código de estado y en cuánto tiempo se
 * respondió. Es la forma más simple de "ver" el protocolo funcionando
 * mientras se explica en clase, sin depender de las herramientas de red
 * del navegador.
 */
function logger(req, res, next) {
  const start = Date.now();
  const tag = req.transactionId ? ` [${req.transactionId}]` : '';
  const hasBody = req.body && Object.keys(req.body).length > 0;

  console.log(`→ ${req.method} ${req.originalUrl}${tag}`, hasBody ? req.body : '');

  res.on('finish', () => {
    const elapsedMs = Date.now() - start;
    console.log(`← ${req.method} ${req.originalUrl}${tag} ${res.statusCode} (${elapsedMs} ms)`);
  });

  next();
}

module.exports = logger;
