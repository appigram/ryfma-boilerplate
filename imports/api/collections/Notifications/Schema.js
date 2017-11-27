import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  /**
    The document `_id`
  */
  _id: {
    type: String
  },
  /**
    Timetstamp of notification creation
  */
  createdAt: {
    type: Date
  },
  /**
    ID of current user
  */
  currId: {
    type: String
  },
  /**
    ID of notification user
  */
  userId: {
    type: String
  },
  /**
    Notification type
    0: reserved, not used yet
    1: post_commented
    2: post_liked
  */
  notifType: {
    type: Number
  },
  /**
    Notification object Id (use to remove notification by Id)
  */
  notifObjectId: {
    type: String
  },
  /**
    Notification text
  */
  text: {
    type: String
  },
  /**
    Notification link to object type
  */
  objectType: {
    type: String
  },
  /**
    Notification link to object
  */
  objectId: {
    type: String
  },
  /**
    Notification name of an object
  */
  objectName: {
    type: String
  }
})
