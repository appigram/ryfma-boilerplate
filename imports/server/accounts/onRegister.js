import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import cloneDeep from 'lodash.clonedeep'
import Users from '../../api/collections/Users'

import getSlug from 'speakingurl'

Accounts.onCreateUser(function (options, user = {}) {
  // console.log(options);
  // console.log(user);
  user.profile = {}
  user.profile.image = 'https://cdnryfma.s3.amazonaws.com/defaults/icons/default_full_avatar.jpg'
  user.profile.name = options.profile.name ? options.profile.name.trim() : options.username.trim()
  user.profile.firstname = user.profile.name.substr(0, user.profile.name.indexOf(' '))
  user.profile.invitedByUserId = user.profile.name
  user.username = getSlug(user.profile.name)
  user.stats = {}
  user.settings = {}
  user.roles = ['normal']

  if (user.services.google) {
    user.username = getSlug(user.services.google.name)
    user.profile = {
      name: user.services.google.name,
      firstname: user.services.google.givenName,
      lastname: user.services.google.familyName,
      gender: user.services.google.gender,
      locale: user.services.google.locale,
      image: user.services.google.imageUrl,
      invitedByUserId: options.profile.name // hack
    }
    user.emails = [{ address: user.services.google.email, verified: true }]
  }

  if (user.services.facebook) {
    user.username = getSlug(user.services.facebook.name)
    user.profile = {
      name: user.services.facebook.name,
      firstname: user.services.facebook.first_name,
      lastname: user.services.facebook.last_name,
      gender: user.services.facebook.gender,
      locale: user.services.facebook.locale,
      image: 'https://graph.facebook.com/' + user.services.facebook.id + '/picture?type=large',
      invitedByUserId: options.profile.name // hack
    }
    user.emails = [{ address: user.services.facebook.email, verified: true }]
  }

  if (user.services.vk) {
    const username = user.services.vk.nickname ? user.services.vk.nickname : `${user.services.vk.first_name} ${user.services.vk.last_name}`
    user.username = getSlug(username)
    user.profile = {
      name: `${user.services.vk.first_name} ${user.services.vk.last_name}`,
      firstname: user.services.vk.first_name,
      lastname: user.services.vk.last_name,
      image: user.services.vk.photo_big,
      invitedByUserId: options.profile.name // hack
    }
    user.emails = [{ address: user.services.vk.email, verified: true }]
  }

  const clone = cloneDeep(user)
  delete clone._id
  Users.simpleSchema().validate(clone)

  if ((user.emails.length !== -1) && (!user.emails[0].verified)) {
    Meteor.setTimeout(function () {
      Accounts.sendVerificationEmail(user._id)
    }, 2 * 1000)
  }

  // update Another user
  if (user.profile.invitedByUserId) {
    Meteor.users.update(
      { _id: user.profile.invitedByUserId },
      { $inc: { 'profile.invitesCount': 1 } }
    )
  }

  return user
})
