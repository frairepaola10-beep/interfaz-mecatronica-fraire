'use strict';

/**
 * requestId.js
 *
 * Genera el identificador de solicitud (CMD-001, CMD-002, …) que se ve en
 * la interfaz como "Solicitud #CMD-001", encima del panel "JSON ENVIADO".
 * Permite emparejar visualmente qué comando generó qué respuesta.
 *
 * El contador vive en memoria y es simplemente incremental; no necesita
 * ser único entre reinicios del servidor para los fines de esta materia.
 */

let counter = 0;

function requestId(req, res, next) {
  counter += 1;
  req.transactionId = `CMD-${String(counter).padStart(3, '0')}`;
  next();
}

module.exports = requestId;
