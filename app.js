const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const debug = require('debug')('app:start');
const config = require('config');
const morgan = require('morgan');

mongoose.connect('mongodb://localhost:27017/genres-api', {useNewUrlParser : true})
    .then(()=>debug('Connected to Database'))
    .catch(err=> console.error('Failed to connect to db', err.message));

app.use(express.static('public'));
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
if (app.get('env') == 'development') {
    app.use(morgan('tiny'));
    debug('morgan is running');
}


const port=process.env.port || 4343;
app.listen(port,()=> {
    debug(`${config.get('name')} is good to go at ${port}`);
});