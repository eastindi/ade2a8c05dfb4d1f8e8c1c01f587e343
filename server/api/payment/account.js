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

        var this_customer = customer.findOne({
            "customer_id": source.customer_id
        });
        if (!this_customer.external_Customer_id) {
            //todo:except for customer_id, hardcoded values, modify to set 
            metadata = {
                "source_ip": "10.10.10.100",
                "device_type": "mobile",
                "app_name": "product_name"
            };

            metadata.customer_id = this_customer.customer_id;
            var oCustomer = {
                "description": this_customer.first_name + ' ' + this_customer.last_name,
                "metadata": metadata
            };
            stripe.customers.create(oCustomer).then(result => {
                customer.update({
                    customer_id: customer_id
                }, {
                    $set: {
                        external_Customer_id: result.id
                    }
                });
                //todo: stripe does extensive loggin, if custome logging required add here
                console.log(result);
            }).catch(err => {
                //todo: stripe does extensive loggin, if custome logging required add here
                console.log(err);
            });
        }
        var uuid = require("uuid")();
        var newPaymentAccount = {
            "payment_account_id": uuid,
            "customer_id": this_customer.external_Customer_id,
            "payment_account_type": "cc",
            "name": source.friendlyName,
            "account_details": {
                "zip": source.token.card.address_zip,
                "type": source.token.card.brand,
                "last4": source.token.card.last4
            }
        };
        stripe.sources.create({
                type: 'card',
                currency: 'usd',
                token: source.token.id
            }).then(resultSource => {
                newPaymentAccount.external_account_id = resultSource.id;
            
                stripe.customers.update(this_customer.external_Customer_id, {
                    source: resultSource.id
                }).catch(err => {
                    console.log(err);
                });
            }).then(resultCustomerUpdate => {
                payment_accounts.insert(newPaymentAccount);
                console.log(resultCustomerUpdate);
            })
            .catch(err => {
                console.log(err);
            });
    }
});