import {payment_accounts} from './payment_account.js';
const stripe = Stripe(Meteor.settings.public.stripe);

Template.achregister.onRendered(function () {
  var stripe = Stripe(Meteor.settings.private.stripe);
});
Template.achregister.helpers({
  bank_accounts() {
    return payment_accounts.find({
      "payment_account_type": "ach_debit"});
  }
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
          friendly_name: document.getElementById("bank_friendly_name").value,
          type: "ach_debit",
          token: result.token.id
        };
        Meteor.call('addStripeBankAccount', source);
        ToggleShow('div_achregister');
      }).catch(err => {
        console.log(err);
        //throw err;
      });
    }
  }  
})

Template.bank_account_list.events({
  'click .btn_verify_bank_account': function (event) {
    var verifyparam = {
      external_account_id:event.currentTarget.value,
      customer_id: document.getElementById('opt_customer').value,
      amounts: [32,45]
    };
    Meteor.call('verifyBankAccount', verifyparam);
  },
  'click .btn_charge_bank_account': function (event) {
    var amount = parseFloat(document.getElementById('payment_amount').value).toFixed(2);
    var charge = {
      external_account_id:event.currentTarget.value,
      customer_id: document.getElementById('opt_customer').value,
      amount: Math.floor(amount*100),
      desc:"Deal Commission"
    };
    console.log(charge);
    Meteor.call('payWithBankAccount', charge);
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