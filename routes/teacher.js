require('dotenv').config()

// /teacher route
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const Teacher = require("../models/teachers");
const User = require('../models/all')
const Test = require('../models/test')
const passport = require('passport')
const Answer = require('../models/answer')
var nodemailer = require('nodemailer')
const Mark = require('../models/marks');
const {ensureAuth} = require('../config/auth')
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');
const Student = require('../models/students');
  
  
const router = require("express").Router()
var errors = []

// /teacher
router.get('/',(req,res)=>{
    res.render("teacher_login",{
        err : errors
    });
})

router.get('/error/:err',(req,res)=>{
    console.log(req.params['err'])
    res.render("error_t",{
        err : req.params['err']
    })
})


//*******************8 */
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
//************* */

// after login /teacher/dashboard
router.get('/dashboard',ensureAuth,(req,res)=>{
    res.render("dash_board_teacher",{
        u : req.user.name
    })

    //

    
    //
})


router.post('/forgot',(req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bjohny636@gmail.com',
          pass: process.env.PASS
        }
      });
      Teacher.findOne({username:req.body.username},(err,found)=>{
          if(found && found.googleId){
            var mailOptions = {
                from: 'bjohny636@gmail.com',
                to: req.body.username,
                subject: 'Reset Password',
                html: "<div marginheight='0' topmargin='0' marginwidth='0' style='margin: 0px; background-color: #f2f3f8;' leftmargin='0'> <table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8' style='@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;'> <tr> <td> <table style='background-color: #f2f3f8; max-width:670px; margin:0 auto;' width='100%' border='0' align='center' cellpadding='0' cellspacing='0'> <tr> <td style='height:80px;'>&nbsp;</td></tr><tr> <td style='text-align:center;'> <a href='' title='logo' target='_blank'>  </a> </td></tr><tr> <td style='height:20px;'>&nbsp;</td></tr><tr> <td> <table width='95%' border='0' align='center' cellpadding='0' cellspacing='0' style='max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'> <tr> <td style='height:40px;'>&nbsp;</td></tr><tr> <td style='padding:0 35px;'> <h1 style='color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;'>You have requested to reset your password</h1> <span style='display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;'></span> <p style='color:#455056; font-size:15px;line-height:24px; margin:0;'> You had logged in via google in the past. <br> Please login with Google! </p><a href='http://localhost:3000/teacher' style='background:#D4B435;text-decoration:none !important; font-weight:500; margin-top:35px; color:#000;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;'>Login</a> </td></tr><tr> <td style='height:40px;'>&nbsp;</td></tr></table> </td><tr> <td style='height:20px;'>&nbsp;</td></tr><tr> <td style='text-align:center;'> <p style='font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;'>&copy; </p></td></tr><tr> <td style='height:80px;'>&nbsp;</td></tr></table> </td></tr></table></div>"
    
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
                html: "<div marginheight='0' topmargin='0' marginwidth='0' style='margin: 0px; background-color: #f2f3f8;' leftmargin='0'> <table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8' style='@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;'> <tr> <td> <table style='background-color: #f2f3f8; max-width:670px; margin:0 auto;' width='100%' border='0' align='center' cellpadding='0' cellspacing='0'> <tr> <td style='height:80px;'>&nbsp;</td></tr><tr> <td style='text-align:center;'> <a href='' title='logo' target='_blank'>  </a> </td></tr><tr> <td style='height:20px;'>&nbsp;</td></tr><tr> <td> <table width='95%' border='0' align='center' cellpadding='0' cellspacing='0' style='max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'> <tr> <td style='height:40px;'>&nbsp;</td></tr><tr> <td style='padding:0 35px;'> <h1 style='color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;'>You have requested to reset your password</h1> <span style='display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;'></span> <p style='color:#455056; font-size:15px;line-height:24px; margin:0;'> Click the below link to change password <br>  </p><a href='http://localhost:3000/teacher/change/"+found._id+"' style='background:#D4B435;text-decoration:none !important; font-weight:500; margin-top:35px; color:#000;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;'>Login</a> </td></tr><tr> <td style='height:40px;'>&nbsp;</td></tr></table> </td><tr> <td style='height:20px;'>&nbsp;</td></tr><tr> <td style='text-align:center;'> <p style='font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;'>&copy; </p></td></tr><tr> <td style='height:80px;'>&nbsp;</td></tr></table> </td></tr></table></div>"
    
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
    res.render("teacher_change",{
        id : req.params.id
    })
})
router.post('/change/:id',(req,res)=>{
    Teacher.findOne({_id : req.params.id},(err,found)=>{
        found.setPassword(req.body.password, (err, user) => {
            user.save();
            res.render("successfully_changed")
          })
    })
})
router.get('/forgot',(req,res)=>{
    res.render("teacher_change_password")
})
router.get('/view',ensureAuth,(req,res)=>{
res.render('view_enter_id');
})
router.post('/view',ensureAuth,(req,res)=>{
    console.log("in rouute")
    Answer.find({testId : req.body.id,done : true},(err,found)=>{
        if(found){
            console.log("found")
            res.render("view_student_answers",{
                ans : found
            })
        }
        else {
            console.log("not found")
            res.render("wrong_id",{
                err : "Empty"
            })
        }
    })
})
router.get('/view/:id',ensureAuth,(req,res)=>{
    const id = req.params.id;
    Answer.findOne({_id : id},(err,found)=>{
        if(found){
            Test.findOne({id : found.testId},(err,f)=>{
                console.log(found)
                console.log(f)

                if(found.answers.length && f.questions.length){
                    res.render("view_full_answer",{
                        ans : found.answers,
                        ques : f.questions,
                        idd: req.params.id
                    })
                }
                
                else {
                    res.render("wrong_id",{
                        err : "Wrong Test Id"
                    })
                }
            })
        }
        else {
            res.render("wrong_id",{
                err : "Wrong Test Id"
            })
        }
    })
})

router.get('/view/delete/:idd',(req,res)=>{
    Answer.findOne({_id : req.params.idd},(err,found)=>{
        for(let i = 0;i<found.answers.length;++i){
            if(typeof found.answers[i].img!=='undefined'){
                for(let j = 0;j<found.answers[i].img.length;++j){
                    fs.unlinkSync("public/"+found.answers[i].img[j])
                }
            }
            
        }
    })
    Answer.deleteOne({_id : req.params.idd},(err)=>{
     if(err) console.log(err)
     else res.redirect('/teacher/view')
    })
})

router.post('/view/:idd',ensureAuth,(req,res)=>{


    Answer.updateOne({_id : req.params.idd},{marks : req.body.marks,checked : true},(err)=>{
        if(err){
            console.log(err)

        }
       else {
          Answer.findOne({_id : req.params.idd},(er,fo)=>{
              if(fo){
                  Mark.findOne({name : fo.name,testId:fo.testId},(e,f)=>{
                      if(f){
                         Mark.updateOne({name : fo.name,testId:fo.testId},{marks_obtained : req.body.marks},(error)=>{
                             if(error) console.log(error)
                             else {
                                 res.redirect('/teacher/view')
                             }
                         })
                      }
                      else {
                      const m = new Mark({
                          name : fo.name,
                          testId : fo.testId,
                          marks_obtained : req.body.marks,
                          total_marks  : fo.total_marks
                      })
                      m.save();
                      res.redirect('/teacher/view')
                      }
                  })
              }
          })
        //res.redirect('/teacher/view')
       } 
    })
})

router.get('/dashboard/test/stop/:id',ensureAuth,(req,res)=>{
    Test.updateOne({id : req.params['id']},{status : false},(err)=>{
        if(err) console.log(err)
        else {
            res.redirect('/teacher/dashboard/alltests')
        }
    })
})


router.get('/dashboard/test/start/:id',ensureAuth,(req,res)=>{
    console.log(req.params['id'])
    Test.updateOne({id : req.params['id']},{status : true},(err)=>{
        if(err) console.log(err)
        else {
            res.redirect('/teacher/dashboard/alltests')
        }
    })
})
// after creating test
router.post('/dashboard/createTest',ensureAuth,(req,res)=>{
    const id = uuidv1();
    console.log(req.body.testname)
const test = new Test({
    id : id,
    questions : [],
    by : req.user.username,
    name : req.body.testname,
    status : false,
    total_marks : req.body.total_price
})
test.save((err)=>{
    if(err) console.log(err)
    else res.redirect('/teacher/dashboard/test/'+id);
});
  
})
router.get('/dashboard/createTest',ensureAuth,(req,res)=>{
res.render("addname")

})

router.get('/dashboard/alltests',ensureAuth,(req,res)=>{
    Test.find({by : req.user.username},(err,found)=>{
       
        if(found){
            res.render("alltests",{
           test : found
       })
    }
    })
})

// test created now go to test section
router.get('/dashboard/test/:id',ensureAuth,(req,res)=>{
   Test.findOne({id : req.params['id']},function(err,found){
    if(found){
    res.render('test',{
           id : req.params['id'],
           qq : found.questions,
           name : found.name,
           total_marks : found.total_marks
       })
    }
   })
})
//implement add mcq method

router.get('/dashboard/test/:id/mcq',ensureAuth,(req,res)=>{
   const id = req.params.id
   res.render("addmcq",{
       id : id
   })
})
router.get('/dashboard/test/:id/sub',ensureAuth,(req,res)=>{
    const id = req.params.id
    res.render("sub",{
        id : id
    })
 })
 

// delete a mcq question
router.get('/dashboard/test/delete/:id/:i',ensureAuth,(req,res)=>{
    Test.findOne({id : req.params['id']},(err,found)=>{
        var ob = found.questions
                //file removed
        if(ob[req.params['i']].im==="yes"){
            for(let j = 0;j<ob[req.params['i']].img.length;++j)
            {
                fs.unlinkSync("public/"+ob[req.params['i']].img[j])
            }
           
        }    
              
        
        ob.splice(req.params['i'],1);
        Test.updateOne({id : req.params['id']},{questions : ob},(err)=>{
            if(err) console.log(err)
            else res.redirect('/teacher/dashboard/test/'+req.params['id']);
        })
    })
})
// delete a mcq question complete

// delete a test

router.get('/dashboard/test/delete/:id',(req,res)=>{
    const id = req.params['id'];
    Test.findOne({id : id},(err,found)=>{
        if(found)
        {
            console.log(found)

            for(let i = 0;i<found.questions.length;++i)
            {
               if(found.questions[i].im==="yes")
               {
                   for(let j = 0;j<found.questions[i].img.length;++j)
                   {
                    fs.unlinkSync("public/"+found.questions[i].img[j])
                   }
                
               }      
            }
        }
    })
    Test.deleteOne({id : id},(err)=>{
        if(err) console.log(err);
        else res.redirect('/teacher/dashboard');
    })
})

// delete test complete
// adding mcq question


// important add params in the end 
router.post('/dashboard/test/addmcq/:id',ensureAuth,upload,(req,res)=>{
    const id = req.params.id
    //without image
    if(req.files.length === 0)
   {
    var ob = {
        q : req.body.ques,
        a : req.body.qa,
        b : req.body.qb,
        c : req.body.qc,
        d : req.body.qd,
        im : "no",
        type : "mcq"
    }   
    
    Test.findOne({id : id},(err,found)=>{
      var tt = found.questions
      tt.push(ob)
      Test.updateOne({id : id},{questions : tt},(err)=>{
          if(err) console.log(err)
          else res.redirect('/teacher/dashboard/test/'+id);
      })
  })
}
// with image
 else {
    var arr = [];
    for(let i = 0;i<req.files.length;++i)
    {
     arr.push(req.files[i].filename)
    }
    var ob = {
        q : req.body.ques,  
        a : req.body.qa,
        b : req.body.qb,
        c : req.body.qc,
        d : req.body.qd,
        im : "yes",
        type : "mcq",
        img : arr
    }   
    
    Test.findOne({id : id},(err,found)=>{
      var tt = found.questions
      tt.push(ob)
      Test.updateOne({id : id},{questions : tt},(err)=>{
          if(err) console.log(err)
          else res.redirect('/teacher/dashboard/test/'+id);
      })
  }) 
 }
})
 // adding mcq question complete
 // add subjective question
 router.post('/dashboard/test/sub/:id',ensureAuth,upload,(req,res)=>{
    const id = req.params.id
    //without image
    if(req.files.length === 0)
   {
    var ob = {
        q : req.body.ques,
        im : "no",
        type : "sub"
    }   
    
    Test.findOne({id : id},(err,found)=>{
      var tt = found.questions
      tt.push(ob)
      Test.updateOne({id : id},{questions : tt},(err)=>{
          if(err) console.log(err)
          else res.redirect('/teacher/dashboard/test/'+id);
      })
  })
}
// with image
 else {
     var arr = [];
     for(let i = 0;i<req.files.length;++i)
     {
           arr.push(req.files[i].filename)
     }
    var ob = {
        q : req.body.ques,
        im : "yes",
        type : "sub",
        img : arr
    }   
    
    Test.findOne({id : id},(err,found)=>{
      var tt = found.questions
      tt.push(ob)
      Test.updateOne({id : id},{questions : tt},(err)=>{
          if(err) console.log(err)
          else res.redirect('/teacher/dashboard/test/'+id);
      })
  }) 
 }
})
 // add subjective question complete

//*********************************************** */

// login method
router.post('/login_teacher',(req,res)=>{
    

    //checking if user mail exist in teacher database or not
    Teacher.findOne({email : req.body.username},function(err,found){
        if(found===null)
        {

            errors = []
          
          res.redirect("/teacher/error/Email doesn't exist");
        }
        else {
                passport.authenticate("userLocal_2",{failureRedirect:'/teacher/unauth'})(req,res,function(){
                    errors=[]  
                    res.redirect("/teacher/dashboard");
                      
        
                  })
              
        }
    })
  
 
})

// if authentication failed
router.get('/unauth',(req,res)=>{
    errors=[];
    res.redirect('/teacher/error/Authentication failed')
})

// register a new teacher
router.post('/register_teacher',(req,res)=>{
    Student.findOne({username : req.body.username},(err,found)=>{
        if(found){
            res.redirect('/teacher/error/Account already exists')
        }
        else {
            const teacher = new Teacher({email: req.body.username, username : req.body.username,name : req.body.name});
            Teacher.register(teacher,req.body.password,(err,user)=>{
        if(err) res.redirect('/teacher/error/User already Exist');
        else {
            passport.authenticate("userLocal_2",{failureRedirect:'/teacher/unauth'})(req,res,function(){
                errors=[]
                res.redirect("/teacher/dashboard");
               errors = []
            })
        
        }
                })
        }
    })
   
    
})
module.exports = router