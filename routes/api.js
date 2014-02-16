var Car = require('../models/Car');
var User = require('../models/User');


exports.getCars = function (req, res) {
    console.log('request for available car received');
    // query db to get car available
    // at the right place and on the right time

    var query = req.query;
    console.log(query);
    var dbQuery;
    if (query.location) {
        // user specified location
        dbQuery = Car.find({location: query.location.toUpperCase()});
    }
    else {
        // no location: let's find everything
        dbQuery = Car.find({});
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

exports.postCars = function (req, res) {
    console.log('received request to register car: '+
                req.param('name')+' '+req.param('location')+
                ' '+req.param('dateFrom')+' '+req.param('dateTo'));
    Car.create({
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
