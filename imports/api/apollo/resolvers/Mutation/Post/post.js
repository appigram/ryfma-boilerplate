import { Meteor } from 'meteor/meteor'
import Posts from '../../../../collections/Posts'
import Notifications from '../../../../collections/Notifications'
import Comments from '../../../../collections/Comments'
import { Utils } from '../../../../../modules/serverUtils'

const insertPost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const currDate = new Date()
    const postId = Posts.insert(
      {
        createdAt: currDate,
        postedAt: currDate,
        title: args.title,
        slug: args.slug,
        htmlBody: Utils.sanitize(args.htmlBody),
        excerpt: Utils.sanitize(args.excerpt),
        status: args.status,
        sticky: args.sticky,
        userId: userId,
        coverImg: args.coverImg,
        tags: args.tags
      }
    )
    if (postId) {
      const user = Meteor.users.find({ _id: userId }, { fields: { 'profile.lastPostCreated': 1 } }).fetch()[0]
      const userLastPostCreated = user.profile.lastPostCreated
      if (!userLastPostCreated) {
        const hours = Math.abs(userLastPostCreated - currDate) / 36e5

        // User posts strike
        if (hours > 24 && hours < 36) {
          Meteor.users.update(
            { _id: userId },
            { $inc: { 'stats.strikePostsCount': 1 },
              $set: { 'profile.lastPostCreated': currDate }
            }
          )
        }
        // User posts strike remove
        else if (hours > 36) {
          Meteor.users.update(
            { _id: userId },
            {
              $set: { 'stats.strikePostsCount': 0, 'profile.lastPostCreated': currDate }
            }
          )
        } else {
          Meteor.users.update(
            { _id: userId },
            { $inc: { 'stats.postsCount': 1, 'profile.nextKarma': 2 },
              $set: { 'stats.strikePostsCount': 0, 'profile.lastPostCreated': currDate }
            }
          )
        }
      } else {
        Meteor.users.update(
          { _id: userId },
          { $inc: { 'stats.postsCount': 1, 'profile.nextKarma': 2 },
            $set: { 'stats.strikePostsCount': 0, 'profile.lastPostCreated': currDate }
          }
        )
      }
      return { _id: postId }
    }

    throw new Meteor.Error('post-creation-error', 'Error of creation post')
  } else {
    throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
  }
}

const deletePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const removed = Posts.remove({ _id: args._id })
    if (removed) {
      Meteor.users.update(
        { _id: userId },
        { $inc: { 'stats.postsCount': -1, 'profile.nextKarma': -2 } }
      )
      Comments.remove({ postId: args._id })
      Notifications.remove({ objectId: args._id })
      return true
    }

    throw new Meteor.Error('post-deletion-error', 'Error of deleting post')
  } else {
    throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
  }
}

const updatePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const postUpdated = Posts.update(
      { _id: args._id },
      { $set:
      {
        postedAt: new Date(),
        title: args.title,
        slug: args.slug,
        htmlBody: Utils.sanitize(args.htmlBody),
        excerpt: Utils.sanitize(args.excerpt),
        status: args.status,
        sticky: args.sticky,
        userId: userId,
        coverImg: args.coverImg,
        tags: args.tags
      }
      }
    )

    return postUpdated
  } else {
    throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
  }
}

const increasePostViewCount = (root, args, context) => {
  return Posts.update(
    { _id: args._id },
    { $inc: { viewCount: 1 } }
  )
}

const likePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    if (args.userId !== userId) {
      const notifObj = {
        createdAt: new Date(),
        currId: userId,
        userId: args.userId,
        text: 'liked your post',
        notifType: 2,
        notifObjectId: args._id,
        objectType: 'post',
        objectId: args._id,
        objectName: args.title
      }

      Notifications.insert(notifObj)

      Meteor.users.update({ _id: args.userId }, { $set: { 'profile.unreadNotifications': true }, $inc: { 'profile.nextKarma': 1 } })
    }

    return Posts.update(
      { _id: args._id },
      { $inc: { likeCount: 1 }, $push: { likers: userId } }
    )
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const unLikePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    if (args.userId !== userId) {
      Meteor.users.update(
        { _id: args.userId },
        { $inc: { 'profile.nextKarma': -1 } }
      )
    }
    return Posts.update(
      { _id: args._id },
      { $inc: { likeCount: -1 }, $pull: { likers: userId } }
    )
  }
  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const savePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    Meteor.users.update(
      { _id: userId },
      { $inc: { 'stats.savedCount': 1 }, $push: { 'profile.saved': args._id } }
    )

    if (args.userId !== userId) {
      Meteor.users.update(
        { _id: args.userId },
        { $inc: { 'profile.nextKarma': 2 } }
      )
    }

    return Posts.update(
      { _id: args._id },
      { $inc: { savedCount: 1 }, $push: { savers: userId } }
    )
  }
  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const unSavePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    Meteor.users.update(
      { _id: userId },
      { $inc: { 'stats.savedCount': -1 }, $pull: { 'profile.saved': args._id } }
    )

    if (args.userId !== userId) {
      Meteor.users.update(
        { _id: args.userId },
        { $inc: { 'profile.nextKarma': -2 } }
      )
    }

    return Posts.update(
      { _id: args._id },
      { $inc: { savedCount: -1 }, $pull: { savers: userId } }
    )
  }
  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

export { insertPost, deletePost, updatePost, increasePostViewCount, likePost, unLikePost, savePost, unSavePost }
