import { Mongo } from 'meteor/mongo';
import './payment_account.html';
import { Session } from 'meteor/session';

export const payment_accounts = new Mongo.Collection('payment_accounts');

Template.payment_account.helpers({
    payment_account()
    {
        return payment_accounts.find({"customer_id":Session.get("customer_id")});
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

