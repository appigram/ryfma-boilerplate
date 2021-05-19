import { Meteor } from 'meteor/meteor'
import { SyncedCron } from 'meteor/appigram:synced-cron'
import fs from 'fs'
import request from 'request'
import UserAgent from 'user-agents'

import Mailgun from '/server/emails/mailgun'

// import { generateSitemap } from '../seo/sitemapXml'
// import { generateTurboFeedXML } from '../seo/turboRSSXML'
import { generateTurboXML } from '../seo/turboAPIXML'
import dbCache from '/server/config/redis'
// import Billing from '/server/payments/billing'
import REmail from '/server/emails/REmail'
// import { findBots } from '../botsCleanUp'
import { sendNotifsToUsers } from '/server/api/apollo/resolvers/Mutation/Post/post'

// Collections
import FestPosts from '/server/api/collections/FestPosts'
import Cards from '/server/api/collections/Cards'
// import Albums from '/server/api/collections/Albums'
// import Asks from '/server/api/collections/Asks'
// import Events from '/server/api/collections/Events'
// import Books from '/server/api/collections/Books'
// import Comments from '/server/api/collections/Comments'
import Festivals from '/server/api/collections/Festivals'
import Posts from '/server/api/collections/Posts'
// import Followers from '/server/api/collections/Followers'
import Users from '/server/api/collections/Users'
import Notifications from '/server/api/collections/Notifications'
// import Payments from '/server/api/collections/Payments'
// import Promotions from '/server/api/collections/Promotions'
import Schedules from '/server/api/collections/Schedules'
// import Tickets from '/server/api/collections/Tickets'
// import Events from '/server/api/collections/Events'


// import commentSlugify from '/lib/utils/helpers/commentSlugify'

// import fs from 'fs'
// import * as csvWriter from 'csv-write-stream'
// const pathToFile = process.env.PWD + '/private/data/100_VDP_2019.csv'
const pathToValidProxy = process.env.NODE_ENV === 'production' ? '/data/valid_proxies.json' : process.env.PWD + '/public/data/valid_proxies.json'
const pathToSaveProxy = process.env.NODE_ENV === 'production' ? '/data/proxies.json' : process.env.PWD + '/public/data/proxies.json'
// const pathToProxy = process.env.PWD + '/public/data/proxies.json'
const pathToCBRCurrencies = process.env.NODE_ENV === 'production' ? '/data/cbr_currencies.json' : process.env.PWD + '/public/data/cbr_currencies.json'

Meteor.startup(function () {
  if (process.env.NODE_ENV === 'production') {
    console.log('SyncedCron started!')
    SyncedCron.start()
  }
})

SyncedCron.config({
  log: false,
  timezone: 'Europe/Moscow'
  // collectionName: 'crons',
})

// Recalculate Karma rating
SyncedCron.add({
  name: 'Recalculate Karma rating',
  schedule (parser) {
    return parser.text('at 2:00 am')
  },
  job () {
    console.log('=== Recalculate Karma rating started ===')
    Users.find({}).forEach(user => {
      if (user.profile.karma !== user.profile.nextKarma) {
        Users.update(
          {_id: user._id},
          {$set: {
            'profile.karma': user.profile.nextKarma
          }}
        )
      }
    })
  }
})

// Remove old notifcations
SyncedCron.add({
  name: 'Remove old notifcations',
  schedule (parser) {
    return parser.text('at 2:30 am')
  },
  job () {
    console.log('=== Remove old notifications started ===')
    const date = new Date()
    const daysToDeletion = 30
    const deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion))

    // delete old Notifications
    Notifications.remove({ createdAt: { $lt: deletionDate } })
  }
})

// Generate Turbo RSS
SyncedCron.add({
  name: 'Generate Turbo RSS legacy',
  schedule (parser) {
    return parser.text('at 1:20 am on Sunday')
  },
  job () {
    console.log('=== Generate TurboRSS started ===')
    // generateTurboFeedXML()
  }
})

SyncedCron.add({
  name: 'Generate Turbo RSS API',
  schedule (parser) {
    return parser.text('at 1:45 am')
  },
  job () {
    console.log('=== Generate TurboRSS API started ===')
    generateTurboXML()
  }
})

// Generate Sitemaps
/* SyncedCron.add({
  name: 'Generate Sitemaps',
  schedule (parser) {
    return parser.text('at 2:20 am on Suturday')
  },
  job () {
    console.log('=== Generate Sitemaps started ===')
    generateSitemap()
  }
}) */

// Recalculate Karma rating
SyncedCron.add({
  name: 'Recalculate negative stats: Karma, Coins, Followers etc',
  schedule (parser) {
    return parser.text('at 4:30 am on Sunday')
  },
  job () {
    console.log('=== Recalculate negative stats: Karma, Coins, Followers etc ===')
    Users.find({}).forEach(user => {
      if (user.profile.karma < 0) {
        Users.update(
          {_id: user._id},
          {$set: {
            'profile.karma': 0
          }}
        )
      }
      if (user.coins < 0) {
        Users.update(
          {_id: user._id},
          {$set: {
            'coins': 0
          }}
        )
      }
    })
  }
})

SyncedCron.add({
  name: 'Fix pending cards',
  schedule (parser) {
    return parser.text('at 1:35 am')
  },
  job () {
    Cards.remove({ 'status': 'pending' })
  }
})

SyncedCron.add({
  name: 'Fix status cards',
  schedule (parser) {
    return parser.text('at 1:45 am')
  },
  job () {
    const cards = Cards.find({ 'status': 'succeeded' })
    cards.forEach(item => {
      Cards.update(
        { _id: item._id },
        { $set: { 'status': 'active' } }
      )
    })
  }
})

SyncedCron.add({
  name: 'Send unread messages notification',
  schedule (parser) {
    return parser.text('every 2 hours')
  },
  job () {
    console.log('=== Send unread messages notification ===')
    const usersEmailed = Users.find({ 'profile.unreadMessages': true }, {
      fields: {
        _id: 1,
        'profile.unreadMessagesEmailed': 1,
        'profile.image': 1,
        'profile.name': 1,
        'profile.lastLogin': 1,
        'settings.emailUpdates': 1,
        emails: 1
      }
    })

    usersEmailed.forEach(user => {
      if (!user.profile.unreadMessagesEmailed) {
        // const msgInfo = Messages.find({ unreadStatus: true })
        const userLastLogin = user.profile.lastLogin
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
          if (userLastLogin) {
            const currDate = new Date()
            const hours = Math.abs(userLastLogin - currDate) / 36e5
            if (hours > 2) {
              REmail.buildAndSend({
                vars: {
                  userId: user._id,
                  user: user,
                  url: `https://ryfma.com/me/chats?utm_source=email&utm_medium=messagereminder&amp;utm_campaign=${user._id}&amp;utm_content=button`,
                  title: `Ответить на сообщение`,
                  emailType: 'unreadMessages',
                  emailPreview: `У вас есть непрочитанные сообщения.`
                },
                template: 'unreadMessages',
                to: [user.emails[0].address]
              })
              Users.update(
                { _id: user._id },
                { $set: { 'profile.unreadMessagesEmailed': true } }
              )
            }
          } else {
            REmail.buildAndSend({
              vars: {
                userId: user._id,
                user: user,
                url: `https://ryfma.com/me/chats?utm_source=email&utm_medium=messagereminder&amp;utm_campaign=${user._id}&amp;utm_content=button`,
                title: `Ответить на сообщение`,
                emailType: 'unreadMessages',
                emailPreview: `У вас есть непрочитанные сообщения.`
              },
              template: 'unreadMessages',
              to: [user.emails[0].address]
            })
            Users.update(
              { _id: user._id },
              { $set: { 'profile.unreadMessagesEmailed': true } }
            )
          }
        }
      } else {

      }
    })
  }
})

// Post scheduled posts
SyncedCron.add({
  name: 'Post scheduled posts',
  schedule (parser) {
    return parser.text('every 10 minutes')
  },
  job () {
    console.log('=== Post scheduled posts started ===')
    Schedules.find({ status: 1 }).forEach(schObject => {
      Posts.update(
        { _id: schObject.objectId },
        {
          $set: { postedAt: new Date(), 'status': 2 },
          $unset: { scheduledAt: 1 }
        }
      )
      Schedules.update(
        { _id: schObject._id },
        { $set: { 'status': 2 } }
      )
      const post = Posts.findOne({ _id: schObject.objectId })
      const notifObj = {
        createdAt: new Date(),
        currId: schObject.userId,
        notifType: 4,
        notifObjectId: schObject.objectId,
        objectType: 'post',
        objectId: schObject.objectId,
        objectName: post.title
      }
      // console.log('schPost send: ', post)
      // console.log('schPost notifObj: ', notifObj)
      sendNotifsToUsers(notifObj, schObject.userId, post)
    })
  }
})

SyncedCron.add({
  name: 'Close duels',
  schedule (parser) {
    return parser.text('every 1 hour')
  },
  job () {
    console.log('=== Close duels started ===')
    const currDate = new Date()
    const activeDuels = Festivals.find({
      isActive: true,
      status: 2,
      isDuel: true,
      toDate: { $lt: currDate }
    })

    activeDuels.forEach(duel => {
      const duelPosts = FestPosts.find({ festId: duel._id }, { sort: { likeCount: -1 }, fields: { _id: 1, createdAt: 1, title: 1, userId: 1, likeCount: 1 } }).fetch()
      if (duelPosts.length === 2) {
        if (duelPosts[0].likeCount === duelPosts[1].likeCount) {
          Festivals.update(
            { _id: duel._id },
            { $set: { 'isActive': false, 'status': 5, isAnonymous: false, 'winnerId': 'none' } }
          )
        } else {
          const userId = duelPosts[0].userId
          // Add coins to winner
          Users.update(
            { _id: userId },
            { $inc: { 'coins': 100 } }
          )
          const notifObj = {
            createdAt: new Date(),
            currId: userId,
            userId: userId,
            text: 'account credited with ' + 100,
            notifType: 7,
            notifObjectId: '',
            objectType: 'balance',
            objectId: '',
            objectName: ''
          }
          Notifications.insert(notifObj)
          Festivals.update(
            { _id: duel._id },
            { $set: { 'isActive': false, 'status': 5, isAnonymous: false, 'winnerId': userId } }
          )
        }

        for (let i = 0; i < duelPosts.length; i++) {
          const usId = duelPosts[i].userId
          const notifObj = {
            createdAt: new Date(),
            currId: usId,
            userId: usId,
            text: 'duelisfinished',
            notifType: 9,
            notifObjectId: duel._id,
            objectType: 'contest',
            objectId: duel._id,
            objectName: duel.title
          }
          Notifications.insert(notifObj)
          Users.update(
            { _id: usId },
            { $set: { 'profile.unreadNotifications': true } }
          )
          dbCache.del('notifs_' + usId)
          dbCache.del('user_' + usId)
        }
      } else {
        if (duelPosts.length === 1) {
          const toDate = new Date(duel.toDate)
          const duration = 7
          toDate.setDate(toDate.getDate() + duration)
          Festivals.update(
            { _id: duel._id },
            {
              $set: {
                'isActive': true,
                'status': 2,
                'toDate': toDate
              },
            }
          )
        } else {
          console.log('close duel info no posts: ', duel)
        }
      }
    })

    dbCache.delPattern('fests_')
  }
})

/* SyncedCron.add({
  name: 'Fix closed duels',
  schedule (parser) {
    return parser.text('at 2:18 am')
  },
  job () {
    console.log('=== Fix closed duels started ===')
    const currDate = new Date()
    const closedDuels = Festivals.find({
      isActive: false,
      status: 5,
      isDuel: true
    })

    closedDuels.forEach(duel => {
      const duelPosts = FestPosts.find({ festId: duel._id }, { sort: { likeCount: -1 }, fields: { _id: 1, createdAt: 1, title: 1, userId: 1, postId: 1, likeCount: 1 } }).fetch()
      if (duelPosts[0].likeCount === duelPosts[1].likeCount) {
        const posts = Posts.find({ _id: { $in: [duelPosts[0]._id, duelPosts[1]._id] }}, { sort: { likeCount: -1 }}).fetch()
        console.log('posts: ', posts)
        if (posts[0].likeCount === posts[1].likeCount) {
          console.log('no winners')
          const festUpdated = Festivals.update(
            { _id: duel._id },
            { $set: { 'winnerId': 'none' } }
          )
        } else {
          const userId = posts[0].userId
          const festUpdated = Festivals.update(
            { _id: duel._id },
            { $set: { 'winnerId': userId } }
          )
        }
      } else {
        const userId = duelPosts[0].userId
        const festUpdated = Festivals.update(
          { _id: duel._id },
          { $set: { 'winnerId': userId } }
        )
      }
    })

    dbCache.delPattern('fests_')
  }
}) */

// Post scheduled posts
SyncedCron.add({
  name: 'Check filed email and mark as bonuced',
  schedule (parser) {
    return parser.text('at 1:00 am')
  },
  job () {
    // console.log('=== Post scheduled posts started ===')

    const failedEmails = Mailgun.get('events', { 'event': 'failed', limit: 300 })
    for (let i = 0; i < failedEmails.length; i++) {
      const email = failedEmails[i].recipient
      console.log('failedEmail: ', email)
      const user = Users.findOne({ 'emails.0.address': email })
      Users.update(
        { _id: user._id },
        { $set: { 'emails.0.bounced': true } }
      )
    }
  }
})

SyncedCron.add({
  name: 'Cleanup last user activity older 14 days',
  schedule (parser) {
    return parser.text('at 1:35 am on Sunday')
  },
  job () {
    console.log('Cleanup last user activity older 14 days started!')
    const users = Users.find({ 'services.resume.loginTokens.1': { $exists: true } })
    let cleanupUsers = 0
    users.forEach(user => {
      if (!user.services.resume.loginTokens) {
        console.log('no resume: ', user.services.resume)
      } else {
        const weekAgoDate = new Date()
        weekAgoDate.setUTCDate(weekAgoDate.getDate() - 14)
        const newTokens = []
        user.services.resume.loginTokens.slice(-14).map(token => {
          if (token.when > weekAgoDate) {
            // console.log('token.when: ', token.when)
            // console.log('weekAgoDate: ', weekAgoDate)
            newTokens.push(token)
          }
        })
        // console.log('newTokens: ', newTokens)
        // console.log('newTokens.length: ', newTokens.length)
        cleanupUsers++
        Users.update(
          { _id: user._id },
          { $set: { 'services.resume.loginTokens': newTokens } }
        )
      }
    })
    console.log('cleanupUsers: ', cleanupUsers)
  }
})

SyncedCron.add({
  name: 'Fix users count',
  schedule (parser) {
    return parser.text('at 1:10 pm')
  },
  job () {
    const activeFests = Festivals.find({ isActive: true, status: 2, isDuel: false })
    activeFests.forEach(fest => {
      if (fest._id !== 'ivSPWb8M2FBLLoYiB') {
        const festPosts = FestPosts.find({ festId: fest._id }, { fields: { _id: 1, userId: 1 } })
        const users = []
        festPosts.forEach((festpost, index) => {
          users.push(festpost.userId)
        })
        Festivals.update(
          { _id: fest._id },
          { $set: { 'users': users, 'stats.usersCount': users.length } }
        )
      }
    })
  }
})

/* SyncedCron.add({
  name: 'Fix comments counters',
  schedule (parser) {
    return parser.text('at 0:30 am')
  },
  job () {
    console.log('Fix comments counters')
    const comments = Comments.find({ })
    comments.forEach(comment => {
      const commentsCount = Comments.find({ objectId: comment.objectId, objectType: comment.objectType }).count()

      if (commentsCount > 0) {
        // console.log('comment: ', comment)
        if (comment.objectType === 'post') {
          Posts.update(
            { _id: comment.objectId },
            { $set: { 'commentsCount': commentsCount } }
          )
        } else if (comment.objectType === 'book') {
          Books.update(
            { _id: comment.objectId },
            { $set: { 'commentsCount': commentsCount } }
          )
        } else if (comment.objectType === 'ask') {
          Asks.update(
            { _id: comment.objectId },
            { $set: { 'commentsCount': commentsCount } }
          )
        }
      }
    })
    console.log('Fix comments counters done')
  }
}) */

/* SyncedCron.add({
  name: 'Fix web push subs',
  schedule (parser) {
    return parser.text('at 10:00 pm')
  },
  job () {
    const users = Users.find({ })
    users.forEach(user => {
      Users.update(
        { _id: user._id },
        {
          $set: { 'disablePush': false, pushSubs: [] }
        }
      )
    })
  }
}) */

SyncedCron.add({
  name: 'Get list of proxies',
  schedule (parser) {
    return parser.text('every 4 hours')
  },
  job () {
    console.log('Start get JSON proxy')
    // Check if success proxies exists
    let isValidProxiesExists = false
    let validProxies = []
    try {
      const rawDataValidProxies = fs.readFileSync(pathToValidProxy)
      if (rawDataValidProxies) {
        const strRawData = rawDataValidProxies.toString()
        validProxies = JSON.parse(strRawData).data
        if (validProxies.length > 0) {
          console.log('Valid proxies exists!', validProxies.length)
          isValidProxiesExists = true
        } else {
          console.log('No valid proxies')
        }
      }
    } catch (err) {
      console.log(err)
    }

    if (!isValidProxiesExists) {
      const path = `https://proxy11.com/api/proxy.json?key=MjU1.XTXMig.qBA5y1ZFzRdbw9rocVrzzfVI-gw&type=1&port=80`
      // const path = `https://api.openproxy.space/free-proxy-list`
      const userAgent = new UserAgent()
      request({
        url: path,
        headers: {
          'User-Agent': userAgent
        },
        method: 'GET'
      }, (err, response, body) => {
        if (err) {
          console.log('getProxy error: ', err)
        } else {
          const loadedProxy = JSON.parse(body).data
          const restProxyList = []
          for (let i = 0; i < loadedProxy.length; i++) {
            const proxy = loadedProxy[i]
            if (!proxy) {
              continue
            }

            const hasHttp = proxy.protocols ? proxy.protocols.includes(1) : true
            if (!hasHttp) {
              continue
            }

            const timeout = proxy.timeout ? proxy.timeout * 1000 : 4000
            if (timeout > 4000) {
              continue
            }

            restProxyList.push(proxy)
          }

          try {
            fs.writeFileSync(pathToSaveProxy, JSON.stringify({ "data": restProxyList }))
            console.log('restProxyList saved to JSON file')
          } catch (err) {
            console.log('err write to JSON file: ', err)
          }
        }
      })
    }
  }
})


SyncedCron.add({
  name: 'Get latest CBR currency',
  schedule (parser) {
    return parser.text('at 9:05 pm')
  },
  job () {
    console.log('Get latest CBR currency')
    const path = `https://www.cbr-xml-daily.ru/daily_json.js`
    const userAgent = new UserAgent()
    request({
      url: path,
      headers: {
        'User-Agent': userAgent
      },
      method: 'GET'
    }, (err, response, body) => {
      if (err) {
        console.log('getProxy error: ', err)
      } else {
        // console.log('proxy body: ', body)
        console.log('save array to JSON file')
        try {
          fs.writeFileSync(pathToCBRCurrencies, body)
        } catch (err) {
          console.log('err write to JSON file: ', err)
        }
      }
    })
  }
})

SyncedCron.add({
  name: 'Fix wrong jury counter',
  schedule (parser) {
    return parser.text('every 4 hours')
  },
  job () {
    const activeFests = Festivals.find({ isActive: true, status: 2, isDuel: false })
    activeFests.forEach(fest => {
      if (fest._id !== 'ivSPWb8M2FBLLoYiB') {
        const festPosts = FestPosts.find({ festId: fest._id })
        let misPosts = 0
        festPosts.forEach((festpost, index) => {
          if (fest.levels > 1) {
            const juries = festpost.juryLevelsRating
            if (juries) {
              for (let i = 0; i < festpost.levels.length; i++) {
                const newJuries = juries[i]
                if (newJuries) {
                  const newJuryLevelsCount = festpost.juryLevelsCount
                  let counter = 0
                  for (let j = 0; j < newJuries.length; j++) {
                    counter += newJuries[j].rating
                  }
                  if (counter !== newJuryLevelsCount[i]) {
                    misPosts += 1
                    console.log('====================================')
                    console.log('Festpost mismatch: ', festpost._id)
                    console.log('Festpost counter: ', counter)
                    console.log('Festpost newJuryLevelsCount before: ', newJuryLevelsCount)
                    newJuryLevelsCount[i] = counter
                    console.log('Festpost newJuryLevelsCount after: ', newJuryLevelsCount)

                    FestPosts.update(
                      {
                        _id: festpost._id
                      },
                      {
                        $set: {
                          juryLevelsCount: newJuryLevelsCount
                        }
                      }
                    )
                  }
                }
              }
            }
          } else {
            const juryCount = festpost.juryCount
            const juries = festpost.juryRating
            if (juries) {
              let counter = 0
              for (let i = 0; i < juries.length; i++) {
                counter += juries[i].rating
              }

              if (counter !== juryCount) {
                misPosts += 1
                console.log('====================================')
                console.log('Festpost mismatch: ', festpost._id)
                console.log('Festpost counter: ', counter)
                console.log('Festpost juryCount: ', juryCount)

                FestPosts.update(
                  {
                    _id: festpost._id
                  },
                  {
                    $set: { juryCount: counter }
                  }
                )
              }
            }
          }
        })
        console.log('Total mismatch posts: ', misPosts)
      }
    })
  }
})


SyncedCron.add({
  name: 'Send updated urls to Bing',
  schedule (parser) {
    return parser.text('every 12 hours')
  },
  job () {
    console.log('Send updated urls to Bing')
    const path = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${Meteor.settings.private.bing.apiKey}`
    const fields = {
      paymentType: { $nin: [ 1, 2, 3 ] },
      status: 2
    }
    const options = {}
    const lastDate = new Date()
    const nowDate = new Date()
    lastDate.setUTCDate(lastDate.getDate())
    nowDate.setTime(lastDate.getTime() - 12 * 60 * 60000)

    fields.postedAt = {
      $gte: lastDate,
      $lte: nowDate,
    }
    options.fields = {
      _id: 1,
      slug: 1,
    }

    const posts = Posts.find(fields, options).fetch()
    console.log('fields: ', fields)
    console.log('posts.length: ', posts.length)
    if (posts.length > 0) {
      const urls = posts.map(post => `https://ryfma.com/p/${post._id}/${post.slug}`)
      request({
        url: path,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          siteUrl: 'https://ryfma.com',
          urlList: urls
        })
      }, (err, response, body) => {
        if (err) {
          console.log('Bing Submission error: ', err)
        } else {
          console.log('proxy body: ', body)
          console.log('Bing Submission success!')
        }
      })
    } else {
      console.log('No posts to send')
    }
  }
})

// === One time tasks ===//
/*
SyncedCron.add({
  name: 'Fix users usernames',
  schedule (parser) {
    return parser.text('at 4:30 am')
  },
  job () {
    const users = Users.find({ })
    users.forEach(user => {
      if (user.username.indexOf("_") > 0) {
        const newUsername = user.username.toLowerCase()
        Users.update(
          { _id: fest._id },
          { $set: { 'username': newUsername } }
        )
      }
    })
  }
})

SyncedCron.add({
  name: 'Fix users count',
  schedule (parser) {
    return parser.text('at 1:10 pm')
  },
  job () {
    const activeFests = Festivals.find({ isActive: true, status: 2, isDuel: false })
    activeFests.forEach(fest => {
      if (fest._id !== 'ivSPWb8M2FBLLoYiB') {
        const festPosts = FestPosts.find({ festId: fest._id }, { fields: { _id: 1, userId: 1 } })
        let users = []
        festPosts.forEach((festpost, index) => {
          users.push(festpost.userId)
        })
        Festivals.update(
          { _id: fest._id },
          { $set: { 'users': users, 'stats.usersCount': users.length } }
        )
      }
    })
  }
})

SyncedCron.add({
  name: 'Fix posts excerpt',
  schedule (parser) {
    return parser.text('at 01:10 am')
  },
  job () {
    console.log('Fix posts excerpt')
    const posts = Posts.find({
      'excerpt': { $exists: true },
      '$expr': { $gt: [ { '$strLenCP': '$excerpt' }, 250 ] }
    })

    let fixedPosts = 0
    posts.forEach(post => {
      if (!post.excerpt) {
        console.log('no excerpt: ', post._id)
      } else {
        if (post.excerpt.length > 250) {
          // console.log('postId: ', postId)
          fixedPosts++

          const newExcerpt = `${post.excerpt.replace(/\s+/g, ' ').substring(0, 247)}...`
          // console.log('post.excerpt: ', post.excerpt)
          // console.log('newExcerpt: ', newExcerpt)
          Posts.update(
            { _id: post._id },
            { $set: { 'excerpt': newExcerpt } }
          )
        }
      }
    })
    console.log('fixedPosts: ', fixedPosts)
  }
}) */

/* SyncedCron.add({
  name: 'Fix multi jury rating',
  schedule (parser) {
    return parser.text('every 1 hour')
  },
  job () {
    console.log('Fix multi jury rating started!')
    // const fest = Festivals.findOne({ _id: 'fuciKCdzTSvkGiEAa' })
    const festPosts = FestPosts.find({ festId: 'fuciKCdzTSvkGiEAa' }).fetch()
    try {
      for (let k = 0; k < festPosts.length; k++) {
        const festPost = festPosts[k]
        // console.log('festPost _id: ', festPost._id)
        // console.log('fest PostId: ', festPost.postId)

        const post = Posts.findOne({ _id: festPost.postId })
        // console.log('post fests: ', !post.fests)
        if (post) {
          if (!post.fests) {
            // console.log('no festId: ', post._id)
            Posts.update(
              { _id: festPost.postId },
              { $addToSet: { 'fests': festPost.festId } }
            )
          } else {
            // console.log('post.fests includes : ', !post.fests.includes(festPost.festId))
            if (!post.fests.includes(festPost.festId)) {
              // console.log('no festId include: ', post._id)
              Posts.update(
                { _id: festPost.postId },
                { $addToSet: { 'fests': festPost.festId } }
              )
            }
          }
        }

        if (!!festPost.juryLevelsCount && !!festPost.juryLevelsRating) {
          let levelsCount = festPost.juryLevelsCount
          const levelsRatings = festPost.juryLevelsRating
          // console.log('=== festPost ===', festPost._id)
          if (levelsRatings) {
            // console.log('levelsRatings: ', levelsRatings)
            for (let i = 0; i < levelsRatings.length; i++) {
              // console.log('levelsRatings[i] before: ', levelsRatings[i])
              if (levelsRatings[i] === null) {
                levelsRatings[i] = []
              }
              // console.log('levelsRatings[i] after: ', levelsRatings[i])
              let totalJuryLevelsCount = 0
              for (let j = 0; j < levelsRatings[i].length; j++) {
                const currentLevelRatings = levelsRatings[i][j]
                // console.log('currentLevelRatings: ', currentLevelRatings)
                if (currentLevelRatings) {
                  if (currentLevelRatings.rating > 6) {
                    // console.log('currentLevelRatings.rating > 6: ', currentLevelRatings.rating)
                    const newRating = Math.floor((currentLevelRatings.rating / 50) * 6)
                    const deltaRating = currentLevelRatings.rating - newRating
                    currentLevelRatings.rating = newRating
                    levelsCount[i] = levelsCount - deltaRating
                    levelsRatings[i][j] = currentLevelRatings
                    if (!levelsCount[0]) {
                      levelsCount[0] = 0
                    }
                    if (!levelsCount[1]) {
                      levelsCount[1] = 0
                    }
                    // console.log('levelsCount: ', levelsCount)
                    // console.log('levelsRatings: ', levelsRatings)
                    FestPosts.update(
                      { _id: festPost._id },
                      {
                        $set: {
                          juryLevelsCount: levelsCount,
                          juryLevelsRating: levelsRatings
                        }
                      }
                    )
                  }
                  totalJuryLevelsCount += currentLevelRatings.rating
                  levelsCount[i] = totalJuryLevelsCount
                  // console.log('levelsCount total: ', levelsCount)
                  FestPosts.update(
                    { _id: festPost._id },
                    {
                      $set: {
                        juryCount: levelsCount[1] || 0,
                        juryLevelsCount: levelsCount
                      }
                    }
                  )
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}) */
