// server file

// require dependencies
const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require('passport')

const app = express()
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

require('./config/passport-config')(passport);

// using session
app.use(session({
    secret : "DontTellAnyOneThisIsASecret",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/",require("./routes/home"))
app.use("/student",require("./routes/student"))
app.use("/teacher",require("./routes/teacher"))
app.use('/logout',require("./routes/logout"))
app.get('/st/auth/google',
  passport.authenticate('google_1', { scope: ['profile','email']}));
app.get("/auth/google/secrets", 
  passport.authenticate('google_1', { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/student/dashboard");
  }); 

  app.get('/te/auth/google',
  passport.authenticate('google_2', { scope: ['profile','email']}));
app.get("/auth/google/secrets1", 
  passport.authenticate('google_2', { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/teacher/dashboard");
  }); 

app.get("*",(req,res)=>{
    res.status(400);
    res.render('error')
})
// listening on port 3000
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})