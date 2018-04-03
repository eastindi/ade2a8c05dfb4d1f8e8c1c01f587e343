import { paymentAccounts } from '../../../imports/api/payment_account.js';
Template.payment_account.helpers({
    payment_account()
    {
        var c  = paymentAccounts.find({});
        console.log(JSON.stringify(c));
        return c;
    }
});
function ToggleShow(divname) {
    alert(divname);
    var x = document.getElementById(divname);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

