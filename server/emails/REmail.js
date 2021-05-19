import { Meteor } from 'meteor/meteor'
// import { Email } from 'meteor/email'
import Juice from 'juice'
import { htmlToText } from 'html-to-text'
import Handlebars from 'handlebars'
import Mailgun from './mailgun'

const isProduction = process.env.NODE_ENV === 'production'

const REmail = {}

REmail.emails = {}

REmail.addEmails = emails => {
  REmail.emails = Object.assign(REmail.emails, emails)
}

REmail.templates = {}

REmail.addTemplates = templates => {
  REmail.templates = {
    ...REmail.templates,
    ...templates
  }
}

REmail.getTemplate = templateName => Handlebars.compile(
  REmail.templates[templateName],
  { noEscape: true, strict: true }
)

REmail.buildTemplate = (htmlContent, data = {}, locale) => {
  const emailProperties = {
    body: htmlContent,
    ...data
  }
  const emailHTML = REmail.getTemplate('wrapper')(emailProperties)
  const inlinedHTML = Juice(emailHTML, {preserveMediaQueries: true})
  const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'

  return doctype + inlinedHTML
}

REmail.generateTextVersion = html => {
  return htmlToText(html, {
    wordwrap: 130
  })
}

REmail.send = ({ sync, to, data, subject, html, text, multi, recipientVars }) => {
  // TODO: limit who can send emails
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND

  const from = process.env.MAIL_FROM || 'Ryfma <info@ryfma.ru>' // send emails from

  if (typeof text === 'undefined') {
    // Auto-generate text version if it doesn't exist. Has bugs, but should be good enough.
    text = REmail.generateTextVersion(html)
  }

  let email = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html
  }

  if (multi) {
    email = {
      ...email,
      'recipient-variables': recipientVars
    }
  } else {
    if (to) {
      if (to[0] !== 'info@ryfma.ru'
      && to[0] !== 'info@ryfma.com'
      // && to[0] !== 'appigram@gmail.com'
      && to[0] !== 'i-76@yandex.ru'
      && !multi) {
        email = {
          ...email,
          // Beta test
          // 'o:deliverytime-optimize-period': '24h',
          // 'o:tag': 'STO_enabled',
          // 'o:tracking': 'yes'
        }
      }
    }
  }

  // exclude Ryfma domain
  if (to[0]){
    if (to[0].indexOf('@ryfma.com') > -1 || to[0].indexOf('@ryfma.ru') > -1) {
      return
    }
  } else {
    if (to.indexOf('@ryfma.com') > -1 || to.indexOf('@ryfma.ru') > -1) {
      return
    }
  }

  if (!isProduction) {
    // to = 'appigram@gmail.com'
    // to = 'info@ryfma.ru'
    // to = 'schema.whitelisting+sample@gmail.com'
    // to = 'schema.whitelisting@gmail.com'
    email = {
      to,
      from,
      subject,
      html,
      text
    }
    if (multi) {
      email = {
        ...email,
        'recipient-variables': recipientVars
      }
    } else {
      if (to) {
        if (to[0] !== 'info@ryfma.ru'
        && to[0] !== 'info@ryfma.com'
        // && to[0] !== 'appigram@gmail.com'
        && to[0] !== 'i-76@yandex.ru') {
          email = {
            ...email,
            // Beta test
            // 'o:deliverytime-optimize-period': '24h',
            // 'o:tag': 'STO_enabled',
            // 'o:tracking': 'yes'
          }
        }
      }
    }
    // console.log('=== Send EMail ===')
    // console.log(email)
    return
    console.log('=== Sending email to: ', to)
  }

  // Mailgun way
  try {
    if (sync) {
      Mailgun.sendEmail(email)
    } else {
      Meteor.defer(() => {
        try {
          Mailgun.sendEmail(email)
        } catch (error) {
          console.log(`Error sending email to ${to}`, error)
          // if (throwErrors) throw error
        }
      })
    }
  } catch (error) {
    console.log(`Error sending email to ${to}`, error)
    // if (throwErrors) throw error
  }

  // Meteor way
  /* try {
    if (sync) {
      Email.send(email)
    } else {
      Meteor.defer(() => Email.send(email))
    }
  } catch (error) {
    console.log(`Error sending email to ${to}`, error)
    if (throwErrors) throw error
  } */
  return email
}

REmail.build = async (vars, template, locale = 'ru') => {
  // execute email's GraphQL query
  const email = REmail.emails[template]
  // const result = email.query ? await runQuery(email.query, variables, { locale }) : {data: {}}
  const result = {data: vars}

  // if email has a data() function, merge its return value with results from the query
  const data = email.data ? {...result.data, ...email.data(vars)} : result.data

  const subject = typeof email.subject === 'function' ? email.subject(data) : email.subject

  // data.Strings = Strings[locale]

  let html = null
  try {
    html = REmail.buildTemplate(REmail.getTemplate(email.template)(data), data, locale)
  } catch (e) {
    console.log('email.template: ', email.template)
    console.log('REmail error: ', e)
  }

  if (html) {
    return { data, subject, html }
  }
  return null
}

REmail.syncBuild = (vars, template, locale = 'ru') => {
  // execute email's GraphQL query
  const email = REmail.emails[template]
  // const result = email.query ? await runQuery(email.query, variables, { locale }) : {data: {}}
  const result = {data: vars}

  // if email has a data() function, merge its return value with results from the query
  const data = email.data ? {...result.data, ...email.data(vars)} : result.data

  const subject = typeof email.subject === 'function' ? email.subject(data) : email.subject

  // data.Strings = Strings[locale]

  const html = REmail.buildTemplate(REmail.getTemplate(email.template)(data), data, locale)

  return { data, subject, html }
}

REmail.buildAndSend = async ({vars, to, template, locale = 'ru', multi = false, recipientVars = {}}) => {
  const email = await REmail.build(vars, template)
  return REmail.send({to, ...email, multi, recipientVars})
}

REmail.buildAndSendHTML = ({vars, to, html, locale = 'ru', multi = false, recipientVars = {}}) => REmail.send(
  to,
  REmail.buildTemplate(html)
)

export default REmail
