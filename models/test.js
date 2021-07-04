// Test model (database of tests )
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDBS4",{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
const testSchema = new mongoose.Schema({
    id : String,
    questions : Array,
    by : String,
    name : String,
    status : Boolean,
    total_marks : String
});
const Test = new mongoose.model("Tests",testSchema);
module.exports = Test;