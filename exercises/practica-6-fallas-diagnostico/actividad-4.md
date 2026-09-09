# Actividad 4 — Temperatura elevada y alarma crítica

## Objetivo

Verificar, de extremo a extremo (incluyendo el buzzer si tienes hardware), el camino completo de una alarma
por temperatura — reutilizando lo hecho en la Práctica 2.

## Requisitos previos

Práctica 2 (Actividades 3 y 4) completada. Opcional: ESP32 en Modo Hardware (Práctica 5) con buzzer
conectado.

## Contexto

`evaluateTemperature()` ya está completa desde la Práctica 2. Aquí la ponemos a prueba junto con el resto
del sistema, incluyendo — si tienes hardware — la respuesta física del buzzer, que en el firmware reacciona
sin depender del backend (ver `protocol.h#buildStatusResponse`).

## Cómo probarlo

**En simulación:**

```bash
curl -X POST http://localhost:3000/api/simulation/scenario -H "Content-Type: application/json" -d '{"scenario":"TEMP_HIGH"}'
# esperar, observar
curl -X POST http://localhost:3000/api/simulation/scenario -H "Content-Type: application/json" -d '{"scenario":"TEMP_CRITICAL"}'
```

**Con hardware real:** sube la velocidad del motor (o, si tu sensor lo permite, calienta el sensor
físicamente con cuidado) hasta que la temperatura cruce `TEMP_CRITICAL_THRESHOLD`.

## Criterios de aceptación

- [ ] `TEMP_HIGH` produce un banner amarillo con el código correcto; `TEMP_CRITICAL` uno rojo.
- [ ] El historial de eventos registra ambas transiciones con su hora.
- [ ] (Si tienes hardware) el buzzer se activa físicamente solo en `TEMP_CRITICAL`, no en `TEMP_HIGH` — 
      revisa la lógica de `buildStatusResponse()` en el firmware.
- [ ] Al volver a `NORMAL`, la alarma desaparece del banner (aunque el historial la conserva).

## Preguntas de reflexión

1. En el firmware, el buzzer se activa sin esperar al backend; en la interfaz web, el banner rojo aparece
   después de esperar la respuesta del backend. ¿Por qué es correcto que estas dos alarmas — una física, una
   visual — no estén sincronizadas al milisegundo?
2. Si quisieras agregar una tercera severidad (por ejemplo `EMERGENCY`, más grave que `CRITICAL`), ¿qué
   archivos tendrías que tocar, del frontend y del backend?

## Entregable

Capturas de pantalla de ambos banners (amarillo y rojo) y, si aplica, video del buzzer activándose.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Ambos niveles de alarma verificados correctamente | 6 |
| Historial de eventos correcto | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
