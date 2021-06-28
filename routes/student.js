  // /student route
  const path = require('path')
  const fs = require('fs')
  const multer = require('multer')
const Student = require("../models/students");
const User = require('../models/all')
const passport = require('passport')
const {ensureAuth} = require('../config/auth');
const Teacher = require("../models/teachers");
const Test = require('../models/test');
const Answer = require('../models/answer');
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
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public");
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
var upload = multer({
    storage : storage
}).array('files',12);

router.get('/dashboard/join/:id/:i',ensureAuth,(req,res)=>{
    Test.findOne({id : req.params['id']},(err,found)=>{
        if(found){
            var q = found.questions[req.params['i']]
            res.render("answer_question",{
                id : req.params['id'],
                q : q,
                num : req.params['i']
            })
        }
    })
})
router.post('/dashboard/answer/:id/:i',ensureAuth,upload,(req,res)=>{
    
    var arr = [];
    for(let i = 0;i<req.files.length;++i){
        arr.push(req.files[i].filename);
    }
    const user = req.user.username;
    Answer.findOne({testId : req.params['id'],name : user},(err,found)=>{
      //  console.log(found)
        var ans = found.answers
        ans[req.params['i']] = {
            answer : req.body.answer,
            img : arr
        }
        Answer.updateOne({testId : req.params['id'],name : user},{answers : ans},(err)=>{
            if(err) console.log(err)
            else res.redirect('/student/dashboard/join/'+req.params['id']);
        })
    })
})
router.get('/dashboard/join/reset/:id/:i',ensureAuth,(req,res)=>{
const user = req.user.username;
Answer.findOne({testId : req.params['id'],name : user},(err,found)=>{
      var ans = found.answers
      ans[req.params['i']] = {}
      Answer.updateOne({testId : req.params['id'],name : user},{answers : ans},(err)=>{
          if(err) console.log(err)
          else res.redirect('/student/dashboard/join/'+req.params['id']);
      })
  })


})
router.get('/dashboard/join/:id',ensureAuth,(req,res)=>{
    const testId = req.params['id']
    Test.findOne({id : testId},(err,found)=>{
        if(found){
            Answer.findOne({testId : testId,name : req.user.username},(err,fund)=>{
                
                if(!fund){
                    const user = req.user.username
                    var arr = []
                    for(let i = 0;i<found.questions.length;++i) arr.push({});
                    const answer = new Answer({
                        name : req.user.username,
                        testId : testId,
                        answers : arr
                    })
                    answer.save((err)=>{
                        if(err) console.log(err)
                        else {
                            
                    res.render("join_test",{
                        ans : answer,
                        test : found
                    })
                        }
                    })
                }
                else {
                    res.render("join_test",{
                        ans : fund,
                        test : found
                    })

                }
            })
            
        }
        else {

            res.redirect('/student/dashboard')
        }
        
    })

})
router.post('/dashboard/join',ensureAuth,(req,res)=>{
    const testId = req.body.testId
    res.redirect('/student/dashboard/join/'+testId)
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