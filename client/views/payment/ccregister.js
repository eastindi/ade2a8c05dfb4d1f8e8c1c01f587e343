import {payment_accounts} from './payment_account.js';

Template.ccregister.helpers({
  card_accounts() {
    return payment_accounts.find({
      "payment_account_type": "card", "customer_id":Session.get("customer_id")
    });
  }
});

Template.card_list.events({
  "click .btnPayWithCC": function (event) {
    var amount = parseFloat(document.getElementById('payment_amount').value).toFixed(2);
    if (amount > 0) {
      var payEvent = {
        "token": event.target.value,
        "customer_id":document.getElementById('opt_customer').value,
        "source":event.currentTarget.value,
        "amount": Math.floor(amount*100),
        "desc": "Introduction Fee"
      };
      console.log(payEvent);
      Meteor.call('payWithThisCC', payEvent);
    }
  }
})

Template.ccregister.onRendered(function () {
  var stripe = Stripe(Meteor.settings.public.stripe);
  var elements = stripe.elements();
  // Create an instance of the card Element.
  var card = elements.create('card');
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
        var source = {
          type: "card",
          friendly_name: document.getElementById("card_friendly_name").value,
          token: result.token.id,
          customer_id: document.getElementById("opt_customer").value
        };
        Meteor.call('addStripeSource', source);
        ToggleShow('div_ccregister');
      }
    });
  });
});