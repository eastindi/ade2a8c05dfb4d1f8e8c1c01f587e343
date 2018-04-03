import { Mongo } from 'meteor/mongo';
import { Payment_account } from '../../../imports/api/payment_account.js';

Template.payment_account.helpers({
    payment_account()
    {
        console.log(JSON.stringify(Payment_account.find({}).length));
        //return Payment_account.find({});
        return [{"name":"sanjay","account_details":{"last4":3433}},{"name":"sanjay1","account_details":{"last4":3434}},{"name":"sanjay2","account_details":{"last4":3435}},{"name":"sanjay3","account_details":{"last4":3436}}]
    },
});

function ToggleShow(divname) {
    var x = document.getElementById(divname);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

