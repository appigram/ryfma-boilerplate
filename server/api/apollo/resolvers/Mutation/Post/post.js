import dbCache from '/server/config/redis'
import { Meteor } from 'meteor/meteor'
import Posts from '../../../../collections/Posts'
import FestPosts from '../../../../collections/FestPosts'
import Festivals from '../../../../collections/Festivals'
import Albums from '../../../../collections/Albums'
import Notifications from '../../../../collections/Notifications'
import Comments from '../../../../collections/Comments'
import Users from '../../../../collections/Users'
import Followers from '../../../../collections/Followers'
import Videos from '../../../../collections/Videos'
import Tags from '../../../../collections/Tags'
import Promotions from '../../../../collections/Promotions'
import Certificates from '../../../../collections/Certificates'
import AudioFiles from '../../../../collections/AudioFiles'
import Schedules from '../../../../collections/Schedules'
import { Utils } from '/server/utils/serverUtils'
import REmail from '/server/emails/REmail'
import { sendPush } from '/server/config/webPush'

const AWS = require('aws-sdk')

AWS.config = new AWS.Config()

AWS.config.accessKeyId = Meteor.settings.AWSAccessKeyId
AWS.config.secretAccessKey = Meteor.settings.AWSSecretAccessKey
AWS.config.region = Meteor.settings.AWSRegion

const s3 = new AWS.S3()

const isDev = process.env.NODE_ENV === 'development'

// Common funtions

const updateUserKarma = (userId, currDate) => {
  const user = Users.find(
    { _id: userId },
    {
      fields: {
        'stats.strikePostsCount': 1,
        'profile.lastPostCreated': 1
      }
    }).fetch()[0]
  const userLastPostCreated = user.profile.lastPostCreated
  const userStrikePostsCount = user.stats.strikePostsCount
  if (userLastPostCreated && userStrikePostsCount < 30) {
    const hours = Math.abs(userLastPostCreated - currDate) / 36e5
    // User posts strike
    if (hours > 18 && hours < 30) {
      Users.update(
        { _id: userId },
        { $inc: { 'stats.strikePostsCount': 1 } }
      )
    } else if (hours > 30) { // User posts set last strike
      let userLastStrike = user.stats.strikePostsCount || 1
      if (userLastStrike > 29) {
        userLastStrike = 30
      } else if (userLastStrike > 14 && userLastStrike < 30) {
        userLastStrike = 14
      } else if (userLastStrike > 7 && userLastStrike < 14) {
        userLastStrike = 7
      } else if (userLastStrike > 2 && userLastStrike < 7) {
        userLastStrike = 2
      } else {
        userLastStrike = 1
      }
      Users.update(
        { _id: userId },
        {
          $set: { 'stats.strikePostsCount': userLastStrike }
        }
      )
    }
  }

  const newPostsCount = Posts.find({ userId: userId }, { fields: { _id: 1 } }).count()
  Users.update(
    { _id: userId },
    {
      $inc: { 'profile.nextKarma': 2 },
      $set: { 'stats.postsCount': newPostsCount, 'profile.lastPostCreated': currDate, updatedAt: currDate }
    }
  )
}

const updateUserKarmaS = (userId, karma) => {
  dbCache.del('user_' + userId)
  Users.update(
    { _id: userId },
    { $inc: { 'profile.nextKarma': karma } }
  )
}

const updateAlbumStat = (albumId, inc) => {
  dbCache.del('album_' + albumId)
  Albums.update(
    { _id: albumId },
    { $inc: { 'postCount': inc } }
  )
}

// Send notification to followers
const sendNotifsToUsers = (notifObj, userId, post) => {
  const author = Users.find(
    { _id: userId },
    {
      fields: {
        '_id': 1,
        'username': 1,
        'profile.name': 1,
        'profile.image': 1,
        'roles': 1,
        'profile.lastPostCreated': 1
      }
    }).fetch()[0]
  const options = {}
  const followers = Followers.find({ userId: userId }, options)
  followers.forEach(follower => {
    const likeText = `created new post`
    const notif = {
      ...notifObj,
      userId: follower.currId,
      text: likeText
    }
    try {
      Notifications.insert(notif)
      Users.update({ _id: follower.currId }, { $set: { 'profile.unreadNotifications': true } })
    } catch (err) {
      console.log(err)
    }
    dbCache.del('notifs_' + follower.currId)
    dbCache.del('user_' + follower.currId)

    // Get user info
    const user = Users.find({ _id: follower.currId }, {
      fields: {
        '_id': 1,
        'settings': 1,
        'emails': 1,
        'pushSubs': 1
      }
    }).fetch()[0]

    const payload = JSON.stringify({
      type: 'post',
      postId: post._id,
      postTitle: post.title,
      postExcerpt: post.excerpt.replace(/<br\s\/>/gi, '\n'),
      postLink: `https://ryfma.com/p/${post._id}/${post.slug}`,
      userId: author._id,
      userImage: author.profile.image,
      userName: author.profile.name,
      toUserId: follower.currId
    })

    // Send push notif
    // console.log('payload: ', payload)
    if (!!user.pushSubsIds && !user.disablePush && !!payload && !isDev) {
      console.log('POST CREATED WEBPUSH SENDING TO ', follower.currId)
      sendPush(null, payload, follower.currId)
    }

    // Send email for premium user
    if (author.roles.includes('premium') && author.username === 'polina') {
      try {
        const url = `https://ryfma.com/p/${post._id}/${post.slug}?utm_source=email&utm_medium=postnew&amp;utm_campaign=${post._id}&amp;utm_content=button`
        let preventSendEmail = false
        if (user.settings) {
          if (user.settings.emailUpdates) {
            preventSendEmail = !user.settings.emailUpdates
          }
        }
        if (user.emails[0].bounced) {
          preventSendEmail = !user.emails[0].bounced
        }
        if (user.emails[0].address.indexOf('@ryfma.com') > -1) {
          preventSendEmail = true
        }

        if (!preventSendEmail) {
          REmail.buildAndSend({
            vars: {
              userId: user._id,
              user: author,
              post: post,
              url: url,
              title: `Читать на Ryfma`,
              postBriefArr: post.excerpt.split('<br />'),
              postCoverImg: post.coverImg,
              emailType: 'newPosts',
              emailPreview: `Не пропусти новый пост от ${author.profile.name}! ${post.excerpt.split('<br />').join('. ')}`
            },
            template: 'newPosts',
            to: [user.emails[0].address]
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  })
}

const insertPost = (root, args, context) => {
  let { userId } = context || { userId: null }
  if (args.ownerId) { // Update by admin or another co-editor
    userId = args.ownerId
  }
  if (userId) {
    const currDate = new Date()
    if (context.user.isActionsBlocked) {
      const blockedDate = new Date(context.user.blockedTo)
      if (blockedDate < currDate) {
        throw new Meteor.Error('Action blocked [Create post]', 'Данное действие временно заблокировано. Если вы думаете, что произошла ошибка, то сообщите нам об этом.')
        return null
      }
    }

    let videoId = ''
    if (args.videoLink) {
      const video = {
        createdAt: currDate,
        updatedAt: currDate,
        title: args.title,
        slug: args.slug,
        userId: userId,
        videoLink: args.videoLink
      }
      videoId = Videos.insert(video)
    }
    const scheduledAt = args.scheduledAt ? new Date(args.scheduledAt) : null
    const post = {
      createdAt: currDate,
      postedAt: scheduledAt || currDate,
      scheduledAt: scheduledAt,
      title: args.title,
      slug: args.slug,
      seoTitle: args.seoTitle,
      htmlBody: Utils.sanitize(args.htmlBody),
      excerpt: Utils.sanitize(args.excerpt),
      paymentType: args.paymentType,
      coins: args.coins,
      status: args.status,
      sticky: args.sticky,
      userId: userId,
      coverImg: args.coverImg,
      videoLink: args.videoLink,
      videoId: videoId,
      tags: args.tags,
      albumId: args.albumId,
      isCertified: args.isCertified,
      isAdultContent: args.isAdultContent
    }

    let postId = null
    try {
      postId = Posts.insert(post)
    } catch (err) {
      console.log(err)
    }

    if (scheduledAt) {
      try {
        Schedules.insert({
          createdAt: currDate,
          scheduledAt: scheduledAt,
          userId: userId,
          objectId: postId,
          objectType: 1,
          status: 1
        })
      } catch (err) {
        console.log(err)
      }
    }

    if (args.coverImg) {
      dbCache.delPattern('posts_')
    }

    // code
    if (postId) {
      dbCache.del('user_' + userId)
      dbCache.del('user_u_' + context.user.username)

      dbCache.delPattern('posts_userId_' + userId)

      if (!scheduledAt) {
        Meteor.defer(() => {
          if (!scheduledAt) {
            const notifObj = {
              createdAt: new Date(),
              currId: userId,
              notifType: 4,
              notifObjectId: postId,
              objectType: 'post',
              objectId: postId,
              objectName: args.title
            }
            sendNotifsToUsers(notifObj, userId, post)
          }
        })
      }

      Meteor.defer(() => {
        updateUserKarma(userId, currDate)
        if (args.albumId) {
          updateAlbumStat(args.albumId, 1)
        }

        if (args.isCertified) {
          const options = {
            limit: 1,
            sort: {
              createdAt: -1
            }
          }
          const lastCert = Certificates.find({}, options).fetch()[0]

          const newUUID = parseInt(lastCert.uuid, 10) + 1

          if (newUUID) {
            const certObj = {
              createdAt: new Date(),
              uuid: newUUID,
              ownerId: userId,
              postId: postId
            }
            try {
              Certificates.insert(certObj)
            } catch (err) {
              console.log('Get Cert error for postId: ', postId)
              console.log(err)
              Posts.update(
                { _id: postId },
                { $set: { isCertified: false } }
              )
            }
          } else {
            Posts.update(
              { _id: postId },
              { $set: { isCertified: false } }
            )
          }
        }
      })

      if (args.audioFiles && args.audioFiles !== 'null') {
        if (args.audioFiles.length > 0) {
          const audioParams = JSON.parse(args.audioFiles)
          const audioFilesIds = []
          if (audioParams.length > 0) {
            audioParams.map((audio, index) => {
              if (!audio._id) {
                try {
                  const audioFilesId = AudioFiles.insert({
                    objectId: postId,
                    objectType: 'post',
                    userId: userId,
                    performer: audio.authorTitle || context.user.profile.name,
                    name: audio.audioName || audio.authorTitle,
                    url: audio.preview,
                    type: audio.audioType,
                    size: audio.audioSize,
                    duration: audio.audioDuration
                  })
                  audioFilesIds.push(audioFilesId)
                } catch (err) {
                  console.log(err)
                }
              } else {
                audioFilesIds.push(audio._id)
              }
            })

            if (audioFilesIds.length > 0) {
              // Update post audio files information
              Posts.update(
                { _id: postId },
                { $set: { audioFiles: audioFilesIds } }
              )
              Users.update(
                { _id: userId },
                { $inc: { 'stats.audioCount': audioFilesIds.length } }
              )
            }
          }
        }
      }

      return { _id: postId }
    }

    throw new Meteor.Error('post-creation-error', 'Error of creation post')
  } else {
    throw new Meteor.Error('Login required [Create post]', 'Insufficient rights for this action.')
  }
}

const updateAfterDelete = (post, userId, username, albumId) => {
  const postId = post._id

  Users.update(
    { _id: userId },
    { $inc: { 'stats.postsCount': -1, 'profile.nextKarma': -2 } }
  )

  const inFest = FestPosts.findOne({ postId: postId })
  if (inFest) {
    FestPosts.remove({ postId: postId })
    Festivals.update(
      { _id: inFest.festId },
      {
        $inc: { 'stats.usersCount': -1 },
        $pull: { 'users': userId }
      }
    )
  }

  if (post) {
    if (post.savers) {
      Users.update(
        { _id: { $in: post.savers } },
        { $inc: { 'stats.savedCount': -1 } },
        { multi: true }
      )
      post.savers.map(saverId => {
        dbCache.del('user_' + saverId)
        dbCache.del('notifs_' + saverId)
      })
    }
    if (post.albums) {
      Albums.update(
        { _id: { $in: post.albums } },
        {
          $inc: { postCount: -1 },
          $pull: { postIds: post._id }
        },
        { multi: true }
      )
      // TODO: optimize update
      const albums = Albums.find({ _id: { $in: post.albums } })
      albums.forEach(album => {
        if (album.userIds) {
          Albums.update(
            { _id: album._id },
            { $set: { usersCount: album.userIds.length } }
          )
        }
      })
    }
    Tags.update(
      { _id: { $in: post.tags } },
      { $inc: { 'count': -1 } },
      { multi: true }
    )
  }

  Comments.remove({ postId: postId })
  Notifications.remove({ objectId: postId })
  Promotions.remove({ objectId: postId })
  Videos.remove({ postId: postId })

  // Delete image from S3
  if (post.coverImg) {
    const imageToDelete = post.coverImg.replace('https://cdn.ryfma.com/', '')
    if (imageToDelete !== 'defaults/icons/default_full_avatar.jpg') {
      if (imageToDelete.indexOf(userId) > -1) {
        const params = {
          Bucket: Meteor.settings.AWSBucket,
          Delete: {
            Objects: [
              {
                Key: imageToDelete
              },
              {
                Key: imageToDelete.replace('_full_', '_middle_')
              },
              {
                Key: imageToDelete.replace('_full_', '_small_')
              }
            ]
          }
        }
        s3.deleteObjects(params, function (error, data) {
          if (error) {
            throw new Meteor.Error('S3-deleting-error', error)
          } else {
            console.log('Images deleted successfully from S3')
          }
        })
      }
    }
  }

  const audios = AudioFiles.find({ _id: { $in: post.audioFiles } }).fetch()
  // delete audios from S3
  if (audios.length > 0) {
    audios.map(audio => {
      const audioToDelete = audio.url.replace('https://s3-eu-central-1.amazonaws.com/cdn.ryfma.com/', '')
      const params = {
        Bucket: Meteor.settings.AWSBucket,
        Key: audioToDelete
      }
      s3.deleteObject(params, function (error, data) {
        if (error) {
          throw new Meteor.Error('S3-audio-deleting-error', error)
        } else {
          console.log('Audios deleted from S3')
        }
      })
    })
    AudioFiles.remove({ _id: { $in: post.audioFiles } })
    Users.update(
      { _id: userId },
      { $inc: { 'stats.audioCount': -audios.length } }
    )
  }

  Posts.remove({ _id: postId })

  dbCache.del('post_' + postId)
  dbCache.del('notifs_' + userId)
  dbCache.del('user_' + userId)
  dbCache.delPattern('comments_' + postId)
  dbCache.delPattern('posts_userId_' + userId)
  dbCache.delPattern('posts_type_latest_personal_false')
  if (username) {
    dbCache.del('user_u_' + username)
  }
}

const deletePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const currDate = new Date()
    if (context.user.isActionsBlocked) {
      const blockedDate = new Date(context.user.blockedTo)
      if (blockedDate < currDate) {
        throw new Meteor.Error('Action is blocked [Delete post]', 'Данное действие временно заблокировано. Если вы думаете, что произошла ошибка, то сообщите нам об этом.')
        return null
      }
    }

    const post = Posts.findOne(args._id)
    const isAdmin = userId === 'Qjv82jcpeJwpz6e47' || userId === 'uDco4MHxQYr2FhQLq'
    if (isAdmin) {
      updateAfterDelete(post, args.userId, args.albumId, args.username)
    } else {
      if (post.userId === userId) {
        updateAfterDelete(post, post.userId, context.user.username, args.albumId)
      }
    }
    if (args.albumId) {
      updateAlbumStat(args.albumId, -1)
    }
    dbCache.del('currUser_' + context.token)
    return true
  } else {
    throw new Meteor.Error('Login required [Delete post]', 'Insufficient rights for this action.')
  }
}

const updatePost = (root, args, context) => {
  let { userId } = context || { userId: null }
  if (args.ownerId) { // Update by admin or another co-editor
    userId = args.ownerId
  }
  if (userId) {
    let videoId = ''
    if (args.videoLink) {
      let video = {
        updatedAt: new Date(),
        title: args.title,
        slug: args.slug,
        userId: userId,
        postId: args._id,
        videoLink: args.videoLink
      }
      if (args.videoId) {
        videoId = Videos.update({
          _id: videoId
        }, {
          $set: { ...video }
        })
      } else {
        video = {
          createdAt: new Date(),
          ...video
        }
        videoId = Videos.insert(video)
      }
    }
    const postBefore = Posts.findOne({ _id: args._id })
    const scheduledAt = args.scheduledAt ? new Date(args.scheduledAt) : null
    let postUpdated = null
    try {
      postUpdated = Posts.update(
        { _id: args._id },
        {
          $set:
          {
            postedAt: new Date(),
            scheduledAt: scheduledAt,
            title: args.title,
            slug: args.slug,
            seoTitle: args.seoTitle,
            htmlBody: Utils.sanitize(args.htmlBody),
            excerpt: Utils.sanitize(args.excerpt),
            paymentType: args.paymentType,
            coins: args.coins,
            status: args.status,
            sticky: args.sticky,
            userId: userId,
            coverImg: args.coverImg,
            videoLink: args.videoLink,
            videoId: videoId,
            tags: args.tags,
            albumId: args.albumId,
            isCertified: args.isCertified,
            isAdultContent: args.isAdultContent
          }
        }
      )
    } catch (err) {
      console.log(err)
    }

    dbCache.del('user_' + userId)
    dbCache.del('user_u_' + context.user.username)
    dbCache.del('currUser_' + context.token)

    dbCache.del('post_' + args._id)
    dbCache.delPattern('posts_userId_' + userId)

    if (postUpdated && (args.albumId !== args.oldAlbumId)) {
      Meteor.defer(() => {
        updateAlbumStat(args.oldAlbumId, -1)
        updateAlbumStat(args.albumId, 1)
      })
    }

    if (postUpdated) {
      Meteor.defer(() => {
        if (scheduledAt) {
          Schedules.remove({ objectId: args._id, userId: userId })
          Schedules.insert({
            createdAt: new Date(),
            scheduledAt: scheduledAt,
            userId: userId,
            objectId: args._id,
            objectType: 1,
            status: 1
          })
        }
        if (args.isCertified && !postBefore.isCertified) {
          const certExists = Certificates.findOne({ postId: args._id })
          if (!certExists) {
            const options = {
              limit: 1,
              sort: {
                createdAt: -1
              }
            }
            const lastCert = Certificates.find({}, options).fetch()[0]

            const newUUID = parseInt(lastCert.uuid, 10) + 1

            const certObj = {
              createdAt: new Date(),
              uuid: newUUID,
              ownerId: userId,
              postId: args._id
            }
            try {
              Certificates.insert(certObj)
            } catch (err) {
              console.log(err)
            }
          }
        }
      })

      if (args.audioFiles && args.audioFiles !== 'null') {
        if (args.audioFiles.length > 0) {
          const audioParams = JSON.parse(args.audioFiles)
          const audioFilesIds = []
          if (audioParams) {
            audioParams.map((audio, index) => {
              if (!audio._id) {
                try {
                  const audioFilesId = AudioFiles.insert({
                    objectId: args._id,
                    objectType: 'post',
                    userId: userId,
                    performer: audio.authorTitle || context.user.profile.name,
                    name: audio.audioName || audio.authorTitle,
                    url: audio.preview,
                    type: audio.audioType,
                    size: audio.audioSize,
                    duration: audio.audioDuration
                  })
                  audioFilesIds.push(audioFilesId)
                } catch (err) {
                  console.log(err)
                }
              } else {
                audioFilesIds.push(audio._id)
              }
            })

            // Update post audio files information
            if (audioFilesIds.length > 0) {
              Posts.update(
                { _id: args._id },
                { $set: { audioFiles: audioFilesIds } }
              )
            }
            const audiosCount = AudioFiles.find({ userId: userId }).count()
            if (audiosCount) {
              Users.update(
                { _id: userId },
                { $set: { 'stats.audioCount': audiosCount } }
              )
            }
          }
        }
      }
    }

    return postUpdated
  } else {
    throw new Meteor.Error('Login required [Update post]', 'Insufficient rights for this action.')
  }
}

const increasePostViewCount = (root, args, context) => {
  // let { userId } = context || { userId: null }
  if (args.status === 2) {
    // TODO: for test now
    const viewCount = Math.floor(Math.random() * 7) + 1
    return Posts.update(
      { _id: args._id },
      { $inc: { viewCount: viewCount } }
    )
  }
  return false
}

const sendLikeNotification = (notifObj, userId) => {
  dbCache.del('notifs_' + userId)
  dbCache.del('user_' + userId)
  Notifications.insert(notifObj)
  Users.update({ _id: userId }, { $set: { 'profile.unreadNotifications': true }, $inc: { 'profile.nextKarma': 1 } })
}

const updateLikeFest = (fests, postId, post, likes, userId) => {
  // update festPost collection
  const currDate = new Date()
  const inFests = Festivals.find({
    _id: { $in: fests },
    $or: [
      { toDate: { $gte: currDate }, status: 2 },
      { isDuel: true, status: 2 }
    ]
  }, { fields: { _id: 1, slug: 1, isDuel: 1 } }).fetch()

  dbCache.del('post_' + postId)
  // console.log('inFests: ', inFests)
  if (inFests.length > 0) {
    inFests.map(fest => {
      const festPost = FestPosts.findOne({
        festId: fest._id,
        postId: postId
      }, { fields: { _id: 1, likers: 1 } })
      let totalFestPostLikes = likes
      if (post.likers) {
        for (let j = 0; j < post.likers.length; j++) {
          if (post.likers[j].userId) {
            if (festPost.likers) {
              for (let k = 0; k < festPost.likers.length; k++) {
                if ((festPost.likers[k] === post.likers[j].userId) && (post.userId !== festPost.likers[k])) {
                  if (festPost.likers[k] !== userId) {
                    totalFestPostLikes += post.likers[j].likes
                  }
                }
              }
            }
          } else {
            if (festPost.likers) {
              for (let k = 0; k < festPost.likers.length; k++) {
                if ((festPost.likers[k] === post.likers[j].userId) && (post.userId !== festPost.likers[k])) {
                  if (festPost.likers[k] !== userId) {
                    totalFestPostLikes += 1
                  }
                }
              }
            }
          }
        }
      }

      // console.log('totalFestPostLikes: ', totalFestPostLikes)
      FestPosts.update(
        {
          festId: fest._id,
          postId: postId
        },
        { $set: { 'likeCount': totalFestPostLikes }, $addToSet: { likers: userId } }
      )
      dbCache.delPattern('festposts_festId_' + fest._id)
      dbCache.del('fest_by_slug_' + fest.slug)
      dbCache.del('fest_by_id_' + fest._id)
      if (fest.isDuel) {
        dbCache.del('fest_by_id_' + fest._id + '_isDuel_' + fest.isDuel)
      }
    })
  }
}

const likePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    // Query optimization
    const options = {}
    options.fields = {
      _id: 1,
      likers: 1,
      userId: 1,
      fests: 1
    }
    const post = Posts.findOne({ _id: args._id }, options)
    if (args.userId !== userId && post) {
      if (post.likers) {
        const liker = post.likers.find(user => user.userId === userId)
        if (liker) {
          if (liker.likes > 49) {
            return true
          }
        }
      }

      Meteor.defer(() => {
        const likeText = `liked your post`
        const notifObj = {
          createdAt: new Date(),
          currId: userId,
          userId: args.userId,
          text: likeText,
          notifType: 2,
          notifObjectId: args._id,
          objectType: 'post',
          objectId: args._id,
          objectName: args.title
        }

        sendLikeNotification(notifObj, args.userId)
      })
    }

    const likesReq = Math.abs(parseInt(args.totalLikes, 10)) || 0
    const likes = likesReq > 50 ? 50 : likesReq
    let totalLikes = likes

    if (post.likers) {
      for (let i = 0; i < post.likers.length; i++) {
        if (post.likers[i].userId !== userId) {
          totalLikes += post.likers[i].likes // TODO: fallback for old likes, where no userId and likes params exists
        }
      }
    }

    // If user not in likers
    const newLikesAdded = Posts.update(
      {
        _id: args._id,
        'likers': {
          $not: {
            $elemMatch: {
              'userId': userId
            }
          }
        }
      },
      {
        $set: { likeCount: totalLikes },
        $addToSet: { likers: { userId: userId, likes: likes } }
      }
    )

    let addToCurrentLikes = 0
    if (!newLikesAdded) {
      // If user in likers already
      addToCurrentLikes = Posts.update(
        {
          _id: args._id,
          'likers.userId': userId
        },
        {
          $set: { likeCount: totalLikes, 'likers.$.likes': likes }
        }
      )
    }

    if ((newLikesAdded || addToCurrentLikes) && args.userId !== userId && !!post) {
      updateLikeFest(post.fests, args._id, post, likes, userId)
    }
    dbCache.del('post_' + args._id)
    return true
  }

  throw new Meteor.Error('Войдите в свой аккаунт [Like post]', 'Создайте или войдите в свой аккаунт, чтобы ставить лайки.')
}

const unLikePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const likes = parseInt(args.likes, 10)
    const decLikes = likes > 50 ? 50 : likes
    const post = Posts.findOne({ _id: args._id }, { _id: 1, likeCount: 1, fests: 1 })
    let newLikeCount = post.likeCount - decLikes
    if (newLikeCount < 0) {
      newLikeCount = 0
    }
    const postUpdated = Posts.update(
      { _id: args._id },
      { $set: { likeCount: newLikeCount }, $pull: { 'likers': { userId: userId } } }
    )

    if (args.userId !== userId) {
      Meteor.defer(() => {
        updateUserKarmaS(args.userId, -1)
        Notifications.remove({
          currId: userId,
          userId: args.userId,
          objectType: 'post',
          objectId: args._id
        })
        if (post.fests) {
          const festPosts = FestPosts.find({ postId: args._id }, { _id: 1, festId: 1, likeCount: 1 })
          festPosts.forEach(festPost => {
            let newFestLikeCount = festPost.likeCount - decLikes
            if (newFestLikeCount < 0) {
              newFestLikeCount = 0
            }
            FestPosts.update(
              { postId: args._id },
              { $set: { likeCount: newFestLikeCount }, $pull: { likers: userId } }
            )
            dbCache.delPattern('festposts_festId_' + festPost.festId)
            dbCache.delPattern('fest_by_id_' + festPost.festId)
          })
        }
      })
    }

    dbCache.del('post_' + args._id)
    return postUpdated
  }
  throw new Meteor.Error('Login required [Unlike post]', 'Insufficient rights for this action.')
}

const savePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    // Query optimization
    const options = {}
    options.fields = {
      _id: 1,
      userId: 1,
      'albums': 1
    }
    const post = Posts.findOne({ _id: args._id }, options)
    if (post.albums) {
      let alreadyInAlbums = 0
      post.albums.some(elem => {
        if (args.albums.includes(elem)) {
          alreadyInAlbums += 1
        }
      })
      if (alreadyInAlbums === args.albums.length) {
        return true
      }
    }

    const albumsUpdated = Albums.update(
      { _id: { $in: args.albums } },
      {
        $inc: { postCount: 1 },
        $set: { updatedAt: new Date() },
        $addToSet: { postIds: args._id, userIds: post.userId }
      },
      { multi: true }
    )

    const postSaved = Posts.update(
      { _id: args._id },
      {
        $addToSet: { savers: userId, albums: { $each: args.albums } },
      }
    )

    if (args.festPostId) {
      FestPosts.update(
        { _id: args.festPostId },
        { $addToSet: { 'favourites': userId } }
      )
    }

    Users.update(
      { _id: userId },
      { $inc: { 'stats.savedCount': 1 } }
    )

    // Update usersCount
    Meteor.defer(() => {
      const albums = Albums.find({ _id: { $in: args.albums } }, { $fields: { _id: 1, userIds: 1 } })
      albums.forEach(album => {
        if (album.userIds) {
          Albums.update(
            { _id: album._id },
            { $set: { usersCount: album.userIds.length } }
          )
          dbCache.delPattern('albumId_' + album._id)
        }
      })

      const updatePost = Posts.findOne({ _id: args._id }, { $fields: { _id: 1, savers: 1 } })
      Posts.update(
        { _id: updatePost._id },
        {
          $set: { savedCount: updatePost.savers.length },
        }
      )
    })

    if (args.userId !== userId) {
      Meteor.defer(() => {
        updateUserKarmaS(args.userId, 2)
      })
    }

    dbCache.del('user_' + userId)
    dbCache.del('post_' + args._id)
    dbCache.delPattern('userSavedPosts_userId_' + userId)

    return postSaved
  }
  throw new Meteor.Error('Войдите в свой аккаунт [Save post]', 'Создайте или войдите в свой аккаунт, чтобы добавлять в избранное.')
}

const unSavePost = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    if (args.userId !== userId) {
      Meteor.defer(() => {
        updateUserKarmaS(args.userId, -2)
      })
    }

    const albumsUpdated = Albums.update(
      { _id: { $in: args.albums } },
      {
        $inc: { postCount: -1 },
        $set: { updatedAt: new Date() },
        $pull: { postIds: args._id }
      },
      { multi: true }
    )

    const postUnsaved = Posts.update(
      { _id: args._id },
      {
        $pull: { savers: userId, albums: { $in: args.albums } }
      }
    )
    if (args.festPostId) {
      FestPosts.update(
        { _id: args.festPostId },
        { $pull: { 'favourites': userId } }
      )
    }

    Users.update(
      { _id: userId },
      { $inc: { 'stats.savedCount': -1 } }
    )

    // Update usersCount
    Meteor.defer(() => {
      const albums = Albums.find({ _id: { $in: args.albums } })
      albums.forEach(album => {
        if (album.userIds) {
          Albums.update(
            { _id: album._id },
            { $set: { usersCount: album.userIds.length } }
          )
          dbCache.delPattern('albumId_' + album._id)
        }
      })

      const updatePost = Posts.findOne({ _id: args._id }, { $fields: { _id: 1, savers: 1 } })
      Posts.update(
        { _id: updatePost._id },
        {
          $set: { savedCount: updatePost.savers.length },
        }
      )
    })

    dbCache.del('user_' + userId)
    dbCache.del('post_' + args._id)
    dbCache.delPattern('userSavedPosts_userId_' + userId)

    return postUnsaved
  }
  throw new Meteor.Error('Login required [Unsave post]', 'Insufficient rights for this action.')
}

const removeVideo = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    return Videos.remove(args._id)
  } else {
    throw new Meteor.Error('Login required [Delete video]', 'Insufficient rights for this action.')
  }
}

const setEditorsPick = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    Meteor.defer(() => {
      dbCache.del('user_' + args.userId)
      dbCache.del('post_' + args.postId)
      updateUserKarmaS(args.userId, 10)
    })

    const postPicked = Posts.update(
      { _id: args._id },
      { $set: { isEditorsPick: true } }
    )

    return postPicked
  }
  throw new Meteor.Error('Войдите в свой аккаунт [setEditorsPick]', 'Создайте или войдите в свой аккаунт, чтобы добавлять в избранное.')
}

const unsetEditorsPick = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    Meteor.defer(() => {
      updateUserKarmaS(args.userId, -10)
    })

    const postUnPicked = Posts.update(
      { _id: args._id },
      { $set: { isEditorsPick: false } }
    )

    return postUnPicked
  }
  throw new Meteor.Error('Login required [Unsave post]', 'Insufficient rights for this action.')
}

export { insertPost, deletePost, updatePost, increasePostViewCount, likePost, unLikePost, savePost, unSavePost, removeVideo, sendNotifsToUsers, setEditorsPick, unsetEditorsPick }
