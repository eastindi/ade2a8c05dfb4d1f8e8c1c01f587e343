import {
    Mongo
} from 'meteor/mongo';
import {
    customer,
    payment_accounts
} from '../../main.js';
import {
    settings
} from 'cluster';

const stripe = require('stripe')(
    Meteor.settings.private.stripe
);

Meteor.methods({
    addStripeSource(source, callback) {
        Meteor.call('createStripeCustomer', source.customer_id, (err, cust) => {
            if (err) {
                return callback(err);
            } else {
                var newPaymentAccount;
                var tsource = {
                    type: source.type,
                    currency: 'usd',
                    token: source.token
                };
                stripe.sources.create(tsource).then(resultSource => {
                        var uuid = require("uuid")();
                        newPaymentAccount = {
                            "payment_account_id": uuid,
                            "customer_id": cust.external_customer_id,
                            "payment_account_type": source.type,
                            "name": source.friendly_name,
                            "external_account_id": resultSource.id,
                            "account_details": {
                                "type": tsource.type === "card" ? resultSource.card.brand : resultSource.bank_name,
                                "last4": tsource.type === "card" ? resultSource.card.last4 : resultSource.last4
                            }
                        };


                        stripe.customers.createSource(cust.external_customer_id, {
                            source: resultSource.id
                        }).then(resultCustomerUpdate => {
                            payment_accounts.insert(newPaymentAccount);
                        }).catch(err => {
                            throw new Error("Error attaching source to customer:" + err);
                        });
                    })
                    .catch(err => {
                        throw new Error("Error creating new: " + err);
                    });
            }
        });
    }
});