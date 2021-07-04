// Test model (database of tests )
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDBS4",{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
const answerSchema = new mongoose.Schema({
   name: String,
   testId : String,
   answers : Array,
   done : Boolean,
   checked : Boolean,
   marks : String
});
const Answer = new mongoose.model("Answer",answerSchema);
module.exports = Answer;