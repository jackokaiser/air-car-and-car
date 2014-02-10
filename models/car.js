var Car = function Car (name, location, dateFrom, dateTo)
{
    this.name = name;
    this.location = location;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    return this;
};

Car.prototype.constructor = Car;

exports.Car = Car;