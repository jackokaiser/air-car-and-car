/**
 * Module dependencies
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var db = require('./models/db');
var mongoose = require('mongoose');
var routes = require('./routes');
var userRoutes = require('./routes/user');
var api = require('./routes/api');
var http = require('http');
var path = require('path');
var passport = require('passport');
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');
var expressValidator = require('express-validator');
var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressValidator());
app.use(express.cookieParser());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    db: mongoose.connection.db,
    auto_reconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
// +app.use(passport.initialize());
// +app.use(passport.session());
// // shortcut middleware
// +app.use(function(req, res, next) {
// +  res.locals.user = req.user;
// +  next();
// +});
app.use(app.router);

// app.use(express.bodyParser());
// app.use(function(req, res) {
//   res.status(404);
//   res.render('404');
// });


// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
    // TODO
}


/**
 * Routes
 */

// serve index and view partials
////// all other routes are handled client side with angular.js
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.post('/login', userRoutes.postLogin);
app.get('/logout', userRoutes.logout);
app.post('/signup', userRoutes.postSignup);

app.get('/account', passportConf.isAuthenticated, userRoutes.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userRoutes.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userRoutes.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userRoutes.postDeleteAccount);
// app.get('/account/unlink/:provider', passportConf.isAuthenticated, userRoutes.getOauthUnlink);

// Our RESTful JSON API
app.get('/api/name', api.name);
app.get('/api/cars', api.getCars);
app.post('/api/cars', api.postCars);

/**
 * OAuth routes for sign-in.
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
