var Car = require('../models/car').Car;
/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};


exports.cars = function (req, res) {
    res.json( {
        cars : [
            new Car('Ford Falcon', '232 Swanston Street', '11/02/2014-16/02/2014'),
            new Car('Mitsubichi', '10 Queen Street', '15/02/2014-*'),
            new Car('Alpha Romeo', '552 Flinders Lane', '7/01/2014-25/05/2016') ]
    });
};