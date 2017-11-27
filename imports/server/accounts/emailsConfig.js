import { Accounts } from 'meteor/accounts-base'
import getContent from '../emails/getContent'

const isProduction = process.env.NODE_ENV === 'production'
Accounts.emailTemplates.from = process.env.MAIL_FROM || '"MO.ST" <no-reply@sf1.welyx.com>'
Accounts.emailTemplates.siteName = 'MO.ST'
Accounts.emailTemplates.replyTo = '"MO.ST" <info@sf1.welyx.com>'

const getURL = function (path) {
  return isProduction ? `http://sf1.welyx.com${path}` : `http://localhost:3000${path}`
}

const getEmailTemplate = function (template, user, url) {
  const data = {
    user,
    url,
    homeUrl: getURL('/')
  }

  return getContent(template, data)
}

Accounts.emailTemplates.verifyEmail.subject = function (user) {
  return 'Подтвердите адрес электронной почты' // Confirm your email
}

Accounts.emailTemplates.verifyEmail.html = function (user, url) {
  return getEmailTemplate('auth_verify', user, url)
}

Accounts.urls.verifyEmail = function (token) {
  return getURL('/email-verification/' + token)
}

Accounts.emailTemplates.resetPassword.subject = function (user) {
  return 'Инструкции по сбросу пароля' // Instructions for resetting the password
}

Accounts.emailTemplates.resetPassword.html = function (user, url) {
  return getEmailTemplate('auth_reset', user, url)
}

Accounts.urls.resetPassword = function (token) {
  return getURL('/reset-password/' + token)
}

Accounts.emailTemplates.enrollAccount.subject = function (user) {
  return 'Новый аккаунт создан' // An account has been created for you
}

Accounts.emailTemplates.enrollAccount.html = function (user, url) {
  return getEmailTemplate('auth_enroll', user, url)
}

Accounts.urls.enrollAccount = function (token) {
  return getURL('/enroll/' + token)
}
