// configuring passport js
require('dotenv').config();
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy
const  GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/all');
const Student = require('../models/students');
const Teacher = require('../models/teachers');
module.exports = function(passport)
{
    passport.use('userLocal_1', new LocalStrategy(Student.authenticate()));
    passport.use('userLocal_2', new LocalStrategy(Teacher.authenticate()));
    

    passport.serializeUser(function(user, done) {
        done(null, user._id);
      });
      
      passport.deserializeUser(function(id, done) {
        Student.findOne({_id : id},(err,found)=>{
          if(found) return done(err,found);
          else {
            Teacher.findOne({_id : id},(e,f)=>{
              if(f) return done(e,f);
              else return done(e,null)
            })
          }
        })
      });   
      
      
      passport.use('google_1',new GoogleStrategy({
        clientID: process.env.CLIENT_ID1,
        clientSecret: process.env.CLIENT_SECRET1,
        callbackURL: "http://localhost:3000/auth/google/secrets",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
      },
      function(accessToken, refreshToken, profile,cb) {
        Student.findOne({username:profile.emails[0].value},(er,fd)=>{
          if(fd && typeof fd.googleId==='undefined'){
             return cb(er,null)
          }
          else {
            Student.findOrCreate({username:profile.emails[0].value,name : profile.displayName,googleId: profile.id,email : profile.emails[0].value }, function (err, user) {
              return cb(err, user);
            });
          }
        })
          
          
        
      }
    ));
    passport.use('google_2',new GoogleStrategy({
      clientID: process.env.CLIENT_ID2,
      clientSecret: process.env.CLIENT_SECRET2,
      callbackURL: "http://localhost:3000/auth/google/secrets1",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile,cb) {
         
      Teacher.findOne({username:profile.emails[0].value},(er,fd)=>{
        if(fd && typeof fd.googleId==='undefined'){
            return cb(er,null)
        }
        else {
          Teacher.findOrCreate({username:profile.emails[0].value,name : profile.displayName,googleId: profile.id,email : profile.emails[0].value }, function (err, user) {
            return cb(err, user);
          });
      
        }
      })
      
    }
  ));
}