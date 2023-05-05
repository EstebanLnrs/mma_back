var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var fighterRouter = require('./routes/fighter')
var organisationRouter = require('./routes/organisation')
var app = express();

var connectionString = "mongodb+srv://esteb:QM9f6N7bGQYYSFms@cluster0.ar7xaum.mongodb.net/test";
var mongoDB = process.env.MONGODB_URI || connectionString;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/fighters', fighterRouter);
app.use('/organisations', organisationRouter)

module.exports = app;
