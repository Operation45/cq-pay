var pubKey = "pk_test_NacYaWKIA7HYL1lr9HSfSa1O";

function stripePaymentSubmit(token) {
  // Get Pay Url:
  $.post( payURL, token, null, 'json')
    .done(function(err, data) {
      if (data === 'success') {
        handleSuccessfulSubscription()
      }
    })
    .fail(function(err) {
      console.log('fail err', err);
    });
}

function handleSuccessfulSubscription () {
  $('.header h1').text('Thank you for subscribing to Civic Quarterly')
  $('#subscribeButton').text("Subscribed!")
}

$( document ).ready(function() {

  var payURL = "http://civic-quarterly-payments.herokuapp.com/pay";

  var handler = StripeCheckout.configure({
    key: pubKey,
    token: stripePaymentSubmit,
    name: "Civic Quarterly Subscription",
    description: "Just $9 an issue",
    amount: "900",
    panelLabel: "Subscribe Now",
    zipCode: true,
    allowRememberMe: false
  });

  $('#subscribeButton').click(function(e) {
    handler.open();
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

});
