
var exec = require('child_process').exec;
const jsonfile = require('jsonfile');
const path = require('path');
const fs = require('fs-extra');
const basePath = process.cwd();
const pkj = require(path.join(basePath, 'package.json'));
const inquirer = require('inquirer');
const Heroku = require('heroku-client');
const git = require('simple-git');

var heroku;
//-------------------------------------------------------------------------------------------------

var build_tokenHeroku = (() =>
{
  return new Promise((resolve,reject)=>
  {
    exec('heroku auth:token', ((error, stdout, stderr) =>
    {
      if (error)
      {
        console.error("Error:"+JSON.stringify(error));
        throw error;
      }

      // console.log("Token heroku:"+stdout);

      var aux = stdout.replace("\n","");
      var datos = { token_heroku : aux };

      // console.log("Datos:"+datos);

      jsonfile.spaces = 10;
      jsonfile.writeFileSync(path.join(process.env.HOME,'.heroku','heroku.json'),datos,{spaces: 10});
      resolve(stdout);
    }));
  });
});

//-------------------------------------------------------------------------------------------------


var get_tokenHeroku = (() =>
{
    return new Promise((result,reject)=>
    {
      if(fs.existsSync(path.join(process.env.HOME,'.heroku')))
      {
          if(fs.existsSync(path.join(process.env.HOME,'.heroku','heroku.json')))
          {
            fs.readFile(path.join(process.env.HOME,'.heroku','heroku.json'), (err,data) =>
            {
                if(err)
                {
                  throw err;
                }

                var datos = JSON.parse(data);
                result(datos.token_heroku);
            });
          }
          else
          {
              build_tokenHeroku().then((resolve,reject) =>
              {
                 //Construyo el heroku.json
                 result(resolve);
              });
          }
      }
      else
      {
          fs.mkdirp(path.join(process.env.HOME,'.heroku'), (err) =>
          {
              if(err)
                throw err;

              build_tokenHeroku().then((resolve,reject) =>
              {
                  //Construyo heroku.json
                  result(resolve);
              });
          });
      }
    });
});


//-------------------------------------------------------------------------------------------------

var get_AppName = (() =>
{
    return new Promise((resolve,reject) =>
    {
        if((pkj.Heroku.nombre_app).match(/\S/g))
        {
            resolve(pkj.Heroku.nombre_app);
        }
        else
        {
            var schema = [
              {
                name: 'nombre_app',
                message: "Enter HerokuApp Name:"
              }
            ];

            inquirer.prompt(schema).then((respuestas) =>
            {
                //Escribir en el package.json
                fs.readFile(path.join(basePath,'package.json'),(err,data) =>
                {
                    if(err)
                      throw err;

                    var datos = JSON.parse(data);

                    datos.Heroku.nombre_app = respuestas.nombre_app;

                    jsonfile.spaces = 10;
                    jsonfile.writeFileSync(path.join(basePath,'package.json'),datos,{spaces: 10});
                });

                resolve(respuestas.nombre_app);
            });
        }
    });
});

//-------------------------------------------------------------------------------------------------

var get_AppsHeroku = ((Appname)=>
{
    return new Promise((resolve,reject)=>
    {
      var res = true;
      heroku.get('/apps').then(apps => {
          for(var d in apps)
          {
            //console.log("Nombre app:"+apps[d].name);
            //console.log("Appname:"+Appname);
            if(Appname == apps[d].name)
            {
              // console.log("Ya existe la aplicacion");
              res = false;
            }
          }
          resolve(res);
      });
    });
});

//-------------------------------------------------------------------------------------------------
var destroy_app = ((cb)=>
{
    console.log(`Borrando app en Heroku: ${pkj.Heroku.nombre_app}`);
    get_tokenHeroku().then((resolve, reject) =>
    {
      heroku = new Heroku({ token: resolve });

      heroku.delete("/apps/buyacabuyaca")
        .then((app) => {
          console.log("Respuesta:"+JSON.stringify(app));
          return cb(null);
        })
        .catch((err) =>
        {
            // console.log("Catch");
            return cb(err);
        });
    });
});


var crear_app = (() => {
  return new Promise((result,reject) => {

    get_tokenHeroku().then((resolve, reject) =>
    {
      heroku = new Heroku({ token: resolve });

      get_AppName().then((resolve1,reject1) =>
      {
        get_AppsHeroku(resolve1).then((resolve2,reject2) =>
        {
          if(resolve2 != false){
             	heroku.post('/apps', {body: {name: resolve1}})
		            .then((app) => {

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

                    console.log("Creando app.js y Procfile");
                    fs.copy(path.join(__dirname,'../template','app.js'), path.join(basePath, 'app.js'));
                    fs.copy(path.join(__dirname,'../template','Procfile'), path.join(basePath, 'Procfile'));
                    fs.copy(path.join(__dirname,'../template','auth.json'), path.join(basePath, 'auth.json'));

                    fs.copy(path.join(__dirname,'../template','views'), path.join(basePath,'views'), (err) =>
                    {
                    	if(err)
                    	{
                    	  console.log(err);
                    	  throw err;
                    	}
                    });

                    //Copiamos ficheros necesarios para el uso de materialize
                    fs.copy(path.join(__dirname,'../template','public'), path.join(basePath, 'public'), (err) =>
                    {
                    	if(err)
                    	{
                    	  console.log("Error:"+err);
                    	  throw err;
                    	}
                    });

                    //Copiamos el directorio models para Sequelize
                    fs.copy(path.join(__dirname,'../template','models'), path.join(basePath, 'models'), (err) =>
                    {
                    	if(err)
                    	{
                    	  console.log("Error:"+err);
                    	  throw err;
                    	}
                    });

                    //Copiamos el directorio controladores para Sequelize
                    fs.copy(path.join(__dirname,'../template','controllers'), path.join(basePath, 'controllers'), (err) =>
                    {
                    	if(err)
                    	{
                    	  console.log("Error:"+err);
                    	  throw err;
                    	}
                    });

                    result(respuesta1.git_url);
        	        })
            	.catch((e) =>
            	{
            			console.log("Error:"+e);
            			console.log("Pruebe a realizar las siguientes acciones:");
            			console.log("1.-Cambie el nombre de su app");
            			console.log("2.-Compruebe que el número de aplicaciones en su cuenta de Heroku es menor que el máximo permitido");
            			console.log("3.-Vuelva a ejecutar el comando gitbook-start --deploy heroku");
                  throw e;
              });
          }
          else {
            console.log("Nombre de aplicación no disponible...");
          }

        });

      });
    });
  });
});


//-------------------------------------------------------------------------------------------------

exports.crear_app = crear_app;
exports.destroy_app = destroy_app;
