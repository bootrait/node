const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema, validateGenre } = require('../models/genre');


const joiSchema = {
    title: Joi.string().required().min(5).max(255),
    numberInStock: Joi.number(),
    genreId: Joi.string().required(),
    dailyRentalRate: Joi.number()
};

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255 // used to avoid malicious clients from break application.. Good habit to use it
    },
    numberInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0
    },
    genre : {
        type: genreSchema,
        required: true
    }
}));

function validate(object) {
    return Joi.validate(object,joiSchema);
}

exports.Movie = Movie;
exports.validateMovie = validate;