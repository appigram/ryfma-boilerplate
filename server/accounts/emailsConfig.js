import { Accounts } from 'meteor/appigram:accounts-base'
import REmail from '../emails/REmail'

const isProduction = process.env.NODE_ENV === 'production'
Accounts.emailTemplates.from = process.env.MAIL_FROM || '"Ryfma" <info@ryfma.ru>'
Accounts.emailTemplates.siteName = 'Ryfma'
Accounts.emailTemplates.replyTo = '"Ryfma" <info@ryfma.ru>'

const getURL = function (path) {
  return isProduction ? `https://ryfma.com${path}` : `http://localhost:3000${path}`
}

Accounts.emailTemplates.verifyEmail = {
  subject (user) {
    return 'Подтвердите адрес электронной почты' // Confirm your email
  },
  html (user, url) {
    const { html } = REmail.syncBuild({
      user,
      url,
      title: `Подтвердить`,
      emailType: 'verify',
      emailPreview: `Подтвердите адрес электронной почты`
    }, 'auth_verify')
    return html
  },
  text (user, url) {
    const { html } = REmail.syncBuild({
      user,
      url,
      title: `Подтвердить`,
      emailType: 'verify',
      emailPreview: `Подтвердите адрес электронной почты`
    }, 'auth_verify')
    const text = REmail.generateTextVersion(html)
    return text
  }
}

Accounts.urls.verifyEmail = function (token) {
  return getURL('/email-verification/' + token)
}

Accounts.emailTemplates.resetPassword = {
  subject (user) {
    return 'Инструкции по сбросу пароля' // Instructions for resetting the password
  },
  html (user, url) {
    const email = REmail.syncBuild({
      user,
      url,
      title: `Сбросить`,
      emailType: 'reset',
      emailPreview: `Инструкции по сбросу пароля`
    }, 'auth_reset')
    return email.html
  },
  text (user, url) {
    const email = REmail.syncBuild({
      user,
      url,
      title: `Сбросить`,
      emailType: 'reset',
      emailPreview: `Инструкции по сбросу пароля`
    }, 'auth_reset')
    const text = REmail.generateTextVersion(email.html)
    return text
  }
}

Accounts.urls.resetPassword = function (token) {
  return getURL('/reset-password/' + token)
}

Accounts.emailTemplates.enrollAccount = {
  subject (user) {
    return 'Новый аккаунт создан' // An account has been created for you
  },
  html (user, url) {
    const { html } = REmail.syncBuild({
      user,
      url,
      title: `Войти`,
      emailType: 'enroll',
      emailPreview: `Новый аккаунт создан`
    }, 'auth_enroll')
    return html
  },
  text (user, url) {
    const { html } = REmail.syncBuild({
      user,
      url,
      title: `Войти`,
      emailType: 'enroll',
      emailPreview: `Новый аккаунт создан`
    }, 'auth_enroll')
    const text = REmail.generateTextVersion(html)
    return text
  }
}

Accounts.urls.enrollAccount = function (token) {
  return getURL('/enroll/' + token)
}
