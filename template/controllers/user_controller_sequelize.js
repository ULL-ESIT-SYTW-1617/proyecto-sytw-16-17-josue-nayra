var bcrypt = require('bcrypt-nodejs');
var models = require('../models/models.js');
console.log("User:"+models.User);

var findByUsername = ((username_, password_, cb) => {
    models.User.find({where: {
        username: username_
    }})
    .then((datos) => {
        console.log(JSON.stringify(datos));
        if(datos) {
            if(bcrypt.compareSync(password_, datos.password))
            {
              console.log("Password correcto");
              return cb(null,datos);
            }
            else
            {
              console.log("Usuario encontrado pero Password no correcto.");
              return cb("Password incorrecto",false);
            }
        }
        else
        {
          console.log("Usuario no encontrado");
          return cb("Usuario no encontrado",false);
        }
    })
    .catch((err)=>
    {
      console.log("Error al realizar la consulta");
      return cb(err,false);
    });
});

var change_password = ((username_,password_actual,new_password, cb) =>
{
  models.User.find({ where: { username: username_ } })
  .then((datos) =>
  {
    if(datos)
    {
      if(bcrypt.compareSync(password_actual, datos.password))
      {
        datos.updateAttributes({
          password: new_password
        })
        .then((respuesta)=>
        {
          models.User.find({where: {
              username: username_
          }}).then((datos) => {
              return cb(null);
          })
          .catch((error)=>
          {
              return cb(error);
          });
        })
        .catch((err)=>
        {
          return cb(err);
        });
      }
      else
      {
        console.log("El password actual introducido por el usuario no es correcto");
        return cb("El password actual introducido no es el correcto");
      }
    }
    else
    {
        return cb(true);
    }
  })
  .catch((err) =>
  {
      console.log("ERROR ACTUALIZANDO PASSWORD:"+err);
      return cb(err);
  });
});

var existe_usuario = ((username_, password_, displayName_, cb) =>
{
  models.User.find({where: {username: username_}})
      .then((user) =>
      {
        if (user) {
            return cb(null, user);
        }
        else {
          return cb(null, null);
        }

      })
      .catch(function (err) {
          return cb(err, null);
      });

});

var create_user = ((username_, password_, displayName_, cb) =>
{
    existe_usuario(username_, password_, displayName_, (error,user) =>
    {
      if(error){
        return cb(error);
      }
      if(user){
        return cb("Ya existe el usuario");
      }

      models.User.create(
      {
        username: username_,
        password: password_,
        displayName: displayName_

      }).then((datos)=> {
          models.User.findAll({where: {
            username: username_,
            password: password_,
            displayName: displayName_
          }}).then((datos)=>
          {
            return cb(null);
          })
          .catch((err)=>
          {
            return cb(err);
          });
        })
        .catch((err)=>
        {
          return cb(err);
        });
    });
});

var borrar_cuenta = ((username_, password_, displayName_, cb) =>
{
    models.User.destroy({
      where: {
        username: username_,
        password: password_,
        displayName: displayName_
      }
    }).then(()=>
    {
      return cb(null);
    }).catch((error) =>
    {
      return cb(error);
    });
});


var borrarById = ((id_, cb) =>
{
    models.User.destroy({
      where: {
        id: id_
      }
    }).then(()=>
    {
      console.log("todo perfect");
      return cb(null);
    }).catch((error) =>
    {
      console.log("todo no perfect");
      return cb(error);
    });
});


var findAll = ((cb)=>
{
  console.log("Controller usuarios: findNewUsers");
  models.User.findAll({ where: { username: { $ne: 'admin' }}})
    .then((usuarios) =>
    {
        console.log("Usuarios:"+usuarios);
        return cb(null,usuarios);
    }).catch((err) =>
    {
      console.log("error en el catch:"+err);
      return cb(err, null);
    });
});

var nueva_visita = ((username_,password_,cb)=>
{
  models.User.find({ where: { username: username_, password: password_ } })
  .then((datos) =>
  {
    if(datos)
    {
        var num_visitas = datos.visitasGitbook + 1;
        datos.updateAttributes({
          visitasGitbook: num_visitas
        })
        .then((respuesta)=>
        {
          console.log("TODO OK");
          return cb(null);
        })
        .catch((err)=>
        {
          console.log("TODO NO OK");
          return cb(err);
        });
    }
    else
    {
        console.log("El usuario no se ha encontrado.");
        return cb("Usuario no disponible.");
    }
  })
  .catch((err) =>
  {
      console.log("Error actualizando registro de visitas:"+err);
      return cb(err);
  });
});

exports.findByUsername = findByUsername;
exports.change_password = change_password;
exports.create_user = create_user;
exports.borrar_cuenta = borrar_cuenta;
exports.borrarById = borrarById;
exports.findAll = findAll;
exports.nueva_visita = nueva_visita;
