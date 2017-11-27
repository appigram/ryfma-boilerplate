import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  emailCommentedPost: {
    type: Boolean,
    optional: true
  },
  emailFeaturedPost: {
    type: Boolean,
    optional: true
  },
  emailPrivateMessage: {
    type: Boolean,
    optional: true
  },
  emailMentionsMe: {
    type: Boolean,
    optional: true
  },
  subscribeToEmail: {
    type: Boolean,
    optional: true
  },
  subscribeSponsorEmail: {
    type: Boolean,
    optional: true
  },
  allowPrivateMessages: {
    type: Boolean,
    optional: true
  },
  adsFree: {
    type: Boolean,
    optional: true
  }
})
