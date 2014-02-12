var db = require('../model/db');
var CarModel = db.CarModel;
var UserModel = db.UserModel;

/*
 * Serve JSON to our AngularJS client
 */
exports.name = function (req, res) {
    res.json({
        name: 'Bob'
    });
};

exports.cars = {};

exports.cars.get = function (req, res) {
    console.log('request for available car received');
    // query db to get car available
    // at the right place and on the right time

    var query = req.query;
    console.log(query);
    var dbQuery;
    if (query.location) {
        // user specified location
        dbQuery = CarModel.find({location: query.location.toUpperCase()});
    }
    else {
        // no location: let's find everything
        dbQuery = CarModel.find({});
    }

    if(query.dateFrom) {
        dbQuery.where('dateFrom')
            .lte(new Date(parseInt(query.dateFrom,10)));
    }
    if(query.dateTo) {
        dbQuery.where('dateTo')
            .gte(new Date(parseInt(query.dateTo,10)));
    }

    dbQuery.exec(function( err, docs) {
        if (err) {
            console.log('Error fetching data: '+err);
            return;
        }
        res.json( {
            cars : docs
        });
        console.log('available car sent: '+docs.length);
    });

};

exports.cars.post = function (req, res) {
    console.log('received request to register car: '+
                req.param('name')+' '+req.param('location')+
                ' '+req.param('dateFrom')+' '+req.param('dateTo'));
    CarModel.create({
        name : req.param('name').toUpperCase(),
        location : req.param('location').toUpperCase(),
        dateFrom : req.param('dateFrom'),
        dateTo : req.param('dateTo'),
        price : req.param('price')
    },function(err,car) {
        if (err) {
            console.log('Error saving data: '+err);
            res.send(500);
            return;
        }
        console.log('Car '+car.name+' successfuly saved');
        res.send(200);
    });
};

exports.user = {};

exports.user.post = function(req,res)
{
    console.log('received request to register user: '+req.param('name'));

    UserModel.create({
        name : req.param('name').toUpperCase(),
        email : req.param('email').toUpperCase(),
        phone : req.param('phone')
    },function(err,user) {
        if (err) {
            console.log('Error saving data: '+err);
            res.send(500);
            return;
        }
        console.log('User '+user.name+' successfuly saved');
        res.send(200);
    });

};
