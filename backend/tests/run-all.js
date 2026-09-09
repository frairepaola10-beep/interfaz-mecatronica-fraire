'use strict';

/**
 * run-all.js
 *
 * Ejecuta cada archivo *.test.js de esta carpeta como un proceso de Node
 * independiente (`node archivo.test.js`), en vez de usar
 * `node --test <carpeta>`.
 *
 * Por qué: las versiones recientes de Node (probado en v22.22.2) tienen
 * un bug intermitente en el canal de comunicación entre el orquestador
 * de `--test` y los procesos hijo que ejecutan cada archivo — de vez en
 * cuando revienta con:
 *
 *   "Unable to deserialize cloned data due to invalid or unsupported version"
 *
 * y reporta menos tests de los que realmente existen, o marca un archivo
 * completo como fallido sin motivo real. Invocar cada archivo
 * directamente con `node archivo.test.js` (los tests de node:test también
 * funcionan así, sin pasar por el orquestador de `--test`) evita ese
 * canal por completo y en la práctica ha resultado 100% estable.
 *
 * Este script simplemente:
 *   1. Encuentra todos los *.test.js de esta carpeta.
 *   2. Corre cada uno como proceso hijo, mostrando su salida tal cual.
 *   3. Si CUALQUIERA falla, termina con código de salida 1 (para que
 *      `npm test` se reporte como fallido), pero sin detenerse a medio
 *      camino: todos los archivos se ejecutan siempre.
 */
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const testsDir = __dirname;
const files = fs
  .readdirSync(testsDir)
  .filter((name) => name.endsWith('.test.js'))
  .sort();

let anyFailed = false;

for (const file of files) {
  console.log(`\n=== ${file} ===`);
  const result = spawnSync(process.execPath, [path.join(testsDir, file)], {
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    anyFailed = true;
  }
}

process.exit(anyFailed ? 1 : 0);
