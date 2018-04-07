import {
    Mongo
} from 'meteor/mongo';
import {
    settings
} from 'cluster';
const stripe = require('stripe')(
    Meteor.settings.private.stripe
);
import {
    customer
} from '../../main.js';

Meteor.methods({
    createStripeCustomer(customer_id) {
        //todo:except for customer_id, hardcoded values, modify to set 
        metadata = {
            "source_ip": "10.10.10.100",
            "device_type": "mobile",
            "app_name": "product_name"
        };
        var cust = customer.findOne({
            "customer_id": customer_id
        });
        if (cust && !cust.external_customer_id) {

            metadata.customer_id = cust.customer_id;
            var oCust = {
                "description": cust.first_name + ' ' + cust.last_name,
                "metadata": metadata
            };
            stripe.customers.create(oCust).then(result => {
                cust.external_customer_id = result.id;
                customer.update({
                    customer_id: customer_id
                }, {
                    $set: {
                        external_customer_id: result.id
                    }
                }).then(() => {
                    return null, cust;
                }).catch(err => {
                    return err;
                });

            }).catch(err => {
                return err;
            });
        }
        else
        {
            return null, cust;
        }
    }
});