// home route
const router = require("express").Router()
router.get('/',(req,res)=>{
    res.render("home");
})
router.get('/error',(req,res)=>{
    res.render('needloginfirst')
})
module.exports = router