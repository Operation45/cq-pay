/// catch 404 and forwarding to error handler
function handle404(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

// production error handler
// no stacktraces leaked to user
function handle500(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
}

module.exports.handle404 = handle404;
module.exports.handle500 = handle500;