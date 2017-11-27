import { Meteor } from 'meteor/meteor'
import Posts from '../../../../collections/Posts'

const getPost = (root, { postId }, context) => {
  // if the post is not exists throw an error
  if (!postId) {
    throw new Error('Unknown Post Id')
  }
  const post = Posts.findOne({ _id: postId })

  return post || null
}

const getPostLikers = (root, { postId, skip, limit }, context) => {
  if (!postId) {
    throw new Meteor.Error('PostId not found')
  }
  // if the user is not logged in throw an error
  const post = Posts.find({ _id: postId }, {fields: { likers: 1 }}).fetch()
  if (!post) {
    throw new Meteor.Error('Post not found')
  }
  // get users who current user is following
  const options = {}
  const fields = {}
  options.limit = 50 // Set post limit to 50
  options.skip = 0

  if (skip) {
    options.skip = skip
  }

  if (limit) {
    options.limit = limit
  }

  // Query optimization
  options.fields = {
    _id: 1,
    roles: 1,
    username: 1,
    'profile.name': 1,
    'profile.bio': 1,
    'profile.image': 1
  }

  if (post[0].likers) {
    if (post[0].likers.length > 0) {
      fields._id = {
        $in: post[0].likers
      }
      return Meteor.users.find(fields, options).fetch()
    }
  }

  return []
}

export { getPost, getPostLikers }
