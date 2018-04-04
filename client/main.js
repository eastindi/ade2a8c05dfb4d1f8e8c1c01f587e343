import {
    Template
} from 'meteor/templating';
import {
    ReactiveVar
} from 'meteor/reactive-var';

import './main.html';
import './views/payment/payment_account.js';
import { error } from 'util';

Template.customer_create.events({
    'click #btn_customer_create': function () {
    Meteor.call('createStripeCustomer', document.getElementById("opt_customer").value);
    }
});