**Actividad 1** 

1\. ¿Por qué sendCommand() no necesita su propio manejo de timeout, si request() ya lo tiene?

Porque sendCommand() utiliza la función request(), y request() ya se encarga de controlar el tiempo máximo de espera mediante un AbortController y un timeout. De esta manera, sendCommand() solo necesita indicar la ruta, el método y los datos que va a enviar, evitando repetir el mismo código de manejo de timeout.



2\. ¿Qué pasaría si olvidaras el header Content-Type: application/json?

Si se olvida el header Content-Type: application/json, el backend podría no interpretar correctamente el cuerpo de la solicitud como un objeto JSON. Como el backend utiliza express.json() para procesar las solicitudes JSON, necesita saber que los datos recibidos están en formato JSON. Por lo tanto, el comando podría no llegar correctamente a req.body y la validación del comando podría fallar.





**Actividad 2** 

1\. ¿Por qué `runCommand()` recibe el comando ya armado, en vez de armarlo ella misma a partir de qué botón se presionó?

Porque `runCommand()` se encarga de realizar el proceso común para todos los comandos, como mostrar el JSON, enviarlo al backend, mostrar las fases de comunicación y procesar la respuesta. Al recibir el comando ya armado, puede funcionar con diferentes acciones sin depender directamente de qué botón fue presionado.



2\. START y STOP siempre mandan `value: null`. ¿Qué garantiza, del lado del backend, que un `value` distinto de `null` en estas acciones sería rechazado?

El backend cuenta con una validación de comandos que verifica que cada acción tenga los datos permitidos por el protocolo. Para las acciones `START` y `STOP`, el campo `value` debe ser `null`. Si se envía un valor diferente, el comando no cumple con el formato esperado y el backend lo rechaza antes de ejecutarlo.



**Actividad 3**

1\. ¿Qué error (HTTP 400, `INVALID\_COMMAND`) obtendrías si mandaras `value: "30"` en vez de `value: 30`?



El backend respondería con un error \*\*HTTP 400\*\* y el código `INVALID\_COMMAND`, porque `"30"` es un texto (string) mientras que el protocolo espera que `value` sea un número. La validación del backend detectaría que el tipo de dato no es correcto y rechazaría el comando.



2\. El slider en el HTML tiene `min="0"` y `max="100"`. ¿Hace falta que el frontend también valide ese rango, si el backend ya lo hace en la Práctica 4? ¿Por qué sí o por qué no sería buena práctica hacerlo en ambos lados?



Aunque el backend ya valida el rango, también es buena práctica que el frontend lo valide. El frontend puede evitar que el usuario envíe valores inválidos y mostrar un error inmediatamente. Sin embargo, la validación del backend sigue siendo necesaria porque no se debe confiar únicamente en las validaciones del frontend; una solicitud puede enviarse directamente a la API sin pasar por la interfaz.



**Actividad 4**



1\. ¿En qué línea exacta de tu código se actualiza, por primera vez, lo que el usuario ve como estado del motor? ¿Cuántos pasos (fetch, validaciones, etc.) ocurrieron antes de esa línea?

El estado del motor se actualiza por primera vez cuando `runCommand()` llama a `applyConfirmedState(response)`. Dentro de esa función se ejecuta `state.setState(...)`, que actualiza el estado que posteriormente `ui.applyState` muestra en la interfaz.

Antes de llegar a esa línea ocurren varios pasos: se construye el comando, se muestra el JSON enviado, se ejecuta `api.sendCommand()`, se realiza el `fetch` al backend, se recibe la respuesta, se muestra el JSON recibido y se comprueba que `response.success === true` y que la comunicación con el dispositivo está confirmada. Solo después de esas comprobaciones se aplica el nuevo estado.



2\. Si quitaras la comprobación de `response.success` y siempre llamaras a `applyConfirmedState(response)`, ¿qué pasaría cuando `response.state` sea `null` (por una desconexión)?

La interfaz podría intentar actualizarse con información que no fue confirmada por el backend. En una desconexión, `response.state` podría ser `null` o no contener los valores esperados, por lo que se podrían mostrar datos incorrectos, valores vacíos o conservar información anterior. Por eso es importante comprobar primero que la respuesta fue exitosa y que existe comunicación antes de actualizar el estado confirmado.



**Actividad 5**

1\. Describe el recorrido de una orden desde que haces clic en ARRANCAR hasta que el motor aparece como ENCENDIDO.

Al hacer clic en \*\*ARRANCAR\*\*, `app.js` construye el comando con el dispositivo `motor1` y la acción `START`. Después, `api.js` envía ese comando mediante una solicitud \*\*POST\*\* a `/api/device/command`. El backend recibe y valida el JSON, ejecuta la acción y devuelve una respuesta con `success: true` y el nuevo estado del motor. Finalmente, `app.js` toma el estado confirmado por el backend y `ui.js` actualiza la interfaz, mostrando el motor como \*\*ENCENDIDO\*\*.

2\. Si mañana se reemplazara el simulador por un ESP32 físico, ¿qué partes del sistema tendrías que cambiar y cuáles podrían permanecer iguales?

Principalmente tendría que cambiar la parte del \*\*backend encargada de comunicarse con el ESP32 físico\*\*, reemplazando la simulación por la comunicación real con el dispositivo. El frontend podría permanecer prácticamente igual, porque seguiría enviando los mismos comandos mediante la API y recibiendo respuestas JSON. También podrían mantenerse `app.js`, `api.js` y `ui.js`, siempre que el ESP32 real respete el mismo protocolo de comunicación y entregue los estados esperados.





