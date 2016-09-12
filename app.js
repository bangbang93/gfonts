var express = require('express');
var path = require('path');
var logger = require('morgan');
var helmet = require('helmet');

var routes = require('./routes/index');
var router = require('./routes/router');

var app = express();

app.use(logger('dev'));
app.use(helmet.hidePoweredBy());
app.use(express.static(path.join(__dirname, 'public'), {
  redirect: false
}));

app.use('/', routes);
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (res.headersSent){
      return console.error(err);
    }
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (res.headersSent){
    return console.error(err);
  }
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
