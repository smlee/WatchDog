'use strict';

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    var twitterConfig = app.getValue('env').TWITTER;

    var twitterCredentials = {
        consumerKey: twitterConfig.consumerKey,
        consumerSecret: twitterConfig.consumerSecret,
        callbackUrl: twitterConfig.callbackUrl
    };

    var createNewUser = function (token, tokenSecret, profile) {
        console.log("============NAME==============",profile._json.name);
        var nameArr = profile._json.name.split();
        var first_name = nameArr[0];
        var last_name = nameArr[1] || "";
        return UserModel.create({
            first_name: first_name,
            last_name: last_name,
            twitter: {
                id: profile.id,
                username: profile.username,
                token: token,
                tokenSecret: tokenSecret
            }
        });
    };

    var updateUserCredentials = function (user, token, tokenSecret, profile) {

        user.twitter.token = token;
        user.twitter.tokenSecret = tokenSecret;
        user.twitter.username = profile.username;

        return user.save();

    };

    var verifyCallback = function (token, tokenSecret, profile, done) {

        UserModel.findOne({'twitter.id': profile.id}).exec()
            .then(function (user) {
                if (user) { // If a user with this twitter id already exists.
                    return updateUserCredentials(user, token, tokenSecret, profile);
                } else { // If this twitter id has never been seen before and no user is attached.
                    return createNewUser(token, tokenSecret, profile);
                }
            }).then(function (user) {
                done(null, user);
            }, function (err) {
                console.error('Error creating user from Twitter authentication', err);
                done(err);
            });

    };

    passport.use(new TwitterStrategy(twitterCredentials, verifyCallback));

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/');
        });

};
