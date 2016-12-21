# Proyecto Sistemas y Tecnologías Web

## Nuevas funcionalidades en los paquetes IAAS y Heroku

-------------------------------------

### Paquete para el despliegue en Heroku:

Modificaciones realizadas en el plugin para el despliegue en Heroku. [Repositorio](https://github.com/ULL-ESIT-SYTW-1617/proyecto-sytw-16-17-josue-nayra)

- **Autenticación con: Google, Twitter, Facebook y Github.**

Por defecto el usuario propietario del Gitbook tendrá habilitada la autenticación local, además de las expuestas anteriormente en función de lo que desee.

La información relativa a la autenticación con Google, Twitter, Facebook y Github se dispondrá en un archivo "auth.json", en cual el usuario rellenará los datos relativos a la autenticación (clientID y clientSecret).

En función de los tipos de autenticación que elija el autor del libro aparecerán en el login nuevos botones para hacer la autenticación con cada uno de ellos.


- **Vista administrador para la gestión de los usuarios que visitan el libro por parte del autor del mismo.**

El administrador podrá crear nuevos usuarios desde esta vista, asignando un 'usuario', un 'password' y un 'displayName', como también borrar usuarios de los existentes en la base de datos a partir del 'id'.

En esta vista se facilitará una tabla al administrador con todos los usuarios existentes en la base de datos local.
Para cada uno de ellos se podrá visualizar su 'id', 'usuario', 'nombre completo' y las visitas que ha realizado al Gitbook.

Los cambios que se produzcan en esta sección de la aplicación se visualizarán en la tabla de usuarios.


- **Opción para elegir el tipo de base de datos: Sequelize o Dropbox**.

Se ha reestructurado el código para dar la opción al autor del libro de elegir la base de datos que desee, tanto Sequelize como Dropbox.

En función de la elección del usuario con su base de datos se generará un controlador para los usuarios diferente en función de si la base de datos es Sequelize o Dropbox.

Para el caso de **Dropbox** el usuario deberá disponer de un fichero como base de datos a su cuenta personal de Dropbox en formato JSON, siguiendo la siguiente estructura:

```json
{
  "users":[
    {
      "id": 1,
      "username": "admin",
      "password": "****",
      "displayName": "Administrador",
      "visitasGitbook": 0
    }
  ]
}
```

El plugin exigirá al usuario propietario del Gitbook la introducción de un token para utilizar la API de Dropbox y el link del archivo de base de datos que se deberá encontrar en su perfil.
Para generar un token para el Dropbox puede acceder al siguiente enlace: [Token Dropbox](https://dropbox.github.io/dropbox-api-v2-explorer/).
Estos datos se almacenarán en un directorio oculto: *~/.dropbox*, en un fichero "dropbox.json".


Para el caso de **Sequelize** el usuario no tendrá que configurar nada. El dialecto utilizado por parte de este ORM es Sqlite3.


- **Nueva tarea Gulp para administrar el servidor: "destroy" elimina la aplicación y el repositorio remoto de Heroku.**

Esta tarea se invoca ejecutando:

```bash
$ gulp destroy heroku
```

Utilizará la API de Heroku para borrar la aplicación.


----------


### Paquete para el despliegue en IAAS:

Modificaciones realizadas en el plugin para el despliegue en IAAS. [Repositorio](https://github.com/ULL-ESIT-SYTW-1617/proyecto-sytw-16-17-IAAS-josue-nayra)

- **Vista administrador** para la gestión de los usuarios que visitan el libro por parte del autor del mismo.

- Se han añadido **nuevas tareas gulp** para facilitar las labores de configuración y administración al usuario propietario del Gitbook:

    - **gulp deploy-iaas-ull-es**:

    Esta tarea permitirá actualizar el contenido del gitbook que se encuentra alojado en el IAAS, ejecutando un git pull sobre el repositorio en Github. Es importante tener en cuenta de que éste último debe estar siempre actualizado para que esta tarea se ejecute eficientemente.

    - **gulp install-iaas-ull-es**:

    Posteriormente al despliegue inicial del gitbook en el IAAS mediante la ejecución del comando *gitbook-start --deploy iaas-ull-es**, esta tarea nos permite instalar todas las dependencias y paquetes necesarios en la máquina remota para poder ejecutar y lanzar la aplicación sin problemas.

    - **gulp run-iaas-ull-es**:

    En este caso, a partir de esta tarea podemos ejecutar el servidor en la máquina remota evitando la necesidad de acceder al IAAS y hacerlo manualmente, lo cual nos puede resultar bastante útil cuando el usuario realice testeos y pruebe la efectividad del despliegue.

    - **gulp destroy-iaas-ull-es**:

    En el caso de que el usuario decida eliminar el despliegue del IAAS, se ha facilitado esta tarea que realizará las siguientes cuestiones:

        - Eliminará el contenido del directorio que contiene el gitbook en la máquina remota en el IAAS.

        - Eliminará la clave que hemos transferido durante la etapa inicial del despliegue a la máquina remota.


-------------------------------------

## Pasos a seguir para la utilización del plugin Heroku.


#### Estructura inicial:

**1-** Descargar el paquete inicial: **gitbook-start-josue-nayra**

```bash
$ npm install -g gitbook-start-josue-nayra
```

Nota: Si ha tenido algún problema a la hora de instalar el paquete inicial, compruebe que no tiene creado previamente el directorio "~/.gitbook-start".


**2-** Crear el **libro** mediante el comando:

```bash
$ gitbook-start -d <directorio> --autor <autor> --name <nombre_libro> --url <url_repo>
```

Se construye así la estructura inicial por **gitbook-start**, es decir, la jerarquía de directorios conteniendo los scripts y ficheros markdown para el libro.


**3-** Colocarse en la carpeta que contiene el libro.

```bash
$ cd <directorio en el que se ha desplegado el libro>
```


**4-** Instalar las **dependencias** descritas en el package.json necesarias mediante el comando:

```bash
$ npm install
```

#### Estructura para el plugin Heroku:

**5-** Instalar el **plugin** requerido como **dependendecia** con la opción --save, como por ejemplo: **gitbook-start-heroku-P9-es-josue-nayra** para el despliegue en Heroku.

```bash
$ npm install --save gitbook-start-heroku-josue-nayra
```


**6-** Puede tener el **repositorio remoto actualizado** mediante una de las tareas descritas en el gulpfile.

```bash
$ gulp push --mensaje <mensaje commit>
```


**7-** Nos **logueamos en Heroku** a través del siguiente comando:

```bash
$ heroku login
```


**8-** Ahora debemos asignarle un **nombre a la aplicación** de Heroku que se creará en el siguiente paso. Para ello accedemos al package.json y rellenamos la sección de Heroku:

```json
"Heroku":{
  "nombre_app": "<nombre de la aplicación"
}
```

**9-** Para **construir el libro** disponemos de una tarea en el gulpfile denominada "build".

```bash
$ gulp build
```


**10-** Ejecutar el **deploy** para preparar el directorio para el despliegue en Heroku:

```bash
$ gitbook-start --deploy heroku
```

Una vez ejecutado el comando anterior, se generará automáticamente en el gulpfile.js una tarea llamada
"deploy-<máquina en la que realizar el despliegue>" que permitirá al usuario actualizar el contenido de dicha máquina.

```javascript
gulp.task("deploy-<máquina en la que realizar el despliegue>", function(){
    require(path.join(basePath, 'node_modules','<plugin de depliegue>')).deploy(...);
});
```



**11-** Rellenar el archivo **auth.json**. Para ello se deberán incluir los atributos **clientID** y **clientSecret** en la **plataforma que se desee** utilizar como autenticación.

**NOTA:** En el siguiente apartado (Pasos a seguir para la creación de aplicaciones en Google, Twitter y Facebook) se muestra información detallada de los pasos a realizar para utilizar las plataformas disponibles y obtener las claves en cada una de ellas.




**12-** Ahora el usuario podrá **desplegar en heroku** mediante la siguiente tarea:

```
$ gulp deploy-heroku
```



-------------------------------------

## Pasos a seguir para la creación de aplicaciones en Google, Twitter y Facebook.

----------

### Aplicación en Google

Para poder realizar la autenticación con Google se debe crear una aplicación en la API de Google.
Para ello se deben seguir los siguientes pasos:


- **Acceder a la API de desarrolladores y loguearse en Google:** [Administrador de aplicaciones Google](https://console.developers.google.com/?hl=ES)

![](https://s28.postimg.org/lgfk95f9p/api_google.png)


- **Crear un nuevo proyecto.**

![](https://s24.postimg.org/m1g15o8ad/nuevo_proyecto.png)


- **Creación de las credenciales de la aplicación.**

![](https://s29.postimg.org/do32zu7av/credenciales.png)


- **Tener en cuenta que para generar las credenciales se debe tener configurada la pantalla de autorización.**

![](https://s24.postimg.org/gzvigr81x/pantalla_Autorizacion.png)


- **Finalmente para la creación de credenciales se debe crear una aplicación WEB, en la cual debemos indicar la ruta de origen y la ruta de callback.**

![](https://s24.postimg.org/tl7jz2yad/credenciales_URls.png)


- **Después de esto nos mostrará en pantalla los parámetros "clientID" y "clientSecret". Los cuales debemos copiar e incluir en el archivo "auth.json".**

- **Tener en cuenta que la aplicación debe estar HABILITADA para su correcto funcionamiento.**

![](https://s24.postimg.org/a6yjm3x1h/habilitar.png)


----------

### Aplicación en Github

Para realizar la autenticación en GitHub debemos crear previamente una aplicación de desarrollador. Para ello, seguimos los siguientes pasos:

- **Acceder a los settings de nuestra cuenta.**

- **En la parte inferior izquierda acceder: "Developer settings"  --> "OAuth applications"**

- **A continuación registramos una nueva aplicación en: "Register a new OAuth application", e introducimos los campos que se indican a continuación:**

![](https://s23.postimg.org/t5pmdcqiz/registrar_Aplicacion.png)


- **Finalmente, si la aplicación se ha creado con éxito, nos mostrará las credenciales "clientID" y "clientSecret".**


----------

### Aplicación en Facebook

En el caso de realizar la autenticación con Facebook,

[Facebook para desarrolladores](https://developers.facebook.com/)


- **Para comenzar, accedemos a la plataforma para desarrolladores y creamos una nueva aplicación haciendo click en "Mis Aplicaciones".**
**Al hacerlo nos aparecerá la opción para "Crear una nueva aplicación".**

![](https://s27.postimg.org/yrm26ibir/paginafacebook.png)


- **Introducir la URL del sitio web en la que desplegamos nuestra aplicación.**

![](https://s23.postimg.org/nb1b2nga3/Enlaceinicial.png)


- **A continuación rellenar los campos que nos indican para "Crear un nuevo identificador de la aplicación".**

- **Para continuar, se han de seguir unos pasos para la configuración del passport con nuestra app. En primer lugar, añadimos la URL con la dirección de nuestra aplicación.**

![](https://s27.postimg.org/uly3w9bkz/indicar_URL.png)


- **Ahora ya tenemos creada nuestra aplicación, si accedemos de nuevo a "Mis aplicaciones" aparecerá la última aplicación añadida. Al acceder a ella nos muestra la información de la misma con los atributos "clientID" y "clientSecret".**

![](https://s23.postimg.org/uc7wodcff/identificador.png)

![](https://s24.postimg.org/n81y45omt/final_Facebook.png)


----------

### Aplicación en Twitter

Para realizar la autenticación con Twitter debemos realizar lo siguiente:

- **Acceder a la web de desarrolladores de Twitter: [Developers](https://dev.twitter.com/)**

- **Comenzar accediendo a la sección "Myapps" y crear una nueva aplicación.**

![](https://s28.postimg.org/vuxscsiwd/twitter.png)


- **A continuación se rellenarán los campos requeridos con los datos de la aplicación a la cual deseamos incluir la autenticación con twitter.**

![](https://s23.postimg.org/a0mn0r1y3/Captura_Twitter.png)


- **Hay que tener en cuenta que para la activación de la aplicación previamente debemos crear un TOKEN.**

Para ello en la información de nuestra aplicación accedemos a: **Keys and Access** --> **Your Access Token** --> **Crear un nuevo token**.


- **Con estos pasos ya tendremos creada la aplicación en Twitter y en ella encontraremos los atributos necesarios (clientID y clientSecret) para la autenticación passport con Twitter.**



-------------------------------------

### Tareas Gulp


* **push**

Tarea habilitada para que el usuario pueda actualizar el repositorio que contiene el gitbook. Está disponible una opción --mensaje para especificar el mensaje del commit.

```bash
$ gulp push --mensaje <mensaje del commit>
```

* **instalar_recursos**

Tarea que permite al usuario instalar plugins y dependencias necesarias para su gitbook.

```bash
$ gulp instalar_recursos
```

* **build**

Tarea para la construcción del libro.

```bash
$ gulp build
```

* **build-wiki**

Tarea para la construcción del directorio Wiki.

```bash
$ gulp build
```


* **deploy**

Tarea deploy genérica que actualiza las gh-pages del gitbook.
```
$ gulp deploy
```

* **deploy-heroku**

Tarea generada posteriormente a la realización y ejecución del comando gitbook-start --deploy, que permite al usuario realizar posteriores despliegues y actualizaciones de su gitbook en Heroku con gulp.
Por ejemplo, en el caso de que el usuario despliegue en Heroku, después de haber desplegado con la opción gitbook-start --deploy heroku, en el gulpfile se generará una tarea
con el nombre deploy-heroku.

```
$ gulp deploy-heroku
```

* **destroy-heroku**

Tarea generada para eliminar el repositorio remoto de Heroku y la aplicación en la plataforma de HerokuApp.

```
$ gulp destroy-heroku
```

----------


### Enlaces

- [Campus virtual](https://campusvirtual.ull.es/1617/course/view.php?id=1175)

- [Descripción del proyecto](https://crguezl.github.io/ull-esit-1617/proyectos/sytw/)

- [Repositorio del plugin Heroku](https://github.com/ULL-ESIT-SYTW-1617/proyecto-sytw-16-17-josue-nayra)

- [Repositorio del plugin IAAS](https://github.com/ULL-ESIT-SYTW-1617/proyecto-sytw-16-17-IAAS-josue-nayra)

- [Repositorio de gitbook-start-josue-nayra](https://github.com/ULL-ESIT-SYTW-1617/crear-repositorio-en-github-josue-nayra)

- [Publicación NPM del paquete gitbook-start-josue-nayra](https://www.npmjs.com/package/gitbook-start-josue-nayra)

- [Plugin NPM para el despliegue en IAAS](https://www.npmjs.com/package/gitbook-start-iaas-ull-es-josue-nayra)

- [Plugin NPM para el despliegue con Heroku](https://www.npmjs.com/package/gitbook-start-heroku-josue-nayra)


----------

### Referencias

- [Sequelize](http://docs.sequelizejs.com/en/latest/docs/getting-started/)

- [Sqlite](https://crguezl.github.io/ull-esit-1617/apuntes/db/sqlite/)

- [Tutorial para publicar paquetes nodejs](https://casianorodriguezleon.gitbooks.io/ull-esit-1617/content/apuntes/nodejspackages.html)

- [Gulp](https://casianorodriguezleon.gitbooks.io/ull-esit-1617/content/apuntes/gulp/)

- [Uso de templates](https://www.npmjs.com/package/ejs)

- [Fyle System de Nodejs para el manejo de archivos](https://casianorodriguezleon.gitbooks.io/ull-esit-1617/content/apuntes/fs.html)

- [Construyendo package.json](https://docs.npmjs.com/files/package.json)


----------

### Integrantes

- Josué Toledo Castro -
    [Github personal](www.github.com/JosueTC94)
- María Nayra Rodríguez Pérez -
    [Github personal](www.github.com/alu0100406122)
