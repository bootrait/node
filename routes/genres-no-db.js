const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const debug = require('debug')('app:debug');
const dbDebug = require('debug')('app:db');


const router = express.Router();
const joiSchema = {
    name: Joi.string().min(3).required()
};

var genres = [
    {id: 1, name: 'Action'},
    {id: 2, name: 'Horror'},
    {id: 3, name: 'Romance'},
];

router.get('/', (request, response) => {
    response.send(genres);
});

router.get('/:id', (request, response) => {
    const genre = genres.find(gen => gen.id === parseInt(request.params.id));
    if (!genre) return response.status(404).send('Genre Not Found');
    response.send(genre);
});

router.post('/', (req, res) => {
    const validatedResult = Joi.validate(req.body, joiSchema);
    if (validatedResult.error) {
        var error = '';
        validatedResult.error.details.forEach(err => error = error + " " + err);
        res.status(400).send(error);
        return;
    }
    const genre = {id: genres.length+1, name: req.body.name};
    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res)=>{
    const genre = genres.find(gen => gen.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Genre Not Found');
    const validatedResult = Joi.validate(req.body, joiSchema);
    if (validatedResult.error) {
        var errorMsg = '';
        validatedResult.error.details.forEach(err => errorMsg = errorMsg + err);
        res.status(404).send(errorMsg);
    }
    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res)=>{
    const genre = genres.find(gen => gen.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Genre Not Found');
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

module.exports = router;