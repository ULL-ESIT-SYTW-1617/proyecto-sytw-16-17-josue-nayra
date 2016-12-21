"use strict";

var path = require('path');
var basePath = process.cwd();
var bcrypt = require('bcrypt-nodejs');
var Dropbox = require('dropbox');
var dbx;
var datos_config = require(path.join(basePath,'.dropbox.json'));
var dbx = new Dropbox({accessToken: datos_config.token_dropbox});
var datos;
var users;
var nombre_bd;

var carga_inicial = (()=>
{
    return new Promise((resolve,reject)=>
    {
      //Carga inicial de usuarios
      dbx.sharingGetSharedLinkFile({ url: datos_config.link_bd})
      .then((data) =>
      {
          nombre_bd = data.name;
          datos = JSON.parse(data.fileBinary);
          console.log("Datos:"+datos);
          users = datos.users;
          console.log("USERS:"+JSON.stringify(users));
          resolve(users);
      })
      .catch((err) =>
      {
          console.log("Error:"+err);
          reject(err);
      });
    });
});

var actualizar_bd = ((cb) =>
{
  try {
    dbx.filesUpload({path: '/'+nombre_bd, contents: JSON.stringify(datos), mode: "overwrite"})
      .then(function(response)
      {
        console.log("RESPONSE:"+JSON.stringify(response));
        return cb(null);
      });
  } catch (err) {
    console.log("ERROR:"+JSON.stringify(err));
    return cb(err);
  }
});

var findByUsername = ((username_, password_, cb) => {
  carga_inicial().then((users,reject)=>
  {

    console.log("Longitud:"+users.length);
    for(var i=0;i<users.length;i++)
    {
      console.log("Comparando con usuario:"+users[i].username);
      if(username_ == users[i].username)
      {
        try {
          if(bcrypt.compareSync(password_,users[i].password))
          {
            console.log("Password correcto");
            return cb(null,users[i]);
          }
          else
          {
            console.log("Usuario encontrado pero Password no correcto.");
            return cb("Password incorrecto",false);
          }
        } catch (e) {
          console.log("Err:"+e);
          if(password_ == users[i].password)
          {
            var new_password = password_;
            var hash = bcrypt.hashSync(new_password);
            var user_logueado = users[i];
            change_password(username_, hash, (err)=>
            {
                if(err)
                  return cb(err, null);

                return cb(null, user_logueado);
            });
          }
          else
          {
            return cb(null, null);
          }
        }
      }
    }
    return cb("No se ha encontrado el usuario", null);
  });
});

var change_password = ((username, password_actual, new_password, cb) =>
{
  console.log("Adios1");
  for(var i=0;i<users.length;i++)
  {
    if(users[i].username == username)
    {
      console.log("Adios2");
      if(bcrypt.compareSync(password_actual, users[i].password))
      {
        var hash = bcrypt.hashSync(new_password);
        users[i].password = hash;
        actualizar_bd((err)=>
        {
            if(err)
            {
              console.log("Error:"+err);
              return cb(err);
            }
            return cb(null);
        });
      }
      else
      {
          return cb("Password introducido incorrecto");
      }
    }
  }
});

var existe_usuario = ((username_, cb) =>
{
  carga_inicial().then((usuarios,reject)=>
  {
    try {
      for(var i=0;i<usuarios.length;i++)
      {
        if(username_ == usuarios[i].username)
        {
          //Username usado ya por otro usuario
          return cb(null,usuarios[i], usuarios);
        }
      }
      return cb(null,null, usuarios);
    } catch (e) {
      console.log("Catch:"+e);
      return cb(e,null, usuarios);
    }
  });
});

var findMaxId = ((datos) =>
{
    var maximoid = 0;
    for(var i=0;i<datos.length;i++)
    {
      if(datos[i].id > maximoid)
        maximoid = datos[i].id;
    }
    return maximoid;
});

var create_user = ((username_, password_, displayName_, cb) =>
{
  existe_usuario(username_,(error,usuario,users)=>
  {
    if(error)
      return cb(err);

    if(usuario)
    {
      return cb("Username ya utilizado. Pruebe con otro");
    }
    else
    {
        var hash = bcrypt.hashSync(password_);

        var nuevo_id = findMaxId(users);
        //ACTUALIZAMOS CONTENIDO DE USERS
        users.push({
          "id": nuevo_id+1,
          "username": username_,
          "password": hash,
          "displayName": displayName_,
          "visitasGitbook": 0
        });

        actualizar_bd((err)=>
        {
          if(err)
          {
            return cb(err);
          }
          return cb(null);
        });
    }
  });
});

var borrar_cuenta = ((username_, password_, displayName_, cb) =>
{
    console.log("Usuario en borrar_cuenta:"+username_);

    for(var i=0,len = users.length; i < len; i++)
    {
      var record = users[i];
      console.log("RECORD:"+JSON.stringify(record));
      if(record.username == username_)
      {
        console.log("ENCONTRADO PA BORRAR");
        delete users.splice(i,1);
        break;
      }
    }
    console.log("Users:"+JSON.stringify(users));

    actualizar_bd((err)=>
    {
      if(err)
      {
        return cb(err);
      }
      return cb(null);
    });
});

var borrarById = ((id_, cb) =>
{
    carga_inicial().then((users,reject)=>
    {
      for(var i=0,len = users.length; i < len; i++)
      {
        var record = users[i];
        console.log("RECORD:"+JSON.stringify(record));
        if(record.id == id_)
        {
          console.log("ENCONTRADO PA BORRAR");
          delete users.splice(i,1);
          break;
        }
      }

      actualizar_bd((err)=>
      {
        if(err)
        {
          return cb(err);
        }
        return cb(null);
      });
    });
});


var findAll = ((cb)=>
{
  console.log("Controller usuarios: findNewUsers");
  carga_inicial().then((resolve,reject)=>
  {
      if(!reject)
      {
        return cb(null,resolve);
      }
      else
      {
        return cb(reject,null)
      }
  });
});


exports.findByUsername = findByUsername;
exports.change_password = change_password;
exports.create_user = create_user;
exports.borrar_cuenta = borrar_cuenta;
exports.borrarById = borrarById;
exports.findAll = findAll;
