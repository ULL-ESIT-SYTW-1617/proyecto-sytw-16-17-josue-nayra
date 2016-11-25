"use strict";

var bcrypt = require("bcrypt-nodejs");

//-------------------------------------------------------------------------------------------------

var findByUsername = ((db,username,password,cb)=>
{
	var query = `SELECT * FROM USUARIOS WHERE username = '${username}' AND password='${password}'`;
	console.log("Query:"+query);
	try {
		db.all(query, function(err, row)
		{
			if(err)
			{
				console.log("Err:"+err);
				return cb(null,false);
			}

			if(row.length > 0)
			{
				// console.log("ID:"+row[0].userID+",Username:"+row[0].username+",password:"+row[0].password+",displayname:"+row[0].displayName);
				
				if(bcrypt.compareSync(password,row[0].password))
				{
					console.log("Password correcto.");
					return cb(null,row);
				}
				else
				{
					console.log("Password incorrecto.");
					return cb(null,false);
				}
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

//-------------------------------------------------------------------------------------------------

var change_password = ((db, username, password, cb) =>
{
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

//-------------------------------------------------------------------------------------------------

var create_user = ((db, username, password, displayName, cb) =>
{
	var password_encripted = bcrypt.hashSync(password);
	// console.log("Creando usuario --> Password: "+password_encripted);
	
	db.run(`INSERT INTO 'USUARIOS'(userID,username, password, displayName) VALUES(NULL,'${username}','${password_encripted}','${displayName}')`, function(err)
	{
		 if(err)
		 {
			 console.log("ERROR INSERTANDO:"+err);
			 return cb(err);
		 }
		 console.log("Inserción realizada con éxito");
		 return cb(null);
	});
});

//-------------------------------------------------------------------------------------------------

var borrar_cuenta = ((db, username, password,displayName, cb) =>
{
	db.all(`SELECT * FROM USUARIOS WHERE username = '${username}' AND password = '${password}' AND displayName = '${displayName}'`, (err,row) =>
	{
		if(err){
			console.log(err);
			return cb(err);
		}	
		
		if(row.length > 0){
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
		}
	});
	
});

//-------------------------------------------------------------------------------------------------

exports.borrar_cuenta = borrar_cuenta;
exports.create_user = create_user;
exports.change_password = change_password;
exports.findByUsername = findByUsername;
