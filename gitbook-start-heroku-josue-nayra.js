"use strict"

const basePath = process.cwd();
const fs = require('fs-extra');
const path = require('path');
var exec = require('child_process').exec;
const inquirer = require('inquirer');

var heroku = require(path.join(__dirname,'lib','config_heroku.js'));

//-------------------------------------------------------------------------------------------------

var respuesta = ((error, stdout, stderr) =>
{
    if (error)
        console.error("Error:"+error);
    console.log("Stderr:"+stderr);
    console.log("Stdout:"+stdout);

});

//-------------------------------------------------------------------------------------------------

var deploy = (() => {
    console.log("Deploy to Heroku");
    exec('git add .; git commit -m "Deploy to Heroku"; git push heroku master', respuesta);
});

//-------------------------------------------------------------------------------------------------

var escribir_gulpfile = (() => {

  return new Promise((resolve,reject) => {
    var tarea_gulp = `\n\ngulp.task("deploy-heroku", function(){`+
             `\n       require("gitbook-start-heroku-P9-josue-nayra").deploy();`+
             `\n});`;

    fs.readFile('gulpfile.js', "utf8", function(err, data) {
        if (err) throw err;
        // console.log(data);
        if(data.search("deploy-heroku") != -1)
        {
          console.log("Ya existe una tarea de deploy-heroku");
        }
        else
        {
          // console.log("No existe una tarea de deploy-iaas-ull-es");
          fs.appendFile(path.join(basePath,'gulpfile.js'), `${tarea_gulp}`, (err) => {
            if (err) throw err;
              console.log("Escribiendo tarea en gulpfile para próximos despliegues");
          });
        }
    });
  });
});

//-------------------------------------------------------------------------------------------------

var obtener_variables = (() =>
{
    return new Promise((result,reject) =>
    {
      var schema = [
        {
          name: "authentication",
          message: "¿Quiere autenticacion?:",
          type: 'list',
          default: 'Si',
          choices: ['Si','No']
        }
      ];

      inquirer.prompt(schema).then((respuestas) =>
      {
          // console.log("Disposición de BD:"+respuestas.dispone_bd);
          result({authentication: respuestas.authentication });
      });

    });
});


//-------------------------------------------------------------------------------------------------
// Funcion para cambiar el nombre del index.html y evitar ambiguedades.

var preparar_despliegue = (() => {
  return new Promise((resolve, reject) => {

      if(fs.existsSync(path.join(basePath,'gh-pages','index.html')))
      {
        fs.rename(path.join(basePath,'gh-pages','index.html'), path.join(basePath,'gh-pages','introduccion.html'), (err) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(fs.existsSync(path.join(basePath,'gh-pages','introduccion.html')));
        });
      }
      else
      {
        if(fs.existsSync(path.join(basePath,'gh-pages','introduccion.html')))
        {
          resolve(fs.existsSync(path.join(basePath,'gh-pages','introduccion.html')));
        }
        else
        {
          console.log("No existe gh-pages... Debe ejecutar gulp build para construir el libro");
        }
      }
  });
});

//-------------------------------------------------------------------------------------------------

var initialize = (() => {
    console.log("Método initialize del plugin deploy-heroku");

    obtener_variables().then((resolve1,reject1) =>
    {
		    preparar_despliegue().then((resolve2, reject2) =>
		    {
		      heroku.crear_app().then((resolve3,reject3) =>
		      {
		            escribir_gulpfile();
		      });
		    });

    });
});

//-------------------------------------------------------------------------------------------------

exports.initialize = initialize;
exports.deploy = deploy;
