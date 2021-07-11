// Test model (database of tests )
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDBS4",{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
const marksSchema = new mongoose.Schema({
    name : String,
    testId : String,
    marks_obtained : String,
    total_marks : String
});
const Mark = new mongoose.model("Marks",marksSchema);
module.exports = Mark;