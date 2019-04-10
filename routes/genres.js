const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');
router.get('/', async (request, response) => {
    const genres = await Genre.find();
    response.send(genres);
});


router.post('/', async (req, res) => {
    const {error} = validateGenre(req.body);
    if (error) {
        var errorMsg = '';
        error.details.forEach(e => errorMsg += ' ' + e.message);
        res.status(400).send(errorMsg);
        return;
    }
    let genre = new Genre({name: req.body.name});
    genre = await genre.save();
    res.send(genre);
});


router.put('/:id', async (req, res)=>{
    const {error} = validateGenre(req.body);
    if (error) {
        var errorMsg = '';
        error.details.forEach(err => errorMsg += '' + err.message);
        res.status(400).send(errorMsg);
        return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404).send('Error! Genre not found');
        return;
    }
    const genre = await Genre.findByIdAndUpdate(req.params.id,
         {name: req.body.name}, {
             new : true
         });
    if (!genre) return res.status(404).send('Error! Genre not found');
    res.send(genre);
});


router.delete('/:id', async (req, res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).send('Error! Genre not found');
        return;
    }
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Error! Genre not found');
    res.send(genre);
});

router.get('/:id', async (request, response) => {
    const genre = await Genre.findOne({_id: request.params.id});
    if (!genre) return res.status(404).send('Error! Genre not found');
    res.send(genre);
});

module.exports = router;