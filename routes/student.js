const Student = require("../models/students");
const User = require('../models/all')
const passport = require('passport')
const {ensureAuth} = require('../config/auth')
const router = require("express").Router()
var errors = []
router.get('/',(req,res)=>{
    res.render("student_login",{
        err : errors
    });
})
router.get('/dashboard',ensureAuth,(req,res)=>{
    res.render("dash_board_student",{
        u : req.user.username
    })

})
router.post('/login_student',(req,res)=>{
    const user = new User({
        email : req.body.username,
        password : req.body.password
    });

    Student.findOne({email : req.body.username},function(err,found){
        if(found===null)
        {
            errors = []
            errors.push("Email don't exist")
          
          res.redirect("/student");
        }
        else {
            req.login(user,function(err){
                if(err)
                {
                    errors = []
                    errors.push("Can't log in")
                  console.log(err);
                  res.redirect("/student");
                }
                else {
                  passport.authenticate("userLocal",{failureRedirect:'/student/unauth'})(req,res,function(){
                    errors=[]  
                    res.redirect("/student/dashboard");
                      
        
                  })
                }
            })
        }
    })
  
  
})
router.get('/unauth',(req,res)=>{
    errors=[];
    errors.push("Authentication failed");
    res.redirect('/student')
})
router.post('/register_student',(req,res)=>{
 
    const student = new Student({
        email : req.body.username,
        roll_no : req.body.roll_no,
        password : req.body.password
    })
    student.save((err)=>{
        if(err){
            errors = []
            errors.push("User already exist")
            res.redirect("/student");
            console.log(err);
        }
    })
    User.register({username : req.body.username},req.body.password,function(err){
        if(err)
        {
            errors = []
            errors.push("Email already exist")
            res.redirect("/student");
        }
        else {
            passport.authenticate("userLocal",{failureRedirect:'/student/unauth'})(req,res,function(){
                errors=[]
                res.redirect("/student/dashboard");
               
            })
        }
        });
})
module.exports = router