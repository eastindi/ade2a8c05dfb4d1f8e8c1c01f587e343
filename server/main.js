import { Meteor } from 'meteor/meteor';
import './api/payment/account.js';
import './api/payment/customer.js';
export const customer = new Mongo.Collection('customer');
export const payment_accounts = new Mongo.Collection('payment_accounts');

Meteor.startup(() => {
  //SSL('C:/data/projects/meteor/ade2a8c05dfb4d1f8e8c1c01f587e343/private/server.key','C:/data/projects/meteor/ade2a8c05dfb4d1f8e8c1c01f587e343/private/server.crt', 443);
});
