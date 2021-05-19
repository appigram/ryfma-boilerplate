import dbCache from '/server/config/redis'
import { Meteor } from 'meteor/meteor'
import Posts from '../../../../collections/Posts'
import Users from '../../../../collections/Users'
import FestPosts from '../../../../collections/FestPosts'

const getPost = async (root, { postId, noCache }, context, { cacheControl }) => {
  // if the post is not exists throw an error
  if (!postId) {
    return null
  }
  if (!noCache) {
    const getPost = await dbCache.get('post_' + postId)
    if (getPost) {
      return getPost
    }
  }

  const post = Posts.findOne({ _id: postId })
  if (post) {
    dbCache.set('post_' + postId, post)
  }
  return post
}

const getPostLikers = (root, args, context, { cacheControl }) => {
  if (!args.postId) {
    return []
  }
  // if the user is not logged in throw an error
  const post = Posts.findOne({ _id: args.postId }, { fields: { likers: 1 } })
  let festPost = null
  if (args.festId) {
    festPost = FestPosts.findOne({ festId: args.festId, postId: args.postId }, { fields: { likers: 1 } })
  }

  if (!post) {
    return null
  }
  // get users who current user is following
  const options = {}
  const fields = {}
  options.limit = 30 // Set post limit to 30
  options.skip = 0

  if (args.skip) {
    options.skip = args.skip
  }

  if (args.limit) {
    options.limit = args.limit
  }

  // Query optimization
  if (context.userId && context.userId === 'Qjv82jcpeJwpz6e47' || context.userId === 'uDco4MHxQYr2FhQLq') {
    options.fields = {
      _id: 1,
      createdAt: 1,
      username: 1,
      roles: 1,
      coins: 1,
      'emails.address': 1,
      'emails.verified': 1,
      'profile.name': 1,
      'profile.karma': 1,
      'profile.image': 1,
      'profile.gender': 1,
      'profile.city': 1,
      'profile.lastLogin': 1,
      'stats.postsCount': 1,
      'stats.followingCount': 1,
      'stats.followersCount': 1,
      'stats.booksCount': 1,
      'stats.bookshelvesCount': 1
    }
  } else {
    options.fields = {
      _id: 1,
      roles: 1,
      username: 1,
      'profile.name': 1,
      'profile.bio': 1,
      'profile.image': 1
    }
  }

  if (post.likers) {
    const likers = post.likers
    const likersIds = post.likers.map(u => u.userId)

    if (args.festId && festPost) {
      const festLikersIds = festPost.likers
      if (festLikersIds) {
        if (festLikersIds.length > 0) {
          fields._id = {
            $in: festLikersIds
          }
          const result = []
          const users = Users.find(fields, options).fetch()
          for (let i = 0; i < likers.length; i++) {
            for (let j = 0; j < users.length; j++) {
              if (users[j]._id === likers[i].userId) {
                result.push({
                  ...users[j],
                  likes: likers[i].likes
                })
              }
            }
          }
          return result
        }
      }
    } else {
      if (likers.length > 0) {
        fields._id = {
          $in: likersIds
        }
        const result = []
        const users = Meteor.users.find(fields, options).fetch()
        for (let i = 0; i < likers.length; i++) {
          for (let j = 0; j < users.length; j++) {
            if (users[j]._id === likers[i].userId) {
              result.push({
                ...users[j],
                likes: likers[i].likes
              })
            }
          }
        }
        return result
      }
    }
  }

  return []
}

export { getPost, getPostLikers }
