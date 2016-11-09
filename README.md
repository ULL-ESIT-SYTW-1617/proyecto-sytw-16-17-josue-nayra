# Práctica 5. Sistemas y Tecnologías Web

## Plugin: gitbook-start-heroku-josue-nayra

El objetivo de esta práctica es extender el package NodeJS publicado en npm en una práctica anterior con un nuevo plugin que permita realizar el despliegue en Heroku con un simple gulp deploy-heroku.

El paquete gitbook-start-heroku-josue-nayra exporta dos módulos:

**Método deploy()** : Actualiza los cambios desplegando en la rama master de Heroku nuestro Gitbook. Es llamado desde la tarea del gulpfile
                        con el nombre "deploy-heroku".

**Método initialize()**: Este método realiza las siguientes tareas:
            
1.- En primer lugar, escribe en el fichero gulpfile.js una tarea "gulp deploy-heroku" que posteriormente será usada por el usuario  
    para desplegar la aplicación. En el caso de que ya exista la tarea, no se añade una nueva.

2.- En segundo lugar, se añaden dos ficheros desde el directorio template/ necesarios para el despliegue en Heroku: Procfile y app.js

3.- En tercer lugar, se genera un token para la autenticación con Heroku.

4.- Finalmente, una vez autenticados se hace un post a Heroku creando la aplicación y añadimos el repositorio de Heroku remoto correspondiente.
    


### Pasos a seguir para la utilización del plugin

1- Descargar el paquete inicial: *gitbook-start-josue-nayra*
    
```bash
$ npm install -g gitbook-start-josue-nayra 
```

2- Crear el libro mediante el comando:
    
```bash
$ gitbook-start -d <directorio> --autor <autor> --name <nombre_libro> --url <url_repo>
```
    
    Opciones disponibles para la creación del libro:
        
        -d o --directorio <directorio en el que se desplegará el libro>
        
        --autor <autor del libro>
        
        --name  <nombre del libro>
        
        --url <url del repositorio en github>
    
        --help 
        
        --version

Se construye así la estructura inicial por **gitbook-start**, es decir, la jerarquía de directorios conteniendo los scripts y ficheros markdown para el libro.

3- Colocarse en la carpeta que contiene el libro.

```bash
$ cd <directorio en el que se ha desplegado el libro>
```

4- Instalar las dependencias necesarias mediante el comando:
    
```bash
$ npm install 
```

5- Instalar el plugin requerido como dependendecia con la opción --save, como por ejemplo: **gitbook-start-heroku-ull-es-josue-nayra** para el despliegue en iaas.
    
```bash
$ npm install --save gitbook-start-heroku-josue-nayra
```

6- Es necesario tener el repositorio remoto actualizado. Para ello podemos ejecutar una de las tareas descritas en el gulpfile: **gulp push --mensaje <mensaje commit>**.

7- Nos logueamos en Heroku a través del siguiente comando:

```bash
$ heroku login
```


8- Ahora debemos asignarle un nombre a la aplicación de Heroku que se creará en el siguiente paso. Para ello accedemos al package.json y rellenamos la sección de Heroku:

```json
  "Heroku":{
    "nombre_app": "<nombre de la aplicación"
  },
```


9- Para construir el libro disponemos de una tarea en el gulpfile denominada "build".

```bash
$ gulp build
```

10- Una vez que hemos instalado el plugin de Heroku,  ejecutamos el deploy:
   
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


11- Ahora el usuario podrá ejecutar el siguiente comando y se le actualizarán los cambios en el Gitbook desplegado en Heroku:

``` 
$ gulp deploy-heroku 
```


### Tareas Gulp


* **push**

Tarea habilitada para que el usuario pueda actualizar el repositorio que contiene el gitbook. Está disponible una opción --mensaje para especificar el mensaje del commit.

```bash
$ gulp push --mensaje <mensaje del commit>
```

* **instalar_recursos**

Tarea que permite al usuario instalar plugins y dependencias necesarias para su gitbook.

```bash
& gulp instalar_recursos
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


### Enlaces

- [Campus virtual](https://campusvirtual.ull.es/1617/course/view.php?id=1175)

- [Descripción de la práctica](https://casianorodriguezleon.gitbooks.io/ull-esit-1617/content/practicas/practicaplugin2.html)

- [Publicación del paquete gitbook-start-josue-nayra](https://www.npmjs.com/package/gitbook-start-josue-nayra)

- [Plugin para el despliegue en IAAS](https://www.npmjs.com/package/gitbook-start-iaas-ull-es-josue-nayra)

- [Plugin para el despliegue con Heroku](https://www.npmjs.com/package/gitbook-start-heroku-josue-nayra)

- [Repositorio del plugin Heroku](https://github.com/ULL-ESIT-SYTW-1617/gitbook-start-heroku-josue-nayra/) 

- [Repositorio del plugin IAAS](https://github.com/ULL-ESIT-SYTW-1617/gitbook-start-iaas-ull-es-josue-nayra) 

- [Repositorio de gitbook-start-josue-nayra](https://github.com/ULL-ESIT-SYTW-1617/nueva-funcionalidad-para-el-paquete-npm-plugins-josue-nayra)

- [Repositorio MAIN Heroku](https://github.com/ULL-ESIT-SYTW-1617/practica-plugins-heroku-josue-nayra)



### Referencias

- [Tutorial para publicar paquetes nodejs](https://casianorodriguezleon.gitbooks.io/ull-esit-1617/content/apuntes/nodejspackages.html)

- [Gulp](https://casianorodriguezleon.gitbooks.io/ull-esit-1617/content/apuntes/gulp/)

- [Uso de templates](https://www.npmjs.com/package/ejs)

- [Fyle System de Nodejs para el manejo de archivos](https://casianorodriguezleon.gitbooks.io/ull-esit-1617/content/apuntes/fs.html)

- [Construyendo package.json](https://docs.npmjs.com/files/package.json)



### Integrantes

- Josué Toledo Castro
    [Github personal](www.github.com/JosueTC94)
- María Nayra Rodríguez Pérez
    [Github personal](www.github.com/alu0100406122)