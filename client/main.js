import {
    Template
} from 'meteor/templating';
import {
    ReactiveVar
} from 'meteor/reactive-var';

import './main.html';
import './views/payment/payment_account.js';

// Template.body.helpers({
//     customer_create() {
//         var cid = document.getElementById("opt_customer").value;
//         alert(cid);
//    }
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

Template.customer_create.events({
    'click #btn_customer_create': function () {
        var cust = require('../imports/api/payment/customer.js');
        var c = cust.create(document.getElementById("opt_customer").value);
    }
});