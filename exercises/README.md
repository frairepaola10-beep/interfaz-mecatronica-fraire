# Prácticas — Diseño de Interfaces Mecatrónicas

Seis prácticas que recorren, de principio a fin, el flujo completo del proyecto:

```text
JSON → Frontend → API REST → Validación → ESP32 → Fallas y diagnóstico
```

| # | Práctica | Carpeta | Qué se aprende |
|---|---|---|---|
| 1 | Comprender mensajes JSON | [`practica-1-json/`](practica-1-json/) | Leer y modificar el protocolo JSON a mano, sin código |
| 2 | Frontend leyendo estados | [`practica-2-frontend-estados/`](practica-2-frontend-estados/) | Traducir un JSON de estado a una interfaz visual |
| 3 | API REST | [`practica-3-api-rest/`](practica-3-api-rest/) | Construir y enviar comandos desde el frontend al backend |
| 4 | Validación | [`practica-4-validacion/`](practica-4-validacion/) | Rechazar comandos incorrectos antes de ejecutarlos |
| 5 | Integración con ESP32 | [`practica-5-esp32/`](practica-5-esp32/) | Conectar hardware real detrás del mismo protocolo |
| 6 | Fallas y diagnóstico | [`practica-6-fallas-diagnostico/`](practica-6-fallas-diagnostico/) | Reconocer y mostrar condiciones anormales del sistema |

## Con qué proyecto trabajar

Todas las prácticas se resuelven sobre este repositorio (la versión con TODOs). Tu profesor tiene una
versión de referencia completa y funcional — pregúntale si hay una URL o repositorio donde consultarla, y
úsala solo si te atoras, no la copies directamente.

## Cómo está organizada cada práctica

```text
practica-N-nombre/
├── README.md          objetivo general de la práctica y lista de actividades
├── actividad-1.md      ...
├── actividad-2.md
├── ...
└── entregables/        copias de partida de los archivos que vas a modificar
```

Cada actividad sigue la misma plantilla: **Objetivo**, **Requisitos previos**, **Contexto**, **Pasos**,
**Código o JSON de partida**, **Criterios de aceptación** (qué debe verse en pantalla — esta es tu checklist
para autoevaluarte antes de entregar), **Preguntas de reflexión** y **Entregable**, cerrando con una
**rúbrica de puntos**.

## Cómo entregar

Salvo que tu profesor indique otra cosa:

1. Trabaja directamente en este repositorio (la copia que te asignó GitHub Classroom, o tu fork).
2. Para las prácticas 2 a 6, confirma en cada actividad que se cumplen los **criterios de aceptación**
   listados, y cuando aplique, que `cd backend && npm test` pasa en verde.
3. Entrega el enlace a tu repositorio (o el código fuente) más, si la actividad lo pide, capturas de
   pantalla mostrando los criterios de aceptación cumplidos.

## Rúbrica general

| Criterio | Puntos |
|---|---|
| Funcionalidad — el criterio de aceptación se cumple tal como se describe | 60 |
| Comprensión — las respuestas a las preguntas de reflexión son correctas y propias | 20 |
| Limpieza — el código sigue el estilo del resto del archivo (comentarios, nombres) | 10 |
| Entrega — a tiempo, en el formato pedido, con lo solicitado completo | 10 |

Cada actividad trae además su propia rúbrica puntual, más específica que esta tabla general.
