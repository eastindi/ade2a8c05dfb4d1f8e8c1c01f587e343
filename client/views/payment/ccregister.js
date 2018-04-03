var style = {
  base: {
    color: '#303238',
    fontSize: '16px',
    color: "#32325d",
    fontSmoothing: 'antialiased',
    '::placeholder': {
      color: '#ccc',
    },
  },
  invalid: {
    color: '#e5424d',
    ':focus': {
      color: '#303238',
    },
  },
};
import { payment_accounts } from '../../../imports/api/payment_account.js';
Template.ccregister.helpers({
    payment_account()
    {
        return payment_accounts.find({});
    },
});

Template.ccregister.onRendered(function () {
  var stripe = Stripe('pk_test_TJFaB69TR2WVrffSYUegAFUY');
  var elements = stripe.elements();
  // Create an instance of the card Element.
  var card = elements.create('card', {
    style: style
  });
  // Add an instance of the card Element into the `card-element` <div>.
  card.mount('#card-element');

  card.addEventListener('change', function (event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });

  var form = document.getElementById('payment-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    stripe.createToken(card).then(function (result) {
      if (result.error) {
        // Inform the customer that there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server.
        stripeTokenHandler(result.token);
      }
    });
  });
});