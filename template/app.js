var express = require('express');
var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var github = require('octonode');
var path = require('path');
var basePath = process.cwd();
var config = require(path.join(basePath,'.secret.json'));
var datos_config = JSON.parse(JSON.stringify(config));
var logout = require('express-passport-logout');

passport.use(new Strategy({
    clientID: datos_config.clientID,
    clientSecret: datos_config.clientSecret,
    callbackURL: 'http://localhost:8080/login/github/return'
  },
  function(accessToken, refreshToken, profile, cb) {

      var token = datos_config.token;
      var client = github.client(token);

      var ghorg = client.org('ULL-ESIT-SYTW-1617');

      ghorg.member(profile.username, (err,result) =>
      {
          if(err) console.log(err);
          console.log("Result:"+result);
          if(result == true)
            return cb(null, profile);
          else {
            return cb(null,null);
          }
      });
    // return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
// app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname,'gh-pages/')));
app.set("views", __dirname+'/views');

app.set('view engine', 'ejs');

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
    // console.log("Usuario:"+req.user);
    if(datos_config.authentication == 'Yes')
    {
      res.render('home', {user: req.user});
    }
    else
    {
      res.redirect('/inicio_gitbook');
    }
});

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/github',
  passport.authenticate('github'));

app.get('/login/github/return',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/inicio_gitbook');
  });

app.get('/inicio_gitbook', function(req,res)
{
    res.sendFile(path.join(__dirname,'gh-pages','introduccion.html'));
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

