import { Meteor } from 'meteor/meteor'
import Users from '../api/collections/Users'
import Posts from '../api/collections/Posts'
import Notifications from '../api/collections/Notifications'
import Followers from '../api/collections/Followers'
import Comments from '../api/collections/Comments'
import Tags from '../api/collections/Tags'

// DROP INDEXES
const dropAllIndexes = () => {
  Posts.rawCollection().dropIndexes()
  Followers.rawCollection().dropIndexes()
  Comments.rawCollection().dropIndexes()
  Notifications.rawCollection().dropIndexes()
}

Meteor.startup(function () {
  // dropAllIndexes();

  // CREATE INDEXES
  Users._ensureIndex({
    'username': 1
  })
  Users._ensureIndex({
    'profile.name': 1
  })

  Posts._ensureIndex({
    'userId': 1
  })
  Posts._ensureIndex({
    'createdAt': -1
  })
  Posts._ensureIndex({
    'tags': 1,
    'likeCount': -1,
    'createdAt': 1
  })

  Followers._ensureIndex({
    'currId': 1
  })
  Followers._ensureIndex({
    'userId': 1
  })

  Comments._ensureIndex({
    'objectId': 1
  })
  Comments._ensureIndex({
    'userId': 1
  })

  Notifications._ensureIndex({
    'currId': 1
  })
  Notifications._ensureIndex({
    'userId': 1
  })
  Notifications._ensureIndex({
    'notifObjectId': 1
  })
  Notifications._ensureIndex({
    'objectId': 1
  })
  Tags._ensureIndex({
    'createdAt': -1
  })
})
