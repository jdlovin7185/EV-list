const mongoose = require('mongoose');

let carSchema = mongoose.Schema({
  Make: {
    Name: {type: String, required: true},
    Model: {type: String, required: true},
    Style: {type: String}
  },
  Specs: {
    Horsepower: Number,
    Range: Number,
    Connector: String,
    Drivetrain: String
  },
  Offroad: Boolean,
  ComingSoon: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  CarOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car'}]
});

let Car = mongoose.model('Car', carSchema);
let User = mongoose.model('User', userSchema);

module.exports.Car = Car;
module.exports.User = User;