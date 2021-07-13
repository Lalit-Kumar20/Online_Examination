  // /student route



  ///to do
  /*
  change password
  styling
  responsive
  
  */
require('dotenv').config()
var nodemailer = require('nodemailer')

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
const Mark = require('../models/marks')
const router = require("express").Router()
var errors = []
router.get('/',(req,res)=>{
    res.render("student_login",{
        err : errors
    });
})
router.get('/dashboard',ensureAuth,(req,res)=>{
    res.render("dash_board_student",{
        u : req.user.name
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
      for(let j = 0;j<ans[req.params['i']].img.length;++j){
        fs.unlinkSync("public/"+ans[req.params['i']].img[j])
      }
      ans[req.params['i']] = {}
      Answer.updateOne({testId : req.params['id'],name : user},{answers : ans},(err)=>{
          if(err) console.log(err)
          else res.redirect('/student/dashboard/join/'+req.params['id']);
      })
  })


})
router.get('/marks/:id',(req,res)=>{
    Mark.deleteOne({_id : req.params.id},(err)=>{
        if(err) console.log(err)
        else res.redirect('/student/dashboard/marks')
    })
})

router.get('/forgot',(req,res)=>{
    res.render("student_change_password")
})


router.post('/forgot',(req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bjohny636@gmail.com',
          pass: process.env.PASS
        }
      });
      Student.findOne({username:req.body.username},(err,found)=>{
          if(found && found.googleId){
            var mailOptions = {
                from: 'bjohny636@gmail.com',
                to: req.body.username,
                subject: 'Reset Password',
                html: "<div marginheight='0' topmargin='0' marginwidth='0' style='margin: 0px; background-color: #f2f3f8;' leftmargin='0'> <table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8' style='@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;'> <tr> <td> <table style='background-color: #f2f3f8; max-width:670px; margin:0 auto;' width='100%' border='0' align='center' cellpadding='0' cellspacing='0'> <tr> <td style='height:80px;'>&nbsp;</td></tr><tr> <td style='text-align:center;'> <a href='' title='logo' target='_blank'>  </a> </td></tr><tr> <td style='height:20px;'>&nbsp;</td></tr><tr> <td> <table width='95%' border='0' align='center' cellpadding='0' cellspacing='0' style='max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'> <tr> <td style='height:40px;'>&nbsp;</td></tr><tr> <td style='padding:0 35px;'> <h1 style='color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;'>You have requested to reset your password</h1> <span style='display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;'></span> <p style='color:#455056; font-size:15px;line-height:24px; margin:0;'> You had logged in via google in the past. <br> Please login with Google! </p><a href='http://localhost:3000/student' style='background:#D4B435;text-decoration:none !important; font-weight:500; margin-top:35px; color:#000;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;'>Login</a> </td></tr><tr> <td style='height:40px;'>&nbsp;</td></tr></table> </td><tr> <td style='height:20px;'>&nbsp;</td></tr><tr> <td style='text-align:center;'> <p style='font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;'>&copy; </p></td></tr><tr> <td style='height:80px;'>&nbsp;</td></tr></table> </td></tr></table></div>"
    
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  res.redirect('/')
                }
            })     
          }
          else {
            var mailOptions = {
                from: 'bjohny636@gmail.com',
                to: req.body.username,
                subject: 'Reset Password',
                html: "<div marginheight='0' topmargin='0' marginwidth='0' style='margin: 0px; background-color: #f2f3f8;' leftmargin='0'> <table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8' style='@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;'> <tr> <td> <table style='background-color: #f2f3f8; max-width:670px; margin:0 auto;' width='100%' border='0' align='center' cellpadding='0' cellspacing='0'> <tr> <td style='height:80px;'>&nbsp;</td></tr><tr> <td style='text-align:center;'> <a href='' title='logo' target='_blank'>  </a> </td></tr><tr> <td style='height:20px;'>&nbsp;</td></tr><tr> <td> <table width='95%' border='0' align='center' cellpadding='0' cellspacing='0' style='max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'> <tr> <td style='height:40px;'>&nbsp;</td></tr><tr> <td style='padding:0 35px;'> <h1 style='color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;'>You have requested to reset your password</h1> <span style='display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;'></span> <p style='color:#455056; font-size:15px;line-height:24px; margin:0;'> Click the below link to change password <br>  </p><a href='http://localhost:3000/student/change/"+found._id+"' style='background:#D4B435;text-decoration:none !important; font-weight:500; margin-top:35px; color:#000;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;'>Login</a> </td></tr><tr> <td style='height:40px;'>&nbsp;</td></tr></table> </td><tr> <td style='height:20px;'>&nbsp;</td></tr><tr> <td style='text-align:center;'> <p style='font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;'>&copy; </p></td></tr><tr> <td style='height:80px;'>&nbsp;</td></tr></table> </td></tr></table></div>"
    
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  res.redirect('/')
                }
            })  
          }
      })
      
})

router.get('/change/:id',(req,res)=>{
    res.render("student_change",{
        id : req.params.id
    })
})
router.post('/change/:id',(req,res)=>{
    console.log(req.params.id)
    Student.findOne({_id : req.params.id},(err,found)=>{
        found.setPassword(req.body.password, (err, user) => {
            user.save();
            res.render("successfully_changed")
          })
    })
})
router.get('/dashboard/marks',ensureAuth,(req,res)=>{
    
    Mark.find({name : req.user.username},(err,found)=>{
        res.render('view_marks',{
            ans : found
        })
    })
    
    // Answer.find({name : req.user.username,checked:true},(err,found)=>{
    //     if(found){
    //         res.render('view_marks',{
    //             ans : found
    //         })
    //     }
    // })
})

router.get('/dashboard/join/:id',ensureAuth,(req,res)=>{
    const testId = req.params['id']
    Test.findOne({id : testId},(err,found)=>{
        if(found && found.status){
            Answer.findOne({testId : testId,name : req.user.username},(err,fund)=>{
                
                if(!fund){
                    const user = req.user.username
                    var arr = []
                    for(let i = 0;i<found.questions.length;++i) arr.push({});
                    const answer = new Answer({
                        name : req.user.username,
                        testId : testId,
                        answers : arr,
                        done : false,
                        checked : false,
                        marks : 0,
                        total_marks : found.total_marks

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
                    if(fund.done){
                      res.render("alreadysubmitted",{
                          err : "You already submitted"
                      })     
                   
                    }
                   else {
                    res.render("join_test",{
                        ans : fund,
                        test : found
                    })
                   } 

                }
            })
            
        }
        else if(found){
            res.render("alreadysubmitted",{
                err : "Test is Over"
            })
        }
        else {

            res.render("alreadysubmitted",{
                err : "Wrong test id"
            })   
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



router.get('/submit/:id',ensureAuth,(req,res)=>{    
Answer.updateOne({testId : req.params.id,name : req.user.username},{done : true},(err)=>{
    if(err) {
        res.render("alreadysubmitted",{
            err : "Cannot submit test"
        })     
    }
    else {
        res.redirect('/student/dashboard')
    }
})
})

router.post('/login_student',(req,res)=>{
    Student.findOne({email : req.body.username},function(err,found){
        if(found===null)
        {
            errors = []
          
          res.redirect("/student/error/Email doesn't exist");
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

    Teacher.findOne({username : req.body.username},(err,found)=>{
        if(found){
           res.redirect('/student/error/Account already exists');
        }
        else {
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
            
        }
    })
 
   
    
   
})
module.exports = router