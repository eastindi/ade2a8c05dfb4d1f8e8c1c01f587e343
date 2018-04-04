import {
    Mongo
} from 'meteor/mongo';
const stripe = require('stripe')(
    "sk_test_yQ80NT6scrcZ6Elz4a9bR9fG"
);
export const customer = new Mongo.Collection('customer');


Meteor.methods({
    createStripeCustomer(customer_id, callback) {
        var c = customer.findOne({
            "customer_id": customer_id
        });
        if (c) {
            var oCust = {
                "description": c.first_name + ' ' + c.last_name,
                "metadata": {
                    "customer_id": c.customer_id
                }
            };
            stripe.customers.create(oCust).then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            });
        }
    }
});