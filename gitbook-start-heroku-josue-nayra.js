"use strict"

const basePath = process.cwd();
const fs = require('fs-extra');
const path = require('path');
var exec = require('child_process').exec;
const pkj = require(path.join(basePath, 'package.json'));
const git = require('simple-git');
const Heroku = require('heroku-client');


var respuesta = ((error, stdout, stderr) =>
{
    if (error)
        console.error("Error:"+error);
    console.log("Stderr:"+stderr);
    console.log("Stdout:"+stdout);
});

var deploy = (() => {
    console.log("Deploy to Heroku");
    exec('git add .; git commit -m "Deploy to Heroku"; git push heroku master', respuesta); 
});


var initialize = (() => {
    console.log("Método initialize del plugin deploy-heroku");

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
    
    
    console.log("Creando app.js y Procfile");
    fs.copy(path.join(__dirname,'template','app.js'), path.join(basePath, 'app.js'));
    fs.copy(path.join(__dirname,'template','Procfile'), path.join(basePath, 'Procfile'));

    
    //Creamos aplicacion
    exec('heroku auth:token', ((error, stdout, stderr) =>
    {
      if (error)
          console.error("Error:"+JSON.stringify(error));
      // console.log("Stderr:"+stderr);
      // console.log("Stdout(token):"+stdout);
      // console.log("Aplication:\n"+JSON.stringify(pkj.Heroku));
      const heroku = new Heroku({ token: stdout });
    
    
      heroku.post('/apps', {body: {name: pkj.Heroku.nombre_app}}).then(app => {
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
      });
    }));
});

exports.initialize = initialize;
exports.deploy = deploy;