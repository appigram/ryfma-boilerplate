import { Meteor } from 'meteor/meteor'
import Users from '/server/api/collections/Users'
import Pushes from '/server/api/collections/Pushes'
const webPush = require('web-push')

const isDev = process.env.NODE_ENV === 'development'

// const publicVapidKey = Meteor.settings.public.vapid.key
// const privateVapidKey = Meteor.settings.private.vapid.key

// webpush.setGCMAPIKey(Meteor.settings.public.google.GCM)
// Replace with your email
// webPush.setVapidDetails('https://ryfma.com', publicVapidKey, privateVapidKey)

/* const options = {
  TTL: 600 // time to live in seconds
} */

export const sendPush = (subs, payload, userId) => {
  const { privateKey: gcmPrivateKey } = Meteor.settings.private.firebase
  const { publicKey: vapidPublicKey } = Meteor.settings.public.vapid
  const { subject: vapidSubject, privateKey: vapidPrivateKey } = Meteor.settings.private.vapid

  // Set web-push keys
  webPush.setGCMAPIKey(gcmPrivateKey)
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)

  const subscriptions = subs ? subs : Pushes.find({ userId: userId })
  subscriptions.forEach((push, index) => {
    const subscription = {
      endpoint: push.endpoint,
      expirationTime: push.expirationTime,
      keys: push.keys
    }

    // console.log('subscription: ', subscription)
    // console.log('payload: ', payload)
    if (!isDev) {
      webPush.sendNotification(subscription, payload)
        .then(() => {
          console.log('Push Application Server - Notification sent to ' + subscription.endpoint)
        }).catch(error => {
          console.log('Error send Web push to: ', userId)
          // console.log(error)
          if (!isDev) {
            if (error.statusCode === 410 || error.statusCode === 404 || error.statusCode === 403) {
              if (!subs) {
                Users.update(
                  { _id: userId },
                  {
                    $pull: { 'pushSubsIds': push._id }
                  }
                )
                Pushes.remove({ _id: push._id })
              } else {
                console.log('subs: ', subs)
                const newPushSubs = [...subs]
                newPushSubs.splice(index, 1)
                console.log('newPushSubs: ', newPushSubs)
                if (newPushSubs.length === 0) {
                  Users.update(
                    { _id: userId },
                    {
                      $unset: { 'pushSubs': 1 }
                    }
                  )
                } else {
                  Users.update(
                    { _id: userId },
                    {
                      $set: { 'pushSubs': newPushSubs }
                    }
                  )
                }
              }
            }
          }
        })
      }
    })
}
