import { Mongo } from 'meteor/mongo';
 
export const paymentAccounts = new Mongo.Collection('payment_account');