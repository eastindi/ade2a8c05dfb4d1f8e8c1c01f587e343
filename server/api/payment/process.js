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
        var this_customer = customer.findOne({
            customer_id: charge.customer_id
        });
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
    },

    payWithBankAccount(charge, callback) {
        var this_customer = customer.findOne({
            customer_id: charge.customer_id
        });
        charge = {
            amount: charge.amount,
            currency: "usd",
            customer: this_customer.external_customer_id,
            source:charge.external_account_id,
            description: charge.desc
        };
        console.log(charge);
        stripe.charges.create(charge).then(chargeResult => {
                console.log(chargeResult);
            })
            .catch(err => {
                console.log(err);
            });
    },

    verifyBankAccount(verifyparam, callback) {
        var cust = customer.findOne({
            customer_id: verifyparam.customer_id
        });
        console.log(verifyparam.external_account_id);
        console.log(cust.external_customer_id);
        stripe.customers.verifySource(
            cust.external_customer_id,
            verifyparam.external_account_id, {
                amounts: verifyparam.amounts
            }).then(result => {
            console.log(result);
        }).catch(err => {
            throw err;
        })
    }
});