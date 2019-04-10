const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({

});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(object){

}

exports.Rental = Rental;
exports.validateRental = validateRental;