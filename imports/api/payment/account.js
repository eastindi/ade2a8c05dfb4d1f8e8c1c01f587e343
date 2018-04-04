import {
    Mongo
} from 'meteor/mongo';

export const payment_accounts = new Mongo.Collection('payment_accounts');
