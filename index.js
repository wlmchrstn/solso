var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');

var indexRouter = require('./routes/index');
var memberRouter = require('./routes/v1/memberRoutes');
var eventRouter = require('./routes/v1/eventRoutes');
var donationRouter = require('./routes/v1/donationRoutes');

var app = express();

var mongoose = require('mongoose');
var env = process.env.NODE_ENV || "development";
if (env == "development" || env == 'test') {
  require('dotenv').config()
};

const configDB = {
  development: process.env.DB_DEV,
  test: process.env.DB_TEST || $DB_TEST,
  production: process.env.DB_PROD
};

const dbConnection = configDB[env];

mongoose.connect(dbConnection)
  .then(() => {
    console.log('Database successfully connect!')
  });
mongoose.Promise = Promise;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/member', memberRouter);
app.use('/api/event', eventRouter);
app.use('/api/donation', donationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server Started at ${Date()}!`)
  console.log(`Listening on port ${port} in database ${env}!`)
});

setInterval(function() {
  http.get(process.env.BE_HOME_URL)
}, 900000);

module.exports = app;
