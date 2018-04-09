import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

export const payment_log = new Mongo.Collection('payment_log');

Template.payment_log.helpers({
    payment_log()
    {
        console.log(payment_log.find({"customer_id":Session.get("customer_id")}));
        return payment_log.find({"customer_id":Session.get("customer_id")});
    },
    amount:function(amount)
    {
        return amount/100;
    },
    createddt:function(date)
    {
        return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + ' ' + date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    }
});
