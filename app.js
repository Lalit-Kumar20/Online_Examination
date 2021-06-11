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

app.use(session({
    secret : "DontTellAnyOneThisIsASecret",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/",require("./routes/home"))
app.use("/student",require("./routes/student"))
app.use("/teacher",require("./routes/teacher"))
app.use('/logout',require("./routes/logout"))
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})
//new 