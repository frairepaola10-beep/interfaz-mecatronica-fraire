# Mocks

Copias estáticas de referencia de las tres formas de respuesta (OK, alarma,
error), idénticas a las de `shared/json/`. Se usan para consulta rápida y
para la Práctica 1; la simulación en vivo del sistema la produce
`../services/simulator.service.js`, no estos archivos.

`scenarios.js` sí se usa en tiempo de ejecución: es la lista de nombres
válidos que acepta `POST /api/simulation/scenario` (Práctica 6).
