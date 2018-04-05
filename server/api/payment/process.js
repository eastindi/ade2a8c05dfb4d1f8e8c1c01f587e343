import {
    Mongo
} from 'meteor/mongo';
import {
    customer
} from '../../main.js';
import {
    settings
} from 'cluster';

const stripe = require('stripe')(
    Meteor.settings.private.stripe
);

Meteor.methods({
    payWithThisCC(charge, callback) {
        var this_customer = customer.findOne({customer_id:charge.customer_id});
        charge = {
            amount: charge.amount,
            currency: "usd",
            customer: this_customer.external_customer_id,
            description: charge.desc
          };
          console.log(charge);
          stripe.charges.create(charge).then(chargeResult => {
                console.log(chargeResult);
            })
            .catch(err => {
                console.log(err);
            });
    }
});