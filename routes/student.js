  // /student route

const Student = require("../models/students");
const User = require('../models/all')
const passport = require('passport')
const {ensureAuth} = require('../config/auth');
const Teacher = require("../models/teachers");
const Test = require('../models/test');
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


router.get('/dashboard/join',ensureAuth,(req,res)=>{
    res.render('testId')
})

router.post('/dashboard/join',ensureAuth,(req,res)=>{
    const testId = req.body.testId
    Test.findOne({id : testId},(err,found)=>{
        if(found){
            res.render("join_test",{
                test : found
            })
        }
        
    })
})


router.get('/error/:err',(req,res)=>{
    console.log(req.params['err'])
    res.render("error_s",{
        err : req.params['err']
    })
})





router.post('/login_student',(req,res)=>{
    Student.findOne({email : req.body.username},function(err,found){
        if(found===null)
        {
            errors = []
          
          res.redirect("/student/error/Email dont exist");
          errors = []
        }
        else {
                  passport.authenticate("userLocal_1",{failureRedirect:'/student/unauth'})(req,res,function(){
                    errors=[]  
                    res.redirect("/student/dashboard");
                      errors = []
        
                  })
            
        }
    })
  
  
})



router.get('/unauth',(req,res)=>{
    errors=[];
    res.redirect('/student/error/Authentication failed')
})
router.post('/register_student',(req,res)=>{
 
    const student = new Student({email: req.body.username, username : req.body.username,name : req.body.name});
    Student.register(student,req.body.password,(err,user)=>{
if(err) res.redirect('/student/error/User already Exist');
else {
    passport.authenticate("userLocal_1",{failureRedirect:'/student/unauth'})(req,res,function(){
        errors=[]
        res.redirect("/student/dashboard");
       errors = []
    })

}
        })
    
    
   
})
module.exports = router