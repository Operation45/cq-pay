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

var errorHandlers = require('./errorHandlers');

var app = express();

app.disable('x-powered-by');
app.set('port', config.port);
app.set('env', config.env);
app.set('startTime', new Date());
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

app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url);
  console.log('\tbody', req.body);
  next();
});

app.get('/', redirectToCivicQuarterly); 
app.get('/status', status); 
app.post('/donate', processDonation);
app.post('/pay', processSubscription); 

function redirectToCivicQuarterly(req, res) {
 return res.redirect('https://www.civicquarterly.com');
}

function status(req, res) {
  return res.send('200 A-OK!\nApp alive since' + app.get('startTime'));
}

function processSubscription(req, res) {
  var issue = req.body.issue, metadata = {};

  var customer = {
    card: req.body['stripe-token'],
    email: req.body.email
  };

  metadata = {
    name: req.body.name,
    address_1: req.body['address-first'],
    address_2: req.body['address-second'],
    city: req.body.city,
    zip: req.body.zip,
    issue: req.body.issue
  };

  customer.plan = config.stripePlan;
  customer.metadata = metadata;

  if (req.body.offerCode != '') {
    customer.coupon = req.body.offerCode.toUpperCase();
  }

  stripe.customers.create(customer, function(err, success) {
    var apiResponse = handleStripeCreateResponse(err, success);
    res.send(apiResponse);
  });
}

function processDonation(req, res) {
  var metadata = {
    name: req.body.name,
    email: req.body.email
  },
    stripeToken = req.body['stripe-token'],
    donationAmount = req.body['donation-amount'] * 100;

  var charge = {
      amount: donationAmount,
      currency: 'usd',
      card: stripeToken,
      metadata: metadata
    };

  stripe.charges.create(charge, function(err, success) {
    var apiResponse = handleStripeCreateResponse(err, success);
    res.send(apiResponse);
  });
}

function handleStripeCreateResponse(err, success) {
  if (err) {
    return JSON.stringify(err.raw);
  }
  else {
     return JSON.stringify(success);
  }
};

app.use(errorHandlers.handle404);
app.use(errorHandlers.handle500);

app.listen(app.get('port'), '0.0.0.0', function() {
  console.log("Running at 0.0.0.0:" + app.get('port'))
});
