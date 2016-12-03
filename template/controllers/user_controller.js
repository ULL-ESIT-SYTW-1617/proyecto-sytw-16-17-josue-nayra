var bcrypt = require('bcrypt-nodejs');
var models = require('../models/models.js');
console.log("User:"+models.User);

var findByUsername = ((username_, password_, cb) => {
    models.User.findAll({where: {
        username: username_
    }}).then((datos) => {
        console.log(JSON.stringify(datos));
        if(datos.length > 0) {
            // if(bcrypt.compareSync(password_, datos[0].password)){
            //     console.log("Usuario encontradado...");
            //     return cb(null,datos[0]);
            // }
            if(password_, datos[0].password)
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
  models.User.findAll({where:{username: username_}})
             .then((datos)=>
              {
                  if(bcrypt.compareSync(password_actual, datos[0].password)){
                    console.log("Cambiando password yeah to yeah");
                    models.User.update({ password: bcrypt.hashSync(new_password)}, { where: { username: datos[0].username, password: datos[0].password }});
                    return cb(null);
                  }
                  else {
                    return cb(false);
                  }
                  
              })
              .catch((err)=>
              {
                 console.log("ERROR cambiando password:"+err);
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
