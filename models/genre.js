const mongoose = require('mongoose');
const Joi = require('joi');
const genreSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255
        },
        date: {
            type: Date,
            default: Date.now
        }
    });

const Genre = mongoose.model('Genre', genreSchema);

const joiSchema = {
    name: Joi.string().min(3).required()
};

function validate(object){
    return Joi.validate(object, joiSchema);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validateGenre = validate;