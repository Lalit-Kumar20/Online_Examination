// User model (database of (teachers + students) )

const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require("mongoose-findorcreate");
mongoose.connect("mongodb://localhost:27017/userDBS4",{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
const userSchema = new mongoose.Schema({
    email : String,
    name : String,
    googleId : String,
    password : String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("Users",userSchema);
module.exports = User;