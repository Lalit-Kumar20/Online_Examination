const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require("mongoose-findorcreate");
mongoose.connect("mongodb://localhost:27017/userDBS3",{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
const newstudentSchema = new mongoose.Schema({
    email : String,
    roll_no : String,
    password : String
});
newstudentSchema.plugin(passportLocalMongoose);
newstudentSchema.plugin(findOrCreate);
const Student = new mongoose.model("Students",newstudentSchema);
module.exports = Student;