var bcrypt = require('bcrypt-nodejs');
var models = require('../models/models.js');
console.log("User:"+models.User);
var findByUsername = ((username_, password_, cb) => {
    models.User.findAll({where: {
        username: username_
    }}).then((datos) => {
        console.log(JSON.stringify(datos));
        if(datos.length > 0) {
            if(bcrypt.compareSync(password_, datos[0].password))
            {
              return cb(null,datos[0]);
            }
            return cb(null,false);
        }
        return cb(null,false);
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
        datos.update({
          password: new_password
        })
        .then((respuesta)=>
        {
          console.log("ACTUALIZADO PASSWORD:"+JSON.stringify(respuesta));
          models.User.findAll({where: {
              username: username_
          }}).then((datos) => {
              console.log("USUUUUUU:"+JSON.stringify(datos[0]));
              return cb(null);
          })
          .catch((error)=>
          {
              console.log("ea ea ea macarena");
              return cb(null);
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

var create_user = ((username_, password_, displayName_, cb) =>
{
    models.User.create(
    {
        username: username_,
        password: password_,
        displayName: displayName_

    }).then(()=> {
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
