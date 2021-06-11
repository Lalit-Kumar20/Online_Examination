const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require("mongoose-findorcreate");
mongoose.connect("mongodb://localhost:27017/userDBS3",{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
const teacherSchema = new mongoose.Schema({
    email : String,
    password : String
});
teacherSchema.plugin(passportLocalMongoose);
teacherSchema.plugin(findOrCreate);
const Teacher = new mongoose.model("Teachers",teacherSchema);
module.exports = Teacher;