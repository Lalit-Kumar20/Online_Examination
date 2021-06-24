// Student model (database of students )

const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require("mongoose-findorcreate");
mongoose.connect("mongodb://localhost:27017/userDBS4",{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
const newstudentSchema = new mongoose.Schema({
    
    username : String,
    email : String,
    name : String,
    password : String,
    googleId : String,
});
newstudentSchema.plugin(passportLocalMongoose);
newstudentSchema.plugin(findOrCreate);
const Student = new mongoose.model("students",newstudentSchema);
module.exports = Student;