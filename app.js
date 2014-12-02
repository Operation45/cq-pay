// Load dotenv.
var dotenv = require('dotenv');
dotenv.load();

var _ = require('lodash');
var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var csrf = require('lusca').csrf();
var config = require('./config');
var stripe = require('stripe')(config.stripeSecret);

var app = express();

var corsOptions = {
  origin: function(origin, callback) {
    //callback(null, _.contains(CORSWhiteList, origin));
    callback(null, true);
  }
}

app.set('port', config.port);
app.set('env', config.env);
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true,
}));

app.get('/status', function(res, res, next) {
  return res.json('yo');
})

app.post('/pay', cors(corsOptions), function(req, res, next) {

  var issue = req.body.issue, metadata = {};

  var customer = {
    card: req.body.stripeToken,
    email: req.body.email
  };

  if (issue != 'na') {
    metadata = {
      name: req.body.name,
      address_1: req.body.addressFirst,
      address_2: req.body.addressSecond,
      city: req.body.city,
      zip: req.body.zip,
      issue: req.body.whichIssue
    };

    customer.plan = config.stripePlan;
    customer.metadata = metadata;

    if (req.body.offerCode != '') {
      customer.coupon = req.body.offerCode.toUpperCase();
    }

    stripe.customers.create(customer, function(err, customer) {
      if (err) {
        return res.json(err.raw);
      }
      else {
        return res.json(customer);
      }
    });

  }
  else {
    metadata = {
      name: req.body.name,
      issue: 'donation'
    };

    var donationAmount = req.body['donation-amount'] * 100;

    customer.metadata = metadata;


    stripe.customers.create(customer, function(err, customer) {
      console.log('customer', customer);
      console.log('err', err);

      if (err) {
        return res.json(err.raw);
      }
      else {

        stripe.charges.create({
          amount: donationAmount,
          currency: 'usd',
          customer: customer.id

        });
        return res.json(customer);
      }
    });
  }

});


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});


app.listen(app.get('port'), function() {
  console.log("Running at localhost:" + app.get('port'))
});
