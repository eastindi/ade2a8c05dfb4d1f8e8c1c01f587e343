import {
    Mongo
} from 'meteor/mongo';
import {
    customer
} from '../../main.js';
import {
    settings
} from 'cluster';

import {
    Session
} from 'meteor/session';
export const payment_log = new Mongo.Collection('payment_log');

const stripe = require('stripe')(
    Meteor.settings.private.stripe
);

// const stripe = require('strip-sync')(
//     Meteor.settings.private.stripe
// );
Meteor.methods({
    payWithThisCC(charge) {
        var this_customer = customer.findOne({
            customer_id: charge.customer_id
        });
        var chargeparam = {
            amount: charge.amount,
            currency: "usd",
            customer: this_customer.external_customer_id,
            source: charge.external_account_id,
            description: charge.desc,
        };
        return stripe.charges.create(chargeparam).then(chargeResult => {
                chargeparam.customer_id = charge.customer_id;
                logpayment(chargeparam, chargeResult, "creditcharge", charge.initiator, 1);
                return null, chargeResult;
            })
            .catch(err => {
                console.log(err);
                logpayment(chargeparam, err, "creditcharge", charge.initiator, 0);
                return err, null;
            });
    },

    payWithBankAccount(charge) {
        var this_customer = customer.findOne({
            customer_id: charge.customer_id
        });
        var chargeparam = {
            amount: charge.amount,
            currency: "usd",
            customer: this_customer.external_customer_id,
            source: charge.external_account_id,
            description: charge.desc
        };
        return stripe.charges.create(chargeparam).then(chargeResult => {
            chargeparam.customer_id = charge.customer_id;
                logpayment(chargeparam, chargeResult, "banktransfer", charge.initiator, 1);
                return null,
                chargeResult;
            })
            .catch(err => {
                logpayment(chargeparam, err, "banktransfer", charge.initiator, 0);
                return err;
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
    return payment_log.insert({
        customer_id: request.customer_id,
        processor: "stripe",
        initiator: initiator || "capxweb",
        type: type,
        request: request,
        response: response,
        status: status,
        created: new Date()
    });
}