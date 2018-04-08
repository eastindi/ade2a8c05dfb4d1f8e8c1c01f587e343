import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

export const payment_log = new Mongo.Collection('payment_log');

Template.payment_log.helpers({
    payment_log()
    {
        console.log(payment_log.find({"customer_id":Session.get("customer_id")}));
        return payment_log.find({"customer_id":Session.get("customer_id")});
    },
});
