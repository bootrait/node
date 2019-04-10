const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const debug = require('debug')('app:debug');
const dbDebug = require('debug')('app:db');

mongoose.connect('mongodb://localhost:27017/genres-api', {useNewUrlParser : true})
    .then(()=>dbDebug('Connected to Database'))
    .catch(err=> console.error('Failed to connect to db', err.message));

const router = express.Router();
const joiSchema = {
    name: Joi.string().min(3).required()
};

const schema = new mongoose.Schema({
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

const Genre = mongoose.model('Genre', schema);


var genres = [
    {id: 1, name: 'Action'},
    {id: 2, name: 'Horror'},
    {id: 3, name: 'Romance'},
];

router.get('/', (request, response) => {
    Genre.find()
        .then((genres => response.send(genres)));
});

router.get('/:id', (request, response) => {
    Genre.findOne({_id: request.params.id})
        .then(genre => response.send(genre))
        .catch(err => response.status(404).send('Genre Not Found'));
    // const genre = genres.find(gen => gen.id === parseInt(request.params.id));
    // if (!genre) return response.status(404).send('Genre Not Found');
    // response.send(genre);
});

router.post('/', (req, res) => {

    const {error} = Joi.validate(req.body,joiSchema);
    if (error) {
        var errorMsg = '';
        error.details.forEach(e => errorMsg += ' ' + e.message);
        res.status(400).send(errorMsg);
        return;
    }
    // const {validatedResult} = Joi.validate(req.body, joiSchema);
    // if (validatedResult.error) {
    //     var errorMsg = '';
    //     dbDebug(validatedResult);
    //     validatedResult.error.details.forEach(err => errorMsg = errorMsg + " " + err);
    //     res.status(400).send(errorMsg);
    //     return;
    // }
    const genre = new Genre({name: req.body.name});
    genre.save().then(genre => res.send(genre)).
        catch((ex) => {
            var errorMsg='';
            for (const i in ex.errors) {
                errorMsg += ex.errors[i].message;
            }
            res.status(400).send(errorMsg);
        });

    // genres.push(genre);
    // res.send(genre);
});

router.put('/:id', (req, res)=>{
    // const genre = genres.find(gen => gen.id === parseInt(req.params.id));
    // if (!genre) return res.status(404).send('Genre Not Found');
    const {error} = Joi.validate(req.body, joiSchema);
    if (error) {
        var errorMsg = '';
        error.details.forEach(err => errorMsg += '' + err.message);
        res.status(404).send(errorMsg);
        return;
    }
    
    // genre.name = req.body.name;
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).send('Error! Genre not found');
            return;
        }
        Genre.updateOne({_id: req.params.id}, {
            $set: {
                name: req.body.name
            }
        }).then(resolve => res.send(resolve))
            .catch((ex) => {
                // if (ex == CastError) {
                //     dbDebug('cast erro');
                // }
                dbDebug(ex);
                var errorMsg='';
                for (const i in ex.errors) {
                    errorMsg += ex.errors[i].message;
                }   
                res.status(400).send(errorMsg);
            });
    } catch(ex) {
        res.status(400).send('Error! Failed to update Genre');
    }
});

router.delete('/:id', (req, res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).send('Error! Genre not found');
        return;
    }
    Genre.findByIdAndRemove(req.params.id).then(resolve => res.send(resolve))
        .catch((ex) => {
            dbDebug(ex);
            var errorMsg='';
            for (const i in ex.errors) {
                errorMsg += ex.errors[i].message;
            }   
            res.status(400).send(errorMsg);
        });
});

module.exports = router;