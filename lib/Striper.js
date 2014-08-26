var config = require('../config');
var stripe = require('stripe')(config.stripeSecret);

function Striper(tokenData) {
  this.tokenData = tokenData;
}

Striper.subscribeCustomer = function(tokenData) {
  return stripe.customers.create({
    card: tokenData.id,
    plan: "yearly-1",
    email: tokenData.email,
  });
}

module.exports = Striper;


