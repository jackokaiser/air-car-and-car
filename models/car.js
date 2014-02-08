var Car = function Car (name, location, available)
{
    this.name = name;
    this.location = location;
    this.available = available
    return this;
};

Car.prototype.constructor = Car;

exports.Car = Car;