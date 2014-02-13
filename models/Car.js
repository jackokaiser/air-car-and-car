var mongoose = require('mongoose');

///////////////
///////////////// Create Schema
///////////////
var carSchema = new mongoose.Schema({
    name : {type : String, required : true},
    price : {type : Number, required : true},
    location : {type : String, required : true},
    dateFrom : {type : Date, required : true},
    dateTo : {type : Date, required : true}
});

// exports models
module.exports = mongoose.model('Car', carSchema);
