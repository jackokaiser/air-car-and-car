var Car = require('../models/car').Car;

// monkey patch car db
var cars = [
    new Car('Ford Falcon', 'Melbourne', new Date('October 13, 1975'), new Date('February 20, 2020')),
    new Car('Mitsubichi', 'Melbourne', new Date('January 22, 2014'),new Date('March 12, 2014')),
    new Car('Alpha Romeo', 'Sydney', new Date('October 13, 2013'), new Date('December 20, 2015')),
    new Car('Van', 'Sydney', new Date('September 20, 2013'), new Date('September 25, 2015'))
];



/*
 * Serve JSON to our AngularJS client
 */
exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};


exports.cars = function (req, res) {
    console.log('request for available car received');
    // query db to get car available
    // at the right place and on the right time

    // monkey patched
    var filteredCar = cars.filter(function(c) {
        var carAccepted =
            // car in the right location
            (c.location === req.query.location)
            &&
            // car available before user request it
            (c.dateFrom.getTime() <= req.query.dateFrom)
            &&
            // car still available after user request it
            (c.dateTo.getTime() >= req.query.dateTo);

        return carAccepted;
    });
    res.json( {
        cars : filteredCar
    });
    console.log('available car sent');
};