 // /teacher route
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const Teacher = require("../models/teachers");
const User = require('../models/all')
const Test = require('../models/test')
const passport = require('passport')
const Answer = require('../models/answer')
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
        u : req.user.username
    })

    //

    
    //
})

router.get('/view',ensureAuth,(req,res)=>{
res.render('view_enter_id');
})
router.post('/view',ensureAuth,(req,res)=>{
    Answer.find({testId : req.body.id,done : true},(err,found)=>{
        if(found){
            res.render("view_student_answers",{
                ans : found
            })
        }
    })
})
router.get('/view/:id',ensureAuth,(req,res)=>{
    const id = req.params.id;
    Answer.findOne({_id : id},(err,found)=>{
        if(found){
            Test.findOne({id : found.testId},(err,f)=>{
                res.render("view_full_answer",{
                    ans : found.answers,
                    ques : f.questions
                })
            })
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
    status : false
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
           name : found.name
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
          
          res.redirect("/teacher/error/Email don't exist");
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
    
})
module.exports = router