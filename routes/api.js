var Car = require('../models/Car');
var User = require('../models/User');


exports.getCarById = function (req, res) {
    Car.findById(req.params.id, function(err,car) {
        if (err) {
            console.log('There was an error retrieving car by id: '+err);
            res.send(500);
        }
        else {
            if(!car) {
                // this car doesn't exist: send 404!
                console.log('Car with id '+req.params.id+' does not exist');
                res.send(404);
            }
            else {
                // we populate the name field of the owner of the car,
                // along with contact details
                var opt = [{
                    select : 'email profile.name',
                    path : 'createdBy'
                }];
                Car.populate(car,opt,function(err,populatedCar) {
                    if (err) {
                        console.log('There was an error retrieving car by id: '+err);
                        res.send(500);
                    }
                    else {
                        console.log(populatedCar);
                        res.json( populatedCar );
                    }
                });
            }
        }
    });
};
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
        // user specified dateFrom
        dbQuery.where('dateFrom')
            .lte(new Date(parseInt(query.dateFrom,10)));
    }

    if(query.dateTo) {
        // user specified dateTo
        dbQuery.where('dateTo')
            .gte(new Date(parseInt(query.dateTo,10)));
    }

    if(query.createdById) {
        // user specified only someone's cars
        dbQuery.where({ createdBy : query.createdById });
    }

    if(query.ownedCar && req.user && req.user.id) {
        // user specified only its own car
        dbQuery.where({ createdBy : req.user.id });
    }

    dbQuery.exec(function( err, docs) {
        if (err) {
            console.log('Error fetching data: '+err);
            res.send(500);
            return;
        }
        res.json( docs  );
        console.log('available car sent: '+docs.length);
    });

};

exports.postCarById = function (req, res) {
    // we find the car at the requested id
    // we ensure that the user who created it
    // has the same id as the one who is updating it
    var query = {
        _id : req.params.id,
        createdBy : req.user.id
    };

    var updatedCar = {
        name : req.param('name').toUpperCase(),
        location : req.param('location').toUpperCase(),
        dateFrom : req.param('dateFrom'),
        dateTo : req.param('dateTo'),
        price : req.param('price')
    };
    Car.findOneAndUpdate(query, updatedCar, {'new':false}, function(err,car) {
        if (err) {
            console.log('Error fetching data: '+err);
            res.send(500);
            return;
        }
        else {
            if (!car) {
                // the car didn't exist! tried to hack?!
                console.log('No car found.. are you sure you are the owner?!');
                res.send(404);

            }
            else {
                console.log('Successful Update');
                res.send(200);
            }
        }
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
        price : req.param('price'),
        // get id of the user who's sending the request
        createdBy : req.user.id
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
