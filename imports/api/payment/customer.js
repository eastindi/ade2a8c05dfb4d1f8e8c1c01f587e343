import {
    Mongo
} from 'meteor/mongo';
const stripe = require('stripe')(
    "pk_test_TJFaB69TR2WVrffSYUegAFUY"
  );
export const customer = new Mongo.Collection('customer');

export function create(customer_id, callback) {
    var c = customer.findOne({"customer_id":customer_id});
    if (c)
    {
        var oCust = {
            "description": c.first_name + ' ' + c.last_name ,
            "metadata": {"customer_id":c.customer_id} 
          };
        console.log(JSON.stringify(oCust));
        // stripe.customers.create(oCust, function(err, custData)
        // {
        //     if (err) throw new Error("Error creating strioe customer: " + err);
        //     console.log(JSON.stringify(custData));
        //     return callback(null, custData);
        // });
        
    }
}
