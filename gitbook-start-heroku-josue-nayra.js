"use strict"

const basePath = process.cwd();
const fs = require('fs-extra');
const path = require('path');
var exec = require('child_process').exec;
const pkj = require(path.join(basePath, 'package.json'));
const git = require('simple-git');
const Heroku = require('heroku-client');
const inquirer = require('inquirer');
var Dropbox = require('dropbox');
// var dbx = new Dropbox({ accessToken: datos_config.token_dropbox });

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
             `\n       require("gitbook-start-heroku-josue-nayra").deploy();`+
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

var bd_existsDropbox = (() =>
{
    return new Promise((resolve,reject) =>
    {
        var schema = [
          {
            name: "dispone_bd",
            message: "Dispone de base de datos en Dropbox?",
            type: 'list',
            default: 'Si',
            choices: ['Si', 'No']
          }
        ];

        inquirer.prompt(schema).then((respuestas) =>
        {
            console.log("Disposición de BD:"+respuestas.dispone_bd);
            resolve(respuestas.dispone_bd);
        });
    });
});

//-------------------------------------------------------------------------------------------------

var get_token = ((dispone_bd) =>
{
  return new Promise((resolve,reject) =>
  {
      var mensaje;
      console.log("Dispone de base de datos en get_token:"+dispone_bd);
      if(dispone_bd == 'Si')
      {
        mensaje = "Link to the BD:";
      }
      else
      {
        mensaje = "Path in Dropbox for building BD:";
      }

      var schema =
      [
          {
            name: "token_dropbox",
            message: "Enter your Dropbox Token:"
          },
          {
            name: "link_bd",
            message: mensaje
          },
          {
            name: "authentication",
            message: "Do you want to authentication?",
            type: 'list',
            default: 'Yes',
            choices: ['Yes', 'No']
          }
      ];

      inquirer.prompt(schema).then((respuestas) =>
      {
          console.log("token_dropbox:"+respuestas.token_dropbox);
          console.log("Path BD:"+respuestas.path_bd);
          resolve({"token_dropbox": respuestas.token_dropbox, "link_bd": respuestas.link_bd, "authentication": respuestas.authentication});
      });
  });
});

//-------------------------------------------------------------------------------------------------

var obtener_variables = (() =>
{
    return new Promise((result,reject) =>
    {
        var dispone_bd;

        bd_existsDropbox().then((resolve,reject) =>
        {
            dispone_bd = resolve;
            get_token(dispone_bd).then((resolve,reject) =>
            {
                  var respuesta = resolve;
                  if(dispone_bd == 'Si')
                  {
                      //Pregunto donde esta el fichero
                      result(respuesta);
                  }
                  else
                  {
                      // //No existe fichero en Dropbox
                      
                  }
            });
        });

    });
});
//-------------------------------------------------------------------------------------------------

var generar_fileSecret = ((datos) =>
{
    return new Promise((resolve, reject) =>
    {
        var configuracion =
        `{ "token": "${datos.token}", "clientID": "${datos.clientID}", "clientSecret": "${datos.clientSecret}", "authentication": "${datos.authentication}" }`;

        fs.writeFile(path.join(basePath,'.secret.json'), configuracion, (err) =>
        {
          if(err) throw err;
        });
        resolve(configuracion);
    });
});

//-------------------------------------------------------------------------------------------------
// Funcion para cambiar el nombre del index.html y evitar ambiguedades.

var preparar_despliegue = (() => {
  return new Promise((resolve, reject) => {
      fs.rename(path.join(basePath,'gh-pages','index.html'), path.join(basePath,'gh-pages','introduccion.html'), (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
        resolve(fs.existsSync(path.join(basePath,'gh-pages','introduccion.html')));
      });
  });
});


//-------------------------------------------------------------------------------------------------

var crear_app = (() => {
  return new Promise((resolve,reject) => {
    console.log("Creando app.js y Procfile");
    fs.copy(path.join(__dirname,'template','app.js'), path.join(basePath, 'app.js'));
    fs.copy(path.join(__dirname,'template','Procfile'), path.join(basePath, 'Procfile'));

    fs.copy(path.join(__dirname,'template','views'), path.join(basePath,'views'), (err) =>
    {
        if(err)
        {
          console.log(err);
          throw err;
        }
    });

    //Copiamos ficheros necesarios para el uso de materialize
    fs.copy(path.join(__dirname,'template','public'), path.join(basePath, 'public'), (err) =>
    {
        if(err)
        {
          console.log("Error:"+err);
          throw err;
        }
    });
    
    //Creamos aplicacion
    exec('heroku auth:token', ((error, stdout, stderr) =>
    {
      if (error)
          console.error("Error:"+JSON.stringify(error));
      // console.log("Stderr:"+stderr);
      // console.log("Stdout(token):"+stdout);
      // console.log("Aplication:\n"+JSON.stringify(pkj.Heroku));
      const heroku = new Heroku({ token: stdout });
    
    
      heroku.post('/apps', {body: {name: pkj.Heroku.nombre_app}}).then((app) => {

            var respuesta = JSON.stringify(app);
            // console.log("App:"+respuesta);
            var respuesta1 = JSON.parse(respuesta);
            var git_url = respuesta1.git_url;
            console.log("Git url:"+respuesta1.git_url);
            git()
              .init()
              .add('./*')
              .commit("Deploy to Heroku")
              .addRemote('heroku', git_url);
            
            resolve(respuesta1.git_url);
      });
    }));
    
  }); 
});



//-------------------------------------------------------------------------------------------------

var initialize = (() => {
    console.log("Método initialize del plugin deploy-heroku");

    obtener_variables().then((resolve,reject) =>
    {
        console.log("Obtener_variables:"+JSON.stringify(resolve));
        generar_fileSecret(resolve).then((resolve,reject) =>
        {
            console.log("generar_fileSecret");
            preparar_despliegue().then((resolve, reject) => 
            {
              crear_app().then((resolve,reject) =>
              {
                    escribir_gulpfile();
              });  
            });
            
        });
    });
});

//-------------------------------------------------------------------------------------------------

exports.initialize = initialize;
exports.deploy = deploy;
