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
          console.log("ACTUALIZADO PASSWORD:"+JSON.stringify(respuesta));
          models.User.find({where: {
              username: username_
          }}).then((datos) => {
              console.log("USUUUUUU:"+JSON.stringify(datos));
              return cb(null);
          })
          .catch((error)=>
          {
              console.log("ea ea ea macarena");
              return cb(error);
          });
        })
        .catch((err)=>
        {
          console.log("ERROR ACTUALIZANDO PASSWORD:"+err);
          return cb(err);
        });
      }
      else
      {
        console.log("No se ha encontrado el usuario");
        return cb(true);
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

exports.findByUsername = findByUsername;
exports.change_password = change_password;
exports.create_user = create_user;
exports.borrar_cuenta = borrar_cuenta;
