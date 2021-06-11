const Teacher = require("../models/teachers");
const User = require('../models/all')
const passport = require('passport')
const {ensureAuth} = require('../config/auth')
const router = require("express").Router()
var errors = []
router.get('/',(req,res)=>{
    res.render("teacher_login",{
        err : errors
    });
})
router.get('/dashboard',ensureAuth,(req,res)=>{
    res.render("dash_board_teacher",{
        u : req.user.username
    })
})
router.post('/login_teacher',(req,res)=>{
    const user = new User({
        email : req.body.username,
        password : req.body.password
    });
    Teacher.findOne({email : req.body.username},function(err,found){
        if(found===null)
        {

            errors = []
            errors.push("Email don't exist")
          
          res.redirect("/teacher");
        }
        else {
            req.login(user,function(err){
                if(err)
                {
                    errors = []
                    errors.push("Can't log in")
                  console.log(err);
                  res.redirect("/teacher");
                }
                else {
                  passport.authenticate("userLocal",{failureRedirect:'/teacher/unauth'})(req,res,function(){
                    errors=[]  
                    res.redirect("/teacher/dashboard");
                      
        
                  })
                }
            })
        }
    })
  
 
})
router.get('/unauth',(req,res)=>{
    errors=[];
    errors.push("Authentication failed");
    res.redirect('/teacher')
})
router.post('/register_teacher',(req,res)=>{
    const teacher = new Teacher({
        email : req.body.username,
        password : req.body.password
    })
    teacher.save((err)=>{
        if(err){
            errors = []
            errors.push("User already exist")
            res.redirect("/teacher");
            console.log(err);
        }
    })
    User.register({username : req.body.username},req.body.password,function(err){
        if(err)
        {
            errors = []
            errors.push("Email already exist")
            res.redirect("/teacher");
        }
        else {
            passport.authenticate("userLocal",{failureRedirect:'/teacher/unauth'})(req,res,function(){
                errors=[]
                res.redirect("/teacher/dashboard");
               
            })
        }
        });
})
module.exports = router