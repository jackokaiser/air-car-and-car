var CarModel = require('../model/car').CarModel;

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
    if(query.dateFrom)
        query.dateFrom=new Date(Date.parse(dateFrom));
    if(query.dateTo)
        query.dateTo=new Date(Date.parse(dateTo));

    console.log(query);
    CarModel.find(query,function( err, docs) {
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
        name : req.param('name'),
        location : req.param('location'),
        dateFrom : req.param('dateFrom'),
        dateTo : req.param('dateTo')
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