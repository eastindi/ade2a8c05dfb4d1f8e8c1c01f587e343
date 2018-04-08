import {
    Template
} from 'meteor/templating';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';
import './views/payment/payment_account.js';
import { error } from 'util';

Template.customer_create.events({
    'click #btn_customer_create': function () {
        Meteor.call('createStripeCustomer', document.getElementById("opt_customer").value);
    }
});

Template.login.events({
    'change #opt_customer':function()
    {
        Session.set("customer_id", document.getElementById("opt_customer").value);
    }
});

Template.login.onRendered(function () {
       Session.set("customer_id", document.getElementById("opt_customer").value);
});