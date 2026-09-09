# Actividad 3 — Construir el JSON de ENVIAR VELOCIDAD

## Objetivo

Completar el manejador de clic de ENVIAR VELOCIDAD, tomando el valor actual del slider.

## Requisitos previos

Actividad 2 completada.

## Contexto

A diferencia de START/STOP, `SET_SPEED` sí necesita un `value` — y ese valor no es fijo: depende de dónde
haya dejado el usuario el control deslizante (slider) de "Referencia de velocidad".

## Código de partida

`app.js`, el manejador de `els.sendSpeedBtn`. El elemento del slider ya está cacheado en `els.slider`.

## Pasos

1. Completa el manejador para llamar a:
   `runCommand({ device: 'motor1', action: 'SET_SPEED', value: Number(els.slider.value) })`
2. Nota el `Number(...)`: `els.slider.value` es un *string* por cómo funciona el DOM — si lo mandas tal
   cual, el backend lo rechazaría (`value` debe ser numérico, ver `command.schema.js`).

## Cómo probarlo

Mueve el slider a distintos valores (por ejemplo 30 %, luego 90 %) y presiona ENVIAR VELOCIDAD cada vez.

## Criterios de aceptación

- [ ] El panel "JSON ENVIADO" muestra `"value"` como número (`30`), no como texto (`"30"`).
- [ ] Cambiar el slider y volver a enviar produce un comando distinto cada vez, con el valor correcto.
- [ ] El backend no rechaza el comando (revisa el panel "JSON RECIBIDO": `success` debe ser `true`, salvo
      que ya hayas provocado alguna alarma a propósito).

## Preguntas de reflexión

1. ¿Qué error (HTTP 400, `INVALID_COMMAND`) obtendrías si mandaras `value: "30"` en vez de `value: 30`?
   Pruébalo modificando temporalmente tu código y viendo qué responde el backend.
2. El slider en el HTML tiene `min="0"` y `max="100"`. ¿Hace falta que el frontend también valide ese rango,
   si el backend ya lo hace en la Práctica 4? ¿Por qué sí o por qué no sería buena práctica hacerlo en
   ambos lados?

## Entregable

`app.js` con el manejador de ENVIAR VELOCIDAD completo.

## Rúbrica

| Criterio | Puntos |
|---|---|
| Comando SET_SPEED correcto, con `value` numérico | 6 |
| Funciona con distintos valores del slider | 2 |
| Preguntas de reflexión | 2 |
| **Total** | **10** |
