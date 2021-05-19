import { Meteor } from 'meteor/meteor'
import MailgunAPI from 'mailgun-js'
const mailgun = new MailgunAPI({
  apiKey: Meteor.settings.private.MAILGUN_API_KEY,
  domain: 'ryfma.ru'
})

// const isProduction = process.env.NODE_ENV === 'production'
// const from = process.env.MAIL_FROM || 'Ryfma <info@ryfma.ru>' // send emails from

const newsletter = mailgun.lists('news@ryfma.com')

const Mailgun = {}

Mailgun.sendEmail = (data) => {
  return new Promise((resolve, reject) => {
    /* const data = {
      from: from,
      to: recipient,
      subject: message.subject,
      text: message.text,
      inline: attachment,
      html: message.html,
    } */

    mailgun.messages().send(data, (error, res) => {
      if (error) {
        return reject(error)
      }
      return resolve()
    })
  })
}

Mailgun.addToNewsletter = (data) => {
  return new Promise((resolve, reject) => {
    const newUser = {
      subscribed: true,
      address: data.address,
      name: data.name,
      vars: {
        ...data.vars
      }
    }
    newsletter.members().create(newUser, (error, res) => {
      if (error) {
        return reject(error)
      }
      return resolve()
    })
  })
}

Mailgun.removeFromNewsletter = (data) => {
  return new Promise((resolve, reject) => {
    newsletter.members(data.address).delete((error, res) => {
      if (error) {
        return reject(error)
      }
      return resolve()
    })
  })
}

Mailgun.get = (path, params) => {
  return new Promise((resolve, reject) => {
    mailgun.get(`/${mailgun.domain}/${path}`, params, (error, body) => {
      if (error) {
        return reject(error)
      }
      // console.log(body)
      if (body.items) {
        return resolve(body.items)
      } else {
        return resolve(body)
      }
    })
  })
}

export default Mailgun
