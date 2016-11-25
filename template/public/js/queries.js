"use strict";

var findById = ((users,id,cb) =>
{
		// process.nextTick(() =>
		// {
				var idx = id-1;
				if(users[idx])
				{
					cb(null,users[idx]);
				}else {
					cb(new Error('User '+id+' does not exist'));
				}
		// });
});

var findByUsername = ((db,username,password,cb)=>
{
	console.log("findByUsername");
	console.log("TODOS LOS USUARIOS:");
	db.all('SELECT * FROM USUARIOS', function(err,rows)
	{
			if(err)
			{
				console.log("ESE ERROR MAMIII");
				throw err;
			}
			console.log("ROWSSSS BABY:"+JSON.stringify(rows));
	});

	var query = `SELECT * FROM USUARIOS WHERE username = '${username}' AND password='${password}'`;
	console.log("Query:"+query);
	try {
		db.all(query, function(err, row)
		{
			console.log("BUSCANDOOOOOOO");
			console.log("ROWS:"+JSON.stringify(row));
			console.log("ROWS length:"+row.length);
			if(err)
			{
				console.log("Err:"+err);
				return cb(null,false);
			}

			if(row.length > 0)
			{
				console.log("EA EA EA MACARENA");
				console.log("ID:"+row[0].userID+",Username:"+row[0].username+",password:"+row[0].password+",displayname:"+row[0].displayName);
				return cb(null, row);
			}
			else
			{
				console.log("No se ha encontrado el usuario");
				return cb(null, false);
			}
		});
	} catch(e) {
		console.log("Exception ocurred."+e);
	};
});

var change_password = ((db, username, password, cb) =>
{
	console.log("estoy en change_password");
	var query = `UPDATE USUARIOS SET password = '${password}' WHERE Username = '${username}'`
	console.log("QUERY:"+query);
	db.run(query, function(err)
	{
		if(err)
		{
			console.log("ERROR MODIFICANDO: "+err);
			throw err;
		}
		console.log("Modificación de contraseña realizada.");
		cb(null);
	});
});

var create_user = ((db, username, password, displayName, cb) =>
{
	db.run(`INSERT INTO 'USUARIOS'(userID,username, password, displayName) VALUES(NULL,'${username}','${password}','${displayName}')`, function(err)
	{
		 if(err)
		 {
			 console.log("ERROR INSERTANDO:"+err);
			 throw err;
		 }
		 console.log("Inserción realizada con éxito");
		 findByUsername(db,username, password,(err,usuario)=>
	 	 {
					if(err)
					{
						console.log("ERROR:"+err);
						throw err;
					}
					return cb(null, usuario[0]);
		 });
	});
});

var borrar_cuenta = ((db, username, password,displayName, cb) =>
{
	// DELETE
	db.run(`DELETE FROM 'USUARIOS' WHERE username='${username}' AND password = '${password}' AND displayName='${displayName}'`, function(err)
	{
	  if(err)
	  {
	    console.log("ERROR HACIENDO EL DELETE:"+err);
			return cb(err);
	  }
	  console.log("Delete realizado con éxito");
		return cb(null);
	});
});

exports.borrar_cuenta = borrar_cuenta;
exports.create_user = create_user;
exports.change_password = change_password;
exports.findByUsername = findByUsername;
exports.findById = findById;
