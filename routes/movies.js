const { Movie,validateMovie } = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Genre } = require('../models/genre');

router.get('/', async (req, res)=>{
    const movies = await Movie.find();
    res.send(movies);
});

router.post('/', async (req, res)=>{
    const { error } = validateMovie(req.body);
    if (error) {
        var errorMsg = '';
        error.details.forEach(e => errorMsg += ' ' + e.message);
        res.status(400).send(errorMsg);
        return;
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.genreId)) {
        res.status(404).send('Genre Id Error! invalid Genre');
        return;
    }
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Error! invalid Genre');

    var movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });
    try {
        movie = await movie.save();
        res.send(movie);
    } catch (ex){
        console.error('Failed to save', ex);
        res.status(400).send('Error! Failed to update Movie.');
    }
   });

router.put('/:id', async (req, res)=>{
    const { error } = validateMovie(req.body);
    if (error) {
        var errorMsg = '';
        error.details.forEach(e => errorMsg += ' ' + e.message);
        res.status(400).send(errorMsg);
        return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404).send('Id Error! Movie not found');
        return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.genreId)) {
        res.status(404).send('Genre Id Error! invalid Genre');
        return;
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Error! invalid Genre');
    
    try {
        movie = await Movie.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            genre: {
                _id: genre._id,
                name: genre.name
            }
        }, {
            new : true
        });

      if (!movie) return res.status(404).send('Error! Movie not found');
        res.send(movie);
    } catch (ex){
        res.status(400).send('Error! Failed to update Movie.');
    }
});

router.get('/:id', async (req, res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404).send('Id Error! Movie not found');
        return;
    }
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Error! Movie not found');
    res.send(movie);
});

router.delete('/:id', async (req, res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404).send('Id Error! Movie not found');
        return;
    }
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send('Error! Movie not found');
    res.send(movie);
    
});


module.exports = router;