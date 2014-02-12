// bring mongoose into the project
var mongoose = require( 'mongoose' );

///////////////
///////////////// Init the database
///////////////
var dbURI = process.env.DATABASE_URL;

// connect and init
// create the database connection
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

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
exports.CarModel = mongoose.model('Car', carSchema);
