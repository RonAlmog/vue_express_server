const express = require('express');
const app = express();
const api = require('./api');
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 8081))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', api);
app.use(express.static('static'));

app.use(morgan('dev'));

app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404
    res.json(err);
});

const mongoose = require('mongoose');
mongoose.connection('mongodb://localhost:27017/globomatics')
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function () {
    console.log('Connected to Mongodb')

    app.listen(app.get('post'), function () {
        console.log('API server listening on port ' + app.get('port'));
    });
})