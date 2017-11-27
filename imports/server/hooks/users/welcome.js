import { Meteor } from 'meteor/meteor';
import { sendOneEmail } from '/imports/server/emails/send';

Meteor.users.after.insert(function(userId, doc) {
  sendOneEmail({
    usersIds: [doc._id],
    subject: 'Welcome',
    data: { user: doc },
    template: 'welcome',
  });
});
