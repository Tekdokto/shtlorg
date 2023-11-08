'use strict';

var passport = require('passport');
var TwitterTokenStrategy = require('passport-twitter-token');
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var AppleStrategy = require('passport-apple');
const constants = require('../../config/constants');

module.exports = function () {

    passport.use(new TwitterTokenStrategy({
        consumerKey: constants.TWITTER_CONSUMER_API_KEY,
        consumerSecret: constants.TWITTER_CONSUMER_API_SECRET_KEY,
        includeEmail: true
    },
        function (token, tokenSecret, profile, done) {
            console.log("twitter passport response :", profile);
            return done(null,profile);
        }));

    passport.use(new FacebookTokenStrategy({
        clientID: constants.FACEBOOK_CLIENT_ID,
        clientSecret: constants.FACEBOOK_CLIENT_SECRET,
        passReqToCallback: true
    },
        function (req,accessToken, refreshToken, profile, done) {
            console.log("here...");
            return done(null,profile);
        }));

    passport.use(new GoogleTokenStrategy({
        clientID: constants.GOOGLE_CLIENT_ID,
        clientSecret: constants.GOOGLE_CLIENT_SECRET,
        passReqToCallback: true
    },
        function (req, accessToken, refreshToken, profile, done) {
            console.log("google resopnse in passport : ", profile);
            return done(null,profile);
          
        }));

    passport.use(new AppleStrategy({
        clientID: constants.APPLE_CLIENT_ID,
        teamID: constants.APPLE_TEAM_ID,
        callbackURL: "",
        keyID: constants.APPLE_KEY_ID,
        privateKeyLocation:'../../Aple_AuthKey_SC3C6B8K7J.p8',
        passReqToCallback: true
    },
        function (req,accessToken, refreshToken, profile, done) {
            console.log("here...",profile);
            return done(null,profile);
        }));    
};