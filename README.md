# Proyecto Sistemas y Tecnologías Web

## Nuevas funcionalidades en los paquetes IAAS y Heroku

#### Paquete para el despliegue en Heroku:

Modificaciones realizadas en el plugin para el despliegue en Heroku. [Repositorio](https://github.com/ULL-ESIT-SYTW-1617/proyecto-sytw-16-17-josue-nayra)

- Autenticación con: **Google**, **Twitter**, **Facebook** y **Github**.

- **Vista administrador** para la gestión de los usuarios que visitan el libro por parte del autor del mismo.

- Opción para elegir el tipo de base de datos: **Sequelize** o **Dropbox**.


#### Paquete para el despliegue en IAAS:

Modificaciones realizadas en el plugin para el despliegue en IAAS. [Repositorio](https://github.com/ULL-ESIT-SYTW-1617/proyecto-sytw-16-17-IAAS-josue-nayra)

- **Vista administrador** para la gestión de los usuarios que visitan el libro por parte del autor del mismo.

- Se han generado nuevas **tareas** en el **gulpfile.js** para facilitar al usuario la iteracción con la máquina IAAS.
  Las nuevas tareas han sido:
    - Deploy
    - Destroy



-------------------------------------
-------------------------------------


### Pasos a seguir para la utilización del plugin Heroku.


**Estructura inicial:**

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

**Estructura para el plugin Heroku:**

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


**10-** Rellenar el archivo **auth.json**. Para ello se deberán incluir los atributos **clientID** y **clientSecret** en la **plataforma que se desee** utilizar como autenticación.

**NOTA:** En el siguiente apartado () se muestra información detallada de los pasos a realizar para utilizar las plataformas disponibles y obtener las claves en cada una de ellas.



**11-** Ejecutar el **deploy** para preparar el directorio para el despliegue en Heroku:
   
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


**12-** Ahora el usuario podrá **desplegar en heroku**:

``` 
$ gulp deploy-heroku 
```



----------

## Pasos a seguir para la creación de aplicaciones en Google, Twitter y Facebook.

### Aplicación en Google

Para poder realizar la autenticación con Google se debe crear una aplicación en la API de Google.
Para ello se deben seguir los siguientes pasos:

- **Acceder a la API de desarrolladores y loguearse en Google:** [Administrador de aplicaciones Google](https://console.developers.google.com/?hl=ES)

![](https://s28.postimg.org/lgfk95f9p/api_google.png)

- **Crear un nuevo proyecto.**

![](https://s24.postimg.org/m1g15o8ad/nuevo_proyecto.png)

- **Creación de las credenciales de la aplicación.**

![](https://s29.postimg.org/do32zu7av/credenciales.png)


### Aplicación en Twitter


### Aplicación en Facebook

----------
----------

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

----------


### Enlaces

- [Campus virtual](https://campusvirtual.ull.es/1617/course/view.php?id=1175)

- [Descripción de la práctica](https://crguezl.github.io/ull-esit-1617/practicas/practicapassportlocalsequelize.html)

- [Publicación del paquete gitbook-start-josue-nayra](https://www.npmjs.com/package/gitbook-start-josue-nayra)

- [Plugin para el despliegue en IAAS](https://www.npmjs.com/package/gitbook-start-iaas-ull-es-josue-nayra)

- [Plugin para el despliegue con Heroku](https://www.npmjs.com/package/gitbook-start-heroku-P9-josue-nayra)

- [Repositorio del plugin Heroku](https://github.com/ULL-ESIT-SYTW-1617/practica-localstrategy-y-base-de-datos-josue-nayra) 

- [Repositorio del plugin IAAS](https://github.com/ULL-ESIT-SYTW-1617/practica-localstrategy-y-base-de-datos-iaas-ull-es-josue-nayra) 

- [Repositorio de gitbook-start-josue-nayra](https://github.com/ULL-ESIT-SYTW-1617/nueva-funcionalidad-para-el-paquete-npm-plugins-josue-nayra)


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
