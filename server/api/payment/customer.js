import {
    Mongo
} from 'meteor/mongo';
import { settings } from 'cluster';
const stripe = require('stripe')(
    Meteor.settings.private.stripe
);


Meteor.methods({
    createStripeCustomer(customer_id, callback) {
        //todo:except for customer_id, hardcoded values, modify to set 
        metadata = {
            "source_ip":"10.10.10.100",
            "device_type":"mobile",
            "app_name":"product_name"
        };
        var c = customer.findOne({
            "customer_id": customer_id, external_Customer_id: null
        });
        if (c) {
            
                metadata.customer_id = c.customer_id;
                var oCust = {
                "description": c.first_name + ' ' + c.last_name,
                "metadata": metadata
            };
            stripe.customers.create(oCust).then(result => {
                customer.update({customer_id : customer_id},{$set:{external_customer_id : result.id}});
                //todo: stripe does extensive loggin, if custome logging required add here
                console.log(result);
            }).catch(err => {
                //todo: stripe does extensive loggin, if custome logging required add here
                console.log(err);
            });
        }
    }
});