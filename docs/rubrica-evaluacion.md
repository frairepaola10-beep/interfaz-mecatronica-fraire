# Rúbrica de evaluación — las 6 prácticas

Cada actividad individual trae su propia rúbrica puntual (dentro de su archivo `.md`, en `exercises/`). Este
documento da la vista completa del curso, para quien evalúa el proyecto de principio a fin.

## Puntaje por práctica

| Práctica | Actividades | Puntos por actividad | Subtotal |
|---|---|---|---|
| 1 — Comprender mensajes JSON | 4 | 10 | 40 |
| 2 — Frontend leyendo estados | 5 | 10 | 50 |
| 3 — API REST | 5 | 10 | 50 |
| 4 — Validación | 5 | 10 | 50 |
| 5 — Integración con ESP32 | 5 | 10 | 50 |
| 6 — Fallas y diagnóstico | 5 × 10 + 1 × 20 (capstone) | — | 70 |
| **Total del curso** | | | **310** |

## Qué evidencia objetiva usar en cada práctica

| Práctica | Evidencia automática | Evidencia visual |
|---|---|---|
| 1 | JSON válido (se puede verificar con `JSON.parse`) | — |
| 2 | — | Capturas de pantalla mostrando cada estado (ENCENDIDO/DETENIDO/SIN COMUNICACIÓN/alarmas) |
| 3 | Pestaña Red del navegador muestra las solicitudes correctas | Capturas de los paneles JSON y la franja de flujo |
| 4 | `npm test` → `validation.test.js` en verde (6 casos) | — |
| 5 | Respuestas de `curl` contra el ESP32 con la forma correcta | Fotos/video del hardware respondiendo físicamente |
| 6 | `npm test` completo en verde (13 casos) | Capturas de cada escenario forzado |

`npm test` es, en toda la materia, la única evidencia 100 % objetiva y reproducible — por eso las prácticas
4 y 6 (que tocan backend) se apoyan tanto en ella. Las prácticas de frontend (2, 3) y de hardware (5) se
apoyan en checklists visuales porque no hay una forma sencilla de automatizar "¿se ve bien en pantalla?" o
"¿se encendió el LED?" sin herramientas adicionales fuera del alcance de esta materia introductoria.

## Rúbrica general (aplica a cualquier actividad, además de su propia rúbrica puntual)

| Criterio | Descripción | % típico |
|---|---|---|
| Funcionalidad | El criterio de aceptación se cumple tal como se describe | 60 % |
| Comprensión | Las respuestas a las preguntas de reflexión son correctas y propias (no copiadas) | 20 % |
| Limpieza | El código nuevo sigue el estilo del resto del archivo: comentarios, nombres, formato | 10 % |
| Entrega | A tiempo, en el formato pedido, con todo lo solicitado incluido | 10 % |

## Señales de alerta al revisar entregas

- Un `npm test` que pasa pero con la lógica movida a otro archivo o con los `assert` alterados — revisar que
  no se haya tocado el archivo de tests, solo el código de `src/`.
- Código copiado de `solucion/` sin entender qué hace — las preguntas de reflexión existen precisamente para
  detectar esto: pide que se expliquen con las palabras del estudiante.
- Capturas de pantalla que no corresponden al escenario pedido (por ejemplo, mostrar `TEMP_HIGH` cuando se
  pidió `TEMP_CRITICAL`) — comparar contra los criterios de aceptación exactos de la actividad.
