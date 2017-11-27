import { Meteor } from 'meteor/meteor'
import Comments from '../../../../collections/Comments'
import Posts from '../../../../collections/Posts'
import Notifications from '../../../../collections/Notifications'

const insertComment = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const commentObj = {
      createdAt: new Date(),
      postedAt: new Date(),
      content: args.content,
      objectType: args.objectType,
      objectId: args.objectId,
      userId: userId
    }
    const author = Meteor.users.findOne(userId)
    const commentId = Comments.insert(commentObj)

    const text = 'commented your post'
    const notifType = args.objectType === 'post' ? 1 : 3

    // Send notification to post author
    if (args.userId !== userId) {
      const notifObj = {
        createdAt: new Date(),
        currId: userId,
        userId: args.userId,
        text: text,
        notifType: notifType,
        notifObjectId: commentId,
        objectType: args.objectType,
        objectId: args.objectId,
        objectName: args.title
      }

      Notifications.insert(notifObj)
      Meteor.users.update(
        { _id: args.userId },
        { $set: { 'profile.unreadNotifications': true } }
      )
    }

    if (args.objectType === 'post') {
      Posts.update({
        _id: args.objectId
      },
        { $inc: { commentsCount: 1 } }
      )
      Meteor.users.update(
        { _id: args.userId },
        { $inc: { 'profile.nextKarma': 1 } }
      )
      if (args.userId !== userId) {
        Meteor.users.update(
          { _id: userId },
          { $inc: { 'profile.nextKarma': 1 } }
        )
      }
    }

    return { _id: commentId, ...commentObj, author: author }
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const deleteComment = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    if (args.objectType === 'post') {
      Posts.update({
        _id: args.objectId
      },
        { $inc: { commentsCount: -1 } }
      )
      Meteor.users.update(
        { _id: args.userId },
        { $inc: { 'profile.nextKarma': -1 } }
      )
      Meteor.users.update(
        { _id: userId },
        { $inc: { 'profile.nextKarma': -1 } }
      )
      Notifications.remove({ notifType: 1, notifObjectId: args._id })
    }

    return Comments.remove({ _id: args._id })
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const updateComment = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    return Comments.update(
      { _id: args._id },
      { $set:
      {
        postedAt: new Date(),
        content: args.content,
        userId: userId
      }
      }
    )
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const markCommentAsSpam = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    Meteor.users.update(
      { _id: args.commentUserId },
      { $inc: { 'profile.nextKarma': -5 } }
    )

    Comments.update(
      { _id: args._id },
      { $inc: { spamScore: 1 }
      }
    )

    if (args.spamScore > 9) {
      if (args.objectType === 'post') {
        Posts.update({
          _id: args.objectId
        },
          { $inc: { commentsCount: -1 } }
        )
        Meteor.users.update(
          { _id: args.postUserId },
          { $inc: { 'profile.nextKarma': -1 } }
        )
      }

      return Comments.remove({ _id: args._id })
    }
    return true
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

export { insertComment, deleteComment, updateComment, markCommentAsSpam }
