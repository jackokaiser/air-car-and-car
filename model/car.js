var mongoose = require('./db').mongoose;

var carSchema = new mongoose.Schema({
    name : String,
    location : String,
    dateFrom : Date,
    dateTo : Date
});

exports.CarModel = mongoose.model('Car', carSchema);
