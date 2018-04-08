import {
    Mongo
} from 'meteor/mongo';
import {
    customer
} from '../../main.js';
import {
    settings
} from 'cluster';

import { Session } from 'meteor/session';
export const payment_log = new Mongo.Collection('payment_log');

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
            source: charge.external_account_id,
            description: charge.desc,
        };
        stripe.charges.create(charge).then(chargeResult => {
                logpayment(charge, chargeResult, "creditcharge", charge.initiator, 1);
            })
            .catch(err => {
                logpayment(charge, err, "creditcharge", charge.initiator, 0);
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
            source: charge.external_account_id,
            description: charge.desc
        };
        console.log(charge);
        stripe.charges.create(charge).then(chargeResult => {
                logpayment(charge, chargeResult, "banktransfer", charge.initiator, 1);
            })
            .catch(err => {
                logpayment(charge, err, "banktransfer", charge.initiator, 0);
            });
    },

    verifyBankAccount(verifyparam, callback) {
        var cust = customer.findOne({
            customer_id: verifyparam.customer_id
        });
        stripe.customers.verifySource(
            cust.external_customer_id,
            verifyparam.external_account_id, {
                amounts: verifyparam.amounts
            }).then(result => {
            console.log(result);
        }).catch(err => {
            throw err;
        });
    }
});

function logpayment(request, response, type, initiator, status) {
    payment_log.insert({
        customer_id: request.customer_id,
        processor: "stripe",
        initiator: initiator||"capxweb",
        type: type,
        request: request,
        response: response,
        status:status,
        created: new Date()
    });
}