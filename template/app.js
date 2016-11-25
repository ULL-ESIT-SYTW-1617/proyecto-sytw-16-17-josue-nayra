var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var path = require('path');
var basePath = process.cwd();
var config = require(path.join(basePath,'.secret.json'));
var datos_config = JSON.parse(JSON.stringify(config));
var logout = require('express-passport-logout');
var expressLayouts = require('express-ejs-layouts');

var bcrypt = require("bcrypt-nodejs");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(datos_config.nombre_bd+'.db');
var funciones_db = require(path.join(basePath,'public','js','queries.js'));

// Database initialization
db.serialize(function(){
  db.run("CREATE TABLE IF NOT EXISTS USUARIOS ( userID INTEGER PRIMARY KEY AUTOINCREMENT, username varchar(255), password varchar(255),displayName varchar(255) );", function(err)
  {
    if(err)
    {
      console.log("ERROR CREANDO TABLA:"+err);
      throw err;
    }
    console.log("SQL Table 'USUARIOS' initialized");
  });
});

passport.use(new LocalStrategy(
  function(username, password, cb) {
    console.log("Estrategia de local");
    console.log("User:"+username);
    console.log("Password:"+password);

    //SELECTTTTTT
    funciones_db.findByUsername(db,username,password, (err,usuario) =>
    {
        if(err)
        {
          console.log("Err:"+err);
          throw err;
        }
        return cb(null,usuario);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null,obj);
});

// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.use(express.static(path.join(__dirname,'gh-pages/')));
app.use(express.static(path.join(__dirname,'public/')));
app.set("views", __dirname+'/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    console.log("Usuario:"+req.user);
    if(datos_config.authentication == 'Si' && req.user == null)
    {
      res.render('home');
    }
    else
    {
      res.redirect('/inicio_gitbook');
    }
});

app.get('/login',
  passport.authenticate('local', {failureRedirect: '/error'}),
  function(req,res) {
	res.render('login', {user: req.user[0]});
});

app.get('/change_password', function(req,res)
{
    res.render('changing_password',{user: req.user[0]});
});

app.get('/change_password_return', function(req,res)
{
  // console.log("PASSWORD:"+req.query.new_pass);
  // console.log("ROWWWWW BABY:"+JSON.stringify(req.user[0]));
  // ACTUALIZANDO
  funciones_db.change_password(db,req.user[0].username,req.query.new_pass,(err) =>
  {
    if(err)
    {
      console.log("ERROR:"+err);
      throw err;
    }
    res.render('login',{user: req.user[0]});
  });
});

app.get('/inicio_gitbook', function(req,res)
{
    res.sendFile(path.join(__dirname,'gh-pages','introduccion.html'));
});

app.get('/error', function(req, res)
{
    console.log("Info del usuario:"+req.user);
    res.render('error', { error: "Imposible el acceso. No se encuentra el usuario."});
});

app.get('/registro', function(req,res)
{
    res.render('registro.ejs');
});

app.get('/registro_return', function(req, res)
{
    funciones_db.create_user(db, req.query.username, req.query.password, req.query.displayName, function(err, usuario)
    {
      if(err)
      {
        console.log("Err:"+err);
        throw err;
      }
      console.log("Usuarioeaaa:"+usuario.username)
      res.render('login', {user: usuario});
    });
});

app.get('/borrar_cuenta', function(req, res)
{
  console.log("USUARIOEA:"+JSON.stringify(req.user[0]));
  funciones_db.borrar_cuenta(db, req.user[0].username, req.user[0].password, req.user[0].displayName, function(err)
  {
      if(err)
      {
        console.log(err);
        throw err;
      }
      res.redirect('/logout');
  });
});

app.get('/logout',function(req,res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
});


app.listen(process.env.PORT || 8080);

module.exports = app;
