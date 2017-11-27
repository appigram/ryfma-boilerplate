import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import crypto from 'crypto'
import express from 'express'
import bodyParser from 'body-parser'
import { Roles } from 'meteor/nicolaslopezj:roles'
import Payments from '../../api/collections/Payments'

async function getPayment (req, res) {
  const yandexSecret = Meteor.settings.private.yandex.notificationSecret
  console.log(req.body)
  // Check a SHA1 hash
  const checkPaymentString = `${req.body.notification_type}&${req.body.operation_id}&${req.body.amount}&${req.body.currency}&${req.body.datetime}&${req.body.sender}&${req.body.codepro}&${yandexSecret}&${req.body.label}`
  const sha1Check = crypto.createHash('sha1').update(checkPaymentString).digest('hex')

  if (req.body.sha1_hash === sha1Check) {
    const userId = req.body.label.replace('id_', '')
    const user = Meteor.users.findOne(userId)
    if (user._id) {
      const amount = parseInt(req.body.withdraw_amount, 10)
      // Put payment information
      const endPeriod = new Date()
      const currMonth = endPeriod.getMonth() + 1
      const currYear = endPeriod.getYear()
      const daysInMonth = new Date(currYear, currMonth, 0).getDate()
      endPeriod.setUTCDate(endPeriod.getDate() + daysInMonth)
      if (amount === 3240) {
        endPeriod.setUTCDate(endPeriod.getDate() + daysInMonth * 6)
      }
      if (amount === 5760) {
        endPeriod.setUTCDate(endPeriod.getDate() + daysInMonth * 12)
      }
      const paymentObj = {
        createdAt: new Date(),
        userId: userId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: endPeriod,
        amount: req.body.amount,
        currency: req.body.currency
      }
      await Payments.insert(paymentObj)
    } else {
      console.log('userId required!')
    }
  } else {
    console.log('SHA1 check error')
  }

  res.status(200).end()
}

export function setupPaymentApi () {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))

  app.post('/api/payments', getPayment)

  app.get('/api', (req, res) => {
    res.status(200).end()
  })

  WebApp.connectHandlers.use(app)
}
