**Actividad 1** 

1\. ¿Por qué se valida device/action con typeof ... !== 'string' en vez de solo !device?

Porque !device solamente comprueba si el valor es falso, pero no garantiza que sea texto. Por ejemplo, 0 sería considerado falso, aunque el problema es que es un número. typeof device !== 'string' permite comprobar específicamente que el valor sea una cadena de texto.



2\. ¿Qué le pasaría al historial de alarmas cada vez que se rechaza un comando?

Cada vez que se rechaza un comando, la función reject() llama a alarmService.pushEvent(), por lo que el comando inválido queda registrado en el historial de alarmas como un evento.



**Actividad 2** 

1\. Si mañana agregamos un segundo motor, ¿qué tendría que cambiar?

Tendría que agregarse el nuevo dispositivo en VALID\_DEVICES dentro de command.schema.js. No sería necesario modificar la lógica de validateCommand.js, porque esa lógica solamente verifica si el dispositivo pertenece a la lista de dispositivos válidos.



2\. ¿Qué pasa si escribo MOTOR1 en vez de motor1?

Se rechaza, porque includes() distingue entre mayúsculas y minúsculas. "motor1" y "MOTOR1" son cadenas diferentes. Esto permite mantener los identificadores del protocolo exactamente como fueron definidos.



**Actividad 3**

1.. ¿Por qué VALID\_ACTIONS es un objeto { START: {...}, STOP: {...}, ... } en vez de un arreglo simple como VALID\_DEVICES? ¿Qué información extra necesita guardar por cada acción?

VALID\_ACTIONS es un objeto porque cada acción necesita guardar información adicional. Por ejemplo, SET\_SPEED necesita indicar que requiere un value y también especificar el valor mínimo y máximo permitido. En cambio, VALID\_DEVICES solo necesita indicar cuáles dispositivos existen, por eso puede ser un arreglo simple.



2\. Compara esta comprobación con la de la Actividad 2. ¿Por qué el orden importa — es decir, por qué conviene validar el dispositivo antes que la acción?

El orden importa porque primero debemos comprobar que el dispositivo al que se dirige el comando sea conocido y válido. Después podemos verificar si la acción solicitada está permitida. Así la validación sigue un orden lógico y podemos identificar primero si el problema está en el dispositivo o en la acción.



**Actividad 4**

1\. ¿Por qué se usa Number.isNaN(value) en lugar de isNaN(value)?

Number.isNaN(value) comprueba si el valor es específicamente NaN sin convertirlo a otro tipo de dato. En cambio, isNaN(value) puede convertir el valor antes de hacer la comprobación, lo que puede producir resultados inesperados. Por eso Number.isNaN() es más preciso para validar datos numéricos.

Además, primero se utiliza typeof value !== 'number' para comprobar que sea un número.



2\. ¿Qué pasaría si llegara value: 50.5 para SET\_SPEED? ¿El protocolo actual lo permite? ¿Debería?

El protocolo actual sí lo permite, porque 50.5 es un número y está dentro del rango de 0 a 100. La validación actual no exige que el valor sea entero.

Si el sistema permite velocidades decimales, entonces 50.5 puede ser válido. Si el dispositivo solamente trabaja con valores enteros, habría que modificar la validación para rechazar números decimales.



**Actividad 5**

1\. ¿Por qué es valioso que todos los rechazos usen la misma forma de respuesta?

Es valioso porque permite que el frontend maneje todos los errores de validación de la misma manera. Siempre recibe los campos success, error y details, por lo que no necesita una lógica diferente para cada tipo de error. Esto hace que la API sea más uniforme, fácil de entender y de mantener.



2\. ¿Qué significa que validateCommand.js reciba next como tercer parámetro y qué pasa si nunca lo llamaras?

next es una función de Express que permite continuar la solicitud hacia el siguiente middleware o controller. Cuando un comando es válido, validateCommand() prepara req.command y llama a next() para que el controller pueda procesarlo.

Si nunca se llamara next() para un comando válido, la solicitud quedaría detenida en el middleware y el controller nunca recibiría el comando.

