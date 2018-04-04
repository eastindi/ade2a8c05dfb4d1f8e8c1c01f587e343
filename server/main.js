import { Meteor } from 'meteor/meteor';
import '../imports/api/payment/account.js';
import '../imports/api/payment/customer.js';
Meteor.startup(() => {
  //SSL('C:/data/projects/meteor/ade2a8c05dfb4d1f8e8c1c01f587e343/private/server.key','C:/data/projects/meteor/ade2a8c05dfb4d1f8e8c1c01f587e343/private/server.crt', 443);
});
