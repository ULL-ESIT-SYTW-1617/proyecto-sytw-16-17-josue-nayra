var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var path = require('path');
var basePath = process.cwd();

var config = require(path.join(basePath,'package.json'));

var expressLayouts = require('express-ejs-layouts');
var controlador_usuario = require('./controllers/user_controller.js');
var error;

//----------------------------------------------------------------------------------------------------
// Passport Google
passport.use(new GoogleStrategy({
    clientID: "<CLIENT_ID>",
    clientSecret: "<CLIENT_SECRET>",
    callbackURL: "http://localhost:8080/auth_google_callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("accessToken:"+accessToken);
    console.log("refreshToken:"+refreshToken);
    console.log("Profile:"+JSON.stringify(profile));
    return cb(null, profile);
  }
));

//----------------------------------------------------------------------------------------------------
// Passport-Twitter

passport.use(new TwitterStrategy({
  consumerKey: '<CONSUMER_KEY>',
  consumerSecret: '<CONSUMER_SECRET>',
  callbackURL: 'http://localhost:8080/auth_twitter_callback' //this will need to be dealt with
}, function(token, tokenSecret, profile, cb) {
      console.log("Token:"+token);
      console.log("tokenSecret:"+tokenSecret);
      console.log("Profile:"+JSON.stringify(profile));
      return cb(null,profile);
}));

//----------------------------------------------------------------------------------------------------
// Passport-Local

passport.use(new LocalStrategy(
  function(username, password, cb) {
    console.log("Estrategia de local");
    console.log("User:"+username);
    console.log("Password:"+password);

    controlador_usuario.findByUsername(username,password,(err,usuario) => {
      if(err){
        error = err;
        return cb(null,false);
      }
      console.log("User: "+JSON.stringify(usuario));
      return cb(null,usuario);
    });
  }
));

//----------------------------------------------------------------------------------------------------
// Passport-Facebook

passport.use(new FacebookStrategy({
    clientID: "<CLIENT_ID>",
    clientSecret: "<CLIENT_SECRET>",
    callbackURL: "http://localhost:8080/auth_facebook_callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("accessToken:"+accessToken);
    console.log("refreshToken:"+refreshToken);
    console.log("profile:"+JSON.stringify(profile));
    return cb(null,profile);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null,obj);
});


//----------------------------------------------------------------------------------------------------
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


//----------------------------------------------------------------------------------------------------
// Define routes.

app.get('/',
  function(req, res) {
    console.log("Usuario:"+req.user);
    if(config.Heroku.authentication == 'Si' && req.user == null)
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
    res.render('login', {user: req.user});
});


//----------------------------
// Ruta para el administrador

app.get('/vista_administracion', function(req,res)
{
    console.log("Vista de aministración");
    //Buscamos en la base de datos
    controlador_usuario.findAll((err, usuarios)=>
    {
      if(err)
      {
        console.log("ERRORRR:"+err);
        error = err;
        res.redirect('/error');
      }

      console.log("Usuarios pendientes:"+JSON.stringify(usuarios));

      res.render('administracion', { user: req.user, data: usuarios});
    });
});

app.get('/borrar_users/:id',function(req,res){
 console.log("Params:"+req.params.id);
 controlador_usuario.borrarById(req.params.id, (err)=>
 {
   if(err)
   {
     console.log("ERROR:"+err);
     error = err;
     res.redirect('/error');
   }
   res.redirect('/vista_administracion');
 });
});


//----------------------------

app.get('/change_password', function(req,res)
{
    res.render('changing_password',{user: req.user});
});


app.get('/change_password_return', function(req,res)
{
  // ACTUALIZANDO
  controlador_usuario.change_password(req.user.username,req.query.old_pass,req.query.new_pass,(err) =>
  {
    if(err)
    {
      console.log("ERROR:"+err);
      error = "No se ha cambiado el password: "+err;
      res.redirect('/error');
    }
    res.render('login',{user: req.user});
  });
});

//----------------------------

app.get('/inicio_gitbook', function(req,res)
{
    res.sendFile(path.join(__dirname,'gh-pages','introduccion.html'));
});

//----------------------------

app.get('/error', function(req, res)
{
    var respuesta = error || "No se ha podido realizar la operación";
    res.render('error', { error: respuesta});
});

//----------------------------

app.get('/registro', function(req,res)
{
    res.render('registro.ejs');
});


app.get('/registro_return', function(req, res)
{
  controlador_usuario.create_user(req.query.username, req.query.password, req.query.displayName, function(err)
  {
    if(err)
    {
      console.log("Err:"+err);
      error = "No se ha creado el usuario: "+err;
      res.redirect('/error');
    }
    res.render('home');
  });
});


//----------------------------

app.get('/borrar_cuenta', function(req, res)
{
  controlador_usuario.borrar_cuenta(req.user.username, req.user.password, req.user.displayName, function(err)
  {
      if(err)
      {
        console.log(err);
        error = "No se ha borrado la cuenta."+err;
        res.redirect('/error');
      }
      res.redirect('/logout');
  });
});
//----------------------------

app.get('/redirect_login', function(req,res)
{
  if(req.user != null)
    res.render('login',{user: req.user});
  else
    res.render('home');
});

//----------------------------
// Rutas para la autenticación con distintas plataformas.

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));


app.get('/auth_google_callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("Redireccion perfect");
    res.render('login', {user: req.user});
  });

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth_twitter_callback', passport.authenticate('twitter', { failureRedirect: '/error' }),
  function(req, res){
    res.render('login', {user: req.user});
});

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth_facebook_callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.render('login', {user: req.user});
});


//----------------------------
app.get('/logout',function(req,res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.listen(process.env.PORT || 8080);

module.exports = app;
