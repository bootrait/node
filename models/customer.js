const mongoose = require('mongoose');
const Joi = require('joi');

const joiSchema = {
    name: Joi.string().min(5).required(),
    phone: Joi.string().min(11).max(11).required(),
    isGold:Joi.boolean().required()
};

const joiUpdateSchema = {
    name: Joi.string().min(5),
    phone: Joi.string().min(10).max(10),
    isGold:Joi.boolean()
};

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5
    },
    phone: {
        type: String,
        required: true,
        // minlength: 11,
        // maxlength: 11,
        match: /^0[0-9]{10}$/i
    },
    isGold: {
        type: Boolean,
        default: false
    }
}));

function validateCustomer(object){
    return Joi.validate(object,joiSchema);
}

exports.Customer=Customer;
exports.validate=validateCustomer;