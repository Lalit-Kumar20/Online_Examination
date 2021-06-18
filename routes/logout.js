// logout route
const router = require('express').Router()
const passport = require('passport')
router.get('/',(req,res)=>{
req.logOut();
res.redirect('/')
})
module.exports = router;