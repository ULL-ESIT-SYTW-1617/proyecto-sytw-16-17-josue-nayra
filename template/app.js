var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var path = require('path');
var basePath = process.cwd();
var config = require(path.join(basePath,'.secret.json'));
var datos_config = JSON.parse(JSON.stringify(config));
var logout = require('express-passport-logout');
var expressLayouts = require('express-ejs-layouts');

var dropbox = require('node-dropbox');
var api = dropbox.api(datos_config.token_dropbox);
var users;

// var user = require(path.join(basePath,'bd','users.js')); //En fase de pruebas

passport.use(new LocalStrategy(
  function(username, password, cb) {
        
        api.getFile(datos_config.path_bd, (err,response,body) => {
          if(err){
            console.log(err);
            throw err;
          }
          
          console.log("Body: "+JSON.parse(JSON.stringify(body)));
          var datos = JSON.parse(JSON.stringify(body));
          users = datos.users;
          console.log(datos.users);
          
          var queries_bd = require(path.join(basePath,'public','js','queries.js'));
          
          queries_bd.findByUsername(datos.users,username, function(err, usuario)
          {
              if(err) return cb(err);
              // console.log("ENTREEE");
              if(!usuario){
                console.log("El usuario no se encuentra en la base de datos");
                return cb(null,false);
              }

              if(usuario.password != password)
              {
                console.log("Password incorrecto");
                return cb(null,false);
              }

              console.log("Usuario encontrado:"+JSON.stringify(usuario));
              return cb(null,usuario);
          });
          
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
// app.use(express.static(path.join(__dirname,'public/')));
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
    if(req.user == null)
    {
      res.render('home', {user: req.user});
    }
    else
    {
      res.redirect('/inicio_gitbook');
    }
});

app.get('/login',
  passport.authenticate('local', {failureRedirect: '/error'}),
  function(req,res) {
    res.redirect('/inicio_gitbook');
  });


app.get('/inicio_gitbook', function(req,res)
{
  if(req.user){
    res.sendFile(path.join(__dirname,'gh-pages','introduccion.html'));
  }
  else{
    res.redirect('/');  
  }
});

app.get('/error', function(req, res)
{
    console.log("Info del usuario:"+req.user);
    res.render('error', { error: "Su usuario no pertenece a la organizacion"});
});

app.get('/logout',function(req,res){
  logout();
  res.redirect('/');
});


app.listen(process.env.PORT || 8080);

module.exports = app;
