import { Mongo } from 'meteor/mongo';
import './payment_account.html';

Template.payment_account.helpers({
    payment_account()
    {
        return payment_accounts.find({});
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

