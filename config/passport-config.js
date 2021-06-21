// configuring passport js
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/all');
module.exports = function(passport)
{
    passport.use('userLocal', new LocalStrategy(User.authenticate()));
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });      
}