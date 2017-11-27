import { Meteor } from 'meteor/meteor'
import Followers from '../../../../collections/Followers'
import Posts from '../../../../collections/Posts'

const getUser = (root, { username }, context) => {
  // if the user is not logged in throw an error
  if (!username) {
    throw new Meteor.Error('Unknown User')
  }
  // find the user using the username from the context
  const user = Meteor.users.findOne({ username: username })
  if (user) {
    return user
  } else {
    throw new Meteor.Error('Unknown User')
  }
}

const getFollowing = (root, { username, skip, limit }, context) => {
  // if the user is not logged in throw an error
  if (!username) {
    throw new Meteor.Error('Unknown Username')
  }
  const userId = Meteor.users.findOne({ username: username })._id
  if (!userId) {
    throw new Meteor.Error('Unknown User')
  }
  // get users who current user is following
  const options = {}
  options.limit = 50 // Set post limit to 50
  options.skip = 0
  options.sort = {
    followedAt: -1 // Sorted by createdAt descending
  }

  if (skip) {
    options.skip = skip
  }

  if (limit) {
    options.limit = limit
  }
  const followingItems = Followers.find({ currId: userId }, options).fetch()
  const followingIds = followingItems.map(item => item.userId)
  // Query optimization
  const optionsUser = {}
  optionsUser.fields = {
    _id: 1,
    username: 1,
    roles: 1,
    emails: 1,
    'profile.name': 1,
    'profile.bio': 1,
    'profile.image': 1
  }

  return Meteor.users.find({ '_id': { $in: followingIds } }, optionsUser).fetch()
}

const getFollowers = (root, { username, skip, limit }, context) => {
  // if the user is not logged in throw an error
  if (!username) {
    throw new Meteor.Error('Unknown Username')
  }
  const userId = Meteor.users.findOne({ username: username })._id
  if (!userId) {
    throw new Meteor.Error('Unknown User')
  }
  // get user followers
  const options = {}
  options.limit = 50 // Set post limit to 50
  options.skip = 0
  options.sort = {
    followedAt: -1 // Sorted by createdAt descending
  }

  if (skip) {
    options.skip = skip
  }

  if (limit) {
    options.limit = limit
  }
  const followersItems = Followers.find({ userId: userId }, options).fetch()
  const followersIds = followersItems.map(item => item.currId)
  // Query optimization
  const optionsUser = {}
  optionsUser.fields = {
    _id: 1,
    username: 1,
    roles: 1,
    'profile.name': 1,
    'profile.bio': 1,
    'profile.image': 1
  }
  return Meteor.users.find({ '_id': { $in: followersIds } }, optionsUser).fetch()
}

const getSaved = (root, { userId, saved, sortType, skip, limit }, context) => {
  // if the user is not logged in throw an error
  if (!userId) {
    throw new Meteor.Error('Unknown User')
  }
  const user = Meteor.users.findOne({ '_id': userId })
  // get user saved posts
  if (user.profile.saved) {
    const options = {}
    options.limit = 50 // Set post limit to 50
    options.skip = 0
    options.sort = {
      createdAt: -1 // Sorted by createdAt descending
    }

    if (sortType === 'popular') {
      options.sort = {
        likeCount: -1 // Sorted by likesCount descending
      }
    } else if (sortType === 'viewed') {
      options.sort = {
        viewCount: -1 // Sorted by viewCount descending
      }
    } else if (sortType === 'commented') {
      options.sort = {
        commentCount: -1 // Sorted by commentCount descending
      }
    }

    if (skip) {
      if (skip < 0) {
        options.skip = 0
      } else {
        options.skip = skip
      }
    }

    if (limit) {
      if (limit > 100) {
        options.limit = 100
      } else if (limit < 0) {
        options.limit = 10
      } else {
        options.limit = limit
      }
    }

    return Posts.find({ _id: { $in: user.profile.saved } }, options).fetch()
  }

  return []
}

export { getUser, getFollowing, getFollowers, getSaved }
