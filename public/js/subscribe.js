Stripe.setPublishableKey('pk_live_rnxLhbEf4ErqyyxxwoStRUxh');

function updateSubscriptionMessage(message) {
  alert(message);
}

function valueOf(id) {
  return document.getElementById(id).value;
}

function validateForm(cardNumber, expirationMonth, expirationYear, cvc) {
  return Stripe.card.validateCardNumber(cardNumber)
    && Stripe.card.validateExpiry(expirationMonth, expirationYear)
    && Stripe.card.validateCVC(cvc);
}

function handleSubscribeClick() {

  var name = valueOf('name');
  var email = valueOf('email');
  var cardNumber = valueOf('cardNumber');
  var expirationMonth = valueOf('expirationMonth');
  var expirationYear = valueOf('expirationYear');
  var cvc = valueOf('CVC');
  var addressFirst = valueOf('addressFirst');
  var addressSecond = valueOf('addressSecond');
  var city = valueOf('city');
  var state = valueOf('state');
  var zip = valueOf('zip');

  if (validateForm(cardNumber, expirationMonth, expirationYear, cvc)) {
    Stripe.card.createToken({
      number: cardNumber,
      cvc: cvc,
      exp_month: expirationMonth,
      exp_year: expirationYear,
      name: name
    }, stripeResponseHandler);
  }
  else {
    updateSubscriptionMessage('Please make sure you\'ve entered your credit card information correctly');
  }
}

function stripeResponseHandler(status, response) {
  console.log('status', status);
  console.log('response', response);
  if (response.error) {
    updateSubscriptionMessage(response.error.message);
  }
  else {
    var hidden = document.createElement('input');
    hidden.type = "hidden";
    hidden.name = "stripeToken";
    hidden.value = response.id;

    var form = document.getElementById('subscribe-form');
    form.appendChild(hidden);
    $.post('/pay', $(form).serialize(), subscriptionSuccess);
  }
}

function subscriptionSuccess() {
  $('#subscribe-form').text('Thank you for your subscription');
}

$(document).ready(function() {
  $('#subscribe-button').click(handleSubscribeClick);
});
