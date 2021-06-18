 // /teacher route
 const path = require('path')
 const multer = require('multer')
const Teacher = require("../models/teachers");
const User = require('../models/all')
const Test = require('../models/test')
const passport = require('passport')
const {ensureAuth} = require('../config/auth')
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');
  
  
const router = require("express").Router()
var errors = []

// /teacher
router.get('/',(req,res)=>{
    res.render("teacher_login",{
        err : errors
    });
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
}).single('file');
//************* */

// after login /teacher/dashboard
router.get('/dashboard',ensureAuth,(req,res)=>{
    res.render("dash_board_teacher",{
        u : req.user.username
    })

    //

    
    //
})


// after creating test
router.get('/dashboard/createTest',ensureAuth,(req,res)=>{
const id = uuidv1();
const test = new Test({
    id : id,
    questions : []
})
test.save((err)=>{
    if(err) console.log(err)
    else res.redirect('/teacher/dashboard/test/'+id);
});
  

})

// test created now go to test section
router.get('/dashboard/test/:id',ensureAuth,(req,res)=>{
    const id = req.params.id
   Test.findOne({id : id},function(err,found){
       res.render('test',{
           id : id,
           qq : found.questions
       })
   })
})
//implement add mcq method

router.get('/dashboard/test/:id/mcq',ensureAuth,(req,res)=>{
   const id = req.params.id
   res.render("addmcq",{
       id : id
   })
})

// delete a mcq question
router.get('/dashboard/test/delete/:id/:i',(req,res)=>{
    Test.findOne({id : req.params['id']},(err,found)=>{
        var ob = found.questions
        ob.splice(req.params['i'],1);
        Test.updateOne({id : req.params['id']},{questions : ob},(err)=>{
            if(err) console.log(err)
            else res.redirect('/teacher/dashboard/test/'+req.params['id']);
        })
    })
})
// delete a mcq question complete


// adding mcq question

// important add params in the end 
router.post('/dashboard/test/addmcq/:id',ensureAuth,upload,(req,res)=>{
    const id = req.params.id
    //without image
    if(typeof req.file === "undefined")
   {
    var ob = {
        q : req.body.ques,
        a : req.body.qa,
        b : req.body.qb,
        c : req.body.qc,
        d : req.body.qd,
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
    var ob = {
        q : req.body.ques,
        a : req.body.qa,
        b : req.body.qb,
        c : req.body.qc,
        d : req.body.qd,
        type : "mcq",
        img : req.file.filename
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
 

//*********************************************** */

// login method
router.post('/login_teacher',(req,res)=>{
    const user = new User({
        email : req.body.username,
        password : req.body.password
    });

    //checking if user mail exist in teacher database or not
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

// if authentication failed
router.get('/unauth',(req,res)=>{
    errors=[];
    errors.push("Authentication failed");
    res.redirect('/teacher')
})

// register a new teacher
router.post('/register_teacher',(req,res)=>{
    const teacher = new Teacher({
        email : req.body.username,
        username : req.body.username,
        password : req.body.password
    })
    teacher.save((err)=>{
        if(err){
            console.log(err)
            errors = []
            errors.push("User already exist")
            res.redirect("/teacher");
           
        }
        else {
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
        }

    })
    
})
module.exports = router