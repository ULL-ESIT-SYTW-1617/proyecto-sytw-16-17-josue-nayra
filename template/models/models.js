var Sequelize = require('sequelize');
var path = require('path');

var sequelize = new Sequelize(null, null, null, {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: 'database.sqlite'
});

// Importar tabla usuario
var user_path = path.join(__dirname,'usuarios.js');
var User = sequelize.import(user_path);

sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  User.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      User.bulkCreate( 
        [ {username: 'admin',   password: '1234', displayName: 'Administrador'},
          {username: 'pepe',   password: '5678', displayName: 'Pepe López'} // el valor por defecto de isAdmin es 'false'
        ]
      ).then(function(){
        console.log('Base de datos (tabla user) inicializada');

        });
      }
  });
});

exports.User = User;