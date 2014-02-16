var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/User');


/**
 * POST /login
 * Sign in using email and password.
 * @param {string} email
 * @param {string} password
 */

exports.postLogin = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        console.log('errors', errors);
        res.send(400);
        return;
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);

        if (!user) {
            console.log('errors', { msg: info.message });
            res.send(400);
            return;
        }

        req.logIn(user, function(err) {
            if (err) return next(err);
            res.send(200);
            return;
        });
    })(req, res, next);
};

/**
 * POST /signup
 * Create a new local account.
 * @param {string} email
 * @param {string} password
 */

exports.postSignup = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        console.log('errors', errors);
        res.send(422);
        return;
    }

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err) {
        if (err) {
            if (err.code === 11000) {
                console.log('errors', { msg: 'User with that email'+
                                        ' already exists.' });
                res.send(409);
            }
            res.send(422);
            // return res.redirect('/signup');
            return;
        }
        // win
        console.log('no error while we creating '+user);
        // try to log the guy in
        // that should maybe be done client side
        req.logIn(user, function(err) {
            if (err) return next(err);
            res.send(200);
            // res.redirect('/');
            return;
        });
    });
};

// route to test if the user is logged in or not
exports.getLoggedin = function(req, res) {
    console.log("User "+req.user+" is auth: "+req.isAuthenticated());
    res.send(req.isAuthenticated() ? req.user : '0');
};

/**
 * GET /account
 * Profile page.
 */

exports.getAccount = function(req, res) {
    res.render('account/profile', {
        title: 'Account Management'
    });
};

/**
 * POST /account/profile
 * Update profile information.
 */

exports.postUpdateProfile = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.gender = req.body.gender || '';
        user.profile.location = req.body.location || '';
        user.profile.website = req.body.website || '';

        user.save(function(err) {
            if (err) return next(err);
            console.log('success', { msg: 'Profile information updated.' });
            res.redirect('/account');
        });
    });
};

/**
 * POST /account/password
 * Update current password.
 * @param {string} password
 */

exports.postUpdatePassword = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        console.log('errors', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);

        user.password = req.body.password;

        user.save(function(err) {
            if (err) return next(err);
            console.log('success', { msg: 'Password has been changed.' });
            res.redirect('/account');
        });
    });
};

/**
 * POST /account/delete
 * Delete user account.
 * @param {string} id
 */

exports.postDeleteAccount = function(req, res, next) {
    User.remove({ _id: req.user.id }, function(err) {
        if (err) return next(err);
        req.logout();
        res.send(200);
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth2 provider from the current user.
 * @param {string} provider
 * @param {string} id
 */

exports.getOauthUnlink = function(req, res, next) {
    var provider = req.params.provider;
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);

        user[provider] = undefined;
        user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });

        user.save(function(err) {
            if (err) return next(err);
            console.log('info', { msg: provider + ' account has been unlinked.' });
            res.redirect('/account');
        });
    });
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
    console.log("login out user "+req.user);
    // boom
    req.session.destroy(function (err) {
        if (err) {
            console.log('Error while destroying session: '+err);
        }
        // req.session.save();
        req.logout();
        console.log('User destroyed properly.');
        res.send(200);
    });
};
