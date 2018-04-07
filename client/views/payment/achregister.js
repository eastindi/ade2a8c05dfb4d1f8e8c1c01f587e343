const stripe = Stripe(Meteor.settings.public.stripe);

Template.achregister.onRendered(function () {
  var stripe = Stripe(Meteor.settings.private.stripe);

});

Template.bank_account_form.events({
  'input #txt_routing_number': function (event) {
    var displayError = document.getElementById('ach-errors');
    if (!validate_rn(event.currentTarget.value)) {
      displayError.textContent = "Please enter valid bank routing number";
    } else {
      displayError.textContent = '';
    }
  },
  'input #txt_bank_account_number': function (event) {
    var displayError = document.getElementById('ach-errors');
    if (isNaN(event.currentTarget.value)) {
      displayError.textContent = "Please enter valid bank account number";
    } else {
      displayError.textContent = '';
    }
  },
  'click #btn_add_bank_account': function (event) {
    var displayError = document.getElementById('ach-errors');
    if (isNaN(event.currentTarget.value)) {
      displayError.textContent = "Please enter valid bank account number";
    } else {
      var tokenParam = {
        country: 'US',
        currency: 'usd',
        routing_number: document.getElementById('txt_routing_number').value,
        account_number: document.getElementById('txt_bank_account_number').value,
        account_holder_name: document.getElementById('opt_customer').options[document.getElementById('opt_customer').selectedIndex].textContent,
        account_holder_type: 'individual',
      };
      stripe.createToken('bank_account', tokenParam)
      .then(result => {
        var source = {
          customer_id: document.getElementById('opt_customer').value,
          friendly_name: document.getElementById("friendly_name").value,
          type: "ach_debit",
          token: result.token.id
        };
        Meteor.call('addStripeSource', source);
      }).catch(err => {
        console.log(err);
        //throw err;
      });
    }
  }
})

function validate_rn(routingNumber) {
  if (routingNumber == "")
    return true;
  var match = routingNumber.match(/^\s*([\d]{9})\s*$/);
  if (!match) {
    return false;
  }

  var weights = [3, 7, 1];
  var aba = match[1];

  var sum = 0;
  for (var i = 0; i < 9; ++i) {
    // using charAt for IE7 support
    sum += aba.charAt(i) * weights[i % 3];
  }

  return (sum !== 0 && sum % 10 === 0);
}