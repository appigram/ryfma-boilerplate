import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { Accounts } from 'meteor/appigram:accounts-base'
// import Accounts from '/server/utils/meteor-react-apollo-accounts'
import REmail from '/server/emails/REmail'
import cloneDeep from 'lodash.clonedeep'
import spamEmails from '/server/utils/spamEmails'
import Users from '/server/api/collections/Users'

import getSlug from 'speakingurl'

Accounts.onCreateUser((options, user = {}) => {
  // console.log('User registration started!')
  // console.log(options)
  // console.log(user)

  if (!user.services.google && !user.services.facebook && !user.services.vk) {
    for (let i = 0; i < spamEmails.length; i++) {
      if (options.email) {
        if (options.email.indexOf(spamEmails[i]) > -1) {
          throw new Meteor.Error('Отмена регистрации', 'Регистрация с одноразовых почтовых служб недоступна')
        }
      }
    }
  }
  /* if (user.services) {
    const service = Object.keys(user.services)[0]
    const email = user.services[service].email

    // see if any existing user has this email address, otherwise create new
    const existingUser = Users.findOne({'emails.address': email})
    // console.log('existingUser: ', existingUser)
    if (!existingUser) {
      return user
    }

    // precaution, these will exist from accounts-password if used
    /* if (!existingUser.services) {
      existingUser.services = {
        resume: { loginTokens: [] }
      }
    }
    if (!existingUser.services.resume) {
      existingUser.services.resume = {
        loginTokens: []
      }
    }
    // copy across new service info
    existingUser.services[service] = user.services[service]
    existingUser.services.resume.loginTokens.push(
      user.services.resume.loginTokens[0]
    )

    // even worse hackery
    // Users.remove({_id: existingUser._id}); // remove existing record
    // return existingUser                    // record is re-inserted
  } */

  user.profile = {}
  user.profile.image = 'https://cdn.ryfma.com/defaults/icons/default_full_avatar.jpg'
  const profileName = options.profile.name ? options.profile.name.trim() : options.username.trim()
  const splitName = profileName.split(' ')
  user.profile.name = profileName
  user.profile.firstname = splitName[0] || profileName
  user.profile.lastname = splitName[1] || ''
  user.profile.invitedByUserId = options.profile.invitedByUserId || ''
  user.username = getSlug(user.profile.name).toLowerCase()
  const isUsernameExists = Users.findOne({ username: user.username })
  if (isUsernameExists) {
    const newUsername = user.username + '_' + Random.id(6)
    user.username = newUsername.toLowerCase()
  }
  user.stats = {}
  user.settings = {}
  user.coins = 200
  user.roles = ['normal']

  if (user.services.vk) {
    const username = user.services.vk.nickname ? user.services.vk.nickname : `${user.services.vk.first_name} ${user.services.vk.last_name}`
    user.username = getSlug(username).toLowerCase()
    const isUsernameExists = Users.findOne({ username: user.username })
    if (isUsernameExists) {
      const newUsername = user.username + '_' + Random.id(6)
      user.username = newUsername.toLowerCase()
    }
    const email = user.services.vk.email || `${user.username}@ryfma.com`
    const verified = !(email.indexOf('@ryfma.com') > -1)
    let age = 0
    if (user.services.vk.bdate) {
      try {
        const bDate = user.services.vk.bdate ? user.services.vk.bdate.split('.') : ''
        const bDateDate = new Date(bDate[2], bDate[1] - 1, bDate[0])
        const diffYears = (dt2, dt1) => {
          let diff = (dt2.getTime() - dt1.getTime()) / 1000
          diff /= (60 * 60 * 24)
          return Math.abs(Math.round(diff / 365.25))
        }
        age = parseInt(diffYears(new Date(), bDateDate), 10)
      } catch (err) {
        console.log(err)
      }
    }
    user.profile = {
      name: `${user.services.vk.first_name} ${user.services.vk.last_name}`,
      firstname: user.services.vk.first_name,
      lastname: user.services.vk.last_name,
      age: age,
      image: user.services.vk.photo_200 || user.services.vk.photo_big,
      invitedByUserId: options.profile.invitedByUserId || '',
    }
    if (user.services.vk.has_mobile) {
      if (user.services.vk.contacts) {
        user.profile = {
          ...user.profile,
          phone: user.services.vk.contacts.mobile_phone
        }
      }
    }
    if (user.services.vk.city) {
      user.profile = {
        ...user.profile,
        city: user.services.vk.city.title
      }
    }
    if (user.services.vk.nickname) {
      const vkUser = 'https://vk.com/' + user.services.vk.nickname
      user.profile = {
        ...user.profile,
        vkUser
      }
    } else if (user.services.vk.id) {
      const vkUser = 'https://vk.com/id' + user.services.vk.id
      user.profile = {
        ...user.profile,
        vkUser
      }
    }
    user.emails = [{ address: email, verified: verified }]
  } else if (user.services.google) {
    user.username = getSlug(user.services.google.name).toLowerCase()
    const isUsernameExists = Users.findOne({ username: user.username })
    if (isUsernameExists) {
      const newUsername = user.username + '_' + Random.id(6)
      user.username = newUsername.toLowerCase()
    }
    const email = user.services.google.email || `${user.username}@ryfma.com`
    const verified = !(email.indexOf('@ryfma.com') > -1)
    user.profile = {
      name: user.services.google.name,
      firstname: user.services.google.given_name,
      lastname: user.services.google.family_name,
      gender: user.services.google.gender,
      locale: user.services.google.locale,
      image: user.services.google.picture,
      invitedByUserId: options.profile.invitedByUserId || '', // hack
    }
    user.emails = [{ address: email, verified: verified }]
  } else if (user.services.facebook) {
    user.username = getSlug(user.services.facebook.name).toLowerCase()
    const isUsernameExists = Users.findOne({ username: user.username })
    if (isUsernameExists) {
      const newUsername = user.username + '_' + Random.id(6)
      user.username = newUsername.toLowerCase()
    }
    const email = user.services.facebook.email || `${user.username}@ryfma.com`
    const verified = !(email.indexOf('@ryfma.com') > -1)
    user.profile = {
      name: user.services.facebook.name,
      firstname: user.services.facebook.first_name,
      lastname: user.services.facebook.last_name,
      gender: user.services.facebook.gender,
      locale: user.services.facebook.locale,
      image: 'https://graph.facebook.com/' + user.services.facebook.id + '/picture?type=large',
      invitedByUserId: options.profile.invitedByUserId || '',
      facebookUser: 'https://facebook.com/' + user.services.facebook.id,
    }
    user.emails = [{ address: email, verified: verified }]
  }

  if (user.emails) {
    if (user.emails[0]) {
      if (user.emails[0].address.includes('gmail.ru')) {
        const newEmail = user.emails[0].address.replace('gmail.ru', 'gmail.com')
        user.emails[0].address = newEmail
      }
    }
  }

  const clone = cloneDeep(user)
  delete clone._id
  Users.simpleSchema().validate(clone)

  // update Another user
  if (user.profile.invitedByUserId) {
    Users.update(
      { _id: user.profile.invitedByUserId },
      { $inc: { 'profile.invitesCount': 1, coins: 100 } }
    )
  }

  return user
})

// Validate new createduser
Accounts.validateNewUser((user) => {
  // console.log("New user created! ", user)
  if (user._id && !user.emails?.verified) {
    try {
      let campaign = 'email'
      if (user.services.vk) {
        campaign = 'vk'
      } else if (user.services.facebook) {
        campaign = 'facebook'
      } else if (user.services.google) {
        campaign = 'google'
      }
      // console.log("Send Welcome email!")
      REmail.buildAndSend({
        vars: {
          userId: user._id,
          user: user,
          url: `https://ryfma.com/login?utm_source=email&utm_medium=registration&utm_campaign=${campaign}&utm_content=button`,
          title: `Вперед!`,
          emailType: 'welcome',
          emailPreview: `🎉Поздравляем с регистрацией на Ryfma!`
        },
        template: 'welcome',
        to: [user.emails[0].address]
      })

      if (campaign === 'email') {
        Meteor.setTimeout(() => {
          // console.log("Send verification email! ")
          Accounts.sendVerificationEmail(user._id)
        }, 10 * 1000)
      }
    } catch (err) {
      console.log()
    }
  }
  return true
})
